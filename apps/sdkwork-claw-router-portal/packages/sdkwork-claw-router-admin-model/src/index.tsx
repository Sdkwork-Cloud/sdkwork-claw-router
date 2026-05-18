import React, { useMemo, useState, useEffect } from 'react';
import { BusinessStateTableRow, ConfirmDialog } from 'sdkwork-claw-router-commons';
import { Search, Plus, Cpu, X, Sparkles, Layers, Image as ImageIcon, MessageSquare, Headphones, ChevronRight, Activity, Trash2, Edit, Music, Loader2, RefreshCw, Video, Volume2, AlertTriangle, CheckCircle2, Clock3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ModelService, Vendor, Model, KNOWN_VENDORS, selectPreferredModelVendorId, type ModelRankingRefreshStatusView } from './modelService';
import { createModelInputFromForm, createVendorInputFromForm, updateModelInputFromForm } from './modelForm';
import { deriveModelRankingRefreshDiagnostics, type ModelRankingRefreshHealthTone } from './modelRankingRefreshDiagnostics';

export function ModelAdmin() {
  const { t } = useTranslation();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState<string>('v_openai');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshStatus, setRefreshStatus] = useState<ModelRankingRefreshStatusView | null>(null);
  const [refreshLoading, setRefreshLoading] = useState(true);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [manualRefreshRunning, setManualRefreshRunning] = useState(false);

  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Model | null>(null);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [deletingModelId, setDeletingModelId] = useState<string | null>(null);
  const [selectedModality, setSelectedModality] = useState<Model['type']>('Chat');

  const [vendorSelection, setVendorSelection] = useState<string>('v_deepseek');
  const [vendorDesc, setVendorDesc] = useState<string>(KNOWN_VENDORS.find(v => v.id === 'v_deepseek')?.desc ?? '');

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

  const loadRefreshDiagnostics = async () => {
    setRefreshLoading(true);
    setRefreshError(null);
    try {
      const status = await ModelService.fetchModelRankingRefreshStatus();
      setRefreshStatus(status);
    } catch (error) {
      setRefreshError(error instanceof Error ? error.message : 'Failed to load model ranking refresh diagnostics');
    } finally {
      setRefreshLoading(false);
    }
  };

  useEffect(() => {
    void loadModels();
    void loadRefreshDiagnostics();
  }, []);

  const selectedVendor = vendors.find(v => v.id === selectedVendorId);
  const vendorModels = models.filter(m => m.vendorId === selectedVendorId && m.name.toLowerCase().includes(search.toLowerCase()));
  const rankingRefreshDiagnostics = useMemo(
    () => refreshStatus ? deriveModelRankingRefreshDiagnostics(refreshStatus) : null,
    [refreshStatus],
  );

  const openVendorModal = () => {
    setVendorSelection('v_deepseek');
    setVendorDesc(KNOWN_VENDORS.find(v => v.id === 'v_deepseek')?.desc ?? '');
    setIsVendorModalOpen(true);
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);
    setLoadError(null);
    try {
      const { vendors: newVendors, models: newModels } = await ModelService.syncVendorsAndModels();
      setVendors(newVendors);
      setModels(newModels);
      setSelectedVendorId(selectPreferredModelVendorId(newVendors, selectedVendorId));
      void loadRefreshDiagnostics();
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to sync model catalog');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleManualRankingRefresh = async () => {
    setManualRefreshRunning(true);
    setRefreshError(null);
    try {
      await ModelService.triggerModelRankingRefresh();
      await loadRefreshDiagnostics();
    } catch (error) {
      setRefreshError(error instanceof Error ? error.message : 'Failed to trigger model ranking refresh');
    } finally {
      setManualRefreshRunning(false);
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
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Persisted model capabilities</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Max output tokens</label>
            <input name="maxOutputTokens" type="number" min="0" step="1" defaultValue={editingModel?.maxOutputTokens ?? ''} placeholder="Optional" className={inputBaseCls} />
          </div>
          <div>
            <label className={labelCls}>Supported languages</label>
            <input name="supportedLanguages" type="text" defaultValue={editingModel?.supportedLanguages.join(', ') ?? ''} placeholder="English, Chinese" className={inputBaseCls} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Description</label>
          <textarea name="description" rows={2} defaultValue={editingModel?.description ?? ''} placeholder="Short operator-facing model description" className={`${inputBaseCls} resize-none`} />
        </div>
        <div>
          <label className={labelCls}>Capability intro</label>
          <textarea name="capabilityIntro" rows={2} defaultValue={editingModel?.capabilityIntro ?? ''} placeholder="Summarize model strengths and routing fit" className={`${inputBaseCls} resize-none`} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Limitations</label>
            <textarea name="limitations" rows={2} defaultValue={editingModel?.limitations.join(', ') ?? ''} placeholder="No medical diagnosis, No legal advice" className={`${inputBaseCls} resize-none`} />
          </div>
          <div>
            <label className={labelCls}>Use cases</label>
            <textarea name="useCases" rows={2} defaultValue={editingModel?.useCases.join(', ') ?? ''} placeholder="Customer support, Data extraction" className={`${inputBaseCls} resize-none`} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm dark:border-white/10 dark:bg-[#1a1a1a] dark:text-slate-300">
            <input name="supportsStreaming" type="checkbox" defaultChecked={supportsStreaming} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
            Streaming
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm dark:border-white/10 dark:bg-[#1a1a1a] dark:text-slate-300">
            <input name="supportsTools" type="checkbox" defaultChecked={supportsTools} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
            Tools
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm dark:border-white/10 dark:bg-[#1a1a1a] dark:text-slate-300">
            <input name="supportsJsonSchema" type="checkbox" defaultChecked={supportsJsonSchema} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
            JSON Schema
          </label>
        </div>
      </div>
    );
  };

  const renderRankingRefreshDiagnostics = () => {
    const toneClasses = rankingRefreshDiagnostics ? rankingRefreshToneClasses(rankingRefreshDiagnostics.healthTone) : rankingRefreshToneClasses('neutral');
    return (
      <div className="px-8 pt-5 shrink-0">
        <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-500" />
                Ranking refresh runtime
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Generated from the scheduled model ranking worker and ops job execution audit log.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => void handleManualRankingRefresh()}
                disabled={manualRefreshRunning || refreshLoading}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white rounded-lg shadow-sm transition-colors text-xs font-medium flex items-center gap-2"
              >
                {manualRefreshRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                {manualRefreshRunning ? t('common.actions.running') : t('common.actions.runRefresh')}
              </button>
              <button
                onClick={() => void loadRefreshDiagnostics()}
                disabled={refreshLoading || manualRefreshRunning}
                className="px-3 py-2 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-50 transition-colors text-xs font-medium flex items-center gap-2"
              >
                {refreshLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                {t('common.actions.refresh')}
              </button>
            </div>
          </div>
          {refreshLoading && !rankingRefreshDiagnostics ? (
            <div className="px-5 py-5 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
              Loading ranking refresh diagnostics...
            </div>
          ) : refreshError ? (
            <div className="px-5 py-5 text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <div className="font-medium">Ranking refresh diagnostics unavailable</div>
                <div className="text-xs mt-1 text-amber-700/80 dark:text-amber-200/80">{refreshError}</div>
              </div>
            </div>
          ) : rankingRefreshDiagnostics ? (
            <div className="p-5 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] gap-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-lg border border-slate-200 dark:border-white/10 p-4 bg-slate-50/60 dark:bg-white/[0.02]">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Snapshot health</div>
                  <div className={`mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold border ${toneClasses.badge}`}>
                    {rankingRefreshDiagnostics.healthTone === 'healthy' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    {rankingRefreshDiagnostics.statusLabel}
                  </div>
                  <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">{rankingRefreshDiagnostics.snapshotLabel}</div>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-white/10 p-4 bg-slate-50/60 dark:bg-white/[0.02]">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Generated rows</div>
                  <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{rankingRefreshDiagnostics.generatedSummary}</div>
                  <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">{rankingRefreshDiagnostics.rankScope}</div>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-white/10 p-4 bg-slate-50/60 dark:bg-white/[0.02]">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Schedule</div>
                  <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock3 className="w-3.5 h-3.5 text-slate-400" />
                    {rankingRefreshDiagnostics.refreshSchedule}
                  </div>
                  <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">{rankingRefreshDiagnostics.windowLabel}</div>
                </div>
                <div className="md:col-span-3 rounded-lg border border-slate-200 dark:border-white/10 p-4 bg-slate-50/60 dark:bg-white/[0.02]">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Source tables</div>
                  <div className="mt-2 text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-normal break-words">{rankingRefreshDiagnostics.sourceTablesLabel}</div>
                </div>
              </div>

              <div className={`rounded-lg border p-4 ${toneClasses.panel}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Latest execution</div>
                  {rankingRefreshDiagnostics.latestJob ? (
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold border ${rankingRefreshToneClasses(rankingRefreshDiagnostics.latestJob.status === 'failed' ? 'critical' : rankingRefreshDiagnostics.latestJob.status === 'succeeded' ? 'healthy' : 'warning').badge}`}>
                      {rankingRefreshDiagnostics.latestJob.statusLabel}
                    </span>
                  ) : null}
                </div>
                {rankingRefreshDiagnostics.latestJob ? (
                  <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between gap-3"><span className="text-slate-500">Started</span><span className="font-mono text-right">{rankingRefreshDiagnostics.latestJob.startedAtLabel}</span></div>
                    <div className="flex justify-between gap-3"><span className="text-slate-500">Ended</span><span className="font-mono text-right">{rankingRefreshDiagnostics.latestJob.endedAtLabel}</span></div>
                    <div className="flex justify-between gap-3"><span className="text-slate-500">Duration</span><span className="font-mono text-right">{rankingRefreshDiagnostics.latestJob.durationLabel}</span></div>
                    <div className="flex justify-between gap-3"><span className="text-slate-500">Rows</span><span className="font-mono text-right">{rankingRefreshDiagnostics.latestJob.generatedSummary}</span></div>
                    <div className="pt-2 border-t border-slate-200 dark:border-white/10">
                      <div className="text-slate-500">Window</div>
                      <div className="mt-1 font-mono text-slate-700 dark:text-slate-200 break-words">{rankingRefreshDiagnostics.latestJob.windowLabel}</div>
                    </div>
                    {rankingRefreshDiagnostics.latestJob.failureReason ? (
                      <div className="pt-2 border-t border-red-200/70 dark:border-red-500/20 text-red-700 dark:text-red-300">
                        {rankingRefreshDiagnostics.latestJob.failureReason}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">No ranking refresh execution has been recorded yet.</div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-[#121212] rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-white/5">
      {/* HEADER SECTION */}
      <div className="bg-white dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-white/10 px-6 py-4 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </span>
            Model catalog management
          </h2>
          <p className="text-sm text-slate-500 mt-1">Manage model vendors, model pricing, and routing readiness.</p>
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

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR - VENDORS */}
        <div className="w-64 bg-white dark:bg-[#1a1a1a] border-r border-slate-200 dark:border-white/10 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-[#121212]/50">
             <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Model vendors</span>
             <button onClick={openVendorModal} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-500/10 rounded-md transition-colors" title={t('common.actions.addModelVendor')}>
               <Plus className="w-4 h-4" />
             </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {vendors.map(v => {
              const isActive = selectedVendorId === v.id;
              const count = models.filter(m => m.vendorId === v.id).length;
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
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-[#121212]">
          {selectedVendor ? (
            <>
              {/* VENDOR HEADER */}
              <div className="px-8 py-6 bg-white dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-white/10 shrink-0 flex justify-between items-start">
                 <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl ${selectedVendor.color} text-white flex items-center justify-center text-2xl font-bold shadow-sm mt-1`}>
                       {selectedVendor.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        {selectedVendor.name}
                        {selectedVendor.status === 'active' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-xs font-medium border border-emerald-200 dark:border-emerald-500/20">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400 text-xs font-medium border border-slate-200 dark:border-white/10">
                            Inactive
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-lg leading-relaxed">{selectedVendor.description}</p>
                    </div>
                 </div>
                 <div className="flex gap-3">
                   <button onClick={openAddModelModal} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-colors text-sm font-medium flex items-center gap-2">
                     <Plus className="w-4 h-4" /> {t('common.actions.addModel')}
                   </button>
                 </div>
              </div>

              {renderRankingRefreshDiagnostics()}

              {/* SEARCH & FILTERS */}
              <div className="px-8 py-5 flex items-center justify-between shrink-0">
                 <div className="relative w-80">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search models for this vendor..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white placeholder-slate-500 transition-colors shadow-sm"
                  />
                 </div>
              </div>

              {/* MODELS TABLE */}
              <div className="flex-1 overflow-y-auto px-8 pb-8">
                 <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden min-h-[400px]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        <thead className="bg-slate-50/80 dark:bg-[#121212]/80 border-b border-slate-200 dark:border-white/10">
                          <tr>
                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Model</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Type</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Price (In / Out)</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Context</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Calls</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Status</th>
                            <th className="px-6 py-4 font-semibold text-right text-slate-700 dark:text-slate-300">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                          {loading ? (
                            <BusinessStateTableRow colSpan={7} kind="loading" title="Loading models..." />
                          ) : loadError ? (
                            <BusinessStateTableRow
                              colSpan={7}
                              kind="error"
                              title="Models could not be loaded"
                              description={loadError}
                              onRetry={() => { void loadModels(); }}
                              retryLabel="Retry"
                            />
                          ) : vendorModels.length === 0 ? (
                            <BusinessStateTableRow
                              colSpan={7}
                              kind="empty"
                              title="No models found"
                              description="Connect a model before enabling traffic, pricing, or routing rules for this vendor."
                              action={{
                                label: t('common.actions.addModel'),
                                onClick: openAddModelModal,
                              }}
                            />
                          ) : vendorModels.map(m => (
                            <tr key={m.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors group">
                              <td className="px-6 py-4">
                                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2.5">
                                  <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                  {m.name}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300 text-xs font-medium">
                                  {getTypeIcon(m.type)} {m.type}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-1 text-[11px] text-slate-500">
                                  <div className="flex justify-between w-28 items-center bg-slate-50 dark:bg-white/5 px-2 py-0.5 rounded">
                                     <span>Input</span>
                                     <span className="font-mono text-slate-800 dark:text-slate-200">${m.priceIn}</span>
                                  </div>
                                  <div className="flex justify-between w-28 items-center bg-slate-50 dark:bg-white/5 px-2 py-0.5 rounded">
                                     <span>Output</span>
                                     <span className="font-mono text-slate-800 dark:text-slate-200">${m.priceOut}</span>
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
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400 text-xs font-medium border border-slate-200 dark:border-white/10">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Inactive
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                    </div>
                 </div>
              </div>
            </>
          ) : (
             <div className="flex-1 flex items-center justify-center flex-col text-slate-400">
               <Layers className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" />
               <p>Select a model vendor on the left to manage its models.</p>
             </div>
          )}
        </div>
      </div>

      {/* ADD VENDOR MODAL */}
      {isVendorModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add model vendor</h3>
              <button onClick={() => setIsVendorModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddVendor} className="flex flex-col">
              <div className="p-5 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Model vendor / brand</label>
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
                      <option value="" disabled>Select a known model vendor...</option>
                      {KNOWN_VENDORS.map(v => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    </select>
                    <ChevronRight className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
                  </div>
                  {vendorSelection === 'custom' && (
                    <input required name="customName" type="text" placeholder="Custom model vendor name (example: My AI Co)" className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white shadow-sm transition-all animate-in fade-in slide-in-from-top-2" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                  <textarea name="description" value={vendorDesc} onChange={e => setVendorDesc(e.target.value)} rows={3} placeholder="Short model vendor description..." className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white shadow-sm transition-all resize-none"></textarea>
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
          <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <Plus className="w-5 h-5 text-indigo-500" />
                 {editingModel ? 'Edit model' : 'Connect model to'} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">{selectedVendor.name}</span>
              </h3>
              <button onClick={closeModelModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddModel} className="flex flex-col">
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Model ID</label>
                  <input required name="name" type="text" defaultValue={editingModel?.name ?? ''} placeholder="Model name used in API requests, example: gpt-5.5" className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white shadow-sm transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Model type</label>
                    <div className="relative">
                      <select required name="type" value={selectedModality} onChange={e => setSelectedModality(e.target.value as Model['type'])} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white shadow-sm transition-all appearance-none cursor-pointer">
                        <option value="Video">Video (Video generation)</option>
                        <option value="Chat">Chat (text)</option>
                        <option value="Image">Image (generation/editing)</option>
                        <option value="Audio">Audio (speech)</option>
                        <option value="Music">Music (generation)</option>
                        <option value="SoundEffect">Sound effect (SFX)</option>
                        <option value="Embedding">Embedding (vectors)</option>
                      </select>
                      <ChevronRight className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Context window</label>
                    <input name="contextTokens" type="text" defaultValue={editingModel ? String(editingModel.contextTokens) : ''} placeholder="Example: 128k, 1M" className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white shadow-sm transition-all" />
                  </div>
                </div>

                {renderModalityParams()}

                <div className="p-4 bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 rounded-xl space-y-4">
                  <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-300">Pricing ($ / 1M units)</h4>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Input unit price</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">$</span>
                        <input required name="priceIn" type="number" step="0.0001" defaultValue={editingModel?.priceIn ?? ''} placeholder="0.01" className="w-full bg-white dark:bg-[#1a1a1a] border border-slate-300 dark:border-white/10 rounded-lg pl-8 pr-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white shadow-sm transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Output unit price</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">$</span>
                        <input required name="priceOut" type="number" step="0.0001" defaultValue={editingModel?.priceOut ?? ''} placeholder="0.03" className="w-full bg-white dark:bg-[#1a1a1a] border border-slate-300 dark:border-white/10 rounded-lg pl-8 pr-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white shadow-sm transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
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
          title="Delete model configuration?"
          description={`This removes "${deleteTarget.name}" from the AI model catalog. Routing rules that reference it should be reviewed before confirming.`}
          confirmLabel="Delete model"
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

function rankingRefreshToneClasses(tone: ModelRankingRefreshHealthTone): { badge: string; panel: string } {
  switch (tone) {
    case 'healthy':
      return {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20',
        panel: 'border-emerald-200 bg-emerald-50/30 dark:border-emerald-500/20 dark:bg-emerald-500/5',
      };
    case 'warning':
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20',
        panel: 'border-amber-200 bg-amber-50/30 dark:border-amber-500/20 dark:bg-amber-500/5',
      };
    case 'critical':
      return {
        badge: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20',
        panel: 'border-red-200 bg-red-50/30 dark:border-red-500/20 dark:bg-red-500/5',
      };
    case 'neutral':
      return {
        badge: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-white/10 dark:text-slate-300 dark:border-white/10',
        panel: 'border-slate-200 bg-slate-50/60 dark:border-white/10 dark:bg-white/[0.02]',
      };
  }
}
