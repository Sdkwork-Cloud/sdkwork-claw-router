import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CourseFormActions,
  CourseFormFrame,
  CourseSelectField,
  CourseTextField,
} from '../components/CourseFormControls';

export type CourseRelationFormMode = 'create' | 'edit';

export interface CourseRelationFormValues {
  relatedCourseId?: string;
  relationType?: string;
  sortOrder?: string;
  status?: string;
}

interface CourseRelationFormProps {
  mode: CourseRelationFormMode;
  initialValue?: CourseRelationFormValues | null;
  onCancel: () => void;
  onSubmit: (input: CourseRelationFormValues) => Promise<void>;
}

export function CourseRelationForm({
  mode,
  initialValue,
  onCancel,
  onSubmit,
}: CourseRelationFormProps) {
  const { t } = useTranslation();
  const [relatedCourseId, setRelatedCourseId] = useState(initialValue?.relatedCourseId ?? '');
  const [relationType, setRelationType] = useState(initialValue?.relationType ?? 'related');
  const [sortOrder, setSortOrder] = useState(initialValue?.sortOrder ?? '0');
  const [status, setStatus] = useState(initialValue?.status ?? 'active');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await onSubmit({
        relatedCourseId: relatedCourseId || undefined,
        relationType: relationType || undefined,
        sortOrder: sortOrder || undefined,
        status: status || undefined,
      });
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : t('admin.courses.form.saveError', 'Relation could not be saved'),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <CourseFormFrame error={error}>
      <CourseTextField
        label={t('admin.courses.form.relatedCourseId', 'Related Course ID')}
        value={relatedCourseId}
        onChange={setRelatedCourseId}
        placeholder="course-uuid"
        required
      />
      <CourseSelectField
        label={t('admin.courses.form.relationType', 'Relation Type')}
        value={relationType}
        options={[
          { value: 'related', label: t('admin.courses.form.relationTypeRelated', 'Related') },
          { value: 'prerequisite', label: t('admin.courses.form.relationTypePrerequisite', 'Prerequisite') },
          { value: 'next', label: t('admin.courses.form.relationTypeNext', 'Next Course') },
          { value: 'bundle', label: t('admin.courses.form.relationTypeBundle', 'Bundle') },
        ]}
        onChange={setRelationType}
      />
      <CourseTextField
        label={t('admin.courses.form.sortOrder', 'Sort Order')}
        value={sortOrder}
        onChange={setSortOrder}
        placeholder="0"
        type="number"
      />
      <CourseSelectField
        label={t('admin.courses.form.status', 'Status')}
        value={status}
        options={[
          { value: 'active' },
          { value: 'inactive' },
          { value: 'disabled' },
        ]}
        onChange={setStatus}
      />
      <CourseFormActions
        submitLabel={
          mode === 'edit'
            ? t('admin.courses.form.updateRelation', 'Update Relation')
            : t('admin.courses.form.createRelation', 'Create Relation')
        }
        isSaving={isSaving}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      />
    </CourseFormFrame>
  );
}