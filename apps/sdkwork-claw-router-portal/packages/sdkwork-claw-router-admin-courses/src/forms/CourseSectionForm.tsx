import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CourseFormActions,
  CourseFormFrame,
  CourseSelectField,
  CourseTextField,
} from '../components/CourseFormControls';

export type CourseSectionFormMode = 'create' | 'edit';

export interface CourseSectionFormValues {
  sectionNo?: string;
  title?: string;
  status?: string;
  description?: string;
}

interface CourseSectionFormProps {
  mode: CourseSectionFormMode;
  initialValue?: CourseSectionFormValues | null;
  onCancel: () => void;
  onSubmit: (input: CourseSectionFormValues) => Promise<void>;
}

export function CourseSectionForm({
  mode,
  initialValue,
  onCancel,
  onSubmit,
}: CourseSectionFormProps) {
  const { t } = useTranslation();
  const [sectionNo, setSectionNo] = useState(initialValue?.sectionNo ?? '');
  const [title, setTitle] = useState(initialValue?.title ?? '');
  const [status, setStatus] = useState(initialValue?.status ?? 'draft');
  const [description, setDescription] = useState(initialValue?.description ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await onSubmit({
        sectionNo: sectionNo || undefined,
        title: title || undefined,
        status: status || undefined,
        description: description || undefined,
      });
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : t('admin.courses.form.saveError', 'Section could not be saved'),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <CourseFormFrame error={error}>
      <CourseTextField
        label={t('admin.courses.form.sectionNo', 'Section No')}
        value={sectionNo}
        onChange={setSectionNo}
        placeholder="1"
      />
      <CourseTextField
        label={t('admin.courses.form.sectionTitle', 'Title')}
        value={title}
        onChange={setTitle}
        placeholder={t('admin.courses.form.sectionTitlePlaceholder', 'Section title')}
        required
      />
      <CourseSelectField
        label={t('admin.courses.form.status', 'Status')}
        value={status}
        options={[
          { value: 'draft', label: t('admin.courses.form.statusDraft', 'Draft') },
          { value: 'published', label: t('admin.courses.form.statusPublished', 'Published') },
          { value: 'archived', label: t('admin.courses.form.statusArchived', 'Archived') },
        ]}
        onChange={setStatus}
      />
      <CourseTextField
        label={t('admin.courses.form.description', 'Description')}
        value={description}
        onChange={setDescription}
        placeholder={t('admin.courses.form.sectionDescriptionPlaceholder', 'Section description')}
      />
      <CourseFormActions
        submitLabel={
          mode === 'edit'
            ? t('admin.courses.form.updateSection', 'Update Section')
            : t('admin.courses.form.createSection', 'Create Section')
        }
        isSaving={isSaving}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      />
    </CourseFormFrame>
  );
}