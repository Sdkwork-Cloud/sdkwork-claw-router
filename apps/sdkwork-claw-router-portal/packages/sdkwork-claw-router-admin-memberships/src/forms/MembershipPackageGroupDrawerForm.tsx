import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MembershipFormActions,
  MembershipFormFrame,
  MembershipSelectField,
  MembershipTextField,
} from '../components/MembershipFormControls';
import {
  formatMembershipFormValidationError,
  parseOptionalNonNegativeIntegerField,
  parseRequiredPositiveIntegerField,
} from './membershipFormValues';
import type {
  MembershipsAdminPackageGroup,
  MembershipsAdminPackageGroupMutationInput,
} from '../membershipsService';

interface MembershipPackageGroupDrawerFormProps {
  mode: 'create' | 'edit';
  initialValue?: MembershipsAdminPackageGroup | null;
  onCancel: () => void;
  onSubmit: (input: MembershipsAdminPackageGroupMutationInput) => Promise<void>;
}

export function MembershipPackageGroupDrawerForm({
  mode,
  initialValue,
  onCancel,
  onSubmit,
}: MembershipPackageGroupDrawerFormProps) {
  const { t } = useTranslation();
  const [code, setCode] = useState(initialValue?.code ?? '');
  const [name, setName] = useState(initialValue?.name ?? '');
  const [description, setDescription] = useState(initialValue?.description ?? '');
  const [billingCycle, setBillingCycle] = useState(initialValue?.billingCycle ?? 'month');
  const [durationDays, setDurationDays] = useState(String(initialValue?.durationDays ?? 30));
  const [sortWeight, setSortWeight] = useState(String(initialValue?.sortWeight ?? 0));
  const [status, setStatus] = useState<'active' | 'inactive' | 'disabled'>(
    initialValue?.status === 'inactive' || initialValue?.status === 'disabled'
      ? initialValue.status
      : 'active',
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await onSubmit({
        code,
        name,
        description,
        billingCycle,
        durationDays: parseRequiredPositiveIntegerField(durationDays, t('admin.commerce.memberships.groups.form.duration', 'Duration days')),
        sortWeight: parseOptionalNonNegativeIntegerField(sortWeight, t('admin.commerce.memberships.groups.form.sortWeight', 'Sort weight')),
        status,
      });
    } catch (saveError) {
      setError(formatMembershipFormValidationError(
        saveError,
        t,
        t('admin.commerce.memberships.groups.form.error', 'Package group could not be saved'),
      ));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MembershipFormFrame error={error}>
      <MembershipTextField label={t('admin.commerce.memberships.groups.form.code', 'Code')} value={code} onChange={setCode} placeholder="membership-month" />
      <MembershipTextField label={t('admin.commerce.memberships.groups.form.name', 'Group Name')} value={name} onChange={setName} placeholder={t('admin.commerce.memberships.groups.form.namePlaceholder', 'Monthly packages')} />
      <MembershipTextField label={t('admin.commerce.memberships.groups.form.description', 'Description')} value={description} onChange={setDescription} />
      <div className="grid grid-cols-2 gap-4">
        <MembershipTextField label={t('admin.commerce.memberships.groups.form.billingCycle', 'Billing cycle')} value={billingCycle} onChange={setBillingCycle} />
        <MembershipTextField label={t('admin.commerce.memberships.groups.form.duration', 'Duration days')} value={durationDays} onChange={setDurationDays} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <MembershipTextField label={t('admin.commerce.memberships.groups.form.sortWeight', 'Sort weight')} value={sortWeight} onChange={setSortWeight} />
        <MembershipSelectField
          label={t('admin.commerce.memberships.groups.form.status', 'Status')}
          value={status}
          options={[
            { value: 'active' },
            { value: 'inactive' },
            { value: 'disabled' },
          ]}
          onChange={(value) => setStatus(value as 'active' | 'inactive' | 'disabled')}
        />
      </div>
      <MembershipFormActions
        submitLabel={mode === 'edit'
          ? t('admin.commerce.memberships.groups.form.updateSubmit', 'Update Group')
          : t('admin.commerce.memberships.groups.form.submit', 'Create Group')}
        isSaving={isSaving}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      />
    </MembershipFormFrame>
  );
}
