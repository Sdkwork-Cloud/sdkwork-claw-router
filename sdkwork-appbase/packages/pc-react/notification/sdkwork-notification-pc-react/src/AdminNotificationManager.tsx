import {
  AlertCircle,
  Archive,
  BellRing,
  BellOff,
  CheckCircle2,
  Clock,
  Edit,
  Loader2,
  Plus,
  Search,
  Send,
  Trash2,
  X,
} from "lucide-react";
import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createSdkworkAdminNotificationInputFromForm,
  createSdkworkAdminNotificationStatusInput,
  createSdkworkAdminNotificationUpdateInputFromForm,
  type SdkworkAdminNotificationFormValues,
} from "./adminNotificationForm";
import type {
  SdkworkAdminNotification,
  SdkworkAdminNotificationListOptions,
  SdkworkAdminNotificationService,
  SdkworkAdminNotificationStatus,
} from "./adminNotificationService";

export interface SdkworkAdminNotificationManagerProps {
  className?: string;
  defaultAppId?: string;
  includeGlobal?: boolean;
  labels?: Partial<SdkworkAdminNotificationManagerLabels>;
  pageSize?: number;
  service: SdkworkAdminNotificationService;
}

export interface SdkworkAdminNotificationManagerLabels {
  actions: {
    cancel: string;
    delete: string;
    moveToDraft: string;
    newNotification: string;
    publish: string;
    retry: string;
    save: string;
  };
  confirm: {
    deleteConfirm: string;
    deleteDescription: string;
    deleteTitle: string;
  };
  errors: {
    deleteFallback: string;
    loadFallback: string;
    saveFallback: string;
    statusUpdateFallback: string;
  };
  fields: {
    actionUrl: string;
    appId: string;
    content: string;
    expireAt: string;
    messageCode: string;
    popupDisplay: string;
    priority: string;
    publishedAt: string;
    recipients: string;
    scope: string;
    severity: string;
    status: string;
    summary: string;
    title: string;
    type: string;
  };
  modals: {
    createDescription: string;
    createTitle: string;
    editDescription: string;
    editTitle: string;
  };
  placeholders: {
    actionUrl: string;
    appId: string;
    content: string;
    messageCode: string;
    recipientValue: string;
    search: string;
    summary: string;
    title: string;
    userId: string;
  };
  popup: {
    disabled: string;
    enabled: string;
  };
  recipients: {
    all: string;
    role: string;
    user: string;
  };
  scope: {
    app: string;
    global: string;
  };
  severity: {
    alert: string;
    billing: string;
    info: string;
    warning: string;
  };
  state: {
    emptyDescription: string;
    emptyTitle: string;
    loading: string;
    loadErrorTitle: string;
  };
  status: {
    archived: string;
    draft: string;
    published: string;
  };
  subtitle: string;
  table: {
    actions: string;
    audience: string;
    popupDisplay: string;
    scope: string;
    status: string;
    title: string;
    updatedAt: string;
  };
  title: string;
  type: {
    alert: string;
    billing: string;
    info: string;
    warning: string;
  };
}

