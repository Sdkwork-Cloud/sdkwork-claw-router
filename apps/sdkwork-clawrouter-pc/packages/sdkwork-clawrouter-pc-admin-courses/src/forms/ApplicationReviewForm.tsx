import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CourseFormActions,
  CourseFormFrame,
  CourseSelectField,
  CourseTextareaField,
} from '../components/CourseFormControls';

export interface ApplicationReviewFormValues {
  status?: string;
  reviewComment?: string;
}

interface ApplicationReviewFormProps {
  initialValue?: ApplicationReviewFormValues | null;
  onCancel: () => void;
  onSubmit: (input: ApplicationReviewFormValues) => Promise<void>;
}

export function ApplicationReviewForm({
  initialValue,
  onCancel,
  onSubmit,
}: ApplicationReviewFormProps) {
  const { t } = useTranslation();
  const [status, setStatus] = useState(initialValue?.status ?? 'pending');
  const [reviewComment, setReviewComment] = useState(initialValue?.reviewComment ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await onSubmit({
        status: status || undefined,
        reviewComment: reviewComment || undefined,
      });
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : t('admin.courses.form.saveError', 'Review could not be submitted'),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <CourseFormFrame error={error}>
      <CourseSelectField
        label={t('admin.courses.form.reviewStatus', 'Review Decision')}
        value={status}
        options={[
          { value: 'approved', label: t('admin.courses.form.approve', 'Approve') },
          { value: 'rejected', label: t('admin.courses.form.reject', 'Reject') },
          { value: 'pending', label: t('admin.courses.form.keepPending', 'Keep Pending') },
        ]}
        onChange={setStatus}
      />
      <CourseTextareaField
        label={t('admin.courses.form.reviewComment', 'Review Comment')}
        value={reviewComment}
        onChange={setReviewComment}
        placeholder={t('admin.courses.form.reviewCommentPlaceholder', 'Provide feedback or reason for this decision')}
        rows={4}
      />
      <CourseFormActions
        submitLabel={t('admin.courses.form.submitReview', 'Submit Review')}
        isSaving={isSaving}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      />
    </CourseFormFrame>
  );
}