import React, { useCallback, useEffect, useState } from 'react';
import { Loader2, QrCode, RefreshCw, Save, Settings2, ShieldCheck } from 'lucide-react';
import type { AdminAuthSettingsUpdateRequest } from '@sdkwork/clawrouter-backend-sdk';
import { BusinessStatePanel } from 'sdkwork-claw-router-commons';
import {
  DEFAULT_CLAW_ROUTER_AUTH_RUNTIME_CONFIG,
  mergeClawRouterAuthRuntimeConfig,
} from './clawRouterAuthConfig';
import {
  fetchClawRouterAuthSettings,
  updateClawRouterAuthSettings,
} from './clawRouterAuthSettingsService';

type LoginMethod = NonNullable<AdminAuthSettingsUpdateRequest['loginMethods']>[number];
type RegisterMethod = NonNullable<AdminAuthSettingsUpdateRequest['registerMethods']>[number];
type RecoveryMethod = NonNullable<AdminAuthSettingsUpdateRequest['recoveryMethods']>[number];
type LeftRailMode = NonNullable<AdminAuthSettingsUpdateRequest['leftRailMode']>;
type OAuthRegion = NonNullable<AdminAuthSettingsUpdateRequest['oauthRegion']>;

type AuthSettingsForm = Required<Pick<
  AdminAuthSettingsUpdateRequest,
  'leftRailMode'
  | 'loginMethods'
  | 'oauthLoginEnabled'
  | 'oauthProviders'
  | 'qrLoginEnabled'
  | 'recoveryMethods'
  | 'registerMethods'
  | 'verificationPolicy'
>> & {
  oauthRegion: OAuthRegion;
};

const LOGIN_METHOD_OPTIONS: Array<{ label: string, value: LoginMethod }> = [
  { label: 'Password', value: 'password' },
  { label: 'Email code', value: 'emailCode' },
  { label: 'Phone code', value: 'phoneCode' },
  { label: 'Session bridge', value: 'sessionBridge' },
];

const REGISTER_METHOD_OPTIONS: Array<{ label: string, value: RegisterMethod }> = [
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' },
];

const RECOVERY_METHOD_OPTIONS: Array<{ label: string, value: RecoveryMethod }> = [
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' },
];

const OAUTH_PROVIDER_OPTIONS = ['wechat', 'alipay', 'douyin', 'google', 'github'] as const;

const DEFAULT_AUTH_SETTINGS_FORM: AuthSettingsForm = {
  leftRailMode: DEFAULT_CLAW_ROUTER_AUTH_RUNTIME_CONFIG.leftRailMode ?? 'highlights-only',
  loginMethods: [...(DEFAULT_CLAW_ROUTER_AUTH_RUNTIME_CONFIG.loginMethods ?? ['password'])],
  oauthLoginEnabled: DEFAULT_CLAW_ROUTER_AUTH_RUNTIME_CONFIG.oauthLoginEnabled ?? false,
  oauthProviders: [...(DEFAULT_CLAW_ROUTER_AUTH_RUNTIME_CONFIG.oauthProviders ?? [])],
  oauthRegion: 'mainland',
  qrLoginEnabled: DEFAULT_CLAW_ROUTER_AUTH_RUNTIME_CONFIG.qrLoginEnabled ?? false,
  recoveryMethods: ['email', 'phone'],
  registerMethods: ['email', 'phone'],
  verificationPolicy: {
    emailCodeLoginEnabled: DEFAULT_CLAW_ROUTER_AUTH_RUNTIME_CONFIG.verificationPolicy?.emailCodeLoginEnabled ?? false,
    emailRegistrationVerificationRequired: DEFAULT_CLAW_ROUTER_AUTH_RUNTIME_CONFIG.verificationPolicy?.emailRegistrationVerificationRequired ?? false,
    phoneCodeLoginEnabled: DEFAULT_CLAW_ROUTER_AUTH_RUNTIME_CONFIG.verificationPolicy?.phoneCodeLoginEnabled ?? false,
    phoneRegistrationVerificationRequired: DEFAULT_CLAW_ROUTER_AUTH_RUNTIME_CONFIG.verificationPolicy?.phoneRegistrationVerificationRequired ?? false,
  },
};

