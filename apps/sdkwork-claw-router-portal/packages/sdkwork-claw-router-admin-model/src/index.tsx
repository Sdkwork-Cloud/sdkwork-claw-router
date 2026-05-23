import React, { useState, useEffect, useRef } from 'react';
import { AdminTableShell, BottomPagination, BusinessStateTableRow, ConfirmDialog } from 'sdkwork-claw-router-commons';
import { Search, Plus, Cpu, X, Sparkles, Layers, Image as ImageIcon, MessageSquare, Headphones, ChevronRight, ChevronDown, Activity, Trash2, Edit, Music, Loader2, RefreshCw, Video, Volume2, Power, PowerOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ModelService, Vendor, Model, KNOWN_VENDORS, selectPreferredModelVendorId } from './modelService';
import { MODEL_PRICING_REGIONS, createModelInputFromForm, createVendorInputFromForm, updateModelInputFromForm } from './modelForm';

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
      {/* HEADER SECTION */}
      <div className="bg-white dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-white/10 px-6 py-4 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </span>
            {t('admin.model.title')}
          </h2>
          <p className="text-sm text-slate-500 mt-1">{t('admin.model.subtitle')}</p>
        </div>
        <div>
          <button
            onClick={handleSyncAll}
            disabled={isSyncing}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white rounded-lg shadow-sm transition-colors text-sm font-medium flex items-center gap-2"
          >
            {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {isSyncing ? t('common.actions.syncingCatalog') : t('common.actions.syncModelCatalog')}
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* SIDEBAR - VENDORS */}
        <div className="w-64 bg-white dark:bg-[#1a1a1a] border-r border-slate-200 dark:border-white/10 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-[#121212]/50">
             <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{t('admin.model.vendorSidebar.title')}</span>
             <button onClick={openVendorModal} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-500/10 rounded-md transition-colors" title={t('common.actions.addModelVendor')}>
               <Plus className="w-4 h-4" />
             </button>
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
