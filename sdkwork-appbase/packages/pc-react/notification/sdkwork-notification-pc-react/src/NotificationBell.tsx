import {
  Bell,
  Check,
  ExternalLink,
  Loader2,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createNotificationCenterState,
  groupNotificationsByDay,
  type SdkworkNotificationItem,
} from "./notificationCenter";
import {
  createSdkworkNotificationService,
  type SdkworkNotificationGeneratedClient,
  type SdkworkNotificationService,
} from "./notificationService";

export interface SdkworkNotificationBellProps {
  appId: string;
  authenticated?: boolean;
  centerPath?: string;
  className?: string;
  client: SdkworkNotificationGeneratedClient;
  labels?: Partial<SdkworkNotificationLabels>;
  onNavigate?: (href: string) => void;
  pageSize?: number;
  service?: SdkworkNotificationService;
}

export interface SdkworkNotificationLabels {
  acknowledge: string;
  ariaLabel: string;
  centerTitle: string;
  detailsTitle: string;
  empty: string;
  errorFallback: string;
  loading: string;
  retry: string;
  source: string;
  viewAll: string;
}

const DEFAULT_LABELS: SdkworkNotificationLabels = {
  acknowledge: "Acknowledge",
  ariaLabel: "Notifications",
  centerTitle: "Notification center",
  detailsTitle: "Notification details",
  empty: "No notifications",
  errorFallback: "Failed to load notifications.",
  loading: "Loading notifications...",
  retry: "Retry",
  source: "System gateway",
  viewAll: "View all notifications",
};

