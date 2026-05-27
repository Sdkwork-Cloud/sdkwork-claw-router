import { useEffect, useState, type FormEvent } from 'react';
import {
  StorageCheckboxField,
  StorageFormShell,
  StorageSelectField,
  StorageTextField,
} from '../components/StorageFormControls';
import { createStorageBucket } from '../storageService';
import type { StorageRecord } from '../storageSectionDefinitions';

interface StorageBucketFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
  initialData?: StorageRecord;
}

export function StorageBucketForm({ onCancel, onSuccess, initialData }: StorageBucketFormProps) {
  const [bucketName, setBucketName] = useState('');
  const [providerId, setProviderId] = useState('');
  const [logicalScope, setLogicalScope] = useState('');
  const [bucketRegion, setBucketRegion] = useState('');
  const [dataResidencyRegion, setDataResidencyRegion] = useState('');
  const [objectKeyPrefix, setObjectKeyPrefix] = useState('');
  const [storageClass, setStorageClass] = useState('');
  const [encryption, setEncryption] = useState('');
  const [kmsKeyRef, setKmsKeyRef] = useState('');
  const [blockPublicAccess, setBlockPublicAccess] = useState(true);
  const [versioning, setVersioning] = useState(false);
  const [objectLock, setObjectLock] = useState(false);
  const [lifecycle, setLifecycle] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setBucketName(initialData.bucketName || '');
      setProviderId(initialData.providerId || '');
      setLogicalScope(initialData.logicalScope || '');
      setBucketRegion(initialData.bucketRegion || '');
      setDataResidencyRegion(initialData.dataResidencyRegion || '');
      setObjectKeyPrefix(initialData.objectKeyPrefix || '');
      setStorageClass(initialData.storageClass || '');
      setEncryption(initialData.encryption || '');
      setKmsKeyRef(initialData.kmsKeyRef || '');
      setVersioning(initialData.versioningEnabled === 'true');
      setObjectLock(initialData.objectLockEnabled === 'true');
      setLifecycle(initialData.lifecycleEnabled === 'true');
      setBlockPublicAccess(initialData.publicAccessBlocked !== 'false');
    }
  }, [initialData]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!bucketName.trim() || !providerId.trim() || !logicalScope.trim()) {
      setError('Bucket name, provider ID, and logical scope are required');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await createStorageBucket({
        bucketName: bucketName.trim(),
        providerId: providerId.trim(),
        logicalScope: logicalScope.trim(),
        bucketRegion: bucketRegion.trim() || undefined,
        dataResidencyRegion: dataResidencyRegion.trim() || undefined,
        objectKeyPrefix: objectKeyPrefix.trim() || undefined,
        storageClass: storageClass || undefined,
        encryption: encryption || undefined,
        kmsKeyRef: kmsKeyRef.trim() || undefined,
        blockPublicAccess,
        versioning,
        objectLock,
        lifecycle,
      });
      onSuccess?.();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to create bucket');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <StorageFormShell error={error} isSaving={isSaving} submitLabel="Create bucket" onCancel={onCancel} onSubmit={handleSubmit}>
      <StorageTextField label="Bucket name" value={bucketName} onChange={setBucketName} placeholder="tenant-private" required />
      <StorageTextField label="Provider ID" value={providerId} onChange={setProviderId} placeholder="1" required />
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
      <StorageTextField label="Bucket region" value={bucketRegion} onChange={setBucketRegion} placeholder="us-east-1" />
      <StorageTextField label="Data residency region" value={dataResidencyRegion} onChange={setDataResidencyRegion} placeholder="US" />
      <StorageTextField label="Object key prefix" value={objectKeyPrefix} onChange={setObjectKeyPrefix} placeholder="tenant/{tenantId}/" />
      <StorageSelectField
        label="Storage class"
        value={storageClass}
        options={[
          { value: 'STANDARD' },
          { value: 'INTELLIGENT_TIERING' },
          { value: 'STANDARD_IA' },
          { value: 'ONEZONE_IA' },
          { value: 'GLACIER_IR' },
          { value: 'GLACIER' },
          { value: 'DEEP_ARCHIVE' },
        ]}
        placeholder="Select class"
        onChange={setStorageClass}
      />
      <StorageSelectField
        label="Encryption"
        value={encryption}
        options={[
          { value: 'none' },
          { value: 'sse_s3' },
          { value: 'sse_kms' },
        ]}
        placeholder="Select encryption"
        onChange={setEncryption}
      />
      <StorageTextField label="KMS key ref" value={kmsKeyRef} onChange={setKmsKeyRef} placeholder="vault://kms/storage-primary" />
      <StorageCheckboxField label="Block public access" checked={blockPublicAccess} onChange={setBlockPublicAccess} />
      <StorageCheckboxField label="Versioning" checked={versioning} onChange={setVersioning} />
      <StorageCheckboxField label="Object lock" checked={objectLock} onChange={setObjectLock} />
      <StorageCheckboxField label="Lifecycle rules" checked={lifecycle} onChange={setLifecycle} />
    </StorageFormShell>
  );
}
