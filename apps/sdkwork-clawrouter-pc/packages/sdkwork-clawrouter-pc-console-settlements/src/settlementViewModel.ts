import { sumDecimalStrings } from 'sdkwork-clawrouter-pc-commons/runtime';
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

export type SettlementDisplayData = {
  chartData: SettlementChartData[];
  bills: Bill[];
  summary: SettlementSummary;
  isUsingDefaultVisuals: boolean;
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

export function buildSettlementDisplayData({
  selectedYear,
  referenceDate = new Date(),
  chartData,
  bills,
}: BuildSettlementSummaryInput): SettlementDisplayData {
  const summary = buildSettlementSummary({
    selectedYear,
    referenceDate,
    chartData,
    bills,
  });
  const isUsingDefaultVisuals = chartData.length === 0 && bills.length === 0;
  if (!isUsingDefaultVisuals) {
    return {
      bills,
      chartData,
      isUsingDefaultVisuals,
      summary,
    };
  }

  return {
    bills: [buildDefaultSettlementBill(selectedYear, referenceDate)],
    chartData: buildDefaultSettlementChartData(selectedYear, referenceDate),
    isUsingDefaultVisuals,
    summary,
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

function buildDefaultSettlementChartData(selectedYear: string, referenceDate: Date): SettlementChartData[] {
  const month = defaultSettlementMonth(selectedYear, referenceDate);
  const daysInMonth = new Date(Number(selectedYear), Number(month), 0).getDate();
  const dayNumbers = [1, 5, 9, 13, 17, 21, 25, daysInMonth]
    .filter((day, index, values) => day <= daysInMonth && values.indexOf(day) === index);

  return dayNumbers.map((day, index) => ({
    day: `${selectedYear}-${month}-${String(day).padStart(2, '0')}`,
    text: formatDefaultVisualAmount(12 + index * 2),
    image: formatDefaultVisualAmount(index % 3 === 0 ? 3 : 1 + index),
    video: formatDefaultVisualAmount(index % 4 === 0 ? 2 : index % 2),
    audio: formatDefaultVisualAmount(index % 2 === 0 ? 1.5 : 0.5),
    music: formatDefaultVisualAmount(index % 3 === 1 ? 1 : 0.25),
  }));
}

function buildDefaultSettlementBill(selectedYear: string, referenceDate: Date): Bill {
  const month = defaultSettlementMonth(selectedYear, referenceDate);
  const period = `${selectedYear}-${month}`;
  const daysInMonth = new Date(Number(selectedYear), Number(month), 0).getDate();
  const emptyItem = (usage: string): Bill['breakdown']['text'] => ({
    cost: '0.000000',
    usage,
    models: [],
  });

  return {
    id: `DEFAULT-SETTLEMENT-${period}`,
    period,
    startDate: `${period}-01`,
    endDate: `${period}-${String(daysInMonth).padStart(2, '0')}`,
    totalTokens: '0',
    totalCost: '0.000000',
    status: 'preview',
    breakdown: {
      text: emptyItem('0 requests'),
      image: emptyItem('0 images'),
      video: emptyItem('0 videos'),
      audio: emptyItem('0 minutes'),
      music: emptyItem('0 minutes'),
    },
  };
}

function defaultSettlementMonth(selectedYear: string, referenceDate: Date): string {
  const referenceYear = String(referenceDate.getFullYear());
  const month = selectedYear === referenceYear ? referenceDate.getMonth() + 1 : 12;
  return String(month).padStart(2, '0');
}

function formatDefaultVisualAmount(value: number): string {
  return value.toFixed(6);
}

function settlementYearFromBill(bill: Bill): string | null {
  return yearPrefix(bill.period) ?? yearPrefix(bill.startDate) ?? yearPrefix(bill.endDate);
}

function yearPrefix(value: string): string | null {
  const match = value.trim().match(/^(\d{4})/);
  return match ? match[1] : null;
}
