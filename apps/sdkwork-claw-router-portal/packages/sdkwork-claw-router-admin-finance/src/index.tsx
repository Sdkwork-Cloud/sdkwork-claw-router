import React, { useState, useEffect } from 'react';
import { BusinessStateTableRow } from 'sdkwork-claw-router-commons';
import {
  DollarSign, Search, CreditCard, Download, ArrowUpRight, ArrowDownRight,
  Activity, Calendar, ChevronLeft, ChevronRight, FileText,
  CheckCircle2, AlertCircle
} from 'lucide-react';
import { FinanceService, TransactionRecord, BillingRecord } from './financeService';
import { buildFinanceOverviewCards, buildFinanceReportCsv, formatCurrency as formatFinanceCurrency, moneyCents } from './financeViewModel';

import { useTranslation } from 'react-i18next';

const formatCurrency = (amount: string) => formatFinanceCurrency(amount);

export function FinanceAdmin() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'transactions' | 'billing'>('transactions');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [billing, setBilling] = useState<BillingRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const loadFinance = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [txnData, billData] = await Promise.all([
        FinanceService.fetchTransactions(),
        FinanceService.fetchBilling(),
      ]);
      setTransactions(txnData);
      setBilling(billData);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : t('admin.finance.errors.loadFallback', '财务数据加载失败'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFinance();
  }, []);

  const filteredTransactions = transactions.filter(t =>
    t.userId.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  const filteredBilling = billing.filter(b =>
    b.userId.toLowerCase().includes(search.toLowerCase()) ||
    b.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = activeTab === 'transactions' ? filteredTransactions.length : filteredBilling.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search]);

  useEffect(() => {
    setCurrentPage(page => Math.min(page, totalPages));
  }, [totalPages]);

  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const paginatedBilling = filteredBilling.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const overviewCards = buildFinanceOverviewCards(transactions, billing, t);

  const exportCurrentReport = () => {
    const csv = buildFinanceReportCsv(activeTab === 'transactions' ? filteredTransactions : filteredBilling, activeTab);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finance-${activeTab}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
            <DollarSign className="w-6 h-6 text-emerald-500" />
            {t("admin.finance.index.text.1nmeq8g", "财务中心")}</h2>
          <p className="text-sm text-slate-500">{t("admin.finance.index.text.8n3gd2", "统一管理用户充值、退款、消费流水及账单结算。")}</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t("admin.finance.index.text.4arso2", "搜索用户ID或描述...")}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500 w-full sm:w-64 text-slate-900 dark:text-white placeholder-slate-500 transition-colors shadow-sm"
            />
          </div>
          <button
            onClick={exportCurrentReport}
            disabled={totalItems === 0}
            className="bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{t("admin.finance.index.text.1lr4vtq", "导出报表")}</span>
          </button>
        </div>
      </div>

       {/* Overview Cards */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {overviewCards.map((stat, i) => {
          const presentation = financeOverviewPresentation[stat.tone];
          return (
          <div key={i} className="bg-white dark:bg-[#1a1a1a] p-5 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <div className="mt-1">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
              <p className={`text-xs mt-1 ${presentation.targetColor}`}>{stat.target}</p>
            </div>
            <div className={`p-3 rounded-lg ${presentation.bg} ${presentation.color}`}>
              <presentation.icon className="w-6 h-6" />
            </div>
          </div>
        )})}
      </div>

      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'transactions'
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {t("admin.finance.index.text.nkyb2b", "资金流水")}</button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'billing'
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {t("admin.finance.index.text.ee2ihy", "账单结算")}</button>
      </div>

      <div className="flex-1 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {activeTab === 'transactions' ? (
          <>
            <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <h3 className="font-medium text-slate-900 dark:text-white">{t("admin.finance.index.text.t5e9l7", "最近交易明细")}</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">{t("admin.finance.index.text.1haei81", "搜索框会筛选当前流水列表")}</span>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-[#121212] sticky top-0 border-b border-slate-200 dark:border-white/10 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="px-6 py-4">{t("admin.finance.index.text.2t7psy", "交易时间")}</th>
                    <th className="px-6 py-4">{t("admin.finance.index.text.3jrccd", "用户 ID")}</th>
                    <th className="px-6 py-4">{t("admin.finance.index.text.1o3ub0e", "交易类型")}</th>
                    <th className="px-6 py-4 text-right">{t("admin.finance.index.text.1jl9r8z", "金额")}</th>
                    <th className="px-6 py-4">{t("admin.finance.index.text.1vbxvzf", "余额")}</th>
                    <th className="px-6 py-4">{t("admin.finance.index.text.1kxyax6", "描述")}</th>
                    <th className="px-6 py-4">{t("admin.finance.index.text.1ccx4t4", "状态")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                  {loading ? (
                    <BusinessStateTableRow colSpan={7} kind="loading" title={t('admin.finance.states.transactionsLoading', '交易流水加载中...')} />
                  ) : loadError ? (
                    <BusinessStateTableRow
                      colSpan={7}
                      kind="error"
                      title={t('admin.finance.states.transactionsLoadError', '交易流水加载失败')}
                      description={loadError}
                      onRetry={() => { void loadFinance(); }}
                      retryLabel={t('common.retry', '重试')}
                    />
                  ) : paginatedTransactions.length === 0 ? (
                    <BusinessStateTableRow
                      colSpan={7}
                      kind="empty"
                      title={t('admin.finance.states.noTransactions', '暂无交易流水')}
                      description={t('admin.finance.states.noTransactionsDescription', '调整搜索条件，或等待充值、退款、用量结算记录生成。')}
                    />
                  ) : paginatedTransactions.map(transaction => (
                    <tr key={transaction.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{transaction.time}</td>
                      <td className="px-6 py-4 font-mono text-xs text-blue-600 dark:text-blue-400">{transaction.userId}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${transaction.type === 'recharge' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : transaction.type === 'refund' ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400'}`}>
                          {transaction.type === 'recharge' ? t("admin.finance.index.text.10c9xpw", "充值") : transaction.type === 'refund' ? t("admin.finance.index.text.1chn46r", "退款") : t("admin.finance.index.text.1rqusju", "消费")}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-right font-medium font-mono ${isPositiveTransactionAmount(transaction) ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                        {isPositiveTransactionAmount(transaction) ? '+' : ''}{formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 font-mono">{formatCurrency(transaction.balance)}</td>
                      <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{transaction.description}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-medium"><CheckCircle2 className="w-3.5 h-3.5"/> {t("admin.finance.index.text.1rraohc", "成功")}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#121212] flex items-center justify-between">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {t("admin.finance.index.text.1vsm2qk", "共")}<span className="font-medium text-slate-900 dark:text-white">{totalItems}</span> {t("admin.finance.index.text.1gt1nkp", "条流水")}</div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {t("admin.finance.index.text.biig97", "第")}{currentPage} {t("admin.finance.index.text.1ucfmkw", "页")}<span className="text-slate-400 dark:text-slate-500 font-normal">{t("admin.finance.index.text.1vdpokx", "/ 共")}{totalPages} {t("admin.finance.index.text.1ucfmkw", "页")}</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 dark:text-slate-400 dark:hover:text-emerald-400 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 dark:text-slate-400 dark:hover:text-emerald-400 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <h3 className="font-medium text-slate-900 dark:text-white">{t("admin.finance.index.text.6x85k5", "用户账单")}</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">{t("admin.finance.index.text.cnvpll", "搜索框会筛选当前账单列表")}</span>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-[#121212] sticky top-0 border-b border-slate-200 dark:border-white/10 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="px-6 py-4">{t("admin.finance.index.text.15zbm37", "账单编号")}</th>
                    <th className="px-6 py-4">{t("admin.finance.index.text.5s2nc1", "账单周期")}</th>
                    <th className="px-6 py-4">{t("admin.finance.index.text.3jrccd", "用户 ID")}</th>
                    <th className="px-6 py-4">{t("admin.finance.index.text.13tbcqa", "消耗 Tokens")}</th>
                    <th className="px-6 py-4 text-right">{t("admin.finance.index.text.byap0k", "总金额")}</th>
                    <th className="px-6 py-4">{t("admin.finance.index.text.z5irr4", "结算期限")}</th>
                    <th className="px-6 py-4">{t("admin.finance.index.text.1ccx4t4", "状态")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                  {loading ? (
                    <BusinessStateTableRow colSpan={7} kind="loading" title={t('admin.finance.states.billingLoading', '账单记录加载中...')} />
                  ) : loadError ? (
                    <BusinessStateTableRow
                      colSpan={7}
                      kind="error"
                      title={t('admin.finance.states.billingLoadError', '账单记录加载失败')}
                      description={loadError}
                      onRetry={() => { void loadFinance(); }}
                      retryLabel={t('common.retry', '重试')}
                    />
                  ) : paginatedBilling.length === 0 ? (
                    <BusinessStateTableRow
                      colSpan={7}
                      kind="empty"
                      title={t('admin.finance.states.noBillingRecords', '暂无账单记录')}
                      description={t('admin.finance.states.noBillingRecordsDescription', '调整搜索条件，或等待账单周期记录生成。')}
                    />
                  ) : paginatedBilling.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{b.id}</td>
                      <td className="px-6 py-4 font-mono text-xs">{b.period}</td>
                      <td className="px-6 py-4 font-mono text-xs text-blue-600 dark:text-blue-400">{b.userId}</td>
                      <td className="px-6 py-4 font-mono">{b.totalTokens.toLocaleString()}</td>
                      <td className={`px-6 py-4 text-right font-medium font-mono text-slate-900 dark:text-white`}>
                        {formatCurrency(b.totalCost)}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">{b.dueDate}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${b.status === 'paid' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : b.status === 'unpaid' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'}`}>
                          {b.status === 'paid' ? t("admin.finance.index.text.1wu2z9", "已结清") : b.status === 'unpaid' ? t("admin.finance.index.text.196d3dm", "待结算") : t("admin.finance.index.text.1kvat0q", "已逾期")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#121212] flex items-center justify-between">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {t("admin.finance.index.text.1vsm2qk", "共")}<span className="font-medium text-slate-900 dark:text-white">{totalItems}</span> {t("admin.finance.index.text.kk6b5", "条账单")}</div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {t("admin.finance.index.text.biig97", "第")}{currentPage} {t("admin.finance.index.text.1ucfmkw", "页")}<span className="text-slate-400 dark:text-slate-500 font-normal">{t("admin.finance.index.text.1vdpokx", "/ 共")}{totalPages} {t("admin.finance.index.text.1ucfmkw", "页")}</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 dark:text-slate-400 dark:hover:text-emerald-400 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 dark:text-slate-400 dark:hover:text-emerald-400 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function isPositiveMoney(amount: string): boolean {
  return !moneyCents(amount).startsWith('-') && moneyCents(amount) !== '0.000000';
}

function isPositiveTransactionAmount(t: TransactionRecord): boolean {
  return isPositiveMoney(t.amount);
}

const financeOverviewPresentation = {
  recharge: {
    icon: ArrowUpRight,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    targetColor: 'text-emerald-500',
  },
  consume: {
    icon: Activity,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    targetColor: 'text-blue-500',
  },
  refund: {
    icon: ArrowDownRight,
    color: 'text-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    targetColor: 'text-rose-500',
  },
  billing: {
    icon: FileText,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    targetColor: 'text-amber-500',
  },
} as const;
