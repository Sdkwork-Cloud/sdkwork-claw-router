import { useCallback, useState, type ReactNode } from 'react';
import { Trash2 } from 'lucide-react';
import { ConfirmDialog } from 'sdkwork-clawrouter-pc-commons';

export function StorageTableActions({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-end gap-2">
      {children}
    </div>
  );
}

type StorageIconActionTone = 'default' | 'danger';

interface StorageIconActionButtonProps {
  label: string;
  icon: ReactNode;
  tone?: StorageIconActionTone;
  onClick: () => void;
  disabled?: boolean;
}

const iconActionToneClassNames: Record<StorageIconActionTone, string> = {
  default: 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10',
  danger: 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10',
};

export function StorageIconActionButton({
  label,
  icon,
  tone = 'default',
  onClick,
  disabled = false,
}: StorageIconActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md disabled:cursor-not-allowed disabled:opacity-40 ${iconActionToneClassNames[tone]}`}
    >
      {icon}
    </button>
  );
}

export function confirmStorageAction(message: string): boolean {
  return window.confirm(message);
}

interface DeleteConfirmationState {
  message: string;
  resolve: (confirmed: boolean) => void;
}

export function useStorageConfirmDelete() {
  const [confirmation, setConfirmation] = useState<DeleteConfirmationState | null>(null);

  const confirmDelete = useCallback((message: string): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setConfirmation({ message, resolve });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirmation) {
      confirmation.resolve(true);
      setConfirmation(null);
    }
  }, [confirmation]);

  const handleCancel = useCallback(() => {
    if (confirmation) {
      confirmation.resolve(false);
      setConfirmation(null);
    }
  }, [confirmation]);

  const deleteDialog = confirmation ? (
    <ConfirmDialog
      title="Confirm Delete"
      description={confirmation.message}
      confirmLabel="Delete"
      tone="danger"
      icon={<Trash2 className="h-4 w-4" />}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  ) : null;

  return { confirmDelete, deleteDialog };
}