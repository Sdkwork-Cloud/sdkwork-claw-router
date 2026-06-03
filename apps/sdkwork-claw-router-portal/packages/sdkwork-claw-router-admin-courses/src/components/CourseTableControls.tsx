import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { ConfirmDialog } from 'sdkwork-claw-router-commons';

interface CourseTablePanelProps {
  children: ReactNode;
  className?: string;
}

export function CourseTablePanel({ children, className }: CourseTablePanelProps) {
  return (
    <div className={['min-h-0 flex-1 overflow-auto rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}

export function CourseTableActions({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-end gap-2">
      {children}
    </div>
  );
}

type CourseIconActionTone = 'default' | 'danger';

interface CourseIconActionButtonProps {
  label: string;
  icon: ReactNode;
  tone?: CourseIconActionTone;
  onClick: () => void;
}

const iconActionToneClassNames: Record<CourseIconActionTone, string> = {
  default: 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10',
  danger: 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10',
};

export function CourseIconActionButton({
  label,
  icon,
  tone = 'default',
  onClick,
}: CourseIconActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md ${iconActionToneClassNames[tone]}`}
    >
      {icon}
    </button>
  );
}

interface CourseDeleteConfirmProps {
  title: string;
  description: string;
  onConfirm: () => void;
}

export function CourseDeleteConfirm({ title, description, onConfirm }: CourseDeleteConfirmProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const handleConfirm = async () => {
    setIsBusy(true);
    try {
      await onConfirm();
    } finally {
      setIsBusy(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <CourseIconActionButton
        label={t('common.actions.delete', 'Delete')}
        icon={<Trash2 className="h-4 w-4" />}
        tone="danger"
        onClick={() => setIsOpen(true)}
      />
      {isOpen ? (
        <ConfirmDialog
          title={title}
          description={description}
          tone="danger"
          isBusy={isBusy}
          onConfirm={handleConfirm}
          onCancel={() => setIsOpen(false)}
        />
      ) : null}
    </>
  );
}
