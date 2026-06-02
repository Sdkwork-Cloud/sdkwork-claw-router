import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AdminTableShell, BottomPagination, BusinessStateTableRow, ConfirmDialog, readMediaResourceUrl } from 'sdkwork-claw-router-commons';
import { Search, Plus, Cpu, X, Layers, Image as ImageIcon, MessageSquare, Headphones, ChevronRight, ChevronDown, Activity, Trash2, Edit, Music, Loader2, RefreshCw, Video, Volume2, Power, PowerOff, Globe2, ArrowRightLeft, Upload, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ModelService, SiteService, ModelMappingService, Vendor, Model, SiteItem, ModelMappingRule, ModelMappingCreateInput, KNOWN_VENDORS, selectPreferredModelVendorId } from './modelService';
import { MODEL_PRICING_REGIONS, createModelInputFromForm, createVendorInputFromForm, updateModelInputFromForm } from './modelForm';
export { ResourceAdmin } from './resourceAdmin';

type ModelModalityFilter = Model['type'];

export function ModelAdmin() {
  const { t } = useTranslation();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState<string>('v_openai');
  const [search, setSearch] = useState('');
  const [modalityFilters, setModalityFilters] = useState<ModelModalityFilter[]>([]);
  const [isModalityFilterOpen, setIsModalityFilterOpen] = useState(false);
  const modalityFilterRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Model | null>(null);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [deletingModelId, setDeletingModelId] = useState<string | null>(null);
  const [statusUpdatingModelId, setStatusUpdatingModelId] = useState<string | null>(null);
  const [selectedModality, setSelectedModality] = useState<Model['type']>('Chat');

  const [vendorSelection, setVendorSelection] = useState<string>('v_deepseek');
  const [vendorDesc, setVendorDesc] = useState<string>(KNOWN_VENDORS.find(v => v.id === 'v_deepseek')?.desc ?? '');
  const modelModalityFilterOptions: Array<{ value: ModelModalityFilter; label: string }> = [
    { value: 'Chat', label: t('admin.model.filters.llm') },
    { value: 'Image', label: t('admin.model.filters.image') },
    { value: 'Video', label: t('admin.model.filters.video') },
    { value: 'Audio', label: t('admin.model.filters.audio') },
    { value: 'SoundEffect', label: t('admin.model.filters.sfx') },
    { value: 'Music', label: t('admin.model.filters.music') },
    { value: 'Embedding', label: t('admin.model.filters.embedding') },
  ];

  const loadModels = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const { vendors: vList, models: mList } = await ModelService.fetchInitializedCatalog();
      setVendors(vList);
      setModels(mList);
      const nextSelectedVendorId = selectPreferredModelVendorId(vList, selectedVendorId);
      if (nextSelectedVendorId && nextSelectedVendorId !== selectedVendorId) {
        setSelectedVendorId(nextSelectedVendorId);
      }
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to load model catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadModels();
  }, []);

  const selectedVendor = vendors.find(v => v.id === selectedVendorId);
  const normalizedSearch = search.toLowerCase();
  const vendorModels = selectedVendor
    ? modelsForVendor(models, selectedVendor).filter(m =>
      (m.displayName.toLowerCase().includes(normalizedSearch) || m.model.toLowerCase().includes(normalizedSearch))
      && (modalityFilters.length === 0 || modalityFilters.includes(m.type))
    )
    : [];
  const paginatedVendorModels = vendorModels.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [selectedVendorId, search, modalityFilters]);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(vendorModels.length / pageSize));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [page, pageSize, vendorModels.length]);

  useEffect(() => {
    if (!isModalityFilterOpen) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (modalityFilterRef.current && modalityFilterRef.current.contains(target)) {
        return;
      }
      setIsModalityFilterOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isModalityFilterOpen]);

  const openVendorModal = () => {
    setVendorSelection('v_deepseek');
    setVendorDesc(KNOWN_VENDORS.find(v => v.id === 'v_deepseek')?.desc ?? '');
    setIsVendorModalOpen(true);
  };

  const selectedModalityFilterLabels = modelModalityFilterOptions
    .filter(option => modalityFilters.includes(option.value))
    .map(option => option.label);
  const modalityFilterLabel = selectedModalityFilterLabels.length > 0
    ? selectedModalityFilterLabels.join(', ')
    : t('admin.model.filters.allModalities');
  const modelPriceColumnClassName = "px-6 py-4 min-w-[168px] font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap";
  const modelPriceCellClassName = "px-6 py-4 min-w-[168px] whitespace-nowrap";
  const modelPricePillClassName = "flex min-w-[136px] justify-between items-center gap-3 bg-slate-50 dark:bg-white/5 px-2 py-0.5 rounded whitespace-nowrap";

  const toggleModalityFilter = (value: ModelModalityFilter) => {
    setPage(1);
    setModalityFilters(current => current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value],
    );
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);
    setLoadError(null);
    try {
      const { vendors: newVendors, models: newModels } = await ModelService.syncVendorsAndModels();
      setVendors(newVendors);
      setModels(newModels);
      setSelectedVendorId(selectPreferredModelVendorId(newVendors, selectedVendorId));
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to sync model catalog');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadError(null);
    const formData = new FormData(e.target as HTMLFormElement);
    const vendorInput = createVendorInputFromForm(formData, vendorSelection, KNOWN_VENDORS, vendorDesc);

    if (!vendorInput) return;

    try {
      const added = await ModelService.addVendor(vendorInput);
      setVendors([...vendors, added]);
      setIsVendorModalOpen(false);
      setSelectedVendorId(added.id);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to add model vendor');
    }
  };

  const handleAddModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendor) return;
    setLoadError(null);
    const formData = new FormData(e.target as HTMLFormElement);
    try {
      if (editingModel) {
        const updated = await ModelService.updateModel(
          editingModel.id,
          updateModelInputFromForm(formData, selectedVendor.id, editingModel),
        );
        setModels(models.map(model => model.id === updated.id ? updated : model));
        setEditingModel(null);
        setIsModelModalOpen(false);
        return;
      }
      const added = await ModelService.addModel(createModelInputFromForm(formData, selectedVendor.id));
      setModels([...models, added]);
      setIsModelModalOpen(false);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to save model');
    }
  };

  const openAddModelModal = () => {
    setEditingModel(null);
    setSelectedModality('Chat');
    setIsModelModalOpen(true);
  };

  const openEditModelModal = (model: Model) => {
    setEditingModel(model);
    setSelectedModality(model.type);
    setIsModelModalOpen(true);
  };

  const closeModelModal = () => {
    setEditingModel(null);
    setIsModelModalOpen(false);
  };

  const closeDeleteConfirmation = () => {
    if (deletingModelId) {
      return;
    }
    setDeleteTarget(null);
  };

  const executeDeleteModel = async () => {
    if (!deleteTarget) {
      return;
    }
    const id = deleteTarget.id;
    setDeletingModelId(id);
    setLoadError(null);
    try {
      const success = await ModelService.deleteModel(id);
      if (success) {
        setModels(current => current.filter(m => m.id !== id));
      }
      setDeleteTarget(null);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to delete model');
    } finally {
      setDeletingModelId(null);
    }
  };

  const toggleModelStatus = async (model: Model) => {
    const nextStatus: Model['status'] = model.status === 'active' ? 'inactive' : 'active';
    setStatusUpdatingModelId(model.id);
    setLoadError(null);
    try {
      const updated = await ModelService.updateModelStatus(model.id, nextStatus);
      setModels(current => current.map(item => item.id === updated.id ? updated : item));
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to update model status');
    } finally {
      setStatusUpdatingModelId(null);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Chat': return <MessageSquare className="w-3.5 h-3.5" />;
      case 'Image': return <ImageIcon className="w-3.5 h-3.5" />;
      case 'Audio': return <Headphones className="w-3.5 h-3.5" />;
      case 'Music': return <Music className="w-3.5 h-3.5" />;
      case 'SoundEffect': return <Volume2 className="w-3.5 h-3.5" />;
      case 'Video': return <Video className="w-3.5 h-3.5" />;
      case 'Embedding': return <Layers className="w-3.5 h-3.5" />;
      default: return <Cpu className="w-3.5 h-3.5" />;
    }
  };

  const getTypeLabel = (type: Model['type']) => t(modelTypeI18nKey(type));

  const formatContextTokens = (tokens: number | null) => {
    if (!Number.isFinite(tokens) || tokens <= 0) {
      return '-';
    }
    if (tokens >= 1_000_000) {
      return `${Number(tokens / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 1 })}M`;
    }
    if (tokens >= 1_000) {
      return `${Number(tokens / 1_000).toLocaleString(undefined, { maximumFractionDigits: 1 })}k`;
    }
    return tokens.toLocaleString();
  };

  const renderModalityParams = () => {
    const inputBaseCls = "w-full bg-white dark:bg-[#1a1a1a] border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white shadow-sm transition-all";
    const labelCls = "block text-xs font-medium text-slate-500 mb-1.5";

    const defaultCapability = selectedModality === 'Chat'
      ? { supportsStreaming: true, supportsTools: true, supportsJsonSchema: true }
      : { supportsStreaming: false, supportsTools: false, supportsJsonSchema: false };
    const supportsStreaming = editingModel?.supportsStreaming ?? defaultCapability.supportsStreaming;
    const supportsTools = editingModel?.supportsTools ?? defaultCapability.supportsTools;
    const supportsJsonSchema = editingModel?.supportsJsonSchema ?? defaultCapability.supportsJsonSchema;

    return (
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/10">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('admin.model.modelModal.capabilities')}</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>{t('admin.model.modelModal.maxOutputTokens')}</label>
            <input name="maxOutputTokens" type="number" min="0" step="1" defaultValue={editingModel?.maxOutputTokens ?? ''} placeholder={t('admin.model.modelModal.optionalPlaceholder')} className={inputBaseCls} />
          </div>
          <div>
            <label className={labelCls}>{t('admin.model.modelModal.supportedLanguages')}</label>
            <input name="supportedLanguages" type="text" defaultValue={editingModel?.supportedLanguages.join(', ') ?? ''} placeholder={t('admin.model.modelModal.supportedLanguagesPlaceholder')} className={inputBaseCls} />
          </div>
        </div>
        <div>
          <label className={labelCls}>{t('admin.model.modelModal.description')}</label>
          <textarea name="description" rows={2} defaultValue={editingModel?.description ?? ''} placeholder={t('admin.model.modelModal.descriptionPlaceholder')} className={`${inputBaseCls} resize-none`} />
        </div>
        <div>
          <label className={labelCls}>{t('admin.model.modelModal.capabilityIntro')}</label>
          <textarea name="capabilityIntro" rows={2} defaultValue={editingModel?.capabilityIntro ?? ''} placeholder={t('admin.model.modelModal.capabilityIntroPlaceholder')} className={`${inputBaseCls} resize-none`} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>{t('admin.model.modelModal.limitations')}</label>
            <textarea name="limitations" rows={2} defaultValue={editingModel?.limitations.join(', ') ?? ''} placeholder={t('admin.model.modelModal.limitationsPlaceholder')} className={`${inputBaseCls} resize-none`} />
          </div>
          <div>
            <label className={labelCls}>{t('admin.model.modelModal.useCases')}</label>
            <textarea name="useCases" rows={2} defaultValue={editingModel?.useCases.join(', ') ?? ''} placeholder={t('admin.model.modelModal.useCasesPlaceholder')} className={`${inputBaseCls} resize-none`} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm dark:border-white/10 dark:bg-[#1a1a1a] dark:text-slate-300">
            <input name="supportsStreaming" type="checkbox" defaultChecked={supportsStreaming} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
            {t('admin.model.modelModal.supportsStreaming')}
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm dark:border-white/10 dark:bg-[#1a1a1a] dark:text-slate-300">
            <input name="supportsTools" type="checkbox" defaultChecked={supportsTools} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
            {t('admin.model.modelModal.supportsTools')}
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm dark:border-white/10 dark:bg-[#1a1a1a] dark:text-slate-300">
            <input name="supportsJsonSchema" type="checkbox" defaultChecked={supportsJsonSchema} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
            {t('admin.model.modelModal.supportsJsonSchema')}
          </label>
        </div>
      </div>
    );
  };

  const renderPricingPanel = () => {
    const priceInputClassName = "w-full bg-white dark:bg-[#1a1a1a] border border-slate-300 dark:border-white/10 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white shadow-sm transition-all";
    const priceLabelClassName = "block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5";

    return (
      <aside className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-500/10 dark:bg-indigo-500/5">
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-300">{t('admin.model.modelModal.pricingRegionsTitle')}</h4>
          <div className="mt-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">{t('admin.model.modelModal.pricingTitle')}</div>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{t('admin.model.modelModal.regionPricingHint')}</p>
        </div>
        <div className="space-y-4">
          {MODEL_PRICING_REGIONS.map((region) => (
            <section key={region.code} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#121212]">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t(region.labelKey)}</div>
                <div className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-500 dark:bg-white/10 dark:text-slate-400">
                  {region.code}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={priceLabelClassName}>{t('admin.model.modelModal.inputUnitPrice')}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">$</span>
                    <input required={region.code === 'global'} name={`priceIn.${region.code}`} type="number" step="0.000001" defaultValue={region.code === 'global' ? editingModel?.priceIn ?? '' : ''} placeholder="0.01" className={priceInputClassName} />
                  </div>
                </div>
                <div>
                  <label className={priceLabelClassName}>{t('admin.model.modelModal.outputUnitPrice')}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">$</span>
                    <input required={region.code === 'global'} name={`priceOut.${region.code}`} type="number" step="0.000001" defaultValue={region.code === 'global' ? editingModel?.priceOut ?? '' : ''} placeholder="0.03" className={priceInputClassName} />
                  </div>
                </div>
                <div>
                  <label className={priceLabelClassName}>{t('admin.model.modelModal.cacheReadUnitPrice')}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">$</span>
                    <input name={`cacheReadPrice.${region.code}`} type="number" step="0.000001" defaultValue={region.code === 'global' ? editingModel?.cacheReadPrice ?? '' : ''} placeholder="0.00" className={priceInputClassName} />
                  </div>
                </div>
                <div>
                  <label className={priceLabelClassName}>{t('admin.model.modelModal.cacheWriteUnitPrice')}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">$</span>
                    <input name={`cacheWritePrice.${region.code}`} type="number" step="0.000001" defaultValue={region.code === 'global' ? editingModel?.cacheWritePrice ?? '' : ''} placeholder="0.00" className={priceInputClassName} />
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </aside>
    );
  };

  return (
    <div className="flex min-h-0 h-full w-full flex-col bg-slate-50 dark:bg-[#121212] rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-white/5">
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* SIDEBAR - VENDORS */}
        <div className="w-64 bg-white dark:bg-[#1a1a1a] border-r border-slate-200 dark:border-white/10 flex flex-col shrink-0">
          <div className="border-b border-slate-200 bg-slate-50/50 p-4 dark:border-white/10 dark:bg-[#121212]/50">
            <div className="flex items-center justify-between gap-2">
              <span className="min-w-0 truncate text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">{t('admin.model.vendorSidebar.title')}</span>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={handleSyncAll}
                  disabled={isSyncing}
                  className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-white/10 dark:hover:text-slate-200"
                  title={isSyncing ? t('common.actions.syncingCatalog') : t('common.actions.syncModelCatalog')}
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                </button>
                <button type="button" onClick={openVendorModal} className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400" title={t('common.actions.addModelVendor')}>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {vendors.map(v => {
              const isActive = selectedVendorId === v.id;
              const count = modelsForVendor(models, v).length;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVendorId(v.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all text-sm group ${
                    isActive
                    ? 'bg-indigo-50 dark:bg-indigo-500/10'
                    : 'hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-md ${v.color} flex items-center justify-center text-white shadow-sm shrink-0 font-medium`}>
                       {v.name.charAt(0).toUpperCase()}
                    </div>
                    <span className={`font-medium truncate ${isActive ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {v.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300' : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'}`}>
                      {count}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN AREA - MODELS LIST */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50 p-4 dark:bg-[#121212]">
          {selectedVendor ? (
            <AdminTableShell
              data-admin-model-table-card
              className="dark:bg-[#1a1a1a]"
              viewportProps={{ 'data-admin-model-table-viewport': true }}
              header={(
                <div className="border-b border-slate-200 p-3 dark:border-white/10">
                  <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-center">
                      <div className="relative min-w-0 md:w-[320px]">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder={t('admin.model.search.placeholder')}
                          value={search}
                          onChange={(event) => {
                            setPage(1);
                            setSearch(event.target.value);
                          }}
                          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        />
                      </div>
                      <div ref={modalityFilterRef} className="relative" data-admin-model-modality-filter>
                        <button
                          type="button"
                          aria-label={t('admin.model.filters.modality')}
                          onClick={() => setIsModalityFilterOpen(current => !current)}
                          className="inline-flex h-10 max-w-[280px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-indigo-500 dark:border-white/10 dark:bg-[#202020] dark:text-slate-200 dark:hover:border-white/20"
                        >
                          <span className="truncate">
                            {modalityFilterLabel}
                          </span>
                          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                        </button>
                        {isModalityFilterOpen ? (
                          <div className="absolute left-0 top-full z-30 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-2 shadow-lg dark:border-white/10 dark:bg-[#202020]">
                            <div className="flex items-center justify-between border-b border-slate-100 px-2 pb-2 dark:border-white/10">
                              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                {t('admin.model.filters.modality')}
                              </span>
                              {modalityFilters.length > 0 ? (
                                <button
                                  type="button"
                                  data-admin-model-modality-filter-clear
                                  onClick={() => {
                                    setPage(1);
                                    setModalityFilters([]);
                                  }}
                                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                                >
                                  {t('common.actions.clear')}
                                </button>
                              ) : null}
                            </div>
                            <div className="mt-2 space-y-1">
                              {modelModalityFilterOptions.map((option) => (
                                <label
                                  key={option.value}
                                  data-admin-model-modality-filter-option
                                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
                                >
                                  <input
                                    type="checkbox"
                                    checked={modalityFilters.includes(option.value)}
                                    onChange={() => toggleModalityFilter(option.value)}
                                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <span>{option.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <button onClick={openAddModelModal} className="inline-flex w-fit items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700">
                      <Plus className="w-4 h-4" /> {t('common.actions.addModel')}
                    </button>
                  </div>
                </div>
              )}
              footer={(
                <div data-admin-model-pagination>
                  <BottomPagination
                    page={page}
                    pageSize={pageSize}
                    itemCount={paginatedVendorModels.length}
                    hasNextPage={page * pageSize < vendorModels.length}
                    disabled={loading}
                    showingLabel={t('admin.model.pagination.showing')}
                    pageLabel={t('admin.model.pagination.page', { page })}
                    pageSizeLabel={t('admin.model.pagination.pageSize')}
                    previousLabel={t('common.actions.previousPage')}
                    nextLabel={t('common.actions.nextPage')}
                    onPreviousPage={() => setPage((current) => Math.max(1, current - 1))}
                    onNextPage={() => setPage((current) => current + 1)}
                    onPageSizeChange={(nextPageSize) => {
                      setPageSize(nextPageSize);
                      setPage(1);
                    }}
                  />
                </div>
              )}
            >
              <table className="w-full min-w-[960px] text-left text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        <thead className="sticky top-0 z-10 bg-slate-50/80 dark:bg-[#121212]/80 border-b border-slate-200 dark:border-white/10">
                          <tr>
                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">{t('admin.model.table.model')}</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">{t('admin.model.table.type')}</th>
                            <th className={modelPriceColumnClassName}>{t('admin.model.table.price')}</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">{t('admin.model.table.context')}</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">{t('admin.model.table.calls')}</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">{t('admin.model.table.status')}</th>
                            <th className="px-6 py-4 font-semibold text-right text-slate-700 dark:text-slate-300">{t('admin.model.table.actions')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                          {loading ? (
                            <BusinessStateTableRow colSpan={7} kind="loading" title={t('admin.model.state.loadingModels')} />
                          ) : loadError ? (
                            <BusinessStateTableRow
                              colSpan={7}
                              kind="error"
                              title={t('admin.model.state.modelsLoadError')}
                              description={loadError}
                              onRetry={() => { void loadModels(); }}
                              retryLabel={t('common.actions.retry')}
                            />
                          ) : vendorModels.length === 0 ? (
                            <BusinessStateTableRow
                              colSpan={7}
                              kind="empty"
                              title={t('admin.model.state.noModels')}
                              description={t('admin.model.state.noModelsDescription')}
                              action={{
                                label: t('common.actions.addModel'),
                                onClick: openAddModelModal,
                              }}
                            />
                          ) : paginatedVendorModels.map(m => (
                            <tr key={m.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors group">
                              <td className="px-6 py-4">
                                <div className="min-w-0">
                                  <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2.5">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                    <span className="truncate">{m.displayName}</span>
                                  </div>
                                  {m.displayName !== m.model ? (
                                    <div className="ml-4 mt-1 max-w-[280px] truncate font-mono text-xs text-slate-400 dark:text-slate-500">
                                      {m.model}
                                    </div>
                                  ) : null}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300 text-xs font-medium">
                                  {getTypeIcon(m.type)} {getTypeLabel(m.type)}
                                </span>
                              </td>
                              <td className={modelPriceCellClassName}>
                                <div className="flex flex-col gap-1 text-[11px] text-slate-500">
                                  <div className={modelPricePillClassName}>
                                     <span>{t('admin.model.pricing.input')}</span>
                                     <span className="font-mono text-slate-800 dark:text-slate-200">{formatPrice(m.priceIn)}</span>
                                  </div>
                                  <div className={modelPricePillClassName}>
                                     <span>{t('admin.model.pricing.output')}</span>
                                     <span className="font-mono text-slate-800 dark:text-slate-200">{formatPrice(m.priceOut)}</span>
                                  </div>
                                  <div className={modelPricePillClassName}>
                                     <span>{t('admin.model.pricing.cacheRead')}</span>
                                     <span className="font-mono text-slate-800 dark:text-slate-200">{formatPrice(m.cacheReadPrice)}</span>
                                  </div>
                                  <div className={modelPricePillClassName}>
                                     <span>{t('admin.model.pricing.cacheWrite')}</span>
                                     <span className="font-mono text-slate-800 dark:text-slate-200">{formatPrice(m.cacheWritePrice)}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="inline-flex px-2 py-1 text-xs font-mono bg-slate-50 border border-slate-200 text-slate-600 dark:bg-[#1a1a1a] dark:text-slate-400 dark:border-white/10 rounded-md">
                                  {formatContextTokens(m.contextTokens)}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-mono text-sm">
                                  <Activity className="w-3.5 h-3.5 text-emerald-500" /> {m.calls}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {m.status === 'active' ? (
                                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-xs font-medium border border-emerald-200/50 dark:border-emerald-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {t('admin.model.status.active')}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400 text-xs font-medium border border-slate-200 dark:border-white/10">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> {t('admin.model.status.inactive')}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => { void toggleModelStatus(m); }}
                                    disabled={statusUpdatingModelId === m.id}
                                    className={m.status === 'active'
                                      ? "p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:text-amber-400 dark:hover:bg-amber-500/10 rounded-lg transition-colors"
                                      : "p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:text-emerald-400 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"}
                                    title={m.status === 'active' ? t('common.actions.disable') : t('common.actions.enable')}
                                  >
                                    {statusUpdatingModelId === m.id ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : m.status === 'active' ? (
                                      <PowerOff className="w-4 h-4" />
                                    ) : (
                                      <Power className="w-4 h-4" />
                                    )}
                                  </button>
                                  <button onClick={() => openEditModelModal(m)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-500/10 rounded-lg transition-colors" title={t('common.actions.edit')}>
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => setDeleteTarget(m)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title={t('common.actions.delete')}>
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
              </table>
                 </AdminTableShell>
          ) : (
             <div className="flex-1 flex items-center justify-center flex-col text-slate-400">
               <Layers className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" />
               <p>{t('admin.model.state.selectVendor')}</p>
             </div>
          )}
        </div>
      </div>

      {/* ADD VENDOR MODAL */}
      {isVendorModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('admin.model.vendorModal.title')}</h3>
              <button onClick={() => setIsVendorModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddVendor} className="flex flex-col">
              <div className="p-5 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('admin.model.vendorModal.vendorBrand')}</label>
                  <div className="relative mb-3">
                    <select
                      value={vendorSelection}
                      onChange={e => {
                        setVendorSelection(e.target.value);
                        const found = KNOWN_VENDORS.find(v => v.id === e.target.value);
                        if(found && e.target.value !== 'custom') {
                          setVendorDesc(found.desc);
                        } else {
                          setVendorDesc('');
                        }
                      }}
                      className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white shadow-sm transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>{t('admin.model.vendorModal.selectPlaceholder')}</option>
                      {KNOWN_VENDORS.map(v => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    </select>
                    <ChevronRight className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
                  </div>
                  {vendorSelection === 'custom' && (
                    <input required name="customName" type="text" placeholder={t('admin.model.vendorModal.customNamePlaceholder')} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white shadow-sm transition-all animate-in fade-in slide-in-from-top-2" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('admin.model.vendorModal.description')}</label>
                  <textarea name="description" value={vendorDesc} onChange={e => setVendorDesc(e.target.value)} rows={3} placeholder={t('admin.model.vendorModal.descriptionPlaceholder')} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white shadow-sm transition-all resize-none"></textarea>
                </div>
              </div>
              <div className="p-5 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3 bg-slate-50 dark:bg-[#121212]">
                <button type="button" onClick={() => setIsVendorModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-colors border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1a1a1a]">
                  {t('common.actions.cancel')}
                </button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors border border-transparent">
                  {t('common.actions.addModelVendor')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD MODEL MODAL */}
      {isModelModalOpen && selectedVendor && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm shadow-2xl">
          <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <Plus className="w-5 h-5 text-indigo-500" />
                 {editingModel ? t('admin.model.modelModal.editTitle') : t('admin.model.modelModal.connectTitle')} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">{selectedVendor.name}</span>
              </h3>
              <button onClick={closeModelModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddModel} className="flex flex-col">
              <div className="grid max-h-[calc(100vh-12rem)] grid-cols-1 gap-6 overflow-y-auto p-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('admin.model.modelModal.modelId')}</label>
                      <input required name="model" type="text" defaultValue={editingModel?.model ?? ''} placeholder={t('admin.model.modelModal.modelIdPlaceholder')} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white shadow-sm transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('admin.model.modelModal.displayName')}</label>
                      <input name="displayName" type="text" defaultValue={editingModel && editingModel.displayName !== editingModel.model ? editingModel.displayName : ''} placeholder={t('admin.model.modelModal.displayNamePlaceholder')} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white shadow-sm transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('admin.model.modelModal.modelType')}</label>
                      <div className="relative">
                        <select required name="type" value={selectedModality} onChange={e => setSelectedModality(e.target.value as Model['type'])} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white shadow-sm transition-all appearance-none cursor-pointer">
                          <option value="Video">{t('admin.model.modelTypes.video')}</option>
                          <option value="Chat">{t('admin.model.modelTypes.chat')}</option>
                          <option value="Image">{t('admin.model.modelTypes.image')}</option>
                          <option value="Audio">{t('admin.model.modelTypes.audio')}</option>
                          <option value="Music">{t('admin.model.modelTypes.music')}</option>
                          <option value="SoundEffect">{t('admin.model.modelTypes.soundEffect')}</option>
                          <option value="Embedding">{t('admin.model.modelTypes.embedding')}</option>
                        </select>
                        <ChevronRight className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('admin.model.modelModal.contextWindow')}</label>
                      <input name="contextTokens" type="text" defaultValue={editingModel ? String(editingModel.contextTokens) : ''} placeholder={t('admin.model.modelModal.contextPlaceholder')} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white shadow-sm transition-all" />
                    </div>
                  </div>

                  {renderModalityParams()}
                </div>

                {renderPricingPanel()}
              </div>

              <div className="p-5 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3 bg-slate-50 dark:bg-[#121212] rounded-b-2xl">
                <button type="button" onClick={closeModelModal} className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-colors border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1a1a1a]">
                  {t('common.actions.cancel')}
                </button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors border border-transparent">
                  {editingModel ? t('common.actions.saveModelChanges') : t('common.actions.confirmAndEnableModel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title={t('admin.model.delete.title')}
          description={t('admin.model.delete.description', { name: deleteTarget.displayName })}
          confirmLabel={t('admin.model.delete.confirm')}
          tone="danger"
          icon={<Trash2 className="h-4 w-4" />}
          isBusy={deletingModelId === deleteTarget.id}
          onConfirm={() => void executeDeleteModel()}
          onCancel={closeDeleteConfirmation}
        />
      )}
    </div>
  );
}

function modelsForVendor(models: readonly Model[], vendor: Vendor): Model[] {
  return models.filter((model) => model.vendorId === vendor.id || model.vendorCode === vendor.vendorCode);
}

function formatPrice(value: string): string {
  const normalized = value.trim();
  return normalized ? `$${normalized}` : '-';
}

function modelTypeI18nKey(type: Model['type']): string {
  switch (type) {
    case 'Video':
      return 'admin.model.modelTypes.video';
    case 'Chat':
      return 'admin.model.modelTypes.chat';
    case 'Image':
      return 'admin.model.modelTypes.image';
    case 'Audio':
      return 'admin.model.modelTypes.audio';
    case 'Music':
      return 'admin.model.modelTypes.music';
    case 'SoundEffect':
      return 'admin.model.modelTypes.soundEffect';
    case 'Embedding':
      return 'admin.model.modelTypes.embedding';
  }
}

export function SiteAdmin() {
  const { t } = useTranslation();
  const [sites, setSites] = useState<SiteItem[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<SiteItem | null>(null);
  const selectedSite = sites.find((site) => site.id === selectedSiteId) ?? null;

  const loadSites = async (query = search) => {
    setLoading(true);
    setLoadError(null);
    try {
      const normalizedQuery = query.trim();
      const [items, vendorItems] = await Promise.all([
        normalizedQuery ? SiteService.fetchSites(normalizedQuery) : SiteService.fetchSites(),
        ModelService.fetchVendors(),
      ]);
      setSites(items);
      setVendors(vendorItems);
      const nextSelectedId = items.some((item) => item.id === selectedSiteId)
        ? selectedSiteId
        : items[0]?.id ?? null;
      setSelectedSiteId(nextSelectedId);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to load sites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSites();
  }, []);

  const openCreateSite = () => {
    setEditingSite(null);
    setIsSiteModalOpen(true);
  };

  const openEditSite = (site: SiteItem) => {
    setEditingSite(site);
    setIsSiteModalOpen(true);
  };

  const handleSiteSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setLoadError(null);
    try {
      const input = siteInputFromForm(formData);
      if (editingSite) {
        const updated = await SiteService.updateSite(editingSite.id, { ...input, siteCode: editingSite.siteCode });
        setSites((current) => current.map((site) => (site.id === updated.id ? updated : site)));
      } else {
        const created = await SiteService.createSite(input);
        setSites((current) => [...current, created]);
        setSelectedSiteId(created.id);
      }
      setIsSiteModalOpen(false);
      setEditingSite(null);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to save site');
    }
  };

  const handleDeleteSite = async (site: SiteItem) => {
    setLoadError(null);
    try {
      const deleted = await SiteService.deleteSite(site.id);
      if (deleted) {
        setSites((current) => current.filter((item) => item.id !== site.id));
        setSelectedSiteId((current) => (current === site.id ? null : current));
      }
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to delete site');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f10] text-slate-900 dark:text-slate-100">
      <AdminTableShell>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  void loadSites(search);
                }
              }}
              placeholder={t('admin.model.site.search.placeholder')}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => void loadSites(search)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4" />
              {t('common.actions.refresh')}
            </button>
            <button
              type="button"
              onClick={openCreateSite}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              {t('admin.model.site.actions.add')}
            </button>
          </div>
        </div>

        {loadError && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
            {loadError}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#171719]">
          <table className="w-full min-w-[1040px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-white/5 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3">{t('admin.model.site.table.name')}</th>
                <th className="px-5 py-3">{t('admin.model.site.table.baseUrl')}</th>
                <th className="px-5 py-3">{t('admin.model.site.table.domains')}</th>
                <th className="px-5 py-3">{t('admin.model.site.table.vendors')}</th>
                <th className="px-5 py-3">{t('admin.model.site.table.healthStatus')}</th>
                <th className="px-5 py-3">{t('admin.model.site.table.status')}</th>
                <th className="px-5 py-3 text-right">{t('admin.model.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/10">
              {loading ? (
                <BusinessStateTableRow colSpan={7} icon={<Loader2 className="h-5 w-5 animate-spin" />} title={t('admin.model.site.state.loading')} />
              ) : sites.length === 0 ? (
                <BusinessStateTableRow colSpan={7} icon={<Globe2 className="h-5 w-5" />} title={t('admin.model.site.state.empty')} />
              ) : sites.map((site) => (
                <tr
                  key={site.id}
                  className={`cursor-pointer transition hover:bg-slate-50 dark:hover:bg-white/5 ${selectedSite?.id === site.id ? 'bg-indigo-50/70 dark:bg-indigo-500/10' : ''}`}
                  onClick={() => setSelectedSiteId(site.id)}
                >
                  <td className="px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <SiteLogo site={site} />
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-slate-900 dark:text-white">{site.displayName}</div>
                        <div className="truncate text-xs text-slate-500">{site.siteName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{site.baseUrl}</td>
                  <td className="px-5 py-4">
                    <SiteDomainList site={site} />
                  </td>
                  <td className="px-5 py-4">
                    <SiteVendorList site={site} vendors={vendors} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill value={site.healthStatus} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill value={site.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={(event) => { event.stopPropagation(); openEditSite(site); }} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={(event) => { event.stopPropagation(); void handleDeleteSite(site); }} className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminTableShell>

      {isSiteModalOpen && (
        <SiteFormModal
          site={editingSite}
          vendors={vendors}
          onSubmit={handleSiteSubmit}
          onClose={() => { setIsSiteModalOpen(false); setEditingSite(null); }}
        />
      )}
    </div>
  );
}

type ModelMappingScopeFilter = ModelMappingRule['scopeType'] | 'all';

type ModelMappingRowDraft = {
  id: string;
  sourceModel: string;
  targetModel: string;
};

type ModelMappingFieldErrorKey = 'sourceVendorCode' | 'targetVendorCode' | 'channelCode' | 'mappingRows';
type ModelMappingRowFieldKey = 'sourceModel' | 'targetModel';
type ModelMappingRowErrors = Partial<Record<ModelMappingRowFieldKey, string>>;
type ModelMappingFormErrors = {
  message: string;
  fieldErrors: Partial<Record<ModelMappingFieldErrorKey, string>>;
  rowErrors: Record<string, ModelMappingRowErrors>;
  firstErrorKey: string | null;
};

const MODEL_MAPPING_MAX_ROWS = 100;
const MODEL_MAPPING_MODEL_VALUE_MAX_LENGTH = 512;

function SiteLogo({ site }: { site: SiteItem }) {
  const logoUrl = readMediaResourceUrl(site.logo);
  if (!logoUrl) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400 dark:border-white/10 dark:bg-white/5">
        <Globe2 className="h-4 w-4" />
      </div>
    );
  }
  return (
    <img
      src={logoUrl}
      alt=""
      className="h-10 w-10 shrink-0 rounded-lg border border-slate-200 bg-white object-contain p-1 dark:border-white/10 dark:bg-white"
    />
  );
}

function SiteDomainList({ site }: { site: SiteItem }) {
  const domains = siteDomains(site);
  if (domains.length === 0) {
    return <span className="text-xs text-slate-400">-</span>;
  }
  return (
    <div className="flex max-w-[260px] flex-wrap gap-1.5">
      {domains.slice(0, 3).map((domain) => (
        <span key={domain} className="max-w-[180px] truncate rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300">
          {domain}
        </span>
      ))}
      {domains.length > 3 && (
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500 dark:bg-white/10 dark:text-slate-400">
          +{domains.length - 3}
        </span>
      )}
    </div>
  );
}

function SiteVendorList({ site, vendors }: { site: SiteItem; vendors: readonly Vendor[] }) {
  if (site.vendorCodes.length === 0) {
    return <span className="text-xs text-slate-400">-</span>;
  }
  return (
    <div className="flex max-w-[220px] flex-wrap gap-1.5">
      {site.vendorCodes.slice(0, 3).map((vendorCode) => (
        <span key={vendorCode} className="max-w-[150px] truncate rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200">
          {vendorLabel(vendorCode, vendors)}
        </span>
      ))}
      {site.vendorCodes.length > 3 && (
        <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
          +{site.vendorCodes.length - 3}
        </span>
      )}
    </div>
  );
}

export function ModelMappingAdmin() {
  const { t } = useTranslation();
  const [mappings, setMappings] = useState<ModelMappingRule[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [scopeFilter, setScopeFilter] = useState<ModelMappingScopeFilter>('global');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [editorError, setEditorError] = useState<ModelMappingFormErrors | null>(null);
  const [editingMapping, setEditingMapping] = useState<ModelMappingRule | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const loadMappings = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const items = await ModelMappingService.fetchMappings({
        scopeType: scopeFilter,
        sourceModel: search.trim() || null,
      });
      setMappings(items);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to load model mappings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMappings();
  }, [scopeFilter]);

  const loadCatalog = async () => {
    setCatalogLoading(true);
    setCatalogError(null);
    try {
      const { vendors: vendorList, models: modelList } = await ModelService.fetchInitializedCatalog();
      setVendors(vendorList);
      setModels(modelList);
    } catch (error) {
      setCatalogError(error instanceof Error ? error.message : 'Failed to load model catalog');
    } finally {
      setCatalogLoading(false);
    }
  };

  useEffect(() => {
    void loadCatalog();
  }, []);

  const filteredMappings = mappings.filter((mapping) => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return true;
    }
    return [
      mapping.sourceModel,
      mapping.targetModel,
      mapping.vendorCode,
      mapping.channelCode,
      mapping.targetVendorCode,
    ].some((value) => (value ?? '').toLowerCase().includes(query));
  });

  const openCreateMapping = () => {
    setEditingMapping(null);
    setEditorError(null);
    setLoadError(null);
    setIsEditorOpen(true);
  };

  const openCreateMappingWithScope = (scopeType: ModelMappingRule['scopeType']) => {
    setScopeFilter(scopeType);
    openCreateMapping();
  };

  const openEditMapping = (mapping: ModelMappingRule) => {
    setEditingMapping(mapping);
    setEditorError(null);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    if (saving) {
      return;
    }
    setIsEditorOpen(false);
    setEditingMapping(null);
    setEditorError(null);
  };

  const clearEditorFieldError = (field: ModelMappingFieldErrorKey) => {
    setEditorError((current) => clearModelMappingFormFieldError(current, field));
  };

  const clearEditorRowError = (rowId: string, field: ModelMappingRowFieldKey) => {
    setEditorError((current) => clearModelMappingFormRowError(current, rowId, field));
  };

  const handleSaveMapping = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setLoadError(null);
    setEditorError(null);
    const formData = new FormData(event.currentTarget);
    try {
      const inputs = modelMappingInputsFromForm(formData);
      if (editingMapping) {
        const [firstInput] = inputs;
        const updated = await ModelMappingService.updateMapping(editingMapping.id, firstInput);
        setMappings((current) => current.map((item) => item.id === updated.id ? updated : item));
      } else {
        const created = await Promise.all(inputs.map((input) => ModelMappingService.createMapping(input)));
        setMappings((current) => [...created, ...current]);
      }
      setIsEditorOpen(false);
      setEditingMapping(null);
      setEditorError(null);
    } catch (error) {
      setEditorError(modelMappingFormErrorsFromError(error));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMapping = async (mapping: ModelMappingRule) => {
    setLoadError(null);
    try {
      const deleted = await ModelMappingService.deleteMapping(mapping.id);
      if (deleted) {
        setMappings((current) => current.filter((item) => item.id !== mapping.id));
      }
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to delete model mapping');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0f0f10] dark:text-white">
      <AdminTableShell
        header={(
          <div className="border-b border-slate-200 px-5 py-4 dark:border-white/10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                {([
                  { value: 'global', label: t('admin.model.mapping.scope.global') },
                  { value: 'vendor', label: t('admin.model.mapping.scope.vendor') },
                  { value: 'channel', label: t('admin.model.mapping.scope.channel') },
                  { value: 'all', label: t('admin.model.mapping.scope.all') },
                ] as Array<{ value: ModelMappingScopeFilter; label: string }>).map((tab) => (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setScopeFilter(tab.value)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      scopeFilter === tab.value
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative w-full sm:w-[22rem]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        void loadMappings();
                      }
                    }}
                    placeholder={t('admin.model.mapping.search.placeholder')}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
                <button type="button" onClick={() => openCreateMappingWithScope(scopeFilter === 'all' ? 'global' : scopeFilter)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
                  <Plus className="h-4 w-4" />
                  {t('admin.model.mapping.actions.add')}
                </button>
              </div>
            </div>
          </div>
        )}
      >
        {(loadError || catalogError) && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
            {loadError ?? catalogError}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#171719]">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-white/5 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3">{t('admin.model.mapping.table.scope')}</th>
                <th className="px-5 py-3">{t('admin.model.mapping.table.source')}</th>
                <th className="px-5 py-3">{t('admin.model.mapping.table.target')}</th>
                <th className="px-5 py-3">{t('admin.model.mapping.table.status')}</th>
                <th className="px-5 py-3 text-right">{t('admin.model.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/10">
              {loading ? (
                <BusinessStateTableRow colSpan={5} icon={<Loader2 className="h-5 w-5 animate-spin" />} title={t('admin.model.mapping.state.loading')} />
              ) : filteredMappings.length === 0 ? (
                <BusinessStateTableRow colSpan={5} icon={<ArrowRightLeft className="h-5 w-5" />} title={t('admin.model.mapping.state.empty')} />
              ) : filteredMappings.map((mapping) => (
                <tr key={mapping.id} className="transition hover:bg-slate-50 dark:hover:bg-white/5">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-900 dark:text-white">{t(`admin.model.mapping.scope.${mapping.scopeType}`)}</div>
                    <div className="mt-1 text-xs text-slate-500">{mappingScopeIdentity(mapping)}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-mono text-sm font-semibold text-slate-900 dark:text-white">{mapping.sourceModel}</div>
                    <div className="mt-1 text-xs text-slate-500">{mapping.sourceVendorCode ?? '-'}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-mono text-sm font-semibold text-slate-900 dark:text-white">{mapping.targetModel}</div>
                    <div className="mt-1 text-xs text-slate-500">{mapping.targetVendorCode ?? '-'}</div>
                  </td>
                  <td className="px-5 py-4"><StatusPill value={mapping.enabled ? 'active' : 'disabled'} /></td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => openEditMapping(mapping)} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => void handleDeleteMapping(mapping)} className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminTableShell>

      {isEditorOpen && (
        <ModelMappingFormModal
          mapping={editingMapping}
          vendors={vendors}
          models={models}
          catalogLoading={catalogLoading}
          saving={saving}
          error={editorError}
          defaultScopeType={scopeFilter === 'all' ? 'global' : scopeFilter}
          onClearFieldError={clearEditorFieldError}
          onClearRowError={clearEditorRowError}
          onSubmit={handleSaveMapping}
          onClose={closeEditor}
        />
      )}
    </div>
  );
}

function SiteFormModal({ site, vendors, onSubmit, onClose }: { site: SiteItem | null; vendors: readonly Vendor[]; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void; onClose: () => void }) {
  const { t } = useTranslation();
  const [logo, setLogo] = useState(() => site?.logo ?? null);
  const [isVendorPickerOpen, setIsVendorPickerOpen] = useState(false);
  const [selectedVendorCodes, setSelectedVendorCodes] = useState<string[]>(() => site?.vendorCodes ?? []);
  const logoPreviewUrl = readMediaResourceUrl(logo);
  const vendorByCode = useMemo(() => new Map(vendors.map((vendor) => [vendor.vendorCode, vendor])), [vendors]);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (result) {
        setLogo({
          kind: 'image',
          source: 'data_url',
          url: result,
          publicUrl: result,
          fileName: file.name,
          mimeType: file.type || 'image/*',
          sizeBytes: String(file.size),
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const selectVendorCode = (vendorCode: string) => {
    setSelectedVendorCodes((current) => current.includes(vendorCode) ? current : [...current, vendorCode]);
  };

  const removeSelectedVendorCode = (vendorCode: string) => {
    setSelectedVendorCodes((current) => current.filter((item) => item !== vendorCode));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#171719]">
        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-white/10">
          <h3 className="font-semibold text-slate-900 dark:text-white">{site ? t('admin.model.site.form.editTitle') : t('admin.model.site.form.createTitle')}</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={onSubmit} className="flex max-h-[82vh] flex-col">
          <input name="logo" type="hidden" value={logo ? JSON.stringify(logo) : ''} />
          <input name="vendorCodes" type="hidden" value={JSON.stringify(selectedVendorCodes)} />
          <div data-admin-site-form-layout className="grid min-h-0 flex-1 gap-0 overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]">
            <div className="min-h-0 overflow-y-auto p-5">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormInput name="siteName" label={t('admin.model.site.form.siteName')} defaultValue={site?.siteName} required />
                  <FormInput name="displayName" label={t('admin.model.site.form.displayName')} defaultValue={site?.displayName} required />
                  <FormInput name="baseUrl" label={t('admin.model.site.form.baseUrl')} defaultValue={site?.baseUrl} required />
                  <FormInput name="websiteUrl" label={t('admin.model.site.form.websiteUrl')} defaultValue={site?.websiteUrl ?? ''} />
                  <FormInput name="docsUrl" label={t('admin.model.site.form.docsUrl')} defaultValue={site?.docsUrl ?? ''} />
                  <FormInput name="regionCode" label={t('admin.model.site.form.regionCode')} defaultValue={site?.regionCode ?? ''} />
                  <FormInput name="maskedLabel" label={t('admin.model.site.form.maskedLabel')} defaultValue="" />
                </div>

                <div className="grid gap-4 sm:grid-cols-[220px_minmax(0,1fr)]">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{t('admin.model.site.form.logo')}</span>
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5">
                        {logoPreviewUrl ? (
                          <img src={logoPreviewUrl} alt="" className="h-full w-full rounded-xl object-contain p-1" />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                      <span className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10">
                        <Upload className="h-4 w-4" />
                        {t('admin.model.site.form.uploadLogo')}
                        <input type="file" accept="image/*" onChange={handleLogoChange} className="sr-only" />
                      </span>
                    </div>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{t('admin.model.site.form.domains')}</span>
                    <textarea
                      name="domains"
                      defaultValue={siteDomains(site).join('\n')}
                      rows={4}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </label>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{t('admin.model.site.form.description')}</label>
                  <textarea name="description" defaultValue={site?.description ?? ''} rows={3} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-white" />
                </div>
              </div>
            </div>
            <aside data-admin-site-supported-vendors-panel className="flex min-h-0 flex-col border-t border-slate-200 bg-slate-50/70 p-5 dark:border-white/10 dark:bg-[#121214] lg:border-l lg:border-t-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{t('admin.model.site.form.supportedVendors')}</h4>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('admin.model.site.form.supportedVendorsHint')}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsVendorPickerOpen(true)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t('admin.model.site.form.selectVendors')}
                </button>
              </div>
              <div data-admin-site-supported-vendor-table className="mt-4 min-h-0 flex-1 overflow-auto rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#171719]">
                {selectedVendorCodes.length === 0 ? (
                  <div className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">{t('admin.model.site.form.noVendors')}</div>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-slate-50 text-xs font-semibold text-slate-500 dark:bg-[#121214] dark:text-slate-400">
                      <tr>
                        <th className="px-3 py-2">{t('admin.model.site.form.vendorColumns.vendor')}</th>
                        <th className="px-3 py-2">{t('admin.model.site.form.vendorColumns.code')}</th>
                        <th className="px-3 py-2">{t('admin.model.site.form.vendorColumns.status')}</th>
                        <th className="px-3 py-2 text-right">{t('admin.model.table.actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                      {selectedVendorCodes.map((vendorCode) => {
                        const vendor = vendorByCode.get(vendorCode);
                        return (
                          <tr key={vendorCode} data-admin-site-supported-vendor-row className="hover:bg-slate-50 dark:hover:bg-white/5">
                            <td className="min-w-0 px-3 py-2">
                              <div className="truncate font-medium text-slate-900 dark:text-white">{vendor?.name ?? vendorCode}</div>
                            </td>
                            <td className="px-3 py-2 font-mono text-xs text-slate-500">{vendorCode}</td>
                            <td className="px-3 py-2 text-xs text-slate-500">{vendor?.status ?? '-'}</td>
                            <td className="px-3 py-2">
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  data-admin-site-supported-vendor-remove
                                  onClick={() => removeSelectedVendorCode(vendorCode)}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
                                  title={t('admin.model.site.form.removeVendor')}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </aside>
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-200 p-5 dark:border-white/10">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 dark:border-white/10 dark:text-slate-200">Cancel</button>
            <button type="submit" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Save</button>
          </div>
        </form>
      </div>
      {isVendorPickerOpen && (
        <VendorPickerModal
          vendors={vendors}
          title={t('admin.model.site.form.supportedVendors')}
          searchPlaceholder={t('admin.model.mapping.form.vendorPicker.searchPlaceholder')}
          onSelect={(vendor) => {
            selectVendorCode(vendor.vendorCode);
            setIsVendorPickerOpen(false);
          }}
          onClose={() => setIsVendorPickerOpen(false)}
        />
      )}
    </div>
  );
}

function ModelMappingFormModal({
  mapping,
  vendors,
  models,
  catalogLoading,
  saving,
  error,
  defaultScopeType,
  onClearFieldError,
  onClearRowError,
  onSubmit,
  onClose,
}: {
  mapping: ModelMappingRule | null;
  vendors: readonly Vendor[];
  models: readonly Model[];
  catalogLoading: boolean;
  saving: boolean;
  error: ModelMappingFormErrors | null;
  defaultScopeType: ModelMappingRule['scopeType'];
  onClearFieldError: (field: ModelMappingFieldErrorKey) => void;
  onClearRowError: (rowId: string, field: ModelMappingRowFieldKey) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [scopeType, setScopeType] = useState<ModelMappingRule['scopeType']>(mapping?.scopeType ?? defaultScopeType);
  const [activeVendorPicker, setActiveVendorPicker] = useState<'source' | 'target' | null>(null);
  const [sourceVendorCode, setSourceVendorCode] = useState<string>(mapping?.sourceVendorCode ?? '');
  const [targetVendorCode, setTargetVendorCode] = useState<string>(mapping?.targetVendorCode ?? '');
  const [scopeChannelCode, setScopeChannelCode] = useState<string>(mapping?.channelCode ?? '');
  const [mappingRows, setMappingRows] = useState<ModelMappingRowDraft[]>(() => [createMappingRowDraft(mapping)]);
  const sourceVendor = vendors.find((vendor) => vendor.vendorCode === sourceVendorCode) ?? null;
  const targetVendor = vendors.find((vendor) => vendor.vendorCode === targetVendorCode) ?? null;
  const fieldErrors = error?.fieldErrors ?? {};
  const rowErrors = error?.rowErrors ?? {};
  const firstErrorKey = error?.firstErrorKey ?? null;
  const sourceModels = useMemo(() => models.filter((model) => !sourceVendorCode || model.vendorCode === sourceVendorCode), [models, sourceVendorCode]);
  const targetModels = useMemo(() => models.filter((model) => !targetVendorCode || model.vendorCode === targetVendorCode), [models, targetVendorCode]);

  const syncScopeFields = (nextScope: ModelMappingRule['scopeType']) => {
    setScopeType(nextScope);
    if (nextScope === 'global') {
      setScopeChannelCode('');
    }
  };

  const clearFieldError = (field: ModelMappingFieldErrorKey) => {
    onClearFieldError(field);
  };

  const clearRowError = (rowId: string, field: ModelMappingRowFieldKey) => {
    onClearRowError(rowId, field);
  };

  useEffect(() => {
    if (!firstErrorKey) {
      return;
    }
    const escapedKey = typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
      ? CSS.escape(firstErrorKey)
      : firstErrorKey.replace(/["\\]/gu, '\\$&');
    const target = document.querySelector<HTMLElement>(`[data-model-mapping-error-key="${escapedKey}"]`);
    target?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    target?.focus?.();
  }, [firstErrorKey]);

  const handleVendorSelect = (kind: 'source' | 'target', vendor: Vendor) => {
    if (kind === 'source') {
      setSourceVendorCode(vendor.vendorCode);
      clearFieldError('sourceVendorCode');
      setMappingRows((current) => syncRowsForVendor(current, 'sourceModel', vendor.vendorCode, models));
      return;
    }
    setTargetVendorCode(vendor.vendorCode);
    clearFieldError('targetVendorCode');
    setMappingRows((current) => syncRowsForVendor(current, 'targetModel', vendor.vendorCode, models));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="flex h-[90vh] w-full max-w-[84rem] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#171719]">
        <div className="shrink-0 flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{mapping ? t('admin.model.mapping.form.editTitle') : t('admin.model.mapping.form.createTitle')}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('admin.model.mapping.form.helper')}</p>
          </div>
          <button type="button" onClick={onClose} disabled={saving} className="text-slate-400 hover:text-slate-600 disabled:opacity-50">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            writeHiddenFormValue(form, 'scopeType', scopeType);
            writeHiddenFormValue(form, 'sourceVendorCode', sourceVendorCode);
            writeHiddenFormValue(form, 'targetVendorCode', targetVendorCode);
            writeHiddenFormValue(form, 'channelCode', scopeType === 'channel' ? scopeChannelCode : '');
            writeHiddenFormValue(form, 'vendorCode', scopeType === 'vendor' ? sourceVendorCode : '');
            writeHiddenFormValue(form, 'rowsJson', JSON.stringify(mappingRows));
            onSubmit(event);
          }}
          className="flex min-h-0 flex-1 flex-col space-y-5 overflow-y-auto p-5"
        >
          <input name="scopeType" type="hidden" value={scopeType} />
          <input name="channelCode" type="hidden" value={scopeType === 'channel' ? scopeChannelCode : ''} />
          <input name="sourceVendorCode" type="hidden" value={sourceVendorCode} />
          <input name="targetVendorCode" type="hidden" value={targetVendorCode} />
          <input name="rowsJson" type="hidden" value={JSON.stringify(mappingRows)} />
          <input name="vendorCode" type="hidden" value={scopeType === 'vendor' ? sourceVendorCode : ''} />
          {error?.message && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
              {error.message}
            </div>
          )}
          <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{t('admin.model.mapping.form.scopeTitle')}</h4>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('admin.model.mapping.form.scopeHint')}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 dark:bg-[#171719] dark:text-slate-300 dark:ring-white/10">{t(`admin.model.mapping.scope.${scopeType}`)}</span>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{t('admin.model.mapping.form.scope')}</span>
                <select
                  value={scopeType}
                  onChange={(event) => syncScopeFields(event.target.value as ModelMappingRule['scopeType'])}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-white/10 dark:bg-[#171719] dark:text-white"
                >
                  <option value="global">{t('admin.model.mapping.scope.global')}</option>
                  <option value="vendor">{t('admin.model.mapping.scope.vendor')}</option>
                  <option value="channel">{t('admin.model.mapping.scope.channel')}</option>
                </select>
              </label>
              {scopeType === 'channel' && (
                <label className="mt-3 block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{t('admin.model.mapping.form.channelCode')}</span>
                  <input
                    value={scopeChannelCode}
                    onChange={(event) => {
                      setScopeChannelCode(event.target.value);
                      clearFieldError('channelCode');
                    }}
                    required
                    placeholder={t('admin.model.mapping.form.channelCode')}
                    aria-invalid={Boolean(fieldErrors.channelCode)}
                    data-model-mapping-error-key="channelCode"
                    className={`w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-1 dark:bg-[#171719] dark:text-white ${fieldErrors.channelCode ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500 dark:border-rose-500/50' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-white/10'}`}
                  />
                  {fieldErrors.channelCode && <span className="mt-1.5 block text-xs font-medium text-rose-600 dark:text-rose-300">{fieldErrors.channelCode}</span>}
                </label>
              )}
              <div className="mt-4 grid gap-3">
                <button
                  type="button"
                  onClick={() => setActiveVendorPicker('source')}
                  aria-invalid={Boolean(fieldErrors.sourceVendorCode)}
                  data-model-mapping-error-key="sourceVendorCode"
                  className={`rounded-xl border bg-white px-3 py-2 text-left text-sm text-slate-700 transition dark:bg-[#171719] dark:text-slate-200 ${fieldErrors.sourceVendorCode ? 'border-rose-300 hover:border-rose-400 hover:bg-rose-50 dark:border-rose-500/50 dark:hover:bg-rose-500/10' : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 dark:border-white/10 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-500/10'}`}
                >
                  <span className="block text-xs font-medium uppercase tracking-wide text-slate-400">{t('admin.model.mapping.form.sourceVendor')}</span>
                  <span className="mt-1 block truncate font-semibold">{sourceVendor?.name ?? (sourceVendorCode || t('admin.model.mapping.form.selectVendor'))}</span>
                  <span className="mt-1 block truncate text-xs text-slate-500">{sourceVendor?.vendorCode ?? (sourceVendorCode || '-')}</span>
                </button>
                {fieldErrors.sourceVendorCode && <span className="-mt-2 block text-xs font-medium text-rose-600 dark:text-rose-300">{fieldErrors.sourceVendorCode}</span>}
                <button
                  type="button"
                  onClick={() => setActiveVendorPicker('target')}
                  aria-invalid={Boolean(fieldErrors.targetVendorCode)}
                  data-model-mapping-error-key="targetVendorCode"
                  className={`rounded-xl border bg-white px-3 py-2 text-left text-sm text-slate-700 transition dark:bg-[#171719] dark:text-slate-200 ${fieldErrors.targetVendorCode ? 'border-rose-300 hover:border-rose-400 hover:bg-rose-50 dark:border-rose-500/50 dark:hover:bg-rose-500/10' : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 dark:border-white/10 dark:hover:border-indigo-500/10'}`}
                >
                  <span className="block text-xs font-medium uppercase tracking-wide text-slate-400">{t('admin.model.mapping.form.targetVendor')}</span>
                  <span className="mt-1 block truncate font-semibold">{targetVendor?.name ?? (targetVendorCode || t('admin.model.mapping.form.selectVendor'))}</span>
                  <span className="mt-1 block truncate text-xs text-slate-500">{targetVendor?.vendorCode ?? (targetVendorCode || '-')}</span>
                </button>
                {fieldErrors.targetVendorCode && <span className="-mt-2 block text-xs font-medium text-rose-600 dark:text-rose-300">{fieldErrors.targetVendorCode}</span>}
              </div>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#121214]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{t('admin.model.mapping.form.mappingRowsTitle')}</h4>
                </div>
                {!mapping && (
                  <button
                    type="button"
                    onClick={() => setMappingRows((current) => [...current, createMappingRowDraft(null)])}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:bg-[#171719] dark:text-slate-300 dark:hover:bg-white/10"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {t('admin.model.mapping.form.addRow')}
                  </button>
                )}
              </div>
              <ModelMappingRowsTable
                rows={mappingRows}
                sourceModels={sourceModels}
                targetModels={targetModels}
                loading={catalogLoading}
                searchPlaceholder={t('admin.model.mapping.form.modelPicker.searchPlaceholder')}
                inputPlaceholder={t('admin.model.mapping.form.modelInputPlaceholder')}
                fieldErrors={fieldErrors}
                rowErrors={rowErrors}
                onClearRowError={clearRowError}
                onChange={setMappingRows}
              />
            </section>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-white/10">
            <div className="text-xs text-slate-500 dark:text-slate-400">{t('admin.model.mapping.form.saveHint')}</div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={onClose} disabled={saving} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50 dark:border-white/10 dark:text-slate-200">
                {t('common.actions.cancel')}
              </button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {t('common.actions.save')}
              </button>
            </div>
          </div>
        </form>
        {activeVendorPicker && (
          <VendorPickerModal
            vendors={vendors}
            title={activeVendorPicker === 'source' ? t('admin.model.mapping.form.sourceVendor') : t('admin.model.mapping.form.targetVendor')}
            searchPlaceholder={t('admin.model.mapping.form.vendorPicker.searchPlaceholder')}
            onSelect={(vendor) => {
              handleVendorSelect(activeVendorPicker, vendor);
              setActiveVendorPicker(null);
            }}
            onClose={() => setActiveVendorPicker(null)}
          />
        )}
      </div>
    </div>
  );
}


function ModelMappingRowsTable({
  rows,
  sourceModels,
  targetModels,
  loading,
  searchPlaceholder,
  inputPlaceholder,
  fieldErrors,
  rowErrors,
  onClearRowError,
  onChange,
}: {
  rows: readonly ModelMappingRowDraft[];
  sourceModels: readonly Model[];
  targetModels: readonly Model[];
  loading: boolean;
  searchPlaceholder: string;
  inputPlaceholder: string;
  fieldErrors: Partial<Record<ModelMappingFieldErrorKey, string>>;
  rowErrors: Record<string, ModelMappingRowErrors>;
  onClearRowError: (rowId: string, field: ModelMappingRowFieldKey) => void;
  onChange: React.Dispatch<React.SetStateAction<ModelMappingRowDraft[]>>;
}) {
  const { t } = useTranslation();

  const updateRow = (rowId: string, field: ModelMappingRowFieldKey, value: string) => {
    onClearRowError(rowId, field);
    onChange((current) => current.map((row) => row.id === rowId ? { ...row, [field]: value } : row));
  };

  return (
    <div className="overflow-visible rounded-2xl border border-slate-200 dark:border-white/10">
      {fieldErrors.mappingRows && (
        <div
          tabIndex={-1}
          data-model-mapping-error-key="mappingRows"
          className="border-b border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 outline-none dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200"
        >
          {fieldErrors.mappingRows}
        </div>
      )}
      <table className="w-full table-fixed text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-white/5 dark:text-slate-400">
          <tr>
            <th className="w-1/2 px-3 py-2">{t('admin.model.mapping.form.sourceModel')}</th>
            <th className="w-1/2 px-3 py-2">{t('admin.model.mapping.form.targetModel')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/10">
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="px-3 py-2 align-top">
                <ModelComboboxCell
                  value={row.sourceModel}
                  models={sourceModels}
                  loading={loading}
                  searchPlaceholder={searchPlaceholder}
                  inputPlaceholder={inputPlaceholder}
                  errorMessage={rowErrors[row.id]?.sourceModel}
                  errorKey={`${row.id}.sourceModel`}
                  onChange={(value) => updateRow(row.id, 'sourceModel', value)}
                />
              </td>
              <td className="px-3 py-2 align-top">
                <ModelComboboxCell
                  value={row.targetModel}
                  models={targetModels}
                  loading={loading}
                  searchPlaceholder={searchPlaceholder}
                  inputPlaceholder={inputPlaceholder}
                  errorMessage={rowErrors[row.id]?.targetModel}
                  errorKey={`${row.id}.targetModel`}
                  onChange={(value) => updateRow(row.id, 'targetModel', value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ModelComboboxCell({
  value,
  models,
  loading,
  searchPlaceholder,
  inputPlaceholder,
  errorMessage,
  errorKey,
  onChange,
}: {
  value: string;
  models: readonly Model[];
  loading: boolean;
  searchPlaceholder: string;
  inputPlaceholder: string;
  errorMessage?: string;
  errorKey: string;
  onChange: (value: string) => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const rootRef = useRef<HTMLDivElement | null>(null);
  const filteredModels = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return models;
    }
    return models.filter((model) => [
      model.model,
      model.displayName,
      model.vendorCode,
      model.name,
    ].some((item) => item.toLowerCase().includes(query)));
  }, [models, search, value]);

  useEffect(() => {
    if (!open) {
      setSearch('');
      return undefined;
    }
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (rootRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <input
        value={value}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          onChange(event.target.value);
          setSearch(event.target.value);
          setOpen(true);
        }}
        placeholder={inputPlaceholder}
        aria-invalid={Boolean(errorMessage)}
        data-model-mapping-error-key={errorKey}
        className={`w-full rounded-xl border bg-white px-3 py-2 pr-9 text-sm font-mono text-slate-900 outline-none transition focus:ring-1 dark:bg-[#171719] dark:text-white ${errorMessage ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500 dark:border-rose-500/50' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-white/10'}`}
      />
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-slate-200"
        aria-label={searchPlaceholder}
      >
        <ChevronDown className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute left-0 right-0 z-[75] mt-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-white/10 dark:bg-[#171719]">
          <div className="max-h-64 space-y-1 overflow-y-auto">
            {loading ? (
              <div className="px-3 py-4 text-sm text-slate-500">{t('admin.model.mapping.form.loadingCatalog')}</div>
            ) : filteredModels.length === 0 ? (
              <div className="px-3 py-4 text-sm text-slate-500">{t('admin.model.mapping.form.noModels')}</div>
            ) : filteredModels.map((model) => {
              const checked = model.model === value;
              const optionClassName = [
                'flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition',
                checked
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200'
                  : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/10',
              ].join(' ');
              return (
                <button
                  key={model.id}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onChange(model.model);
                    setOpen(false);
                    setSearch('');
                  }}
                  className={optionClassName}
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{model.displayName}</span>
                    <span className="block truncate font-mono text-xs text-slate-500">{model.model}</span>
                  </span>
                  {checked && <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {errorMessage && <span className="mt-1.5 block text-xs font-medium text-rose-600 dark:text-rose-300">{errorMessage}</span>}
    </div>
  );
}

function VendorPickerModal({
  vendors,
  title,
  searchPlaceholder,
  onSelect,
  onClose,
}: {
  vendors: readonly Vendor[];
  title: string;
  searchPlaceholder: string;
  onSelect: (vendor: Vendor) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const filteredVendors = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return vendors;
    }
    return vendors.filter((vendor) => [
      vendor.name,
      vendor.vendorCode,
      vendor.description,
    ].some((value) => value.toLowerCase().includes(query)));
  }, [search, vendors]);

  return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#171719]">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h4>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('admin.model.mapping.form.vendorPicker.subtitle')}</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 p-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-white/10 dark:bg-[#121214] dark:text-white"
            />
          </div>
          <div className="max-h-[420px] space-y-2 overflow-y-auto">
            {filteredVendors.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
                {t('admin.model.mapping.form.noVendors')}
              </div>
            ) : filteredVendors.map((vendor) => (
              <button
                key={vendor.id}
                type="button"
                onClick={() => onSelect(vendor)}
                className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-white/10 dark:bg-white/5 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/10"
              >
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-slate-900 dark:text-white">{vendor.name}</span>
                  <span className="block truncate text-xs text-slate-500">{vendor.vendorCode}</span>
                </span>
                <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200 dark:bg-[#171719] dark:text-slate-300 dark:ring-white/10">
                  {vendor.status}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FormInput({ name, label, defaultValue, required = false }: { name: string; label: string; defaultValue?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <input name={name} defaultValue={defaultValue ?? ''} required={required} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-white" />
    </label>
  );
}

function StatusPill({ value }: { value: string }) {
  const tone = value === 'active' || value === 'healthy' || value === 'success'
    ? 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/30'
    : value === 'disabled' || value === 'unhealthy' || value === 'failed'
      ? 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/30'
      : 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/30';
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tone}`}>
      {value}
    </span>
  );
}

function siteInputFromForm(formData: FormData) {
  const siteName = readFormString(formData, 'siteName');
  const displayName = readFormString(formData, 'displayName') || siteName;
  return {
    siteCode: generateSiteCode(displayName || siteName),
    siteName,
    displayName,
    baseUrl: readFormString(formData, 'baseUrl'),
    description: readOptionalFormString(formData, 'description'),
    websiteUrl: readOptionalFormString(formData, 'websiteUrl'),
    docsUrl: readOptionalFormString(formData, 'docsUrl'),
    logo: readSiteLogoFromForm(formData),
    domains: parseMultilineFormList(formData, 'domains'),
    vendorCodes: parseJsonStringArrayFormValue(formData, 'vendorCodes'),
    regionCode: readOptionalFormString(formData, 'regionCode'),
    maskedLabel: readOptionalFormString(formData, 'maskedLabel'),
    siteType: 'relay' as const,
    environment: 'production' as const,
    status: 'active' as const,
  };
}

function siteDomains(site: SiteItem | null): string[] {
  if (!site) {
    return [];
  }
  const domains = site.domains.length > 0 ? site.domains : [site.baseUrl, site.websiteUrl, site.docsUrl].filter((value): value is string => Boolean(value));
  return domains
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

function vendorLabel(vendorCode: string, vendors: readonly Vendor[]): string {
  return vendors.find((vendor) => vendor.vendorCode === vendorCode)?.name ?? vendorCode;
}

function generateSiteCode(value: string): string {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/https?:\/\//u, '')
    .replace(/[^a-z0-9._-]+/gu, '_')
    .replace(/_+/gu, '_')
    .replace(/^[_\-.]+|[_\-.]+$/gu, '')
    .slice(0, 64);
  return normalized || `site_${Date.now().toString(36)}`;
}

function readSiteLogoFromForm(formData: FormData) {
  const value = readFormString(formData, 'logo');
  if (!value) {
    return null;
  }
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && typeof parsed.kind === 'string' && typeof parsed.source === 'string') {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

function parseMultilineFormList(formData: FormData, name: string): string[] {
  return readFormString(formData, name)
    .split(/[\n,]+/u)
    .map((value) => value.trim())
    .filter((value, index, values) => value.length > 0 && values.indexOf(value) === index);
}

function parseJsonStringArrayFormValue(formData: FormData, name: string): string[] {
  const value = readFormString(formData, name);
  if (!value) {
    return [];
  }
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter((item, index, values) => item.length > 0 && values.indexOf(item) === index);
    }
  } catch {
    return [];
  }
  return [];
}

function modelMappingInputsFromForm(formData: FormData): ModelMappingCreateInput[] {
  const scopeType = readMappingScopeType(formData);
  const errors = createEmptyModelMappingFormErrors();
  const sourceVendorCode = readRequiredFormString(formData, 'sourceVendorCode', 'Source vendor is required', errors);
  const targetVendorCode = readRequiredFormString(formData, 'targetVendorCode', 'Target vendor is required', errors);
  const channelCode = scopeType === 'channel'
    ? readRequiredFormString(formData, 'channelCode', 'Account pool code is required', errors)
    : null;
  const rows = readMappingRowsFromForm(formData, errors);
  validateUniqueModelMappingRows(rows, errors);
  throwModelMappingValidationErrorIfNeeded(errors);
  return rows.map((row) => ({
    scopeType,
    vendorCode: scopeType === 'vendor' ? sourceVendorCode : null,
    channelCode,
    sourceModel: row.sourceModel,
    sourceVendorCode,
    targetModel: row.targetModel,
    targetVendorCode,
    mappingMode: 'alias',
    matchType: 'exact',
    enabled: true,
  }));
}

function readMappingRowsFromForm(formData: FormData, errors: ModelMappingFormErrors): ModelMappingRowDraft[] {
  const value = readFormString(formData, 'rowsJson');
  if (!value) {
    addModelMappingFieldError(errors, 'mappingRows', 'Model mapping rows are required');
    return [];
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    addModelMappingFieldError(errors, 'mappingRows', 'Model mapping rows are invalid');
    return [];
  }
  if (!Array.isArray(parsed)) {
    addModelMappingFieldError(errors, 'mappingRows', 'Model mapping rows are invalid');
    return [];
  }
  if (parsed.length > MODEL_MAPPING_MAX_ROWS) {
    addModelMappingFieldError(errors, 'mappingRows', `Model mapping rows cannot exceed ${MODEL_MAPPING_MAX_ROWS}`);
  }
  const rows = parsed
    .map((item, index): ModelMappingRowDraft => {
      const fallbackId = `row_${index}`;
      if (!item || typeof item !== 'object') {
        addModelMappingRowError(errors, fallbackId, 'sourceModel', `Model mapping row ${index + 1} is invalid`);
        addModelMappingRowError(errors, fallbackId, 'targetModel', `Model mapping row ${index + 1} is invalid`);
        return { id: fallbackId, sourceModel: '', targetModel: '' };
      }
      const record = item as Record<string, unknown>;
      const rowId = typeof record.id === 'string' && record.id ? record.id : fallbackId;
      const sourceModel = typeof record.sourceModel === 'string' ? record.sourceModel.trim() : '';
      const targetModel = typeof record.targetModel === 'string' ? record.targetModel.trim() : '';
      if (!sourceModel) {
        addModelMappingRowError(errors, rowId, 'sourceModel', 'Source model is required');
      }
      if (!targetModel) {
        addModelMappingRowError(errors, rowId, 'targetModel', 'Target model is required');
      }
      validateModelMappingModelValue(sourceModel, 'Source model', errors, rowId, 'sourceModel');
      validateModelMappingModelValue(targetModel, 'Target model', errors, rowId, 'targetModel');
      return {
        id: rowId,
        sourceModel,
        targetModel,
      };
    });
  if (rows.length === 0) {
    addModelMappingFieldError(errors, 'mappingRows', 'At least one complete model mapping row is required');
  }
  return rows;
}

function validateModelMappingModelValue(
  value: string,
  label: string,
  errors: ModelMappingFormErrors,
  rowId: string,
  field: ModelMappingRowFieldKey,
): void {
  if (value.length > MODEL_MAPPING_MODEL_VALUE_MAX_LENGTH) {
    addModelMappingRowError(errors, rowId, field, `${label} cannot exceed ${MODEL_MAPPING_MODEL_VALUE_MAX_LENGTH} characters`);
  }
}

function validateUniqueModelMappingRows(rows: readonly ModelMappingRowDraft[], errors: ModelMappingFormErrors): void {
  const seen = new Set<string>();
  for (const row of rows) {
    if (!row.sourceModel) {
      continue;
    }
    const sourceModel = row.sourceModel.toLowerCase();
    if (seen.has(sourceModel)) {
      addModelMappingRowError(errors, row.id, 'sourceModel', 'Duplicate source model mapping is not allowed');
      continue;
    }
    seen.add(sourceModel);
  }
}

class ModelMappingFormValidationError extends Error {
  readonly errors: ModelMappingFormErrors;

  constructor(errors: ModelMappingFormErrors) {
    super(errors.message);
    this.name = 'ModelMappingFormValidationError';
    this.errors = errors;
  }
}

function createEmptyModelMappingFormErrors(): ModelMappingFormErrors {
  return {
    message: '',
    fieldErrors: {},
    rowErrors: {},
    firstErrorKey: null,
  };
}

function addModelMappingFieldError(errors: ModelMappingFormErrors, field: ModelMappingFieldErrorKey, message: string): void {
  if (!errors.fieldErrors[field]) {
    errors.fieldErrors[field] = message;
  }
  if (!errors.firstErrorKey) {
    errors.firstErrorKey = field;
  }
}

function addModelMappingRowError(
  errors: ModelMappingFormErrors,
  rowId: string,
  field: ModelMappingRowFieldKey,
  message: string,
): void {
  errors.rowErrors[rowId] = {
    ...errors.rowErrors[rowId],
    [field]: errors.rowErrors[rowId]?.[field] ?? message,
  };
  if (!errors.firstErrorKey) {
    errors.firstErrorKey = `${rowId}.${field}`;
  }
}

function modelMappingFormErrorsFromError(error: unknown): ModelMappingFormErrors {
  if (error instanceof ModelMappingFormValidationError) {
    return error.errors;
  }
  return {
    message: error instanceof Error ? error.message : 'Failed to save model mapping',
    fieldErrors: {},
    rowErrors: {},
    firstErrorKey: null,
  };
}

function throwModelMappingValidationErrorIfNeeded(errors: ModelMappingFormErrors): void {
  if (Object.keys(errors.fieldErrors).length === 0 && Object.keys(errors.rowErrors).length === 0) {
    return;
  }
  throw new ModelMappingFormValidationError({
    ...errors,
    message: 'Please fix the highlighted model mapping fields before saving.',
  });
}

function clearModelMappingFormFieldError(
  errors: ModelMappingFormErrors | null,
  field: ModelMappingFieldErrorKey,
): ModelMappingFormErrors | null {
  if (!errors?.fieldErrors[field]) {
    return errors;
  }
  const fieldErrors = { ...errors.fieldErrors };
  delete fieldErrors[field];
  return normalizeModelMappingFormErrors({ ...errors, fieldErrors });
}

function clearModelMappingFormRowError(
  errors: ModelMappingFormErrors | null,
  rowId: string,
  field: ModelMappingRowFieldKey,
): ModelMappingFormErrors | null {
  if (!errors?.rowErrors[rowId]?.[field]) {
    return errors;
  }
  const rowFieldErrors = { ...errors.rowErrors[rowId] };
  delete rowFieldErrors[field];
  const rowErrors = { ...errors.rowErrors };
  if (Object.keys(rowFieldErrors).length > 0) {
    rowErrors[rowId] = rowFieldErrors;
  } else {
    delete rowErrors[rowId];
  }
  return normalizeModelMappingFormErrors({ ...errors, rowErrors });
}

function normalizeModelMappingFormErrors(errors: ModelMappingFormErrors): ModelMappingFormErrors | null {
  if (Object.keys(errors.fieldErrors).length === 0 && Object.keys(errors.rowErrors).length === 0) {
    return null;
  }
  return {
    ...errors,
    message: errors.message || 'Please fix the highlighted model mapping fields before saving.',
    firstErrorKey: null,
  };
}

function createMappingRowDraft(mapping: ModelMappingRule | null): ModelMappingRowDraft {
  return {
    id: mapping?.id ?? createMappingRowId(),
    sourceModel: mapping?.sourceModel ?? '',
    targetModel: mapping?.targetModel ?? '',
  };
}

function createMappingRowId(): string {
  return `row_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function syncRowsForVendor(
  rows: readonly ModelMappingRowDraft[],
  field: 'sourceModel' | 'targetModel',
  vendorCode: string,
  models: readonly Model[],
): ModelMappingRowDraft[] {
  const vendorModels = models.filter((model) => model.vendorCode === vendorCode);
  return rows.map((row) => {
    const value = row[field].trim();
    if (value && vendorModels.some((model) => model.model === value)) {
      return row;
    }
    if (value && !models.some((model) => model.model === value)) {
      return row;
    }
    return {
      ...row,
      [field]: vendorModels[0]?.model ?? '',
    };
  });
}

function writeHiddenFormValue(form: HTMLFormElement, name: string, value: string): void {
  const input = form.querySelector<HTMLInputElement>(`input[name="${name}"]`);
  if (input) {
    input.value = value;
  }
}

function readMappingScopeType(formData: FormData): ModelMappingRule['scopeType'] {
  const value = readFormString(formData, 'scopeType');
  if (value === 'vendor' || value === 'channel') {
    return value;
  }
  return 'global';
}

function mappingScopeIdentity(mapping: ModelMappingRule): string {
  if (mapping.scopeType === 'channel') {
    return mapping.channelCode ?? mapping.channelId ?? '-';
  }
  if (mapping.scopeType === 'vendor') {
    return mapping.vendorCode ?? mapping.vendorId ?? '-';
  }
  return 'all requests';
}

function readFormString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

function readOptionalFormString(formData: FormData, name: string): string | null {
  const value = readFormString(formData, name);
  return value || null;
}

function readRequiredFormString(
  formData: FormData,
  name: ModelMappingFieldErrorKey,
  message: string,
  errors: ModelMappingFormErrors,
): string {
  const value = readFormString(formData, name);
  if (!value) {
    addModelMappingFieldError(errors, name, message);
  }
  return value;
}
