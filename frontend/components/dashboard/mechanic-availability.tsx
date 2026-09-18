import {
  CircleCheck,
  Clock3,
  UserRound,
  WifiOff,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const mechanics = [
  {
    name: "Amit Kumar",
    service: "Oil Change",
    status: "Available",
    initials: "AK",
  },
  {
    name: "Ravi Verma",
    service: "Brake Service",
    status: "On Job",
    initials: "RV",
  },
  {
    name: "Mohit Sharma",
    service: "AC Service",
    status: "On Job",
    initials: "MS",
  },
  {
    name: "Rahul Singh",
    service: "Battery",
    status: "Available",
    initials: "RS",
  },
  {
    name: "Sandeep Kumar",
    service: "General Repair",
    status: "Offline",
    initials: "SK",
  },
];

const statusConfig = {
  Available: {
    icon: CircleCheck,
    className:
      "text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  "On Job": {
    icon: Clock3,
    className:
      "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  Offline: {
    icon: WifiOff,
    className:
      "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
};

export function MechanicAvailability() {
  const available = mechanics.filter(
    (mechanic) => mechanic.status === "Available"
  ).length;

  const onJob = mechanics.filter(
    (mechanic) => mechanic.status === "On Job"
  ).length;

  const offline = mechanics.filter(
    (mechanic) => mechanic.status === "Offline"
  ).length;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">
          Mechanic Availability
        </CardTitle>

        <p className="text-sm text-muted-foreground">
          Current field team status
        </p>
      </CardHeader>

      <CardContent>
        {/* Summary */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-emerald-500/10 p-3 text-center">
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {available}
            </p>

            <p className="mt-1 text-[11px] text-muted-foreground">
              Available
            </p>
          </div>

          <div className="rounded-lg bg-amber-500/10 p-3 text-center">
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
              {onJob}
            </p>

            <p className="mt-1 text-[11px] text-muted-foreground">
              On Job
            </p>
          </div>

          <div className="rounded-lg bg-muted p-3 text-center">
            <p className="text-xl font-bold text-muted-foreground">
              {offline}
            </p>

            <p className="mt-1 text-[11px] text-muted-foreground">
              Offline
            </p>
          </div>
        </div>

        {/* Utilization */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">
              Team utilization
            </span>

            <span className="text-sm font-semibold">
              78%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: "78%" }}
            />
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            14 of 18 mechanics are currently active
          </p>
        </div>

        {/* Mechanic List */}
        <div className="mt-6 space-y-3">
          {mechanics.map((mechanic) => {
            const config =
              statusConfig[mechanic.status as keyof typeof statusConfig];

            const StatusIcon = config.icon;

            return (
              <div
                key={mechanic.name}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {mechanic.initials}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {mechanic.name}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    {mechanic.service}
                  </p>
                </div>

                <div
                  className={`flex shrink-0 items-center gap-1.5 text-xs font-medium ${config.className}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${config.dot}`}
                  />

                  <span className="hidden sm:inline">
                    {mechanic.status}
                  </span>

                  <StatusIcon className="h-3.5 w-3.5 sm:hidden" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 border-t pt-4 text-xs text-muted-foreground">
          <UserRound className="h-3.5 w-3.5" />
          18 mechanics registered
        </div>
      </CardContent>
    </Card>
  );
}