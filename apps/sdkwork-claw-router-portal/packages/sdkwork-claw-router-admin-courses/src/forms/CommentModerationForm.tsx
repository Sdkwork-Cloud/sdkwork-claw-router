import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CourseFormActions,
  CourseFormFrame,
  CourseSelectField,
  CourseTextareaField,
} from '../components/CourseFormControls';

export interface CommentModerationFormValues {
  status?: string;
  moderationNote?: string;
}

interface CommentModerationFormProps {
  initialValue?: CommentModerationFormValues | null;
  onCancel: () => void;
  onSubmit: (input: CommentModerationFormValues) => Promise<void>;
}

export function CommentModerationForm({
  initialValue,
  onCancel,
  onSubmit,
}: CommentModerationFormProps) {
  const { t } = useTranslation();
  const [status, setStatus] = useState(initialValue?.status ?? 'pending');
  const [moderationNote, setModerationNote] = useState(initialValue?.moderationNote ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await onSubmit({
        status: status || undefined,
        moderationNote: moderationNote || undefined,
      });
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : t('admin.courses.form.saveError', 'Moderation could not be submitted'),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <CourseFormFrame error={error}>
      <CourseSelectField
        label={t('admin.courses.form.moderationStatus', 'Moderation Decision')}
        value={status}
        options={[
          { value: 'visible', label: t('admin.courses.form.visible', 'Visible') },
          { value: 'hidden', label: t('admin.courses.form.hidden', 'Hidden') },
          { value: 'flagged', label: t('admin.courses.form.flagged', 'Flagged') },
          { value: 'pending', label: t('admin.courses.form.keepPending', 'Keep Pending') },
        ]}
        onChange={setStatus}
      />
      <CourseTextareaField
        label={t('admin.courses.form.moderationNote', 'Moderation Note')}
        value={moderationNote}
        onChange={setModerationNote}
        placeholder={t('admin.courses.form.moderationNotePlaceholder', 'Reason for moderation action')}
        rows={4}
      />
      <CourseFormActions
        submitLabel={t('admin.courses.form.submitModeration', 'Submit Moderation')}
        isSaving={isSaving}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      />
    </CourseFormFrame>
  );
}