import { useEffect, useState, type FormEvent } from 'react';
import {
  StorageFormShell,
  StorageSelectField,
  StorageTextField,
} from '../components/StorageFormControls';
import { createStorageQuota } from '../storageService';
import type { StorageRecord } from '../storageSectionDefinitions';

interface QuotaPolicyFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
  initialData?: StorageRecord;
}

export function QuotaPolicyForm({ onCancel, onSuccess, initialData }: QuotaPolicyFormProps) {
  const [scopeType, setScopeType] = useState('');
  const [scopeId, setScopeId] = useState('');
  const [quotaLimit, setQuotaLimit] = useState('');
  const [enforcement, setEnforcement] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setScopeType(initialData.scopeType || '');
      setScopeId(initialData.scopeId || '');
      setQuotaLimit(initialData.limit || '');
      setEnforcement(initialData.enforcement || '');
    }
  }, [initialData]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!scopeType.trim() || !scopeId.trim() || !quotaLimit.trim()) {
      setError('Scope type, scope ID, and quota limit are required');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await createStorageQuota({
        scopeType: scopeType.trim(),
        scopeId: scopeId.trim(),
        quotaLimit: quotaLimit.trim(),
        enforcement: enforcement || undefined,
      });
      onSuccess?.();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to create quota');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <StorageFormShell error={error} isSaving={isSaving} submitLabel="Create quota" onCancel={onCancel} onSubmit={handleSubmit}>
      <StorageSelectField
        label="Scope type"
        value={scopeType}
        options={[
          { value: 'organization' },
          { value: 'user' },
          { value: 'app' },
          { value: 'space' },
          { value: 'tenant' },
        ]}
        placeholder="Select scope type"
        required
        onChange={setScopeType}
      />
      <StorageTextField label="Scope ID" value={scopeId} onChange={setScopeId} placeholder="org_..." required />
      <StorageTextField label="Quota limit" value={quotaLimit} onChange={setQuotaLimit} placeholder="10737418240" required />
      <StorageSelectField
        label="Enforcement"
        value={enforcement}
        options={[
          { value: 'hard' },
          { value: 'soft' },
          { value: 'warn' },
        ]}
        placeholder="Select enforcement"
        onChange={setEnforcement}
      />
    </StorageFormShell>
  );
}
