import type { BillingRecord, TransactionRecord } from './financeService';

export type FinanceReportTab = 'transactions' | 'billing';

export type FinanceOverviewCard = {
  title: string;
  value: string;
  target: string;
  tone: 'recharge' | 'consume' | 'refund' | 'billing';
};

export function buildFinanceOverviewCards(
  transactions: TransactionRecord[],
  billing: BillingRecord[],
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
      title: '今日充值总计',
      value: formatCurrencyFromCents(sumMoney(todayRecharges.map(transaction => transaction.amount))),
      target: `${todayRecharges.length} 笔成功充值`,
      tone: 'recharge',
    },
    {
      title: '本月消费总计',
      value: formatCurrencyFromCents(absCents(sumMoney(monthlyConsumes.map(transaction => transaction.amount)))),
      target: `${monthlyConsumes.length} 笔消费流水`,
      tone: 'consume',
    },
    {
      title: '今日退款',
      value: formatCurrencyFromCents(absCents(sumMoney(todayRefunds.map(transaction => transaction.amount)))),
      target: `${todayRefunds.length} 笔退款流水`,
      tone: 'refund',
    },
    {
      title: '待结算账单',
      value: `${pendingBilling.length} 笔`,
      target: `${formatCurrencyFromCents(sumMoney(pendingBilling.map(record => record.totalCost)))} 待处理`,
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

export function moneyCents(amount: string): number {
  const value = amount.trim();
  if (!/^-?\d+(?:\.\d{1,2})?$/.test(value)) {
    return 0;
  }
  const sign = value.startsWith('-') ? -1 : 1;
  const unsigned = sign < 0 ? value.slice(1) : value;
  const [whole, fraction = ''] = unsigned.split('.');
  const cents = Number.parseInt(whole, 10) * 100 + Number.parseInt(fraction.padEnd(2, '0'), 10);
  return Number.isSafeInteger(cents) ? sign * cents : 0;
}

export function formatCurrency(amount: string): string {
  return formatCurrencyFromCents(moneyCents(amount));
}

function sumMoney(values: string[]): number {
  return values.reduce((total, value) => total + moneyCents(value), 0);
}

function absCents(cents: number): number {
  return Math.abs(cents);
}

function formatCurrencyFromCents(cents: number): string {
  const sign = cents < 0 ? '-' : '';
  const absolute = Math.abs(cents);
  const whole = Math.floor(absolute / 100);
  const fraction = String(absolute % 100).padStart(2, '0');
  return `${sign}$${groupThousands(String(whole))}.${fraction}`;
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
