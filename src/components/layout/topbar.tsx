"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { Bell, LogOut, Menu, Settings } from "lucide-react";
import { OwnerAvatar } from "@/components/common/owner-avatar";

type TopbarProps = {
  userName: string;
  userImage?: string | null;
  workspaceName: string;
  onOpenSidebar: () => void;
};

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  createdAtLabel: string;
};

const defaultNotifications: NotificationItem[] = [
  {
    id: "notif-followups-due",
    title: "3 follow-ups due today",
    description: "Review high-priority reminders in the activity center.",
    href: "/activity",
    createdAtLabel: "2m ago",
  },
];

export function Topbar({ userName, userImage, onOpenSidebar }: TopbarProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

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

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <header className="h-16 shrink-0 border-b border-[var(--border)] bg-white">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-heading transition hover:bg-[var(--background-soft)] lg:hidden"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>

        <div className="hidden lg:block" />

        <div className="flex items-center gap-3">
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted transition hover:bg-[var(--background-soft)] hover:text-heading"
              aria-label="Notifications"
              onClick={() => {
                setNotificationsOpen((current) => !current);
                setProfileOpen(false);
              }}
            >
              <Bell className="h-4 w-4" aria-hidden />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--teal)]" />
            </button>

            {notificationsOpen ? (
              <section className="surface-card absolute right-0 z-30 mt-2 w-72 p-3">
                <p className="mb-2 text-sm font-semibold text-heading">Notifications</p>
                <ul className="space-y-2">
                  {defaultNotifications.map((notification) => (
                    <li key={notification.id} className="rounded-xl bg-[var(--background-soft)]/72 p-3">
                      <Link href={notification.href} className="block" onClick={() => setNotificationsOpen(false)}>
                        <p className="text-sm font-medium text-heading">{notification.title}</p>
                        <p className="mt-1 text-xs text-muted">{notification.description}</p>
                        <p className="mt-1 text-[11px] text-muted">{notification.createdAtLabel}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-transparent"
              aria-label="Profile menu"
              onClick={() => {
                setProfileOpen((current) => !current);
                setNotificationsOpen(false);
              }}
            >
              <OwnerAvatar name={userName} image={userImage} className="h-10 w-10 border-transparent" />
            </button>

            {profileOpen ? (
              <section className="surface-card absolute right-0 z-30 mt-2 w-56 p-2">
                <div className="px-2 py-2">
                  <p className="text-sm font-semibold text-heading">{userName}</p>
                </div>
                <div className="my-1 h-px bg-[var(--border)]" />

                <nav className="space-y-1">
                  <Link
                    href="/settings"
                    className="inline-flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-heading hover:bg-[var(--background-soft)]"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Settings className="h-4 w-4 text-muted" aria-hidden />
                    Settings
                  </Link>
                  <button
                    type="button"
                    className="inline-flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-[var(--rose)] hover:bg-[var(--rose-soft)]"
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
      </div>
    </header>
  );
}
