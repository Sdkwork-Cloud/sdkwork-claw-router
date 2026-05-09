import React, { useCallback, useState, useRef, useEffect, useMemo } from 'react';
import { Search, Plus, TrendingUp, Hash, Ticket, History, Wallet, ListOrdered, Share2, MoreVertical, Settings, X, Edit, Trash2, Download, Layers } from 'lucide-react';
import { BusinessStatePanel, BusinessStateTableRow, ConfirmDialog, CopyButton } from 'sdkwork-claw-router-commons';
import { MarketingService, Coupon, Batch, PromoCode, RedemptionRecord, RechargeRecord, ReferralStat } from './marketingService';
import { createCouponBatchGenerateInputFromForm, createCouponInputFromForm } from './marketingForm';

function CopyableText({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 group">
      <span className="font-mono text-xs text-slate-600 dark:text-slate-400">{text}</span>
      <CopyButton
        text={text}
        className="text-slate-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
        title="快速复制"
        iconClassName="w-3.5 h-3.5"
      />
    </div>
  );
}

const MARKETING_TABS = [
  { id: 'coupons', label: '优惠券模板配置', icon: <Ticket className="w-4 h-4" /> },
  { id: 'promo-codes', label: '发券批次与券码', icon: <Hash className="w-4 h-4" /> },
  { id: 'redemptions', label: '兑换记录查询', icon: <History className="w-4 h-4" /> },
  { id: 'recharge', label: '充值管理', icon: <Wallet className="w-4 h-4" /> },
  { id: 'recharge-records', label: '充值记录查询', icon: <ListOrdered className="w-4 h-4" /> },
  { id: 'referrals', label: '分享推荐活动管理', icon: <Share2 className="w-4 h-4" /> },
];

type SearchStateProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

type CouponsViewProps = SearchStateProps & {
  coupons: Coupon[];
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
  batches: Batch[];
  setBatches: React.Dispatch<React.SetStateAction<Batch[]>>;
  setPromoCodes: React.Dispatch<React.SetStateAction<PromoCode[]>>;
};

type PromoCodesViewProps = SearchStateProps & {
  coupons: Coupon[];
  batches: Batch[];
  promoCodes: PromoCode[];
  setPromoCodes: React.Dispatch<React.SetStateAction<PromoCode[]>>;
};

