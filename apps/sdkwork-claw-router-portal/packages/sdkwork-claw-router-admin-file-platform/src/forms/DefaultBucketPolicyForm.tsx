import { useEffect, useState, type FormEvent } from 'react';
import {
  StorageFormShell,
  StorageSelectField,
  StorageTextField,
} from '../components/StorageFormControls';
import { createStorageDefaultBucket } from '../storageService';
import type { StorageRecord } from '../storageSectionDefinitions';

interface DefaultBucketPolicyFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
  initialData?: StorageRecord;
}

export function DefaultBucketPolicyForm({ onCancel, onSuccess, initialData }: DefaultBucketPolicyFormProps) {
  const [logicalScope, setLogicalScope] = useState('');
  const [bucketId, setBucketId] = useState('');
  const [reason, setReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setLogicalScope(initialData.logicalScope || '');
      setBucketId(initialData.bucketId || '');
      setReason(initialData.reason || '');
    }
  }, [initialData]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!logicalScope.trim() || !bucketId.trim()) {
      setError('Logical scope and bucket ID are required');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await createStorageDefaultBucket({
        logicalScope: logicalScope.trim(),
        bucketId: bucketId.trim(),
        reason: reason.trim() || undefined,
      });
      onSuccess?.();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to set default route');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <StorageFormShell error={error} isSaving={isSaving} submitLabel="Set default route" onCancel={onCancel} onSubmit={handleSubmit}>
      <StorageSelectField
        label="Logical scope"
        value={logicalScope}
        options={[
          { value: 'tenant_private' },
          { value: 'tenant_public_asset' },
          { value: 'system_temp' },
          { value: 'system_archive' },
          { value: 'system_quarantine' },
          { value: 'system_variant' },
          { value: 'migration_import' },
        ]}
        placeholder="Select scope"
        required
        onChange={setLogicalScope}
      />
      <StorageTextField label="Bucket ID" value={bucketId} onChange={setBucketId} placeholder="bucket_..." required />
      <StorageTextField label="Reason" value={reason} onChange={setReason} placeholder="Route private uploads to primary storage" />
    </StorageFormShell>
  );
}
