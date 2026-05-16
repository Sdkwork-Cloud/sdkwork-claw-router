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
  createProviderSecretInputFromForm,
  createProviderSecretStatusUpdateInput,
  createProviderSecretUpdateInputFromForm,
  resolveAuthTypeFormValue,
  resolveAuthTypeSubmitValue,
  resolveChannelSelectFormValue,
  resolveChannelSelectSubmitValue,
  type ChannelFormValues,
  type ProviderSecretFormValues,
} from './channelForm';
import { BusinessStateTableRow, ConfirmDialog } from 'sdkwork-claw-router-commons';

type ToastState = { message: string; type: 'success' | 'info' | 'error' } | null;
type ModalMode = 'create' | 'edit';
type SecretModalMode = 'create' | 'edit';
type PendingChannelAction = 'test' | 'update' | 'delete';
type DeleteConfirmation =
  | {
      kind: 'channel';
      id: string;
      title: string;
      description: string;
      confirmLabel: string;
    }
  | {
      kind: 'providerSecret';
      id: string;
      title: string;
      description: string;
      confirmLabel: string;
    };

const capabilityOptions = [
  { id: 'llm', label: 'LLM', icon: <MessageSquare className="w-3.5 h-3.5" /> },
  { id: 'image', label: 'Image', icon: <ImageIcon className="w-3.5 h-3.5" /> },
  { id: 'audio', label: 'Audio', icon: <Mic className="w-3.5 h-3.5" /> },
  { id: 'music', label: 'Music', icon: <Music className="w-3.5 h-3.5" /> },
  { id: 'sfx', label: 'SFX', icon: <Volume2 className="w-3.5 h-3.5" /> },
  { id: 'video', label: 'Video', icon: <Video className="w-3.5 h-3.5" /> },
];

