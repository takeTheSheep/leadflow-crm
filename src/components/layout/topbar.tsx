"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { Bell, CalendarClock, Check, CheckCheck, ChevronDown, LogOut, Settings, UserRound } from "lucide-react";
import { CommandSearch } from "@/components/common/command-search";
import { OwnerAvatar } from "@/components/common/owner-avatar";

type TopbarProps = {
  userName: string;
  userImage?: string | null;
  workspaceName: string;
};

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  createdAtLabel: string;
  read: boolean;
};

const notificationStorageKey = "leadflow:topbar-notifications";

const defaultNotifications: NotificationItem[] = [
  {
    id: "notif-followups-due",
    title: "3 follow-ups due today",
    description: "Review high-priority reminders in the activity center.",
    href: "/activity",
    createdAtLabel: "2m ago",
    read: false,
  },
  {
    id: "notif-overdue-tasks",
    title: "2 tasks are overdue",
    description: "Pipeline response SLA is at risk for two opportunities.",
    href: "/dashboard",
    createdAtLabel: "8m ago",
    read: false,
  },
  {
    id: "notif-source-spike",
    title: "Referral source conversion increased",
    description: "Open analytics to review source-level performance details.",
    href: "/analytics",
    createdAtLabel: "21m ago",
    read: true,
  },
];

export function Topbar({ userName, userImage, workspaceName }: TopbarProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(defaultNotifications);
  const [notificationsLoaded, setNotificationsLoaded] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(notificationStorageKey);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as NotificationItem[];
      if (Array.isArray(parsed)) {
        setNotifications(parsed);
      }
    } catch {
      // Ignore invalid local storage payloads and keep defaults.
    } finally {
      setNotificationsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!notificationsLoaded) {
      return;
    }

    window.localStorage.setItem(notificationStorageKey, JSON.stringify(notifications));
  }, [notifications, notificationsLoaded]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setNotificationsOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const markNotificationRead = (id: string) => {
    setNotifications((current) => current.map((item) => (item.id === id ? { ...item, read: true } : item)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  };

  return (
    <header className="surface-card-strong mb-6 flex flex-wrap items-center justify-between gap-3 p-3 md:p-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
          <CalendarClock className="h-4 w-4 text-[var(--blue)]" aria-hidden />
          {date} | {workspaceName}
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--teal-soft)] px-2 py-1 text-[11px] font-semibold text-[var(--teal)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--teal)]" />
          Live
        </span>
      </div>

      <div className="flex items-center gap-2">
        <CommandSearch />
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            className="ring-focus relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-white text-muted transition hover:border-[var(--blue)]/35 hover:text-heading"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            onClick={() => {
              setNotificationsOpen((current) => !current);
              setProfileOpen(false);
            }}
          >
            <Bell className="h-4 w-4" aria-hidden />
            {unreadCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[var(--rose)] px-1 text-[10px] font-semibold text-white">
                {unreadCount}
              </span>
            ) : null}
          </button>

          {notificationsOpen ? (
            <section className="surface-card absolute right-0 z-30 mt-2 w-80 p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-heading">Notifications</p>
                <span className="text-xs text-muted">{unreadCount} unread</span>
              </div>

              <div className="mb-2 flex items-center justify-between">
                <button
                  type="button"
                  className="ring-focus inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-[var(--blue-deep)] hover:bg-[var(--blue-soft)]"
                  onClick={markAllNotificationsRead}
                  disabled={unreadCount === 0}
                >
                  <CheckCheck className="h-3.5 w-3.5" aria-hidden />
                  Mark all read
                </button>
                <Link
                  href="/activity"
                  className="ring-focus inline-flex items-center rounded-lg px-2 py-1 text-xs font-medium text-[var(--blue-deep)] hover:bg-[var(--blue-soft)]"
                  onClick={() => setNotificationsOpen(false)}
                >
                  Open activity
                </Link>
              </div>

              <ul className="space-y-2">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`rounded-xl border p-3 transition ${notification.read ? "border-[var(--border)] bg-white/75" : "border-[var(--blue)]/25 bg-[var(--blue-soft)]/45"}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={notification.href}
                        onClick={() => {
                          markNotificationRead(notification.id);
                          setNotificationsOpen(false);
                        }}
                        className="ring-focus min-w-0 flex-1 rounded-lg"
                      >
                        <p className="text-sm font-medium text-heading">{notification.title}</p>
                        <p className="mt-1 text-xs text-muted">{notification.description}</p>
                        <p className="mt-1 text-[11px] text-muted">{notification.createdAtLabel}</p>
                      </Link>

                      {!notification.read ? (
                        <button
                          type="button"
                          onClick={() => markNotificationRead(notification.id)}
                          className="ring-focus inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--blue-deep)] transition hover:bg-white/80"
                          aria-label={`Mark ${notification.title} as read`}
                        >
                          <Check className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      ) : (
                        <span className="inline-flex h-7 items-center rounded-md px-2 text-[11px] text-muted">Read</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-3 border-t border-[var(--border)] pt-2">
                <Link
                  href="/activity"
                  className="ring-focus inline-flex w-full items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-[var(--blue-deep)] hover:bg-[var(--blue-soft)]"
                  onClick={() => setNotificationsOpen(false)}
                >
                  Open Activity Center
                </Link>
              </div>
            </section>
          ) : null}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            className="ring-focus inline-flex items-center gap-1 rounded-xl border border-[var(--border)] bg-white px-1 py-1 text-muted transition hover:border-[var(--blue)]/35 hover:text-heading"
            aria-label="Profile menu"
            aria-expanded={profileOpen}
            onClick={() => {
              setProfileOpen((current) => !current);
              setNotificationsOpen(false);
            }}
          >
            <OwnerAvatar name={userName} image={userImage} className="h-8 w-8 border-transparent" />
            <ChevronDown className="mr-1 h-4 w-4" aria-hidden />
          </button>

          {profileOpen ? (
            <section className="surface-card absolute right-0 z-30 mt-2 w-56 p-2">
              <div className="px-2 py-2">
                <p className="text-sm font-semibold text-heading">{userName}</p>
                <p className="text-xs text-muted">{workspaceName}</p>
              </div>
              <div className="my-1 h-px bg-[var(--border)]" />

              <nav className="space-y-1">
                <Link
                  href="/settings"
                  className="ring-focus inline-flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-heading hover:bg-[var(--blue-soft)]"
                  onClick={() => setProfileOpen(false)}
                >
                  <Settings className="h-4 w-4 text-[var(--blue)]" aria-hidden />
                  Account settings
                </Link>
                <button
                  type="button"
                  className="ring-focus inline-flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-heading hover:bg-[var(--background-soft)]"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <UserRound className="h-4 w-4 text-[var(--violet)]" aria-hidden />
                  Change account
                </button>
                <button
                  type="button"
                  className="ring-focus inline-flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-[var(--rose)] hover:bg-[var(--rose-soft)]"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <LogOut className="h-4 w-4" aria-hidden />
                  Logout
                </button>
              </nav>
            </section>
          ) : null}
        </div>
      </div>
    </header>
  );
}