export function ClawRouterAuthSettingsPage() {
  const [form, setForm] = useState<AuthSettingsForm>(DEFAULT_AUTH_SETTINGS_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const loadSettings = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const record = await fetchClawRouterAuthSettings();
      if (isActive()) {
        setForm(toAuthSettingsForm(record));
      }
    } catch (error) {
      if (isActive()) {
        setLoadError(errorMessage(error, 'Failed to load auth settings.'));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    void loadSettings(() => active);
    return () => {
      active = false;
    };
  }, [loadSettings]);

  const saveSettings = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);
    try {
      const saved = await updateClawRouterAuthSettings(toAuthSettingsRequest(form));
      setForm(toAuthSettingsForm(saved));
      setSaveSuccess('Auth settings saved.');
    } catch (error) {
      setSaveError(errorMessage(error, 'Failed to save auth settings.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <BusinessStatePanel
        kind="loading"
        title="Loading auth settings..."
        className="min-h-[480px]"
      />
    );
  }

  if (loadError) {
    return (
      <BusinessStatePanel
        kind="error"
        title="Auth settings could not be loaded"
        description={loadError}
        onRetry={() => void loadSettings()}
        className="min-h-[480px]"
      />
    );
  }

  return (
    <div className="w-full max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-white/10 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
            <ShieldCheck className="h-6 w-6 text-blue-500" />
            Auth settings
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Manage SDKWork IAM login, registration, recovery, OAuth, QR login, and verification policy options.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => void loadSettings()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
          >
            <RefreshCw className="h-4 w-4" />
            Reload
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void saveSettings()}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save
          </button>
        </div>
      </div>

      {saveError ? (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          {saveError}
        </div>
      ) : null}
      {saveSuccess ? (
        <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
          {saveSuccess}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#1a1a1a]">
          <SectionHeader icon={<Settings2 className="h-5 w-5 text-blue-500" />} title="Runtime options" />
          <div className="mt-5 space-y-6">
            <SegmentedControl
              label="Left rail"
              value={form.leftRailMode}
              options={[
                { label: 'Auto', value: 'auto' },
                { label: 'Highlights', value: 'highlights-only' },
                { label: 'QR only', value: 'qr-only' },
              ]}
              onChange={(leftRailMode) => setForm((current) => ({
                ...current,
                leftRailMode,
                qrLoginEnabled: leftRailMode === 'qr-only' ? true : current.qrLoginEnabled,
              }))}
            />
            <CheckboxGroup
              label="Login methods"
              options={LOGIN_METHOD_OPTIONS}
              values={form.loginMethods}
              onChange={(loginMethods) => setForm((current) => withLoginMethods(current, loginMethods))}
            />
            <CheckboxGroup
              label="Registration methods"
              options={REGISTER_METHOD_OPTIONS}
              values={form.registerMethods}
              onChange={(registerMethods) => setForm((current) => ({
                ...current,
                registerMethods: registerMethods.length > 0 ? registerMethods : ['email'],
              }))}
            />
            <CheckboxGroup
              label="Recovery methods"
              options={RECOVERY_METHOD_OPTIONS}
              values={form.recoveryMethods}
              onChange={(recoveryMethods) => setForm((current) => ({
                ...current,
                recoveryMethods: recoveryMethods.length > 0 ? recoveryMethods : ['email'],
              }))}
            />
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#1a1a1a]">
          <SectionHeader icon={<QrCode className="h-5 w-5 text-emerald-500" />} title="OAuth and QR" />
          <div className="mt-5 space-y-5">
            <ToggleRow
              label="QR login"
              checked={form.qrLoginEnabled}
              onChange={() => setForm((current) => ({
                ...current,
                leftRailMode: current.qrLoginEnabled && current.leftRailMode === 'qr-only'
                  ? 'highlights-only'
                  : current.leftRailMode,
                qrLoginEnabled: !current.qrLoginEnabled,
              }))}
            />
            <ToggleRow
              label="OAuth login"
              checked={form.oauthLoginEnabled}
              onChange={() => setForm((current) => ({ ...current, oauthLoginEnabled: !current.oauthLoginEnabled }))}
            />
            <SegmentedControl
              label="OAuth region"
              value={form.oauthRegion}
              options={[
                { label: 'Mainland', value: 'mainland' },
                { label: 'Overseas', value: 'overseas' },
              ]}
              onChange={(oauthRegion) => setForm((current) => ({ ...current, oauthRegion }))}
            />
            <CheckboxGroup
              label="OAuth providers"
              options={OAUTH_PROVIDER_OPTIONS.map((value) => ({ label: providerLabel(value), value }))}
              values={form.oauthProviders}
              onChange={(oauthProviders) => setForm((current) => ({ ...current, oauthProviders }))}
            />
          </div>
        </section>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#1a1a1a]">
        <SectionHeader icon={<ShieldCheck className="h-5 w-5 text-amber-500" />} title="Verification policy" />
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <ToggleRow
            label="Email code login"
            checked={form.verificationPolicy.emailCodeLoginEnabled}
            onChange={() => updateVerificationPolicy('emailCodeLoginEnabled', !form.verificationPolicy.emailCodeLoginEnabled, setForm)}
          />
          <ToggleRow
            label="Phone code login"
            checked={form.verificationPolicy.phoneCodeLoginEnabled}
            onChange={() => updateVerificationPolicy('phoneCodeLoginEnabled', !form.verificationPolicy.phoneCodeLoginEnabled, setForm)}
          />
          <ToggleRow
            label="Email registration verification"
            checked={form.verificationPolicy.emailRegistrationVerificationRequired}
            onChange={() => updateVerificationPolicy(
              'emailRegistrationVerificationRequired',
              !form.verificationPolicy.emailRegistrationVerificationRequired,
              setForm,
            )}
          />
          <ToggleRow
            label="Phone registration verification"
            checked={form.verificationPolicy.phoneRegistrationVerificationRequired}
            onChange={() => updateVerificationPolicy(
              'phoneRegistrationVerificationRequired',
              !form.verificationPolicy.phoneRegistrationVerificationRequired,
              setForm,
            )}
          />
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
    </div>
  );
}

function ToggleRow({ checked, label, onChange }: { checked: boolean, label: string, onChange: () => void }) {
  return (
    <div className="flex min-h-12 items-center justify-between gap-4 rounded-lg border border-slate-200 px-4 py-3 dark:border-white/10">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#1a1a1a] ${checked ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
      >
        <span className="sr-only">{label}</span>
        <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}

function SegmentedControl<T extends string>({
  label,
  onChange,
  options,
  value,
}: {
  label: string,
  onChange: (value: T) => void,
  options: Array<{ label: string, value: T }>,
  value: T,
}) {
  return (
    <div>
      <div className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">{label}</div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${value === option.value
              ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400/70 dark:bg-blue-500/10 dark:text-blue-300'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CheckboxGroup<T extends string>({
  label,
  onChange,
  options,
  values,
}: {
  label: string,
  onChange: (values: T[]) => void,
  options: Array<{ label: string, value: T }>,
  values: readonly T[],
}) {
  const selected = new Set(values);
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">{label}</legend>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
          >
            <input
              type="checkbox"
              checked={selected.has(option.value)}
              onChange={() => {
                const next = selected.has(option.value)
                  ? values.filter((item) => item !== option.value)
                  : [...values, option.value];
                onChange(next);
              }}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function toAuthSettingsForm(record: Record<string, unknown>): AuthSettingsForm {
  const config = mergeClawRouterAuthRuntimeConfig(record);
  return {
    leftRailMode: config.leftRailMode ?? DEFAULT_AUTH_SETTINGS_FORM.leftRailMode,
    loginMethods: loginMethods(config.loginMethods),
    oauthLoginEnabled: config.oauthLoginEnabled ?? DEFAULT_AUTH_SETTINGS_FORM.oauthLoginEnabled,
    oauthProviders: stringArray(config.oauthProviders, DEFAULT_AUTH_SETTINGS_FORM.oauthProviders),
    oauthRegion: readOAuthRegion(record.oauthRegion),
    qrLoginEnabled: config.qrLoginEnabled ?? DEFAULT_AUTH_SETTINGS_FORM.qrLoginEnabled,
    recoveryMethods: recoveryMethods(config.recoveryMethods),
    registerMethods: registerMethods(config.registerMethods),
    verificationPolicy: {
      emailCodeLoginEnabled: config.verificationPolicy?.emailCodeLoginEnabled ?? false,
      emailRegistrationVerificationRequired: config.verificationPolicy?.emailRegistrationVerificationRequired ?? false,
      phoneCodeLoginEnabled: config.verificationPolicy?.phoneCodeLoginEnabled ?? false,
      phoneRegistrationVerificationRequired: config.verificationPolicy?.phoneRegistrationVerificationRequired ?? false,
    },
  };
}

function toAuthSettingsRequest(form: AuthSettingsForm): AdminAuthSettingsUpdateRequest {
  const qrLoginEnabled = form.leftRailMode === 'qr-only' ? true : form.qrLoginEnabled;
  return {
    leftRailMode: qrLoginEnabled ? form.leftRailMode : form.leftRailMode === 'qr-only' ? 'highlights-only' : form.leftRailMode,
    loginMethods: effectiveLoginMethods(form),
    oauthLoginEnabled: form.oauthLoginEnabled,
    oauthProviders: [...form.oauthProviders],
    oauthRegion: form.oauthRegion,
    qrLoginEnabled,
    recoveryMethods: [...form.recoveryMethods],
    registerMethods: [...form.registerMethods],
    verificationPolicy: { ...form.verificationPolicy },
  };
}

function effectiveLoginMethods(form: AuthSettingsForm): LoginMethod[] {
  const selected = new Set(form.loginMethods);
  if (form.verificationPolicy.emailCodeLoginEnabled) {
    selected.add('emailCode');
  } else {
    selected.delete('emailCode');
  }
  if (form.verificationPolicy.phoneCodeLoginEnabled) {
    selected.add('phoneCode');
  } else {
    selected.delete('phoneCode');
  }
  if (selected.size === 0) {
    selected.add('password');
  }
  return LOGIN_METHOD_OPTIONS
    .map((option) => option.value)
    .filter((value) => selected.has(value));
}

function updateVerificationPolicy(
  key: keyof AuthSettingsForm['verificationPolicy'],
  value: boolean,
  setForm: React.Dispatch<React.SetStateAction<AuthSettingsForm>>,
) {
  setForm((current) => ({
    ...current,
    loginMethods: nextLoginMethodsForVerificationPolicy(current, key, value),
    verificationPolicy: {
      ...current.verificationPolicy,
      [key]: value,
    },
  }));
}

function withLoginMethods(current: AuthSettingsForm, loginMethods: LoginMethod[]): AuthSettingsForm {
  const nextLoginMethods: LoginMethod[] = loginMethods.length > 0 ? loginMethods : ['password'];
  return {
    ...current,
    loginMethods: nextLoginMethods,
    verificationPolicy: {
      ...current.verificationPolicy,
      emailCodeLoginEnabled: nextLoginMethods.includes('emailCode'),
      phoneCodeLoginEnabled: nextLoginMethods.includes('phoneCode'),
    },
  };
}

function nextLoginMethodsForVerificationPolicy(
  current: AuthSettingsForm,
  key: keyof AuthSettingsForm['verificationPolicy'],
  value: boolean,
): LoginMethod[] {
  if (key !== 'emailCodeLoginEnabled' && key !== 'phoneCodeLoginEnabled') {
    return current.loginMethods;
  }
  const selected = new Set(current.loginMethods);
  const method = key === 'emailCodeLoginEnabled' ? 'emailCode' : 'phoneCode';
  if (value) {
    selected.add(method);
  } else {
    selected.delete(method);
  }
  if (selected.size === 0) {
    selected.add('password');
  }
  return LOGIN_METHOD_OPTIONS
    .map((option) => option.value)
    .filter((item) => selected.has(item));
}

function loginMethods(value: unknown): LoginMethod[] {
  return filteredOptions(value, LOGIN_METHOD_OPTIONS.map((option) => option.value), DEFAULT_AUTH_SETTINGS_FORM.loginMethods);
}

function registerMethods(value: unknown): RegisterMethod[] {
  return filteredOptions(value, REGISTER_METHOD_OPTIONS.map((option) => option.value), DEFAULT_AUTH_SETTINGS_FORM.registerMethods);
}

function recoveryMethods(value: unknown): RecoveryMethod[] {
  return filteredOptions(value, RECOVERY_METHOD_OPTIONS.map((option) => option.value), DEFAULT_AUTH_SETTINGS_FORM.recoveryMethods);
}

function filteredOptions<T extends string>(value: unknown, allowed: readonly T[], fallback: T[]): T[] {
  if (!Array.isArray(value)) {
    return [...fallback];
  }
  const allowedSet = new Set<string>(allowed);
  const filtered = value.filter((item): item is T => typeof item === 'string' && allowedSet.has(item));
  return filtered.length > 0 ? filtered : [...fallback];
}

function stringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) {
    return [...fallback];
  }
  const filtered = value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  return filtered.length > 0 ? filtered : [...fallback];
}

function readOAuthRegion(value: unknown): OAuthRegion {
  return value === 'overseas' ? 'overseas' : 'mainland';
}

function providerLabel(value: string): string {
  if (value === 'wechat') return 'WeChat';
  if (value === 'alipay') return 'Alipay';
  if (value === 'douyin') return 'Douyin';
  if (value === 'google') return 'Google';
  if (value === 'github') return 'GitHub';
  return value;
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
