import { useEffect, useState, type FormEvent } from 'react';
import {
  StorageFormShell,
  StorageSelectField,
  StorageTextField,
} from '../components/StorageFormControls';
import { createStorageReconciliation } from '../storageService';
import type { StorageRecord } from '../storageSectionDefinitions';

interface StorageReconciliationFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
  initialData?: StorageRecord;
}

export function StorageReconciliationForm({ onCancel, onSuccess, initialData }: StorageReconciliationFormProps) {
  const [providerId, setProviderId] = useState('');
  const [bucketId, setBucketId] = useState('');
  const [checkMode, setCheckMode] = useState('');
  const [reason, setReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setProviderId(initialData.providerId || '');
      setBucketId(initialData.bucketId || '');
      setCheckMode(initialData.checkMode || '');
      setReason(initialData.reason || '');
    }
  }, [initialData]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!providerId.trim()) {
      setError('Provider ID is required');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await createStorageReconciliation({
        providerId: providerId.trim(),
        bucketId: bucketId.trim() || undefined,
        checkMode: checkMode || undefined,
        reason: reason.trim() || undefined,
      });
      onSuccess?.();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to start reconciliation');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <StorageFormShell error={error} isSaving={isSaving} submitLabel="Start reconciliation" onCancel={onCancel} onSubmit={handleSubmit}>
      <StorageTextField label="Provider ID" value={providerId} onChange={setProviderId} placeholder="1" required />
      <StorageTextField label="Bucket ID" value={bucketId} onChange={setBucketId} placeholder="1" />
      <StorageSelectField
        label="Check mode"
        value={checkMode}
        options={[
          { value: 'metadata' },
          { value: 'checksum' },
          { value: 'full_scan' },
        ]}
        placeholder="Select mode"
        onChange={setCheckMode}
      />
      <StorageTextField label="Reason" value={reason} onChange={setReason} placeholder="Scheduled consistency audit" />
    </StorageFormShell>
  );
}
