import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  Check,
  CreditCard,
  Image as ImageIcon,
  Key,
  MapPin,
  MessageSquare,
  Mic,
  Music,
  Video,
  X,
  Zap,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CopyButton } from 'sdkwork-claw-router-commons';
import type { ApiKey, ApiKeyGroup } from './apiKeyService';
import { DEFAULT_API_KEY_GROUP, type ApiKeyFormValues as ApiKeyFormValuesContract } from './apiKeyForm';
import { formatApiKeyGroupOptionLabel, resolveApiKeyGroupCode } from './apiKeyGroups';

export type ApiKeyFormValues = ApiKeyFormValuesContract;

interface KeyFormDrawerProps {
  isOpen: boolean;
  mode?: 'create' | 'view' | 'edit';
  initialData?: ApiKey | null;
  groups: ApiKeyGroup[];
  groupsLoading?: boolean;
  submitting?: boolean;
  onClose: () => void;
  onRequestGroups?: () => void;
  onSubmit?: (data: ApiKeyFormValues) => void | Promise<void>;
}

const MODALITIES = [
  { id: 'text', labelKey: 'common.modality.text', icon: MessageSquare, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  { id: 'image', labelKey: 'common.modality.image', icon: ImageIcon, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/30' },
  { id: 'video', labelKey: 'common.modality.video', icon: Video, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  { id: 'audio', labelKey: 'common.modality.audio', icon: Mic, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  { id: 'music', labelKey: 'common.modality.music', icon: Music, color: 'text-sky-500', bg: 'bg-sky-500/10', border: 'border-sky-500/30' },
];

const DEFAULT_MODALITIES = MODALITIES.map((item) => item.id);

export function CreateKeyDrawer({
  isOpen,
  mode = 'create',
  initialData = null,
  groups,
  groupsLoading = false,
  submitting = false,
  onClose,
  onRequestGroups,
  onSubmit,
}: KeyFormDrawerProps) {
  const { t } = useTranslation();
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const defaultGroup = useMemo(() => groups[0]?.code ?? DEFAULT_API_KEY_GROUP, [groups]);
  const [name, setName] = useState('');
  const [group, setGroup] = useState(defaultGroup);
  const [expiryType, setExpiryType] = useState<'never' | 'custom' | '1h' | '1d' | '1m'>('never');
  const [expiryDate, setExpiryDate] = useState('');
  const [createCount, setCreateCount] = useState(1);
  const [isUnlimitedQuota, setIsUnlimitedQuota] = useState(true);
  const [quota, setQuota] = useState('0.000000');
  const [ipLimit, setIpLimit] = useState('');
  const [allowedModalities, setAllowedModalities] = useState<Set<string>>(new Set(DEFAULT_MODALITIES));

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    if (initialData) {
      setName(initialData.displayName);
      setGroup(resolveApiKeyGroupCode(initialData.group, groups));
      setIpLimit(initialData.ipLimit === 'unrestricted' ? '' : initialData.ipLimit);
      setExpiryType(initialData.expires === 'never' ? 'never' : 'custom');
      setExpiryDate(initialData.expires === 'never' ? '' : initialData.expires.replace(' ', 'T').slice(0, 16));
      setIsUnlimitedQuota(initialData.quota === 'unlimited');
      setQuota(initialData.quota === 'unlimited' ? '0.000000' : initialData.quota);
      setAllowedModalities(new Set(initialData.modalities.length > 0 ? initialData.modalities : DEFAULT_MODALITIES));
      setCreateCount(1);
      return;
    }
    setName('');
    setGroup(defaultGroup);
    setExpiryType('never');
    setExpiryDate('');
    setCreateCount(1);
    setIsUnlimitedQuota(true);
    setQuota('0.000000');
    setIpLimit('');
    setAllowedModalities(new Set(DEFAULT_MODALITIES));
  }, [defaultGroup, groups, initialData, isOpen]);

  if (!isOpen) {
    return null;
  }

  const title = isView
    ? t('console.apiKeys.detailsTitle', 'API Key 详情')
    : isEdit
      ? t('console.apiKeys.editTitle', '编辑 API Key')
      : t('console.apiKeys.createTitle', '创建 API Key');
  const canSubmit = !isView && !submitting && name.trim().length > 0 && group.length > 0 && allowedModalities.size > 0;

  const handleExpiryShortcut = (type: 'never' | '1h' | '1d' | '1m') => {
    if (isView) {
      return;
    }
    setExpiryType(type);
    if (type === 'never') {
      setExpiryDate('');
      return;
    }
    const date = new Date();
    if (type === '1h') date.setHours(date.getHours() + 1);
    if (type === '1d') date.setDate(date.getDate() + 1);
    if (type === '1m') date.setMonth(date.getMonth() + 1);
    setExpiryDate(toLocalInputValue(date));
  };

  const toggleModality = (id: string) => {
    if (isView) {
      return;
    }
    const next = new Set(allowedModalities);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setAllowedModalities(next);
  };

  const submit = async () => {
    if (!canSubmit || !onSubmit) {
      return;
    }
    await onSubmit({
      name: name.trim(),
      group,
      quota: isUnlimitedQuota ? '0.000000' : quota.trim(),
      isUnlimitedQuota,
      modalities: Array.from(allowedModalities),
      ipLimit: ipLimit.trim(),
      expires: expiryType === 'never' ? 'never' : expiryDate,
      createCount,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="w-full max-w-xl bg-white dark:bg-[#1e1e1e] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200 dark:border-white/10"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
            <Key className="w-5 h-5 text-lobster-500" />
            {title}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-white/10 p-2 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {isView && initialData && (
            <div className="bg-slate-50 dark:bg-[#252525] p-5 rounded-xl border border-slate-200 dark:border-white/5 space-y-4">
              <ReadOnlyRow
                label={t('console.apiKeys.maskedToken', 'Masked token')}
                value={initialData.maskedKey}
                monospace
                copyText={initialData.copyableKey}
                copyLabel={t('console.apiKeys.copyKey', '复制密钥')}
                copiedLabel={t('console.apiKeys.keyCopied', '密钥已复制')}
                copyDisabled={!initialData.copyableKey}
              />
              <ReadOnlyRow label={t('console.apiKeys.status', '状态')} value={initialData.status} />
              <ReadOnlyRow label={t('console.apiKeys.usedQuota', '已用额度')} value={initialData.usedQuota} />
              <ReadOnlyRow label={t('console.apiKeys.created', '创建时间')} value={initialData.created} monospace />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{t('console.apiKeys.name', 'Name')}</label>
              <input
                type="text"
                disabled={isView}
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/10 px-3 py-2 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-60"
                placeholder={t('console.apiKeys.namePlaceholder', 'Production key')}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{t('console.apiKeys.group', 'Group')}</label>
              <select
                disabled={isView}
                value={group}
                onFocus={onRequestGroups}
                onChange={(event) => setGroup(event.target.value)}
                className="w-full bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/10 px-3 py-2 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-60"
              >
                {groupsLoading && <option value={group}>{t('console.apiKeys.loadingGroups', '正在加载分组...')}</option>}
                {groups.map((item) => (
                  <option key={item.code} value={item.code}>
                    {formatApiKeyGroupOptionLabel(item)}
                  </option>
                ))}
                {!groupsLoading && groups.length > 0 && !groups.some((item) => item.code === group) && (
                  <option value={group}>{group}</option>
                )}
                {!groupsLoading && groups.length === 0 && <option value={DEFAULT_API_KEY_GROUP}>{t('console.apiKeys.defaultGroup', '默认分组')}</option>}
              </select>
            </div>
          </div>

          <section className="bg-slate-50 dark:bg-[#252525] p-5 rounded-xl border border-slate-200 dark:border-white/5 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                {t('console.apiKeys.expiration', 'Expiration')}
              </span>
              {!isView && (
                <div className="flex items-center gap-2 text-xs">
                  {(['never', '1m', '1d', '1h'] as const).map((item) => (
                    <button
                      key={item}
                      onClick={() => handleExpiryShortcut(item)}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        expiryType === item ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-white/10 dark:text-white dark:hover:bg-white/20'
                      }`}
                    >
                      {item === 'never' ? t('common.actions.never') : item.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              type="datetime-local"
              disabled={isView || expiryType === 'never'}
              value={expiryType === 'never' ? '' : expiryDate}
              onChange={(event) => {
                setExpiryDate(event.target.value);
                setExpiryType('custom');
              }}
              className="w-full bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 px-3 py-2 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
            {expiryType === 'never' && (
              <div className="text-xs text-emerald-500 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                {t('console.apiKeys.neverExpires', 'Never expires')}
              </div>
            )}
          </section>

          {!isView && !isEdit && (
            <section className="bg-slate-50 dark:bg-[#252525] p-5 rounded-xl border border-slate-200 dark:border-white/5 space-y-3">
              <span className="text-sm font-bold text-slate-900 dark:text-white block">{t('console.apiKeys.createCount', 'Create count')}</span>
              <input
                type="number"
                min="1"
                max="100"
                value={createCount}
                onChange={(event) => setCreateCount(Number(event.target.value))}
                className="w-full bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 px-3 py-2 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </section>
          )}

          <section className="bg-slate-50 dark:bg-[#252525] p-5 rounded-xl border border-slate-200 dark:border-white/5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{t('console.apiKeys.quota', 'Quota')}</span>
            </div>
            <div className="flex items-center bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2">
              <Zap className={`w-4 h-4 mr-2 ${isUnlimitedQuota ? 'text-slate-500' : 'text-amber-500'}`} />
              <input
                type="text"
                disabled={isView || isUnlimitedQuota}
                value={quota}
                onChange={(event) => setQuota(event.target.value)}
                className="w-full bg-transparent text-slate-900 dark:text-white text-sm focus:outline-none disabled:opacity-50"
              />
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/5 pt-4">
              <span className="text-sm font-bold text-slate-900 dark:text-white">{t('console.apiKeys.unlimited', 'Unlimited')}</span>
              <button
                disabled={isView}
                onClick={() => setIsUnlimitedQuota((value) => !value)}
                className={`w-10 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                  isUnlimitedQuota ? 'bg-emerald-500' : 'bg-slate-600'
                } disabled:opacity-50`}
              >
                <span className={`w-4 h-4 rounded-full bg-white transition-transform ${isUnlimitedQuota ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </section>

          <section className="space-y-3">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">{t('console.apiKeys.modalities', 'Modalities')}</label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {MODALITIES.map((item) => {
                const Icon = item.icon;
                const checked = allowedModalities.has(item.id);
                return (
                  <button
                    type="button"
                    key={item.id}
                    disabled={isView}
                    onClick={() => toggleModality(item.id)}
                    className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-colors ${
                      checked ? `${item.bg} ${item.border}` : 'bg-slate-100 dark:bg-[#252525] border-transparent opacity-50 grayscale'
                    } disabled:cursor-default`}
                  >
                    <Icon className={`w-5 h-5 ${checked ? item.color : 'text-slate-400'}`} />
                    <span className={`text-xs font-bold leading-tight ${checked ? item.color : 'text-slate-500'}`}>{t(item.labelKey)}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">{t('console.apiKeys.ipAllowlist', 'IP allowlist')}</label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                disabled={isView}
                value={ipLimit}
                onChange={(event) => setIpLimit(event.target.value)}
                className="w-full bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/10 pl-9 pr-3 py-2 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
                placeholder={t('console.apiKeys.ipAllowlistPlaceholder', '192.168.1.1, 10.0.0.0/24')}
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1a1a1a] flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10 transition-colors">
            {isView ? t('common.actions.close') : t('common.actions.cancel')}
          </button>
          {!isView && (
            <button
              disabled={!canSubmit}
              onClick={submit}
              className="px-5 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors shadow-sm"
            >
            {submitting ? t('common.actions.saving', '保存中...') : isEdit ? t('common.actions.save', '保存') : t('common.actions.createKey')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReadOnlyRow({
  label,
  value,
  monospace = false,
  copyText,
  copyLabel,
  copiedLabel,
  copyDisabled = false,
}: {
  label: string;
  value: string;
  monospace?: boolean;
  copyText?: string | null;
  copyLabel?: string;
  copiedLabel?: string;
  copyDisabled?: boolean;
}) {
  return (
    <div className="flex justify-between gap-3 items-center text-sm border-t first:border-t-0 border-slate-200 dark:border-white/10 pt-3 first:pt-0">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="flex min-w-0 items-center gap-2">
        <span className={`truncate font-medium text-slate-800 dark:text-slate-200 ${monospace ? 'font-mono' : ''}`}>{value}</span>
        {copyLabel ? (
          <CopyButton
            text={copyText ?? ''}
            label={copyLabel}
            copiedLabel={copiedLabel}
            title={copyLabel}
            disabled={copyDisabled}
            className="h-7 w-7 shrink-0 border border-slate-200 bg-white dark:border-white/10 dark:bg-[#1e1e1e]"
            iconClassName="h-3.5 w-3.5"
          />
        ) : null}
      </span>
    </div>
  );
}

function toLocalInputValue(date: Date): string {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}