const channelTabs = [
  { id: 'all', label: 'All channels' },
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

function isValidSecretRef(value: string): boolean {
  const locator = value.startsWith('vault://')
    ? value.slice('vault://'.length)
    : value.startsWith('secret://')
      ? value.slice('secret://'.length)
      : '';
  return locator.replace(/\//g, '').length > 0 && /^[\x21-\x7e]+$/.test(value);
}

function getLoadErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function readPositiveIntegerFormValue(formData: FormData, key: string): number {
  const rawValue = formData.get(key);
  const normalized = typeof rawValue === 'string' ? rawValue.trim() : '';
  if (!normalized) {
    throw new Error(`${key} is required.`);
  }
  if (!/^\d+$/.test(normalized)) {
    throw new Error(`${key} must be a positive integer.`);
  }
  const value = Number(normalized);
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new Error(`${key} must be a positive integer.`);
  }
  return value;
}

function AddAccountModal({
  mode,
  initialChannel,
  providerSecrets,
  isSaving,
  onClose,
  onSubmit,
}: {
  mode: ModalMode;
  initialChannel?: ChannelItem | null;
  providerSecrets: ProviderSecretItem[];
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (channel: ChannelFormValues) => Promise<void>;
}) {
  const [selectedProtocol, setSelectedProtocol] = useState(resolveChannelSelectFormValue(initialChannel?.protocol, protocolsList, 'OpenAI'));
  const [activeAuthType, setActiveAuthType] = useState(resolveAuthTypeFormValue(initialChannel?.accessType, authTypesList));
  const [showMoreAuth, setShowMoreAuth] = useState(false);
  const [modelVendor, setModelVendor] = useState(resolveChannelSelectFormValue(initialChannel?.vendor, knownModelVendors, 'OpenAI'));
  const [whitelist, setWhitelist] = useState<string[]>(initialChannel?.models?.length ? initialChannel.models : []);
  const [capabilities, setCapabilities] = useState<string[]>(
    initialChannel?.capabilities?.length ? initialChannel.capabilities : ['llm'],
  );
  const [secretRef, setSecretRef] = useState(initialChannel?.secretRef ?? '');
  const [customModel, setCustomModel] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const isEdit = mode === 'edit';
  const availableSecrets = useMemo(() => {
    const providerCode = providerCodeForVendor(modelVendor);
    return providerSecrets.filter(
      (secret) => secret.status === 'active' && secret.providerCode === providerCode,
    );
  }, [modelVendor, providerSecrets]);

  useEffect(() => {
    if (!initialChannel && modelVendor) {
      setWhitelist((prefillModels[modelVendor] ?? []).slice(0, 5));
    }
  }, [initialChannel, modelVendor]);

  useEffect(() => {
    if (!initialChannel && !secretRef && availableSecrets.length > 0) {
      setSecretRef(availableSecrets[0].secretRef);
    }
  }, [availableSecrets, initialChannel, secretRef]);

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
    const submittedSecretRef = String(formData.get('secretRef') ?? '').trim();
    const models = whitelist.map((item) => item.trim()).filter(Boolean);

    if (!name) {
      setLocalError('Channel name is required.');
      return;
    }
    if (!isEdit && !submittedSecretRef) {
      setLocalError('Secret reference is required for new channels.');
      return;
    }
    if (submittedSecretRef && !isValidSecretRef(submittedSecretRef)) {
      setLocalError('Secret reference must use vault:// or secret:// and include a visible ASCII locator.');
      return;
    }
    if (models.length === 0) {
      setLocalError('At least one model must be bound to the channel.');
      return;
    }

    try {
      const weight = readPositiveIntegerFormValue(formData, 'weight');
      await onSubmit({
        name,
        vendor: modelVendor,
        protocol: resolveChannelSelectSubmitValue(selectedProtocol, protocolsList, 'protocol'),
        accessType: resolveAuthTypeSubmitValue(activeAuthType, authTypesList),
        baseUrl,
        secretRef: submittedSecretRef,
        capabilities,
        models,
        weight,
        status: initialChannel?.status ?? 'active',
      });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Channel save failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto w-full">
      <div className="absolute inset-0" onClick={isSaving ? undefined : onClose} />
      <div className="relative bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-6xl overflow-hidden flex flex-col my-4 h-[95vh] z-10">
        <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#121212] shrink-0">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-wide flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-500" />
            {isEdit ? 'Edit channel account' : 'Add channel account'}
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
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">Channel name</label>
                  <input
                    required
                    name="name"
                    type="text"
                    defaultValue={initialChannel?.name ?? ''}
                    placeholder="OpenAI primary"
                    className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">Vendor</label>
                  <div className="relative">
                    <select
                      value={modelVendor}
                      onChange={(event) => setModelVendor(event.target.value)}
                      className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg pl-3 pr-10 py-2 text-sm font-medium focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white shadow-sm appearance-none transition-colors"
                    >
                      {knownModelVendors.map((vendor) => (
                        <option key={vendor.id} value={vendor.id}>
                          {vendor.name}
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
                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">Protocol</label>
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
                        {protocol.label}
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
                  <label className="text-sm text-slate-700 dark:text-slate-300 font-medium">Credential mode</label>
                  <button
                    type="button"
                    onClick={() => setShowMoreAuth((current) => !current)}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    {showMoreAuth ? 'Hide advanced modes' : 'Show advanced modes'}
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
                              {type.title}
                            </span>
                          </span>
                          <span className={`text-[10px] font-mono tracking-wide ${isActive ? 'text-emerald-700/70 dark:text-emerald-400/70' : 'text-slate-500'}`}>
                            {type.desc}
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
                        <span className="text-[10px] opacity-80">Custom backend auth type</span>
                      </span>
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">Base URL</label>
                  <input
                    type="url"
                    name="baseUrl"
                    defaultValue={initialChannel?.baseUrl ?? ''}
                    placeholder="https://api.openai.com/v1"
                    className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">Secret reference</label>
                  <select
                    value={availableSecrets.some((secret) => secret.secretRef === secretRef) ? secretRef : ''}
                    onChange={(event) => setSecretRef(event.target.value)}
                    className="mb-2 w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Manual reference</option>
                    {availableSecrets.map((secret) => (
                      <option key={secret.id} value={secret.secretRef}>
                        {secret.name} ({secret.maskedLabel})
                      </option>
                    ))}
                  </select>
                  <input
                    required={!isEdit}
                    type="text"
                    name="secretRef"
                    value={secretRef}
                    onChange={(event) => setSecretRef(event.target.value)}
                    placeholder="vault://providers/openai/account/main"
                    className="w-full font-mono bg-white dark:bg-black border border-slate-200 dark:border-white/10 focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">Traffic weight</label>
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

              <div>
                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">Capabilities</label>
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
                        <span className="whitespace-nowrap">{capability.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex-1 px-6 py-4 bg-slate-50 dark:bg-transparent overflow-y-auto custom-scrollbar flex flex-col h-[70vh] lg:h-auto">
              <div className="mb-4 shrink-0">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Model allowlist</h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Bind the provider models supported by this channel. Global model mapping is managed by the routing strategy contract.
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
                    <div className="col-span-2 text-slate-500 text-sm text-center py-8">At least one model must be bound to the channel.</div>
                  )}
                </div>

                <div className="mt-auto space-y-4 shrink-0">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">{whitelist.length} models</span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={fillRelatedModels}
                      className="border border-indigo-500 text-indigo-500 dark:border-indigo-500/50 dark:text-indigo-400 px-4 py-2 rounded-lg text-sm hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors font-medium"
                    >
                      Apply defaults
                    </button>
                    <button
                      type="button"
                      onClick={() => setWhitelist([])}
                      className="border border-red-500 text-red-500 dark:border-red-500/50 dark:text-red-400 px-4 py-2 rounded-lg text-sm hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-medium"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                    <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">Add model</label>
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
                        Add
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
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 flex items-center gap-2"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? 'Save changes' : 'Create channel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProviderSecretModal({
  mode,
  initialSecret,
  isSaving,
  onClose,
  onSubmit,
}: {
  mode: SecretModalMode;
  initialSecret?: ProviderSecretItem | null;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (secret: ProviderSecretFormValues) => Promise<void>;
}) {
  const [providerCode, setProviderCode] = useState(initialSecret?.providerCode ?? 'openai');
  const [authType, setAuthType] = useState(resolveAuthTypeFormValue(initialSecret?.authType, authTypesList));
  const [secretRef, setSecretRef] = useState(initialSecret?.secretRef ?? '');
  const [status, setStatus] = useState<'active' | 'disabled'>(initialSecret?.status ?? 'active');
  const [localError, setLocalError] = useState<string | null>(null);
  const isEdit = mode === 'edit';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const normalizedSecretRef = secretRef.trim();

    if (!name) {
      setLocalError('Credential name is required.');
      return;
    }
    if (!normalizedSecretRef) {
      setLocalError('Secret reference is required.');
      return;
    }
    if (!isValidSecretRef(normalizedSecretRef)) {
      setLocalError('Secret reference must use vault:// or secret:// and include a visible ASCII locator.');
      return;
    }

    try {
      await onSubmit({
        providerCode,
        name,
        authType,
        secretRef: normalizedSecretRef,
        status,
      });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Credential save failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={isSaving ? undefined : onClose} />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#1a1a1a]">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-[#121212]">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <Key className="h-5 w-5 text-emerald-500" />
            {isEdit ? 'Edit credential reference' : 'Add credential reference'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="text-slate-400 transition-colors hover:text-slate-600 disabled:opacity-50 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          {localError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              <AlertCircle className="h-4 w-4" />
              {localError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Provider</label>
              <select
                value={providerCode}
                onChange={(event) => setProviderCode(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
              >
                {knownModelVendors.map((vendor) => {
                  const code = providerCodeForVendor(vendor.id);
                  return (
                    <option key={vendor.id} value={code}>
                      {vendor.name}
                    </option>
                  );
                })}
                {!knownModelVendors.some((vendor) => providerCodeForVendor(vendor.id) === providerCode) && (
                  <option value={providerCode}>{providerCode}</option>
                )}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Credential name</label>
              <input
                required
                name="name"
                type="text"
                defaultValue={initialSecret?.name ?? ''}
                placeholder="OpenAI production"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Auth type</label>
              <select
                value={authType}
                onChange={(event) => setAuthType(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
              >
                {authTypesList.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.title}
                  </option>
                ))}
                {!authTypesList.some((type) => type.id === authType) && (
                  <option value={authType}>{authType}</option>
                )}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value === 'disabled' ? 'disabled' : 'active')}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
              >
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Secret reference</label>
            <input
              required
              type="text"
              value={secretRef}
              onChange={(event) => setSecretRef(event.target.value)}
              placeholder="vault://providers/openai/account/main"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? 'Save reference' : 'Create reference'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CredentialReferencePanel({
  secrets,
  loading,
  loadError,
  pendingSecretId,
  onAdd,
  onRetry,
  onEdit,
  onToggle,
  onDelete,
}: {
  secrets: ProviderSecretItem[];
  loading: boolean;
  loadError: string | null;
  pendingSecretId: string | null;
  onAdd: () => void;
  onRetry: () => void;
  onEdit: (secret: ProviderSecretItem) => void;
  onToggle: (secret: ProviderSecretItem) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#1a1a1a]">
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-white/10 dark:bg-[#121212] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Key className="h-4 w-4 text-emerald-500" />
            Credential references
          </h3>
          <p className="mt-1 text-xs text-slate-500">Vault/KMS handles used by provider channel accounts.</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
        >
          <Plus className="h-4 w-4" />
          Add credential
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          <thead className="border-b border-slate-200 bg-white text-xs font-semibold uppercase text-slate-500 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-slate-400">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Provider</th>
              <th className="px-5 py-3">Reference</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5">
            {loading ? (
              <BusinessStateTableRow colSpan={5} kind="loading" title="Loading credential references..." />
            ) : loadError ? (
              <BusinessStateTableRow
                colSpan={5}
                kind="error"
                title="Credential references could not be loaded"
                description={loadError}
                onRetry={onRetry}
              />
            ) : secrets.length === 0 ? (
              <BusinessStateTableRow
                colSpan={5}
                kind="empty"
                title="No credential references registered"
                description="Add a vault or KMS reference before binding provider channels."
                action={{ label: 'Add credential', onClick: onAdd }}
              />
            ) : (
              secrets.slice(0, 6).map((secret) => (
                <tr key={secret.id} className="group transition-colors hover:bg-slate-50 dark:hover:bg-white/5">
                  <td className="px-5 py-3">
                    <div className="font-medium text-slate-900 dark:text-white">{secret.name}</div>
                    <div className="mt-0.5 text-xs text-slate-500">{secret.authType}</div>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs">{secret.providerCode}</td>
                  <td className="px-5 py-3">
                    <span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700 dark:bg-white/10 dark:text-slate-300">
                      {secret.maskedLabel}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <ProviderSecretStatusBadge status={secret.status} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                      <IconButton title="Edit credential" onClick={() => onEdit(secret)} disabled={pendingSecretId === secret.id}>
                        <Edit2 className="h-4 w-4" />
                      </IconButton>
                      <IconButton
                        title={secret.status === 'active' ? 'Disable credential' : 'Enable credential'}
                        onClick={() => onToggle(secret)}
                        disabled={pendingSecretId === secret.id}
                        tone="warning"
                      >
                        {pendingSecretId === secret.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : secret.status === 'active' ? (
                          <Ban className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </IconButton>
                      <IconButton
                        title="Delete credential"
                        onClick={() => onDelete(secret.id)}
                        disabled={pendingSecretId === secret.id}
                        tone="danger"
                      >
                        <Trash2 className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ChannelAdmin() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [secretModalMode, setSecretModalMode] = useState<SecretModalMode | null>(null);
  const [editingChannel, setEditingChannel] = useState<ChannelItem | null>(null);
  const [editingSecret, setEditingSecret] = useState<ProviderSecretItem | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [loading, setLoading] = useState(true);
  const [providerSecretLoading, setProviderSecretLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [secretSaving, setSecretSaving] = useState(false);
  const [pendingChannelId, setPendingChannelId] = useState<string | null>(null);
  const [pendingChannelAction, setPendingChannelAction] = useState<PendingChannelAction | null>(null);
  const [pendingSecretId, setPendingSecretId] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation | null>(null);
  const [confirmDeleteBusy, setConfirmDeleteBusy] = useState<DeleteConfirmation['kind'] | null>(null);
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
        setLoadError(getLoadErrorMessage(err, 'Failed to fetch channel accounts.'));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, []);

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
        setProviderSecretLoadError(getLoadErrorMessage(err, 'Failed to fetch credential references.'));
      }
    } finally {
      if (isActive()) {
        setProviderSecretLoading(false);
      }
    }
  }, []);

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

  const openCreateSecretModal = () => {
    setEditingSecret(null);
    setSecretModalMode('create');
  };

  const openEditSecretModal = (secret: ProviderSecretItem) => {
    setEditingSecret(secret);
    setSecretModalMode('edit');
  };

  const closeSecretModal = () => {
    if (secretSaving) {
      return;
    }
    setSecretModalMode(null);
    setEditingSecret(null);
  };

  const closeDeleteConfirmation = () => {
    if (confirmDeleteBusy) {
      return;
    }
    setDeleteConfirmation(null);
  };

  const openDeleteChannelConfirmation = (channel: ChannelItem) => {
    setDeleteConfirmation({
      kind: 'channel',
      id: channel.id,
      title: 'Delete channel account?',
      description: `This permanently removes ${channel.name} from provider routing. Active traffic should be moved before confirming.`,
      confirmLabel: 'Delete channel',
    });
  };

  const openDeleteProviderSecretConfirmation = (secret: ProviderSecretItem) => {
    setDeleteConfirmation({
      kind: 'providerSecret',
      id: secret.id,
      title: 'Delete credential reference?',
      description: `This removes ${secret.name} from the admin credential registry. Channels that depend on this reference must be updated before confirming.`,
      confirmLabel: 'Delete credential',
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
        showToast('Channel updated.');
      } else {
        const added = await ChannelService.addChannel(createChannelInputFromForm(channel));
        setChannels((current) => [added, ...current]);
        setLoadError(null);
        showToast('Channel created.');
      }
      setModalMode(null);
      setEditingChannel(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Channel save failed';
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
      showToast(err instanceof Error ? err.message : 'Channel update failed', 'error');
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
          ? `Channel test passed${result.latency ? `, latency ${result.latency}` : ''}.`
          : `Channel test failed${result.latency ? `, latency ${result.latency}` : ''}.`,
        result.success ? 'success' : 'error',
      );
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Channel test failed', 'error');
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
      showToast('Channel deleted.', 'info');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Channel delete failed', 'error');
    } finally {
      setPendingChannelId(null);
      setPendingChannelAction(null);
    }
  };

  const handleSubmitProviderSecret = async (secret: ProviderSecretFormValues) => {
    setSecretSaving(true);
    try {
      if (secretModalMode === 'edit' && editingSecret) {
        const updated = await ProviderSecretService.updateProviderSecret(editingSecret.id, createProviderSecretUpdateInputFromForm(secret));
        if (updated) {
          setProviderSecrets((current) => current.map((item) => (item.id === editingSecret.id ? updated : item)));
        }
        setProviderSecretLoadError(null);
        showToast('Credential reference updated.');
      } else {
        const added = await ProviderSecretService.addProviderSecret(createProviderSecretInputFromForm(secret));
        setProviderSecrets((current) => [added, ...current]);
        setProviderSecretLoadError(null);
        showToast('Credential reference created.');
      }
      setSecretModalMode(null);
      setEditingSecret(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Credential save failed';
      showToast(message, 'error');
      throw err;
    } finally {
      setSecretSaving(false);
    }
  };

  const handleToggleProviderSecret = async (secret: ProviderSecretItem) => {
    setPendingSecretId(secret.id);
    try {
      const nextStatus = secret.status === 'active' ? 'disabled' : 'active';
      const updated = await ProviderSecretService.updateProviderSecret(secret.id, createProviderSecretStatusUpdateInput(nextStatus));
      if (updated) {
        setProviderSecrets((current) => current.map((item) => (item.id === secret.id ? updated : item)));
      }
      setProviderSecretLoadError(null);
      showToast(nextStatus === 'active' ? 'Credential reference enabled.' : 'Credential reference disabled.', 'info');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Credential update failed', 'error');
    } finally {
      setPendingSecretId(null);
    }
  };

  const deleteProviderSecretById = async (id: string) => {
    setPendingSecretId(id);
    try {
      const success = await ProviderSecretService.deleteProviderSecret(id);
      if (success) {
        setProviderSecrets((current) => current.filter((item) => item.id !== id));
      }
      setProviderSecretLoadError(null);
      showToast('Credential reference deleted.', 'info');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Credential delete failed', 'error');
    } finally {
      setPendingSecretId(null);
    }
  };

  const executeConfirmedDelete = async () => {
    if (!deleteConfirmation || confirmDeleteBusy) {
      return;
    }
    const confirmation = deleteConfirmation;
    setConfirmDeleteBusy(confirmation.kind);
    try {
      if (confirmation.kind === 'channel') {
        await deleteChannelById(confirmation.id);
      } else {
        await deleteProviderSecretById(confirmation.id);
      }
      setDeleteConfirmation(null);
    } finally {
      setConfirmDeleteBusy(null);
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
            Channel accounts
          </h2>
          <p className="text-sm text-slate-500">Provider routing accounts, model bindings, weights, and credential references.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search channels"
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
            <span className="hidden sm:inline">Add channel</span>
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
            {tab.label}
          </button>
        ))}
      </div>

      <CredentialReferencePanel
        secrets={providerSecrets}
        loading={providerSecretLoading}
        loadError={providerSecretLoadError}
        pendingSecretId={pendingSecretId}
        onAdd={openCreateSecretModal}
        onRetry={() => void loadProviderSecrets()}
        onEdit={openEditSecretModal}
        onToggle={(secret) => void handleToggleProviderSecret(secret)}
        onDelete={(id) => {
          const secret = providerSecrets.find((item) => item.id === id);
          if (secret) {
            openDeleteProviderSecretConfirmation(secret);
          }
        }}
      />

      <div className="flex-1 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-[#121212] sticky top-0 border-b border-slate-200 dark:border-white/10 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">Channel</th>
                <th className="px-6 py-4">Provider</th>
                <th className="px-6 py-4 w-48">Models</th>
                <th className="px-6 py-4">Weight</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {loading ? (
                <BusinessStateTableRow colSpan={6} kind="loading" title="Loading channel accounts..." />
              ) : loadError ? (
                <BusinessStateTableRow
                  colSpan={6}
                  kind="error"
                  title="Channel accounts could not be loaded"
                  description={loadError}
                  onRetry={() => void loadChannels()}
                />
              ) : paginatedChannels.length === 0 ? (
                <BusinessStateTableRow
                  colSpan={6}
                  kind="empty"
                  title="No channels found"
                  description={
                    channels.length === 0
                      ? 'Add a provider channel account to start routing model traffic.'
                      : 'Adjust the search query or provider filter to find matching channel accounts.'
                  }
                  action={channels.length === 0 ? { label: 'Add channel', onClick: openCreateModal } : undefined}
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
                        <IconButton title="Edit channel" onClick={() => openEditModal(channel)} disabled={pendingChannelId === channel.id}>
                          <Edit2 className="w-4 h-4" />
                        </IconButton>
                        <IconButton
                          title="Test channel"
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
                          title={channel.status === 'active' ? 'Disable channel' : 'Enable channel'}
                          onClick={() =>
                            void handleUpdateChannel(
                              channel.id,
                              createChannelStatusUpdateInput(channel.status === 'active' ? 'disabled' : 'active'),
                              channel.status === 'active' ? 'Channel disabled.' : 'Channel enabled.',
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
                          title="Delete channel"
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
            Total <span className="font-medium text-slate-900 dark:text-white">{totalItems}</span> channels
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Page {currentPage}
              <span className="text-slate-400 dark:text-slate-500 font-normal"> / {totalPages}</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 dark:text-slate-400 dark:hover:text-emerald-400 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 dark:text-slate-400 dark:hover:text-emerald-400 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                title="Next page"
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
          providerSecrets={providerSecrets}
          isSaving={saving}
          onClose={closeModal}
          onSubmit={handleSubmitChannel}
        />
      )}
      {secretModalMode && (
        <ProviderSecretModal
          mode={secretModalMode}
          initialSecret={editingSecret}
          isSaving={secretSaving}
          onClose={closeSecretModal}
          onSubmit={handleSubmitProviderSecret}
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
  const mapping: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    llm: { label: 'LLM', icon: <MessageSquare className="w-3 h-3" />, color: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' },
    image: { label: 'Image', icon: <ImageIcon className="w-3 h-3" />, color: 'bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400' },
    audio: { label: 'Audio', icon: <Mic className="w-3 h-3" />, color: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' },
    music: { label: 'Music', icon: <Music className="w-3 h-3" />, color: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' },
    sfx: { label: 'SFX', icon: <Volume2 className="w-3 h-3" />, color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400' },
    video: { label: 'Video', icon: <Video className="w-3 h-3" />, color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400' },
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
            {info.label}
          </span>
        );
      })}
    </div>
  );
}

function StatusBadge({ channel }: { channel: ChannelItem }) {
  if (channel.status === 'active') {
    return (
      <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
        <CheckCircle className="w-3.5 h-3.5" />
        Active
      </span>
    );
  }
  if (channel.status === 'disabled') {
    return (
      <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-medium">
        <Ban className="w-3.5 h-3.5" />
        Disabled
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-red-600 dark:text-red-400 text-xs font-medium">
      <AlertCircle className="w-3.5 h-3.5" />
      {channel.errors} errors
    </span>
  );
}

function ProviderSecretStatusBadge({ status }: { status: ProviderSecretItem['status'] }) {
  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        <CheckCircle className="h-3.5 w-3.5" />
        Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
      <Ban className="h-3.5 w-3.5" />
      Disabled
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
