import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CourseFormActions,
  CourseFormFrame,
  CourseSelectField,
  CourseTextField,
} from '../components/CourseFormControls';

export type CourseLessonFormMode = 'create' | 'edit';

export interface CourseLessonFormValues {
  sectionId?: string;
  lessonNo?: string;
  title?: string;
  sourceProvider?: string;
  sourceReference?: string;
  freePreview?: string;
  status?: string;
  description?: string;
}

interface CourseLessonFormProps {
  mode: CourseLessonFormMode;
  initialValue?: CourseLessonFormValues | null;
  onCancel: () => void;
  onSubmit: (input: CourseLessonFormValues) => Promise<void>;
}

export function CourseLessonForm({
  mode,
  initialValue,
  onCancel,
  onSubmit,
}: CourseLessonFormProps) {
  const { t } = useTranslation();
  const [sectionId, setSectionId] = useState(initialValue?.sectionId ?? '');
  const [lessonNo, setLessonNo] = useState(initialValue?.lessonNo ?? '');
  const [title, setTitle] = useState(initialValue?.title ?? '');
  const [sourceProvider, setSourceProvider] = useState(initialValue?.sourceProvider ?? '');
  const [sourceReference, setSourceReference] = useState(initialValue?.sourceReference ?? '');
  const [freePreview, setFreePreview] = useState(initialValue?.freePreview ?? 'false');
  const [status, setStatus] = useState(initialValue?.status ?? 'draft');
  const [description, setDescription] = useState(initialValue?.description ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await onSubmit({
        sectionId: sectionId || undefined,
        lessonNo: lessonNo || undefined,
        title: title || undefined,
        sourceProvider: sourceProvider || undefined,
        sourceReference: sourceReference || undefined,
        freePreview: freePreview || undefined,
        status: status || undefined,
        description: description || undefined,
      });
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : t('admin.courses.form.saveError', 'Lesson could not be saved'),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <CourseFormFrame error={error}>
      <CourseTextField
        label={t('admin.courses.form.sectionId', 'Section ID')}
        value={sectionId}
        onChange={setSectionId}
        placeholder="section-uuid"
        required
      />
      <CourseTextField
        label={t('admin.courses.form.lessonNo', 'Lesson No')}
        value={lessonNo}
        onChange={setLessonNo}
        placeholder="1"
      />
      <CourseTextField
        label={t('admin.courses.form.lessonTitle', 'Title')}
        value={title}
        onChange={setTitle}
        placeholder={t('admin.courses.form.lessonTitlePlaceholder', 'Lesson title')}
        required
      />
      <CourseTextField
        label={t('admin.courses.form.sourceProvider', 'Source Provider')}
        value={sourceProvider}
        onChange={setSourceProvider}
        placeholder="s3, aliyun, youtube"
      />
      <CourseTextField
        label={t('admin.courses.form.sourceReference', 'Source Reference')}
        value={sourceReference}
        onChange={setSourceReference}
        placeholder={t('admin.courses.form.sourceReferencePlaceholder', 'Video URL or object key')}
      />
      <CourseSelectField
        label={t('admin.courses.form.freePreview', 'Free Preview')}
        value={freePreview}
        options={[
          { value: 'true', label: t('admin.courses.form.yes', 'Yes') },
          { value: 'false', label: t('admin.courses.form.no', 'No') },
        ]}
        onChange={setFreePreview}
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
        placeholder={t('admin.courses.form.lessonDescriptionPlaceholder', 'Lesson description')}
      />
      <CourseFormActions
        submitLabel={
          mode === 'edit'
            ? t('admin.courses.form.updateLesson', 'Update Lesson')
            : t('admin.courses.form.createLesson', 'Create Lesson')
        }
        isSaving={isSaving}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      />
    </CourseFormFrame>
  );
}