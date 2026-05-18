import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Ban,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Edit2,
  Image as ImageIcon,
  Key,
  Layers,
  Loader2,
  MessageSquare,
  Mic,
  Music,
  Network,
  Plus,
  Search,
  Server,
  Sparkles,
  Trash2,
  Video,
  Volume2,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  ChannelService,
  ProviderSecretService,
  type ChannelItem,
  type ChannelUpdateInput,
  type ProviderSecretItem,
} from './channelService';
import { authTypesList, knownModelVendors, prefillModels, protocolsList } from './channelOptions';
import {
  createChannelInputFromForm,
  createChannelStatusUpdateInput,
  createChannelUpdateInputFromForm,
  resolveAuthTypeFormValue,
  resolveAuthTypeSubmitValue,
  resolveChannelSelectFormValue,
  resolveChannelSelectSubmitValue,
  type ChannelFormValues,
} from './channelForm';
import { BusinessStateTableRow, ConfirmDialog } from 'sdkwork-claw-router-commons';

type ToastState = { message: string; type: 'success' | 'info' | 'error' } | null;
type ModalMode = 'create' | 'edit';
type PendingChannelAction = 'test' | 'update' | 'delete';
type DeleteConfirmation = {
  id: string;
  title: string;
  description: string;
  confirmLabel: string;
};

const capabilityOptions = [
  { id: 'llm', labelKey: 'common.modality.llm', icon: <MessageSquare className="w-3.5 h-3.5" /> },
  { id: 'image', labelKey: 'common.modality.image', icon: <ImageIcon className="w-3.5 h-3.5" /> },
  { id: 'audio', labelKey: 'common.modality.audio', icon: <Mic className="w-3.5 h-3.5" /> },
  { id: 'music', labelKey: 'common.modality.music', icon: <Music className="w-3.5 h-3.5" /> },
  { id: 'sfx', labelKey: 'common.modality.sfx', icon: <Volume2 className="w-3.5 h-3.5" /> },
  { id: 'video', labelKey: 'common.modality.video', icon: <Video className="w-3.5 h-3.5" /> },
];

const channelTabs = [
  { id: 'all', labelKey: 'admin.channel.tabs.allChannels' },
  { id: 'OpenAI', label: 'OpenAI' },
  { id: 'Anthropic', label: 'Anthropic' },
  { id: 'Gemini', label: 'Gemini' },
  { id: 'DeepSeek', label: 'DeepSeek' },
  { id: 'Zhipu', label: 'Zhipu' },
  { id: 'Ollama', label: 'Ollama' },
  { id: 'OpenRouter', label: 'OpenRouter' },
];

function providerCodeForVendor(vendor: string): string {
  const normalized = vendor.trim().toLowerCase();
  const mapping: Record<string, string> = {
    'azure openai': 'azure_openai',
    gemini: 'google',
    google: 'google',
    'google gemini': 'google',
    zhipuai: 'zhipu',
    'zhipu ai': 'zhipu',
    'mistral ai': 'mistral',
    'meta llama': 'meta',
  };
  return (mapping[normalized] ?? normalized.replace(/\s+/g, '_')).replace(/[^a-z0-9_-]/g, '');
}

function getLoadErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function readPositiveIntegerFormValue(
  formData: FormData,
  key: string,
  messages: { required: string; positiveInteger: string },
): number {
  const rawValue = formData.get(key);
  const normalized = typeof rawValue === 'string' ? rawValue.trim() : '';
  if (!normalized) {
    throw new Error(messages.required);
  }
  if (!/^\d+$/.test(normalized)) {
    throw new Error(messages.positiveInteger);
  }
  const value = Number(normalized);
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new Error(messages.positiveInteger);
  }
  return value;
}