const DEFAULT_LABELS: SdkworkAdminNotificationManagerLabels = {
  actions: {
    cancel: "Cancel",
    delete: "Delete",
    moveToDraft: "Move to draft",
    newNotification: "New notification",
    publish: "Publish",
    retry: "Retry",
    save: "Save",
  },
  confirm: {
    deleteConfirm: "Delete notification",
    deleteDescription: "This notification will no longer be delivered after deletion.",
    deleteTitle: "Delete notification?",
  },
  errors: {
    deleteFallback: "Failed to delete notification.",
    loadFallback: "Failed to load notifications.",
    saveFallback: "Failed to save notification.",
    statusUpdateFallback: "Failed to update notification status.",
  },
  fields: {
    actionUrl: "Action URL",
    appId: "App ID",
    content: "Content",
    expireAt: "Expire at",
    messageCode: "Message code",
    popupDisplay: "Popup display",
    priority: "Priority",
    publishedAt: "Published at",
    recipients: "Recipients",
    scope: "Scope",
    severity: "Severity",
    status: "Status",
    summary: "Summary",
    title: "Title",
    type: "Type",
  },
  modals: {
    createDescription: "Create a notification and choose its application scope and recipients.",
    createTitle: "Create notification",
    editDescription: "Update notification content, targeting, popup behavior, or publication state.",
    editTitle: "Edit notification",
  },
  placeholders: {
    actionUrl: "/console/notifications",
    appId: "sdkwork-router",
    content: "Notification content",
    messageCode: "ops.notification",
    recipientValue: "role code or recipient label",
    search: "Search notifications...",
    summary: "Short summary",
    title: "System notification",
    userId: "User ID",
  },
  popup: {
    disabled: "Notification only",
    enabled: "Popup on load",
  },
  recipients: {
    all: "All users",
    role: "Role or group",
    user: "Single user",
  },
  scope: {
    app: "Application",
    global: "Global",
  },
  severity: {
    alert: "Alert",
    billing: "Billing",
    info: "Info",
    warning: "Warning",
  },
  state: {
    emptyDescription: "Create a notification or adjust the search keyword.",
    emptyTitle: "No notifications found",
    loading: "Loading notifications...",
    loadErrorTitle: "Notifications could not be loaded",
  },
  status: {
    archived: "Archived",
    draft: "Draft",
    published: "Published",
  },
  subtitle: "Manage global and application-scoped notifications with per-user read and popup state.",
  table: {
    actions: "Actions",
    audience: "Audience",
    popupDisplay: "Popup display",
    scope: "Scope",
    status: "Status",
    title: "Title",
    updatedAt: "Updated at",
  },
  title: "Notification Center Management",
  type: {
    alert: "Alert",
    billing: "Billing",
    info: "Info",
    warning: "Warning",
  },
};

const DEFAULT_FORM_VALUES: SdkworkAdminNotificationFormValues = {
  actionUrl: "",
  appId: "",
  content: "",
  expireAt: "",
  messageCode: "",
  priority: "50",
  publishedAt: "",
  recipientType: "all",
  recipientUserId: "",
  recipientValue: "",
  scope: "app",
  severity: "info",
  showAsPopup: false,
  status: "published",
  summary: "",
  title: "",
  type: "info",
};

