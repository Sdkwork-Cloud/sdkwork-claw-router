import React, { useCallback, useState, useRef, useEffect, useMemo } from 'react';
import { Search, Plus, TrendingUp, Hash, Ticket, History, Wallet, ListOrdered, Share2, MoreVertical, Settings, X, Edit, Trash2, Download, Layers } from 'lucide-react';
import { BusinessStatePanel, BusinessStateTableRow, ConfirmDialog, CopyButton } from 'sdkwork-claw-router-commons';
import { MarketingService, Coupon, Batch, PromoCode, RedemptionRecord, RechargePackage, RechargeRecord, ReferralStat, ExchangeRule, PaymentAttempt } from './marketingService';
import { createCouponBatchGenerateInputFromForm, createCouponInputFromForm, createExchangeRuleInputFromForm, createRechargePackageInputFromForm } from './marketingForm';

import { useTranslation } from 'react-i18next';
type TranslationFunction = ReturnType<typeof useTranslation>['t'];

function CopyableText({ text }: { text: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2 group">
      <span className="font-mono text-xs text-slate-600 dark:text-slate-400">{text}</span>
      <CopyButton
        text={text}
        className="text-slate-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
        title={t("admin.marketing.index.text.1f6pt00", "快速复制")}
        iconClassName="w-3.5 h-3.5"
      />
    </div>
  );
}

