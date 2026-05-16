import { sumDecimalStrings } from 'sdkwork-claw-router-commons/runtime';
import type { Bill, SettlementChartData } from './settlementsService';

const DEFAULT_SETTLEMENT_YEAR_SPAN = 5;

type BuildSettlementYearOptionsInput = {
  selectedYear: string;
  referenceDate?: Date;
  bills?: Bill[];
};

type BuildSettlementSummaryInput = {
  selectedYear: string;
  referenceDate?: Date;
  chartData: SettlementChartData[];
  bills: Bill[];
};

export type SettlementSummary = {
  annualTotalCost: string;
  currentMonthUnbilledCost: string;
  nextSettlementDate: string;
  billCount: number;
  supportsYearOverYearComparison: boolean;
};

export function getDefaultSettlementYear(referenceDate: Date = new Date()): string {
  return String(referenceDate.getFullYear());
}

export function buildSettlementYearOptions({
  selectedYear,
  referenceDate = new Date(),
  bills = [],
}: BuildSettlementYearOptionsInput): string[] {
  const currentYear = referenceDate.getFullYear();
  const years = new Set<string>();
  for (let year = currentYear; year > currentYear - DEFAULT_SETTLEMENT_YEAR_SPAN; year -= 1) {
    years.add(String(year));
  }
  const selected = selectedYear.trim();
  if (selected) {
    years.add(selected);
  }
  for (const bill of bills) {
    const year = settlementYearFromBill(bill);
    if (year) {
      years.add(year);
    }
  }
  return [...years].sort((left, right) => Number(right) - Number(left));
}

export function buildSettlementSummary({
  selectedYear,
  referenceDate = new Date(),
  chartData,
  bills,
}: BuildSettlementSummaryInput): SettlementSummary {
  return {
    annualTotalCost: sumDecimalStrings(bills.map(bill => bill.totalCost), 6),
    currentMonthUnbilledCost: sumDecimalStrings(
      currentMonthChartRows(chartData, selectedYear, referenceDate)
        .flatMap(item => [item.text, item.image, item.video, item.audio, item.music]),
      6,
    ),
    nextSettlementDate: bills[0]?.endDate ? `${bills[0].endDate} 00:00:00` : '-',
    billCount: bills.length,
    supportsYearOverYearComparison: false,
  };
}

function currentMonthChartRows(
  chartData: SettlementChartData[],
  selectedYear: string,
  referenceDate: Date,
): SettlementChartData[] {
  const currentYear = String(referenceDate.getFullYear());
  if (selectedYear !== currentYear) {
    return [];
  }
  const currentMonthPrefix = `${currentYear}-${String(referenceDate.getMonth() + 1).padStart(2, '0')}-`;
  return chartData.filter(item => item.day.startsWith(currentMonthPrefix));
}

function settlementYearFromBill(bill: Bill): string | null {
  return yearPrefix(bill.period) ?? yearPrefix(bill.startDate) ?? yearPrefix(bill.endDate);
}

function yearPrefix(value: string): string | null {
  const match = value.trim().match(/^(\d{4})/);
  return match ? match[1] : null;
}
