import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Ban,
  Boxes,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Copy,
  Cpu,
  Edit2,
  Eye,
  EyeOff,
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
  ChannelAiResourceService,
  ChannelService,
  ChannelEndpointService,
  ProviderSecretService,
  ChannelModelCatalogService,
  type AiResource,
  type AiResourceCreateInput,
  type AiResourceUpdateInput,
  type ChannelEndpointChannelOption,
  type ChannelItem,
  type ChannelModelCatalogItem,
  type ChannelUpdateInput,
  type ChannelEndpoint,
  type ChannelEndpointCreateInput,
  type ChannelEndpointUpdateInput,
  type ProviderSecretItem,
  isCatalogModelKey,
  normalizeModelCatalogKey,
  providerCodeForVendor,
} from './channelService';
import { authTypesList, knownModelVendors, prefillModels } from './channelOptions';
import {
  createAiResourceEditDraft,
  createAiResourceInputFromForm,
  createAiResourceUpdateInputFromForm,
  createChannelCopyDraft,
  createChannelEditDraft,
  createChannelInputFromForm,
  createChannelStatusUpdateInput,
  createChannelUpdateInputFromForm,
  createChannelEndpointEditDraft,
  createChannelEndpointInputFromForm,
  createChannelEndpointUpdateInputFromForm,
  resolveAuthTypeFormValue,
  resolveAuthTypeSubmitValue,
  resolveChannelSelectFormValue,
  type AiResourceFormValues,
  type ChannelFormValues,
  type ChannelEndpointFormValues,
} from './channelForm';
import {
  deriveChannelTargetVendorCodes,
  reconcileChannelVendorSelection,
} from './channelVendorSelection.ts';
import { AdminTableShell, BusinessStateTableRow, ConfirmDialog } from 'sdkwork-claw-router-commons';

type ToastState = { message: string; type: 'success' | 'info' | 'error' } | null;
type ModalMode = 'create' | 'copy' | 'edit';
type PendingChannelAction = 'test' | 'update' | 'delete';
type AiResourceModalMode = 'create' | 'edit';
type PendingAiResourceAction = 'status';
type ChannelEndpointModalMode = 'create' | 'edit';
type PendingChannelEndpointAction = 'status';
type ChannelType = 'official' | 'relay';
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

const channelTypeOptions: Array<{
  id: ChannelType;
  titleKey: string;
  descKey: string;
}> = [
  {
    id: 'official',
    titleKey: 'admin.channel.channelType.official',
    descKey: 'admin.channel.channelType.officialDesc',
  },
  {
    id: 'relay',
    titleKey: 'admin.channel.channelType.relay',
    descKey: 'admin.channel.channelType.relayDesc',
  },
];

const aiResourceTypeOptions: Array<AiResource['resourceType']> = [
  'vendor',
  'modality',
  'api_endpoint',
  'model_api',
  'bundle',
];

const aiResourceCompositionOptions: Array<AiResource['compositionMode']> = [
  'single',
  'any',
  'all',
];

const aiResourceStatusOptions: Array<AiResource['status']> = [
  'active',
  'disabled',
  'inactive',
];

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

function fallbackCatalogModelKeys(vendor: string): string[] {
  return (prefillModels[vendor] ?? [])
    .filter((model) => !model.includes('/'))
    .map((model) => normalizeModelCatalogKey(model, vendor));
}

function toDateTimeLocalValue(value: string | undefined): string {
  const normalized = value?.trim();
  if (!normalized) {
    return '';
  }
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    return normalized.slice(0, 16);
  }
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function displayChannelTime(value: string | null | undefined, fallback = ''): string {
  const normalized = value?.trim();
  if (!normalized) {
    return fallback;
  }
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    return normalized;
  }
  return date.toLocaleString();
}

function optionalTranslatedLabel(
  t: ReturnType<typeof useTranslation>['t'],
  item: { label?: string; name?: string; labelKey?: string; nameKey?: string },
): string {
  if (typeof item.labelKey === 'string') {
    return t(item.labelKey);
  }
  if (typeof item.nameKey === 'string') {
    return t(item.nameKey);
  }
  return item.label ?? item.name ?? '';
}

function resolveChannelType(value: string | undefined): ChannelType {
  return value === 'relay' ? 'relay' : 'official';
}

function normalizeAiResourceCode(value: string): string {
  return value.trim().toLowerCase();
}

function aiResourceFormValuesFromFormData(formData: FormData): AiResourceFormValues {
  return {
    resourceCode: String(formData.get('resourceCode') ?? ''),
    resourceType: String(formData.get('resourceType') ?? ''),
    displayName: String(formData.get('displayName') ?? ''),
    vendorCode: String(formData.get('vendorCode') ?? ''),
    modalityCode: String(formData.get('modalityCode') ?? ''),
    apiEndpointCode: String(formData.get('apiEndpointCode') ?? ''),
    catalogKey: String(formData.get('catalogKey') ?? ''),
    model: String(formData.get('model') ?? ''),
    providerNativeModel: String(formData.get('providerNativeModel') ?? ''),
    compositionMode: String(formData.get('compositionMode') ?? ''),
    status: String(formData.get('status') ?? ''),
    sortOrder: String(formData.get('sortOrder') ?? ''),
    membersText: String(formData.get('membersText') ?? ''),
  };
}

function channelEndpointFormValuesFromFormData(formData: FormData): ChannelEndpointFormValues {
  return {
    channelId: String(formData.get('channelId') ?? ''),
    vendorCode: String(formData.get('vendorCode') ?? ''),
    regionCode: String(formData.get('regionCode') ?? ''),
    apiEndpointCode: String(formData.get('apiEndpointCode') ?? ''),
    baseUrl: String(formData.get('baseUrl') ?? ''),
    priority: String(formData.get('priority') ?? ''),
    weight: String(formData.get('weight') ?? ''),
    status: String(formData.get('status') ?? ''),
    effectiveFrom: String(formData.get('effectiveFrom') ?? ''),
    effectiveTo: String(formData.get('effectiveTo') ?? ''),
  };
}

function isAiResourceVisibleForAccount(
  resource: AiResource,
  channelType: ChannelType,
  selectedVendorCodes: readonly string[],
  selectedCodes: readonly string[],
): boolean {
  if (selectedCodes.includes(normalizeAiResourceCode(resource.resourceCode))) {
    return true;
  }
  const selectedVendorSet = new Set(selectedVendorCodes);
  if (channelType === 'relay' && selectedVendorSet.size === 0) {
    return true;
  }
  const vendorCode = resource.vendorCode ? providerCodeForVendor(resource.vendorCode) : '';
  return !vendorCode || selectedVendorSet.has(vendorCode);
}

function compareAiResources(
  left: AiResource,
  right: AiResource,
  selectedVendorCodes: readonly string[],
): number {
  const selectedVendorSet = new Set(selectedVendorCodes);
  const leftVendorMatch = left.vendorCode && selectedVendorSet.has(providerCodeForVendor(left.vendorCode)) ? 0 : 1;
  const rightVendorMatch = right.vendorCode && selectedVendorSet.has(providerCodeForVendor(right.vendorCode)) ? 0 : 1;
  if (leftVendorMatch !== rightVendorMatch) {
    return leftVendorMatch - rightVendorMatch;
  }
  const leftOrder = left.sortOrder ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = right.sortOrder ?? Number.MAX_SAFE_INTEGER;
  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }
  return left.resourceCode.localeCompare(right.resourceCode);
}

function findAiResourceByCode(resources: readonly AiResource[], resourceCode: string): AiResource | undefined {
  const normalizedCode = normalizeAiResourceCode(resourceCode);
  return resources.find((resource) => normalizeAiResourceCode(resource.resourceCode) === normalizedCode);
}

function modelVendorIdForCode(vendorCode: string): string {
  const normalizedVendorCode = providerCodeForVendor(vendorCode);
  return knownModelVendors.find((vendor) => providerCodeForVendor(vendor.id) === normalizedVendorCode)?.id
    ?? normalizedVendorCode;
}

function inferProtocolForVendor(vendor: string): string {
  const vendorCode = providerCodeForVendor(vendor);
  if (vendorCode === 'anthropic') {
    return 'Anthropic';
  }
  if (vendorCode === 'google') {
    return 'Gemini';
  }
  if (vendorCode === 'ollama') {
    return 'Ollama';
  }
  return 'OpenAI';
}

