import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Crown,
  Edit3,
  Gift,
  Layers,
  Loader2,
  Plus,
  RefreshCcw,
  Search,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";
import type { SdkworkVipAdminView } from "../vip-admin";
import type { SdkworkVipAdminMessagesOverrides } from "../vip-admin-copy";
import { createSdkworkVipAdminMessages } from "../vip-admin-copy";
import type { SdkworkVipAdminController } from "../vip-admin-controller";
import {
  useSdkworkVipAdminController,
  useSdkworkVipAdminControllerState,
} from "../vip-admin-controller";
import type {
  SdkworkVipAdminLevel,
  SdkworkVipAdminLevelUpdateInput,
  SdkworkVipAdminMembership,
  SdkworkVipAdminMembershipUpdateInput,
  SdkworkVipAdminPackage,
  SdkworkVipAdminPackageGroup,
  SdkworkVipAdminPackageGroupMutationInput,
  SdkworkVipAdminPackageUpdateInput,
} from "../vip-admin-service";

export interface SdkworkVipAdminPageProps {
  controller?: SdkworkVipAdminController;
  locale?: string | null;
  messages?: SdkworkVipAdminMessagesOverrides;
}

type VipAdminTab = "levels" | "packages" | "memberships" | "entitlements";
type TranslationFunction = (key: string, fallback?: string) => string;
type SelectOption = { value: string; label: string };
type VipLevelModal = { mode: "create" | "edit"; item?: SdkworkVipAdminLevel } | null;
type VipPackageModal =
  | { mode: "create"; defaultGroupId?: string; item?: undefined }
  | { mode: "edit"; item: SdkworkVipAdminPackage }
  | null;
type VipPackageGroupModal = { mode: "create" | "edit"; item?: SdkworkVipAdminPackageGroup } | null;
type VipModalMode = "create" | "edit" | "confirm";
type VipModalIntent = "default" | "danger";
type VipToolbarCreateAction = {
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  title?: string;
};

const VIP_TABS: Array<{ id: VipAdminTab; icon: React.ReactNode; labelKey: string }> = [
  { id: "levels", icon: <Crown className="h-4 w-4" />, labelKey: "admin.vip.tabs.levels" },
  { id: "packages", icon: <Gift className="h-4 w-4" />, labelKey: "admin.vip.tabs.packages" },
  { id: "memberships", icon: <Users className="h-4 w-4" />, labelKey: "admin.vip.tabs.memberships" },
  { id: "entitlements", icon: <Sparkles className="h-4 w-4" />, labelKey: "admin.vip.tabs.entitlements" },
];

const levelStatusOptions: SdkworkVipAdminLevelUpdateInput["status"][] = ["active", "inactive", "disabled"];
const packageStatusOptions: SdkworkVipAdminPackageUpdateInput["status"][] = ["active", "inactive", "disabled"];
const packageGroupStatusOptions: SdkworkVipAdminPackageGroupMutationInput["status"][] = ["active", "inactive", "disabled"];
const membershipStatusOptions: SdkworkVipAdminMembershipUpdateInput["status"][] = [
  "active",
  "inactive",
  "expired",
  "suspended",
  "cancelled",
];

const VIP_STATUS_LABEL_KEYS: Record<string, string> = {
  active: "admin.vip.status.active",
  inactive: "admin.vip.status.inactive",
  disabled: "admin.vip.status.disabled",
  expired: "admin.vip.status.expired",
  suspended: "admin.vip.status.suspended",
  cancelled: "admin.vip.status.cancelled",
  exhausted: "admin.vip.status.exhausted",
};