export function SdkworkNotificationBell({
  appId,
  authenticated = true,
  centerPath = "/notifications",
  className,
  client,
  labels: labelOverrides,
  onNavigate,
  pageSize,
  service: serviceProp,
}: SdkworkNotificationBellProps) {
  const labels = {
    ...DEFAULT_LABELS,
    ...labelOverrides,
  };
  const service = useMemo(
    () =>
      serviceProp ??
      createSdkworkNotificationService({
        appId,
        client,
        pageSize,
      }),
    [appId, client, pageSize, serviceProp],
  );
  const [items, setItems] = useState<SdkworkNotificationItem[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<SdkworkNotificationItem | null>(null);
  const [popupQueue, setPopupQueue] = useState<SdkworkNotificationItem[]>([]);
  const [activePopup, setActivePopup] = useState<SdkworkNotificationItem | null>(null);
  const centerState = useMemo(() => createNotificationCenterState(items), [items]);

  const loadNotifications = useCallback(
    async (isActive: () => boolean = () => true) => {
      if (!authenticated) {
        setItems([]);
        setPopupQueue([]);
        setActivePopup(null);
        setSelectedNotification(null);
        setHasLoaded(false);
        return;
      }

      setIsLoading(true);
      setLoadError(null);
      try {
        const nextItems = await service.list();
        if (!isActive()) {
          return;
        }

        setItems(nextItems);
        setHasLoaded(true);
        setPopupQueue(
          nextItems.filter((item) => item.showAsPopup && !item.read && !item.popupSeen && !item.archived),
        );
      } catch (error) {
        if (!isActive()) {
          return;
        }

        setLoadError(readErrorMessage(error, labels.errorFallback));
        setHasLoaded(true);
      } finally {
        if (isActive()) {
          setIsLoading(false);
        }
      }
    },
    [authenticated, labels.errorFallback, service],
  );

  useEffect(() => {
    let active = true;
    void loadNotifications(() => active);
    return () => {
      active = false;
    };
  }, [loadNotifications]);

  useEffect(() => {
    if (activePopup || popupQueue.length === 0) {
      return;
    }

    const [nextPopup, ...remainingPopups] = popupQueue;
    setActivePopup(nextPopup ?? null);
    setPopupQueue(remainingPopups);
  }, [activePopup, popupQueue]);

  const acknowledgeNotification = useCallback(
    (notificationId: string) => {
      setItems((current) =>
        current.map((item) =>
          item.id === notificationId
            ? {
                ...item,
                popupSeen: true,
                read: true,
                status: "read",
              }
            : item,
        ),
      );
      setSelectedNotification((current) =>
        current?.id === notificationId
          ? {
              ...current,
              popupSeen: true,
              read: true,
              status: "read",
            }
          : current,
      );
      setPopupQueue((current) => current.filter((item) => item.id !== notificationId));
      setActivePopup((current) =>
        current?.id === notificationId
          ? {
              ...current,
              popupSeen: true,
              read: true,
              status: "read",
            }
          : current,
      );
      void service.acknowledge(notificationId).catch((error) => {
        setLoadError(readErrorMessage(error, labels.errorFallback));
      });
    },
    [labels.errorFallback, service],
  );

  const markPopupSeen = useCallback(
    (notificationId: string) => {
      setItems((current) =>
        current.map((item) =>
          item.id === notificationId
            ? {
                ...item,
                popupSeen: true,
              }
            : item,
        ),
      );
      setPopupQueue((current) => current.filter((item) => item.id !== notificationId));
      setSelectedNotification((current) =>
        current?.id === notificationId
          ? {
              ...current,
              popupSeen: true,
            }
          : current,
      );
      setActivePopup((current) =>
        current?.id === notificationId
          ? {
              ...current,
              popupSeen: true,
            }
          : current,
      );
      void service.markPopupSeen(notificationId).catch((error) => {
        setLoadError(readErrorMessage(error, labels.errorFallback));
      });
    },
    [labels.errorFallback, service],
  );

  const openNotificationDetail = useCallback(
    (item: SdkworkNotificationItem) => {
      setSelectedNotification(item);
      setIsDropdownOpen(false);
      if (!item.read) {
        acknowledgeNotification(item.id);
      }
    },
    [acknowledgeNotification],
  );

  const closeDetail = useCallback(() => {
    setSelectedNotification(null);
  }, []);

  const closePopup = useCallback(() => {
    if (activePopup) {
      markPopupSeen(activePopup.id);
    }
    setActivePopup(null);
  }, [activePopup, markPopupSeen]);

  const acknowledgePopup = useCallback(() => {
    if (activePopup) {
      acknowledgeNotification(activePopup.id);
    } else if (selectedNotification && !selectedNotification.read) {
      acknowledgeNotification(selectedNotification.id);
    }
    setActivePopup(null);
    setSelectedNotification(null);
  }, [acknowledgeNotification, activePopup, selectedNotification]);

  const navigateToCenter = useCallback(() => {
    setIsDropdownOpen(false);
    onNavigate?.(centerPath);
  }, [centerPath, onNavigate]);

  if (!authenticated) {
    return null;
  }

  return (
    <div className={["relative inline-flex items-center", className].filter(Boolean).join(" ")}>
      <button
        aria-label={labels.ariaLabel}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-lobster-500 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
        onClick={() => {
          const nextOpen = !isDropdownOpen;
          setIsDropdownOpen(nextOpen);
          if (nextOpen && !isLoading) {
            void loadNotifications();
          }
        }}
        type="button"
      >
        <Bell className="h-5 w-5" />
        {centerState.unreadCount > 0 ? (
          <span className="absolute right-1.5 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#050505]" />
        ) : null}
      </button>

      {isDropdownOpen ? (
        <div
          aria-label={labels.centerTitle}
          className="absolute right-0 top-[calc(100%+0.625rem)] z-50 flex w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden bg-white shadow-2xl ring-1 ring-black/5 dark:bg-[#151515] dark:ring-white/10"
          role="menu"
        >
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{labels.centerTitle}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{centerState.unreadCount} unread</p>
            </div>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-slate-400" /> : null}
          </div>

          <div className="max-h-96 overflow-y-auto">
            <NotificationDropdownBody
              hasLoaded={hasLoaded}
              isLoading={isLoading}
              labels={labels}
              loadError={loadError}
              onOpenDetail={openNotificationDetail}
              onRetry={() => void loadNotifications()}
              stateItems={centerState.items}
            />
          </div>

          <button
            className="flex items-center justify-center gap-2 bg-slate-50 px-4 py-3 text-xs font-semibold text-lobster-600 transition-colors hover:bg-lobster-50 dark:bg-white/[0.03] dark:text-lobster-300 dark:hover:bg-lobster-500/10"
            onClick={navigateToCenter}
            type="button"
          >
            {labels.viewAll}
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}

      <NotificationDetailModal
        labels={labels}
        notification={activePopup ?? selectedNotification}
        onAcknowledge={acknowledgePopup}
        onClose={activePopup ? closePopup : closeDetail}
      />
    </div>
  );
}

interface NotificationDropdownBodyProps {
  hasLoaded: boolean;
  isLoading: boolean;
  labels: SdkworkNotificationLabels;
  loadError: string | null;
  onOpenDetail: (item: SdkworkNotificationItem) => void;
  onRetry: () => void;
  stateItems: readonly SdkworkNotificationItem[];
}

function NotificationDropdownBody({
  hasLoaded,
  isLoading,
  labels,
  loadError,
  onOpenDetail,
  onRetry,
  stateItems,
}: NotificationDropdownBodyProps) {
  if (isLoading && !hasLoaded) {
    return (
      <div className="px-5 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
        {labels.loading}
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="px-5 py-5 text-sm text-slate-500 dark:text-slate-400">
        <p>{loadError}</p>
        <button
          className="mt-3 text-xs font-semibold text-lobster-600 hover:text-lobster-700 dark:text-lobster-300"
          onClick={onRetry}
          type="button"
        >
          {labels.retry}
        </button>
      </div>
    );
  }

  if (stateItems.length === 0) {
    return (
      <div className="px-5 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
        {labels.empty}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {groupNotificationsByDay(stateItems).map((group) => (
        <div key={group.day}>
          <div className="bg-slate-50 px-4 py-2 text-[0.7rem] font-semibold uppercase text-slate-400 dark:bg-white/[0.03] dark:text-slate-500">
            {group.day}
          </div>
          {group.items.map((item) => (
            <button
              className="flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.04]"
              key={item.id}
              onClick={() => onOpenDetail(item)}
              role="menuitem"
              type="button"
            >
              <span
                className={[
                  "mt-1.5 h-2 w-2 flex-none rounded-full",
                  item.read ? "bg-slate-300 dark:bg-slate-700" : "bg-lobster-500",
                ].join(" ")}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </span>
                <span className="mt-1 block line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  {item.desc}
                </span>
                <span className="mt-2 block text-[0.7rem] text-slate-400 dark:text-slate-500">
                  {formatNotificationTime(item.time ?? item.createdAt)}
                </span>
              </span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

interface NotificationDetailModalProps {
  labels: SdkworkNotificationLabels;
  notification: SdkworkNotificationItem | null;
  onAcknowledge: () => void;
  onClose: () => void;
}

function NotificationDetailModal({
  labels,
  notification,
  onAcknowledge,
  onClose,
}: NotificationDetailModalProps) {
  if (!notification) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        aria-label={labels.detailsTitle}
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden bg-white shadow-2xl dark:bg-[#151515]"
        data-sdk-pattern="notification-detail-modal"
        data-size="large"
        role="dialog"
      >
        <div className="flex items-center justify-between bg-slate-50 px-6 py-5 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center bg-lobster-50 text-lobster-600 dark:bg-lobster-500/10 dark:text-lobster-300">
              <Bell className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{labels.detailsTitle}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {labels.source} - {formatNotificationTime(notification.time ?? notification.createdAt)}
              </p>
            </div>
          </div>
          <button
            aria-label="Close notification"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/5 dark:hover:text-white"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-7 md:px-12 md:py-10">
          <h3 className="text-2xl font-semibold leading-tight text-slate-950 dark:text-white md:text-3xl">
            {notification.title}
          </h3>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
            {notification.content || notification.desc}
          </p>
          {notification.route ? (
            <a
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-lobster-600 hover:text-lobster-700 dark:text-lobster-300"
              href={notification.route}
            >
              {notification.route}
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </div>

        <div className="flex justify-end bg-slate-50 px-6 py-5 dark:bg-white/[0.03]">
          <button
            aria-label="Acknowledge notification"
            className="inline-flex h-10 items-center gap-2 bg-slate-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            onClick={onAcknowledge}
            type="button"
          >
            <Check className="h-4 w-4" />
            {labels.acknowledge}
          </button>
        </div>
      </div>
    </div>
  );
}

function formatNotificationTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function readErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