function areStringArraysEqual(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function AddAccountModal({
  mode,
  initialValues,
  availableModels,
  aiResources,
  modelCatalogLoading,
  modelCatalogError,
  aiResourcesLoading,
  aiResourcesError,
  isSaving,
  onClose,
  onSubmit,
}: {
  mode: ModalMode;
  initialValues?: ChannelFormValues | null;
  availableModels: ChannelModelCatalogItem[];
  aiResources: AiResource[];
  modelCatalogLoading: boolean;
  modelCatalogError: string | null;
  aiResourcesLoading: boolean;
  aiResourcesError: string | null;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (channel: ChannelFormValues) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [channelType, setChannelType] = useState<ChannelType>(resolveChannelType(initialValues?.channelType));
  const [activeAuthType, setActiveAuthType] = useState(resolveAuthTypeFormValue(initialValues?.accessType, authTypesList));
  const [showMoreAuth, setShowMoreAuth] = useState(false);
  const [modelVendor, setModelVendor] = useState(resolveChannelSelectFormValue(initialValues?.vendor, knownModelVendors, 'OpenAI'));
  const [whitelist, setWhitelist] = useState<string[]>(initialValues?.models?.length ? initialValues.models : []);
  const [selectedResourceCodes, setSelectedResourceCodes] = useState<string[]>(
    initialValues?.resourceCodes?.map(normalizeAiResourceCode).filter(Boolean) ?? [],
  );
  const [selectedVendorCodes, setSelectedVendorCodes] = useState<string[]>(() => deriveChannelTargetVendorCodes({
    channelType: initialValues?.channelType,
    accountVendor: resolveChannelSelectFormValue(initialValues?.vendor, knownModelVendors, 'OpenAI'),
    models: initialValues?.models ?? [],
    resourceCodes: initialValues?.resourceCodes ?? [],
  }));
  const [capabilities, setCapabilities] = useState<string[]>(
    initialValues?.capabilities?.length ? initialValues.capabilities : ['llm'],
  );
  const [customModel, setCustomModel] = useState('');
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const isEdit = mode === 'edit';
  const accountVendorCode = providerCodeForVendor(modelVendor);
  const availableResourceCodes = useMemo(
    () => aiResources
      .filter((resource) => resource.status === 'active')
      .map((resource) => normalizeAiResourceCode(resource.resourceCode)),
    [aiResources],
  );
  const visibleAiResources = useMemo(
    () => aiResources
      .filter((resource) => resource.status === 'active')
      .filter((resource) => isAiResourceVisibleForAccount(
        resource,
        channelType,
        selectedVendorCodes,
        selectedResourceCodes,
      ))
      .sort((left, right) => compareAiResources(left, right, selectedVendorCodes)),
    [channelType, aiResources, selectedResourceCodes, selectedVendorCodes],
  );
  const availableAiResources = useMemo(
    () => visibleAiResources.filter((resource) => !selectedResourceCodes.includes(normalizeAiResourceCode(resource.resourceCode))),
    [selectedResourceCodes, visibleAiResources],
  );
  const selectedVendorCatalogModels = useMemo(
    () => selectedVendorCodes.flatMap((vendorCode) => availableModels.filter((model) => model.vendorCode === vendorCode)),
    [availableModels, selectedVendorCodes],
  );
  const catalogModelsByVendor = useMemo(
    () => selectedVendorCodes.map((vendorCode) => ({
      vendorCode,
      vendorName: optionalTranslatedLabel(t, { name: modelVendorIdForCode(vendorCode) }),
      models: availableModels.filter((model) => model.vendorCode === vendorCode).slice(0, 16),
    })),
    [availableModels, selectedVendorCodes, t],
  );
  const defaultModelKeys = useMemo(() => {
    const catalogKeys = selectedVendorCatalogModels.map((model) => model.catalogKey);
    if (catalogKeys.length > 0) {
      return catalogKeys;
    }
    return selectedVendorCodes.flatMap((vendorCode) => fallbackCatalogModelKeys(modelVendorIdForCode(vendorCode)));
  }, [selectedVendorCatalogModels, selectedVendorCodes]);
  const customModelVendor = selectedVendorCodes[0] ? modelVendorIdForCode(selectedVendorCodes[0]) : modelVendor;
  const customModelVendorCode = selectedVendorCodes[0] ?? accountVendorCode;

  useEffect(() => {
    if (!initialValues && selectedVendorCodes.length > 0) {
      setWhitelist(defaultModelKeys.slice(0, 5));
    }
  }, [defaultModelKeys, initialValues, selectedVendorCodes]);

  useEffect(() => {
    const reconciled = reconcileChannelVendorSelection({
      channelType,
      accountVendor: modelVendor,
      selectedVendorCodes,
      selectedResourceCodes,
      availableResourceCodes,
    });
    if (!areStringArraysEqual(selectedVendorCodes, reconciled.selectedVendorCodes)) {
      setSelectedVendorCodes(reconciled.selectedVendorCodes);
    }
    if (!areStringArraysEqual(selectedResourceCodes, reconciled.selectedResourceCodes)) {
      setSelectedResourceCodes(reconciled.selectedResourceCodes);
    }
  }, [availableResourceCodes, channelType, modelVendor, selectedResourceCodes, selectedVendorCodes]);

  const toggleCapability = (capability: string) => {
    setCapabilities((current) => {
      const next = current.includes(capability)
        ? current.filter((item) => item !== capability)
        : [...current, capability];
      return next.length > 0 ? next : ['llm'];
    });
  };

  const setAccountVendor = (vendor: string) => {
    setModelVendor(vendor);
    if (channelType === 'official') {
      setSelectedVendorCodes([providerCodeForVendor(vendor)]);
    }
  };

  const setAccountType = (nextChannelType: ChannelType) => {
    setChannelType(nextChannelType);
    if (nextChannelType === 'official') {
      setSelectedVendorCodes([accountVendorCode]);
    }
  };

  const toggleTargetVendor = (vendorCode: string) => {
    const normalizedVendorCode = providerCodeForVendor(vendorCode);
    if (channelType === 'official') {
      setAccountVendor(modelVendorIdForCode(normalizedVendorCode));
      setSelectedVendorCodes([normalizedVendorCode]);
      return;
    }
    setSelectedVendorCodes((current) => {
      const next = current.includes(normalizedVendorCode)
        ? current.filter((code) => code !== normalizedVendorCode)
        : [...current, normalizedVendorCode];
      return next.length > 0 ? next : [accountVendorCode];
    });
  };

  const addAiResource = (resourceCode: string) => {
    const normalizedCode = normalizeAiResourceCode(resourceCode);
    if (!normalizedCode) {
      return;
    }
    setSelectedResourceCodes((current) => current.includes(normalizedCode) ? current : [...current, normalizedCode]);
  };

  const removeAiResource = (resourceCode: string) => {
    const normalizedCode = normalizeAiResourceCode(resourceCode);
    setSelectedResourceCodes((current) => current.filter((code) => code !== normalizedCode));
  };

  const clearAiResources = () => {
    const reconciled = reconcileChannelVendorSelection({
      channelType,
      accountVendor: modelVendor,
      selectedVendorCodes,
      selectedResourceCodes: selectedResourceCodes.filter((code) => code.startsWith('vendor.')),
      availableResourceCodes,
    });
    setSelectedResourceCodes(reconciled.selectedResourceCodes);
  };

  const fillRelatedModels = () => {
    setWhitelist(defaultModelKeys);
  };

  const addCustomModel = () => {
    const rawValue = customModel.trim();
    if (!rawValue) {
      return;
    }
    let value: string;
    try {
      value = isCatalogModelKey(rawValue) ? rawValue : normalizeModelCatalogKey(rawValue, customModelVendor);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : t('admin.channel.validation.modelRequired'));
      return;
    }
    if (!whitelist.includes(value)) {
      setWhitelist((current) => [...current, value]);
      setCustomModel('');
    }
  };

  const addCatalogModel = (model: ChannelModelCatalogItem) => {
    setWhitelist((current) => current.includes(model.catalogKey) ? current : [...current, model.catalogKey]);
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
    const expiresAt = String(formData.get('expiresAt') ?? '').trim();
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
        channelType,
        protocol: inferProtocolForVendor(modelVendor),
        accessType: resolveAuthTypeSubmitValue(activeAuthType, authTypesList),
        baseUrl,
        apiKey,
        expiresAt,
        capabilities,
        resourceCodes: selectedResourceCodes,
        models,
        circuitBreakerEnabled,
        circuitBreakerFailureThreshold: String(formData.get('circuitBreakerFailureThreshold') ?? '').trim(),
        weight,
        status: initialValues?.status ?? 'active',
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
            {isEdit
              ? t('admin.channel.modals.editChannelTitle')
              : mode === 'copy'
                ? t('admin.channel.modals.copyChannelTitle')
                : t('admin.channel.modals.addChannelTitle')}
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
                    defaultValue={initialValues?.name ?? ''}
                    placeholder={t('admin.channel.placeholders.channelName')}
                    className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">{t('admin.channel.fields.channelType')}</label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {channelTypeOptions.map((option) => {
                    const isSelected = channelType === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setAccountType(option.id)}
                        className={`rounded-lg border p-3 text-left transition-colors ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-white/10 dark:bg-black dark:text-slate-300 dark:hover:border-white/20'
                        }`}
                      >
                        <span className="flex items-center gap-2 text-sm font-semibold">
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded border ${
                              isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 dark:border-slate-500'
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3 text-white" />}
                          </span>
                          {t(option.titleKey)}
                        </span>
                        <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{t(option.descKey)}</span>
                      </button>
                    );
                  })}
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

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">{t('admin.channel.fields.baseUrl')}</label>
                  <input
                    type="url"
                    name="baseUrl"
                    defaultValue={initialValues?.baseUrl ?? ''}
                    placeholder="https://api.openai.com/v1"
                    className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">{t('admin.channel.fields.apiKey')}</label>
                  <div className="relative">
                    <input
                      required={!isEdit}
                      type={apiKeyVisible ? 'text' : 'password'}
                      name="apiKey"
                      autoComplete="off"
                      placeholder={t('admin.channel.placeholders.apiKey')}
                      className="w-full font-mono bg-white dark:bg-black border border-slate-200 dark:border-white/10 focus:border-emerald-500 rounded-lg px-3 py-2 pr-10 text-sm text-slate-900 dark:text-white focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setApiKeyVisible((current) => !current)}
                      title={apiKeyVisible ? t('admin.channel.actions.hideApiKey') : t('admin.channel.actions.showApiKey')}
                      aria-label={apiKeyVisible ? t('admin.channel.actions.hideApiKey') : t('admin.channel.actions.showApiKey')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200"
                    >
                      {apiKeyVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
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
                    defaultValue={initialValues?.weight ?? 100}
                    className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">{t('admin.channel.fields.expiresAt')}</label>
                  <input
                    name="expiresAt"
                    type="datetime-local"
                    defaultValue={toDateTimeLocalValue(initialValues?.expiresAt)}
                    className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none transition-colors"
                  />
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('admin.channel.help.expiresAt')}</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#121212]">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <input
                    name="circuitBreakerEnabled"
                    type="checkbox"
                    defaultChecked={Boolean(initialValues?.circuitBreakerEnabled)}
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
                    defaultValue={initialValues?.circuitBreakerFailureThreshold ?? 3}
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

            <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 px-6 py-4 dark:bg-transparent custom-scrollbar h-[70vh] lg:h-auto">
              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-black">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{t('admin.channel.vendorPicker.title')}</h4>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {channelType === 'official'
                        ? t('admin.channel.vendorPicker.officialHint')
                        : t('admin.channel.vendorPicker.relayHint')}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-500 dark:bg-white/10 dark:text-slate-400">
                    {t('admin.channel.vendorPicker.selectedCount', { count: selectedVendorCodes.length })}
                  </span>
                </div>

                <div className="grid gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
                      {t('admin.channel.vendorPicker.accountVendor')}
                    </label>
                    <div className="relative">
                      <select
                        value={modelVendor}
                        onChange={(event) => setAccountVendor(event.target.value)}
                        className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-10 text-sm font-medium text-slate-900 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
                      >
                        {knownModelVendors.map((vendor) => (
                          <option key={vendor.id} value={vendor.id}>
                            {optionalTranslatedLabel(t, vendor)}
                          </option>
                        ))}
                        {!knownModelVendors.some((vendor) => vendor.id === modelVendor) && (
                          <option value={modelVendor}>{modelVendor}</option>
                        )}
                      </select>
                      <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {t('admin.channel.vendorPicker.targetVendors')}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">{accountVendorCode}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {knownModelVendors.map((vendor) => {
                        const vendorCode = providerCodeForVendor(vendor.id);
                        const isSelected = selectedVendorCodes.includes(vendorCode);
                        return (
                          <button
                            key={vendor.id}
                            type="button"
                            onClick={() => toggleTargetVendor(vendorCode)}
                            className={`flex min-h-10 items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs transition-colors ${
                              isSelected
                                ? 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300'
                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 dark:border-white/10 dark:bg-[#1e1e1e] dark:text-slate-400 dark:hover:border-white/20'
                            }`}
                          >
                            <span
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 dark:border-slate-500'
                              }`}
                            >
                              {isSelected && <Check className="h-3 w-3 text-white" />}
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate font-semibold">{optionalTranslatedLabel(t, vendor)}</span>
                              <span className="block truncate font-mono text-[10px] opacity-70">{vendorCode}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-black">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{t('admin.channel.fields.modelAllowlist')}</h4>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {t('admin.channel.help.modelAllowlist')}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-500 dark:bg-white/10 dark:text-slate-400">
                    {t('admin.channel.modelCount', { count: whitelist.length })}
                  </span>
                </div>

                <div className="mb-3 grid max-h-52 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                  {whitelist.map((model) => (
                    <div
                      key={model}
                      className="group flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-white/5 dark:bg-[#1e1e1e] dark:text-slate-300"
                    >
                      <span className="flex min-w-0 items-center gap-2 pr-2">
                        <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                        <span className="truncate">{model}</span>
                      </span>
                      <button type="button" onClick={() => removeModel(model)} className="shrink-0 text-slate-400 transition-colors hover:text-red-500">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {whitelist.length === 0 && (
                    <div className="col-span-2 py-8 text-center text-sm text-slate-500">{t('admin.channel.validation.modelRequired')}</div>
                  )}
                </div>

                <div className="mb-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={fillRelatedModels}
                    disabled={defaultModelKeys.length === 0}
                    className="rounded-lg border border-indigo-500 px-4 py-2 text-sm font-medium text-indigo-500 transition-colors hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-indigo-500/50 dark:text-indigo-400 dark:hover:bg-indigo-500/10"
                  >
                    {t('common.actions.applyDefaults')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setWhitelist([])}
                    className="rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:border-red-500/50 dark:text-red-400 dark:hover:bg-red-500/10"
                  >
                    {t('common.actions.clearAll')}
                  </button>
                </div>

                <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-[#121212]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {t('admin.channel.models.catalogForVendor')}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">{selectedVendorCodes.join(', ')}</span>
                  </div>
                  {modelCatalogLoading ? (
                    <div className="flex items-center gap-2 py-2 text-xs text-slate-500">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      {t('admin.channel.models.loading')}
                    </div>
                  ) : modelCatalogError ? (
                    <div className="text-xs text-amber-700 dark:text-amber-300">{modelCatalogError}</div>
                  ) : catalogModelsByVendor.some((group) => group.models.length > 0) ? (
                    <div className="space-y-3">
                      {catalogModelsByVendor.map((group) => (
                        <div key={group.vendorCode}>
                          <div className="mb-1 flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-slate-600 dark:text-slate-300">{group.vendorName}</span>
                            <span className="font-mono text-slate-400">{group.vendorCode}</span>
                          </div>
                          {group.models.length > 0 ? (
                            <div className="flex max-h-24 flex-wrap gap-2 overflow-y-auto">
                              {group.models.map((model) => (
                                <button
                                  key={model.catalogKey}
                                  type="button"
                                  onClick={() => addCatalogModel(model)}
                                  disabled={whitelist.includes(model.catalogKey)}
                                  className="rounded-md border border-slate-200 bg-white px-2 py-1 text-left font-mono text-[11px] text-slate-600 transition-colors hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-default disabled:border-emerald-200 disabled:bg-emerald-50 disabled:text-emerald-700 dark:border-white/10 dark:bg-black dark:text-slate-300 dark:hover:border-emerald-500/40 dark:hover:bg-emerald-500/10 dark:disabled:border-emerald-500/30 dark:disabled:bg-emerald-500/10 dark:disabled:text-emerald-300"
                                >
                                  {model.catalogKey}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {t('admin.channel.models.emptyForVendor')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {t('admin.channel.models.emptyForVendor')}
                    </div>
                  )}
                </div>

                <div className="mt-4 border-t border-slate-200 pt-4 dark:border-white/10">
                  <label className="mb-2 block text-sm text-slate-700 dark:text-slate-300">{t('admin.channel.fields.addModel')}</label>
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
                      className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
                      placeholder={`${customModelVendorCode}/global/model-id`}
                    />
                    <button
                      type="button"
                      onClick={addCustomModel}
                      className="rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-2 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-500 dark:hover:bg-emerald-500/20"
                    >
                      {t('common.actions.add')}
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-black">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{t('admin.channel.fields.aiResources')}</h4>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {t('admin.channel.help.aiResources')}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-500 dark:bg-white/10 dark:text-slate-400">
                    {t('admin.channel.aiResources.selectedCount', { count: selectedResourceCodes.length })}
                  </span>
                </div>
                {aiResourcesLoading ? (
                  <div className="flex items-center gap-2 py-3 text-xs text-slate-500">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    {t('admin.channel.aiResources.loading')}
                  </div>
                ) : aiResourcesError ? (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
                    {aiResourcesError}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {t('admin.channel.aiResources.selectedTitle')}
                        </span>
                        <button
                          type="button"
                          onClick={clearAiResources}
                          disabled={selectedResourceCodes.length === 0}
                          className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/10"
                        >
                          {t('common.actions.clearAll')}
                        </button>
                      </div>
                      {selectedResourceCodes.length > 0 ? (
                        <div className="grid max-h-44 grid-cols-1 gap-2 overflow-y-auto pr-1">
                          {selectedResourceCodes.map((resourceCode) => {
                            const resource = findAiResourceByCode(aiResources, resourceCode);
                            return (
                              <div
                                key={resourceCode}
                                className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 dark:border-emerald-500/30 dark:bg-emerald-500/10"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <span className="min-w-0">
                                    <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                                      {resource?.displayName ?? resourceCode}
                                    </span>
                                    <span className="mt-1 block truncate font-mono text-[11px] text-slate-500 dark:text-slate-400">
                                      {resource?.resourceCode ?? resourceCode}
                                    </span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => removeAiResource(resourceCode)}
                                    className="shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-white hover:text-red-500 dark:hover:bg-white/10"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                                {resource && (
                                  <div className="mt-2 flex flex-wrap gap-1.5">
                                    <span className="rounded bg-white/80 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-white/10 dark:text-slate-400">
                                      {t(`admin.channel.aiResourceType.${resource.resourceType}`)}
                                    </span>
                                    {resource.vendorCode && (
                                      <span className="rounded bg-blue-50 px-1.5 py-0.5 font-mono text-[10px] text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                                        {resource.vendorCode}
                                      </span>
                                    )}
                                    {resource.modalityCode && (
                                      <span className="rounded bg-indigo-50 px-1.5 py-0.5 font-mono text-[10px] text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                                        {resource.modalityCode}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="rounded-lg border border-dashed border-slate-200 py-5 text-center text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
                          {t('admin.channel.aiResources.noneSelected')}
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="mb-2 block text-xs font-medium text-slate-500 dark:text-slate-400">
                        {t('admin.channel.aiResources.availableTitle')}
                      </span>
                      {availableAiResources.length > 0 ? (
                        <div className="grid max-h-52 grid-cols-1 gap-2 overflow-y-auto pr-1">
                          {availableAiResources.map((resource) => (
                            <button
                              key={resource.resourceCode}
                              type="button"
                              onClick={() => addAiResource(resource.resourceCode)}
                              className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-left transition-colors hover:border-emerald-300 hover:bg-emerald-50 dark:border-white/10 dark:bg-[#1e1e1e] dark:hover:border-emerald-500/40 dark:hover:bg-emerald-500/10"
                            >
                              <span className="flex items-start justify-between gap-3">
                                <span className="min-w-0">
                                  <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                                    {resource.displayName}
                                  </span>
                                  <span className="mt-1 block truncate font-mono text-[11px] text-slate-500 dark:text-slate-400">
                                    {resource.resourceCode}
                                  </span>
                                </span>
                                <span className="flex shrink-0 items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-white/10 dark:text-slate-400">
                                  <Plus className="h-3 w-3" />
                                  {t(`admin.channel.aiResourceType.${resource.resourceType}`)}
                                </span>
                              </span>
                              <span className="mt-2 flex flex-wrap gap-1.5">
                                {resource.vendorCode && (
                                  <span className="rounded bg-blue-50 px-1.5 py-0.5 font-mono text-[10px] text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                                    {resource.vendorCode}
                                  </span>
                                )}
                                {resource.modalityCode && (
                                  <span className="rounded bg-indigo-50 px-1.5 py-0.5 font-mono text-[10px] text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                                    {resource.modalityCode}
                                  </span>
                                )}
                                {resource.apiEndpointCode && (
                                  <span className="rounded bg-cyan-50 px-1.5 py-0.5 font-mono text-[10px] text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300">
                                    {resource.apiEndpointCode}
                                  </span>
                                )}
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="py-4 text-center text-xs text-slate-500 dark:text-slate-400">
                          {t('admin.channel.aiResources.empty')}
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
  onCopyApiKey,
  onClose,
}: {
  channel: ChannelItem;
  credential: ProviderSecretItem | null;
  isLoading: boolean;
  loadError: string | null;
  onRetry: () => void;
  onCopyApiKey: (channel: ChannelItem) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const secretRef = channel.secretRef?.trim() ?? '';
  const hasSecretRef = secretRef.length > 0;
  const hasApiKey = Boolean(channel.apiKey?.trim());
  const apiKeyDisplayValue = apiKeyVisible
    ? resolveVisibleApiKey(channel)
    : maskApiKeyForDisplay(channel.apiKey);

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
              <CredentialDetailField label={t('admin.channel.fields.channelType')} value={t(`admin.channel.channelType.${channel.channelType}`)} />
              <CredentialDetailField label={t('admin.channel.fields.authType')} value={channel.accessType} />
              <CredentialDetailField label={t('admin.channel.fields.createdAt')} value={displayChannelTime(channel.createdAt)} />
              <CredentialDetailField
                label={t('admin.channel.fields.expiresAt')}
                value={displayChannelTime(channel.expiresAt, t('admin.channel.expiration.never'))}
              />
              <CredentialDetailField
                label={t('admin.channel.fields.apiKey')}
                value={apiKeyDisplayValue}
                emptyValue={t('admin.channel.credentials.apiKeyUnavailable')}
                monospace={hasApiKey}
                wide
                onToggleVisibility={() => setApiKeyVisible((current) => !current)}
                visibilityLabel={apiKeyVisible ? t('admin.channel.actions.hideApiKey') : t('admin.channel.actions.showApiKey')}
                isSecretVisible={apiKeyVisible}
                onCopy={() => onCopyApiKey(channel)}
                copyLabel={t('common.actions.copyApiKey')}
                copyDisabled={!hasApiKey}
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

function maskApiKeyForDisplay(value: string | undefined): string {
  const normalized = value?.trim();
  if (!normalized) {
    return '';
  }
  if (normalized.length <= 8) {
    return `${normalized.slice(0, 2)}****${normalized.slice(-2)}`;
  }
  return `${normalized.slice(0, 6)}****${normalized.slice(-4)}`;
}

function resolveVisibleApiKey(channel: ChannelItem): string {
  return channel.apiKey ?? '';
}

function CredentialDetailField({
  label,
  value,
  emptyValue,
  monospace = false,
  wide = false,
  onToggleVisibility,
  visibilityLabel,
  isSecretVisible = false,
  onCopy,
  copyLabel,
  copyDisabled = false,
}: {
  label: string;
  value: string | undefined;
  emptyValue?: string;
  monospace?: boolean;
  wide?: boolean;
  onToggleVisibility?: () => void;
  visibilityLabel?: string;
  isSecretVisible?: boolean;
  onCopy?: () => void;
  copyLabel?: string;
  copyDisabled?: boolean;
}) {
  const displayValue = value?.trim() ? value : emptyValue ?? '';
  return (
    <div className={wide ? 'sm:col-span-2' : undefined}>
      <div className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</div>
      <div
        className={`flex items-center gap-2 break-words rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 dark:border-white/10 dark:bg-black dark:text-slate-200 ${
          monospace ? 'font-mono text-xs' : ''
        }`}
      >
        <span className="min-w-0 flex-1 break-words">{displayValue}</span>
        {onCopy && (
          <button
            type="button"
            onClick={onCopy}
            disabled={copyDisabled}
            title={copyLabel}
            aria-label={copyLabel}
            className="shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:hover:bg-white/10 dark:hover:text-slate-200"
          >
            <Copy className="h-4 w-4" />
          </button>
        )}
        {onToggleVisibility && (
          <button
            type="button"
            onClick={onToggleVisibility}
            title={visibilityLabel}
            aria-label={visibilityLabel}
            className="shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200"
          >
            {isSecretVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  );
}

function AiResourceFormModal({
  mode,
  resource,
  availableModels,
  availableResources,
  isSaving,
  onClose,
  onCreateSubmit,
  onUpdateSubmit,
}: {
  mode: AiResourceModalMode;
  resource: AiResource | null;
  availableModels: ChannelModelCatalogItem[];
  availableResources: AiResource[];
  isSaving: boolean;
  onClose: () => void;
  onCreateSubmit: (input: AiResourceCreateInput) => Promise<void>;
  onUpdateSubmit: (input: AiResourceUpdateInput) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [localError, setLocalError] = useState<string | null>(null);
  const isEdit = mode === 'edit';
  const draft = useMemo(
    () => (resource ? createAiResourceEditDraft(resource) : null),
    [resource],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);
    const formData = new FormData(event.currentTarget);
    try {
      const values = aiResourceFormValuesFromFormData(formData);
      if (isEdit) {
        await onUpdateSubmit(createAiResourceUpdateInputFromForm(values));
      } else {
        await onCreateSubmit(createAiResourceInputFromForm(values));
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : t('admin.channel.aiResources.errors.saveFailed'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#1a1a1a]">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-[#121212]">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <Boxes className="h-5 w-5 text-emerald-500" />
            {isEdit
              ? t('admin.channel.aiResources.modals.editTitle')
              : t('admin.channel.aiResources.modals.createTitle')}
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label={t('common.actions.close')}
            className="text-slate-400 transition-colors hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            {localError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                {localError}
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <AiResourceField label={t('admin.channel.aiResources.fields.resourceCode')}>
                <input
                  name="resourceCode"
                  required
                  defaultValue={draft?.resourceCode ?? ''}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
                  placeholder="bundle.openrouter.openai.chat"
                />
              </AiResourceField>
              <AiResourceField label={t('admin.channel.aiResources.fields.displayName')}>
                <input
                  name="displayName"
                  required
                  defaultValue={draft?.displayName ?? ''}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
                  placeholder="OpenRouter OpenAI Chat"
                />
              </AiResourceField>
              <AiResourceField label={t('admin.channel.aiResources.fields.resourceType')}>
                <select
                  name="resourceType"
                  defaultValue={draft?.resourceType ?? 'bundle'}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
                >
                  {aiResourceTypeOptions.map((kind) => (
                    <option key={kind} value={kind}>{t(`admin.channel.aiResourceType.${kind}`)}</option>
                  ))}
                </select>
              </AiResourceField>
              <AiResourceField label={t('admin.channel.aiResources.fields.status')}>
                <select
                  name="status"
                  defaultValue={draft?.status ?? 'active'}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
                >
                  {aiResourceStatusOptions.map((status) => (
                    <option key={status} value={status}>{t(`admin.channel.aiResources.status.${status}`)}</option>
                  ))}
                </select>
              </AiResourceField>
              <AiResourceField label={t('admin.channel.aiResources.fields.vendorCode')}>
                <input
                  name="vendorCode"
                  defaultValue={draft?.vendorCode ?? ''}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
                  placeholder="openai"
                />
              </AiResourceField>
              <AiResourceField label={t('admin.channel.aiResources.fields.modalityCode')}>
                <input
                  name="modalityCode"
                  defaultValue={draft?.modalityCode ?? ''}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
                  placeholder="chat"
                />
              </AiResourceField>
              <AiResourceField label={t('admin.channel.aiResources.fields.apiEndpointCode')}>
                <input
                  name="apiEndpointCode"
                  defaultValue={draft?.apiEndpointCode ?? ''}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
                  placeholder="chat_completions"
                />
              </AiResourceField>
              <AiResourceField label={t('admin.channel.aiResources.fields.catalogKey')}>
                <AiResourceModelSelector
                  defaultCatalogKey={draft?.catalogKey ?? ''}
                  availableModels={availableModels}
                />
              </AiResourceField>
              <AiResourceField label={t('admin.channel.aiResources.fields.model')}>
                <input
                  name="model"
                  defaultValue={draft?.model ?? ''}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
                  placeholder="gpt-5.5"
                />
              </AiResourceField>
              <AiResourceField label={t('admin.channel.aiResources.fields.providerNativeModel')}>
                <input
                  name="providerNativeModel"
                  readOnly
                  defaultValue={draft?.providerNativeModel ?? ''}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
                  placeholder="gpt-5.5"
                />
              </AiResourceField>
              <AiResourceField label={t('admin.channel.aiResources.fields.compositionMode')}>
                <select
                  name="compositionMode"
                  defaultValue={draft?.compositionMode ?? 'single'}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
                >
                  {aiResourceCompositionOptions.map((modeOption) => (
                    <option key={modeOption} value={modeOption}>{t(`admin.channel.aiResources.composition.${modeOption}`)}</option>
                  ))}
                </select>
              </AiResourceField>
              <AiResourceField label={t('admin.channel.aiResources.fields.sortOrder')}>
                <input
                  name="sortOrder"
                  type="number"
                  min={0}
                  step={1}
                  defaultValue={draft?.sortOrder ?? ''}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
                />
              </AiResourceField>
              <AiResourceField label={t('admin.channel.aiResources.fields.members')} wide>
                <AiResourceMemberSelector
                  currentResourceCode={draft?.resourceCode ?? ''}
                  defaultMembersText={draft?.membersText ?? ''}
                  availableResources={availableResources}
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {t('admin.channel.aiResources.help.members')}
                </p>
              </AiResourceField>
            </div>
          </div>

          <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#121212]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
            >
              {t('common.actions.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? t('common.actions.saveChanges') : t('common.actions.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AiResourceField({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={wide ? 'sm:col-span-2' : undefined}>
      <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      {children}
    </label>
  );
}

function AiResourceModelSelector({
  defaultCatalogKey,
  availableModels,
}: {
  defaultCatalogKey: string;
  availableModels: ChannelModelCatalogItem[];
}) {
  const normalizedDefault = defaultCatalogKey.trim();
  return (
    <select
      data-ai-resource-model-selector
      name="catalogKey"
      defaultValue={normalizedDefault}
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
    >
      <option value="" />
      {normalizedDefault && !availableModels.some((model) => model.catalogKey === normalizedDefault) && (
        <option value={normalizedDefault}>{normalizedDefault}</option>
      )}
      {availableModels.map((model) => (
        <option key={model.catalogKey} value={model.catalogKey}>
          {model.displayName} ({model.catalogKey})
        </option>
      ))}
    </select>
  );
}

function AiResourceMemberSelector({
  currentResourceCode,
  defaultMembersText,
  availableResources,
}: {
  currentResourceCode: string;
  defaultMembersText: string;
  availableResources: AiResource[];
}) {
  const [memberLines, setMemberLines] = useState<string[]>(() => parseAiResourceMemberLines(defaultMembersText));
  useEffect(() => {
    setMemberLines(parseAiResourceMemberLines(defaultMembersText));
  }, [defaultMembersText]);
  const selectedCodes = useMemo(
    () => new Set(memberLines.map((line) => normalizeAiResourceCode(line.split('|')[0] ?? '')).filter(Boolean)),
    [memberLines],
  );
  const currentCode = normalizeAiResourceCode(currentResourceCode);
  const toggleMember = (resourceCode: string) => {
    const normalizedCode = normalizeAiResourceCode(resourceCode);
    if (!normalizedCode) {
      return;
    }
    setMemberLines((current) => {
      const exists = current.some((line) => normalizeAiResourceCode(line.split('|')[0] ?? '') === normalizedCode);
      if (exists) {
        return current.filter((line) => normalizeAiResourceCode(line.split('|')[0] ?? '') !== normalizedCode);
      }
      return [...current, `${normalizedCode} | included | true | ${current.length + 1}`];
    });
  };
  return (
    <div data-ai-resource-member-selector className="space-y-2">
      <textarea
        name="membersText"
        readOnly
        value={memberLines.join('\n')}
        className="sr-only"
      />
      <div className="grid max-h-52 grid-cols-1 gap-2 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-black">
        {availableResources
          .filter((resource) => normalizeAiResourceCode(resource.resourceCode) !== currentCode)
          .map((resource) => {
            const isSelected = selectedCodes.has(normalizeAiResourceCode(resource.resourceCode));
            return (
              <label
                key={resource.resourceCode}
                className={`flex items-start gap-2 rounded-md border p-2 text-xs ${
                  isSelected
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200'
                    : 'border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-[#1e1e1e] dark:text-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleMember(resource.resourceCode)}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-emerald-600"
                />
                <span className="min-w-0">
                  <span className="block truncate font-medium">{resource.displayName}</span>
                  <span className="mt-0.5 block truncate font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    {resource.resourceCode}
                  </span>
                </span>
              </label>
            );
          })}
      </div>
    </div>
  );
}

function parseAiResourceMemberLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function ChannelEndpointFormModal({
  mode,
  endpoint,
  channels,
  isSaving,
  onClose,
  onCreateSubmit,
  onUpdateSubmit,
}: {
  mode: ChannelEndpointModalMode;
  endpoint: ChannelEndpoint | null;
  channels: ChannelEndpointChannelOption[];
  isSaving: boolean;
  onClose: () => void;
  onCreateSubmit: (input: ChannelEndpointCreateInput) => Promise<void>;
  onUpdateSubmit: (input: ChannelEndpointUpdateInput) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [localError, setLocalError] = useState<string | null>(null);
  const draft = endpoint ? createChannelEndpointEditDraft(endpoint) : null;
  const isEdit = mode === 'edit';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);
    const values = channelEndpointFormValuesFromFormData(new FormData(event.currentTarget));
    try {
      if (isEdit) {
        await onUpdateSubmit(createChannelEndpointUpdateInputFromForm(values));
      } else {
        await onCreateSubmit(createChannelEndpointInputFromForm(values));
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : t('admin.channel.channelEndpoints.errors.saveFailed'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={isSaving ? undefined : onClose} />
      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#1a1a1a]">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-[#121212]">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <Server className="h-5 w-5 text-emerald-500" />
            {isEdit
              ? t('admin.channel.channelEndpoints.modals.editTitle')
              : t('admin.channel.channelEndpoints.modals.createTitle')}
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label={t('common.actions.close')}
            className="text-slate-400 transition-colors hover:text-slate-600 disabled:opacity-50 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-5">
            {localError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                <AlertCircle className="h-4 w-4" />
                {localError}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t('admin.channel.channelEndpoints.fields.channel')}
              </label>
              <select
                name="channelId"
                required={!isEdit}
                disabled={isEdit}
                defaultValue={draft?.channelId ?? channels[0]?.channelId ?? ''}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus:border-emerald-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500 dark:border-white/10 dark:bg-black dark:text-white dark:disabled:bg-white/5"
              >
                {!isEdit && channels.length === 0 && (
                  <option value="">{t('admin.channel.channelEndpoints.emptyChannels')}</option>
                )}
                {channels.map((channel) => (
                  <option key={channel.channelId} value={channel.channelId}>
                    {channel.name} / {providerCodeForVendor(channel.vendor)} / {channel.channelId}
                  </option>
                ))}
                {isEdit && draft?.channelId && !channels.some((channel) => channel.channelId === draft.channelId) && (
                  <option value={draft.channelId}>{draft.channelId}</option>
                )}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('admin.channel.channelEndpoints.fields.vendorCode')}
                </label>
                <input
                  required
                  name="vendorCode"
                  defaultValue={draft?.vendorCode ?? ''}
                  placeholder="openai"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-900 transition-colors focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('admin.channel.channelEndpoints.fields.regionCode')}
                </label>
                <input
                  required
                  name="regionCode"
                  defaultValue={draft?.regionCode ?? 'global'}
                  placeholder="global"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-900 transition-colors focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('admin.channel.channelEndpoints.fields.apiEndpointCode')}
                </label>
                <input
                  required
                  name="apiEndpointCode"
                  defaultValue={draft?.apiEndpointCode ?? 'chat_completions'}
                  placeholder="chat_completions"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-900 transition-colors focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t('admin.channel.channelEndpoints.fields.baseUrl')}
              </label>
              <input
                required
                type="url"
                name="baseUrl"
                defaultValue={draft?.baseUrl ?? ''}
                placeholder="https://api.openai.com/v1"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-900 transition-colors focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('admin.channel.channelEndpoints.fields.priority')}
                </label>
                <input
                  name="priority"
                  type="number"
                  min="1"
                  defaultValue={draft?.priority ?? 100}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('admin.channel.channelEndpoints.fields.weight')}
                </label>
                <input
                  name="weight"
                  type="number"
                  min="1"
                  defaultValue={draft?.weight ?? 100}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('admin.channel.channelEndpoints.fields.effectiveFrom')}
                </label>
                <input
                  name="effectiveFrom"
                  type="datetime-local"
                  defaultValue={toDateTimeLocalValue(draft?.effectiveFrom)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('admin.channel.channelEndpoints.fields.effectiveTo')}
                </label>
                <input
                  name="effectiveTo"
                  type="datetime-local"
                  defaultValue={toDateTimeLocalValue(draft?.effectiveTo)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t('admin.channel.channelEndpoints.fields.status')}
              </label>
              <select
                name="status"
                defaultValue={draft?.status ?? 'active'}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-black dark:text-white"
              >
                <option value="active">{t('admin.channel.channelEndpoints.status.active')}</option>
                <option value="disabled">{t('admin.channel.channelEndpoints.status.disabled')}</option>
                <option value="inactive">{t('admin.channel.channelEndpoints.status.inactive')}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#121212]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-white disabled:opacity-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
            >
              {t('common.actions.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSaving || (!isEdit && channels.length === 0)}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? t('common.actions.saveChanges') : t('admin.channel.channelEndpoints.actions.add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AiResourceAdmin() {
  const { t } = useTranslation();
  const [resources, setResources] = useState<AiResource[]>([]);
  const [modelCatalog, setModelCatalog] = useState<ChannelModelCatalogItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<AiResourceModalMode | null>(null);
  const [editingResource, setEditingResource] = useState<AiResource | null>(null);
  const [saving, setSaving] = useState(false);
  const [pendingResourceId, setPendingResourceId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAiResourceAction | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  const loadResources = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const items = await ChannelAiResourceService.fetchAiResources();
      if (isActive()) {
        setResources(items);
      }
    } catch (err) {
      if (isActive()) {
        setLoadError(getLoadErrorMessage(err, t('admin.channel.aiResources.loadError')));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, [t]);

  const loadModelCatalog = useCallback(async (isActive: () => boolean = () => true) => {
    try {
      const items = await ChannelModelCatalogService.fetchModels();
      if (isActive()) {
        setModelCatalog(items);
      }
    } catch {
      if (isActive()) {
        setModelCatalog([]);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    void Promise.all([loadResources(() => active), loadModelCatalog(() => active)]);
    return () => {
      active = false;
    };
  }, [loadModelCatalog, loadResources]);

  const filteredResources = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) {
      return resources;
    }
    return resources.filter((resource) => [
      resource.resourceCode,
      resource.displayName,
      resource.resourceType,
      resource.vendorCode,
      resource.modalityCode,
      resource.apiEndpointCode,
      resource.catalogKey,
      resource.model,
      resource.providerNativeModel,
    ].filter(Boolean).join(' ').toLowerCase().includes(keyword));
  }, [resources, search]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  }, []);

  const openCreateModal = () => {
    setEditingResource(null);
    setModalMode('create');
  };

  const openEditModal = (resource: AiResource) => {
    setEditingResource(resource);
    setModalMode('edit');
  };

  const closeModal = () => {
    if (saving) {
      return;
    }
    setModalMode(null);
    setEditingResource(null);
  };

  const handleCreateResource = async (input: AiResourceCreateInput) => {
    setSaving(true);
    try {
      const created = await ChannelAiResourceService.createAiResource(input);
      setResources((current) => [created, ...current]);
      showToast(t('admin.channel.aiResources.messages.created'));
      setLoadError(null);
      setModalMode(null);
      setEditingResource(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : t('admin.channel.aiResources.errors.saveFailed');
      showToast(message, 'error');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateResource = async (input: AiResourceUpdateInput) => {
    if (!editingResource) {
      return;
    }
    setSaving(true);
    try {
      const updated = await ChannelAiResourceService.updateAiResource(editingResource.id, input);
      setResources((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      showToast(t('admin.channel.aiResources.messages.updated'));
      setLoadError(null);
      setModalMode(null);
      setEditingResource(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : t('admin.channel.aiResources.errors.saveFailed');
      showToast(message, 'error');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateResourceStatus = async (resource: AiResource) => {
    const nextStatus: AiResource['status'] = resource.status === 'active' ? 'disabled' : 'active';
    setPendingResourceId(resource.id);
    setPendingAction('status');
    try {
      const updated = await ChannelAiResourceService.updateAiResource(resource.id, { status: nextStatus });
      setResources((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      showToast(
        nextStatus === 'active'
          ? t('admin.channel.aiResources.messages.enabled')
          : t('admin.channel.aiResources.messages.disabled'),
        'info',
      );
    } catch (err) {
      showToast(err instanceof Error ? err.message : t('admin.channel.aiResources.errors.updateFailed'), 'error');
    } finally {
      setPendingResourceId(null);
      setPendingAction(null);
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-4 overflow-hidden">
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
      <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('admin.channel.aiResources.title')}</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('admin.channel.aiResources.subtitle')}</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t('admin.channel.aiResources.searchPlaceholder')}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 shadow-sm transition-colors placeholder-slate-500 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-[#1e1e1e] dark:text-white"
            />
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-emerald-500/20 transition-colors hover:bg-emerald-700 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            {t('admin.channel.aiResources.actions.add')}
          </button>
        </div>
      </div>

      <AdminTableShell
        className="rounded-xl dark:bg-[#1a1a1a]"
        footer={(
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-white/10 dark:bg-[#121212] dark:text-slate-400">
            {t('admin.channel.aiResources.total', { count: filteredResources.length })}
          </div>
        )}
      >
        <div className="contents">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:border-white/10 dark:bg-[#121212] dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">{t('admin.channel.aiResources.table.resource')}</th>
                <th className="px-6 py-4">{t('admin.channel.aiResources.table.kind')}</th>
                <th className="px-6 py-4">{t('admin.channel.aiResources.table.vendor')}</th>
                <th className="px-6 py-4">{t('admin.channel.aiResources.table.modality')}</th>
                <th className="px-6 py-4">{t('admin.channel.aiResources.table.apiEndpoint')}</th>
                <th className="px-6 py-4">{t('admin.channel.aiResources.table.composition')}</th>
                <th className="px-6 py-4">{t('admin.channel.aiResources.table.status')}</th>
                <th className="px-6 py-4 text-right">{t('admin.channel.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {loading ? (
                <BusinessStateTableRow colSpan={8} kind="loading" title={t('admin.channel.aiResources.loading')} />
              ) : loadError ? (
                <BusinessStateTableRow
                  colSpan={8}
                  kind="error"
                  title={t('admin.channel.aiResources.loadError')}
                  description={loadError}
                  onRetry={() => void loadResources()}
                />
              ) : filteredResources.length === 0 ? (
                <BusinessStateTableRow
                  colSpan={8}
                  kind="empty"
                  title={t('admin.channel.aiResources.empty')}
                  description={resources.length === 0
                    ? t('admin.channel.aiResources.emptyDescription')
                    : t('admin.channel.aiResources.emptySearchDescription')}
                  action={resources.length === 0 ? { label: t('admin.channel.aiResources.actions.add'), onClick: openCreateModal } : undefined}
                />
              ) : (
                filteredResources.map((resource) => (
                  <tr key={resource.resourceCode} className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5">
                    <td className="px-6 py-4 align-top">
                      <div className="max-w-md">
                        <div className="truncate font-semibold text-slate-900 dark:text-white">{resource.displayName}</div>
                        <div className="mt-1 truncate font-mono text-xs text-slate-500 dark:text-slate-400">{resource.resourceCode}</div>
                        {resource.providerNativeModel && (
                          <div className="mt-1 truncate font-mono text-[11px] text-slate-400">{resource.providerNativeModel}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300">
                        {t(`admin.channel.aiResourceType.${resource.resourceType}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-top font-mono text-xs">{resource.vendorCode ?? '-'}</td>
                    <td className="px-6 py-4 align-top font-mono text-xs">{resource.modalityCode ?? '-'}</td>
                    <td className="px-6 py-4 align-top font-mono text-xs">{resource.apiEndpointCode ?? '-'}</td>
                    <td className="px-6 py-4 align-top text-xs">
                      {t(`admin.channel.aiResources.composition.${resource.compositionMode}`)}
                      {resource.members.length > 0 && (
                        <span className="ml-2 text-slate-400">
                          {t('admin.channel.aiResources.memberCount', { count: resource.members.length })}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top text-xs">
                      {t(`admin.channel.aiResources.status.${resource.status}`)}
                    </td>
                    <td className="px-6 py-4 text-right align-top">
                      <div className="flex items-center justify-end gap-1">
                        <IconButton
                          title={t('admin.channel.aiResources.actions.edit')}
                          onClick={() => openEditModal(resource)}
                          disabled={pendingResourceId === resource.id}
                        >
                          <Edit2 className="h-4 w-4" />
                        </IconButton>
                        <IconButton
                          title={resource.status === 'active'
                            ? t('admin.channel.aiResources.actions.disable')
                            : t('admin.channel.aiResources.actions.enable')}
                          onClick={() => void handleUpdateResourceStatus(resource)}
                          disabled={pendingResourceId === resource.id}
                          tone="warning"
                        >
                          {pendingResourceId === resource.id && pendingAction === 'status' ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : resource.status === 'active' ? (
                            <Ban className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
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
      </AdminTableShell>

      {modalMode && (
        <AiResourceFormModal
          mode={modalMode}
          resource={editingResource}
          availableModels={modelCatalog}
          availableResources={resources}
          isSaving={saving}
          onClose={closeModal}
          onCreateSubmit={handleCreateResource}
          onUpdateSubmit={handleUpdateResource}
        />
      )}
    </div>
  );
}

export function ChannelEndpointAdmin() {
  const { t } = useTranslation();
  const [endpoints, setEndpoints] = useState<ChannelEndpoint[]>([]);
  const [channels, setChannels] = useState<ChannelEndpointChannelOption[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<ChannelEndpointModalMode | null>(null);
  const [editingEndpoint, setEditingEndpoint] = useState<ChannelEndpoint | null>(null);
  const [saving, setSaving] = useState(false);
  const [pendingEndpointId, setPendingEndpointId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingChannelEndpointAction | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  const loadData = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const [endpointItems, channelItems] = await Promise.all([
        ChannelEndpointService.fetchChannelEndpoints(),
        ChannelService.fetchChannelEndpointOptions(),
      ]);
      if (isActive()) {
        setEndpoints(endpointItems);
        setChannels(channelItems);
      }
    } catch (err) {
      if (isActive()) {
        setLoadError(getLoadErrorMessage(err, t('admin.channel.channelEndpoints.loadError')));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, [t]);

  useEffect(() => {
    let active = true;
    void loadData(() => active);
    return () => {
      active = false;
    };
  }, [loadData]);

  const filteredEndpoints = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) {
      return endpoints;
    }
    return endpoints.filter((endpoint) => [
      endpoint.channelId,
      endpoint.providerCode,
      endpoint.channelCode,
      endpoint.channelType,
      endpoint.vendorCode,
      endpoint.regionCode,
      endpoint.apiEndpointCode,
      endpoint.baseUrl,
      endpoint.healthStatus,
      endpoint.status,
    ].join(' ').toLowerCase().includes(keyword));
  }, [endpoints, search]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  }, []);

  const openCreateModal = () => {
    setEditingEndpoint(null);
    setModalMode('create');
  };

  const openEditModal = (endpoint: ChannelEndpoint) => {
    setEditingEndpoint(endpoint);
    setModalMode('edit');
  };

  const closeModal = () => {
    if (saving) {
      return;
    }
    setModalMode(null);
    setEditingEndpoint(null);
  };

  const handleCreateEndpoint = async (input: ChannelEndpointCreateInput) => {
    setSaving(true);
    try {
      const created = await ChannelEndpointService.createChannelEndpoint(input);
      setEndpoints((current) => [created, ...current]);
      showToast(t('admin.channel.channelEndpoints.messages.created'));
      setLoadError(null);
      setModalMode(null);
      setEditingEndpoint(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : t('admin.channel.channelEndpoints.errors.saveFailed');
      showToast(message, 'error');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateEndpoint = async (input: ChannelEndpointUpdateInput) => {
    if (!editingEndpoint) {
      return;
    }
    setSaving(true);
    try {
      const updated = await ChannelEndpointService.updateChannelEndpoint(editingEndpoint.id, input);
      setEndpoints((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      showToast(t('admin.channel.channelEndpoints.messages.updated'));
      setLoadError(null);
      setModalMode(null);
      setEditingEndpoint(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : t('admin.channel.channelEndpoints.errors.saveFailed');
      showToast(message, 'error');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateEndpointStatus = async (endpoint: ChannelEndpoint) => {
    const nextStatus: ChannelEndpoint['status'] = endpoint.status === 'active' ? 'disabled' : 'active';
    setPendingEndpointId(endpoint.id);
    setPendingAction('status');
    try {
      const updated = await ChannelEndpointService.updateChannelEndpoint(endpoint.id, { status: nextStatus });
      setEndpoints((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      showToast(
        nextStatus === 'active'
          ? t('admin.channel.channelEndpoints.messages.enabled')
          : t('admin.channel.channelEndpoints.messages.disabled'),
        'info',
      );
    } catch (err) {
      showToast(err instanceof Error ? err.message : t('admin.channel.channelEndpoints.errors.updateFailed'), 'error');
    } finally {
      setPendingEndpointId(null);
      setPendingAction(null);
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-4 overflow-hidden">
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

      <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('admin.channel.channelEndpoints.title')}</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('admin.channel.channelEndpoints.subtitle')}</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t('admin.channel.channelEndpoints.searchPlaceholder')}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 shadow-sm transition-colors placeholder-slate-500 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-[#1e1e1e] dark:text-white"
            />
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-emerald-500/20 transition-colors hover:bg-emerald-700 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            {t('admin.channel.channelEndpoints.actions.add')}
          </button>
        </div>
      </div>

      <AdminTableShell
        className="rounded-xl dark:bg-[#1a1a1a]"
        footer={(
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-white/10 dark:bg-[#121212] dark:text-slate-400">
            {t('admin.channel.channelEndpoints.total', { count: filteredEndpoints.length })}
          </div>
        )}
      >
        <div className="contents">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:border-white/10 dark:bg-[#121212] dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">{t('admin.channel.channelEndpoints.table.channel')}</th>
                <th className="px-6 py-4">{t('admin.channel.channelEndpoints.table.scope')}</th>
                <th className="px-6 py-4">{t('admin.channel.channelEndpoints.table.baseUrl')}</th>
                <th className="px-6 py-4">{t('admin.channel.channelEndpoints.table.routing')}</th>
                <th className="px-6 py-4">{t('admin.channel.channelEndpoints.table.health')}</th>
                <th className="px-6 py-4">{t('admin.channel.channelEndpoints.table.status')}</th>
                <th className="px-6 py-4 text-right">{t('admin.channel.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {loading ? (
                <BusinessStateTableRow colSpan={7} kind="loading" title={t('admin.channel.channelEndpoints.loading')} />
              ) : loadError ? (
                <BusinessStateTableRow
                  colSpan={7}
                  kind="error"
                  title={t('admin.channel.channelEndpoints.loadError')}
                  description={loadError}
                  onRetry={() => void loadData()}
                />
              ) : filteredEndpoints.length === 0 ? (
                <BusinessStateTableRow
                  colSpan={7}
                  kind="empty"
                  title={t('admin.channel.channelEndpoints.empty')}
                  description={endpoints.length === 0
                    ? t('admin.channel.channelEndpoints.emptyDescription')
                    : t('admin.channel.channelEndpoints.emptySearchDescription')}
                  action={endpoints.length === 0 ? { label: t('admin.channel.channelEndpoints.actions.add'), onClick: openCreateModal } : undefined}
                />
              ) : (
                filteredEndpoints.map((endpoint) => (
                  <tr key={endpoint.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5">
                    <td className="px-6 py-4 align-top">
                      <div className="space-y-1">
                        <div className="font-medium text-slate-900 dark:text-white">{endpoint.providerCode}</div>
                        <div className="font-mono text-xs text-slate-500 dark:text-slate-400">{endpoint.channelCode}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {t(`admin.channel.channelType.${endpoint.channelType}`)} / {endpoint.channelId}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="space-y-1 font-mono text-xs">
                        <div>{endpoint.vendorCode}</div>
                        <div className="text-slate-500 dark:text-slate-400">{endpoint.regionCode}</div>
                        <div className="text-cyan-700 dark:text-cyan-300">{endpoint.apiEndpointCode}</div>
                      </div>
                    </td>
                    <td className="max-w-md px-6 py-4 align-top">
                      <div className="truncate font-mono text-xs text-slate-700 dark:text-slate-300" title={endpoint.baseUrl}>
                        {endpoint.baseUrl}
                      </div>
                      {(endpoint.effectiveFrom || endpoint.effectiveTo) && (
                        <div className="mt-1 text-[11px] text-slate-400">
                          {displayChannelTime(endpoint.effectiveFrom, '-')}&nbsp;-&nbsp;{displayChannelTime(endpoint.effectiveTo, '-')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top font-mono text-xs">
                      P{endpoint.priority} / W{endpoint.weight}
                    </td>
                    <td className="px-6 py-4 align-top text-xs">
                      {t(`admin.channel.channelEndpoints.health.${endpoint.healthStatus}`)}
                    </td>
                    <td className="px-6 py-4 align-top text-xs">
                      {t(`admin.channel.channelEndpoints.status.${endpoint.status}`)}
                    </td>
                    <td className="px-6 py-4 text-right align-top">
                      <div className="flex items-center justify-end gap-1">
                        <IconButton
                          title={t('admin.channel.channelEndpoints.actions.edit')}
                          onClick={() => openEditModal(endpoint)}
                          disabled={pendingEndpointId === endpoint.id}
                        >
                          <Edit2 className="h-4 w-4" />
                        </IconButton>
                        <IconButton
                          title={endpoint.status === 'active'
                            ? t('admin.channel.channelEndpoints.actions.disable')
                            : t('admin.channel.channelEndpoints.actions.enable')}
                          onClick={() => void handleUpdateEndpointStatus(endpoint)}
                          disabled={pendingEndpointId === endpoint.id}
                          tone="warning"
                        >
                          {pendingEndpointId === endpoint.id && pendingAction === 'status' ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : endpoint.status === 'active' ? (
                            <Ban className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
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
      </AdminTableShell>

      {modalMode && (
        <ChannelEndpointFormModal
          mode={modalMode}
          endpoint={editingEndpoint}
          channels={channels}
          isSaving={saving}
          onClose={closeModal}
          onCreateSubmit={handleCreateEndpoint}
          onUpdateSubmit={handleUpdateEndpoint}
        />
      )}
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
  const [channelFormDraft, setChannelFormDraft] = useState<ChannelFormValues | null>(null);
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
  const [modelCatalog, setModelCatalog] = useState<ChannelModelCatalogItem[]>([]);
  const [aiResources, setAiResources] = useState<AiResource[]>([]);
  const [modelCatalogLoading, setModelCatalogLoading] = useState(true);
  const [modelCatalogError, setModelCatalogError] = useState<string | null>(null);
  const [aiResourcesLoading, setAiResourcesLoading] = useState(true);
  const [aiResourcesError, setAiResourcesError] = useState<string | null>(null);
  const pageSize = 8;

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  }, []);

  const handleCopyApiKey = useCallback((channel: ChannelItem) => {
    const apiKey = channel.apiKey?.trim();
    if (!apiKey) {
      showToast(t('admin.channel.credentials.apiKeyUnavailable'), 'error');
      return;
    }
    if (!navigator.clipboard?.writeText) {
      showToast(t('common.actions.copyFailed'), 'error');
      return;
    }
    void navigator.clipboard.writeText(apiKey)
      .then(() => showToast(t('common.actions.copiedApiKey')))
      .catch(() => showToast(t('common.actions.copyFailed'), 'error'));
  }, [showToast, t]);

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

  const loadModelCatalog = useCallback(async (isActive: () => boolean = () => true) => {
    setModelCatalogLoading(true);
    setModelCatalogError(null);
    try {
      const models = await ChannelModelCatalogService.fetchModels();
      if (isActive()) {
        setModelCatalog(models);
      }
    } catch (err) {
      if (isActive()) {
        setModelCatalogError(getLoadErrorMessage(err, t('admin.channel.models.loadError')));
      }
    } finally {
      if (isActive()) {
        setModelCatalogLoading(false);
      }
    }
  }, [t]);

  const loadAiResources = useCallback(async (isActive: () => boolean = () => true) => {
    setAiResourcesLoading(true);
    setAiResourcesError(null);
    try {
      const resources = await ChannelAiResourceService.fetchAiResources();
      if (isActive()) {
        setAiResources(resources);
      }
    } catch (err) {
      if (isActive()) {
        setAiResourcesError(getLoadErrorMessage(err, t('admin.channel.aiResources.loadError')));
      }
    } finally {
      if (isActive()) {
        setAiResourcesLoading(false);
      }
    }
  }, [t]);

  const loadData = useCallback(async (isActive: () => boolean = () => true) => {
    await Promise.all([
      loadChannels(isActive),
      loadProviderSecrets(isActive),
      loadModelCatalog(isActive),
      loadAiResources(isActive),
    ]);
  }, [loadAiResources, loadChannels, loadModelCatalog, loadProviderSecrets]);

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
      const searchable = [channel.name, channel.vendor, ...channel.models].join(' ').toLowerCase();
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
    setChannelFormDraft(null);
    setModalMode('create');
  };

  const openEditModal = (channel: ChannelItem) => {
    setEditingChannel(channel);
    setChannelFormDraft(createChannelEditDraft(channel));
    setModalMode('edit');
  };

  const openCopyCreateModal = (channel: ChannelItem) => {
    setEditingChannel(null);
    setChannelFormDraft(createChannelCopyDraft(channel));
    setModalMode('copy');
  };

  const closeModal = () => {
    if (saving) {
      return;
    }
    setModalMode(null);
    setEditingChannel(null);
    setChannelFormDraft(null);
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
      setChannelFormDraft(null);
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
    <div className="flex h-full min-h-0 w-full flex-col gap-4 overflow-hidden">
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

      <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" data-admin-channel-toolbar>
          <div className="relative w-full sm:w-72" data-admin-channel-search>
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t('admin.channel.searchPlaceholder')}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500 w-full text-slate-900 dark:text-white placeholder-slate-500 transition-colors shadow-sm"
            />
          </div>
          <button
            data-admin-channel-primary-action
            onClick={openCreateModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex w-full items-center justify-center gap-2 flex-shrink-0 shadow-lg shadow-emerald-500/20 sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t('common.actions.addChannel')}</span>
          </button>
      </div>

      <div className="flex shrink-0 items-center gap-1 border-b border-slate-200 dark:border-white/10 pb-4 overflow-x-auto hide-scrollbar">
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
            {optionalTranslatedLabel(t, tab)}
          </button>
        ))}
      </div>

      <AdminTableShell
        data-admin-channel-table-card
        className="rounded-xl dark:bg-[#1a1a1a]"
        viewportProps={{ 'data-admin-channel-table-viewport': true }}
        footer={(
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
        )}
      >
        <div className="contents">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-white/10 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">{t('admin.channel.table.channel')}</th>
                <th className="px-6 py-4">{t('admin.channel.table.provider')}</th>
                <th className="px-6 py-4">{t('admin.channel.table.apiKey')}</th>
                <th className="px-6 py-4 w-48">{t('admin.channel.table.models')}</th>
                <th className="px-6 py-4">{t('admin.channel.table.weight')}</th>
                <th className="px-6 py-4">{t('admin.channel.table.status')}</th>
                <th className="px-6 py-4">{t('admin.channel.table.createdAt')}</th>
                <th className="px-6 py-4">{t('admin.channel.table.expiresAt')}</th>
                <th className="px-6 py-4 text-right">{t('admin.channel.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {loading ? (
                <BusinessStateTableRow colSpan={9} kind="loading" title={t('admin.channel.states.loadingChannels')} />
              ) : loadError ? (
                <BusinessStateTableRow
                  colSpan={9}
                  kind="error"
                  title={t('admin.channel.states.channelsLoadErrorTitle')}
                  description={loadError}
                  onRetry={() => void loadChannels()}
                />
              ) : paginatedChannels.length === 0 ? (
                <BusinessStateTableRow
                  colSpan={9}
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
                    <td className="px-6 py-4 align-top max-w-[14rem]">
                      <div className="flex min-w-0 items-center gap-2 whitespace-nowrap">
                        <span className="flex min-w-0 items-center gap-2 font-semibold text-slate-900 dark:text-white">
                          <span
                            className={`h-2 w-2 shrink-0 rounded-full ${
                              channel.status === 'active'
                                ? 'bg-emerald-500'
                                : channel.status === 'disabled'
                                  ? 'bg-slate-400'
                                  : 'bg-red-500'
                            }`}
                          />
                          <span className="min-w-0 truncate">{channel.name}</span>
                        </span>
                        <CapabilityBadges capabilities={channel.capabilities} />
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top max-w-[12rem]">
                      <div className="flex min-w-0 items-center gap-2 whitespace-nowrap">
                        <span className="font-medium text-slate-800 dark:text-slate-200 text-sm flex min-w-0 items-center gap-1.5 whitespace-nowrap">
                          <Cpu className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          <span className="min-w-0 truncate">{channel.vendor}</span>
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0 whitespace-nowrap">
                          <Key className="w-3.5 h-3.5 shrink-0" />
                          <span className="min-w-0 truncate">{channel.accessType}</span>
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0 whitespace-nowrap">
                          <Boxes className="w-3.5 h-3.5 shrink-0" />
                          <span className="min-w-0 truncate">{t(`admin.channel.channelType.${channel.channelType}`)}</span>
                        </span>
                        {channel.resourceCodes.length > 0 && (
                          <span className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0 whitespace-nowrap">
                            <Layers className="w-3.5 h-3.5 shrink-0" />
                            <span className="min-w-0 truncate">
                              {t('admin.channel.aiResources.selectedCount', {
                                count: channel.resourceCodes.length,
                              })}
                            </span>
                          </span>
                        )}
                        {channel.circuitBreakerPolicy && (
                          <span className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0 whitespace-nowrap">
                            <Network className="w-3.5 h-3.5 shrink-0" />
                            <span className="min-w-0 truncate">
                              {t('admin.channel.table.circuitBreakerCount', {
                                count: channel.circuitBreakerPolicy.failureThreshold,
                              })}
                            </span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <ApiKeyCell channel={channel} onCopyApiKey={handleCopyApiKey} />
                    </td>
                    <td className="px-6 py-4 align-top">
                      <ChannelModelsCell models={channel.models} />
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-slate-700 dark:text-slate-300 align-top">{channel.weight}</td>
                    <td className="px-6 py-4 align-top">
                      <StatusBadge channel={channel} />
                    </td>
                    <td className="px-6 py-4 align-top text-xs text-slate-500 dark:text-slate-400">
                      {displayChannelTime(channel.createdAt)}
                    </td>
                    <td className="px-6 py-4 align-top text-xs text-slate-500 dark:text-slate-400">
                      {displayChannelTime(channel.expiresAt, t('admin.channel.expiration.never'))}
                    </td>
                    <td className="px-6 py-4 text-right align-middle">
                      <div className="flex items-center justify-end gap-1">
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
                          title={t('admin.channel.actions.copyCreateChannel')}
                          onClick={() => openCopyCreateModal(channel)}
                          disabled={pendingChannelId === channel.id}
                        >
                          <Copy className="w-4 h-4" />
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

      </AdminTableShell>

      {modalMode && (
        <AddAccountModal
          mode={modalMode}
          initialValues={channelFormDraft}
          availableModels={modelCatalog}
          aiResources={aiResources}
          modelCatalogLoading={modelCatalogLoading}
          modelCatalogError={modelCatalogError}
          aiResourcesLoading={aiResourcesLoading}
          aiResourcesError={aiResourcesError}
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
          onCopyApiKey={handleCopyApiKey}
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
    <div className="flex max-w-[7rem] shrink-0 items-center gap-1 overflow-hidden whitespace-nowrap">
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

function ChannelModelsCell({ models }: { models: string[] }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-black dark:text-slate-300 dark:hover:border-emerald-500/50 dark:hover:text-emerald-300"
      >
        <Layers className="h-3.5 w-3.5 text-slate-400" />
        {t('admin.channel.modelCount', { count: models.length })}
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label={t('common.actions.close')}
            className="fixed inset-0 z-20 cursor-default bg-transparent"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-9 z-30 w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-[#1a1a1a]">
            <div className="max-h-64 overflow-y-auto pr-1">
              {models.map((model) => (
                <div
                  key={model}
                  className="mb-1 last:mb-0 rounded-md bg-slate-50 px-2 py-1.5 font-mono text-xs text-slate-700 dark:bg-black dark:text-slate-300"
                >
                  {model}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ApiKeyCell({
  channel,
  onCopyApiKey,
}: {
  channel: ChannelItem;
  onCopyApiKey: (channel: ChannelItem) => void;
}) {
  const { t } = useTranslation();
  const apiKey = channel.apiKey?.trim();
  const displayValue = maskApiKeyForDisplay(apiKey);
  const unavailableLabel = t('admin.channel.credentials.apiKeyUnavailable');
  const copyLabel = apiKey ? t('common.actions.copyApiKey') : unavailableLabel;

  return (
    <div className="flex min-w-[9rem] items-center gap-2">
      <span className={`min-w-0 truncate font-mono text-xs ${apiKey ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'}`}>
        {displayValue || unavailableLabel}
      </span>
      <button
        type="button"
        onClick={() => onCopyApiKey(channel)}
        disabled={!apiKey}
        title={copyLabel}
        aria-label={copyLabel}
        className="shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:hover:bg-white/10 dark:hover:text-slate-200"
      >
        <Copy className="h-3.5 w-3.5" />
      </button>
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
