import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CourseFormActions,
  CourseFormFrame,
  CourseSelectField,
  CourseTextField,
} from '../components/CourseFormControls';

export type CourseFormMode = 'create' | 'edit';

export interface CourseFormValues {
  courseCode?: string;
  title?: string;
  category?: string;
  level?: string;
  status?: string;
  description?: string;
}

interface CourseFormProps {
  mode: CourseFormMode;
  initialValue?: CourseFormValues | null;
  onCancel: () => void;
  onSubmit: (input: CourseFormValues) => Promise<void>;
}

export function CourseForm({
  mode,
  initialValue,
  onCancel,
  onSubmit,
}: CourseFormProps) {
  const { t } = useTranslation();
  const [courseCode, setCourseCode] = useState(initialValue?.courseCode ?? '');
  const [title, setTitle] = useState(initialValue?.title ?? '');
  const [category, setCategory] = useState(initialValue?.category ?? '');
  const [level, setLevel] = useState(initialValue?.level ?? 'beginner');
  const [status, setStatus] = useState(initialValue?.status ?? 'draft');
  const [description, setDescription] = useState(initialValue?.description ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await onSubmit({
        courseCode: courseCode || undefined,
        title: title || undefined,
        category: category || undefined,
        level: level || undefined,
        status: status || undefined,
        description: description || undefined,
      });
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : t('admin.courses.form.saveError', 'Course could not be saved'),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <CourseFormFrame error={error}>
      <CourseTextField
        label={t('admin.courses.form.courseCode', 'Course Code')}
        value={courseCode}
        onChange={setCourseCode}
        placeholder="COURSE-001"
      />
      <CourseTextField
        label={t('admin.courses.form.title', 'Title')}
        value={title}
        onChange={setTitle}
        placeholder={t('admin.courses.form.titlePlaceholder', 'Course title')}
        required
      />
      <CourseTextField
        label={t('admin.courses.form.category', 'Category')}
        value={category}
        onChange={setCategory}
        placeholder={t('admin.courses.form.categoryPlaceholder', 'e.g. programming, design')}
      />
      <CourseSelectField
        label={t('admin.courses.form.level', 'Level')}
        value={level}
        options={[
          { value: 'beginner', label: t('admin.courses.form.levelBeginner', 'Beginner') },
          { value: 'intermediate', label: t('admin.courses.form.levelIntermediate', 'Intermediate') },
          { value: 'advanced', label: t('admin.courses.form.levelAdvanced', 'Advanced') },
        ]}
        onChange={setLevel}
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
        placeholder={t('admin.courses.form.descriptionPlaceholder', 'Brief course description')}
      />
      <CourseFormActions
        submitLabel={
          mode === 'edit'
            ? t('admin.courses.form.updateCourse', 'Update Course')
            : t('admin.courses.form.createCourse', 'Create Course')
        }
        isSaving={isSaving}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      />
    </CourseFormFrame>
  );
}