const MARKETING_TABS = [
  { id: 'coupons', label: (t: TranslationFunction) => t("admin.marketing.index.text.3yfmv4", "优惠券模板配置"), icon: <Ticket className="w-4 h-4" /> },
  { id: 'promo-codes', label: (t: TranslationFunction) => t("admin.marketing.index.text.1nnzbxj", "发券批次与券码"), icon: <Hash className="w-4 h-4" /> },
  { id: 'redemptions', label: (t: TranslationFunction) => t("admin.marketing.index.text.8zm5kq", "兑换记录查询"), icon: <History className="w-4 h-4" /> },
  { id: 'recharge', label: (t: TranslationFunction) => t("admin.marketing.index.text.2wovaj", "充值管理"), icon: <Wallet className="w-4 h-4" /> },
  { id: 'exchange-rules', label: (t: TranslationFunction) => t("admin.marketing.index.text.xfajks", "积分兑换规则"), icon: <Settings className="w-4 h-4" /> },
  { id: 'recharge-records', label: (t: TranslationFunction) => t("admin.marketing.index.text.149h8vc", "充值记录查询"), icon: <ListOrdered className="w-4 h-4" /> },
  { id: 'payment-attempts', label: (t: TranslationFunction) => t("admin.marketing.index.text.hm2nh9", "支付尝试流水"), icon: <ListOrdered className="w-4 h-4" /> },
  { id: 'referrals', label: (t: TranslationFunction) => t("admin.marketing.index.text.3m5kj2", "分享推荐活动管理"), icon: <Share2 className="w-4 h-4" /> },
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
  const { t } = useTranslation();
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
    const renderMarketingLoadState = () => {
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
      return null;
    };

    if (activeTab === 'coupons' || activeTab === 'promo-codes') {
      const loadState = renderMarketingLoadState();
      if (loadState) {
        return loadState;
      }
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
      case 'exchange-rules':
        return <ExchangeRulesView search={search} setSearch={setSearch} />;
      case 'recharge-records':
        return <RechargeRecordsView search={search} setSearch={setSearch} />;
      case 'payment-attempts':
        return <PaymentAttemptsView search={search} setSearch={setSearch} />;
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
            {t("admin.marketing.index.text.cx6obd", "营销与增长")}</h2>
          <p className="text-xs text-slate-500 mt-1">{t("admin.marketing.index.text.82ksh2", "管理拉新促活与商业化配置")}</p>
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
              {tab.label(t)}
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
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
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

  const openCreateCouponModal = () => {
    setEditingCoupon(null);
    setIsModalOpen(true);
  };

  const openEditCouponModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setActiveDropdown(null);
    setIsModalOpen(true);
  };

  const closeCouponModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
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
    if (editingCoupon) {
      const updated = await MarketingService.updateCoupon(editingCoupon.id, createCouponInputFromForm(formData));
      setCoupons((current) => current.map((coupon) => coupon.id === updated.id ? updated : coupon));
    } else {
      const added = await MarketingService.addCoupon(createCouponInputFromForm(formData));
      setCoupons((current) => [added, ...current]);
    }
    closeCouponModal();
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
          {t("admin.marketing.index.text.rdmbgs", "优惠券模板库")}</h3>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder={t("admin.marketing.index.text.1ekda56", "搜索优惠券名称...")} value={search} onChange={e => setSearch(e.target.value)} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-pink-500 w-64 text-slate-900 dark:text-white" />
          </div>
          <button onClick={openCreateCouponModal} className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> {t("admin.marketing.index.text.1kchydw", "创建新模板")}</button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-5">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden">
          <thead className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-white/10">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.11o7oag", "模板 ID / 名称")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.1vwq3uv", "抵扣类型")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.capyo6", "面值/折扣规则")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.vvlm6k", "管理批次")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.c6rjk", "当前状态")}</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white">{t("admin.group.index.text.501w24", "操作")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5 bg-white dark:bg-transparent">
            {filteredCoupons.length === 0 ? (
              <BusinessStateTableRow
                colSpan={6}
                kind="empty"
                title="No coupon templates found"
                description="Create a coupon template before generating coupon batches and promo codes."
                action={{ label: 'Create template', onClick: openCreateCouponModal }}
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
                    <span className="text-xs text-slate-500">{t("admin.marketing.index.text.p2tllg", "已有")}{relatedBatches.length} {t("admin.marketing.index.text.1ipeuon", "个批次")}</span>
                    <span className="font-mono">{totalGenerated} <span className="text-xs text-slate-400">{t("admin.marketing.index.text.g7twag", "总发行量")}</span></span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${c.status === 'active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'}`}>{c.status === 'active' ? t("admin.marketing.index.text.xwv3pb", "可发券") : t("admin.marketing.index.text.1gje7de", "已归档")}</span>
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
                      <Layers className="w-3.5 h-3.5" /> {t("admin.marketing.index.text.papke9", "生成发行批次")}</button>
                    <div className="relative inline-block">
                      <button onClick={() => setActiveDropdown(activeDropdown === c.id ? null : c.id)} className="p-1.5 text-slate-400 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-500/10 rounded-md transition-colors"><MoreVertical className="w-4 h-4" /></button>
                      {activeDropdown === c.id && (
                        <div ref={dropdownRef} className="absolute right-0 top-10 w-32 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg shadow-xl z-50 overflow-hidden text-left origin-top-right">
                          <button onClick={() => openEditCouponModal(c)} className="w-full px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2 transition-colors">
                            <Edit className="w-4 h-4" /> {t("admin.marketing.index.text.fels73", "编辑属性")}</button>
                          <button
                            onClick={() => {
                              setDeleteTarget(c);
                              setActiveDropdown(null);
                            }}
                            className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" /> {t("admin.marketing.index.text.7tf9k6", "归档删除")}</button>
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
                 <Ticket className="w-5 h-5 text-pink-500" /> {editingCoupon ? t("admin.marketing.index.text.1qeupik", "编辑优惠券模板") : t("admin.marketing.index.text.1hcgqoi", "定义基础优惠券模板")}
              </h3>
              <button onClick={closeCouponModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCoupon} className="flex flex-col">
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t("admin.marketing.index.text.1mui7c8", "内部模板标识名称")}</label>
                  <input required name="name" type="text" defaultValue={editingCoupon?.name ?? ''} placeholder={t("admin.marketing.index.text.7j44zt", "例如：新用户首次充值10元抵扣券")} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 text-slate-900 dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t("admin.marketing.index.text.2eq1ns", "基础抵扣规则")}</label>
                    <select required name="type" defaultValue={editingCoupon?.type ?? 'amount'} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 text-slate-900 dark:text-white">
                      <option value="amount">{t("admin.marketing.index.text.1d2w9i4", "固定面额抵扣")}</option>
                      <option value="discount">{t("admin.marketing.index.text.m0dnpd", "订单百分比折扣")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t("admin.marketing.index.text.sp4sgp", "具体面额 / 折扣率")}</label>
                    <input required name="value" type="text" defaultValue={editingCoupon?.value ?? ''} placeholder={t("admin.marketing.index.text.bopezn", "例: ¥10.00 或 20%")} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 text-slate-900 dark:text-white font-mono" />
                  </div>
                </div>
              </div>
              <div className="p-5 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3 bg-slate-50 dark:bg-[#121212]">
                <button type="button" onClick={closeCouponModal} className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1a1a1a] border border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                  {t("admin.group.index.text.1589w37", "取消")}</button>
                <button type="submit" className="px-4 py-2.5 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-lg shadow-sm transition-colors">
                  {editingCoupon ? t("admin.marketing.index.text.gytj0w", "保存模板变更") : t("admin.marketing.index.text.2ml87v", "保存并创建模板")}
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
                 <Layers className="w-5 h-5 text-pink-500" /> {t("admin.marketing.index.text.14njzi", "批量生成衍生券码 (Batch)")}</h3>
              <button onClick={() => setIsBatchModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateBatch} className="flex flex-col">
              <div className="p-5 space-y-4">
                <div className="p-3 bg-pink-50 dark:bg-pink-500/10 rounded-lg border border-pink-100 dark:border-pink-500/20 mb-4">
                   <p className="text-sm font-medium text-pink-800 dark:text-pink-300">
                     {t("admin.marketing.index.text.1cgeyz5", "当前模板:")}{coupons.find((c) => c.id === selectedCouponId)?.name}
                     ({coupons.find((c) => c.id === selectedCouponId)?.value})
                   </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t("admin.marketing.index.text.1tp4825", "投放批次名称")}</label>
                  <input required name="batchName" type="text" placeholder={t("admin.marketing.index.text.oabzpp", "例如：2024元旦海外社交媒体投放专属")} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 text-slate-900 dark:text-white" />
                  <p className="text-xs text-slate-500 mt-1">{t("admin.marketing.index.text.1yjcl2g", "建立批次便于后期追踪特定渠道转化率。")}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t("admin.marketing.index.text.dw7rmn", "券码抬头前缀")}</label>
                    <input required name="prefix" type="text" placeholder={t("admin.marketing.index.text.1mvca3j", "如: FB2024")} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 text-slate-900 dark:text-white uppercase font-mono" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t("admin.marketing.index.text.kjpdkc", "本次生成数量")}</label>
                    <input required name="count" type="number" min="1" max="10000" step="1" defaultValue={100} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 text-slate-900 dark:text-white font-mono" />
                  </div>
                </div>
              </div>
              <div className="p-5 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3 bg-slate-50 dark:bg-[#121212]">
                <button type="button" onClick={() => setIsBatchModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1a1a1a] border border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                  {t("admin.group.index.text.1589w37", "取消")}</button>
                <button type="submit" className="px-4 py-2.5 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-lg shadow-sm transition-colors flex items-center gap-2">
                  <Hash className="w-4 h-4"/> {t("admin.marketing.index.text.1c48p8d", "立即生成批次券码")}</button>
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
  const { t } = useTranslation();
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

  const exportCurrentPromoCodes = () => {
    if (displayCodes.length === 0) {
      return;
    }
    const headers = ['code', 'status', 'batch_id', 'batch_name', 'coupon_id', 'coupon_name', 'coupon_value', 'used_by', 'used_at'];
    const rows = displayCodes.map((code) => {
      const batch = batches.find((item) => item.id === code.batchId);
      const coupon = coupons.find((item) => item.id === batch?.couponId);
      return [
        code.code,
        code.status,
        code.batchId,
        batch?.name ?? '',
        batch?.couponId ?? '',
        coupon?.name ?? '',
        coupon?.value ?? '',
        code.usedBy ?? '',
        code.usedAt ?? '',
      ];
    });
    const escapeCsvCell = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => escapeCsvCell(String(value))).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `promo-codes-${selectedBatchId}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-5 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-[#121212]/50">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Hash className="w-5 h-5 text-slate-400" />
          {t("admin.marketing.index.text.1sxwm02", "全渠道落地发券管理与溯源")}</h3>
        <div className="flex gap-3">
          <select
            value={selectedBatchId}
            onChange={e => setSelectedBatchId(e.target.value)}
             className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-1.5 text-sm focus:outline-none focus:border-pink-500 text-slate-700 dark:text-slate-300 shadow-sm"
          >
            <option value="all">{t("admin.marketing.index.text.kq0w87", "查看所有批次券码")}</option>
            {batches.map((b) => (
               <option key={b.id} value={b.id}>{b.name} ({b.count}{t("admin.marketing.index.text.18l9wi", "张)")}</option>
            ))}
          </select>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder={t("admin.marketing.index.text.pxgavh", "精确搜索券码字符...")} value={search} onChange={e => setSearch(e.target.value)} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-pink-500 w-64 text-slate-900 dark:text-white shadow-sm" />
          </div>
          <button onClick={exportCurrentPromoCodes} disabled={displayCodes.length === 0} className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
            <Download className="w-4 h-4" /> {t("admin.marketing.index.text.tzw0tr", "导出当页")}</button>
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
                   <span className="text-xs text-slate-500 dark:text-slate-400">{t("admin.marketing.index.text.ckhv84", "所属底层模板")}</span>
                   <span className="text-sm font-medium text-slate-900 dark:text-white mt-0.5">{coupon?.name} ({coupon?.value})</span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-xs text-slate-500 dark:text-slate-400">{t("admin.marketing.index.text.1ke1nbm", "核销/激活转化率")}</span>
                   <span className="text-sm font-bold text-pink-600 dark:text-pink-400 mt-0.5">{batch.count > 0 ? ((claimed/batch.count)*100).toFixed(1) : 0}% <span className="text-xs text-slate-500 font-normal">({claimed}/{batch.count})</span></span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-xs text-slate-500 dark:text-slate-400">{t("admin.marketing.index.text.1d1005s", "生成时间")}</span>
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
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.sze5u6", "具体券码 (口令)")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.7beb2a", "归属批次名")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.1edt9v5", "绑定模板规则")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.c6rjk", "当前状态")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.1jf6d2l", "核销者/绑定者")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.801vcd", "核销日期")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white text-right">{t("admin.group.index.text.501w24", "操作")}</th>
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
                <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">{batch?.name || t("admin.marketing.index.text.1lpnuh4", "未知")}</td>
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
                    {c.status === 'available' ? t("admin.marketing.index.text.pjbzd1", "待提取(闲置)") : c.status === 'claimed' ? t("admin.marketing.index.text.1m3owcx", "已被绑定") : c.status === 'voided' ? t("admin.marketing.index.text.wph6a4", "作废") : t("admin.marketing.index.text.eerbfm", "已核销使用")}
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
                          label={t("admin.marketing.index.text.1wthmk5", "复制券码")}
                          copiedLabel={t("admin.marketing.index.text.alyyje", "已复制")}
                          variant="menu"
                          onCopied={() => setActiveDropdown(null)}
                        />
                        {c.status !== 'voided' && (
                          <button onClick={() => handleStatusChange(c.id, 'voided')} className="w-full px-4 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 flex items-center gap-2 transition-colors border-t border-slate-100 dark:border-white/5">
                            <Trash2 className="w-4 h-4" /> {t("admin.marketing.index.text.g6owv3", "标记作废")}</button>
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

function statusBadgeClass(status: 'active' | 'pending' | 'success' | 'failed' | 'expired'): string {
  switch (status) {
    case 'active':
    case 'success':
      return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400';
    case 'pending':
      return 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400';
    case 'failed':
      return 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400';
    case 'expired':
      return 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400';
    default:
      return 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400';
  }
}

// 3. 兑换记录查询
function RedemptionsView({ search, setSearch }: { search: string, setSearch: (s: string) => void }) {
  const { t } = useTranslation();
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
          {t("admin.marketing.index.text.1na4599", "系统兑换流水")}</h3>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder={t("admin.marketing.index.text.etkprm", "搜索用户邮箱或口令...")} value={search} onChange={e => setSearch(e.target.value)} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-pink-500 w-64 text-slate-900 dark:text-white" />
        </div>
      </div>
      <div className="flex-1 overflow-auto p-5">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden">
          <thead className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-white/10">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.1k661o0", "兑换时间")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.finance.index.text.3jrccd", "用户 ID")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.3zjmsh", "用户邮箱")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.1kp70tt", "使用卡密/口令")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white text-right">{t("admin.marketing.index.text.3ho4ai", "额度变动")}</th>
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
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [packages, setPackages] = useState<RechargePackage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<RechargePackage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RechargePackage | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingPackageId, setDeletingPackageId] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const loadRechargePackages = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await MarketingService.listRechargePackages();
      if (isActive()) {
        setPackages(data);
      }
    } catch (error) {
      if (isActive()) {
        setLoadError(getLoadErrorMessage(error, 'Failed to load recharge packages.'));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    void loadRechargePackages(() => active);
    return () => {
      active = false;
    };
  }, [loadRechargePackages]);

  const openCreateModal = () => {
    setEditingPackage(null);
    setMutationError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: RechargePackage) => {
    setEditingPackage(item);
    setMutationError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }
    setIsModalOpen(false);
    setEditingPackage(null);
    setMutationError(null);
  };

  const closeDeleteConfirmation = () => {
    if (deletingPackageId) {
      return;
    }
    setDeleteTarget(null);
  };

  const handleSubmitPackage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMutationError(null);
    try {
      const payload = createRechargePackageInputFromForm(new FormData(event.currentTarget));
      if (editingPackage) {
        const updated = await MarketingService.updateRechargePackage(editingPackage.id, payload);
        setPackages((current) => current.map((item) => item.id === updated.id ? updated : item));
      } else {
        const created = await MarketingService.createRechargePackage(payload);
        setPackages((current) => [created, ...current]);
      }
      setIsModalOpen(false);
      setEditingPackage(null);
    } catch (error) {
      setMutationError(getLoadErrorMessage(error, 'Failed to save recharge package.'));
    } finally {
      setSaving(false);
    }
  };

  const executeDeletePackage = async () => {
    if (!deleteTarget) {
      return;
    }
    const id = deleteTarget.id;
    setDeletingPackageId(id);
    try {
      const success = await MarketingService.deleteRechargePackage(id);
      if (success) {
        setPackages((current) => current.filter((item) => item.id !== id));
      }
      setDeleteTarget(null);
    } finally {
      setDeletingPackageId(null);
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="p-5 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-[#121212]/50">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-400" />
          {t("admin.marketing.index.text.ek7bmw", "充值套餐管理")}</h3>
        <button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> {t("admin.marketing.index.text.y3xgcf", "创建套餐")}</button>
      </div>

      <div className="flex-1 overflow-auto p-5">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden">
          <thead className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-white/10">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.1godjxn", "套餐 ID")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.ep7jaq", "售价")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.15b56z", "赠送积分")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.1upsofy", "到账积分")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.finance.index.text.1ccx4t4", "状态")}</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white">{t("admin.group.index.text.501w24", "操作")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5 bg-white dark:bg-transparent">
            {loading ? (
              <BusinessStateTableRow colSpan={6} kind="loading" title={t('admin.marketing.rechargePackages.loading', '正在加载充值套餐...')} />
            ) : loadError ? (
              <BusinessStateTableRow
                colSpan={6}
                kind="error"
                title={t('admin.marketing.rechargePackages.loadFailed', '充值套餐加载失败')}
                description={loadError}
                onRetry={() => void loadRechargePackages()}
              />
            ) : packages.length === 0 ? (
              <BusinessStateTableRow
                colSpan={6}
                kind="empty"
                title={t('admin.marketing.rechargePackages.empty', '暂无充值套餐')}
                description={t('admin.marketing.rechargePackages.emptyDescription', '请先创建充值套餐，用户才能购买账户积分。')}
                action={{ label: t('admin.marketing.rechargePackages.createAction', '创建套餐'), onClick: openCreateModal }}
              />
            ) : packages.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                <td className="px-4 py-3"><CopyableText text={item.id} /></td>
                <td className="px-4 py-3 font-mono text-slate-900 dark:text-slate-200">CNY {item.rmb}</td>
                <td className="px-4 py-3 font-mono">{item.bonus}</td>
                <td className="px-4 py-3 font-mono font-semibold text-emerald-600 dark:text-emerald-400">{item.points}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${item.status === 'active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'}`}>
                    {item.status === 'active' ? t("admin.marketing.index.text.5pm2ma", "启用") : t("admin.marketing.index.text.6q9o5l", "停用")}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button onClick={() => openEditModal(item)} className="px-2 py-1 text-xs border border-blue-200 hover:border-blue-300 dark:border-blue-900 dark:hover:border-blue-700 text-blue-600 dark:text-blue-400 rounded transition-colors flex items-center gap-1 bg-blue-50 dark:bg-blue-500/10">
                      <Edit className="w-3.5 h-3.5" /> {t("admin.group.index.text.qreyeg", "编辑")}</button>
                    <button onClick={() => setDeleteTarget(item)} className="px-2 py-1 text-xs border border-red-200 hover:border-red-300 dark:border-red-900 dark:hover:border-red-700 text-red-600 dark:text-red-400 rounded transition-colors flex items-center gap-1 bg-red-50 dark:bg-red-500/10">
                      <Trash2 className="w-3.5 h-3.5" /> {t("admin.group.index.text.1t2vi4h", "删除")}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-500" /> {editingPackage ? t("admin.marketing.index.text.xry0iu", "编辑充值套餐") : t("admin.marketing.index.text.wu04dq", "创建充值套餐")}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPackage} className="flex flex-col">
              <div className="p-5 space-y-4">
                {mutationError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                    {mutationError}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t("admin.marketing.index.text.1dxqhn5", "售价 (CNY)")}</label>
                    <input required name="rmb" type="number" min="0.01" step="0.01" defaultValue={editingPackage?.rmb ?? ''} placeholder="10.00" className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white font-mono" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t("admin.marketing.index.text.15b56z", "赠送积分")}</label>
                    <input required name="bonus" type="number" min="0" step="1" defaultValue={editingPackage?.bonus ?? 0} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t("admin.finance.index.text.1ccx4t4", "状态")}</label>
                  <select name="status" defaultValue={editingPackage?.status ?? 'active'} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white">
                    <option value="active">{t("admin.marketing.index.text.5pm2ma", "启用")}</option>
                    <option value="inactive">{t("admin.marketing.index.text.6q9o5l", "停用")}</option>
                  </select>
                </div>
              </div>
              <div className="p-5 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3 bg-slate-50 dark:bg-[#121212]">
                <button type="button" onClick={closeModal} disabled={saving} className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1a1a1a] border border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors disabled:opacity-60">
                  {t("admin.group.index.text.1589w37", "取消")}</button>
                <button type="submit" disabled={saving} className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors disabled:opacity-60">
                  {saving ? t("admin.marketing.index.text.rr6ulf", "保存中...") : t("admin.marketing.index.text.1vqgjcf", "保存套餐")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title={t("admin.marketing.index.text.13hn8xc", "删除充值套餐？")}
          description={t(
            "admin.marketing.index.text.deleteRechargePackageDescription",
            "套餐 \"{{id}}\" 将从可购买列表中移除。",
            { id: deleteTarget.id },
          )}
          confirmLabel={t("admin.marketing.index.text.nqbe2e", "删除套餐")}
          tone="danger"
          icon={<Trash2 className="h-4 w-4" />}
          isBusy={deletingPackageId === deleteTarget.id}
          onConfirm={() => void executeDeletePackage()}
          onCancel={closeDeleteConfirmation}
        />
      )}
    </div>
  );
}

function ExchangeRulesView({ search, setSearch }: { search: string, setSearch: (s: string) => void }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [rules, setRules] = useState<ExchangeRule[]>([]);
  const [saving, setSaving] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [rateInput, setRateInput] = useState('');

  const loadExchangeRules = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await MarketingService.listExchangeRules({
        sourceAssetType: 'POINTS',
        targetAssetType: 'CASH',
        status: 'active',
      });
      if (isActive()) {
        setRules(data);
        setRateInput(data[0]?.rate ?? '');
      }
    } catch (error) {
      if (isActive()) {
        setLoadError(getLoadErrorMessage(error, 'Failed to load exchange rules.'));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    void loadExchangeRules(() => active);
    return () => {
      active = false;
    };
  }, [loadExchangeRules]);

  const handleSubmitRule = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMutationError(null);
    try {
      const updated = await MarketingService.upsertExchangeRule(createExchangeRuleInputFromForm(new FormData(event.currentTarget)));
      setRules((current) => {
        const exists = current.some((item) => item.id === updated.id);
        return exists
          ? current.map((item) => item.id === updated.id ? updated : item)
          : [updated, ...current];
      });
      setRateInput(updated.rate);
    } catch (error) {
      setMutationError(getLoadErrorMessage(error, 'Failed to save exchange rule.'));
    } finally {
      setSaving(false);
    }
  };

  const normalizedSearch = search.trim().toLowerCase();
  const filteredRules = normalizedSearch
    ? rules.filter((rule) => [
      rule.id,
      rule.sourceAssetType,
      rule.targetAssetType,
      rule.rate,
      rule.status,
    ].some((value) => value.toLowerCase().includes(normalizedSearch)))
    : rules;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-5 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-[#121212]/50">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-400" />
          {t("admin.marketing.index.text.xfajks", "积分兑换规则")}</h3>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder={t("admin.marketing.index.text.18rfcuv", "搜索规则 ID 或兑换对...")} value={search} onChange={e => setSearch(e.target.value)} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-blue-500 w-64 text-slate-900 dark:text-white" />
        </div>
      </div>
      <div className="flex-1 overflow-auto p-5 space-y-5">
        <form onSubmit={handleSubmitRule} className="border border-slate-200 dark:border-white/10 rounded-lg bg-slate-50/70 dark:bg-[#121212]/50 p-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t("admin.marketing.index.text.f8t660", "兑换方向")}</label>
              <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 dark:text-white">
                {'POINTS -> CASH'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t("admin.marketing.index.text.1itp3zn", "兑换比例")}</label>
              <input required name="rate" type="text" inputMode="decimal" value={rateInput} onChange={(event) => setRateInput(event.target.value)} placeholder="120" className="w-full bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white font-mono" />
            </div>
            <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60">
              {saving ? t("admin.marketing.index.text.rr6ulf", "保存中...") : t("admin.marketing.index.text.1ejt00v", "保存规则")}
            </button>
          </div>
          {mutationError && (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              {mutationError}
            </div>
          )}
        </form>

        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden">
          <thead className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-white/10">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.1j9jcn", "规则 ID")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.f8t660", "兑换方向")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.1itp3zn", "兑换比例")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.finance.index.text.1ccx4t4", "状态")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5 bg-white dark:bg-transparent">
            {loading ? (
              <BusinessStateTableRow colSpan={4} kind="loading" title="Loading exchange rules..." />
            ) : loadError ? (
              <BusinessStateTableRow
                colSpan={4}
                kind="error"
                title="Exchange rules could not be loaded"
                description={loadError}
                onRetry={() => void loadExchangeRules()}
              />
            ) : filteredRules.length === 0 ? (
              <BusinessStateTableRow
                colSpan={4}
                kind="empty"
                title="No exchange rules found"
                description="Save the POINTS to CASH rule before users read the exchange rate."
              />
            ) : filteredRules.map((rule) => (
              <tr key={rule.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                <td className="px-4 py-3"><CopyableText text={rule.id} /></td>
                <td className="px-4 py-3 font-mono text-slate-900 dark:text-slate-200">{`${rule.sourceAssetType} -> ${rule.targetAssetType}`}</td>
                <td className="px-4 py-3 font-mono font-semibold text-blue-600 dark:text-blue-400">{rule.rate}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${statusBadgeClass(rule.status)}`}>{rule.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 5. 充值记录查询
function RechargeRecordsView({ search, setSearch }: { search: string, setSearch: (s: string) => void }) {
  const { t } = useTranslation();
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
          {t("admin.marketing.index.text.1pds24u", "系统充值流水账单")}</h3>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder={t("admin.marketing.index.text.1bid8rh", "搜索订单编号...")} value={search} onChange={e => setSearch(e.target.value)} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-blue-500 w-64 text-slate-900 dark:text-white" />
        </div>
      </div>
      <div className="flex-1 overflow-auto p-5">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden">
          <thead className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-white/10">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.1f90xvr", "时间")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.dnp122", "交易订单号")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.finance.index.text.3jrccd", "用户 ID")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.e9e7ob", "支付用户")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.1j7121", "实付金额")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.1w6h633", "到账额度 (USD)")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.igot2y", "支付方式")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.1wxmx95", "交易状态")}</th>
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
                  <span className={`px-2 py-1 rounded text-xs ${r.status === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>{r.status === 'success' ? t("admin.marketing.index.text.hxhd0b", "支付成功") : t("admin.marketing.index.text.crgtw4", "支付失败")}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PaymentAttemptsView({ search, setSearch }: { search: string, setSearch: (s: string) => void }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [paymentAttempts, setPaymentAttempts] = useState<PaymentAttempt[]>([]);

  const loadPaymentAttempts = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await MarketingService.listPaymentAttempts();
      if (isActive()) {
        setPaymentAttempts(data);
      }
    } catch (error) {
      if (isActive()) {
        setLoadError(getLoadErrorMessage(error, 'Failed to load payment attempts.'));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    void loadPaymentAttempts(() => active);
    return () => {
      active = false;
    };
  }, [loadPaymentAttempts]);

  const normalizedSearch = search.trim().toLowerCase();
  const filteredAttempts = normalizedSearch
    ? paymentAttempts.filter((item) => [
      item.id,
      item.orderNo,
      item.provider,
      item.amount,
      item.status,
      item.createdAt,
    ].some((value) => value.toLowerCase().includes(normalizedSearch)))
    : paymentAttempts;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-5 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-[#121212]/50">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <ListOrdered className="w-5 h-5 text-slate-400" />
          {t("admin.marketing.index.text.hm2nh9", "支付尝试流水")}</h3>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder={t("admin.marketing.index.text.epfkme", "搜索订单、支付 ID 或渠道...")} value={search} onChange={e => setSearch(e.target.value)} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-blue-500 w-64 text-slate-900 dark:text-white" />
        </div>
      </div>
      <div className="flex-1 overflow-auto p-5">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden">
          <thead className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-white/10">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.1f90xvr", "时间")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.5cjsa3", "支付 ID")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.14vvhet", "订单号")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.n152dg", "渠道")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.finance.index.text.1jl9r8z", "金额")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.finance.index.text.1ccx4t4", "状态")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5 bg-white dark:bg-transparent">
            {loading ? (
              <BusinessStateTableRow colSpan={6} kind="loading" title="Loading payment attempts..." />
            ) : loadError ? (
              <BusinessStateTableRow
                colSpan={6}
                kind="error"
                title="Payment attempts could not be loaded"
                description={loadError}
                onRetry={() => void loadPaymentAttempts()}
              />
            ) : filteredAttempts.length === 0 ? (
              <BusinessStateTableRow
                colSpan={6}
                kind="empty"
                title="No payment attempts found"
                description="Payment attempts will appear here after users create payment records."
              />
            ) : filteredAttempts.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                <td className="px-4 py-3 font-mono text-xs">{item.createdAt}</td>
                <td className="px-4 py-3"><CopyableText text={item.id} /></td>
                <td className="px-4 py-3 font-mono text-xs text-blue-600 dark:text-blue-400">{item.orderNo}</td>
                <td className="px-4 py-3 font-mono">{item.provider}</td>
                <td className="px-4 py-3 font-mono font-medium text-slate-900 dark:text-slate-200">{item.amount}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${statusBadgeClass(item.status)}`}>{item.status}</span>
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
  const { t } = useTranslation();
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
          {t("admin.marketing.index.text.zy1if1", "分销与分享推荐流水")}</h3>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder={t("admin.marketing.index.text.15znwdf", "搜索邀请人账号...")} value={search} onChange={e => setSearch(e.target.value)} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-blue-500 w-64 text-slate-900 dark:text-white" />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-5">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden">
          <thead className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-white/10">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.3loqtx", "邀请人账号")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.1perd8f", "专属短链")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.w5tqqx", "累计拉新成功")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.1mrdnr5", "下钻流水贡献")}</th>
              <th className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t("admin.marketing.index.text.1qi3vf4", "已发放佣金/额度")}</th>
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
                 <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">{r.total_invited} <span className="font-sans font-normal text-xs text-slate-500">{t("admin.marketing.index.text.1h3mm7h", "人")}</span></td>
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
