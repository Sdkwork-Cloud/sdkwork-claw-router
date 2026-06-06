import { useEffect, useState, type FormEvent } from 'react';
import {
  StorageCheckboxField,
  StorageFormShell,
  StorageSelectField,
  StorageTextField,
} from '../components/StorageFormControls';
import { createStorageGarbageCollection } from '../storageService';
import type { StorageRecord } from '../storageSectionDefinitions';

interface StorageGarbageCollectionFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
  initialData?: StorageRecord;
}

export function StorageGarbageCollectionForm({ onCancel, onSuccess, initialData }: StorageGarbageCollectionFormProps) {
  const [target, setTarget] = useState('');
  const [retentionWindow, setRetentionWindow] = useState('');
  const [dryRunSample, setDryRunSample] = useState('');
  const [dryRun, setDryRun] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTarget(initialData.target || '');
      setRetentionWindow(initialData.retention || '');
      setDryRunSample(initialData.candidateCount || '');
    }
  }, [initialData]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!target.trim()) {
      setError('Target is required');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await createStorageGarbageCollection({
        target: target.trim(),
        jobType: target.trim(),
        retentionWindow: retentionWindow.trim() || undefined,
        dryRunSample: dryRunSample.trim() || undefined,
        dryRun,
      });
      onSuccess?.();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to schedule cleanup');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <StorageFormShell error={error} isSaving={isSaving} submitLabel="Schedule cleanup" onCancel={onCancel} onSubmit={handleSubmit}>
      <StorageSelectField
        label="Target"
        value={target}
        options={[
          { value: 'expired_uploads' },
          { value: 'orphaned_blobs' },
          { value: 'stale_previews' },
        ]}
        placeholder="Select target"
        required
        onChange={setTarget}
      />
      <StorageTextField label="Retention window" value={retentionWindow} onChange={setRetentionWindow} placeholder="P30D" />
      <StorageTextField label="Dry-run sample" value={dryRunSample} onChange={setDryRunSample} placeholder="1000" />
      <StorageCheckboxField label="Dry run" checked={dryRun} onChange={setDryRun} />
    </StorageFormShell>
  );
}