function AddAccountModal({
  mode,
  initialChannel,
  isSaving,
  onClose,
  onSubmit,
}: {
  mode: ModalMode;
  initialChannel?: ChannelItem | null;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (channel: ChannelFormValues) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [selectedProtocol, setSelectedProtocol] = useState(resolveChannelSelectFormValue(initialChannel?.protocol, protocolsList, 'OpenAI'));
  const [activeAuthType, setActiveAuthType] = useState(resolveAuthTypeFormValue(initialChannel?.accessType, authTypesList));
  const [showMoreAuth, setShowMoreAuth] = useState(false);
  const [modelVendor, setModelVendor] = useState(resolveChannelSelectFormValue(initialChannel?.vendor, knownModelVendors, 'OpenAI'));
  const [whitelist, setWhitelist] = useState<string[]>(initialChannel?.models?.length ? initialChannel.models : []);
  const [capabilities, setCapabilities] = useState<string[]>(
    initialChannel?.capabilities?.length ? initialChannel.capabilities : ['llm'],
  );
  const [customModel, setCustomModel] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const isEdit = mode === 'edit';

  useEffect(() => {
    if (!initialChannel && modelVendor) {
      setWhitelist((prefillModels[modelVendor] ?? []).slice(0, 5));
    }
  }, [initialChannel, modelVendor]);

  const toggleCapability = (capability: string) => {
    setCapabilities((current) => {
      const next = current.includes(capability)
        ? current.filter((item) => item !== capability)
        : [...current, capability];
      return next.length > 0 ? next : ['llm'];
    });
  };

  const fillRelatedModels = () => {
    setWhitelist(prefillModels[modelVendor] ?? []);
  };

  const addCustomModel = () => {
    const value = customModel.trim();
    if (value && !whitelist.includes(value)) {
      setWhitelist((current) => [...current, value]);
      setCustomModel('');
    }
  };

  const removeModel = (model: string) => {
    setWhitelist((current) => current.filter((item) => item !== model));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const baseUrl = String(formData.get('baseUrl') ?? '').trim();
    const apiKey = String(formData.get('apiKey') ?? '').trim();
    const models = whitelist.map((item) => item.trim()).filter(Boolean);

    if (!name) {
      setLocalError(t('admin.channel.validation.channelNameRequired'));
      return;
    }
    if (!isEdit && !apiKey) {
      setLocalError(t('admin.channel.validation.apiKeyRequiredForCreate'));
      return;
    }
    if (models.length === 0) {
      setLocalError(t('admin.channel.validation.modelRequired'));
      return;
    }

    try {
      const weight = readPositiveIntegerFormValue(formData, 'weight', {
        required: t('admin.channel.validation.weightRequired'),
        positiveInteger: t('admin.channel.validation.weightPositiveInteger'),
      });
      const circuitBreakerEnabled = formData.get('circuitBreakerEnabled') === 'on';
      await onSubmit({
        name,
        vendor: modelVendor,
        protocol: resolveChannelSelectSubmitValue(selectedProtocol, protocolsList, 'protocol'),
        accessType: resolveAuthTypeSubmitValue(activeAuthType, authTypesList),
        baseUrl,
        apiKey,
        capabilities,
        models,
        circuitBreakerEnabled,
        circuitBreakerFailureThreshold: String(formData.get('circuitBreakerFailureThreshold') ?? '').trim(),
        weight,
        status: initialChannel?.status ?? 'active',
      });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : t('admin.channel.errors.channelSaveFailed'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto w-full">
      <div className="absolute inset-0" onClick={isSaving ? undefined : onClose} />
      <div className="relative bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-6xl overflow-hidden flex flex-col my-4 h-[95vh] z-10">
        <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#121212] shrink-0">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-wide flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-500" />
            {isEdit ? t('admin.channel.modals.editChannelTitle') : t('admin.channel.modals.addChannelTitle')}
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden h-full">
          <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto">
            <div className="flex-1 p-5 space-y-5 lg:border-r border-slate-200 dark:border-white/10 overflow-y-auto custom-scrollbar">
              {localError && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                  <AlertCircle className="h-4 w-4" />
                  {localError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">{t('admin.channel.fields.channelName')}</label>
                  <input
                    required
                    name="name"
                    type="text"
                    defaultValue={initialChannel?.name ?? ''}
                    placeholder={t('admin.channel.placeholders.channelName')}
                    className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">{t('admin.channel.fields.vendor')}</label>
                  <div className="relative">
                    <select
                      value={modelVendor}
                      onChange={(event) => setModelVendor(event.target.value)}
                      className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg pl-3 pr-10 py-2 text-sm font-medium focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white shadow-sm appearance-none transition-colors"
                    >
                      {knownModelVendors.map((vendor) => (
                        <option key={vendor.id} value={vendor.id}>
                          {'nameKey' in vendor ? t(vendor.nameKey) : vendor.name}
                        </option>
                      ))}
                      {!knownModelVendors.some((vendor) => vendor.id === modelVendor) && (
                        <option value={modelVendor}>{modelVendor}</option>
                      )}
                    </select>
                    <ChevronRight className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">{t('admin.channel.fields.protocol')}</label>
                <div className="flex flex-wrap gap-2 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/5 rounded-lg p-2">
                  {protocolsList.map((protocol) => {
                    const isSelected = selectedProtocol === protocol.id;
                    return (
                      <button
                        type="button"
                        key={protocol.id}
                        onClick={() => setSelectedProtocol(protocol.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors text-xs ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-medium'
                            : 'hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <span
                          className={`w-3.5 h-3.5 border rounded-sm flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-indigo-500 border-indigo-500'
                              : 'border-slate-300 dark:border-slate-500 bg-white dark:bg-transparent'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                        </span>
                        {t(protocol.labelKey)}
                      </button>
                    );
                  })}
                  {!protocolsList.some((protocol) => protocol.id === selectedProtocol) && (
                    <button
                      type="button"
                      key={selectedProtocol}
                      onClick={() => setSelectedProtocol(selectedProtocol)}
                      className="flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-300 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/40"
                    >
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-sm border border-amber-500 bg-amber-500">
                        <Check className="h-2.5 w-2.5 text-white" />
                      </span>
                      {selectedProtocol}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-slate-700 dark:text-slate-300 font-medium">{t('admin.channel.fields.credentialMode')}</label>
                  <button
                    type="button"
                    onClick={() => setShowMoreAuth((current) => !current)}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    {showMoreAuth
                      ? t('admin.channel.actions.hideAdvancedModes')
                      : t('admin.channel.actions.showAdvancedModes')}
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {authTypesList
                    .filter((type) => !type.isSpecial || showMoreAuth)
                    .map((type) => {
                      const isActive = activeAuthType === type.id;
                      return (
                        <button
                          type="button"
                          key={type.id}
                          onClick={() => setActiveAuthType(type.id)}
                          className={`text-left p-2.5 rounded-xl border transition-all duration-200 flex flex-col gap-1.5 ${
                            isActive
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500/50'
                              : 'bg-white dark:bg-black border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className={`p-1 rounded ${
                                isActive
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {type.icon}
                            </span>
                            <span className={`font-semibold text-[13px] ${isActive ? 'text-slate-900 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                              {t(type.titleKey)}
                            </span>
                          </span>
                          <span className={`text-[10px] font-mono tracking-wide ${isActive ? 'text-emerald-700/70 dark:text-emerald-400/70' : 'text-slate-500'}`}>
                            {t(type.descKey)}
                          </span>
                        </button>
                      );
                    })}
                  {!authTypesList.some((type) => type.id === activeAuthType) && (
                    <button
                      key={activeAuthType}
                      type="button"
                      onClick={() => setActiveAuthType(activeAuthType)}
                      className="flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-all border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200"
                    >
                      <Key className="h-4 w-4" />
                      <span>
                        <span className="block font-semibold">{activeAuthType}</span>
                        <span className="text-[10px] opacity-80">{t('admin.channel.actions.customBackendAuthType')}</span>
                      </span>
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">{t('admin.channel.fields.baseUrl')}</label>
                  <input
                    type="url"
                    name="baseUrl"
                    defaultValue={initialChannel?.baseUrl ?? ''}
                    placeholder="https://api.openai.com/v1"
                    className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">{t('admin.channel.fields.apiKey')}</label>
                  <input
                    required={!isEdit}
                    type="password"
                    name="apiKey"
                    autoComplete="off"
                    placeholder={t('admin.channel.placeholders.apiKey')}
                    className="w-full font-mono bg-white dark:bg-black border border-slate-200 dark:border-white/10 focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">{t('admin.channel.fields.trafficWeight')}</label>
                  <input
                    required
                    name="weight"
                    type="number"
                    min="1"
                    max="10000"
                    defaultValue={initialChannel?.weight ?? 100}
                    className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#121212]">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <input
                    name="circuitBreakerEnabled"
                    type="checkbox"
                    defaultChecked={Boolean(initialChannel?.circuitBreakerPolicy)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  {t('admin.channel.fields.circuitBreaker')}
                </label>
                <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                  {t('admin.channel.help.circuitBreaker')}
                </p>
                <div className="max-w-xs">
                  <label className="mb-1 block text-xs text-slate-500">{t('admin.channel.fields.failureThreshold')}</label>
                  <input
                    name="circuitBreakerFailureThreshold"
                    type="number"
                    min="1"
                    max="100"
                    defaultValue={initialChannel?.circuitBreakerPolicy?.failureThreshold ?? 3}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">{t('admin.channel.fields.capabilities')}</label>
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                  {capabilityOptions.map((capability) => {
                    const isChecked = capabilities.includes(capability.id);
                    return (
                      <button
                        type="button"
                        key={capability.id}
                        onClick={() => toggleCapability(capability.id)}
                        className={`flex justify-center items-center gap-1.5 p-1.5 rounded-lg border text-xs transition-all ${
                          isChecked
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/50 text-emerald-700 dark:text-emerald-400 font-medium'
                            : 'bg-white dark:bg-[#1e1e1e] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
                        }`}
                      >
                        {capability.icon}
                        <span className="whitespace-nowrap">{t(capability.labelKey)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex-1 px-6 py-4 bg-slate-50 dark:bg-transparent overflow-y-auto custom-scrollbar flex flex-col h-[70vh] lg:h-auto">
              <div className="mb-4 shrink-0">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{t('admin.channel.fields.modelAllowlist')}</h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {t('admin.channel.help.modelAllowlist')}
                </p>
              </div>

              <div className="flex flex-col flex-1 h-full min-h-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 bg-white dark:bg-black p-4 rounded-xl border border-slate-200 dark:border-white/10 overflow-y-auto max-h-[300px]">
                  {whitelist.map((model) => (
                    <div
                      key={model}
                      className="flex justify-between items-center bg-slate-50 dark:bg-[#1e1e1e] border border-slate-100 dark:border-white/5 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 group"
                    >
                      <span className="flex items-center gap-2 truncate pr-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{model}</span>
                      </span>
                      <button type="button" onClick={() => removeModel(model)} className="text-slate-400 hover:text-red-500 transition-colors shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {whitelist.length === 0 && (
                    <div className="col-span-2 text-slate-500 text-sm text-center py-8">{t('admin.channel.validation.modelRequired')}</div>
                  )}
                </div>

                <div className="mt-auto space-y-4 shrink-0">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">{t('admin.channel.modelCount', { count: whitelist.length })}</span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={fillRelatedModels}
                      className="border border-indigo-500 text-indigo-500 dark:border-indigo-500/50 dark:text-indigo-400 px-4 py-2 rounded-lg text-sm hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors font-medium"
                    >
                      {t('common.actions.applyDefaults')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setWhitelist([])}
                      className="border border-red-500 text-red-500 dark:border-red-500/50 dark:text-red-400 px-4 py-2 rounded-lg text-sm hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-medium"
                    >
                      {t('common.actions.clearAll')}
                    </button>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                    <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">{t('admin.channel.fields.addModel')}</label>
                    <div className="flex gap-2">
                      <input
                        value={customModel}
                        onChange={(event) => setCustomModel(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            addCustomModel();
                          }
                        }}
                        className="flex-1 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        placeholder="provider/model-name"
                      />
                      <button
                        type="button"
                        onClick={addCustomModel}
                        className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-500/20 px-6 py-2 rounded-lg text-sm hover:bg-emerald-100 dark:hover:bg-emerald-500/20 font-medium transition-colors"
                      >
                        {t('common.actions.add')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#121212] shrink-0 flex justify-end gap-3 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-white/10 hover:bg-white dark:hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
            >
              {t('common.actions.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 flex items-center gap-2"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? t('common.actions.saveChanges') : t('common.actions.createChannel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function findCredentialForChannel(channel: ChannelItem, providerSecrets: ProviderSecretItem[]): ProviderSecretItem | null {
  const secretRef = channel.secretRef?.trim();
  if (!secretRef) {
    return null;
  }
  const providerCode = providerCodeForVendor(channel.vendor);
  return (
    providerSecrets.find((secret) => secret.secretRef === secretRef && secret.providerCode === providerCode) ??
    providerSecrets.find((secret) => secret.secretRef === secretRef) ??
    null
  );
}

function CredentialDetailsModal({
  channel,
  credential,
  isLoading,
  loadError,
  onRetry,
  onClose,
}: {
  channel: ChannelItem;
  credential: ProviderSecretItem | null;
  isLoading: boolean;
  loadError: string | null;
  onRetry: () => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const secretRef = channel.secretRef?.trim() ?? '';
  const hasSecretRef = secretRef.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#1a1a1a]">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-[#121212]">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <Key className="h-5 w-5 text-emerald-500" />
            {t('admin.channel.credentials.modalTitle')}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.actions.close')}
            className="text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#121212]">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Network className="h-4 w-4 text-slate-400" />
              {t('admin.channel.credentials.channelTitle')}
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <CredentialDetailField label={t('admin.channel.fields.channelName')} value={channel.name} />
              <CredentialDetailField label={t('admin.channel.fields.vendor')} value={channel.vendor} />
              <CredentialDetailField label={t('admin.channel.fields.protocol')} value={channel.protocol} />
              <CredentialDetailField label={t('admin.channel.fields.authType')} value={channel.accessType} />
              <CredentialDetailField
                label={t('admin.channel.fields.secretReference')}
                value={secretRef || t('admin.channel.credentials.noReferenceValue')}
                monospace={hasSecretRef}
                wide
              />
            </div>
          </section>

          {isLoading ? (
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-black dark:text-slate-300">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
              {t('admin.channel.credentials.loadingDetails')}
            </div>
          ) : loadError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{t('admin.channel.credentials.loadErrorTitle')}</div>
                  <div className="mt-1 break-words">{loadError}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={onRetry}
                className="mt-3 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-500/20 dark:bg-transparent dark:text-red-300 dark:hover:bg-red-500/10"
              >
                {t('common.actions.retry')}
              </button>
            </div>
          ) : credential ? (
            <section className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-300">
                <CheckCircle className="h-4 w-4" />
                {t('admin.channel.credentials.linkedTitle')}
              </h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <CredentialDetailField label={t('admin.channel.fields.credentialName')} value={credential.name} />
                <CredentialDetailField label={t('admin.channel.fields.providerCode')} value={credential.providerCode} monospace />
                <CredentialDetailField label={t('admin.channel.fields.accountCode')} value={credential.accountCode} monospace />
                <CredentialDetailField label={t('admin.channel.fields.authType')} value={credential.authType} />
                <CredentialDetailField label={t('admin.channel.fields.maskedLabel')} value={credential.maskedLabel} monospace />
                <div>
                  <div className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{t('admin.channel.fields.status')}</div>
                  <ProviderSecretStatusBadge status={credential.status} />
                </div>
              </div>
            </section>
          ) : (
            <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
              <h4 className="flex items-center gap-2 font-bold">
                <AlertCircle className="h-4 w-4" />
                {hasSecretRef
                  ? t('admin.channel.credentials.unmatchedTitle')
                  : t('admin.channel.credentials.noReferenceTitle')}
              </h4>
              <p className="mt-2 leading-6">
                {hasSecretRef
                  ? t('admin.channel.credentials.unmatchedDescription')
                  : t('admin.channel.credentials.noReferenceDescription')}
              </p>
            </section>
          )}
        </div>

        <div className="flex justify-end border-t border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#121212]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-white dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
          >
            {t('common.actions.close')}
          </button>
        </div>
      </div>
    </div>
  );
}

function CredentialDetailField({
  label,
  value,
  monospace = false,
  wide = false,
}: {
  label: string;
  value: string;
  monospace?: boolean;
  wide?: boolean;
}) {
  return (
    <div className={wide ? 'sm:col-span-2' : undefined}>
      <div className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</div>
      <div
        className={`break-words rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 dark:border-white/10 dark:bg-black dark:text-slate-200 ${
          monospace ? 'font-mono text-xs' : ''
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export function ChannelAdmin() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [editingChannel, setEditingChannel] = useState<ChannelItem | null>(null);
  const [viewingCredentialChannel, setViewingCredentialChannel] = useState<ChannelItem | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [loading, setLoading] = useState(true);
  const [providerSecretLoading, setProviderSecretLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pendingChannelId, setPendingChannelId] = useState<string | null>(null);
  const [pendingChannelAction, setPendingChannelAction] = useState<PendingChannelAction | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation | null>(null);
  const [confirmDeleteBusy, setConfirmDeleteBusy] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [providerSecretLoadError, setProviderSecretLoadError] = useState<string | null>(null);
  const [channels, setChannels] = useState<ChannelItem[]>([]);
  const [providerSecrets, setProviderSecrets] = useState<ProviderSecretItem[]>([]);
  const pageSize = 8;

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  }, []);

  const loadChannels = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const channelData = await ChannelService.fetchChannels();
      if (isActive()) {
        setChannels(channelData);
      }
    } catch (err) {
      if (isActive()) {
        setLoadError(getLoadErrorMessage(err, t('admin.channel.errors.channelsLoadFallback')));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, [t]);

  const loadProviderSecrets = useCallback(async (isActive: () => boolean = () => true) => {
    setProviderSecretLoading(true);
    setProviderSecretLoadError(null);
    try {
      const secretData = await ProviderSecretService.fetchProviderSecrets();
      if (isActive()) {
        setProviderSecrets(secretData);
      }
    } catch (err) {
      if (isActive()) {
        setProviderSecretLoadError(getLoadErrorMessage(err, t('admin.channel.errors.credentialsLoadFallback')));
      }
    } finally {
      if (isActive()) {
        setProviderSecretLoading(false);
      }
    }
  }, [t]);

  const loadData = useCallback(async (isActive: () => boolean = () => true) => {
    await Promise.all([loadChannels(isActive), loadProviderSecrets(isActive)]);
  }, [loadChannels, loadProviderSecrets]);

  useEffect(() => {
    let active = true;
    void loadData(() => active);
    return () => {
      active = false;
    };
  }, [loadData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeTab]);

  const filteredChannels = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return channels.filter((channel) => {
      const matchesTab = activeTab === 'all' || channel.vendor === activeTab;
      const searchable = [channel.name, channel.vendor, channel.protocol, ...channel.models].join(' ').toLowerCase();
      return matchesTab && (!keyword || searchable.includes(keyword));
    });
  }, [activeTab, channels, search]);

  const totalItems = filteredChannels.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedChannels = filteredChannels.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const viewingCredential = viewingCredentialChannel
    ? findCredentialForChannel(viewingCredentialChannel, providerSecrets)
    : null;

  const openCreateModal = () => {
    setEditingChannel(null);
    setModalMode('create');
  };

  const openEditModal = (channel: ChannelItem) => {
    setEditingChannel(channel);
    setModalMode('edit');
  };

  const closeModal = () => {
    if (saving) {
      return;
    }
    setModalMode(null);
    setEditingChannel(null);
  };

  const closeDeleteConfirmation = () => {
    if (confirmDeleteBusy) {
      return;
    }
    setDeleteConfirmation(null);
  };

  const openDeleteChannelConfirmation = (channel: ChannelItem) => {
    setDeleteConfirmation({
      id: channel.id,
      title: t('admin.channel.confirm.deleteChannelTitle'),
      description: t('admin.channel.confirm.deleteChannelDescription', { name: channel.name }),
      confirmLabel: t('admin.channel.actions.deleteChannel'),
    });
  };

  const handleSubmitChannel = async (channel: ChannelFormValues) => {
    setSaving(true);
    try {
      if (modalMode === 'edit' && editingChannel) {
        const updated = await ChannelService.updateChannel(editingChannel.id, createChannelUpdateInputFromForm(channel));
        if (updated) {
          setChannels((current) => current.map((item) => (item.id === editingChannel.id ? updated : item)));
        }
        setLoadError(null);
        showToast(t('admin.channel.messages.channelUpdated'));
      } else {
        const added = await ChannelService.addChannel(createChannelInputFromForm(channel));
        setChannels((current) => [added, ...current]);
        setLoadError(null);
        showToast(t('admin.channel.messages.channelCreated'));
      }
      setModalMode(null);
      setEditingChannel(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : t('admin.channel.errors.channelSaveFailed');
      showToast(message, 'error');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateChannel = async (id: string, updates: ChannelUpdateInput, successMessage: string) => {
    setPendingChannelId(id);
    setPendingChannelAction('update');
    try {
      const updated = await ChannelService.updateChannel(id, updates);
      if (updated) {
        setChannels((current) => current.map((item) => (item.id === id ? updated : item)));
      }
      setLoadError(null);
      showToast(successMessage, 'info');
    } catch (err) {
      showToast(err instanceof Error ? err.message : t('admin.channel.errors.channelUpdateFailed'), 'error');
    } finally {
      setPendingChannelId(null);
      setPendingChannelAction(null);
    }
  };

  const handleTestChannel = async (id: string) => {
    setPendingChannelId(id);
    setPendingChannelAction('test');
    try {
      const result = await ChannelService.testChannel(id);
      setChannels((current) => current.map((item) => (item.id === id ? result.item : item)));
      showToast(
        result.success
          ? t('admin.channel.messages.channelTestPassed', { latency: result.latency })
          : t('admin.channel.messages.channelTestFailed', { latency: result.latency }),
        result.success ? 'success' : 'error',
      );
    } catch (err) {
      showToast(err instanceof Error ? err.message : t('admin.channel.errors.channelTestFailed'), 'error');
    } finally {
      setPendingChannelId(null);
      setPendingChannelAction(null);
    }
  };

  const deleteChannelById = async (id: string) => {
    setPendingChannelId(id);
    setPendingChannelAction('delete');
    try {
      const success = await ChannelService.deleteChannel(id);
      if (success) {
        setChannels((current) => current.filter((item) => item.id !== id));
      }
      setLoadError(null);
      showToast(t('admin.channel.messages.channelDeleted'), 'info');
    } catch (err) {
      showToast(err instanceof Error ? err.message : t('admin.channel.errors.channelDeleteFailed'), 'error');
    } finally {
      setPendingChannelId(null);
      setPendingChannelAction(null);
    }
  };

  const executeConfirmedDelete = async () => {
    if (!deleteConfirmation || confirmDeleteBusy) {
      return;
    }
    const confirmation = deleteConfirmation;
    setConfirmDeleteBusy(true);
    try {
      await deleteChannelById(confirmation.id);
      setDeleteConfirmation(null);
    } finally {
      setConfirmDeleteBusy(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      {toast && (
        <div
          className={`fixed right-6 top-6 z-40 rounded-lg border px-4 py-3 text-sm shadow-lg ${
            toast.type === 'error'
              ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
            <Network className="w-6 h-6 text-emerald-500" />
            {t('admin.channel.title')}
          </h2>
          <p className="text-sm text-slate-500">{t('admin.channel.subtitle')}</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t('admin.channel.searchPlaceholder')}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500 w-full sm:w-64 text-slate-900 dark:text-white placeholder-slate-500 transition-colors shadow-sm"
            />
          </div>
          <button
            onClick={openCreateModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 flex-shrink-0 shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t('common.actions.addChannel')}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-white/10 pb-4 overflow-x-auto hide-scrollbar">
        {channelTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {'labelKey' in tab ? t(tab.labelKey) : tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-[#121212] sticky top-0 border-b border-slate-200 dark:border-white/10 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">{t('admin.channel.table.channel')}</th>
                <th className="px-6 py-4">{t('admin.channel.table.provider')}</th>
                <th className="px-6 py-4 w-48">{t('admin.channel.table.models')}</th>
                <th className="px-6 py-4">{t('admin.channel.table.weight')}</th>
                <th className="px-6 py-4">{t('admin.channel.table.status')}</th>
                <th className="px-6 py-4 text-right">{t('admin.channel.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {loading ? (
                <BusinessStateTableRow colSpan={6} kind="loading" title={t('admin.channel.states.loadingChannels')} />
              ) : loadError ? (
                <BusinessStateTableRow
                  colSpan={6}
                  kind="error"
                  title={t('admin.channel.states.channelsLoadErrorTitle')}
                  description={loadError}
                  onRetry={() => void loadChannels()}
                />
              ) : paginatedChannels.length === 0 ? (
                <BusinessStateTableRow
                  colSpan={6}
                  kind="empty"
                  title={t('admin.channel.states.emptyChannelsTitle')}
                  description={
                    channels.length === 0
                      ? t('admin.channel.states.emptyChannelsDescription')
                      : t('admin.channel.states.emptySearchDescription')
                  }
                  action={channels.length === 0 ? { label: t('common.actions.addChannel'), onClick: openCreateModal } : undefined}
                />
              ) : (
                paginatedChannels.map((channel) => (
                  <tr key={channel.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 align-top">
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            channel.status === 'active'
                              ? 'bg-emerald-500'
                              : channel.status === 'disabled'
                                ? 'bg-slate-400'
                                : 'bg-red-500'
                          }`}
                        />
                        {channel.name}
                      </div>
                      <CapabilityBadges capabilities={channel.capabilities} />
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-medium text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-slate-400" />
                          {channel.vendor}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Layers className="w-3.5 h-3.5" />
                          {channel.protocol}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Key className="w-3.5 h-3.5" />
                          {channel.accessType}
                        </span>
                        {channel.circuitBreakerPolicy && (
                          <span className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Network className="w-3.5 h-3.5" />
                            {t('admin.channel.table.circuitBreakerCount', {
                              count: channel.circuitBreakerPolicy.failureThreshold,
                            })}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-wrap gap-1.5">
                        {channel.models.slice(0, 3).map((model) => (
                          <span
                            key={model}
                            className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5"
                          >
                            {model}
                          </span>
                        ))}
                        {channel.models.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-50 dark:bg-black text-[10px] font-mono text-slate-500 border border-dashed border-slate-200 dark:border-white/10">
                            +{channel.models.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-slate-700 dark:text-slate-300 align-top">{channel.weight}</td>
                    <td className="px-6 py-4 align-top">
                      <StatusBadge channel={channel} />
                    </td>
                    <td className="px-6 py-4 text-right align-middle">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <IconButton
                          title={t('admin.channel.actions.viewCredential')}
                          onClick={() => setViewingCredentialChannel(channel)}
                          disabled={pendingChannelId === channel.id}
                        >
                          <Key className="w-4 h-4" />
                        </IconButton>
                        <IconButton title={t('admin.channel.actions.editChannel')} onClick={() => openEditModal(channel)} disabled={pendingChannelId === channel.id}>
                          <Edit2 className="w-4 h-4" />
                        </IconButton>
                        <IconButton
                          title={t('admin.channel.actions.testChannel')}
                          onClick={() => void handleTestChannel(channel.id)}
                          disabled={pendingChannelId === channel.id}
                        >
                          {pendingChannelId === channel.id && pendingChannelAction === 'test' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Network className="w-4 h-4" />
                          )}
                        </IconButton>
                        <IconButton
                          title={channel.status === 'active'
                            ? t('admin.channel.actions.disableChannel')
                            : t('admin.channel.actions.enableChannel')}
                          onClick={() =>
                            void handleUpdateChannel(
                              channel.id,
                              createChannelStatusUpdateInput(channel.status === 'active' ? 'disabled' : 'active'),
                              channel.status === 'active'
                                ? t('admin.channel.messages.channelDisabled')
                                : t('admin.channel.messages.channelEnabled'),
                            )
                          }
                          disabled={pendingChannelId === channel.id}
                          tone="warning"
                        >
                          {pendingChannelId === channel.id && pendingChannelAction === 'update' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : channel.status === 'active' ? (
                            <Ban className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </IconButton>
                        <IconButton
                          title={t('admin.channel.actions.deleteChannel')}
                          onClick={() => openDeleteChannelConfirmation(channel)}
                          disabled={pendingChannelId === channel.id}
                          tone="danger"
                        >
                          {pendingChannelId === channel.id && pendingChannelAction === 'delete' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#121212] flex items-center justify-between">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {t('admin.channel.pagination.total', { count: totalItems })}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              {t('admin.channel.pagination.page', { page: currentPage, totalPages })}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 dark:text-slate-400 dark:hover:text-emerald-400 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                title={t('common.actions.previousPage')}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 dark:text-slate-400 dark:hover:text-emerald-400 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                title={t('common.actions.nextPage')}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {modalMode && (
        <AddAccountModal
          mode={modalMode}
          initialChannel={editingChannel}
          isSaving={saving}
          onClose={closeModal}
          onSubmit={handleSubmitChannel}
        />
      )}
      {viewingCredentialChannel && (
        <CredentialDetailsModal
          channel={viewingCredentialChannel}
          credential={viewingCredential}
          isLoading={providerSecretLoading}
          loadError={providerSecretLoadError}
          onRetry={() => void loadProviderSecrets()}
          onClose={() => setViewingCredentialChannel(null)}
        />
      )}
      {deleteConfirmation && (
        <ConfirmDialog
          title={deleteConfirmation.title}
          description={deleteConfirmation.description}
          confirmLabel={deleteConfirmation.confirmLabel}
          tone="danger"
          icon={<Trash2 className="h-4 w-4" />}
          isBusy={Boolean(confirmDeleteBusy)}
          onConfirm={() => void executeConfirmedDelete()}
          onCancel={closeDeleteConfirmation}
        />
      )}
    </div>
  );
}

function CapabilityBadges({ capabilities }: { capabilities: string[] }) {
  const { t } = useTranslation();
  const mapping: Record<string, { labelKey: string; icon: React.ReactNode; color: string }> = {
    llm: { labelKey: 'common.modality.llm', icon: <MessageSquare className="w-3 h-3" />, color: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' },
    image: { labelKey: 'common.modality.image', icon: <ImageIcon className="w-3 h-3" />, color: 'bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400' },
    audio: { labelKey: 'common.modality.audio', icon: <Mic className="w-3 h-3" />, color: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' },
    music: { labelKey: 'common.modality.music', icon: <Music className="w-3 h-3" />, color: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' },
    sfx: { labelKey: 'common.modality.sfx', icon: <Volume2 className="w-3 h-3" />, color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400' },
    video: { labelKey: 'common.modality.video', icon: <Video className="w-3 h-3" />, color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400' },
  };

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {capabilities.map((capability) => {
        const info = mapping[capability];
        if (!info) {
          return null;
        }
        return (
          <span key={capability} className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap ${info.color}`}>
            {info.icon}
            {t(info.labelKey)}
          </span>
        );
      })}
    </div>
  );
}

function StatusBadge({ channel }: { channel: ChannelItem }) {
  const { t } = useTranslation();
  if (channel.status === 'active') {
    return (
      <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
        <CheckCircle className="w-3.5 h-3.5" />
        {t('admin.channel.status.active')}
      </span>
    );
  }
  if (channel.status === 'disabled') {
    return (
      <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-medium">
        <Ban className="w-3.5 h-3.5" />
        {t('admin.channel.status.disabled')}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-red-600 dark:text-red-400 text-xs font-medium">
      <AlertCircle className="w-3.5 h-3.5" />
      {t('admin.channel.status.errors', { count: channel.errors })}
    </span>
  );
}

function ProviderSecretStatusBadge({ status }: { status: ProviderSecretItem['status'] }) {
  const { t } = useTranslation();
  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        <CheckCircle className="h-3.5 w-3.5" />
        {t('admin.channel.status.active')}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
      <Ban className="h-3.5 w-3.5" />
      {t('admin.channel.status.disabled')}
    </span>
  );
}

function IconButton({
  title,
  children,
  disabled,
  tone = 'default',
  onClick,
}: {
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
  tone?: 'default' | 'warning' | 'danger';
  onClick: () => void;
}) {
  const toneClass =
    tone === 'danger'
      ? 'text-red-500 hover:text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10'
      : tone === 'warning'
        ? 'text-amber-600 hover:text-amber-700 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10'
        : 'text-blue-600 hover:text-blue-700 dark:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10';
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      className={`p-1.5 rounded transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${toneClass}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
