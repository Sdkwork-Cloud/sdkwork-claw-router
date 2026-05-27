import { useEffect, useState, type FormEvent } from 'react';
import {
  StorageCheckboxField,
  StorageFormShell,
  StorageSelectField,
  StorageTextField,
} from '../components/StorageFormControls';
import { createStorageProvider } from '../storageService';
import type { StorageRecord } from '../storageSectionDefinitions';

interface StorageProviderFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
  initialData?: StorageRecord;
}

export function StorageProviderForm({ onCancel, onSuccess, initialData }: StorageProviderFormProps) {
  const [providerCode, setProviderCode] = useState('');
  const [providerType, setProviderType] = useState('');
  const [region, setRegion] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [credentialRef, setCredentialRef] = useState('');
  const [multipart, setMultipart] = useState(true);
  const [lifecycle, setLifecycle] = useState(false);
  const [objectLock, setObjectLock] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setProviderCode(initialData.providerCode || '');
      setProviderType(initialData.providerType || '');
      setRegion(initialData.region || '');
      setEndpoint(initialData.endpoint || '');
      setCredentialRef(initialData.credentialRef || '');
    }
  }, [initialData]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!providerCode.trim() || !providerType.trim() || !credentialRef.trim()) {
      setError('Provider code, type, and credential ref are required');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await createStorageProvider({
        providerCode: providerCode.trim(),
        providerType: providerType.trim(),
        region: region.trim() || undefined,
        endpoint: endpoint.trim() || undefined,
        credentialRef: credentialRef.trim(),
        multipart,
        lifecycle,
        objectLock,
      });
      onSuccess?.();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save provider');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <StorageFormShell error={error} isSaving={isSaving} submitLabel="Register provider" onCancel={onCancel} onSubmit={handleSubmit}>
      <StorageTextField label="Provider code" value={providerCode} onChange={setProviderCode} placeholder="primary-s3" required />
      <StorageSelectField
        label="Provider type"
        value={providerType}
        options={[
          { value: 'aws_s3' },
          { value: 's3_compatible' },
          { value: 'cloudflare_r2' },
          { value: 'cos_s3' },
          { value: 'local_dev_s3' },
          { value: 'minio' },
          { value: 'oss_s3' },
        ]}
        placeholder="Select type"
        required
        onChange={setProviderType}
      />
      <StorageTextField label="Region" value={region} onChange={setRegion} placeholder="us-east-1" />
      <StorageTextField label="Endpoint URL" value={endpoint} onChange={setEndpoint} placeholder="https://s3.example.com" />
      <StorageTextField label="Credential ref" value={credentialRef} onChange={setCredentialRef} placeholder="vault://storage/primary" required />
      <StorageCheckboxField label="Multipart uploads" checked={multipart} onChange={setMultipart} />
      <StorageCheckboxField label="Lifecycle rules" checked={lifecycle} onChange={setLifecycle} />
      <StorageCheckboxField label="Object lock" checked={objectLock} onChange={setObjectLock} />
    </StorageFormShell>
  );
}