export function MarketingAdmin() {
  const [activeTab, setActiveTab] = useState('coupons');
  const [search, setSearch] = useState('');

  // --- LIFTED STATE ---
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);

  const loadMarketingData = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const [c, b, p] = await Promise.all([
        MarketingService.fetchCoupons(),
        MarketingService.fetchBatches(),
        MarketingService.fetchPromoCodes(),
      ]);
      if (isActive()) {
        setCoupons(c);
        setBatches(b);
        setPromoCodes(p);
      }
    } catch (error) {
      if (isActive()) {
        setLoadError(error instanceof Error && error.message ? error.message : 'Failed to load marketing data.');
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    void loadMarketingData(() => active);
    return () => {
      active = false;
    };
  }, [loadMarketingData]);

  const renderContent = () => {
    if (loading) {
      return (
        <BusinessStatePanel kind="loading" title="Loading marketing data..." className="h-full" />
      );
    }

    if (loadError) {
      return (
        <BusinessStatePanel
          kind="error"
          title="Marketing data could not be loaded"
          description={loadError}
          onRetry={() => void loadMarketingData()}
          className="h-full"
        />
      );
    }

    switch (activeTab) {
      case 'coupons':
        return <CouponsView search={search} setSearch={setSearch} coupons={coupons} setCoupons={setCoupons} batches={batches} setBatches={setBatches} setPromoCodes={setPromoCodes} />;
      case 'promo-codes':
        return <PromoCodesView search={search} setSearch={setSearch} coupons={coupons} batches={batches} promoCodes={promoCodes} setPromoCodes={setPromoCodes} />;
      case 'redemptions':
        return <RedemptionsView search={search} setSearch={setSearch} />;
      case 'recharge':
        return <RechargeManageView />;
      case 'recharge-records':
        return <RechargeRecordsView search={search} setSearch={setSearch} />;
      case 'referrals':
        return <ReferralsView search={search} setSearch={setSearch} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex overflow-hidden border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-[#1a1a1a] shadow-sm">
      {/* Internal Sidebar */}
      <div className="w-64 border-r border-slate-200 dark:border-white/10 flex flex-col bg-slate-50 dark:bg-[#121212] shrink-0">
        <div className="p-5 border-b border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-pink-500" />
            营销与增长
          </h2>
          <p className="text-xs text-slate-500 mt-1">管理拉新促活与商业化配置</p>
        </div>
        <div className="flex-1 py-4 flex flex-col gap-1 px-3 overflow-y-auto">
          {MARKETING_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearch('');
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                ? 'bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-[#1a1a1a]">
        {renderContent()}
      </div>
    </div>
  );
}

// 1. 优惠券模板管理
function CouponsView({
  search, setSearch,
  coupons, setCoupons,
  batches, setBatches,
  setPromoCodes
}: CouponsViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [deletingCouponId, setDeletingCouponId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeDeleteConfirmation = () => {
    if (deletingCouponId) {
      return;
    }
    setDeleteTarget(null);
  };

  const executeDelete = async () => {
    if (!deleteTarget) {
      return;
    }
    const id = deleteTarget.id;
    setDeletingCouponId(id);
    try {
      const success = await MarketingService.deleteCoupon(id);
      if (success) {
        setCoupons((current) => current.filter((c) => c.id !== id));
      }
      setDeleteTarget(null);
      setActiveDropdown(null);
    } finally {
      setDeletingCouponId(null);
    }
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const added = await MarketingService.addCoupon(createCouponInputFromForm(formData));
    setCoupons((current) => [added, ...current]);
    setIsModalOpen(false);
  };

  const handleGenerateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    if (selectedCouponId) {
      const { batch, codes } = await MarketingService.generateBatch(createCouponBatchGenerateInputFromForm(formData, selectedCouponId));
      setBatches((current) => [batch, ...current]);
      setPromoCodes((current) => [...codes, ...current]);
    }
    setIsBatchModalOpen(false);
  };

  const filteredCoupons = coupons.filter((c: Coupon) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-5 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-[#121212]/50">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Ticket className="w-5 h-5 text-slate-400" />
          优惠券模板库
        </h3>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="搜索优惠券名称..." value={search} onChange={e => setSearch(e.target.value)} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-pink-500 w-64 text-slate-900 dark:text-white" />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> 创建新模板
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-5">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden">
          <thead className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-white/10">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">模板 ID / 名称</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">抵扣类型</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">面值/折扣规则</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">管理批次</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">当前状态</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5 bg-white dark:bg-transparent">
            {filteredCoupons.length === 0 ? (
              <BusinessStateTableRow
                colSpan={6}
                kind="empty"
                title="No coupon templates found"
                description="Create a coupon template before generating coupon batches and promo codes."
                action={{ label: 'Create template', onClick: () => setIsModalOpen(true) }}
              />
            ) : filteredCoupons.map((c) => {
              const relatedBatches = batches.filter((b) => b.couponId === c.id);
              const totalGenerated = relatedBatches.reduce((sum, b) => sum + b.count, 0);

              return (
              <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-white/5 group">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900 dark:text-slate-200">{c.name}</div>
                  <div className="font-mono text-xs text-slate-400 mt-0.5">{c.id}</div>
                </td>
                <td className="px-4 py-3">{c.type}</td>
                <td className="px-4 py-3 font-mono text-pink-600 dark:text-pink-400 font-medium">{c.value}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500">已有 {relatedBatches.length} 个批次</span>
                    <span className="font-mono">{totalGenerated} <span className="text-xs text-slate-400">总发行量</span></span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${c.status === 'active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'}`}>{c.status === 'active' ? '可发券' : '已归档'}</span>
                </td>
                <td className="px-4 py-3 text-right relative">
                  <div className="inline-flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedCouponId(c.id);
                        setIsBatchModalOpen(true);
                      }}
                      className="px-2 py-1 text-xs border border-pink-200 hover:border-pink-300 dark:border-pink-900 dark:hover:border-pink-700 text-pink-600 dark:text-pink-400 rounded transition-colors flex items-center gap-1 bg-pink-50 dark:bg-pink-500/10"
                    >
                      <Layers className="w-3.5 h-3.5" /> 生成发行批次
                    </button>
                    <div className="relative inline-block">
                      <button onClick={() => setActiveDropdown(activeDropdown === c.id ? null : c.id)} className="p-1.5 text-slate-400 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-500/10 rounded-md transition-colors"><MoreVertical className="w-4 h-4" /></button>
                      {activeDropdown === c.id && (
                        <div ref={dropdownRef} className="absolute right-0 top-10 w-32 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg shadow-xl z-50 overflow-hidden text-left origin-top-right">
                          <button className="w-full px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2 transition-colors">
                            <Edit className="w-4 h-4" /> 编辑属性
                          </button>
                          <button
                            onClick={() => {
                              setDeleteTarget(c);
                              setActiveDropdown(null);
                            }}
                            className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" /> 归档删除
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <Ticket className="w-5 h-5 text-pink-500" /> 定义基础优惠券模板
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCoupon} className="flex flex-col">
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">内部模板标识名称</label>
                  <input required name="name" type="text" placeholder="例如：新用户首次充值10元抵扣券" className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 text-slate-900 dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">基础抵扣规则</label>
                    <select required name="type" className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 text-slate-900 dark:text-white">
                      <option value="amount">固定面额抵扣</option>
                      <option value="discount">订单百分比折扣</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">具体面额 / 折扣率</label>
                    <input required name="value" type="text" placeholder="例: ¥10.00 或 20%" className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 text-slate-900 dark:text-white font-mono" />
                  </div>
                </div>
              </div>
              <div className="p-5 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3 bg-slate-50 dark:bg-[#121212]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1a1a1a] border border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                  取消
                </button>
                <button type="submit" className="px-4 py-2.5 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-lg shadow-sm transition-colors">
                  保存并创建模板
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GENERATE BATCH MODAL */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <Layers className="w-5 h-5 text-pink-500" /> 批量生成衍生券码 (Batch)
              </h3>
              <button onClick={() => setIsBatchModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateBatch} className="flex flex-col">
              <div className="p-5 space-y-4">
                <div className="p-3 bg-pink-50 dark:bg-pink-500/10 rounded-lg border border-pink-100 dark:border-pink-500/20 mb-4">
                   <p className="text-sm font-medium text-pink-800 dark:text-pink-300">
                     当前模板: {coupons.find((c) => c.id === selectedCouponId)?.name}
                     ({coupons.find((c) => c.id === selectedCouponId)?.value})
                   </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">投放批次名称</label>
                  <input required name="batchName" type="text" placeholder="例如：2024元旦海外社交媒体投放专属" className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 text-slate-900 dark:text-white" />
                  <p className="text-xs text-slate-500 mt-1">建立批次便于后期追踪特定渠道转化率。</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">券码抬头前缀 (选填)</label>
                    <input name="prefix" type="text" placeholder="如: FB2024" className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 text-slate-900 dark:text-white uppercase font-mono" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">本次生成数量</label>
                    <input required name="count" type="number" min="1" max="10000" defaultValue={100} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 text-slate-900 dark:text-white font-mono" />
                  </div>
                </div>
              </div>
              <div className="p-5 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3 bg-slate-50 dark:bg-[#121212]">
                <button type="button" onClick={() => setIsBatchModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1a1a1a] border border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                  取消
                </button>
                <button type="submit" className="px-4 py-2.5 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-lg shadow-sm transition-colors flex items-center gap-2">
                  <Hash className="w-4 h-4"/> 立即生成批次券码
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete coupon template?"
          description={`This removes "${deleteTarget.name}" and invalidates related generated promo-code batches. Review active campaigns before confirming.`}
          confirmLabel="Delete coupon"
          tone="danger"
          icon={<Trash2 className="h-4 w-4" />}
          isBusy={deletingCouponId === deleteTarget.id}
          onConfirm={() => void executeDelete()}
          onCancel={closeDeleteConfirmation}
        />
      )}
    </div>
  );
}

// 2. 优惠码/批次管理
function PromoCodesView({ search, setSearch, coupons, batches, promoCodes, setPromoCodes }: PromoCodesViewProps) {
  const [selectedBatchId, setSelectedBatchId] = useState<string>('all');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusChange = async (id: string, newStatus: PromoCode['status']) => {
    const success = await MarketingService.updatePromoCodeStatus(id, newStatus);
    if (success) {
      setPromoCodes((current) => current.map((pc) => pc.id === id ? { ...pc, status: newStatus } : pc));
    }
    setActiveDropdown(null);
  };

  const displayCodes = useMemo(() => {
    let filtered = promoCodes;
    if (selectedBatchId !== 'all') {
      filtered = filtered.filter((c) => c.batchId === selectedBatchId);
    }
    if (search) {
      filtered = filtered.filter((c) => c.code.toLowerCase().includes(search.toLowerCase()));
    }
    return filtered;
  }, [promoCodes, selectedBatchId, search]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-5 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-[#121212]/50">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Hash className="w-5 h-5 text-slate-400" />
          全渠道落地发券管理与溯源
        </h3>
        <div className="flex gap-3">
          <select
            value={selectedBatchId}
            onChange={e => setSelectedBatchId(e.target.value)}
             className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-1.5 text-sm focus:outline-none focus:border-pink-500 text-slate-700 dark:text-slate-300 shadow-sm"
          >
            <option value="all">查看所有批次券码</option>
            {batches.map((b) => (
               <option key={b.id} value={b.id}>{b.name} ({b.count}张)</option>
            ))}
          </select>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="精确搜索券码字符..." value={search} onChange={e => setSearch(e.target.value)} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-pink-500 w-64 text-slate-900 dark:text-white shadow-sm" />
          </div>
          <button className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4" /> 导出当页
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      {selectedBatchId !== 'all' && (
        <div className="px-5 py-3 border-b border-slate-200 dark:border-white/5 bg-slate-50/30 dark:bg-[#121212]/30 flex gap-8">
           {(() => {
             const batch = batches.find((b) => b.id === selectedBatchId);
             if(!batch) return null;
             const coupon = coupons.find((c) => c.id === batch.couponId);
             const batchCodes = promoCodes.filter((c) => c.batchId === batch.id);
             const claimed = batchCodes.filter((c) => c.status !== 'available').length;
             return (
               <>
                 <div className="flex flex-col">
                   <span className="text-xs text-slate-500 dark:text-slate-400">所属底层模板</span>
                   <span className="text-sm font-medium text-slate-900 dark:text-white mt-0.5">{coupon?.name} ({coupon?.value})</span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-xs text-slate-500 dark:text-slate-400">核销/激活转化率</span>
                   <span className="text-sm font-bold text-pink-600 dark:text-pink-400 mt-0.5">{batch.count > 0 ? ((claimed/batch.count)*100).toFixed(1) : 0}% <span className="text-xs text-slate-500 font-normal">({claimed}/{batch.count})</span></span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-xs text-slate-500 dark:text-slate-400">生成时间</span>
                   <span className="text-sm font-mono text-slate-700 dark:text-slate-300 mt-0.5">{batch.createdAt}</span>
                 </div>
               </>
             )
           })()}
        </div>
      )}

      <div className="flex-1 overflow-auto p-5">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden">
          <thead className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-white/10">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">具体券码 (口令)</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">归属批次名</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">绑定模板规则</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">当前状态</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">核销者/绑定者</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">核销日期</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5 bg-white dark:bg-transparent">
            {displayCodes.length === 0 ? (
              <BusinessStateTableRow
                colSpan={7}
                kind="empty"
                title="No promo codes found"
                description="Generate a coupon batch from a template before managing promo codes."
              />
            ) : displayCodes.map((c) => {
              const batch = batches.find((b) => b.id === c.batchId);
              const coupon = coupons.find((cp) => cp.id === batch?.couponId);
              return (
              <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                <td className="px-4 py-3">
                   <div className="bg-slate-100 dark:bg-white/10 px-2 flex items-center justify-between py-1 rounded w-fit">
                     <span className="font-mono text-sm tracking-wider font-bold text-slate-900 dark:text-slate-200">{c.code}</span>
                   </div>
                </td>
                <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">{batch?.name || '未知'}</td>
                <td className="px-4 py-3">
                   <div className="flex items-center gap-2">
                     <span>{coupon?.name}</span>
                     <span className="text-xs font-mono text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-500/10 px-1.5 py-0.5 rounded">{coupon?.value}</span>
                   </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    c.status === 'used' ? 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                    : c.status === 'claimed' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                    : c.status === 'voided' ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                    : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                  }`}>
                    {c.status === 'available' ? '待提取(闲置)' : c.status === 'claimed' ? '已被绑定' : c.status === 'voided' ? '作废' : '已核销使用'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {c.usedBy ? <CopyableText text={c.usedBy} /> : <span className="text-xs text-slate-400">-</span>}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.usedAt || '-'}</td>
                <td className="px-4 py-3 text-right">
                  <div className="relative inline-block">
                    <button onClick={() => setActiveDropdown(activeDropdown === c.id ? null : c.id)} className="p-1.5 text-slate-400 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-500/10 rounded-md transition-colors"><MoreVertical className="w-4 h-4" /></button>
                    {activeDropdown === c.id && (
                      <div ref={dropdownRef} className="absolute right-0 top-10 w-32 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg shadow-xl z-50 overflow-hidden text-left origin-top-right">
                        <CopyButton
                          text={c.code}
                          label="复制券码"
                          copiedLabel="已复制"
                          variant="menu"
                          onCopied={() => setActiveDropdown(null)}
                        />
                        {c.status !== 'voided' && (
                          <button onClick={() => handleStatusChange(c.id, 'voided')} className="w-full px-4 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 flex items-center gap-2 transition-colors border-t border-slate-100 dark:border-white/5">
                            <Trash2 className="w-4 h-4" /> 标记作废
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getLoadErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

// 3. 兑换记录查询
function RedemptionsView({ search, setSearch }: { search: string, setSearch: (s: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [redemptionRecords, setRedemptionRecords] = useState<RedemptionRecord[]>([]);

  const loadRedemptionRecords = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await MarketingService.fetchRedemptionRecords();
      if (isActive()) {
        setRedemptionRecords(data);
      }
    } catch (error) {
      if (isActive()) {
        setLoadError(getLoadErrorMessage(error, 'Failed to load redemption records.'));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    void loadRedemptionRecords(() => active);
    return () => {
      active = false;
    };
  }, [loadRedemptionRecords]);

  const filteredRedemptions = redemptionRecords.filter(r => r.user.includes(search) || r.code.includes(search));

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-5 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-[#121212]/50">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <History className="w-5 h-5 text-slate-400" />
          系统兑换流水
        </h3>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="搜索用户邮箱或口令..." value={search} onChange={e => setSearch(e.target.value)} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-pink-500 w-64 text-slate-900 dark:text-white" />
        </div>
      </div>
      <div className="flex-1 overflow-auto p-5">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden">
          <thead className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-white/10">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">兑换时间</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">用户 ID</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">用户邮箱</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">使用卡密/口令</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white text-right">额度变动</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5 bg-white dark:bg-transparent">
            {loading ? (
              <BusinessStateTableRow colSpan={5} kind="loading" title="Loading redemption records..." />
            ) : loadError ? (
              <BusinessStateTableRow
                colSpan={5}
                kind="error"
                title="Redemption records could not be loaded"
                description={loadError}
                onRetry={() => void loadRedemptionRecords()}
              />
            ) : filteredRedemptions.length === 0 ? (
              <BusinessStateTableRow
                colSpan={5}
                kind="empty"
                title="No redemption records found"
                description="Redemption activity will appear here after users redeem promo codes."
              />
            ) : filteredRedemptions.map(r => (
              <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                <td className="px-4 py-3 font-mono text-xs">{r.time}</td>
                <td className="px-4 py-3"><CopyableText text={r.userId} /></td>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-200">{r.user}</td>
                <td className="px-4 py-3 font-mono"><span className="bg-slate-100 dark:bg-white/10 px-2 py-1 rounded text-xs">{r.code}</span></td>
                <td className="px-4 py-3 font-mono text-emerald-600 dark:text-emerald-400 text-right">{r.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 4. 充值管理 (设置充值比例等)
function RechargeManageView() {
  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-400" />
          充值设置与比例定义
        </h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">保存配置</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-5">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-4">法币/额度兑换率 (Exchange Rate)</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">支付 1 CNY 可获得额度 ($)</label>
              <div className="flex items-center gap-3">
                 <input type="number" defaultValue="0.15" step="0.01" className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white flex-1" />
                 <span className="text-slate-500 text-sm"> USD 额度</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">即用户充值 10元 人民币，系统钱包增加 1.5 美元额度。</p>
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-white/10">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">平台最低充值金额限制</label>
              <div className="flex items-center gap-3">
                 <input type="number" defaultValue="10" className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white flex-1" />
                 <span className="text-slate-500 text-sm"> CNY</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-5">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-4">支付渠道集成状态</h4>
          <div className="space-y-3">
             <div className="flex items-center justify-between p-3 bg-white dark:bg-[#1a1a1a] rounded-lg border border-slate-200 dark:border-white/10">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold font-serif">W</div>
                 <div>
                   <div className="text-sm font-semibold text-slate-900 dark:text-white">微信支付 (WeChat Pay)</div>
                   <div className="text-xs text-slate-500">免签 Native 支付接入</div>
                 </div>
               </div>
               <span className="px-2 py-1 rounded text-xs bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">已开启</span>
             </div>
             <div className="flex items-center justify-between p-3 bg-white dark:bg-[#1a1a1a] rounded-lg border border-slate-200 dark:border-white/10">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold font-serif">A</div>
                 <div>
                   <div className="text-sm font-semibold text-slate-900 dark:text-white">支付宝 (Alipay)</div>
                   <div className="text-xs text-slate-500">当面付接入</div>
                 </div>
               </div>
               <span className="px-2 py-1 rounded text-xs bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">已开启</span>
             </div>
             <div className="flex items-center justify-between p-3 bg-white dark:bg-[#1a1a1a] rounded-lg border border-slate-200 dark:border-white/10 opacity-60">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold font-serif">S</div>
                 <div>
                   <div className="text-sm font-semibold text-slate-900 dark:text-white">Stripe</div>
                   <div className="text-xs text-slate-500">国际信用卡支付</div>
                 </div>
               </div>
               <span className="px-2 py-1 rounded text-xs bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400">未配置密钥</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. 充值记录查询
function RechargeRecordsView({ search, setSearch }: { search: string, setSearch: (s: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [rechargeRecords, setRechargeRecords] = useState<RechargeRecord[]>([]);

  const loadRechargeRecords = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await MarketingService.fetchRechargeRecords();
      if (isActive()) {
        setRechargeRecords(data);
      }
    } catch (error) {
      if (isActive()) {
        setLoadError(getLoadErrorMessage(error, 'Failed to load recharge records.'));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    void loadRechargeRecords(() => active);
    return () => {
      active = false;
    };
  }, [loadRechargeRecords]);

  const filteredRecharges = rechargeRecords.filter(r => r.tradeNo.includes(search) || r.user.includes(search));

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-5 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-[#121212]/50">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <ListOrdered className="w-5 h-5 text-slate-400" />
          系统充值流水账单
        </h3>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="搜索订单编号..." value={search} onChange={e => setSearch(e.target.value)} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-blue-500 w-64 text-slate-900 dark:text-white" />
        </div>
      </div>
      <div className="flex-1 overflow-auto p-5">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden">
          <thead className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-white/10">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">时间</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">交易订单号</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">用户 ID</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">支付用户</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">实付金额</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">到账额度 (USD)</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">支付方式</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">交易状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5 bg-white dark:bg-transparent">
            {loading ? (
              <BusinessStateTableRow colSpan={8} kind="loading" title="Loading recharge records..." />
            ) : loadError ? (
              <BusinessStateTableRow
                colSpan={8}
                kind="error"
                title="Recharge records could not be loaded"
                description={loadError}
                onRetry={() => void loadRechargeRecords()}
              />
            ) : filteredRecharges.length === 0 ? (
              <BusinessStateTableRow
                colSpan={8}
                kind="empty"
                title="No recharge records found"
                description="Recharge transactions will appear here after payment callbacks are settled."
              />
            ) : filteredRecharges.map(r => (
              <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                <td className="px-4 py-3 font-mono text-xs">{r.time}</td>
                <td className="px-4 py-3 font-mono text-xs text-blue-600 dark:text-blue-400">{r.tradeNo}</td>
                <td className="px-4 py-3"><CopyableText text={r.userId} /></td>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-200">{r.user}</td>
                <td className="px-4 py-3 font-mono font-medium">{r.amount}</td>
                <td className="px-4 py-3 font-mono font-medium text-emerald-600 dark:text-emerald-400">{r.usd_credited}</td>
                <td className="px-4 py-3">{r.method}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${r.status === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>{r.status === 'success' ? '支付成功' : '支付失败'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 6. 分享推荐活动管理
function ReferralsView({ search, setSearch }: { search: string, setSearch: (s: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [referStats, setReferStats] = useState<ReferralStat[]>([]);

  const loadReferralStats = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await MarketingService.fetchReferralStats();
      if (isActive()) {
        setReferStats(data);
      }
    } catch (error) {
      if (isActive()) {
        setLoadError(getLoadErrorMessage(error, 'Failed to load referral statistics.'));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    void loadReferralStats(() => active);
    return () => {
      active = false;
    };
  }, [loadReferralStats]);

  const filteredReferralStats = referStats.filter(r => r.inviter.includes(search));

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-5 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-[#121212]/50">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Share2 className="w-5 h-5 text-slate-400" />
          分销与分享推荐流水
        </h3>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="搜索邀请人账号..." value={search} onChange={e => setSearch(e.target.value)} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-blue-500 w-64 text-slate-900 dark:text-white" />
          </div>
          <button className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-slate-50 dark:hover:bg-white/5">
            分销规则设置
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-5">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden">
          <thead className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-white/10">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">邀请人账号</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">专属短链</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">累计拉新成功</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">下钻流水贡献</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">已发放佣金/额度</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5 bg-white dark:bg-transparent">
             {loading ? (
               <BusinessStateTableRow colSpan={5} kind="loading" title="Loading referral statistics..." />
             ) : loadError ? (
               <BusinessStateTableRow
                 colSpan={5}
                 kind="error"
                 title="Referral statistics could not be loaded"
                 description={loadError}
                 onRetry={() => void loadReferralStats()}
               />
             ) : filteredReferralStats.length === 0 ? (
               <BusinessStateTableRow
                 colSpan={5}
                 kind="empty"
                 title="No referral statistics found"
                 description="Referral activity will appear here after invited users create billable usage."
               />
             ) : filteredReferralStats.map(r => (
               <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                 <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-200">{r.inviter}</td>
                 <td className="px-4 py-3 font-mono text-xs text-blue-600 dark:text-blue-400 truncate max-w-[200px]">{r.link}</td>
                 <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">{r.total_invited} <span className="font-sans font-normal text-xs text-slate-500">人</span></td>
                 <td className="px-4 py-3 font-mono">{r.total_revenue}</td>
                 <td className="px-4 py-3 font-mono text-pink-600 dark:text-pink-400">{r.bonus_awarded}</td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
