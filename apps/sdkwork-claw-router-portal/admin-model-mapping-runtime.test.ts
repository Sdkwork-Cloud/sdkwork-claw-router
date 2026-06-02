import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const PORTAL_ROOT = import.meta.dirname;

function readPortalFile(relativePath: string): string {
  return readFileSync(resolve(PORTAL_ROOT, relativePath), 'utf8');
}

function sourceBetween(source: string, startToken: string, endToken: string): string {
  const start = source.indexOf(startToken);
  const end = source.indexOf(endToken, start + startToken.length);
  assert.notEqual(start, -1, `missing source start token: ${startToken}`);
  assert.notEqual(end, -1, `missing source end token: ${endToken}`);
  return source.slice(start, end);
}

test('admin model mapping service is backend SDK backed', () => {
  const modelService = readPortalFile('packages/sdkwork-claw-router-admin-model/src/modelService.ts');

  for (const token of [
    'export class ModelMappingService',
    'export interface ModelMappingRule',
    'export interface ModelMappingResolveResult',
    'getClawRouterBackendSdkClient().ai.modelMappings.list(',
    'getClawRouterBackendSdkClient().ai.modelMappings.create(',
    'getClawRouterBackendSdkClient().ai.modelMappings.update(',
    'getClawRouterBackendSdkClient().ai.modelMappings.delete(',
    'getClawRouterBackendSdkClient().ai.modelMappings.resolve.create(',
  ]) {
    assert.ok(modelService.includes(token), `missing model mapping service marker: ${token}`);
  }

  for (const forbidden of [
    'fetch(',
    'axios.',
    '/backend/v3/api/ai/model_mappings',
    'rawModelMapping',
  ]) {
    assert.equal(modelService.includes(forbidden), false, `unexpected forbidden model mapping token: ${forbidden}`);
  }
});

test('admin model mapping page exposes route, navigation, and core layout markers', () => {
  const appSource = readPortalFile('src/App.tsx');
  const registrySource = readPortalFile('src/adminModuleRegistry.ts');
  const modelAdminSource = readPortalFile('packages/sdkwork-claw-router-admin-model/src/index.tsx');
  const coreI18nSource = readPortalFile('packages/sdkwork-claw-router-i18n/src/resources/admin/core-navigation.ts');
  const modelI18nSource = readPortalFile('packages/sdkwork-claw-router-i18n/src/resources/admin/model.ts');

  assert.ok(appSource.includes('path="model/mappings"'), 'missing admin model mapping route');
  assert.ok(appSource.includes('ModelMappingAdmin'), 'missing ModelMappingAdmin route component');
  assert.ok(registrySource.includes('/admin/model/mappings'), 'missing admin registry mapping route');
  assert.ok(registrySource.includes('admin.menu.modelMappings'), 'missing admin registry mapping i18n key');
  assert.ok(coreI18nSource.includes('"admin.menu.modelMappings"'), 'missing core navigation i18n mapping key');

  for (const token of [
    'export function ModelMappingAdmin',
    'ModelMappingService.fetchMappings(',
    'ModelMappingService.createMapping(',
    'ModelMappingService.updateMapping(',
    'ModelMappingService.deleteMapping(',
    'admin.model.mapping.title',
    'admin.model.mapping.scope.global',
    'admin.model.mapping.scope.vendor',
    'admin.model.mapping.scope.channel',
  ]) {
    assert.ok(modelAdminSource.includes(token) || modelI18nSource.includes(`"${token}"`), `missing mapping UI marker: ${token}`);
  }
});

test('admin model mapping page is reduced to tabs search add and table without resolve preview chrome', () => {
  const modelAdminSource = readPortalFile('packages/sdkwork-claw-router-admin-model/src/index.tsx');
  const modelI18nSource = readPortalFile('packages/sdkwork-claw-router-i18n/src/resources/admin/model.ts');

  for (const token of [
    'admin.model.mapping.scope.global',
    'admin.model.mapping.scope.vendor',
    'admin.model.mapping.scope.channel',
    'admin.model.mapping.scope.all',
    'admin.model.mapping.search.placeholder',
    'admin.model.mapping.actions.add',
  ]) {
    assert.ok(modelAdminSource.includes(token) || modelI18nSource.includes(`"${token}"`), `missing minimal mapping chrome marker: ${token}`);
  }

  for (const forbidden of [
    'admin.model.mapping.priorityHint',
    'admin.model.mapping.actions.resolve',
    'admin.model.mapping.resolve.title',
    'admin.model.mapping.resolve.unmatched',
    'handleResolveMapping',
    'resolveResult',
    'resolving',
    'ToggleLeft',
    'ToggleRight',
    'xl:grid-cols-[minmax(0,1fr)_420px]',
  ]) {
    assert.equal(modelAdminSource.includes(forbidden), false, `unexpected legacy mapping chrome token: ${forbidden}`);
    assert.equal(modelI18nSource.includes(forbidden), false, `unexpected legacy mapping i18n token: ${forbidden}`);
  }
});

