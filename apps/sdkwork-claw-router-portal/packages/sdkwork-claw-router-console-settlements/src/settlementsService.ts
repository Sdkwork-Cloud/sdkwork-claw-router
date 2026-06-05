import {
  getClawRouterAppSdkClient,
  createIdempotencyParams,
  createClientOperationToken,
  isRecord,
  readRequiredApiItems,
  readString,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';

export interface SettlementChartData {
  day: string;
  text: string;
  image: string;
  video: string;
  audio: string;
  music: string;
}

export interface BillBreakdownItem {
  cost: string;
  usage: string;
  models: string[];
}

export interface Bill {
  id: string;
  period: string;
  startDate: string;
  endDate: string;
  totalTokens: string;
  totalCost: string;
  status: string;
  breakdown: {
    text: BillBreakdownItem;
    image: BillBreakdownItem;
    video: BillBreakdownItem;
    audio: BillBreakdownItem;
    music: BillBreakdownItem;
  };
}

type SettlementUsageBucket = 'text' | 'image' | 'video' | 'audio' | 'music';

const MIN_SETTLEMENT_DASHBOARD_YEAR = 2000;
const MAX_SETTLEMENT_DASHBOARD_YEAR = 2100;
const SETTLEMENT_LEDGER_PAGE_SIZE = 200;
const SETTLEMENT_INVOICE_PAGE_SIZE = 100;

export class SettlementsService {
  static async fetchDashboardData(params?: { year?: string | number }): Promise<{
    chartData: SettlementChartData[];
    bills: Bill[];
  }> {
    const query = toSettlementDashboardQueryParams(params);
    const [ledgerResult, invoiceResult] = await Promise.all([
      appWalletLedgerEntriesList({ page: '1', pageSize: String(SETTLEMENT_LEDGER_PAGE_SIZE) }),
      appInvoicesList({ page: '1', pageSize: String(SETTLEMENT_INVOICE_PAGE_SIZE) }),
    ]);
    const ledgerEntries = readRequiredApiItems(ledgerResult, 'Settlement ledger entries are required')
      .map((item) => readRequiredRecord(item, 'Settlement ledger entry is required'));
    const invoices = readRequiredApiItems(invoiceResult, 'Settlement invoice records are required')
      .map((item) => readRequiredRecord(item, 'Settlement invoice record is required'));
    return buildSettlementDashboard(query.year, ledgerEntries, invoices);
  }
}

function toSettlementDashboardQueryParams(params?: { year?: string | number }): { year: string } {
  const currentYear = boundedSettlementYear(new Date().getFullYear());
  const rawYear = params?.year;
  if (rawYear === undefined || rawYear === null || rawYear === '') {
    return { year: String(currentYear) };
  }
  const parsedYear = typeof rawYear === 'number'
    ? rawYear
    : Number.parseInt(String(rawYear).trim(), 10);
  return { year: String(boundedSettlementYear(parsedYear)) };
}

function boundedSettlementYear(value: number): number {
  if (!Number.isFinite(value)) {
    return boundedSettlementYear(new Date().getFullYear());
  }
  const year = Math.trunc(value);
  return Math.min(MAX_SETTLEMENT_DASHBOARD_YEAR, Math.max(MIN_SETTLEMENT_DASHBOARD_YEAR, year));
}

type AppCommerce = ReturnType<typeof getClawRouterAppSdkClient>['commerce'];

export async function appInvoicesList(params?: Parameters<AppCommerce['invoices']['list']>[0]) {
  return getClawRouterAppSdkClient().commerce.invoices.list(params);
}

export async function appInvoicesRetrieve(invoiceId: string) {
  return getClawRouterAppSdkClient().commerce.invoices.retrieve(invoiceId);
}

export async function appInvoicesCreate(body: Parameters<AppCommerce['invoices']['create']>[0]) {
  return getClawRouterAppSdkClient().commerce.invoices.create(body, createIdempotencyParams('app-invoice-create'));
}

export async function appWalletLedgerEntriesList(params?: Parameters<AppCommerce['wallet']['ledgerEntries']['list']>[0]) {
  return getClawRouterAppSdkClient().commerce.wallet.ledgerEntries.list(params);
}

export async function fetchSettlementDashboard(params?: { year?: string | number }) {
  return SettlementsService.fetchDashboardData(params);
}

function buildSettlementDashboard(year: string, ledgerEntries: ApiRecord[], invoices: ApiRecord[]) {
  const chartByDay = new Map<string, SettlementChartData>();
  for (const entry of ledgerEntries) {
    const day = (readFirstString(entry, ['date', 'createdAt', 'created_at']) || `${year}-01-01`).slice(0, 10);
    if (!day.startsWith(year)) {
      continue;
    }
    const row = chartByDay.get(day) ?? {
      day,
      text: '0.000000',
      image: '0.000000',
      video: '0.000000',
      audio: '0.000000',
      music: '0.000000',
    };
    const amount = absDecimal(readFirstString(entry, ['amount', 'amountDelta', 'amount_delta']) || '0');
    const bucket = settlementBucket(entry);
    row[bucket] = sumMoney(row[bucket], amount);
    chartByDay.set(day, row);
  }
  const bills = invoices
    .map((invoice) => normalizeSettlementBill(invoice))
    .filter((bill) => bill.startDate.startsWith(year) || bill.period.startsWith(year) || bill.endDate.startsWith(year));
  if (bills.length === 0 && ledgerEntries.length > 0) {
    bills.push(buildLedgerFallbackBill(year, ledgerEntries));
  }
  return {
    chartData: [...chartByDay.values()].sort((left, right) => left.day.localeCompare(right.day)),
    bills,
  };
}

function settlementBucket(entry: ApiRecord): SettlementUsageBucket {
  const text = `${readFirstString(entry, ['sourceType', 'source_type', 'description', 'remark'])}`.toLowerCase();
  if (text.includes('image')) return 'image';
  if (text.includes('video')) return 'video';
  if (text.includes('audio') || text.includes('voice')) return 'audio';
  if (text.includes('music')) return 'music';
  return 'text';
}

function normalizeSettlementBill(invoice: ApiRecord): Bill {
  const id = readFirstString(invoice, ['invoiceNo', 'invoice_no', 'id']) || createClientOperationToken('invoice');
  const createdAt = readFirstString(invoice, ['createdAt', 'created_at', 'issuedAt', 'issued_at']) || new Date().toISOString().slice(0, 10);
  const amount = readFirstString(invoice, ['invoiceAmount', 'invoice_amount', 'amount', 'totalAmount', 'total_amount']) || '0';
  const normalizedAmount = formatDecimalString(amount, 6);
  return {
    id,
    period: readFirstString(invoice, ['period']) || createdAt.slice(0, 7),
    startDate: readFirstString(invoice, ['startDate', 'start_date']) || `${createdAt.slice(0, 7)}-01`,
    endDate: readFirstString(invoice, ['endDate', 'end_date']) || createdAt.slice(0, 10),
    totalTokens: readFirstString(invoice, ['totalTokens', 'total_tokens']) || '0',
    totalCost: normalizedAmount,
    status: readFirstString(invoice, ['status']) || 'pending',
    breakdown: emptyBreakdown(normalizedAmount),
  };
}

function buildLedgerFallbackBill(year: string, ledgerEntries: ApiRecord[]): Bill {
  const totalCost = ledgerEntries
    .map((entry) => absDecimal(readFirstString(entry, ['amount', 'amountDelta', 'amount_delta']) || '0'))
    .reduce((total, amount) => sumMoney(total, amount), '0.000000');
  return {
    id: `BILL-${year}`,
    period: `${year} Annual`,
    startDate: `${year}-01-01`,
    endDate: `${year}-12-31`,
    totalTokens: '0',
    totalCost,
    status: 'pending',
    breakdown: emptyBreakdown(totalCost),
  };
}

function emptyBreakdown(totalCost = '0.000000'): Bill['breakdown'] {
  const empty = (cost: string): BillBreakdownItem => ({
    cost,
    usage: '-',
    models: [],
  });
  return {
    text: empty(totalCost),
    image: empty('0.000000'),
    video: empty('0.000000'),
    audio: empty('0.000000'),
    music: empty('0.000000'),
  };
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}

function readFirstString(item: ApiRecord, keys: readonly string[]): string {
  for (const key of keys) {
    const value = readString(item, key).trim();
    if (value) {
      return value;
    }
  }
  return '';
}

function absDecimal(value: string): string {
  const normalized = formatDecimalString(value, 6);
  return normalized.startsWith('-') ? normalized.slice(1) : normalized;
}

function sumMoney(left: string, right: string): string {
  return (Number(left) + Number(right)).toFixed(6);
}

function formatDecimalString(value: string, digits: number): string {
  const normalized = value.trim().replace(/,/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed.toFixed(digits) : (0).toFixed(digits);
}
