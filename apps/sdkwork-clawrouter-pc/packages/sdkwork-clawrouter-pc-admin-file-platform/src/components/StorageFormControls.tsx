import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'),
  );

  useEffect(() => {
    const el = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDark(el.classList.contains('dark'));
    });
    observer.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

function StorageFormError({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
      {message}
    </div>
  );
}

interface StorageTextFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  onChange: (value: string) => void;
}

export function StorageTextField({
  label,
  value,
  placeholder,
  type = 'text',
  required = false,
  onChange,
}: StorageTextFieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {required ? <span className="mr-0.5 text-red-500">*</span> : null}
        {label}
      </span>
      <input
        value={value}
        type={type}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
      />
    </label>
  );
}

export type StorageSelectOption<TValue extends string = string> = {
  value: TValue;
  label?: string;
  disabled?: boolean;
};

interface StorageSelectFieldProps<TValue extends string> {
  label: string;
  value: TValue | '';
  options: Array<StorageSelectOption<TValue>>;
  placeholder?: string;
  required?: boolean;
  onChange: (value: TValue | '') => void;
}

export function StorageSelectField<TValue extends string>({
  label,
  value,
  options,
  placeholder,
  required = false,
  onChange,
}: StorageSelectFieldProps<TValue>) {
  const isDark = useIsDark();

  const optionBg = isDark ? '#1e293b' : '#ffffff';
  const optionColor = isDark ? '#f1f5f9' : '#1e293b';
  const placeholderColor = isDark ? '#64748b' : '#94a3b8';

  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {required ? <span className="mr-0.5 text-red-500">*</span> : null}
        {label}
      </span>
      <select
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value as TValue | '')}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
      >
        {placeholder ? (
          <option value="" style={{ backgroundColor: optionBg, color: placeholderColor }}>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            style={{ backgroundColor: optionBg, color: optionColor }}
          >
            {option.label ?? option.value}
          </option>
        ))}
      </select>
    </label>
  );
}

interface StorageCheckboxFieldProps {
  label: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function StorageCheckboxField({
  label,
  defaultChecked = false,
  checked,
  onChange,
}: StorageCheckboxFieldProps) {
  const isControlled = checked !== undefined && onChange !== undefined;

  return (
    <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 dark:border-white/10 dark:text-slate-200">
      <input
        className="h-4 w-4 rounded border-slate-300 text-blue-600"
        type="checkbox"
        defaultChecked={isControlled ? undefined : defaultChecked}
        checked={isControlled ? checked : undefined}
        onChange={isControlled ? (e) => onChange(e.target.checked) : undefined}
      />
      <span>{label}</span>
    </label>
  );
}

interface StorageFormShellProps {
  error: string | null;
  isSaving: boolean;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (event: FormEvent) => void;
  children: ReactNode;
  tone?: 'primary' | 'danger';
}

const toneClassNames = {
  primary: 'bg-blue-600 hover:bg-blue-700',
  danger: 'bg-red-600 hover:bg-red-700',
};

export function StorageFormShell({
  error,
  isSaving,
  submitLabel,
  onCancel,
  onSubmit,
  children,
  tone = 'primary',
}: StorageFormShellProps) {
  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      {error ? <StorageFormError message={error} /> : null}
      {children}
      <div className="mt-2 flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-white/10">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/20 dark:text-slate-300 dark:hover:bg-white/5"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 ${toneClassNames[tone]}`}
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}