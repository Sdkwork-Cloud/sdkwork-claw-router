import { formatDecimalAmount, sumDecimalStrings } from 'sdkwork-claw-router-commons/runtime';
import type { BillingRecord, TransactionRecord } from './financeService';

export type FinanceReportTab = 'transactions' | 'billing';

export type FinanceOverviewCard = {
  title: string;
  value: string;
  target: string;
  tone: 'recharge' | 'consume' | 'refund' | 'billing';
};

export type FinanceTranslator = (key: string, fallback: string, options?: Record<string, unknown>) => string;

export function buildFinanceOverviewCards(
  transactions: TransactionRecord[],
  billing: BillingRecord[],
  t: FinanceTranslator,
  today = new Date().toISOString().slice(0, 10),
): FinanceOverviewCard[] {
  const currentMonth = today.slice(0, 7);
  const todayRecharges = transactions.filter(
    transaction => transaction.type === 'recharge'
      && transaction.status === 'success'
      && transaction.time.startsWith(today),
  );
  const monthlyConsumes = transactions.filter(
    transaction => transaction.type === 'consume'
      && transaction.time.startsWith(currentMonth),
  );
  const todayRefunds = transactions.filter(
    transaction => transaction.type === 'refund'
      && transaction.time.startsWith(today),
  );
  const pendingBilling = billing.filter(record => record.status !== 'paid');

  return [
    {
      title: t('admin.finance.overview.todayRecharge.title', '今日充值总计'),
      value: formatCurrency(sumDecimalStrings(todayRecharges.map(transaction => transaction.amount), 6)),
      target: t('admin.finance.overview.todayRecharge.target', '{{count}} 笔成功充值', { count: todayRecharges.length }),
      tone: 'recharge',
    },
    {
      title: t('admin.finance.overview.monthlyConsumption.title', '本月消费总计'),
      value: formatCurrency(absDecimalString(sumDecimalStrings(monthlyConsumes.map(transaction => transaction.amount), 6))),
      target: t('admin.finance.overview.monthlyConsumption.target', '{{count}} 笔消费流水', { count: monthlyConsumes.length }),
      tone: 'consume',
    },
    {
      title: t('admin.finance.overview.todayRefund.title', '今日退款'),
      value: formatCurrency(absDecimalString(sumDecimalStrings(todayRefunds.map(transaction => transaction.amount), 6))),
      target: t('admin.finance.overview.todayRefund.target', '{{count}} 笔退款流水', { count: todayRefunds.length }),
      tone: 'refund',
    },
    {
      title: t('admin.finance.overview.pendingBilling.title', '待结算账单'),
      value: t('admin.finance.overview.pendingBilling.value', '{{count}} 笔', { count: pendingBilling.length }),
      target: t('admin.finance.overview.pendingBilling.target', '{{amount}} 待处理', {
        amount: formatCurrency(sumDecimalStrings(pendingBilling.map(record => record.totalCost), 6)),
      }),
      tone: 'billing',
    },
  ];
}

export function buildFinanceReportCsv(
  rows: TransactionRecord[] | BillingRecord[],
  tab: FinanceReportTab,
): string {
  if (tab === 'transactions') {
    return [
      csvLine(['id', 'time', 'userId', 'type', 'amount', 'balance', 'status', 'description']),
      ...(rows as TransactionRecord[]).map(transaction => csvLine([
        transaction.id,
        transaction.time,
        transaction.userId,
        transaction.type,
        transaction.amount,
        transaction.balance,
        transaction.status,
        transaction.description,
      ])),
    ].join('\n');
  }

  return [
    csvLine(['id', 'period', 'userId', 'totalTokens', 'totalCost', 'status', 'dueDate']),
    ...(rows as BillingRecord[]).map(record => csvLine([
      record.id,
      record.period,
      record.userId,
      String(record.totalTokens),
      record.totalCost,
      record.status,
      record.dueDate,
    ])),
  ].join('\n');
}

export function moneyCents(amount: string): string {
  return formatDecimalAmount(amount, 6);
}

export function formatCurrency(amount: string): string {
  const normalized = formatDecimalAmount(amount, 6);
  const sign = normalized.startsWith('-') ? '-' : '';
  const unsigned = sign ? normalized.slice(1) : normalized;
  const [whole, fraction = ''] = unsigned.split('.');
  return `${sign}$${groupThousands(whole)}.${fraction.padEnd(6, '0').slice(0, 6)}`;
}

function absDecimalString(value: string): string {
  return value.startsWith('-') ? value.slice(1) : value;
}

function groupThousands(value: string): string {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function csvLine(values: string[]): string {
  return values.map(csvValue).join(',');
}

function csvValue(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
