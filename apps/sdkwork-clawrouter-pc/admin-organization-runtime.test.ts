import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import { ADMIN_MODULES, getAdminModuleMenu } from "./src/adminModuleRegistry.ts";

const portalRoot = new URL("./", import.meta.url);

function source(path: string): string {
  return readFileSync(new URL(path, portalRoot), "utf8");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("admin organization is registered under home user management", () => {
  const homeModule = ADMIN_MODULES.find((module) => module.id === "home");
  assert.ok(homeModule, "home admin module must exist");
  assert.ok(
    homeModule.pathPrefixes.includes("/admin/organization"),
    "home admin module must own /admin/organization",
  );

  const homeMenu = getAdminModuleMenu("home");
  const userManagementGroup = homeMenu.groups.find(
    (group) => group.groupKey === "admin.menu.home.userManagement",
  );
  assert.ok(userManagementGroup, "user management group must exist");

  const organizationItem = userManagementGroup.items.find(
    (item) => item.path === "/admin/organization",
  );
  assert.ok(organizationItem, "organization menu item must exist under user management");
  assert.equal(organizationItem.labelKey, "admin.menu.organization");

  const userItemIndex = userManagementGroup.items.findIndex((item) => item.path === "/admin/user");
  const organizationItemIndex = userManagementGroup.items.findIndex(
    (item) => item.path === "/admin/organization",
  );
  assert.equal(organizationItemIndex, userItemIndex + 1, "organization must be placed below users");
});

test("admin organization route and package are wired into the portal", () => {
  const appSource = source("src/App.tsx");
  const packageJson = JSON.parse(source("package.json")) as {
    dependencies?: Record<string, string>;
    workspaces?: string[];
  };
  const typecheckSource = source("tsconfig.typecheck.json");

  assert.match(appSource, /import\('sdkwork-clawrouter-pc-admin-organization'\)/);
  assert.match(appSource, /const OrganizationAdmin = lazyRoute/);
  assert.match(appSource, /<Route path="organization" element={<OrganizationAdmin \/>} \/>/);
  assert.equal(
    packageJson.dependencies?.["sdkwork-clawrouter-pc-admin-organization"],
    "workspace:*",
  );
  assert.ok(
    packageJson.workspaces?.includes("../../../sdkwork-appbase/sdks/sdkwork-appbase-backend-sdk/*-typescript/generated/server-openapi"),
    "portal workspace must include the sibling appbase backend SDK package path",
  );
  assert.match(
    typecheckSource,
    /\.\.\/\.\.\/\.\.\/sdkwork-appbase\/sdks\/sdkwork-appbase-backend-sdk\/sdkwork-appbase-backend-sdk-typescript\/generated\/server-openapi\/src\/index\.ts/,
  );
  assert.ok(
    existsSync(new URL("packages/sdkwork-clawrouter-pc-admin-organization/package.json", portalRoot)),
    "admin organization package must exist",
  );
});

test("admin organization navigation has translated labels", () => {
  const i18nSource = source("packages/sdkwork-clawrouter-pc-i18n/src/resources/admin/core-navigation.ts");

  assert.match(i18nSource, /"admin\.menu\.organization": "Organization"/);
  assert.match(i18nSource, /"admin\.menu\.organization": "组织机构"/);
});

test("admin organization page translations are registered", () => {
  const resourceIndex = source("packages/sdkwork-clawrouter-pc-i18n/src/resources/index.ts");
  const organizationMessages = source("packages/sdkwork-clawrouter-pc-i18n/src/resources/admin/organization.ts");

  assert.match(resourceIndex, /adminOrganizationMessages/);
  assert.match(organizationMessages, /"admin\.organization\.title": "Organization"/);
  assert.match(organizationMessages, /"admin\.organization\.title": "组织机构"/);
  assert.match(organizationMessages, /"admin\.organization\.actions\.revoke": "撤销"/);
});

test("admin organization service uses only the appbase backend sdk boundary", () => {
  const service = source("packages/sdkwork-clawrouter-pc-admin-organization/src/organizationService.ts");
  const packageJson = JSON.parse(
    source("packages/sdkwork-clawrouter-pc-commons/package.json"),
  ) as { dependencies?: Record<string, string> };
  const sdkBoundary = source("packages/sdkwork-clawrouter-pc-commons/src/sdk-clients.ts");

  assert.equal(packageJson.dependencies?.["@sdkwork/appbase-backend-sdk"], "workspace:*");
  assert.match(sdkBoundary, /@sdkwork\/appbase-backend-sdk/);
  assert.match(sdkBoundary, /getSdkworkAppbaseBackendSdkClient/);
  assert.match(service, /getSdkworkAppbaseBackendSdkClient/);
  assert.doesNotMatch(service, /getClawRouterAppSdkClient/);
  assert.doesNotMatch(service, /@sdkwork\/appbase-app-sdk/);
  assert.doesNotMatch(service, /iamDirectoryApiOperations/);
  assert.doesNotMatch(service, /\bfetch\s*\(/);
  assert.doesNotMatch(service, /\baxios\b/);
  assert.doesNotMatch(service, /\.http\b/);

  for (const token of [
    "iam.users.list",
    "iam.organizations.list",
    "iam.organizations.tree.retrieve",
    "iam.organizations.create",
    "iam.organizations.update",
    "iam.organizations.delete",
    "iam.organizationMemberships.list",
    "iam.organizationMemberships.create",
    "iam.organizationMemberships.update",
    "iam.departments.list",
    "iam.departments.tree.retrieve",
    "iam.departments.create",
    "iam.departments.update",
    "iam.departments.delete",
    "iam.departmentAssignments.list",
    "iam.departmentAssignments.create",
    "iam.departmentAssignments.update",
    "iam.positions.list",
    "iam.positions.create",
    "iam.positions.update",
    "iam.positions.delete",
    "iam.positionAssignments.list",
    "iam.positionAssignments.create",
    "iam.positionAssignments.update",
    "iam.roleBindings.list",
    "iam.roleBindings.create",
    "iam.roleBindings.delete",
    "iam.roles.list",
    "iam.roles.permissions.list",
    "iam.roles.permissions.create",
    "iam.roles.permissions.delete",
    "iam.permissions.list",
  ]) {
    assert.match(service, new RegExp(escapeRegExp(token)), `missing SDK call marker: ${token}`);
  }
});

test("admin organization UI exposes department, position and authorization admin workflows", () => {
  const sourceCode = source("packages/sdkwork-clawrouter-pc-admin-organization/src/index.tsx");

  assert.match(sourceCode, /function TreeNodeButton\([\s\S]*onDelete[\s\S]*onEdit/);
  assert.match(sourceCode, /const organization = directory\.organizations\.find\(\(item\) => item\.id === node\.id\)/);
  assert.match(sourceCode, /const department = directory\.departments\.find\(\(item\) => item\.id === node\.id\)/);
  assert.match(sourceCode, /\{ kind: 'positionAssignment'; mode: 'edit'; target: PositionAssignmentRecord \}/);
  assert.match(sourceCode, /OrganizationService\.updatePositionAssignment/);
  assert.match(sourceCode, /onEditAssignment=\{\(target\) => setDialog\(\{ kind: 'positionAssignment', mode: 'edit', target \}\)\}/);
  assert.match(sourceCode, /OrganizationService\.grantRolePermission/);
  assert.match(sourceCode, /OrganizationService\.revokeRolePermission/);
  assert.match(sourceCode, /admin\.organization\.actions\.revoke/);
});

test("admin organization member dialog selects users from the appbase user directory", () => {
  const sourceCode = source("packages/sdkwork-clawrouter-pc-admin-organization/src/index.tsx");
  const service = source("packages/sdkwork-clawrouter-pc-admin-organization/src/organizationService.ts");

  assert.match(service, /export interface UserRecord/);
  assert.match(service, /users: UserRecord\[];/);
  assert.match(service, /const usersResult = await client\.iam\.users\.list\(listParams\);/);
  assert.match(service, /users: readRequiredApiItems\(usersResult, 'admin\.organization\.errors\.loadUsers'\)[\s\S]*\.map\(normalizeUser\)/);
  assert.match(service, /function normalizeUser\(value: unknown\): UserRecord/);
  assert.match(sourceCode, /users: \[],/);
  assert.match(sourceCode, /usersById: Map<string, UserRecord>;/);
  assert.match(sourceCode, /function formatUserLabel\(userId: string \| null \| undefined, lookups: DirectoryLookups\): string/);
  assert.match(sourceCode, /function availableDirectoryUserOptions\(/);
  assert.match(
    sourceCode,
    /SelectField key=\{`membership-user-\$\{membershipOrganizationId\}`\} label=\{t\('admin\.organization\.fields\.userId', 'User'\)\} name="userId" required defaultValue=\{target\?\.userId\} options=\{availableDirectoryUserOptions\(directory\.users, membersForMembershipOrganization, lookups, membershipOrganizationId, target\?\.userId\)\}/,
  );
  assert.doesNotMatch(
    sourceCode,
    /TextField label=\{t\('admin\.organization\.fields\.userId'/,
    "member creation should select from appbase users instead of typing raw user IDs",
  );
});

test("admin organization UI deactivates members and assignment lifecycle records", () => {
  const sourceCode = source("packages/sdkwork-clawrouter-pc-admin-organization/src/index.tsx");
  const service = source("packages/sdkwork-clawrouter-pc-admin-organization/src/organizationService.ts");

  assert.match(sourceCode, /\| \(\{ kind: 'membership' \} & ConfirmTargetBase\)/);
  assert.match(sourceCode, /\| \(\{ kind: 'departmentAssignment' \} & ConfirmTargetBase\)/);
  assert.match(sourceCode, /\| \(\{ kind: 'positionAssignment' \} & ConfirmTargetBase\)/);
  assert.match(sourceCode, /onDeactivateMember=\{\(target\) => setConfirmTarget\(\{ kind: 'membership', id: target\.id, label: formatMemberLabel\(target\.id, target\.userId, lookups\) \}\)\}/);
  assert.match(sourceCode, /onDeactivateAssignment=\{\(target\) => setConfirmTarget\(\{ kind: 'departmentAssignment', id: target\.id, label: formatMemberLabel\(target\.membershipId, target\.userId, lookups\) \}\)\}/);
  assert.match(sourceCode, /onDeactivateAssignment=\{\(target\) => setConfirmTarget\(\{ kind: 'positionAssignment', id: target\.id, label: formatPositionLabel\(target\.positionId, lookups\) \}\)\}/);
  assert.match(sourceCode, /OrganizationService\.deactivateMembership\(target\.id\)/);
  assert.match(sourceCode, /OrganizationService\.deactivateDepartmentAssignment\(target\.id\)/);
  assert.match(sourceCode, /OrganizationService\.deactivatePositionAssignment\(target\.id\)/);
  assert.match(sourceCode, /admin\.organization\.actions\.deactivate/);
  assert.match(service, /static async deactivateMembership\(membershipId: string\)/);
  assert.match(service, /static async deactivateDepartmentAssignment\(assignmentId: string\)/);
  assert.match(service, /static async deactivatePositionAssignment\(assignmentId: string\)/);
  assert.match(service, /OrganizationService\.updateMembership\(membershipId, \{ status: 'inactive' \}\)/);
  assert.match(service, /OrganizationService\.updateDepartmentAssignment\(assignmentId, \{ status: 'inactive' \}\)/);
  assert.match(service, /OrganizationService\.updatePositionAssignment\(assignmentId, \{ status: 'inactive' \}\)/);
  assert.doesNotMatch(service, /organizationMemberships\.delete/);
  assert.doesNotMatch(service, /departmentAssignments\.delete/);
  assert.doesNotMatch(service, /positionAssignments\.delete/);
});

test("admin organization position assignment form submits full lifecycle dates", () => {
  const sourceCode = source("packages/sdkwork-clawrouter-pc-admin-organization/src/index.tsx");

  assert.match(sourceCode, /<TextField label=\{t\('admin\.organization\.fields\.startedAt', 'Started at'\)\} name="startedAt"/);
  assert.match(sourceCode, /<TextField label=\{t\('admin\.organization\.fields\.endedAt', 'Ended at'\)\} name="endedAt"/);
  assert.match(
    sourceCode,
    /function readPositionAssignmentCommand\(form: FormData\): PositionAssignmentCommand \{[\s\S]*startedAt: optionalFormText\(form, 'startedAt'\),[\s\S]*endedAt: optionalFormText\(form, 'endedAt'\),[\s\S]*\}/,
  );
});

test("admin organization UI resolves relationship names and scopes context choices", () => {
  const sourceCode = source("packages/sdkwork-clawrouter-pc-admin-organization/src/index.tsx");

  assert.match(sourceCode, /const lookups = useMemo\(\(\) => buildDirectoryLookups\(directory\), \[directory\]\);/);
  assert.match(sourceCode, /const departmentsForActiveOrganization = useMemo\(/);
  assert.match(sourceCode, /const membersForActiveOrganization = useMemo\(/);
  assert.match(sourceCode, /const positionsForActiveContext = useMemo\(/);
  assert.match(sourceCode, /function buildDirectoryLookups\(/);
  assert.match(sourceCode, /function formatMemberLabel\(/);
  assert.match(sourceCode, /function formatDepartmentLabel\(/);
  assert.match(sourceCode, /function formatPositionLabel\(/);
  assert.match(sourceCode, /function formatRoleLabel\(/);
  assert.match(sourceCode, /lookups=\{lookups\}/);
  assert.match(sourceCode, /membersForActiveOrganization\.filter\(\(item\) =>/);
  assert.match(sourceCode, /activeMembersForActiveOrganization=\{activeMembersForActiveOrganization\}/);
  assert.match(sourceCode, /const membershipIdsForDepartment = useMemo\(/);
  assert.match(sourceCode, /const userIdsForDepartment = useMemo\(/);
  assert.match(sourceCode, /const positionsForActiveContext = useMemo\(/);
  assert.match(sourceCode, /activePositionsForActiveContext=\{activePositionsForActiveContext\}/);
  assert.match(sourceCode, /formatMemberLabel\(assignment\.membershipId, assignment\.userId, lookups\)/);
  assert.match(sourceCode, /formatDepartmentLabel\(assignment\.departmentId, lookups\)/);
  assert.match(sourceCode, /formatPositionLabel\(assignment\.positionId, lookups\)/);
  assert.match(sourceCode, /formatRoleLabel\(binding\.roleId, lookups\)/);
  assert.doesNotMatch(sourceCode, />\{assignment\.userId \|\| assignment\.membershipId\}</);
  assert.doesNotMatch(sourceCode, />\{assignment\.departmentId\}</);
  assert.doesNotMatch(sourceCode, />\{position\.departmentId \|\| '-'\}</);
  assert.doesNotMatch(sourceCode, />\{assignment\.positionId\}</);
  assert.doesNotMatch(sourceCode, />\{binding\.roleId\}</);
});

test("admin organization UI searches relationship labels instead of only raw ids", () => {
  const sourceCode = source("packages/sdkwork-clawrouter-pc-admin-organization/src/index.tsx");

  assert.match(sourceCode, /const visibleDepartmentAssignments = filterBySearchWithLabels\(/);
  assert.match(sourceCode, /const visiblePositionAssignments = filterBySearchWithLabels\(/);
  assert.match(sourceCode, /const visibleRoleBindings = filterBySearchWithLabels\(/);
  assert.match(sourceCode, /assignments=\{visibleDepartmentAssignments\}/);
  assert.match(sourceCode, /assignments=\{visiblePositionAssignments\}/);
  assert.match(sourceCode, /function filterBySearchWithLabels<T>\(/);
  assert.match(sourceCode, /formatMemberLabel\(item\.membershipId, item\.userId, lookups\)/);
  assert.match(sourceCode, /formatPositionLabel\(item\.positionId, lookups\)/);
  assert.match(sourceCode, /formatPrincipalLabel\(item\.principalKind, item\.principalId, lookups\)/);
  assert.match(sourceCode, /formatRoleBindingScopeLabel\(item, lookups\)/);
  assert.doesNotMatch(sourceCode, /bindings=\{visibleRoleBindings\}[\s\S]*label: target\.principalId/);
});

test("admin organization owner and manager fields are selected from members", () => {
  const sourceCode = source("packages/sdkwork-clawrouter-pc-admin-organization/src/index.tsx");

  assert.match(sourceCode, /function userOptions\(/);
  assert.match(sourceCode, /function membersForOrganization\(/);
  assert.match(sourceCode, /const ownerMembers = membersForOrganization\(/);
  assert.match(sourceCode, /const membersForDepartmentOrganization = membersForOrganization\(/);
  assert.match(
    sourceCode,
    /SelectField label=\{t\('admin\.organization\.fields\.ownerUserId', 'Owner'\)\} name="ownerUserId"[\s\S]*userOptions\(ownerMembers, lookups, target\?\.ownerUserId\)/,
  );
  assert.doesNotMatch(
    sourceCode,
    /SelectField label=\{t\('admin\.organization\.fields\.managerUserId', 'Manager'\)\} name="managerUserId"[\s\S]*userOptions\(managerMembers, lookups, target\?\.managerUserId\)/,
    "department manager options should follow the currently selected organization",
  );
  assert.match(
    sourceCode,
    /SelectField key=\{`department-manager-\$\{departmentOrganizationId\}`\} label=\{t\('admin\.organization\.fields\.managerUserId', 'Manager'\)\} name="managerUserId"[\s\S]*userOptions\(membersForDepartmentOrganization, lookups, target\?\.managerUserId\)/,
  );
  assert.doesNotMatch(
    sourceCode,
    /TextField label=\{t\('admin\.organization\.fields\.ownerUserId'/,
    "organization owner should be selected from known members",
  );
  assert.doesNotMatch(
    sourceCode,
    /TextField label=\{t\('admin\.organization\.fields\.managerUserId'/,
    "department manager should be selected from known members",
  );
});

test("admin organization forms recompute organization-scoped options when organization changes", () => {
  const sourceCode = source("packages/sdkwork-clawrouter-pc-admin-organization/src/index.tsx");

  assert.match(sourceCode, /const \[membershipOrganizationId, setMembershipOrganizationId\] = useState\(/);
  assert.match(sourceCode, /const \[departmentOrganizationId, setDepartmentOrganizationId\] = useState\(/);
  assert.match(sourceCode, /const \[positionOrganizationId, setPositionOrganizationId\] = useState\(/);
  assert.match(sourceCode, /const membersForMembershipOrganization = membersForOrganization\(activeMemberships, membershipOrganizationId\);/);
  assert.match(sourceCode, /const membersForDepartmentOrganization = membersForOrganization\(activeMemberships, departmentOrganizationId\);/);
  assert.match(sourceCode, /const departmentsForDepartmentOrganization = departmentsForOrganization\(activeDepartments, departmentOrganizationId\);/);
  assert.match(sourceCode, /const departmentsForPositionOrganization = departmentsForOrganization\(activeDepartments, positionOrganizationId\);/);
  assert.match(sourceCode, /function departmentsForOrganization\(departments: DepartmentRecord\[], organizationId: string \| null \| undefined\): DepartmentRecord\[]/);
  assert.match(
    sourceCode,
    /SelectField label=\{t\('admin\.organization\.fields\.organization', 'Organization'\)\} name="organizationId" required defaultValue=\{target\?\.organizationId \|\| activeOrganizationIdForRelations\} options=\{organizationOptions\(activeOrganizations, lookups, target\?\.organizationId \|\| activeOrganizationIdForRelations\)\} onChange=\{setMembershipOrganizationId\}/,
  );
  assert.match(
    sourceCode,
    /availableDirectoryUserOptions\(directory\.users, membersForMembershipOrganization, lookups, membershipOrganizationId, target\?\.userId\)/,
  );
  assert.match(
    sourceCode,
    /SelectField label=\{t\('admin\.organization\.fields\.organization', 'Organization'\)\} name="organizationId" required defaultValue=\{target\?\.organizationId \|\| activeOrganizationIdForRelations\} options=\{organizationOptions\(activeOrganizations, lookups, target\?\.organizationId \|\| activeOrganizationIdForRelations\)\} onChange=\{setDepartmentOrganizationId\}/,
  );
  assert.match(
    sourceCode,
    /userOptions\(membersForDepartmentOrganization, lookups, target\?\.managerUserId\)/,
  );
  assert.match(
    sourceCode,
    /departmentParentOptions\(departmentsForDepartmentOrganization, target\?\.id, lookups, t\)/,
  );
  assert.doesNotMatch(
    sourceCode,
    /departmentParentOptions\(departmentsForActiveOrganization, target\?\.id, lookups, t\)/,
    "department parent options should follow the organization selected in the department form",
  );
  assert.match(
    sourceCode,
    /SelectField label=\{t\('admin\.organization\.fields\.organization', 'Organization'\)\} name="organizationId" required defaultValue=\{target\?\.organizationId \|\| activeOrganizationIdForRelations\} options=\{organizationOptions\(activeOrganizations, lookups, target\?\.organizationId \|\| activeOrganizationIdForRelations\)\} onChange=\{setPositionOrganizationId\}/,
  );
  assert.match(
    sourceCode,
    /departmentOptions\(departmentsForPositionOrganization, lookups, target\?\.departmentId\)/,
  );
  assert.match(
    sourceCode,
    /key=\{`membership-user-\$\{membershipOrganizationId\}`\}/,
  );
  assert.match(
    sourceCode,
    /key=\{`department-manager-\$\{departmentOrganizationId\}`\}/,
  );
  assert.match(
    sourceCode,
    /key=\{`department-parent-\$\{departmentOrganizationId\}`\}/,
  );
  assert.match(
    sourceCode,
    /key=\{`position-department-\$\{positionOrganizationId\}`\}/,
  );
  assert.match(
    sourceCode,
    /key=\{`department-assignment-member-\$\{departmentAssignmentDepartmentId\}`\}/,
  );
  assert.match(
    sourceCode,
    /key=\{`position-assignment-member-\$\{positionAssignmentPositionId\}`\}/,
  );
});

test("admin organization assignment pickers stay inside active organization context", () => {
  const sourceCode = source("packages/sdkwork-clawrouter-pc-admin-organization/src/index.tsx");

  assert.match(sourceCode, /const activeMembersForActiveOrganization = useMemo\(/);
  assert.match(sourceCode, /const activeDepartmentAssignmentsForContext = useMemo\(/);
  assert.match(sourceCode, /const activeDepartmentsForActiveOrganization = useMemo\(/);
  assert.match(sourceCode, /const organizationsForActiveContext = useMemo\(/);
  assert.match(sourceCode, /function isActiveRecord\(record: \{ status\?: string \}\): boolean/);
  assert.match(sourceCode, /membersForActiveOrganization\.filter\(isActiveRecord\)/);
  assert.match(sourceCode, /departmentsForActiveOrganization\.filter\(isActiveRecord\)/);
  assert.match(sourceCode, /directory\.organizations\.filter\(isActiveRecord\)/);
  assert.match(sourceCode, /departmentAssignments\.filter\(isActiveRecord\)/);
  assert.match(sourceCode, /activeDepartmentsForActiveOrganization=\{activeDepartmentsForActiveOrganization\}/);
  assert.match(sourceCode, /organizationsForActiveContext=\{organizationsForActiveContext\}/);
  assert.match(sourceCode, /const activeMemberships = directory\.memberships\.filter\(isActiveRecord\);/);
  assert.match(sourceCode, /const activeDepartments = directory\.departments\.filter\(isActiveRecord\);/);
  assert.match(sourceCode, /const membersForSelectedPosition = membersForPositionAssignment\(activeMemberships, directory\.departmentAssignments, directory\.positions, positionAssignmentPositionId, activeOrganizationIdForRelations\);/);
  assert.match(
    sourceCode,
    /function membersForPositionAssignment\([\s\S]*members: OrganizationMemberRecord\[],[\s\S]*departmentAssignments: DepartmentAssignmentRecord\[],[\s\S]*positions: PositionRecord\[],[\s\S]*positionId: string \| null \| undefined,[\s\S]*fallbackOrganizationId: string \| null \| undefined,[\s\S]*\): OrganizationMemberRecord\[]/,
  );
  assert.match(sourceCode, /const position = positionId \? positions\.find\(\(item\) => item\.id === positionId\) : undefined;/);
  assert.match(sourceCode, /item\.departmentId === position\.departmentId && isActiveRecord\(item\)/);
  assert.match(
    sourceCode,
    /SelectField key=\{`position-assignment-member-\$\{positionAssignmentPositionId\}`\} label=\{t\('admin\.organization\.fields\.member', 'Member'\)\} name="membershipId" required defaultValue=\{target\?\.membershipId \?\? ''\} options=\{availablePositionAssignmentMemberOptions\(membersForSelectedPosition, directory\.positionAssignments, positionAssignmentPositionId, lookups, target\?\.membershipId, target\?\.userId\)\}/,
  );
  assert.match(
    sourceCode,
    /SelectField label=\{t\('admin\.organization\.fields\.department', 'Department'\)\} name="departmentId" required defaultValue=\{departmentAssignmentDepartmentId\} options=\{departmentOptions\(activeDepartmentsForActiveOrganization, lookups, target\?\.departmentId\)\}/,
  );
});

test("admin organization member creation excludes users that are already active members", () => {
  const sourceCode = source("packages/sdkwork-clawrouter-pc-admin-organization/src/index.tsx");

  assert.match(sourceCode, /function availableDirectoryUserOptions\(/);
  assert.match(sourceCode, /existingMembers: OrganizationMemberRecord\[]/);
  assert.match(sourceCode, /const blockedUserIds = new Set\(/);
  assert.match(sourceCode, /item\.organizationId === organizationId && isActiveRecord\(item\) && item\.userId/);
  assert.match(
    sourceCode,
    /SelectField key=\{`membership-user-\$\{membershipOrganizationId\}`\} label=\{t\('admin\.organization\.fields\.userId', 'User'\)\} name="userId" required defaultValue=\{target\?\.userId\} options=\{availableDirectoryUserOptions\(directory\.users, membersForMembershipOrganization, lookups, membershipOrganizationId, target\?\.userId\)\}/,
  );
  assert.doesNotMatch(
    sourceCode,
    /directoryUserOptions\(directory\.users, lookups, target\?\.userId\)/,
    "member creation must not offer users already active in the selected organization",
  );
});

test("admin organization assignment creation excludes duplicate active assignments", () => {
  const sourceCode = source("packages/sdkwork-clawrouter-pc-admin-organization/src/index.tsx");

  assert.match(sourceCode, /function availableDepartmentAssignmentMemberOptions\(/);
  assert.match(sourceCode, /function availablePositionAssignmentMemberOptions\(/);
  assert.match(sourceCode, /existingAssignments: DepartmentAssignmentRecord\[]/);
  assert.match(sourceCode, /existingAssignments: PositionAssignmentRecord\[]/);
  assert.match(sourceCode, /item\.departmentId === departmentId && isActiveRecord\(item\) && item\.membershipId/);
  assert.match(sourceCode, /item\.positionId === positionId && isActiveRecord\(item\) && item\.membershipId/);
  assert.match(sourceCode, /item\.departmentId === departmentId && isActiveRecord\(item\) && item\.userId/);
  assert.match(sourceCode, /item\.positionId === positionId && isActiveRecord\(item\) && item\.userId/);
  assert.match(
    sourceCode,
    /members\.filter\(\(item\) => item\.id === keepMembershipId \|\| item\.userId === keepUserId \|\| \(!blockedMembershipIds\.has\(item\.id\) && !blockedUserIds\.has\(item\.userId\)\)\)/,
    "department assignment duplicate prevention should also block records that only carry userId",
  );
  assert.match(
    sourceCode,
    /members\.filter\(\(item\) => item\.id === keepMembershipId \|\| item\.userId === keepUserId \|\| \(!blockedMembershipIds\.has\(item\.id\) && !blockedUserIds\.has\(item\.userId\)\)\)/,
    "position assignment duplicate prevention should also block records that only carry userId",
  );
  assert.match(
    sourceCode,
    /const \[departmentAssignmentDepartmentId, setDepartmentAssignmentDepartmentId\] = useState\(/,
  );
  assert.match(
    sourceCode,
    /options=\{availableDepartmentAssignmentMemberOptions\(activeMembersForActiveOrganization, directory\.departmentAssignments, departmentAssignmentDepartmentId, lookups, target\?\.membershipId, target\?\.userId\)\}/,
  );
  assert.match(
    sourceCode,
    /onChange=\{setDepartmentAssignmentDepartmentId\}/,
  );
  assert.match(
    sourceCode,
    /const \[positionAssignmentPositionId, setPositionAssignmentPositionId\] = useState\(/,
  );
  assert.match(
    sourceCode,
    /options=\{availablePositionAssignmentMemberOptions\(membersForSelectedPosition, directory\.positionAssignments, positionAssignmentPositionId, lookups, target\?\.membershipId, target\?\.userId\)\}/,
  );
  assert.doesNotMatch(
    sourceCode,
    /availablePositionAssignmentMemberOptions\(membersForActiveDepartment, directory\.positionAssignments, positionAssignmentPositionId/,
    "position assignment member options should follow the selected position, not the page-selected department",
  );
  assert.match(
    sourceCode,
    /onChange=\{setPositionAssignmentPositionId\}/,
  );
  assert.doesNotMatch(
    sourceCode,
    /SelectField label=\{t\('admin\.organization\.fields\.member', 'Member'\)\} name="membershipId" required defaultValue=\{target\?\.membershipId \?\? ''\} options=\{memberOptions\(activeMembersForActiveOrganization, lookups, target\?\.membershipId, target\?\.userId\)\}/,
    "department assignment must not offer members already actively assigned to the selected department",
  );
});

test("admin organization assignment forms align default selections with member filtering state", () => {
  const sourceCode = source("packages/sdkwork-clawrouter-pc-admin-organization/src/index.tsx");

  assert.match(
    sourceCode,
    /const initialDepartmentAssignmentDepartmentId = dialog\.kind === 'departmentAssignment'\s+\? dialog\.target\?\.departmentId \|\| activeDepartmentIdForRelations\s+: activeDepartmentIdForRelations;/,
    "department assignment should initialize filtering from the actual default department",
  );
  assert.match(
    sourceCode,
    /const \[departmentAssignmentDepartmentId, setDepartmentAssignmentDepartmentId\] = useState\(initialDepartmentAssignmentDepartmentId\);/,
  );
  assert.match(
    sourceCode,
    /SelectField label=\{t\('admin\.organization\.fields\.department', 'Department'\)\} name="departmentId" required defaultValue=\{departmentAssignmentDepartmentId\} options=\{departmentOptions\(activeDepartmentsForActiveOrganization, lookups, target\?\.departmentId\)\}/,
  );
  assert.match(
    sourceCode,
    /const initialPositionAssignmentPositionId = dialog\.kind === 'positionAssignment'\s+\? dialog\.target\?\.positionId \?\? activePositionsForActiveContext\[0\]\?\.id \?\? ''\s+: activePositionsForActiveContext\[0\]\?\.id \?\? '';/,
    "position assignment should initialize filtering from the actual default position",
  );
  assert.match(
    sourceCode,
    /const \[positionAssignmentPositionId, setPositionAssignmentPositionId\] = useState\(initialPositionAssignmentPositionId\);/,
  );
  assert.match(
    sourceCode,
    /SelectField label=\{t\('admin\.organization\.fields\.position', 'Position'\)\} name="positionId" required defaultValue=\{positionAssignmentPositionId\} options=\{positionOptions\(activePositionsForActiveContext, lookups, target\?\.positionId\)\}/,
  );
  assert.doesNotMatch(
    sourceCode,
    /defaultValue=\{target\?\.departmentId \|\| activeDepartmentId\} options=\{departmentOptions\(activeDepartmentsForActiveOrganization, lookups, target\?\.departmentId\)\}/,
    "department assignment defaultValue must not drift from the state used to filter member options",
  );
  assert.doesNotMatch(
    sourceCode,
    /defaultValue=\{target\?\.positionId \?\? ''\} options=\{positionOptions\(activePositionsForActiveContext, lookups, target\?\.positionId\)\}/,
    "position assignment defaultValue must not drift from the state used to filter member options",
  );
});

test("admin organization relation forms default to active departments only", () => {
  const sourceCode = source("packages/sdkwork-clawrouter-pc-admin-organization/src/index.tsx");

  assert.match(
    sourceCode,
    /const activeDepartmentIdForRelations = activeDepartmentsForActiveOrganization\.some\(\(item\) => item\.id === activeDepartmentId\)\s+\? activeDepartmentId\s+: activeDepartmentsForActiveOrganization\[0\]\?\.id \|\| '';/,
    "new relationship forms should not inherit an inactive selected department",
  );
  assert.match(sourceCode, /activeDepartmentIdForRelations=\{activeDepartmentIdForRelations\}/);
  assert.match(sourceCode, /activeDepartmentIdForRelations: string;/);
  assert.match(
    sourceCode,
    /const \[roleBindingScopeKind, setRoleBindingScopeKind\] = useState\(activeDepartmentIdForRelations \? 'department' : 'organization'\);/,
  );
  assert.match(
    sourceCode,
    /const initialDepartmentAssignmentDepartmentId = dialog\.kind === 'departmentAssignment'\s+\? dialog\.target\?\.departmentId \|\| activeDepartmentIdForRelations\s+: activeDepartmentIdForRelations;/,
  );
  assert.match(
    sourceCode,
    /<SelectField key=\{`position-department-\$\{positionOrganizationId\}`\} label=\{t\('admin\.organization\.fields\.department', 'Department'\)\} name="departmentId" defaultValue=\{target\?\.departmentId \?\? activeDepartmentIdForRelations\}/,
  );
  assert.match(
    sourceCode,
    /<SelectField label=\{t\('admin\.organization\.fields\.department', 'Department'\)\} name="departmentId" required defaultValue=\{roleBindingDepartmentId\} options=\{departmentOptions\(activeDepartmentsForActiveOrganization, lookups, roleBindingDepartmentId\)\} onChange=\{setRoleBindingDepartmentId\}/,
  );
  assert.match(
    sourceCode,
    /await submitDialog\(dialog, form, activeOrganizationIdForRelations, activeDepartmentIdForRelations\);/,
  );
  assert.match(
    sourceCode,
    /departmentId: optionalFormText\(form, 'departmentId'\),/,
    "position form should respect explicit None instead of falling back to the page-selected department",
  );
  assert.doesNotMatch(
    sourceCode,
    /departmentId: optionalFormText\(form, 'departmentId'\) \|\| fallbackDepartmentId \|\| undefined/,
    "optional position department must not be reintroduced by fallback",
  );
});

test("admin organization UI keeps context coherent and guides role binding principals", () => {
  const sourceCode = source("packages/sdkwork-clawrouter-pc-admin-organization/src/index.tsx");

  assert.match(sourceCode, /if \(activeDepartmentId && !departmentsForActiveOrganization\.some\(\(item\) => item\.id === activeDepartmentId\)\)/);
  assert.match(sourceCode, /setActiveDepartmentId\(''\);/);
  assert.match(sourceCode, /const \[roleBindingPrincipalKind, setRoleBindingPrincipalKind\] = useState\('member'\);/);
  assert.match(sourceCode, /const roleBindingRawPrincipalOptions = principalOptions\(/);
  assert.match(sourceCode, /const roleBindingPrincipalOptions = availableRoleBindingPrincipalOptions\(/);
  assert.match(sourceCode, /function principalOptions\(/);
  assert.match(sourceCode, /function principalKindOptions\(/);
  assert.match(sourceCode, /onChange=\{setRoleBindingPrincipalKind\}/);
  assert.match(sourceCode, /name="principalId" required options=\{roleBindingPrincipalOptions\}/);
  assert.doesNotMatch(
    sourceCode,
    /TextField label=\{t\('admin\.organization\.fields\.principalId'/,
    "role binding principal should be selected from resolved directory options",
  );
});

test("admin organization UI filters organization tree and grants the selected role by default", () => {
  const sourceCode = source("packages/sdkwork-clawrouter-pc-admin-organization/src/index.tsx");

  assert.match(sourceCode, /nodes=\{filterOrganizationTree\(directory\.organizationTree, normalizedSearch\)\}/);
  assert.match(sourceCode, /function filterOrganizationTree\(nodes: OrganizationTreeNode\[], search: string\): OrganizationTreeNode\[]/);
  assert.match(sourceCode, /activeRoleId=\{activeRoleId\}/);
  assert.match(sourceCode, /activeRoleId: string;/);
  assert.match(sourceCode, /defaultValue=\{activeRoleId\}/);
  assert.match(sourceCode, /SelectField label=\{t\('admin\.organization\.fields\.role', 'Role'\)\} name="roleId" required defaultValue=\{activeRoleId\} options=\{roleOptions\}/);
});

test("admin organization role binding scope and principal controls avoid stale selections", () => {
  const sourceCode = source("packages/sdkwork-clawrouter-pc-admin-organization/src/index.tsx");

  assert.match(sourceCode, /key=\{`role-binding-principal-\$\{roleBindingRoleId\}-\$\{roleBindingPrincipalKind\}-\$\{roleBindingScopeKind\}-\$\{roleBindingScopeId\}`\}/);
  assert.match(sourceCode, /const \[roleBindingScopeKind, setRoleBindingScopeKind\] = useState\(activeDepartmentIdForRelations \? 'department' : 'organization'\);/);
  assert.match(sourceCode, /const \[roleBindingRoleId, setRoleBindingRoleId\] = useState\(activeRoleId\);/);
  assert.match(sourceCode, /const \[roleBindingDepartmentId, setRoleBindingDepartmentId\] = useState\(activeDepartmentIdForRelations\);/);
  assert.match(sourceCode, /function scopeKindOptions\(t: TranslationFunction\): SelectOption\[]/);
  assert.match(sourceCode, /name="scopeKind" defaultValue=\{roleBindingScopeKind\} options=\{scopeKindOptions\(t\)\} onChange=\{setRoleBindingScopeKind\}/);
  assert.match(sourceCode, /roleBindingScopeKind === 'organization' \? \(/);
  assert.match(sourceCode, /roleBindingScopeKind === 'department' \? \(/);
  assert.match(sourceCode, /name="roleId" required defaultValue=\{roleBindingRoleId\} options=\{roleOptions\} onChange=\{setRoleBindingRoleId\}/);
  assert.doesNotMatch(
    sourceCode,
    /TextField label=\{t\('admin\.organization\.fields\.scopeKind'/,
    "role binding scope kind should be selected from safe options",
  );
  assert.match(sourceCode, /const requestedScopeKind = optionalFormText\(form, 'scopeKind'\);/);
  assert.match(sourceCode, /const departmentId = requestedScopeKind === 'department'/);
  assert.match(sourceCode, /scopeKind: departmentId \? 'department' : 'organization'/);
});

test("admin organization role binding creation excludes duplicate active bindings", () => {
  const sourceCode = source("packages/sdkwork-clawrouter-pc-admin-organization/src/index.tsx");

  assert.match(sourceCode, /function availableRoleBindingPrincipalOptions\(/);
  assert.match(sourceCode, /existingBindings: RoleBindingRecord\[]/);
  assert.match(sourceCode, /const roleBindingRawPrincipalOptions = principalOptions\(/);
  assert.match(sourceCode, /const roleBindingScopeId = roleBindingScopeKind === 'department' \? roleBindingDepartmentId : activeOrganizationIdForRelations;/);
  assert.match(
    sourceCode,
    /const roleBindingPrincipalOptions = availableRoleBindingPrincipalOptions\(roleBindingRawPrincipalOptions, directory\.roleBindings, roleBindingRoleId, roleBindingPrincipalKind, roleBindingScopeKind, roleBindingScopeId\);/,
  );
  assert.match(sourceCode, /const blockedPrincipalIds = new Set\(/);
  assert.match(sourceCode, /item\.roleId === roleId/);
  assert.match(sourceCode, /item\.principalKind === principalKind/);
  assert.match(sourceCode, /roleBindingEffectiveScopeKind\(item\) === scopeKind/);
  assert.match(sourceCode, /roleBindingEffectiveScopeId\(item\) === scopeId/);
  assert.match(sourceCode, /isActiveRecord\(item\)/);
  assert.match(sourceCode, /options\.filter\(\(option\) => !blockedPrincipalIds\.has\(option\.value\)\)/);
  assert.match(sourceCode, /function roleBindingEffectiveScopeKind\(binding: RoleBindingRecord\): string/);
  assert.match(sourceCode, /function roleBindingEffectiveScopeId\(binding: RoleBindingRecord\): string/);
});

test("admin organization role bindings use active context principals and required scopes", () => {
  const sourceCode = source("packages/sdkwork-clawrouter-pc-admin-organization/src/index.tsx");

  assert.match(
    sourceCode,
    /const roleBindingRawPrincipalOptions = principalOptions\([\s\S]*roleBindingPrincipalKind,[\s\S]*organizationsForActiveContext,[\s\S]*activeDepartmentsForActiveOrganization,[\s\S]*activeMembersForActiveOrganization,[\s\S]*lookups,[\s\S]*\);/,
  );
  assert.match(
    sourceCode,
    /SelectField label=\{t\('admin\.organization\.fields\.organization', 'Organization'\)\} name="organizationId" required defaultValue=\{activeOrganizationIdForRelations\} options=\{organizationOptions\(organizationsForActiveContext, lookups, activeOrganizationIdForRelations\)\}/,
  );
  assert.match(
    sourceCode,
    /SelectField label=\{t\('admin\.organization\.fields\.department', 'Department'\)\} name="departmentId" required defaultValue=\{roleBindingDepartmentId\} options=\{departmentOptions\(activeDepartmentsForActiveOrganization, lookups, roleBindingDepartmentId\)\} onChange=\{setRoleBindingDepartmentId\}/,
  );
  assert.doesNotMatch(
    sourceCode,
    /principalOptions\([\s\S]*directory\.organizations,[\s\S]*departmentsForActiveOrganization,[\s\S]*membersForActiveOrganization,/,
    "role binding principal options must not include cross-organization or inactive principals",
  );
  assert.doesNotMatch(
    sourceCode,
    /emptyOption\(t\)\.concat\(organizationSelectOptions\)/,
    "role binding organization scope should be required and scoped to the active organization",
  );
  assert.doesNotMatch(
    sourceCode,
    /roleBindingScopeKind === 'department' \? \([\s\S]*emptyOption\(t\)\.concat\(departmentOptions\(departmentsForActiveOrganization/,
    "role binding department scope should be required and scoped to active departments",
  );
});

test("admin organization assignment dialogs only offer active positions, roles and permissions", () => {
  const sourceCode = source("packages/sdkwork-clawrouter-pc-admin-organization/src/index.tsx");

  assert.match(sourceCode, /const activePositionsForActiveContext = useMemo\(/);
  assert.match(sourceCode, /const activeRolesForAssignment = useMemo\(/);
  assert.match(sourceCode, /const activePermissionsForAssignment = useMemo\(/);
  assert.match(sourceCode, /directory\.positions\.filter\(isActiveRecord\)\.filter/);
  assert.match(sourceCode, /directory\.roles\.filter\(isActiveRecord\)/);
  assert.match(sourceCode, /directory\.permissions\.filter\(isActiveRecord\)/);
  assert.match(sourceCode, /activePositionsForActiveContext=\{activePositionsForActiveContext\}/);
  assert.match(sourceCode, /activeRolesForAssignment=\{activeRolesForAssignment\}/);
  assert.match(sourceCode, /activePermissionsForAssignment=\{activePermissionsForAssignment\}/);
  assert.match(
    sourceCode,
    /const roleOptions = activeRolesForAssignment\.map\(\(item\) => \(\{ value: item\.id, label: formatRoleLabel\(item\.id, lookups\) \}\)\);/,
  );
  assert.match(sourceCode, /function availableRolePermissionOptions\(/);
  assert.match(sourceCode, /existingRolePermissions: PermissionRecord\[]/);
  assert.match(sourceCode, /const grantedPermissionIds = new Set\(existingRolePermissions\.map\(\(item\) => item\.id\)\);/);
  assert.match(sourceCode, /const availablePermissionOptions = availableRolePermissionOptions\(activePermissionsForAssignment, rolePermissions, lookups\);/);
  assert.match(
    sourceCode,
    /SelectField label=\{t\('admin\.organization\.fields\.position', 'Position'\)\} name="positionId" required defaultValue=\{positionAssignmentPositionId\} options=\{positionOptions\(activePositionsForActiveContext, lookups, target\?\.positionId\)\}/,
  );
  assert.match(
    sourceCode,
    /SelectField label=\{t\('admin\.organization\.fields\.permission', 'Permission'\)\} name="permissionId" required options=\{availablePermissionOptions\}/,
  );
  assert.doesNotMatch(
    sourceCode,
    /name="permissionId" required options=\{permissionOptions\}/,
    "role permission grants should not offer permissions already granted to the selected role",
  );
}
);

test("admin organization role binding list stays in the selected organization boundary", () => {
  const sourceCode = source("packages/sdkwork-clawrouter-pc-admin-organization/src/index.tsx");

  assert.match(sourceCode, /function roleBindingBelongsToContext\(/);
  assert.match(sourceCode, /const activeMembershipIdsForOrganization = useMemo\(/);
  assert.match(sourceCode, /const activeUserIdsForOrganization = useMemo\(/);
  assert.match(
    sourceCode,
    /directory\.roleBindings\.filter\(\(item\) => roleBindingBelongsToContext\(item, effectiveOrganizationId, activeDepartmentId, departmentIdsForOrganization, activeMembershipIdsForOrganization, activeUserIdsForOrganization\)\)/,
  );
  assert.match(
    sourceCode,
    /binding\.principalKind === 'member' && activeMembershipIdsForOrganization\.has\(binding\.principalId\)/,
  );
  assert.match(
    sourceCode,
    /binding\.principalKind === 'user' && activeUserIdsForOrganization\.has\(binding\.principalId\)/,
  );
  assert.doesNotMatch(
    sourceCode,
    /return item\.organizationId === effectiveOrganizationId \|\| item\.scopeId === effectiveOrganizationId \|\| !item\.organizationId;/,
    "role bindings without organizationId must still be checked against department or scope context",
  );
});

test("admin organization permission grants require an active selected role", () => {
  const sourceCode = source("packages/sdkwork-clawrouter-pc-admin-organization/src/index.tsx");

  assert.match(
    sourceCode,
    /onGrantPermission=\{\(\) => activeRoleId \? setDialog\(\{ kind: 'rolePermission', mode: 'create' \}\) : undefined\}/,
    "grant permission should not open the dialog without a selected role",
  );
  assert.match(
    sourceCode,
    /<SmallButton label=\{t\('admin\.organization\.actions\.grant', 'Grant'\)\} onClick=\{onGrantPermission\} disabled=\{!selectedRoleId\} \/>/,
    "role permission panel grant action should require a selected role",
  );
  assert.match(
    sourceCode,
    /<SmallButton label=\{t\('admin\.organization\.actions\.grant', 'Grant'\)\} onClick=\{onGrantPermission\} disabled=\{!selectedRoleId\} \/>[\s\S]*title=\{t\('admin\.organization\.permissions\.title', 'Permissions'\)\}/,
  );
  assert.doesNotMatch(
    sourceCode,
    /<SmallButton label=\{t\('admin\.organization\.actions\.grant', 'Grant'\)\} onClick=\{onGrantPermission\} \/>/,
    "every permission grant entry point should be disabled when no role is selected",
  );
});

test("admin organization relation actions require active operational context", () => {
  const sourceCode = source("packages/sdkwork-clawrouter-pc-admin-organization/src/index.tsx");

  assert.match(
    sourceCode,
    /const activeOrganizationIdForRelations = activeOrganization && isActiveRecord\(activeOrganization\) \? activeOrganization\.id : '';/,
    "relationship create flows should only inherit an active selected organization",
  );
  assert.match(
    sourceCode,
    /action=\{<SmallButton label=\{t\('admin\.organization\.actions\.addDepartment', 'Add'\)\} onClick=\{\(\) => setDialog\(\{ kind: 'department', mode: 'create' \}\)\} disabled=\{!activeOrganizationIdForRelations\} \/>/,
    "department creation should be disabled without an active organization",
  );
  assert.match(sourceCode, /canAddMember=\{Boolean\(activeOrganizationIdForRelations\)\}/);
  assert.match(sourceCode, /canAddAssignment=\{Boolean\(activeOrganizationIdForRelations && activeDepartmentIdForRelations && activeMembersForActiveOrganization\.length > 0\)\}/);
  assert.match(sourceCode, /canCreate=\{Boolean\(activeOrganizationIdForRelations\)\}/);
  assert.match(sourceCode, /canAddAssignment=\{Boolean\(activeOrganizationIdForRelations && activePositionsForActiveContext\.length > 0 && activeMembersForActiveOrganization\.length > 0\)\}/);
  assert.match(sourceCode, /canBindRole=\{Boolean\(activeRoleId && activeOrganizationIdForRelations\)\}/);
  assert.match(
    sourceCode,
    /<PrimaryButton label=\{t\('admin\.organization\.actions\.addMember', 'Add member'\)\} onClick=\{onAddMember\} disabled=\{!canAddMember\}>/,
  );
  assert.match(
    sourceCode,
    /<SmallButton label=\{t\('admin\.organization\.actions\.assign', 'Assign'\)\} onClick=\{onAddAssignment\} disabled=\{!canAddAssignment\} \/>/,
  );
  assert.match(
    sourceCode,
    /<PrimaryButton label=\{t\('admin\.organization\.actions\.createPosition', 'Create position'\)\} onClick=\{onCreate\} disabled=\{!canCreate\}>/,
  );
  assert.match(
    sourceCode,
    /<SmallButton label=\{t\('admin\.organization\.actions\.bindRole', 'Bind'\)\} onClick=\{onBindRole\} disabled=\{!canBindRole\} \/>/,
  );
}
);

test("admin organization relationship forms use active organization options and fallbacks", () => {
  const sourceCode = source("packages/sdkwork-clawrouter-pc-admin-organization/src/index.tsx");

  assert.match(sourceCode, /const activeOrganizations = useMemo\(\s+\(\) => directory\.organizations\.filter\(isActiveRecord\),\s+\[directory\.organizations\],\s+\);/);
  assert.doesNotMatch(
    sourceCode,
    /const organizationSelectOptions = organizationOptions\(directory\.organizations, lookups\);/,
    "relationship forms should not offer inactive organizations for new assignments",
  );
  assert.match(
    sourceCode,
    /await submitDialog\(dialog, form, activeOrganizationIdForRelations, activeDepartmentIdForRelations\);/,
    "submit fallbacks should use the active organization relationship context",
  );
  assert.match(sourceCode, /activeOrganizationIdForRelations=\{activeOrganizationIdForRelations\}/);
  assert.match(sourceCode, /activeOrganizationIdForRelations: string;/);
  assert.match(
    sourceCode,
    /dialog\.kind === 'membership' \? dialog\.target\?\.organizationId \|\| activeOrganizationIdForRelations : activeOrganizationIdForRelations/,
  );
  assert.match(
    sourceCode,
    /dialog\.kind === 'department' \? dialog\.target\?\.organizationId \|\| activeOrganizationIdForRelations : activeOrganizationIdForRelations/,
  );
  assert.match(
    sourceCode,
    /dialog\.kind === 'position' \? dialog\.target\?\.organizationId \|\| activeOrganizationIdForRelations : activeOrganizationIdForRelations/,
  );
  assert.match(
    sourceCode,
    /organizationOptions\(activeOrganizations, lookups, target\?\.organizationId \|\| activeOrganizationIdForRelations\)/,
    "editing should keep the current organization while new records use active organizations only",
  );
  assert.match(
    sourceCode,
    /const roleBindingScopeId = roleBindingScopeKind === 'department' \? roleBindingDepartmentId : activeOrganizationIdForRelations;/,
  );
  assert.match(
    sourceCode,
    /organizationOptions\(organizationsForActiveContext, lookups, activeOrganizationIdForRelations\)/,
  );
}
);

test("admin organization role binding table exposes lifecycle status", () => {
  const sourceCode = source("packages/sdkwork-clawrouter-pc-admin-organization/src/index.tsx");

  assert.match(sourceCode, /<th className="px-4 py-3">\{t\('admin\.organization\.columns\.status', 'Status'\)\}<\/th>/);
  assert.match(sourceCode, /<td className="px-4 py-3"><StatusPill status=\{binding\.status\} \/><\/td>/);
  assert.match(sourceCode, /<BusinessStateTableRow colSpan=\{5\} kind="empty" title=\{t\('admin\.organization\.empty\.roleBindings', 'No role bindings'\)\} \/>/);
}
);

test("admin organization destructive actions show dependency counts and block unsafe deletes", () => {
  const sourceCode = source("packages/sdkwork-clawrouter-pc-admin-organization/src/index.tsx");
  const confirmDialog = source("packages/sdkwork-clawrouter-pc-commons/src/components/ConfirmDialog.tsx");

  assert.match(sourceCode, /type ConfirmDependency = \{ count: number; label: string \};/);
  assert.match(sourceCode, /blocked\?: boolean/);
  assert.match(sourceCode, /function buildOrganizationConfirmTarget\(organization: OrganizationRecord, directory: OrganizationDirectoryData, t: TranslationFunction\): ConfirmTarget/);
  assert.match(sourceCode, /function buildDepartmentConfirmTarget\(department: DepartmentRecord, directory: OrganizationDirectoryData, t: TranslationFunction\): ConfirmTarget/);
  assert.match(sourceCode, /function buildPositionConfirmTarget\(position: PositionRecord, directory: OrganizationDirectoryData, t: TranslationFunction\): ConfirmTarget/);
  assert.match(sourceCode, /function buildRoleConfirmTarget\(role: RoleRecord, directory: OrganizationDirectoryData, rolePermissions: PermissionRecord\[], t: TranslationFunction\): ConfirmTarget/);
  assert.match(sourceCode, /function buildPermissionConfirmTarget\(permission: PermissionRecord, rolePermissions: PermissionRecord\[], t: TranslationFunction\): ConfirmTarget/);
  assert.match(sourceCode, /function activeOrganizationDependencies\(organizationId: string, directory: OrganizationDirectoryData, t: TranslationFunction\): ConfirmDependency\[]/);
  assert.match(sourceCode, /function activeDepartmentDependencies\(departmentId: string, directory: OrganizationDirectoryData, t: TranslationFunction\): ConfirmDependency\[]/);
  assert.match(sourceCode, /function activePositionDependencies\(positionId: string, directory: OrganizationDirectoryData, t: TranslationFunction\): ConfirmDependency\[]/);
  assert.match(sourceCode, /function activeRoleDependencies\(roleId: string, directory: OrganizationDirectoryData, rolePermissions: PermissionRecord\[], t: TranslationFunction\): ConfirmDependency\[]/);
  assert.match(sourceCode, /function activePermissionDependencies\(permissionId: string, rolePermissions: PermissionRecord\[], t: TranslationFunction\): ConfirmDependency\[]/);
  assert.match(sourceCode, /onDelete=\{\(\) => setConfirmTarget\(buildOrganizationConfirmTarget\(item, directory, t\)\)\}/);
  assert.match(sourceCode, /onDelete=\{organization \? \(\) => setConfirmTarget\(buildOrganizationConfirmTarget\(organization, directory, t\)\) : undefined\}/);
  assert.match(sourceCode, /onDelete=\{\(\) => setConfirmTarget\(buildDepartmentConfirmTarget\(item, directory, t\)\)\}/);
  assert.match(sourceCode, /onDelete=\{department \? \(\) => setConfirmTarget\(buildDepartmentConfirmTarget\(department, directory, t\)\) : undefined\}/);
  assert.match(sourceCode, /onDelete=\{\(target\) => setConfirmTarget\(buildPositionConfirmTarget\(target, directory, t\)\)\}/);
  assert.match(sourceCode, /onDeleteRole=\{\(target\) => setConfirmTarget\(buildRoleConfirmTarget\(target, directory, rolePermissions, t\)\)\}/);
  assert.match(sourceCode, /onDeletePermission=\{\(target\) => setConfirmTarget\(buildPermissionConfirmTarget\(target, rolePermissions, t\)\)\}/);
  assert.match(sourceCode, /directory\.roleBindings\.filter\(\(item\) => item\.roleId === roleId && isActiveRecord\(item\)\)\.length/);
  assert.match(sourceCode, /rolePermissions\.some\(\(item\) => item\.id === permissionId\)/);
  assert.match(sourceCode, /confirmDisabled=\{isConfirmBlocked\(confirmTarget\)\}/);
  assert.match(sourceCode, /function isConfirmBlocked\(target: ConfirmTarget\): boolean/);
  assert.match(sourceCode, /admin\.organization\.confirm\.blockedDescription/);
  assert.match(sourceCode, /admin\.organization\.confirm\.dependencies/);
  assert.match(confirmDialog, /confirmDisabled\?: boolean/);
  assert.match(confirmDialog, /disabled=\{isBusy \|\| confirmDisabled\}/);
});

test("admin organization form fields use controlled enterprise options", () => {
  const sourceCode = source("packages/sdkwork-clawrouter-pc-admin-organization/src/index.tsx");

  assert.match(sourceCode, /function organizationKindOptions\(t: TranslationFunction, keepValue\?: string \| null\): SelectOption\[]/);
  assert.match(sourceCode, /function memberKindOptions\(t: TranslationFunction, keepValue\?: string \| null\): SelectOption\[]/);
  assert.match(sourceCode, /function departmentAssignmentRoleOptions\(t: TranslationFunction, keepValue\?: string \| null\): SelectOption\[]/);
  assert.match(
    sourceCode,
    /SelectField label=\{t\('admin\.organization\.fields\.kind', 'Kind'\)\} name="organizationKind" defaultValue=\{target\?\.organizationKind \|\| 'company'\} options=\{organizationKindOptions\(t, target\?\.organizationKind\)\}/,
  );
  assert.match(
    sourceCode,
    /SelectField label=\{t\('admin\.organization\.fields\.memberKind', 'Member kind'\)\} name="memberKind" defaultValue=\{target\?\.memberKind \|\| 'member'\} options=\{memberKindOptions\(t, target\?\.memberKind\)\}/,
  );
  assert.match(
    sourceCode,
    /SelectField label=\{t\('admin\.organization\.fields\.role', 'Role'\)\} name="role" defaultValue=\{target\?\.role \|\| 'member'\} options=\{departmentAssignmentRoleOptions\(t, target\?\.role\)\}/,
  );
  assert.doesNotMatch(
    sourceCode,
    /TextField label=\{t\('admin\.organization\.fields\.kind', 'Kind'\)\} name="organizationKind"/,
    "organization kind should use a controlled select instead of raw text",
  );
  assert.doesNotMatch(
    sourceCode,
    /TextField label=\{t\('admin\.organization\.fields\.role', 'Role'\)\} name="role"/,
    "department assignment role should use a controlled select instead of raw text",
  );
});

test("admin organization parent selectors prevent self or descendant loops", () => {
  const sourceCode = source("packages/sdkwork-clawrouter-pc-admin-organization/src/index.tsx");

  assert.match(sourceCode, /function organizationParentOptions\(organizations: OrganizationRecord\[], targetId: string \| null \| undefined, lookups: DirectoryLookups, t: TranslationFunction\): SelectOption\[]/);
  assert.match(sourceCode, /function departmentParentOptions\(departments: DepartmentRecord\[], targetId: string \| null \| undefined, lookups: DirectoryLookups, t: TranslationFunction\): SelectOption\[]/);
  assert.match(sourceCode, /function collectDescendantIds<T extends \{ id: string \}>\(/);
  assert.match(sourceCode, /const excludedIds = collectDescendantIds\(organizations, targetId, 'parentOrganizationId'\);/);
  assert.match(sourceCode, /const excludedIds = collectDescendantIds\(departments, targetId, 'parentDepartmentId'\);/);
  assert.match(
    sourceCode,
    /options=\{organizationParentOptions\(directory\.organizations, target\?\.id, lookups, t\)\}/,
  );
  assert.match(
    sourceCode,
    /options=\{departmentParentOptions\(departmentsForDepartmentOrganization, target\?\.id, lookups, t\)\}/,
  );
});

test("admin organization member table and search are enriched from appbase users", () => {
  const sourceCode = source("packages/sdkwork-clawrouter-pc-admin-organization/src/index.tsx");

  assert.match(sourceCode, /const visibleMemberships = filterBySearchWithLabels\(/);
  assert.match(sourceCode, /function memberDisplayName\(member: OrganizationMemberRecord, lookups: DirectoryLookups\): string/);
  assert.match(sourceCode, /function memberContactPrimary\(member: OrganizationMemberRecord, lookups: DirectoryLookups\): string/);
  assert.match(sourceCode, /function memberContactSecondary\(member: OrganizationMemberRecord, lookups: DirectoryLookups\): string/);
  assert.match(sourceCode, /formatMemberLabel\(member\.id, member\.userId, lookups\)/);
  assert.match(sourceCode, /memberContactPrimary\(member, lookups\)/);
  assert.match(sourceCode, /memberContactSecondary\(member, lookups\)/);
  assert.match(sourceCode, /memberDisplayName\(item, lookups\)/);
  assert.match(sourceCode, /formatUserLabel\(item\.userId, lookups\)/);
  assert.doesNotMatch(
    sourceCode,
    /\{member\.displayName\}<\/div>/,
    "member rows should not rely only on membership displayName when appbase user data is available",
  );
});

test("admin organization service calls appbase backend sdk read and write methods", async () => {
  const { clearStoredAppSessionToken } = await import("./packages/sdkwork-clawrouter-pc-commons/src/app-session-token.ts");
  const { resetClawRouterSdkClients } = await import("./packages/sdkwork-clawrouter-pc-commons/src/sdk-clients.ts");
  const { OrganizationService } = await import(
    "./packages/sdkwork-clawrouter-pc-admin-organization/src/organizationService.ts"
  );

  const originalFetch = globalThis.fetch;
  const captured: Array<{ body: string; method: string; url: string }> = [];
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    captured.push({
      body: typeof init?.body === "string" ? init.body : "",
      method: init?.method ?? "GET",
      url,
    });
    return new Response(
      JSON.stringify({
        code: "2000",
        message: "ok",
        requestId: "00000000-0000-0000-0000-000000000000",
        data: {
          items: [],
          item: {
            id: "org-1",
            code: "hq",
            name: "Headquarters",
            organizationKind: "company",
            status: "active",
          },
          deleted: true,
        },
      }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
  }) as typeof fetch;
  clearStoredAppSessionToken();
  resetClawRouterSdkClients();

  try {
    await OrganizationService.loadDirectory();
    await OrganizationService.createOrganization({ code: "hq", name: "Headquarters" });
    await OrganizationService.updateDepartment("dept-1", { name: "Research" });
    await OrganizationService.deletePosition("pos-1");
    await OrganizationService.bindRole({ principalKind: "member", principalId: "mem-1", roleId: "role-1" });

    assert.equal(captured[0].url, "/backend/v3/api/iam/users?page_size=200");
    assert.equal(captured[0].method, "GET");
    assert.equal(captured[1].url, "/backend/v3/api/iam/organizations/tree");
    assert.equal(captured[1].method, "GET");
    assert.equal(captured[2].url, "/backend/v3/api/iam/organizations?page_size=200");
    assert.equal(captured[2].method, "GET");
    assert.equal(captured[3].url, "/backend/v3/api/iam/departments/tree");
    assert.equal(captured[3].method, "GET");
    assert.equal(captured[4].url, "/backend/v3/api/iam/departments?page_size=200");
    assert.equal(captured[4].method, "GET");
    assert.equal(captured[5].url, "/backend/v3/api/iam/organization_memberships?page_size=200");
    assert.equal(captured[5].method, "GET");
    assert.equal(captured[6].url, "/backend/v3/api/iam/department_assignments?page_size=200");
    assert.equal(captured[6].method, "GET");
    assert.equal(captured[7].url, "/backend/v3/api/iam/positions?page_size=200");
    assert.equal(captured[7].method, "GET");
    assert.equal(captured[8].url, "/backend/v3/api/iam/position_assignments?page_size=200");
    assert.equal(captured[8].method, "GET");
    assert.equal(captured[9].url, "/backend/v3/api/iam/role_bindings?page_size=200");
    assert.equal(captured[9].method, "GET");
    assert.equal(captured[10].url, "/backend/v3/api/iam/roles?page_size=200");
    assert.equal(captured[10].method, "GET");
    assert.equal(captured[11].url, "/backend/v3/api/iam/permissions?page_size=200");
    assert.equal(captured[11].method, "GET");

    assert.equal(captured[12].url, "/backend/v3/api/iam/organizations");
    assert.equal(captured[12].method, "POST");
    assert.deepEqual(JSON.parse(captured[12].body), { code: "hq", name: "Headquarters" });
    assert.equal(captured[13].url, "/backend/v3/api/iam/departments/dept-1");
    assert.equal(captured[13].method, "PATCH");
    assert.deepEqual(JSON.parse(captured[13].body), { name: "Research" });
    assert.equal(captured[14].url, "/backend/v3/api/iam/positions/pos-1");
    assert.equal(captured[14].method, "DELETE");
    assert.equal(captured[15].url, "/backend/v3/api/iam/role_bindings");
    assert.equal(captured[15].method, "POST");
    assert.deepEqual(JSON.parse(captured[15].body), {
      principalKind: "member",
      principalId: "mem-1",
      roleId: "role-1",
    });
  } finally {
    clearStoredAppSessionToken();
    resetClawRouterSdkClients();
    globalThis.fetch = originalFetch;
  }
});