export function SdkworkVipAdminPage({
  controller: controllerProp,
  locale,
  messages,
}: SdkworkVipAdminPageProps) {
  const copy = createSdkworkVipAdminMessages(locale, messages);
  const t = useMemo(() => createVipAdminTranslator(copy), [copy]);
  const controller = useSdkworkVipAdminController(controllerProp);
  const state = useSdkworkVipAdminControllerState(controller);
  const activeTab = state.activeView;
  const [search, setSearch] = useState("");
  const [selectedPackageGroupId, setSelectedPackageGroupId] = useState<string | null>(null);
  const [levelModal, setLevelModal] = useState<VipLevelModal>(null);
  const [packageModal, setPackageModal] = useState<VipPackageModal>(null);
  const [groupModal, setGroupModal] = useState<VipPackageGroupModal>(null);
  const [packagePickerGroup, setPackagePickerGroup] = useState<SdkworkVipAdminPackageGroup | null>(null);
  const [disableLevelTarget, setDisableLevelTarget] = useState<SdkworkVipAdminLevel | null>(null);
  const [deletePackageTarget, setDeletePackageTarget] = useState<SdkworkVipAdminPackage | null>(null);
  const [deleteGroupTarget, setDeleteGroupTarget] = useState<SdkworkVipAdminPackageGroup | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!state.isBootstrapped && !state.isLoading) {
      void controller.bootstrap();
    }
  }, [controller, state.isBootstrapped, state.isLoading]);

  const levels = state.dashboard.levels;
  const packages = state.dashboard.packages;
  const packageGroups = state.dashboard.packageGroups;
  const memberships = state.dashboard.memberships;
  const entitlements = state.dashboard.entitlements;
  const normalizedSearch = search.trim().toLowerCase();
  const filteredLevels = useMemo(
    () => filterItems(levels, normalizedSearch, ["id", "code", "name", "status"]),
    [levels, normalizedSearch],
  );
  const searchedPackages = useMemo(
    () => filterItems(packages, normalizedSearch, ["id", "code", "groupId", "name", "levelId", "status"]),
    [packages, normalizedSearch],
  );
  const filteredMemberships = useMemo(
    () => filterItems(memberships, normalizedSearch, ["id", "ownerUserId", "levelCode", "status"]),
    [memberships, normalizedSearch],
  );
  const filteredEntitlements = useMemo(
    () => filterItems(entitlements, normalizedSearch, ["id", "code", "levelId", "membershipId", "status"]),
    [entitlements, normalizedSearch],
  );
  const sortedPackageGroups = useMemo(() => sortVipPackageGroups(packageGroups), [packageGroups]);
  const selectedPackageGroup = useMemo(() => {
    if (selectedPackageGroupId) {
      return sortedPackageGroups.find((group) => group.id === selectedPackageGroupId) ?? null;
    }
    return sortedPackageGroups[0] ?? null;
  }, [selectedPackageGroupId, sortedPackageGroups]);
  const selectedPackageGroupPackages = useMemo(
    () => selectedPackageGroup
      ? searchedPackages.filter((item) => item.groupId === selectedPackageGroup.id)
      : [],
    [searchedPackages, selectedPackageGroup],
  );
  const packagePickerAvailablePackages = useMemo(
    () => packagePickerGroup
      ? sortVipPackages(packages.filter((item) => item.groupId !== packagePickerGroup.id))
      : [],
    [packagePickerGroup, packages],
  );
  const createLevelModalOpen = levelModal?.mode === "create";
  const createPackageModalOpen = packageModal?.mode === "create";
  const createGroupModalOpen = groupModal?.mode === "create";
  const activeLevels = useMemo(() => levels.filter(isActiveVipCatalogItem), [levels]);
  const activePackageGroups = useMemo(() => packageGroups.filter(isActiveVipCatalogItem), [packageGroups]);
  const canCreatePackage = activeLevels.length > 0 && activePackageGroups.length > 0;
  const createPackageDisabledReason = !activeLevels.length
    ? t("admin.vip.errors.activeLevelRequired", "Create an active VIP level before adding packages.")
    : !activePackageGroups.length
      ? t("admin.vip.errors.activePackageGroupRequired", "Create an active VIP package group before adding packages.")
      : undefined;
  const activeLevelOptions = useMemo(
    () => createLevelOptions(levels, packageModal?.mode === "edit" ? packageModal.item.levelId : undefined),
    [levels, packageModal],
  );
  const packageModalDefaultGroupId = packageModal?.mode === "create" ? packageModal.defaultGroupId : packageModal?.item.groupId;
  const activePackageGroupOptions = useMemo(
    () => createPackageGroupOptions(packageGroups, packageModalDefaultGroupId),
    [packageGroups, packageModalDefaultGroupId],
  );
  const modalCloseLabel = t("admin.vip.actions.closeModal", "Close modal");
  const hasOpenModal = Boolean(
    levelModal
      || packageModal
      || groupModal
      || packagePickerGroup
      || disableLevelTarget
      || deletePackageTarget
      || deleteGroupTarget,
  );

  useEffect(() => {
    setSelectedPackageGroupId((current) => {
      if (current && sortedPackageGroups.some((group) => group.id === current)) {
        return current;
      }
      return sortedPackageGroups[0]?.id ?? null;
    });
  }, [sortedPackageGroups]);

  const loadVipData = useCallback(async () => {
    setSaveError(null);
    await controller.refresh();
  }, [controller]);
  const openCreateLevel = () => {
    setSaveError(null);
    setLevelModal({ mode: "create" });
  };
  const openCreatePackage = (defaultGroupId?: string) => {
    if (!canCreatePackage) {
      return;
    }
    setSaveError(null);
    setPackageModal({ mode: "create", defaultGroupId });
  };
  const openCreateGroup = () => {
    setSaveError(null);
    setGroupModal({ mode: "create" });
  };
  const openEditLevel = (item: SdkworkVipAdminLevel) => {
    setSaveError(null);
    setLevelModal({ mode: "edit", item });
  };
  const openEditPackage = (item: SdkworkVipAdminPackage) => {
    setSaveError(null);
    setPackageModal({ mode: "edit", item });
  };
  const openEditGroup = (item: SdkworkVipAdminPackageGroup) => {
    setSaveError(null);
    setGroupModal({ mode: "edit", item });
  };
  const openDisableLevel = (item: SdkworkVipAdminLevel) => {
    setSaveError(null);
    setDisableLevelTarget(item);
  };
  const openDeletePackage = (item: SdkworkVipAdminPackage) => {
    setSaveError(null);
    setDeletePackageTarget(item);
  };
  const openDeleteGroup = (item: SdkworkVipAdminPackageGroup) => {
    setSaveError(null);
    setDeleteGroupTarget(item);
  };
  const openAddPackagesToGroup = (group: SdkworkVipAdminPackageGroup) => {
    setSaveError(null);
    setPackagePickerGroup(group);
  };
  const onCreateLevel = () => openCreateLevel();
  const onCreatePackage = () => openCreatePackage(selectedPackageGroup && isActiveVipCatalogItem(selectedPackageGroup) ? selectedPackageGroup.id : undefined);
  const toolbarCreateAction = createToolbarCreateAction({
    activeTab,
    canCreatePackage,
    createPackageDisabledReason,
    onCreateLevel,
    onCreatePackage,
    t,
  });

  async function handleLevelSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      const input = readLevelForm(new FormData(event.currentTarget));
      if (levelModal?.mode === "edit" && levelModal.item) {
        await controller.updateLevel(levelModal.item.id, input);
      } else {
        await controller.createLevel(input);
      }
      setLevelModal(null);
    } catch (error) {
      setSaveError(getVipErrorMessage(
        error,
        levelModal?.mode === "create" ? "admin.vip.errors.levelCreateFallback" : "admin.vip.errors.saveLevelFallback",
        "Failed to save VIP level.",
        t,
      ));
    } finally {
      setSaving(false);
    }
  }

  async function handlePackageSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      const input = readPackageForm(new FormData(event.currentTarget));
      assertPackageCatalogSelection(input, activeLevels, activePackageGroups);
      if (packageModal?.mode === "edit" && packageModal.item) {
        await controller.updatePackage(packageModal.item.id, input);
      } else {
        await controller.createPackage(input);
      }
      setPackageModal(null);
    } catch (error) {
      setSaveError(getVipErrorMessage(error, "admin.vip.errors.savePackageFallback", "Failed to save VIP package.", t));
    } finally {
      setSaving(false);
    }
  }

  async function handleGroupSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      const input = readPackageGroupForm(new FormData(event.currentTarget));
      if (groupModal?.mode === "edit" && groupModal.item) {
        await controller.updatePackageGroup(groupModal.item.id, input);
        setSelectedPackageGroupId(groupModal.item.id);
      } else {
        await controller.createPackageGroup(input);
      }
      setGroupModal(null);
    } catch (error) {
      setSaveError(getVipErrorMessage(
        error,
        groupModal?.mode === "create"
          ? "admin.vip.errors.packageGroupCreateFallback"
          : "admin.vip.errors.packageGroupSaveFallback",
        "Failed to save VIP package group.",
        t,
      ));
    } finally {
      setSaving(false);
    }
  }

  async function handleDisableLevelConfirm() {
    if (!disableLevelTarget) {
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      await controller.deleteLevel(disableLevelTarget.id);
      setDisableLevelTarget(null);
    } catch (error) {
      setSaveError(getVipErrorMessage(error, "admin.vip.errors.levelDeleteFallback", "Failed to disable VIP level.", t));
    } finally {
      setSaving(false);
    }
  }

  async function handleDeletePackageConfirm() {
    if (!deletePackageTarget) {
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      await controller.deletePackage(deletePackageTarget.id);
      setDeletePackageTarget(null);
    } catch (error) {
      setSaveError(getVipErrorMessage(error, "admin.vip.errors.packageDeleteFallback", "Failed to delete VIP package.", t));
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteGroupConfirm() {
    if (!deleteGroupTarget) {
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      await controller.deletePackageGroup(deleteGroupTarget.id);
      setDeleteGroupTarget(null);
    } catch (error) {
      setSaveError(getVipErrorMessage(error, "admin.vip.errors.packageGroupDeleteFallback", "Failed to delete VIP package group.", t));
    } finally {
      setSaving(false);
    }
  }

  async function handleAddPackagesToGroup(packageIds: string[]) {
    if (!packagePickerGroup || packageIds.length === 0) {
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const selectedItems = packages.filter((item) => packageIds.includes(item.id));
      await controller.assignPackagesToGroup(selectedItems, packagePickerGroup.id);
      setPackagePickerGroup(null);
    } catch (error) {
      setSaveError(getVipErrorMessage(error, "admin.vip.errors.packageSaveFallback", "Failed to save VIP package.", t));
    } finally {
      setSaving(false);
    }
  }

  async function handleMembershipStatusChange(
    membershipId: string,
    status: SdkworkVipAdminMembershipUpdateInput["status"],
  ) {
    setSaving(true);
    setSaveError(null);
    try {
      await controller.updateMembershipStatus(membershipId, { status });
    } catch (error) {
      setSaveError(getVipErrorMessage(
        error,
        "admin.vip.errors.membershipStatusFallback",
        "Failed to update VIP membership status.",
        t,
      ));
    } finally {
      setSaving(false);
    }
  }

  const loadState = renderLoadState(state.isLoading && !state.isBootstrapped, state.lastError ?? null, () => void loadVipData(), t);

  return (
    <div className="flex h-full min-h-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#1a1a1a]">
      <aside className="flex w-56 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-white/10 dark:bg-[#161616]">
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
          {VIP_TABS.map((tab) => (
            <button
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-slate-100 text-slate-950 dark:bg-white/10 dark:text-white"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
              }`}
              key={tab.id}
              onClick={() => {
                controller.setView(tab.id);
                setSearch("");
              }}
              type="button"
            >
              {tab.icon}
              {t(tab.labelKey)}
            </button>
          ))}
        </nav>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="border-b border-slate-200 px-4 py-3 dark:border-white/10">
          <h1 className="sr-only">{copy.page.title}</h1>
          <VipToolbar
            createAction={toolbarCreateAction}
            onRefresh={() => void loadVipData()}
            onSearchChange={setSearch}
            refreshLabel={t("admin.vip.actions.refresh")}
            searchPlaceholder={t("admin.vip.filters.search")}
            searchValue={search}
          />
        </header>

        <div className="min-h-0 flex-1 overflow-auto p-4">
          {loadState ?? (
            <div className="flex h-full min-h-0 flex-col">
              {saveError && !hasOpenModal ? (
                <VipStatePanel
                  className="mb-4 shrink-0"
                  description={saveError}
                  kind="error"
                  onRetry={() => setSaveError(null)}
                  retryLabel={t("common.retry")}
                  title={t("admin.vip.states.saveErrorTitle")}
                />
              ) : null}
              {activeTab === "levels" ? (
                <LevelsPanel
                  items={filteredLevels}
                  onDisable={openDisableLevel}
                  onEdit={openEditLevel}
                  t={t}
                />
              ) : null}
              {activeTab === "packages" ? (
                <PackageGroupsWorkspace
                  groups={sortedPackageGroups}
                  items={selectedPackageGroup ? selectedPackageGroupPackages : []}
                  onAddPackages={openAddPackagesToGroup}
                  onCreateGroup={openCreateGroup}
                  onDeleteGroup={openDeleteGroup}
                  onEditGroup={openEditGroup}
                  onEmptyAdd={() => selectedPackageGroup ? openAddPackagesToGroup(selectedPackageGroup) : undefined}
                  onPackageDelete={openDeletePackage}
                  onPackageEdit={openEditPackage}
                  onSelectGroup={(groupId) => setSelectedPackageGroupId(groupId)}
                  packages={packages}
                  selectedGroup={selectedPackageGroup}
                  t={t}
                />
              ) : null}
              {activeTab === "memberships" ? (
                <MembershipsTable
                  items={filteredMemberships}
                  onStatusChange={(id, status) => void handleMembershipStatusChange(id, status)}
                  saving={saving}
                  t={t}
                />
              ) : null}
              {activeTab === "entitlements" ? <EntitlementsTable items={filteredEntitlements} t={t} /> : null}
            </div>
          )}
        </div>
      </section>

      {levelModal ? (
        <VipModal
          closeLabel={modalCloseLabel}
          mode={levelModal.mode}
          onClose={() => !saving && setLevelModal(null)}
          title={levelModal.mode === "create"
            ? t("admin.vip.modals.createLevelTitle")
            : t("admin.vip.modals.editLevelTitle")}
        >
          <LevelForm
            item={levelModal.item}
            onCancel={() => !saving && setLevelModal(null)}
            onSubmit={(event) => void handleLevelSubmit(event)}
            saving={saving}
            saveError={saveError}
            t={t}
          />
        </VipModal>
      ) : null}

      {packageModal ? (
        <VipModal
          closeLabel={modalCloseLabel}
          mode={packageModal.mode}
          onClose={() => !saving && setPackageModal(null)}
          title={packageModal.mode === "create"
            ? t("admin.vip.modals.createPackageTitle")
            : t("admin.vip.modals.editPackageTitle")}
        >
          <PackageForm
            groupOptions={activePackageGroupOptions}
            item={packageModal.item}
            levelOptions={activeLevelOptions}
            onCancel={() => !saving && setPackageModal(null)}
            onSubmit={(event) => void handlePackageSubmit(event)}
            saving={saving}
            saveError={saveError}
            t={t}
          />
        </VipModal>
      ) : null}

      {groupModal ? (
        <VipModal
          closeLabel={modalCloseLabel}
          mode={groupModal.mode}
          onClose={() => !saving && setGroupModal(null)}
          title={groupModal.mode === "create"
            ? t("admin.vip.modals.createGroupTitle")
            : t("admin.vip.modals.editGroupTitle")}
        >
          <PackageGroupForm
            item={groupModal.item}
            onCancel={() => !saving && setGroupModal(null)}
            onSubmit={(event) => void handleGroupSubmit(event)}
            saving={saving}
            saveError={saveError}
            t={t}
          />
        </VipModal>
      ) : null}

      {packagePickerGroup ? (
        <PackageSelectionModal
          closeLabel={modalCloseLabel}
          group={packagePickerGroup}
          items={packagePickerAvailablePackages}
          onClose={() => !saving && setPackagePickerGroup(null)}
          onSubmit={(ids) => void handleAddPackagesToGroup(ids)}
          saving={saving}
          saveError={saveError}
          t={t}
        />
      ) : null}

      {disableLevelTarget ? (
        <VipModal
          closeLabel={modalCloseLabel}
          intent="danger"
          onClose={() => !saving && setDisableLevelTarget(null)}
          title={t("admin.vip.modals.disableLevelTitle")}
        >
          <ConfirmPanel
            confirmLabel={t("admin.vip.actions.disable")}
            description={disableLevelTarget.name}
            disabled={saving}
            error={saveError}
            icon={<Ban className="h-5 w-5" />}
            onCancel={() => !saving && setDisableLevelTarget(null)}
            onConfirm={() => void handleDisableLevelConfirm()}
            title={t("admin.vip.modals.disableLevelTitle")}
            t={t}
          />
        </VipModal>
      ) : null}

      {deletePackageTarget ? (
        <VipModal
          closeLabel={modalCloseLabel}
          intent="danger"
          onClose={() => !saving && setDeletePackageTarget(null)}
          title={t("admin.vip.modals.deletePackageTitle")}
        >
          <ConfirmPanel
            confirmLabel={t("admin.vip.actions.delete")}
            description={deletePackageTarget.name}
            disabled={saving}
            error={saveError}
            icon={<Trash2 className="h-5 w-5" />}
            onCancel={() => !saving && setDeletePackageTarget(null)}
            onConfirm={() => void handleDeletePackageConfirm()}
            title={t("admin.vip.modals.deletePackageTitle")}
            t={t}
          />
        </VipModal>
      ) : null}

      {deleteGroupTarget ? (
        <VipModal
          closeLabel={modalCloseLabel}
          intent="danger"
          onClose={() => !saving && setDeleteGroupTarget(null)}
          title={t("admin.vip.modals.deleteGroupTitle")}
        >
          <ConfirmPanel
            confirmLabel={t("admin.vip.actions.delete")}
            description={deleteGroupTarget.name}
            disabled={saving}
            error={saveError}
            icon={<Trash2 className="h-5 w-5" />}
            onCancel={() => !saving && setDeleteGroupTarget(null)}
            onConfirm={() => void handleDeleteGroupConfirm()}
            title={t("admin.vip.modals.deleteGroupTitle")}
            t={t}
          />
        </VipModal>
      ) : null}

      <span className="hidden" data-modal-state={`${createLevelModalOpen}-${createPackageModalOpen}-${createGroupModalOpen}`} />
    </div>
  );
}

function createVipAdminTranslator(copy: ReturnType<typeof createSdkworkVipAdminMessages>): TranslationFunction {
  return (key, fallback = key) => copy.ui[key] ?? fallback;
}

function VipToolbar({
  createAction,
  onRefresh,
  onSearchChange,
  refreshLabel,
  searchPlaceholder,
  searchValue,
}: {
  createAction: VipToolbarCreateAction | null;
  onRefresh: () => void;
  onSearchChange: (value: string) => void;
  refreshLabel: string;
  searchPlaceholder: string;
  searchValue: string;
}) {
  return (
    <div className="flex flex-nowrap items-center gap-3">
      <label className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-amber-500 dark:border-white/10 dark:bg-[#1e1e1e] dark:text-white"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          value={searchValue}
        />
      </label>
      <button
        className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
        onClick={onRefresh}
        type="button"
      >
        <RefreshCcw className="h-4 w-4" />
        {refreshLabel}
      </button>
      {createAction ? (
        <button
          className="inline-flex h-9 items-center gap-2 rounded-md bg-amber-600 px-3 text-sm font-medium text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={createAction.disabled}
          onClick={createAction.onClick}
          title={createAction.title}
          type="button"
        >
          {createAction.icon}
          {createAction.label}
        </button>
      ) : null}
    </div>
  );
}

function LevelsPanel({
  items,
  onDisable,
  onEdit,
  t,
}: {
  items: SdkworkVipAdminLevel[];
  onDisable: (item: SdkworkVipAdminLevel) => void;
  onEdit: (item: SdkworkVipAdminLevel) => void;
  t: TranslationFunction;
}) {
  return (
    <VipTable
      columns={[
        t("admin.vip.table.id", "ID"),
        t("admin.vip.fields.code", "Code"),
        t("admin.vip.fields.name", "Name"),
        t("admin.vip.fields.rank", "Rank"),
        t("admin.vip.fields.status", "Status"),
        t("admin.vip.table.operations", "Operations"),
      ]}
      emptyTitle={t("admin.vip.empty.levels", "No VIP levels found")}
      hasRows={items.length > 0}
    >
      {items.map((item) => (
        <tr key={item.id}>
          <MonoCell value={item.id} />
          <MonoCell value={item.code} />
          <td className="px-4 py-3">{item.name}</td>
          <td className="px-4 py-3">{item.rank}</td>
          <StatusCell t={t} value={item.status} />
          <ActionCell>
            <ActionButton icon={<Edit3 className="h-3.5 w-3.5" />} label={t("admin.vip.actions.edit", "Edit")} onClick={() => onEdit(item)} />
            <ActionButton icon={<Ban className="h-3.5 w-3.5" />} label={t("admin.vip.actions.disable", "Disable")} onClick={() => onDisable(item)} tone="danger" />
          </ActionCell>
        </tr>
      ))}
    </VipTable>
  );
}

function PackagesPanel({
  emptyAction,
  emptyTitle,
  items,
  onDelete,
  onEdit,
  t,
}: {
  emptyAction?: { label: string; onClick: () => void };
  emptyTitle: string;
  items: SdkworkVipAdminPackage[];
  onDelete: (item: SdkworkVipAdminPackage) => void;
  onEdit: (item: SdkworkVipAdminPackage) => void;
  t: TranslationFunction;
}) {
  return (
    <VipTable
      columns={[
        t("admin.vip.table.id", "ID"),
        t("admin.vip.fields.name", "Name"),
        t("admin.vip.fields.level", "Level"),
        t("admin.vip.table.group", "Group"),
        t("admin.vip.fields.durationDays", "Duration days"),
        t("admin.vip.fields.price", "Price"),
        t("admin.vip.fields.status", "Status"),
        t("admin.vip.table.operations", "Operations"),
      ]}
      emptyAction={emptyAction}
      emptyTitle={emptyTitle}
      hasRows={items.length > 0}
    >
      {items.map((item) => (
        <tr key={item.id}>
          <MonoCell value={item.id} />
          <td className="px-4 py-3">{item.name}</td>
          <MonoCell value={item.levelId} />
          <MonoCell value={item.groupId} />
          <td className="px-4 py-3">{item.durationDays}</td>
          <td className="px-4 py-3">{item.priceAmount} {item.currencyCode}</td>
          <StatusCell t={t} value={item.status} />
          <ActionCell>
            <ActionButton icon={<Edit3 className="h-3.5 w-3.5" />} label={t("admin.vip.actions.edit", "Edit")} onClick={() => onEdit(item)} />
            <ActionButton icon={<Trash2 className="h-3.5 w-3.5" />} label={t("admin.vip.actions.delete", "Delete")} onClick={() => onDelete(item)} tone="danger" />
          </ActionCell>
        </tr>
      ))}
    </VipTable>
  );
}

function PackageGroupsWorkspace({
  groups,
  items,
  onAddPackages,
  onCreateGroup,
  onDeleteGroup,
  onEditGroup,
  onEmptyAdd,
  onPackageDelete,
  onPackageEdit,
  onSelectGroup,
  packages,
  selectedGroup,
  t,
}: {
  groups: SdkworkVipAdminPackageGroup[];
  items: SdkworkVipAdminPackage[];
  onAddPackages: (group: SdkworkVipAdminPackageGroup) => void;
  onCreateGroup: () => void;
  onDeleteGroup: (group: SdkworkVipAdminPackageGroup) => void;
  onEditGroup: (group: SdkworkVipAdminPackageGroup) => void;
  onEmptyAdd: () => void | undefined;
  onPackageDelete: (item: SdkworkVipAdminPackage) => void;
  onPackageEdit: (item: SdkworkVipAdminPackage) => void;
  onSelectGroup: (groupId: string) => void;
  packages: SdkworkVipAdminPackage[];
  selectedGroup: SdkworkVipAdminPackageGroup | null;
  t: TranslationFunction;
}) {
  return (
    <VipTableSection>
      <div className="flex min-h-0 flex-1 gap-4">
        <aside className="flex w-72 shrink-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-[#181818]">
          <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2 dark:border-white/10">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">{t("admin.vip.labels.packageGroups", "Package groups")}</div>
            <button className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs" onClick={onCreateGroup} type="button">
              <Plus className="h-3.5 w-3.5" />
              {t("admin.vip.actions.createGroup", "Create group")}
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-auto p-2">
            {groups.length ? groups.map((group) => (
              <button
                className={`mb-2 w-full rounded-md border p-3 text-left text-sm ${
                  selectedGroup?.id === group.id
                    ? "border-amber-300 bg-amber-50 text-slate-950 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-white"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                }`}
                key={group.id}
                onClick={() => onSelectGroup(group.id)}
                type="button"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{group.name}</span>
                  <span className="text-xs">{formatVipStatus(group.status, t)}</span>
                </div>
                <div className="mt-1 text-xs text-slate-500">{group.billingCycle} / {group.durationDays}d</div>
              </button>
            )) : (
              <div className="py-10 text-center text-sm text-slate-500">{t("admin.vip.empty.packageGroups", "No VIP package groups found")}</div>
            )}
          </div>
        </aside>
        <section className="flex min-w-0 flex-1 flex-col gap-3">
          {selectedGroup ? (
            <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-[#181818]">
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 dark:text-white">{selectedGroup.name}</div>
                <div className="text-xs text-slate-500">{selectedGroup.description || selectedGroup.code}</div>
              </div>
              <div className="flex items-center gap-2">
                <ActionButton icon={<Layers className="h-3.5 w-3.5" />} label={t("admin.vip.actions.addPackageToGroup", "Add package to group")} onClick={() => onAddPackages(selectedGroup)} />
                <ActionButton icon={<Edit3 className="h-3.5 w-3.5" />} label={t("admin.vip.actions.edit", "Edit")} onClick={() => onEditGroup(selectedGroup)} />
                <ActionButton icon={<Trash2 className="h-3.5 w-3.5" />} label={t("admin.vip.actions.delete", "Delete")} onClick={() => onDeleteGroup(selectedGroup)} tone="danger" />
              </div>
            </div>
          ) : (
            <VipStatePanel kind="empty" title={t("admin.vip.empty.noPackageGroupSelected", "Select a package group first")} />
          )}
          <PackagesPanel
            emptyAction={selectedGroup && onEmptyAdd ? { label: t("admin.vip.actions.addPackageToGroup", "Add package to group"), onClick: onEmptyAdd } : undefined}
            emptyTitle={t("admin.vip.empty.groupPackages", "No packages in this group")}
            items={items}
            onDelete={onPackageDelete}
            onEdit={onPackageEdit}
            t={t}
          />
          <span className="hidden" data-package-count={packages.length} />
        </section>
      </div>
    </VipTableSection>
  );
}

function MembershipsTable({
  items,
  onStatusChange,
  saving,
  t,
}: {
  items: SdkworkVipAdminMembership[];
  onStatusChange: (membershipId: string, status: SdkworkVipAdminMembershipUpdateInput["status"]) => void;
  saving: boolean;
  t: TranslationFunction;
}) {
  return (
    <VipTable
      columns={[
        t("admin.vip.table.id", "ID"),
        t("admin.vip.table.user", "User"),
        t("admin.vip.fields.level", "Level"),
        t("admin.vip.table.started", "Started"),
        t("admin.vip.table.expires", "Expires"),
        t("admin.vip.fields.status", "Status"),
      ]}
      emptyTitle={t("admin.vip.empty.memberships", "No VIP memberships found")}
      hasRows={items.length > 0}
    >
      {items.map((item) => (
        <tr key={item.id}>
          <MonoCell value={item.id} />
          <MonoCell value={item.ownerUserId} />
          <MonoCell value={item.levelCode} />
          <td className="px-4 py-3">{item.startedAt}</td>
          <td className="px-4 py-3">{item.expiresAt}</td>
          <td className="px-4 py-3">
            <select
              aria-label={`Membership status for ${item.id}`}
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm dark:border-white/10 dark:bg-[#202020]"
              disabled={saving}
              onChange={(event) => onStatusChange(item.id, readMembershipStatusValue(event.target.value))}
              value={item.status}
            >
              {createStatusOptions(membershipStatusOptions, t).map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </td>
        </tr>
      ))}
    </VipTable>
  );
}

function EntitlementsTable({ items, t }: { items: SdkworkVipAdminPackage[] | SdkworkVipAdminMembership[] | Array<{ id: string; code: string; levelId: string; membershipId: string; quota: string; status: string }>; t: TranslationFunction }) {
  return (
    <VipTable
      columns={[
        t("admin.vip.table.id", "ID"),
        t("admin.vip.fields.code", "Code"),
        t("admin.vip.fields.level", "Level"),
        t("admin.vip.table.user", "Membership"),
        t("admin.vip.fields.status", "Status"),
      ]}
      emptyTitle={t("admin.vip.empty.entitlements", "No VIP entitlements found")}
      hasRows={items.length > 0}
    >
      {items.map((item) => (
        <tr key={item.id}>
          <MonoCell value={item.id} />
          <MonoCell value={"code" in item ? item.code : item.id} />
          <MonoCell value={"levelId" in item ? item.levelId : "-"} />
          <MonoCell value={"membershipId" in item ? item.membershipId : "-"} />
          <StatusCell t={t} value={"status" in item ? item.status : "active"} />
        </tr>
      ))}
    </VipTable>
  );
}

function LevelForm({ item, onCancel, onSubmit, saveError, saving, t }: {
  item?: SdkworkVipAdminLevel;
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  saveError?: string | null;
  saving: boolean;
  t: TranslationFunction;
}) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <ModalError error={saveError} />
      <FormHeader icon={<Crown className="h-4 w-4" />} title={t("admin.vip.forms.levelDefinition", "Level Definition")} />
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField defaultValue={item?.code} label={t("admin.vip.fields.code", "Code")} name="code" placeholder="pro" required />
        <TextField defaultValue={item?.name} label={t("admin.vip.fields.name", "Name")} name="name" placeholder="Pro" required />
        <TextField defaultValue={item?.rank === undefined ? "0" : String(item.rank)} label={t("admin.vip.fields.rank", "Rank")} min={0} name="rank" placeholder="10" required type="number" />
        <SelectField defaultValue={item?.status ?? "active"} label={t("admin.vip.fields.status", "Status")} name="status" options={createStatusOptions(levelStatusOptions, t)} required />
      </div>
      <ModalActions cancelLabel={t("admin.vip.actions.cancel", "Cancel")} disabled={saving} onCancel={onCancel} submitLabel={item ? t("admin.vip.actions.saveLevel", "Save level") : t("admin.vip.modals.createLevelTitle", "Create VIP level")} />
    </form>
  );
}

function PackageForm({ groupOptions, item, levelOptions, onCancel, onSubmit, saveError, saving, t }: {
  groupOptions: SelectOption[];
  item?: SdkworkVipAdminPackage;
  levelOptions: SelectOption[];
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  saveError?: string | null;
  saving: boolean;
  t: TranslationFunction;
}) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <ModalError error={saveError} />
      <FormHeader icon={<Gift className="h-4 w-4" />} title={t("admin.vip.forms.purchasePackage", "Purchase Package")} />
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField defaultValue={item?.code} label={t("admin.vip.fields.code", "Code")} name="code" placeholder="pro-monthly" required />
        <TextField defaultValue={item?.name} label={t("admin.vip.fields.name", "Name")} name="name" placeholder="Pro Monthly" required />
        <SelectField defaultValue={item?.levelId ?? levelOptions[0]?.value} label={t("admin.vip.fields.level", "Level")} name="levelId" options={levelOptions} required />
        <SelectField defaultValue={item?.groupId ?? groupOptions[0]?.value} label={t("admin.vip.fields.packageGroup", "Package Group")} name="groupId" options={groupOptions} required />
        <TextField defaultValue={item?.durationDays === undefined ? "30" : String(item.durationDays)} label={t("admin.vip.fields.durationDays", "Duration days")} min={1} name="durationDays" placeholder="30" required type="number" />
        <TextField defaultValue={item?.priceAmount ?? "0.00"} label={t("admin.vip.fields.price", "Price")} name="priceAmount" placeholder="199.00" required />
        <TextField defaultValue={item?.currencyCode ?? "CNY"} label={t("admin.vip.fields.currency", "Currency")} name="currencyCode" placeholder="CNY" required />
        <SelectField defaultValue={item?.status ?? "active"} label={t("admin.vip.fields.status", "Status")} name="status" options={createStatusOptions(packageStatusOptions, t)} required />
      </div>
      <ModalActions cancelLabel={t("admin.vip.actions.cancel", "Cancel")} disabled={saving} onCancel={onCancel} submitLabel={item ? t("admin.vip.actions.savePackage", "Save package") : t("admin.vip.actions.createPackage", "Create package")} />
    </form>
  );
}

function PackageGroupForm({ item, onCancel, onSubmit, saveError, saving, t }: {
  item?: SdkworkVipAdminPackageGroup;
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  saveError?: string | null;
  saving: boolean;
  t: TranslationFunction;
}) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <ModalError error={saveError} />
      <FormHeader icon={<Layers className="h-4 w-4" />} title={t("admin.vip.fields.packageGroup", "Package Group")} />
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField defaultValue={item?.code} label={t("admin.vip.fields.code", "Code")} name="code" placeholder="monthly" required />
        <TextField defaultValue={item?.name} label={t("admin.vip.fields.name", "Name")} name="name" placeholder="Monthly" required />
        <TextField defaultValue={item?.billingCycle ?? "monthly"} label={t("admin.vip.fields.billingCycle", "Billing cycle")} name="billingCycle" placeholder="monthly" required />
        <TextField defaultValue={item?.durationDays === undefined ? "30" : String(item.durationDays)} label={t("admin.vip.fields.durationDays", "Duration days")} min={1} name="durationDays" placeholder="30" required type="number" />
        <TextField defaultValue={item?.sortWeight === undefined ? "0" : String(item.sortWeight)} label={t("admin.vip.fields.sortWeight", "Sort weight")} min={0} name="sortWeight" placeholder="0" required type="number" />
        <SelectField defaultValue={item?.status ?? "active"} label={t("admin.vip.fields.status", "Status")} name="status" options={createStatusOptions(packageGroupStatusOptions, t)} required />
        <TextField defaultValue={item?.description ?? ""} label={t("admin.vip.fields.description", "Description")} name="description" placeholder="Optional description" />
      </div>
      <ModalActions cancelLabel={t("admin.vip.actions.cancel", "Cancel")} disabled={saving} onCancel={onCancel} submitLabel={t("admin.vip.actions.saveGroup", "Save group")} />
    </form>
  );
}

function PackageSelectionModal({
  closeLabel,
  group,
  items,
  onClose,
  onSubmit,
  saveError,
  saving,
  t,
}: {
  closeLabel: string;
  group: SdkworkVipAdminPackageGroup;
  items: SdkworkVipAdminPackage[];
  onClose: () => void;
  onSubmit: (packageIds: string[]) => void;
  saveError?: string | null;
  saving: boolean;
  t: TranslationFunction;
}) {
  const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const visibleItems = filterItems(items, search.trim().toLowerCase(), ["id", "code", "name", "levelId", "status"]);

  return (
    <VipModal
      closeLabel={closeLabel}
      mode="edit"
      onClose={onClose}
      title={t("admin.vip.modals.addPackagesToNamedGroupTitle", "Add packages to {name}").replace("{name}", group.name)}
    >
      <div className="space-y-4">
        <ModalError error={saveError} />
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-amber-500 dark:border-white/10 dark:bg-[#1e1e1e] dark:text-white"
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("admin.vip.filters.packagePickerSearch", "Search packages...")}
            value={search}
          />
        </label>
        {visibleItems.length ? (
          <div className="max-h-80 overflow-y-auto rounded-md border border-slate-200 dark:border-white/10">
            {visibleItems.map((item) => (
              <label className="flex cursor-pointer items-center gap-3 border-b border-slate-100 px-3 py-2 text-sm last:border-b-0 dark:border-white/10" key={item.id}>
                <input
                  checked={selectedPackageIds.includes(item.id)}
                  onChange={(event) => {
                    setSelectedPackageIds((current) => event.target.checked
                      ? [...current, item.id]
                      : current.filter((id) => id !== item.id));
                  }}
                  type="checkbox"
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{item.name}</span>
                  <span className="block text-xs text-slate-500">{item.code}</span>
                </span>
              </label>
            ))}
          </div>
        ) : (
          <VipStatePanel kind="empty" title={t("admin.vip.empty.noPackagesToAdd", "No packages available to add")} />
        )}
        <ModalActions
          cancelLabel={t("admin.vip.actions.cancel", "Cancel")}
          disabled={saving || selectedPackageIds.length === 0}
          onCancel={onClose}
          submitLabel={saving ? t("admin.vip.actions.saving", "Saving...") : t("admin.vip.actions.addSelectedPackages", "Add selected packages")}
        />
        <button className="hidden" onClick={() => onSubmit(selectedPackageIds)} type="button" />
        <button
          className="float-right -mt-14 inline-flex h-9 items-center rounded-md bg-amber-600 px-3 text-sm font-medium text-white disabled:opacity-60"
          disabled={saving || selectedPackageIds.length === 0}
          onClick={() => onSubmit(selectedPackageIds)}
          type="button"
        >
          {t("admin.vip.actions.addSelectedPackages", "Add selected packages")}
        </button>
      </div>
    </VipModal>
  );
}

function VipTable({
  children,
  columns,
  emptyAction,
  emptyTitle,
  hasRows,
}: {
  children: React.ReactNode;
  columns: string[];
  emptyAction?: { label: string; onClick: () => void };
  emptyTitle: string;
  hasRows: boolean;
}) {
  return (
    <div className="min-h-0 overflow-auto rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-[#1a1a1a]">
      <table className="w-full whitespace-nowrap text-left text-sm text-slate-600 dark:text-slate-400">
        <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 dark:border-white/10 dark:bg-[#121212] dark:text-slate-400">
          <tr>
            {columns.map((column) => (
              <th className="px-4 py-3 text-slate-900 dark:text-white" key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white dark:divide-white/5 dark:bg-transparent">
          {hasRows ? children : (
            <tr>
              <td className="px-4 py-8 text-center text-slate-500" colSpan={columns.length}>
                <div>{emptyTitle}</div>
                {emptyAction ? <button className="mt-3 rounded-md border border-slate-200 px-3 py-1.5 text-sm" onClick={emptyAction.onClick} type="button">{emptyAction.label}</button> : null}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function VipTableSection({ children }: { children: React.ReactNode }) {
  return <div className="flex h-full min-h-0 flex-col gap-3">{children}</div>;
}

function createToolbarCreateAction({
  activeTab,
  canCreatePackage,
  createPackageDisabledReason,
  onCreateLevel,
  onCreatePackage,
  t,
}: {
  activeTab: VipAdminTab;
  canCreatePackage: boolean;
  createPackageDisabledReason?: string;
  onCreateLevel: () => void;
  onCreatePackage: () => void;
  t: TranslationFunction;
}): VipToolbarCreateAction | null {
  if (activeTab === "levels") {
    return {
      icon: <Plus className="h-4 w-4" />,
      label: t("admin.vip.actions.createLevel", "New level"),
      onClick: onCreateLevel,
    };
  }
  if (activeTab === "packages") {
    return {
      disabled: !canCreatePackage,
      icon: <Plus className="h-4 w-4" />,
      label: t("admin.vip.actions.createPackage", "Create package"),
      onClick: onCreatePackage,
      title: createPackageDisabledReason,
    };
  }
  return null;
}

function VipModal({
  children,
  closeLabel,
  intent = "default",
  mode = "confirm",
  onClose,
  title,
}: {
  children: React.ReactNode;
  closeLabel: string;
  intent?: VipModalIntent;
  mode?: VipModalMode;
  onClose: () => void;
  title: string;
}) {
  const titleId = `vip-modal-${intent}-${mode}-title`;
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className="max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1a1a1a]"
        data-modal-mode={mode}
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className={`flex items-center justify-between border-b px-5 py-4 ${
          intent === "danger"
            ? "border-red-100 bg-red-50/60 dark:border-red-500/20 dark:bg-red-500/10"
            : "border-slate-200 dark:border-white/10"
        }`}
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-white" id={titleId}>{title}</h3>
          <button
            aria-label={closeLabel}
            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[calc(100vh-8rem)] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

function ConfirmPanel({
  confirmLabel,
  description,
  disabled,
  error,
  icon,
  onCancel,
  onConfirm,
  title,
  t,
}: {
  confirmLabel: string;
  description: string;
  disabled: boolean;
  error?: string | null;
  icon: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  t: TranslationFunction;
}) {
  return (
    <div className="space-y-5">
      <ModalError error={error} />
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="font-medium text-slate-900 dark:text-white">{title}</div>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium" disabled={disabled} onClick={onCancel} type="button">
          {t("admin.vip.actions.cancel", "Cancel")}
        </button>
        <button aria-label={t("admin.vip.actions.confirm", "Confirm")} className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60" disabled={disabled} onClick={onConfirm} type="button">
          {disabled ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertTriangle className="h-4 w-4" />}
          {disabled ? t("admin.vip.actions.saving", "Saving...") : confirmLabel}
        </button>
      </div>
    </div>
  );
}

function ModalError({ error }: { error?: string | null }) {
  if (!error) {
    return null;
  }
  return (
    <div aria-live="polite" className="mb-4 flex gap-2 rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <span className="min-w-0 leading-5">{error}</span>
    </div>
  );
}

function ModalActions({ cancelLabel, disabled, onCancel, submitLabel }: {
  cancelLabel: string;
  disabled: boolean;
  onCancel: () => void;
  submitLabel: string;
}) {
  return (
    <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 dark:border-white/10">
      <button className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium disabled:opacity-60" disabled={disabled} onClick={onCancel} type="button">
        {cancelLabel}
      </button>
      <button className="inline-flex items-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60" disabled={disabled} type="submit">
        {disabled ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
        {submitLabel}
      </button>
    </div>
  );
}

function FormHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">{icon}{title}</div>;
}

function TextField({
  defaultValue,
  label,
  min,
  name,
  placeholder,
  required,
  type = "text",
}: {
  defaultValue?: string;
  label: string;
  min?: number;
  name: string;
  placeholder: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
      {label}
      <input
        className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-amber-500 dark:border-white/10 dark:bg-[#1e1e1e] dark:text-white"
        defaultValue={defaultValue}
        min={min}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </label>
  );
}

function SelectField({ defaultValue, label, name, options, required }: {
  defaultValue?: string;
  label: string;
  name: string;
  options: SelectOption[];
  required?: boolean;
}) {
  return (
    <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
      {label}
      <select className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm" defaultValue={defaultValue} name={name} required={required}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

function MonoCell({ value }: { value: string | number }) {
  return <td className="px-4 py-3 font-mono text-xs">{value}</td>;
}

function StatusCell({ value, t }: { value: string; t: TranslationFunction }) {
  const active = value === "active";
  return (
    <td className="px-4 py-3">
      <span className={`rounded px-2 py-1 text-xs ${active ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"}`}>
        {formatVipStatus(value, t)}
      </span>
    </td>
  );
}

function ActionCell({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3"><div className="flex items-center gap-2">{children}</div></td>;
}

function ActionButton({ disabled, icon, label, onClick, tone = "default" }: {
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  tone?: VipModalIntent;
}) {
  const toneClass = tone === "danger" ? "hover:border-red-200 hover:bg-red-50 hover:text-red-600" : "hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900";
  return (
    <button className={`inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-500 transition-colors disabled:opacity-50 ${toneClass}`} disabled={disabled} onClick={onClick} type="button">
      {icon}
      {label}
    </button>
  );
}

function renderLoadState(loading: boolean, loadError: string | null, onRetry: () => void, t: TranslationFunction) {
  if (loading) {
    return <VipStatePanel className="h-full" kind="loading" title={t("admin.vip.states.loading", "Loading VIP management data...")} />;
  }
  if (loadError) {
    return (
      <VipStatePanel
        className="h-full"
        description={loadError}
        kind="error"
        onRetry={onRetry}
        retryLabel={t("common.retry", "Retry")}
        title={t("admin.vip.states.loadError", "VIP management data could not be loaded")}
      />
    );
  }
  return null;
}

function VipStatePanel({ className = "", description, kind, onRetry, retryLabel, title }: {
  className?: string;
  description?: string;
  kind: "empty" | "error" | "loading";
  onRetry?: () => void;
  retryLabel?: string;
  title: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-lg border border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-white/10 ${className}`} data-state-kind={kind}>
      <div className="font-medium text-slate-900 dark:text-white">{title}</div>
      {description ? <div className="mt-1">{description}</div> : null}
      {onRetry && retryLabel ? <button className="mt-3 rounded-md border border-slate-200 px-3 py-1.5" onClick={onRetry} type="button">{retryLabel}</button> : null}
    </div>
  );
}

function readLevelForm(form: FormData): SdkworkVipAdminLevelUpdateInput {
  return {
    code: readFormString(form, "code"),
    name: readFormString(form, "name"),
    rank: readNonNegativeInteger(form, "rank", "admin.vip.errors.invalidRank"),
    status: readLevelStatus(form, "status"),
  };
}

function readPackageForm(form: FormData): SdkworkVipAdminPackageUpdateInput {
  return {
    code: readFormString(form, "code"),
    currencyCode: readFormString(form, "currencyCode") || "CNY",
    durationDays: readPositiveInteger(form, "durationDays", "admin.vip.errors.invalidDurationDays"),
    groupId: readFormString(form, "groupId"),
    levelId: readFormString(form, "levelId"),
    name: readFormString(form, "name"),
    priceAmount: readFormString(form, "priceAmount"),
    status: readPackageStatus(form, "status"),
  };
}

function readPackageGroupForm(form: FormData): SdkworkVipAdminPackageGroupMutationInput {
  return {
    billingCycle: readFormString(form, "billingCycle"),
    code: readFormString(form, "code"),
    description: readFormString(form, "description") || null,
    durationDays: readPositiveInteger(form, "durationDays", "admin.vip.errors.invalidDurationDays"),
    name: readFormString(form, "name"),
    sortWeight: readNonNegativeInteger(form, "sortWeight", "admin.vip.errors.invalidSortWeight"),
    status: readPackageGroupStatus(form, "status"),
  };
}

function readFormString(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readPositiveInteger(form: FormData, key: string, errorKey: string): number {
  const value = readInteger(form, key, errorKey);
  if (value <= 0) {
    throw new Error(errorKey);
  }
  return value;
}

function readNonNegativeInteger(form: FormData, key: string, errorKey: string): number {
  const value = readInteger(form, key, errorKey);
  if (value < 0) {
    throw new Error(errorKey);
  }
  return value;
}

function readInteger(form: FormData, key: string, errorKey: string): number {
  const rawValue = readFormString(form, key);
  if (!rawValue) {
    throw new Error(errorKey);
  }
  const value = Number(rawValue);
  if (!Number.isInteger(value)) {
    throw new Error(errorKey);
  }
  return value;
}

function readLevelStatus(form: FormData, key: string): SdkworkVipAdminLevelUpdateInput["status"] {
  return readStatusValue(readFormString(form, key), levelStatusOptions, "admin.vip.errors.invalidLevelStatus");
}

function readPackageStatus(form: FormData, key: string): SdkworkVipAdminPackageUpdateInput["status"] {
  return readStatusValue(readFormString(form, key), packageStatusOptions, "admin.vip.errors.invalidPackageStatus");
}

function readPackageGroupStatus(form: FormData, key: string): SdkworkVipAdminPackageGroupMutationInput["status"] {
  return readStatusValue(readFormString(form, key), packageGroupStatusOptions, "admin.vip.errors.invalidPackageGroupStatus");
}

function readMembershipStatusValue(value: string): SdkworkVipAdminMembershipUpdateInput["status"] {
  return readStatusValue(value, membershipStatusOptions, "admin.vip.errors.invalidMembershipStatus");
}

function readStatusValue<TStatus extends string>(value: string, options: readonly TStatus[], errorKey: string): TStatus {
  if (options.includes(value as TStatus)) {
    return value as TStatus;
  }
  throw new Error(errorKey);
}

function filterItems<T extends object>(items: T[], search: string, keys: Array<Extract<keyof T, string>>): T[] {
  if (!search) {
    return items;
  }
  return items.filter((item) => keys.some((key) => String(item[key] ?? "").toLowerCase().includes(search)));
}

function assertPackageCatalogSelection(
  input: SdkworkVipAdminPackageUpdateInput,
  activeLevels: SdkworkVipAdminLevel[],
  activePackageGroups: SdkworkVipAdminPackageGroup[],
): void {
  if (!activeLevels.some((level) => level.id === input.levelId)) {
    throw new Error("admin.vip.errors.activeLevelRequired");
  }
  if (!activePackageGroups.some((group) => group.id === input.groupId)) {
    throw new Error("admin.vip.errors.activePackageGroupRequired");
  }
}

function isActiveVipCatalogItem(item: { status: string }): boolean {
  return item.status === "active";
}

function createLevelOptions(levels: SdkworkVipAdminLevel[], currentLevelId?: string): SelectOption[] {
  return includeCurrentCatalogItem(levels.filter(isActiveVipCatalogItem), levels, currentLevelId)
    .map((level) => ({ value: level.id, label: getLevelLabel(level) }));
}

function createPackageGroupOptions(groups: SdkworkVipAdminPackageGroup[], currentGroupId?: string): SelectOption[] {
  return includeCurrentCatalogItem(groups.filter(isActiveVipCatalogItem), groups, currentGroupId)
    .map((group) => ({ value: group.id, label: getPackageGroupLabel(group) }));
}

function sortVipPackageGroups(groups: SdkworkVipAdminPackageGroup[]): SdkworkVipAdminPackageGroup[] {
  return [...groups].sort((left, right) => (
    left.sortWeight - right.sortWeight
    || left.name.localeCompare(right.name)
    || left.code.localeCompare(right.code)
    || left.id.localeCompare(right.id)
  ));
}

function sortVipPackages(items: SdkworkVipAdminPackage[]): SdkworkVipAdminPackage[] {
  return [...items].sort((left, right) => (
    left.name.localeCompare(right.name)
    || left.code.localeCompare(right.code)
    || left.id.localeCompare(right.id)
  ));
}

function includeCurrentCatalogItem<T extends { id: string }>(activeItems: T[], allItems: T[], currentId?: string): T[] {
  const current = currentId ? allItems.find((item) => item.id === currentId) : undefined;
  if (!current || activeItems.some((item) => item.id === current.id)) {
    return activeItems;
  }
  return [current, ...activeItems];
}

function createStatusOptions(statuses: readonly string[], t: TranslationFunction): SelectOption[] {
  return statuses.map((status) => ({ value: status, label: formatVipStatus(status, t) }));
}

function formatVipStatus(status: string, t: TranslationFunction): string {
  return t(VIP_STATUS_LABEL_KEYS[status] ?? status, status);
}

function getPackageGroupLabel(group: SdkworkVipAdminPackageGroup | string): string {
  if (typeof group === "string") {
    return group || "-";
  }
  return group.name ? `${group.name} (${group.code})` : group.id;
}

function getLevelLabel(level: SdkworkVipAdminLevel | string): string {
  if (typeof level === "string") {
    return level || "-";
  }
  return level.name ? `${level.name} (${level.code})` : level.id;
}

function getVipErrorMessage(error: unknown, fallbackKey: string, fallback: string, t: TranslationFunction): string {
  if (error instanceof Error) {
    const message = error.message.trim();
    if (message.startsWith("admin.vip.")) {
      return t(message, fallback);
    }
    if (message) {
      return message;
    }
  }
  return t(fallbackKey, fallback);
}