export function SdkworkAdminNotificationManager({
  className,
  defaultAppId = "",
  includeGlobal = true,
  labels: labelOverrides,
  pageSize = 20,
  service,
}: SdkworkAdminNotificationManagerProps) {
  const labels = useMemo(() => mergeLabels(DEFAULT_LABELS, labelOverrides), [labelOverrides]);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<SdkworkAdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SdkworkAdminNotification | null>(null);
  const [formValues, setFormValues] = useState<SdkworkAdminNotificationFormValues>(() => ({
    ...DEFAULT_FORM_VALUES,
    appId: defaultAppId,
  }));

  const loadNotifications = () => {
    let active = true;
    setLoading(true);
    setLoadError(null);
    const options: SdkworkAdminNotificationListOptions = {
      includeArchived: true,
      includeGlobal,
      page: 1,
      pageSize,
    };
    if (defaultAppId.trim()) {
      options.appId = defaultAppId.trim();
    }
    service.fetchNotifications(options)
      .then((result) => {
        if (active) {
          setItems(result.items);
        }
      })
      .catch((err) => {
        if (active) {
          setLoadError(errorMessage(err, labels.errors.loadFallback));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  };

  useEffect(() => loadNotifications(), [defaultAppId, includeGlobal, pageSize, service]);

  const visibleItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) {
      return items;
    }
    return items.filter((item) => [
      item.title,
      item.summary,
      item.appId ?? "",
      item.messageCode ?? "",
    ].some((value) => value.toLowerCase().includes(keyword)));
  }, [items, search]);

  const openModal = (item?: SdkworkAdminNotification) => {
    setError(null);
    if (item) {
      setEditingId(item.id);
      setFormValues(toFormValues(item, defaultAppId));
    } else {
      setEditingId(null);
      setFormValues({
        ...DEFAULT_FORM_VALUES,
        appId: defaultAppId,
      });
    }
    setModalOpen(true);
  };

  const saveNotification = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) {
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        const updated = await service.updateNotification(
          editingId,
          createSdkworkAdminNotificationUpdateInputFromForm(formValues),
        );
        setItems((current) => current.map((item) => item.id === editingId ? updated : item));
      } else {
        const created = await service.addNotification(
          createSdkworkAdminNotificationInputFromForm(formValues),
        );
        setItems((current) => [created, ...current]);
      }
      setModalOpen(false);
    } catch (err) {
      setError(errorMessage(err, labels.errors.saveFallback));
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (item: SdkworkAdminNotification, status: SdkworkAdminNotificationStatus) => {
    setPendingActionId(item.id);
    setError(null);
    try {
      const updated = await service.updateNotification(item.id, createSdkworkAdminNotificationStatusInput(status));
      setItems((current) => current.map((entry) => entry.id === item.id ? updated : entry));
    } catch (err) {
      setError(errorMessage(err, labels.errors.statusUpdateFallback));
    } finally {
      setPendingActionId(null);
    }
  };

  const deleteNotification = async () => {
    if (!deleteTarget) {
      return;
    }
    setPendingActionId(deleteTarget.id);
    setError(null);
    try {
      await service.deleteNotification(deleteTarget.id);
      setItems((current) => current.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError(errorMessage(err, labels.errors.deleteFallback));
    } finally {
      setPendingActionId(null);
    }
  };

  return (
    <div className={["flex h-full min-h-0 w-full flex-col gap-6 overflow-hidden", className].filter(Boolean).join(" ")}>
      <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
            <BellRing className="h-6 w-6 text-blue-500" />
            {labels.title}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{labels.subtitle}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full bg-white py-2 pl-9 pr-4 text-sm text-slate-900 shadow-sm outline-none ring-1 ring-slate-200 transition-colors placeholder:text-slate-500 focus:ring-blue-500 dark:bg-[#1e1e1e] dark:text-white dark:ring-white/10 sm:w-72"
              onChange={(event) => setSearch(event.target.value)}
              placeholder={labels.placeholders.search}
              type="text"
              value={search}
            />
          </div>
          <button
            className="inline-flex shrink-0 items-center justify-center gap-2 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => openModal()}
            type="button"
          >
            <Plus className="h-4 w-4" />
            {labels.actions.newNotification}
          </button>
        </div>
      </div>

      {error ? <InlineError message={error} /> : null}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white shadow-sm ring-1 ring-slate-200 dark:bg-[#171717] dark:ring-white/10">
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full min-w-[980px] text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:border-white/10 dark:bg-[#121212] dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">{labels.table.title}</th>
                <th className="px-6 py-4">{labels.table.scope}</th>
                <th className="px-6 py-4">{labels.table.audience}</th>
                <th className="px-6 py-4">{labels.table.status}</th>
                <th className="px-6 py-4">{labels.table.popupDisplay}</th>
                <th className="px-6 py-4">{labels.table.updatedAt}</th>
                <th className="px-6 py-4 text-right">{labels.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {loading ? (
                <StateRow colSpan={7} icon={<Loader2 className="h-5 w-5 animate-spin" />} title={labels.state.loading} />
              ) : loadError ? (
                <StateRow
                  action={<button className="text-sm font-semibold text-blue-600 dark:text-blue-300" onClick={() => loadNotifications()} type="button">{labels.actions.retry}</button>}
                  colSpan={7}
                  icon={<AlertCircle className="h-5 w-5 text-red-500" />}
                  title={labels.state.loadErrorTitle}
                  description={loadError}
                />
              ) : visibleItems.length === 0 ? (
                <StateRow
                  action={<button className="text-sm font-semibold text-blue-600 dark:text-blue-300" onClick={() => openModal()} type="button">{labels.actions.newNotification}</button>}
                  colSpan={7}
                  icon={<BellOff className="h-5 w-5" />}
                  title={labels.state.emptyTitle}
                  description={labels.state.emptyDescription}
                />
              ) : visibleItems.map((item) => (
                <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.04]" key={item.id}>
                  <td className="max-w-md px-6 py-4">
                    <div className="truncate font-semibold text-slate-900 dark:text-white">{item.title}</div>
                    <div className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">{item.summary}</div>
                  </td>
                  <td className="px-6 py-4">{labels.scope[item.scope]}</td>
                  <td className="px-6 py-4">{recipientLabel(item, labels)}</td>
                  <td className="px-6 py-4"><StatusBadge item={item} labels={labels} /></td>
                  <td className="px-6 py-4">{item.showAsPopup ? labels.popup.enabled : labels.popup.disabled}</td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-500">{formatDate(item.updatedAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {item.status !== "published" ? (
                        <IconButton
                          disabled={pendingActionId === item.id}
                          label={labels.actions.publish}
                          onClick={() => void updateStatus(item, "published")}
                        >
                          <Send className="h-4 w-4" />
                        </IconButton>
                      ) : (
                        <IconButton
                          disabled={pendingActionId === item.id}
                          label={labels.actions.moveToDraft}
                          onClick={() => void updateStatus(item, "draft")}
                        >
                          <Clock className="h-4 w-4" />
                        </IconButton>
                      )}
                      <IconButton disabled={pendingActionId === item.id} label={labels.modals.editTitle} onClick={() => openModal(item)}>
                        <Edit className="h-4 w-4" />
                      </IconButton>
                      <IconButton disabled={pendingActionId === item.id} label={labels.actions.delete} onClick={() => setDeleteTarget(item)} tone="danger">
                        <Trash2 className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen ? (
        <NotificationModal
          editingId={editingId}
          formValues={formValues}
          labels={labels}
          onChange={setFormValues}
          onClose={() => setModalOpen(false)}
          onSubmit={saveNotification}
          saving={saving}
        />
      ) : null}

      {deleteTarget ? (
        <DeleteDialog
          busy={pendingActionId === deleteTarget.id}
          description={labels.confirm.deleteDescription.replace("{{title}}", deleteTarget.title)}
          labels={labels}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => void deleteNotification()}
        />
      ) : null}
    </div>
  );
}

interface NotificationModalProps {
  editingId: string | null;
  formValues: SdkworkAdminNotificationFormValues;
  labels: SdkworkAdminNotificationManagerLabels;
  onChange: (values: SdkworkAdminNotificationFormValues) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  saving: boolean;
}

function NotificationModal({
  editingId,
  formValues,
  labels,
  onChange,
  onClose,
  onSubmit,
  saving,
}: NotificationModalProps) {
  const setField = (field: keyof SdkworkAdminNotificationFormValues, value: string | boolean) => {
    onChange({
      ...formValues,
      [field]: value,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden bg-white shadow-2xl ring-1 ring-black/5 dark:bg-[#171717] dark:ring-white/10">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-white/10">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
              <BellRing className="h-5 w-5 text-blue-500" />
              {editingId ? labels.modals.editTitle : labels.modals.createTitle}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {editingId ? labels.modals.editDescription : labels.modals.createDescription}
            </p>
          </div>
          <button className="text-slate-400 transition-colors hover:text-slate-700 dark:hover:text-white" disabled={saving} onClick={onClose} type="button">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={onSubmit}>
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 overflow-y-auto p-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
            <div className="space-y-4">
              <TextInput label={labels.fields.title} maxLength={200} onChange={(value) => setField("title", value)} placeholder={labels.placeholders.title} required value={formValues.title} />
              <TextInput label={labels.fields.summary} maxLength={512} onChange={(value) => setField("summary", value)} placeholder={labels.placeholders.summary} required value={formValues.summary} />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <SelectInput label={labels.fields.scope} onChange={(value) => setField("scope", value)} options={[["app", labels.scope.app], ["global", labels.scope.global]]} value={formValues.scope} />
                <TextInput disabled={formValues.scope === "global"} label={labels.fields.appId} onChange={(value) => setField("appId", value)} placeholder={labels.placeholders.appId} required={formValues.scope !== "global"} value={formValues.scope === "global" ? "" : formValues.appId} />
                <SelectInput label={labels.fields.type} onChange={(value) => setField("type", value)} options={typeOptions(labels)} value={formValues.type} />
                <SelectInput label={labels.fields.severity} onChange={(value) => setField("severity", value)} options={severityOptions(labels)} value={formValues.severity} />
                <SelectInput label={labels.fields.status} onChange={(value) => setField("status", value)} options={[["published", labels.status.published], ["draft", labels.status.draft], ["archived", labels.status.archived]]} value={formValues.status} />
                <TextInput label={labels.fields.priority} onChange={(value) => setField("priority", value)} placeholder="50" value={formValues.priority} />
              </div>
              <ToggleInput checked={formValues.showAsPopup} label={labels.fields.popupDisplay} offLabel={labels.popup.disabled} onChange={(value) => setField("showAsPopup", value)} onLabel={labels.popup.enabled} />
              <TextAreaInput label={labels.fields.content} onChange={(value) => setField("content", value)} placeholder={labels.placeholders.content} required value={formValues.content} />
            </div>
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-black/30 dark:ring-white/10">
                <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">{labels.fields.recipients}</h4>
                <div className="grid grid-cols-1 gap-4">
                  <SelectInput label={labels.fields.recipients} onChange={(value) => setField("recipientType", value)} options={[["all", labels.recipients.all], ["user", labels.recipients.user], ["role", labels.recipients.role]]} value={formValues.recipientType} />
                  {formValues.recipientType === "user" ? (
                    <TextInput label={labels.recipients.user} onChange={(value) => setField("recipientUserId", value)} placeholder={labels.placeholders.userId} required value={formValues.recipientUserId} />
                  ) : formValues.recipientType === "role" ? (
                    <TextInput label={labels.recipients.role} onChange={(value) => setField("recipientValue", value)} placeholder={labels.placeholders.recipientValue} required value={formValues.recipientValue} />
                  ) : null}
                </div>
              </div>
              <TextInput label={labels.fields.messageCode} onChange={(value) => setField("messageCode", value)} placeholder={labels.placeholders.messageCode} value={formValues.messageCode} />
              <TextInput label={labels.fields.actionUrl} onChange={(value) => setField("actionUrl", value)} placeholder={labels.placeholders.actionUrl} value={formValues.actionUrl} />
              <TextInput label={labels.fields.publishedAt} onChange={(value) => setField("publishedAt", value)} placeholder="2026-05-18T00:00:00Z" value={formValues.publishedAt} />
              <TextInput label={labels.fields.expireAt} onChange={(value) => setField("expireAt", value)} placeholder="2026-06-01T00:00:00Z" value={formValues.expireAt} />
            </div>
          </div>
          <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-white/10 dark:bg-[#121212]">
            <button className="px-5 py-2.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-100 disabled:opacity-60 dark:text-slate-300 dark:ring-white/10 dark:hover:bg-white/5" disabled={saving} onClick={onClose} type="button">
              {labels.actions.cancel}
            </button>
            <button className="inline-flex items-center gap-2 bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={saving} type="submit">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              {labels.actions.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface TextInputProps {
  disabled?: boolean;
  label: string;
  maxLength?: number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  value: string;
}

function TextInput({
  disabled,
  label,
  maxLength,
  onChange,
  placeholder,
  required,
  value,
}: TextInputProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <input
        className="w-full bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-1 ring-slate-200 transition-colors placeholder:text-slate-400 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:bg-black dark:text-white dark:ring-white/10 dark:disabled:bg-white/5"
        disabled={disabled}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        type="text"
        value={value}
      />
    </label>
  );
}

interface SelectInputProps {
  label: string;
  onChange: (value: string) => void;
  options: Array<[string, string]>;
  value: string;
}

function SelectInput({
  label,
  onChange,
  options,
  value,
}: SelectInputProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <select
        className="w-full bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-1 ring-slate-200 transition-colors focus:ring-blue-500 dark:bg-black dark:text-white dark:ring-white/10"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>{optionLabel}</option>
        ))}
      </select>
    </label>
  );
}

interface TextAreaInputProps {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  value: string;
}

function TextAreaInput({
  label,
  onChange,
  placeholder,
  required,
  value,
}: TextAreaInputProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <textarea
        className="min-h-48 w-full resize-y bg-white px-3 py-2.5 text-sm leading-6 text-slate-900 outline-none ring-1 ring-slate-200 transition-colors placeholder:text-slate-400 focus:ring-blue-500 dark:bg-black dark:text-white dark:ring-white/10"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        value={value}
      />
    </label>
  );
}

interface ToggleInputProps {
  checked: boolean;
  label: string;
  offLabel: string;
  onChange: (checked: boolean) => void;
  onLabel: string;
}

function ToggleInput({
  checked,
  label,
  offLabel,
  onChange,
  onLabel,
}: ToggleInputProps) {
  return (
    <label className="flex items-center justify-between gap-4 bg-slate-50 px-4 py-3 ring-1 ring-slate-200 dark:bg-black/30 dark:ring-white/10">
      <span>
        <span className="block text-sm font-medium text-slate-800 dark:text-slate-200">{label}</span>
        <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{checked ? onLabel : offLabel}</span>
      </span>
      <input
        checked={checked}
        className="h-4 w-4 shrink-0 border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-white/20 dark:bg-black"
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
    </label>
  );
}

interface StateRowProps {
  action?: React.ReactNode;
  colSpan: number;
  description?: string;
  icon: React.ReactNode;
  title: string;
}

function StateRow({
  action,
  colSpan,
  description,
  icon,
  title,
}: StateRowProps) {
  return (
    <tr>
      <td className="px-6 py-16 text-center" colSpan={colSpan}>
        <div className="mx-auto flex max-w-md flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
          {icon}
          <div className="font-semibold text-slate-800 dark:text-slate-200">{title}</div>
          {description ? <p className="text-sm leading-6">{description}</p> : null}
          {action}
        </div>
      </td>
    </tr>
  );
}

interface IconButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  label: string;
  onClick: () => void;
  tone?: "danger" | "default";
}

function IconButton({
  children,
  disabled,
  label,
  onClick,
  tone = "default",
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={[
        "inline-flex h-9 w-9 items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        tone === "danger"
          ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white",
      ].join(" ")}
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

interface DeleteDialogProps {
  busy: boolean;
  description: string;
  labels: SdkworkAdminNotificationManagerLabels;
  onCancel: () => void;
  onConfirm: () => void;
}

function DeleteDialog({
  busy,
  description,
  labels,
  onCancel,
  onConfirm,
}: DeleteDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white p-6 shadow-2xl ring-1 ring-black/5 dark:bg-[#171717] dark:ring-white/10">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300">
            <Trash2 className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{labels.confirm.deleteTitle}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button className="px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-50 disabled:opacity-60 dark:text-slate-300 dark:ring-white/10 dark:hover:bg-white/5" disabled={busy} onClick={onCancel} type="button">
            {labels.actions.cancel}
          </button>
          <button className="inline-flex items-center gap-2 bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={busy} onClick={onConfirm} type="button">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            {labels.confirm.deleteConfirm}
          </button>
        </div>
      </div>
    </div>
  );
}

function InlineError({ message }: { message: string }) {
  return (
    <div className="flex shrink-0 items-start gap-2 bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/30">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

function StatusBadge({
  item,
  labels,
}: {
  item: SdkworkAdminNotification;
  labels: SdkworkAdminNotificationManagerLabels;
}) {
  if (item.status === "published") {
    return <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="h-3.5 w-3.5" />{labels.status.published}</span>;
  }
  if (item.status === "archived") {
    return <span className="inline-flex items-center gap-1 text-slate-500"><Archive className="h-3.5 w-3.5" />{labels.status.archived}</span>;
  }
  return <span className="inline-flex items-center gap-1 text-slate-500"><Clock className="h-3.5 w-3.5" />{labels.status.draft}</span>;
}

function recipientLabel(item: SdkworkAdminNotification, labels: SdkworkAdminNotificationManagerLabels): string {
  const first = item.recipients[0];
  if (!first) {
    return "-";
  }
  if (first.type === "all") {
    return labels.recipients.all;
  }
  if (first.type === "user") {
    return `${labels.recipients.user}: ${first.userId ?? first.value}`;
  }
  return `${labels.recipients.role}: ${first.roleCode ?? first.value}`;
}

function typeOptions(labels: SdkworkAdminNotificationManagerLabels): Array<[string, string]> {
  return [
    ["info", labels.type.info],
    ["billing", labels.type.billing],
    ["warning", labels.type.warning],
    ["alert", labels.type.alert],
  ];
}

function severityOptions(labels: SdkworkAdminNotificationManagerLabels): Array<[string, string]> {
  return [
    ["info", labels.severity.info],
    ["billing", labels.severity.billing],
    ["warning", labels.severity.warning],
    ["alert", labels.severity.alert],
  ];
}

function toFormValues(
  item: SdkworkAdminNotification,
  defaultAppId: string,
): SdkworkAdminNotificationFormValues {
  const recipient = item.recipients[0];
  return {
    actionUrl: item.actionUrl ?? "",
    appId: item.appId ?? defaultAppId,
    content: item.content,
    expireAt: item.expireAt ?? "",
    messageCode: item.messageCode ?? "",
    priority: String(item.priority),
    publishedAt: item.publishedAt ?? "",
    recipientType: recipient?.type ?? "all",
    recipientUserId: recipient?.userId ? String(recipient.userId) : "",
    recipientValue: recipient?.type === "role" ? recipient.roleCode ?? recipient.value : recipient?.value ?? "",
    scope: item.scope,
    severity: item.severity,
    showAsPopup: item.showAsPopup,
    status: item.status,
    summary: item.summary,
    title: item.title,
    type: item.type,
  };
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value || "-";
  }
  return date.toLocaleString();
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function mergeLabels(
  defaults: SdkworkAdminNotificationManagerLabels,
  overrides?: Partial<SdkworkAdminNotificationManagerLabels>,
): SdkworkAdminNotificationManagerLabels {
  if (!overrides) {
    return defaults;
  }
  return {
    ...defaults,
    ...overrides,
    actions: { ...defaults.actions, ...overrides.actions },
    confirm: { ...defaults.confirm, ...overrides.confirm },
    errors: { ...defaults.errors, ...overrides.errors },
    fields: { ...defaults.fields, ...overrides.fields },
    modals: { ...defaults.modals, ...overrides.modals },
    placeholders: { ...defaults.placeholders, ...overrides.placeholders },
    popup: { ...defaults.popup, ...overrides.popup },
    recipients: { ...defaults.recipients, ...overrides.recipients },
    scope: { ...defaults.scope, ...overrides.scope },
    severity: { ...defaults.severity, ...overrides.severity },
    state: { ...defaults.state, ...overrides.state },
    status: { ...defaults.status, ...overrides.status },
    table: { ...defaults.table, ...overrides.table },
    type: { ...defaults.type, ...overrides.type },
  };
}
