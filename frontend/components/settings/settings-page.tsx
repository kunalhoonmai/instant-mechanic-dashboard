"use client";

import * as React from "react";
import {
  Bell,
  CheckCircle2,
  CircleUserRound,
  Database,
  Monitor,
  Moon,
  Settings2,
  Sun,
  Wifi,
  WifiOff,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppAlert } from "@/components/ui/app-alert";
import { useTheme } from "@/components/theme-provider";
import api from "@/lib/api";
import { connectSocket } from "@/lib/socket";

interface NotificationSettings {
  newBookings: boolean;
  bookingUpdates: boolean;
  mechanicUpdates: boolean;
  customerActivity: boolean;
}

const NOTIFICATION_STORAGE_KEY =
  "instant-mechanic-notifications";

const defaultNotifications: NotificationSettings = {
  newBookings: true,
  bookingUpdates: true,
  mechanicUpdates: true,
  customerActivity: false,
};

function loadNotifications(): NotificationSettings {
  if (typeof window === "undefined") {
    return defaultNotifications;
  }

  try {
    const stored = localStorage.getItem(
      NOTIFICATION_STORAGE_KEY
    );

    if (!stored) {
      return defaultNotifications;
    }

    const parsed = JSON.parse(
      stored
    ) as Partial<NotificationSettings>;

    return {
      ...defaultNotifications,
      ...parsed,
    };
  } catch {
    return defaultNotifications;
  }
}

function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-4.5 w-4.5" />
      </div>

      <div className="min-w-0">
        <h2 className="text-sm font-semibold sm:text-base">
          {title}
        </h2>

        <p className="mt-0.5 text-xs leading-5 text-muted-foreground sm:text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}