test('admin model mapping modal uses multi-row editable model mapping table', () => {
  const modelAdminSource = readPortalFile('packages/sdkwork-claw-router-admin-model/src/index.tsx');
  const modelI18nSource = readPortalFile('packages/sdkwork-claw-router-i18n/src/resources/admin/model.ts');
  const modalSource = sourceBetween(modelAdminSource, 'function ModelMappingFormModal', 'function ModelMappingRowsTable');
  const rowsTableSource = sourceBetween(modelAdminSource, 'function ModelMappingRowsTable', 'function ModelComboboxCell');
  const comboboxSource = sourceBetween(modelAdminSource, 'function ModelComboboxCell', 'function VendorPickerModal');
  const mappingInputSource = sourceBetween(modelAdminSource, 'function modelMappingInputsFromForm', 'function readMappingScopeType');

  for (const token of [
    'function ModelMappingFormModal',
    'function ModelMappingRowsTable',
    'function ModelComboboxCell',
    'function VendorPickerModal',
    'function modelMappingInputsFromForm',
    'type ModelMappingRowDraft',
    'createMappingRowDraft(',
    'rowsJson',
    'mappingRows',
    'sourceVendorCode',
    'targetVendorCode',
    'sourceModel',
    'targetModel',
    'channelCode',
    'activeVendorPicker',
    'sourceVendor',
    'targetVendor',
    "setMappingRows((current) => syncRowsForVendor(current, 'sourceModel', vendor.vendorCode, models))",
    "setMappingRows((current) => syncRowsForVendor(current, 'targetModel', vendor.vendorCode, models))",
    'admin.model.mapping.form.sourceVendor',
    'admin.model.mapping.form.targetVendor',
    'admin.model.mapping.form.vendorPicker.searchPlaceholder',
    'admin.model.mapping.form.modelPicker.searchPlaceholder',
    'admin.model.mapping.form.modelInputPlaceholder',
    'admin.model.mapping.form.mappingRowsTitle',
    'admin.model.mapping.form.addRow',
    'admin.model.mapping.form.removeRow',
  ]) {
    assert.ok(modelAdminSource.includes(token) || modelI18nSource.includes(`"${token}"`), `missing modal interaction marker: ${token}`);
  }

  assert.ok(rowsTableSource.includes('admin.model.mapping.form.sourceModel'), 'mapping rows table should show source model header');
  assert.ok(rowsTableSource.includes('admin.model.mapping.form.targetModel'), 'mapping rows table should show target model header');
  assert.ok(rowsTableSource.includes('<ModelComboboxCell'), 'mapping rows table should render editable combobox cells');
  assert.ok(comboboxSource.includes('onChange(event.target.value)'), 'model combobox should allow direct manual input');
  assert.ok(comboboxSource.includes('filteredModels.map((model)'), 'model combobox should keep searchable catalog options');
  assert.ok(modalSource.includes('h-[90vh]'), 'mapping modal should use 90% viewport height');
  assert.ok(modalSource.includes('max-w-[84rem]'), 'mapping modal should be 50% wider than max-w-4xl');
  assert.ok(mappingInputSource.includes('const rows = readMappingRowsFromForm(formData, errors)'), 'form payload should be built from row JSON with validation metadata');
  assert.ok(mappingInputSource.includes('rows.map((row) =>'), 'form payload should produce multiple mapping inputs');
  assert.ok(modalSource.includes('{!mapping && ('), 'edit mode must not show add-row because editing must update one mapping only');
  assert.ok(modelAdminSource.includes('editorError'), 'mapping editor should keep modal-local validation errors');
  assert.ok(modelAdminSource.includes('type ModelMappingFormErrors'), 'mapping editor should use structured form errors');
  assert.ok(modelAdminSource.includes('class ModelMappingFormValidationError'), 'form validation should preserve field-level error metadata');
  assert.ok(modalSource.includes('error?.message'), 'mapping modal should render a validation summary inside the dialog');
  assert.ok(modalSource.includes('fieldErrors.sourceVendorCode'), 'source vendor field should render its own validation error');
  assert.ok(modalSource.includes('fieldErrors.targetVendorCode'), 'target vendor field should render its own validation error');
  assert.ok(modalSource.includes('fieldErrors.channelCode'), 'channel code field should render its own validation error');
  assert.ok(rowsTableSource.includes('fieldErrors.mappingRows'), 'mapping rows table should render table-level validation errors');
  assert.ok(rowsTableSource.includes('data-model-mapping-error-key=\"mappingRows\"'), 'mapping rows table errors should be scroll targets');
  assert.ok(rowsTableSource.includes('rowErrors[row.id]?.sourceModel'), 'source model cell should render row-level validation error');
  assert.ok(rowsTableSource.includes('rowErrors[row.id]?.targetModel'), 'target model cell should render row-level validation error');
  assert.ok(comboboxSource.includes('errorMessage'), 'model combobox should receive and render cell-level error text');
  assert.ok(comboboxSource.includes('aria-invalid'), 'model combobox should expose invalid state for accessibility');
  assert.ok(modalSource.includes('firstErrorKey'), 'mapping modal should track the first invalid form control');
  assert.ok(modalSource.includes('scrollIntoView'), 'mapping modal should scroll to the first invalid form control');
  assert.ok(mappingInputSource.includes("readRequiredFormString(formData, 'sourceVendorCode'"), 'form should require source vendor');
  assert.ok(mappingInputSource.includes("readRequiredFormString(formData, 'targetVendorCode'"), 'form should require target vendor');
  assert.ok(mappingInputSource.includes('Account pool code is required'), 'channel scope should require account pool code');
  assert.ok(mappingInputSource.includes('Source model is required'), 'each row should require source model');
  assert.ok(mappingInputSource.includes('Target model is required'), 'each row should require target model');
  assert.ok(modelAdminSource.includes('MODEL_MAPPING_MAX_ROWS'), 'form parsing should cap submitted mapping rows');
  assert.ok(modelAdminSource.includes('MODEL_MAPPING_MODEL_VALUE_MAX_LENGTH'), 'form parsing should cap model value length');
  assert.ok(mappingInputSource.includes('validateModelMappingModelValue'), 'form parsing should validate model value length');
  assert.ok(mappingInputSource.includes('validateUniqueModelMappingRows(rows, errors)'), 'form parsing should reject duplicate source model rows');
  assert.ok(mappingInputSource.includes('Duplicate source model mapping is not allowed'), 'duplicate source model rows should have an explicit error');

  for (const legacyFormToken of [
    'ModelMappingSaveState',
    'SearchableModelDropdown',
    'activeModelPicker',
    'savingState',
    'saveFailed',
    'saveFailedRowPrefix',
    'priority',
    'effectiveFrom',
    'effectiveTo',
    'description',
    'targetProviderModel',
    'targetProviderNativeModel',
    'singleMappingTitle',
    'singleMappingHint',
    'pickMode',
    'manualInputMode',
    'switchToPick',
    'switchToManual',
  ]) {
    assert.equal(modalSource.includes(legacyFormToken), false, `unexpected legacy token in mapping modal: ${legacyFormToken}`);
    assert.equal(rowsTableSource.includes(legacyFormToken), false, `unexpected legacy token in mapping rows table: ${legacyFormToken}`);
    assert.equal(mappingInputSource.includes(legacyFormToken), false, `unexpected legacy token in mapping payload builder: ${legacyFormToken}`);
    assert.equal(modelI18nSource.includes(`admin.model.mapping.form.${legacyFormToken}`), false, `unexpected legacy mapping i18n token: ${legacyFormToken}`);
  }
});

test('admin model mapping edit save updates existing rule without creating records', () => {
  const modelAdminSource = readPortalFile('packages/sdkwork-claw-router-admin-model/src/index.tsx');
  const saveSource = sourceBetween(modelAdminSource, 'const handleSaveMapping', 'const handleDeleteMapping');
  const editBranchSource = sourceBetween(saveSource, 'if (editingMapping) {', '} else {');

  assert.ok(editBranchSource.includes('ModelMappingService.updateMapping(editingMapping.id'), 'edit save must update the selected mapping id');
  assert.equal(editBranchSource.includes('ModelMappingService.createMapping'), false, 'edit save must never create mapping records');
  assert.equal(editBranchSource.includes('extraInputs'), false, 'edit save must not split or persist extra rows');
  assert.ok(saveSource.includes('inputs.map((input) => ModelMappingService.createMapping(input))'), 'create mode should still support multi-row creation');
});
