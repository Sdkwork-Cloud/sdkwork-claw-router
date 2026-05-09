import React, { useState, useEffect } from 'react';
import { BusinessStateTableRow } from 'sdkwork-claw-router-commons';
import {
  DollarSign, Search, CreditCard, Download, ArrowUpRight, ArrowDownRight,
  Activity, Calendar, Filter, ChevronLeft, ChevronRight, FileText,
  CheckCircle2, AlertCircle
} from 'lucide-react';
import { FinanceService, TransactionRecord, BillingRecord } from './financeService';

export function FinanceAdmin() {
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
      setLoadError(error instanceof Error ? error.message : 'Failed to load finance records');
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

  const formatCurrency = (amount: string) => {
    const value = formatMoneyAmount(amount);
    const sign = value.startsWith('-') ? '-' : '';
    const unsigned = sign ? value.slice(1) : value;
    const [whole, fraction = '00'] = unsigned.split('.');
    return `${sign}$${groupThousands(whole)}.${fraction}`;
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
            <DollarSign className="w-6 h-6 text-emerald-500" />
            财务中心
          </h2>
          <p className="text-sm text-slate-500">统一管理用户充值、退款、消费流水及账单结算。</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索用户ID或描述..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500 w-full sm:w-64 text-slate-900 dark:text-white placeholder-slate-500 transition-colors shadow-sm"
            />
          </div>
          <button className="bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 flex-shrink-0">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">导出报表</span>
          </button>
        </div>
      </div>

       {/* Overview Cards */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: '今日充值总计', value: formatCurrency('12450.00'), target: '+15%', icon: ArrowUpRight, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          { title: '本月消费总计', value: formatCurrency('98230.50'), target: '+5%', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
          { title: '今日退款', value: formatCurrency('350.00'), target: '-2%', icon: ArrowDownRight, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' },
          { title: '待结算账单', value: '14 笔', target: '处理中', icon: FileText, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#1a1a1a] p-5 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <div className="mt-1">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
              <p className={`text-xs mt-1 ${stat.target.startsWith('+') ? 'text-emerald-500' : stat.target.startsWith('-') ? 'text-rose-500' : 'text-amber-500'}`}>{stat.target}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
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
          资金流水
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'billing'
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          账单结算
        </button>
      </div>

      <div className="flex-1 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {activeTab === 'transactions' ? (
          <>
            <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <h3 className="font-medium text-slate-900 dark:text-white">最近交易明细</h3>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <Filter className="w-4 h-4" /> 过滤
              </button>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-[#121212] sticky top-0 border-b border-slate-200 dark:border-white/10 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="px-6 py-4">交易时间</th>
                    <th className="px-6 py-4">用户 ID</th>
                    <th className="px-6 py-4">交易类型</th>
                    <th className="px-6 py-4 text-right">金额</th>
                    <th className="px-6 py-4">余额</th>
                    <th className="px-6 py-4">描述</th>
                    <th className="px-6 py-4">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                  {loading ? (
                    <BusinessStateTableRow colSpan={7} kind="loading" title="Loading transactions..." />
                  ) : loadError ? (
                    <BusinessStateTableRow
                      colSpan={7}
                      kind="error"
                      title="Transactions could not be loaded"
                      description={loadError}
                      onRetry={() => { void loadFinance(); }}
                      retryLabel="Retry"
                    />
                  ) : paginatedTransactions.length === 0 ? (
                    <BusinessStateTableRow
                      colSpan={7}
                      kind="empty"
                      title="No transactions found"
                      description="Adjust the search filter or wait for recharge, refund, and usage settlement records."
                    />
                  ) : paginatedTransactions.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{t.time}</td>
                      <td className="px-6 py-4 font-mono text-xs text-blue-600 dark:text-blue-400">{t.userId}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${t.type === 'recharge' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : t.type === 'refund' ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400'}`}>
                          {t.type === 'recharge' ? '充值' : t.type === 'refund' ? '退款' : '消费'}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-right font-medium font-mono ${isPositiveMoney(t.amount) ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                        {isPositiveMoney(t.amount) ? '+' : ''}{formatCurrency(t.amount)}
                      </td>
                      <td className="px-6 py-4 font-mono">{formatCurrency(t.balance)}</td>
                      <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{t.description}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-medium"><CheckCircle2 className="w-3.5 h-3.5"/> 成功</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#121212] flex items-center justify-between">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                共 <span className="font-medium text-slate-900 dark:text-white">{totalItems}</span> 条流水
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  第 {currentPage} 页 <span className="text-slate-400 dark:text-slate-500 font-normal">/ 共 {totalPages} 页</span>
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
              <h3 className="font-medium text-slate-900 dark:text-white">用户账单</h3>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <Filter className="w-4 h-4" /> 过滤
              </button>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-[#121212] sticky top-0 border-b border-slate-200 dark:border-white/10 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="px-6 py-4">账单编号</th>
                    <th className="px-6 py-4">账单周期</th>
                    <th className="px-6 py-4">用户 ID</th>
                    <th className="px-6 py-4">消耗 Tokens</th>
                    <th className="px-6 py-4 text-right">总金额</th>
                    <th className="px-6 py-4">结算期限</th>
                    <th className="px-6 py-4">状态</th>
                    <th className="px-6 py-4">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                  {loading ? (
                    <BusinessStateTableRow colSpan={8} kind="loading" title="Loading billing records..." />
                  ) : loadError ? (
                    <BusinessStateTableRow
                      colSpan={8}
                      kind="error"
                      title="Billing records could not be loaded"
                      description={loadError}
                      onRetry={() => { void loadFinance(); }}
                      retryLabel="Retry"
                    />
                  ) : paginatedBilling.length === 0 ? (
                    <BusinessStateTableRow
                      colSpan={8}
                      kind="empty"
                      title="No billing records found"
                      description="Adjust the search filter or wait for billing cycle records to be generated."
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
                          {b.status === 'paid' ? '已结清' : b.status === 'unpaid' ? '待结算' : '已逾期'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline text-xs">
                           查看详情
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#121212] flex items-center justify-between">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                共 <span className="font-medium text-slate-900 dark:text-white">{totalItems}</span> 条账单
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  第 {currentPage} 页 <span className="text-slate-400 dark:text-slate-500 font-normal">/ 共 {totalPages} 页</span>
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
  return moneyCents(amount) > 0;
}

function moneyCents(amount: string): number {
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

function formatMoneyAmount(amount: string): string {
  const cents = moneyCents(amount);
  const sign = cents < 0 ? '-' : '';
  const absolute = Math.abs(cents);
  const whole = Math.floor(absolute / 100);
  const fraction = String(absolute % 100).padStart(2, '0');
  return `${sign}${whole}.${fraction}`;
}

function groupThousands(value: string): string {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