function SettingToggle({
  checked,
  onChange,
  title,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between gap-5 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="mt-0.5 max-w-2xl text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
          checked
            ? "bg-primary"
            : "bg-muted-foreground/25"
        }`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked
              ? "translate-x-5"
              : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      {/* Account + System */}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <Skeleton className="h-9 w-9 rounded-xl" />

              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-64 max-w-full" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>

            <Skeleton className="h-14 w-full rounded-xl" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <Skeleton className="h-9 w-9 rounded-xl" />

              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-44 max-w-full" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </CardContent>
        </Card>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <Skeleton className="h-9 w-9 rounded-xl" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-72 max-w-full" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>

          <Skeleton className="mt-4 h-10 w-full rounded-lg" />
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <Skeleton className="h-9 w-9 rounded-xl" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-80 max-w-full" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="divide-y">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-5 py-3.5"
            >
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-72 max-w-full" />
              </div>

              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Footer */}
      <Skeleton className="h-20 w-full rounded-xl" />
    </div>
  );
}

export function SettingsPage() {
  const {
    theme,
    setTheme,
    resolvedTheme,
    mounted,
  } = useTheme();

  const { showAlert } = useAppAlert();

  const [notifications, setNotifications] =
    React.useState<NotificationSettings>(
      defaultNotifications
    );

  const [ready, setReady] =
    React.useState(false);

  const [apiStatus, setApiStatus] =
    React.useState<
      "checking" | "connected" | "offline"
    >("checking");

  const [socketStatus, setSocketStatus] =
    React.useState<
      "checking" | "connected" | "offline"
    >("checking");

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
        setNotifications(loadNotifications());
        setReady(true);
    }, 500);

    return () => {
        window.clearTimeout(timer);
    };
    }, []);
  /*
   * Check backend API status.
   */
  React.useEffect(() => {
    let active = true;

    async function checkApi() {
      try {
        await api.get("/dashboard");

        if (active) {
          setApiStatus("connected");
        }
      } catch {
        if (active) {
          setApiStatus("offline");
        }
      }
    }

    checkApi();

    return () => {
      active = false;
    };
  }, []);

  /*
   * Check Socket.IO connection.
   */
  React.useEffect(() => {
    if (!ready) {
      return;
    }

    const socket = connectSocket();

    const handleConnect = () => {
      setSocketStatus("connected");
    };

    const handleDisconnect = () => {
      setSocketStatus("offline");
    };

    const handleConnectError = () => {
      setSocketStatus("offline");
    };

    if (socket.connected) {
      setSocketStatus("connected");
    }

    socket.on("connect", handleConnect);
    socket.on(
      "disconnect",
      handleDisconnect
    );
    socket.on(
      "connect_error",
      handleConnectError
    );

    return () => {
      socket.off("connect", handleConnect);
      socket.off(
        "disconnect",
        handleDisconnect
      );
      socket.off(
        "connect_error",
        handleConnectError
      );
    };
  }, [ready]);

  const updateNotification = (
    key: keyof NotificationSettings,
    value: boolean
  ) => {
    const updated = {
      ...notifications,
      [key]: value,
    };

    setNotifications(updated);

    try {
      localStorage.setItem(
        NOTIFICATION_STORAGE_KEY,
        JSON.stringify(updated)
      );

      showAlert(
        value
          ? `${getNotificationLabel(key)} enabled.`
          : `${getNotificationLabel(key)} disabled.`,
        "success"
      );
    } catch {
      showAlert(
        "Unable to save notification preference.",
        "error"
      );
    }
  };

  if (!ready) {
    return <SettingsSkeleton />;
  }

  const apiLabel =
    apiStatus === "connected"
      ? "Connected"
      : apiStatus === "offline"
        ? "Unavailable"
        : "Checking...";

  const socketLabel =
    socketStatus === "connected"
      ? "Connected"
      : socketStatus === "offline"
        ? "Offline"
        : "Connecting...";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Settings2 className="h-4 w-4" />

          <span className="text-xs font-medium sm:text-sm">
            System configuration
          </span>
        </div>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Settings
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your dashboard appearance and
          notification preferences.
        </p>
      </div>

      {/* Account + System */}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        {/* Account */}
        <Card>
          <CardHeader>
            <SectionHeading
              icon={CircleUserRound}
              title="Account"
              description="Information used for the operations dashboard."
            />
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs font-medium sm:text-sm">
                  Display name
                </p>

                <div className="flex h-10 items-center rounded-lg border bg-muted/20 px-3 text-sm">
                  Operations Admin
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium sm:text-sm">
                  Email address
                </p>

                <div className="flex h-10 items-center rounded-lg border bg-muted/20 px-3 text-sm">
                  admin@instantmechanic.com
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border bg-muted/20 p-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CircleUserRound className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium">
                  Operations Administrator
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Dashboard administrator
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <SectionHeading
              icon={Database}
              title="System Status"
              description="Live connectivity information."
            />
          </CardHeader>

          <CardContent className="space-y-3">
            <StatusRow
              icon={Database}
              title="Backend API"
              description="REST API connection"
              status={apiStatus}
              label={apiLabel}
            />

            <StatusRow
              icon={Wifi}
              title="Real-time updates"
              description="Socket.IO connection"
              status={socketStatus}
              label={socketLabel}
            />
          </CardContent>
        </Card>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <SectionHeading
            icon={Monitor}
            title="Appearance"
            description="Choose how Instant Mechanic looks on your device."
          />
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                value: "light" as const,
                label: "Light",
                icon: Sun,
                description:
                  "Bright interface",
              },
              {
                value: "dark" as const,
                label: "Dark",
                icon: Moon,
                description:
                  "Reduced brightness",
              },
              {
                value: "system" as const,
                label: "System",
                icon: Monitor,
                description:
                  "Follow device",
              },
            ].map((option) => {
              const Icon = option.icon;

              const active =
                mounted &&
                theme === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setTheme(option.value)
                  }
                  className={`group rounded-xl border p-3.5 text-left transition-all ${
                    active
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "hover:border-primary/40 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </div>

                    {active && (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                  </div>

                  <p className="mt-3 text-sm font-semibold">
                    {option.label}
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>

          {mounted && (
            <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2.5 text-xs">
              <span className="text-muted-foreground">
                Current interface
              </span>

              <span className="font-medium">
                {resolvedTheme === "dark"
                  ? "Dark"
                  : "Light"}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <SectionHeading
            icon={Bell}
            title="Notifications"
            description="Control which operational events should trigger notifications."
          />
        </CardHeader>

        <CardContent className="divide-y">
          <SettingToggle
            title="New bookings"
            description="Notify when a new service booking is created."
            checked={notifications.newBookings}
            onChange={(value) =>
              updateNotification(
                "newBookings",
                value
              )
            }
          />

          <SettingToggle
            title="Booking updates"
            description="Notify when a booking status or assignment changes."
            checked={
              notifications.bookingUpdates
            }
            onChange={(value) =>
              updateNotification(
                "bookingUpdates",
                value
              )
            }
          />

          <SettingToggle
            title="Mechanic updates"
            description="Notify when mechanic availability or service status changes."
            checked={
              notifications.mechanicUpdates
            }
            onChange={(value) =>
              updateNotification(
                "mechanicUpdates",
                value
              )
            }
          />

          <SettingToggle
            title="Customer activity"
            description="Notify about new customer activity and profile changes."
            checked={
              notifications.customerActivity
            }
            onChange={(value) =>
              updateNotification(
                "customerActivity",
                value
              )
            }
          />
        </CardContent>
      </Card>

      {/* Informational note */}
      <div className="flex items-start gap-3 rounded-xl border bg-muted/20 p-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Settings2 className="h-4 w-4" />
        </div>

        <div>
          <p className="text-sm font-medium">
            Operations dashboard
          </p>

          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
            Appearance and notification preferences
            are stored locally in your browser.
            Operational data such as bookings,
            mechanics, customers, and revenue continues
            to come from the backend API and database.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatusRow({
  icon: Icon,
  title,
  description,
  status,
  label,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  status:
    | "checking"
    | "connected"
    | "offline";
  label: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border p-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium">
            {title}
          </p>

          <p className="text-[11px] text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <StatusIndicator
        status={status}
        label={label}
      />
    </div>
  );
}

function StatusIndicator({
  status,
  label,
}: {
  status:
    | "checking"
    | "connected"
    | "offline";
  label: string;
}) {
  if (status === "connected") {
    return (
      <div className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="h-4 w-4" />
        <span>{label}</span>
      </div>
    );
  }

  if (status === "offline") {
    return (
      <div className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-destructive">
        <WifiOff className="h-4 w-4" />
        <span>{label}</span>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground">
      <Wifi className="h-4 w-4" />
      <span>{label}</span>
    </div>
  );
}

function getNotificationLabel(
  key: keyof NotificationSettings
) {
  switch (key) {
    case "newBookings":
      return "New booking notifications";

    case "bookingUpdates":
      return "Booking update notifications";

    case "mechanicUpdates":
      return "Mechanic update notifications";

    case "customerActivity":
      return "Customer activity notifications";
  }
}