"use client";

import * as React from "react";

import {
  Clock3,
  Search,
  UserCheck,
  Users,
  Wrench,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import { useAppAlert } from "@/components/ui/app-alert";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  getMechanicJobsToday,
  getMechanicStatus,
  getTodayDateKey,
  useOperationsStore,
} from "@/lib/operations-store";

import type {
  Mechanic,
  MechanicStatus,
} from "@/lib/operations-types";

import { MechanicsTable } from "./mechanics-table";
import { MechanicDetails } from "./mechanic-details";
import { MechanicFormDialog } from "./mechanic-form-dialog";

export type {
  Mechanic,
  MechanicStatus,
};

/* -------------------------------------------------------------------------- */
/* SKELETON                                                                   */
/* -------------------------------------------------------------------------- */

function MechanicsSkeleton() {
  return (
    <div className="space-y-6 pb-8">
      {/* Header */}

      <div>
        <Skeleton className="h-4 w-44" />

        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="w-full">
            <Skeleton className="h-9 w-40" />

            <Skeleton className="mt-2 h-4 w-80 max-w-full" />
          </div>

          <Skeleton className="h-10 w-full rounded-md sm:w-36" />
        </div>
      </div>

      {/* Stats */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-4 w-28" />

                  <Skeleton className="mt-3 h-8 w-16" />

                  <Skeleton className="mt-2 h-3 w-32" />
                </div>

                <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mechanics Card */}

      <Card>
        <CardContent className="p-0">
          {/* Toolbar */}

          <div className="flex flex-col gap-4 border-b p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Skeleton className="h-5 w-28" />

              <Skeleton className="mt-2 h-3 w-24" />
            </div>

            <div className="relative w-full lg:w-80">
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          </div>

          {/* Filters */}

          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
            <Skeleton className="h-9 w-full rounded-md sm:w-32" />

            <Skeleton className="h-9 w-28 rounded-md" />
          </div>

          {/* Desktop Table */}

          <div className="hidden md:block">
            <div className="border-b px-5 py-3">
              <div className="grid grid-cols-6 gap-4">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="ml-auto h-3 w-16" />
              </div>
            </div>

            {Array.from({
              length: 5,
            }).map((_, index) => (
              <div
                key={index}
                className="border-b px-5 py-4 last:border-b-0"
              >
                <div className="grid grid-cols-6 items-center gap-4">
                  {/* Mechanic */}

                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 shrink-0 rounded-full" />

                    <div className="min-w-0">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="mt-2 h-3 w-20" />
                    </div>
                  </div>

                  {/* Contact */}

                  <div>
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="mt-2 h-3 w-20" />
                  </div>

                  {/* Specialization */}

                  <div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="mt-2 h-3 w-16" />
                  </div>

                  {/* Jobs */}

                  <div>
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="mt-2 h-3 w-20" />
                  </div>

                  {/* Status */}

                  <div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>

                  {/* Actions */}

                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-16 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Mechanics */}

          <div className="divide-y md:hidden">
            {Array.from({
              length: 5,
            }).map((_, index) => (
              <div
                key={index}
                className="space-y-4 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Skeleton className="h-10 w-10 shrink-0 rounded-full" />

                    <div className="min-w-0">
                      <Skeleton className="h-4 w-32" />

                      <Skeleton className="mt-2 h-3 w-20" />
                    </div>
                  </div>

                  <Skeleton className="h-6 w-20 shrink-0 rounded-full" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="mt-2 h-4 w-24" />
                  </div>

                  <div>
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="mt-2 h-4 w-20" />
                  </div>

                  <div>
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="mt-2 h-4 w-24" />
                  </div>

                  <div>
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="mt-2 h-4 w-16" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Skeleton className="h-8 flex-1 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}

          <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-4 w-48" />

            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-16 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ERROR                                                                      */
/* -------------------------------------------------------------------------- */

function MechanicsError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="space-y-6 pb-8">
      {/* Header */}

      <div>
        <p className="text-sm text-muted-foreground">
          Operations / Mechanics
        </p>

        <div className="mt-1 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Mechanics
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage your mechanics and
              monitor their availability.
            </p>
          </div>
        </div>
      </div>

      {/* Error */}

      <Card>
        <CardContent className="flex min-h-80 flex-col items-center justify-center p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
            <Wrench className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>

          <h2 className="mt-4 font-semibold">
            Unable to load mechanics
          </h2>

          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {message}
          </p>

          <Button
            variant="outline"
            className="mt-4"
            onClick={onRetry}
          >
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export function MechanicsPage() {
  const {
    mechanics,
    bookings,
    mechanicsLoading,
    mechanicsError,
    addMechanic,
    updateMechanic,
  } = useOperationsStore();

  const [search, setSearch] =
    React.useState("");

  const { showAlert } = useAppAlert();

  const [status, setStatus] =
    React.useState("All Status");

  const [page, setPage] =
    React.useState(1);

  const [
    selectedMechanicId,
    setSelectedMechanicId,
  ] = React.useState<string | null>(
    null
  );

  const [
    detailsOpen,
    setDetailsOpen,
  ] = React.useState(false);

  const [
    formOpen,
    setFormOpen,
  ] = React.useState(false);

  const [
    formMode,
    setFormMode,
  ] = React.useState<
    "create" | "edit"
  >("create");

  const [
    editingMechanic,
    setEditingMechanic,
  ] = React.useState<Mechanic | null>(
    null
  );

  const pageSize = 5;

  /*
   * --------------------------------
   * TODAY
   * --------------------------------
   */

  const todayKey = getTodayDateKey();

  /*
   * --------------------------------
   * DERIVED MECHANIC DATA
   * --------------------------------
   */

  const mechanicData =
    React.useMemo(() => {
      return mechanics.map(
        (mechanic) => ({
          ...mechanic,

          jobsToday:
            getMechanicJobsToday(
              mechanic,
              bookings,
              todayKey
            ),

          status:
            getMechanicStatus(
              mechanic,
              bookings,
              todayKey
            ),
        })
      );
    }, [
      mechanics,
      bookings,
      todayKey,
    ]);

  /*
   * --------------------------------
   * SELECTED MECHANIC
   * --------------------------------
   */

  const selectedMechanic =
    React.useMemo(() => {
      if (!selectedMechanicId) {
        return null;
      }

      return (
        mechanicData.find(
          (mechanic) =>
            mechanic.id ===
            selectedMechanicId
        ) ?? null
      );
    }, [
      mechanicData,
      selectedMechanicId,
    ]);

  /*
   * --------------------------------
   * MECHANIC ACTIONS
   * --------------------------------
   */

  const handleMechanicClick = (
    mechanic: Mechanic
  ) => {
    setSelectedMechanicId(
      mechanic.id
    );

    setDetailsOpen(true);
  };

  const handleAddMechanic = () => {
    setFormMode("create");
    setEditingMechanic(null);
    setFormOpen(true);
  };

  const handleEditMechanic = (
    mechanic: Mechanic
  ) => {
    setFormMode("edit");
    setEditingMechanic(mechanic);
    setFormOpen(true);
  };

  const handleSaveMechanic = (
    mechanic: Mechanic
  ) => {
    const existing = mechanics.some(
      (item) =>
        item.id === mechanic.id
    );

    if (existing) {
      updateMechanic(mechanic);

      showAlert(
        "Mechanic updated successfully.",
        "success"
      );
    } else {
      addMechanic(mechanic);

      showAlert(
        "Mechanic added successfully.",
        "success"
      );
    }

    setFormOpen(false);
  };

  /*
   * --------------------------------
   * FILTERING
   * --------------------------------
   */

  const filteredMechanics =
    React.useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return mechanicData.filter(
        (mechanic) => {
          const matchesSearch =
            !query ||
            mechanic.id
              .toLowerCase()
              .includes(query) ||
            mechanic.name
              .toLowerCase()
              .includes(query) ||
            mechanic.phone
              .toLowerCase()
              .includes(query) ||
            mechanic.specialization
              .toLowerCase()
              .includes(query);

          const matchesStatus =
            status === "All Status" ||
            mechanic.status === status;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      mechanicData,
      search,
      status,
    ]);

  /*
   * --------------------------------
   * PAGINATION
   * --------------------------------
   */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredMechanics.length /
        pageSize
    )
  );

  const paginatedMechanics =
    filteredMechanics.slice(
      (page - 1) * pageSize,
      page * pageSize
    );

  React.useEffect(() => {
    setPage(1);
  }, [search, status]);

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [
    page,
    totalPages,
  ]);

  /*
   * --------------------------------
   * FILTER RESET
   * --------------------------------
   */

  const clearFilters = () => {
    setSearch("");
    setStatus("All Status");
    setPage(1);
  };

  const hasFilters =
    search !== "" ||
    status !== "All Status";

  /*
   * --------------------------------
   * DYNAMIC STATS
   * --------------------------------
   */

  const totalMechanics =
    mechanicData.length;

  const availableMechanics =
    mechanicData.filter(
      (mechanic) =>
        mechanic.status ===
        "Available"
    ).length;

  const onServiceMechanics =
    mechanicData.filter(
      (mechanic) =>
        mechanic.status ===
        "On Service"
    ).length;

  const offlineMechanics =
    mechanicData.filter(
      (mechanic) =>
        mechanic.status ===
        "Offline"
    ).length;

  const stats = [
    {
      title: "Total Mechanics",
      value:
        totalMechanics.toLocaleString(
          "en-IN"
        ),
      description:
        "Registered mechanics",
      icon: Users,
    },
    {
      title: "Available",
      value:
        availableMechanics.toLocaleString(
          "en-IN"
        ),
      description:
        "Ready for assignment",
      icon: UserCheck,
    },
    {
      title: "On Service",
      value:
        onServiceMechanics.toLocaleString(
          "en-IN"
        ),
      description:
        "Currently working",
      icon: Wrench,
    },
    {
      title: "Offline",
      value:
        offlineMechanics.toLocaleString(
          "en-IN"
        ),
      description:
        "Currently unavailable",
      icon: Clock3,
    },
  ];

  /*
   * --------------------------------
   * LOADING
   * --------------------------------
   *
   * Only show the skeleton during
   * the initial load.
   *
   * Once data exists, background
   * refreshes won't flash the page.
   */

  if (
    mechanicsLoading &&
    mechanics.length === 0
  ) {
    return <MechanicsSkeleton />;
  }

  /*
   * --------------------------------
   * ERROR
   * --------------------------------
   */

  if (
    mechanicsError &&
    mechanics.length === 0
  ) {
    return (
      <MechanicsError
        message={mechanicsError}
        onRetry={() => {
          window.location.reload();
        }}
      />
    );
  }

  /*
   * --------------------------------
   * RENDER
   * --------------------------------
   */

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}

      <div>
        <p className="text-sm text-muted-foreground">
          Operations / Mechanics
        </p>

        <div className="mt-1 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Mechanics
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage your mechanics and
              monitor their availability.
            </p>
          </div>

          <Button
            className="w-full sm:w-auto"
            onClick={
              handleAddMechanic
            }
          >
            <Users className="h-4 w-4" />
            Add Mechanic
          </Button>
        </div>
      </div>

      {/* Stats */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.title}
              className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>

                    <p className="mt-2 text-2xl font-bold tracking-tight">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mechanics */}

      <Card>
        <CardContent className="p-0">
          {/* Toolbar */}

          <div className="flex flex-col gap-4 border-b p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold">
                All Mechanics
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                {filteredMechanics.length}{" "}
                mechanic
                {filteredMechanics.length !==
                1
                  ? "s"
                  : ""}{" "}
                found
              </p>
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search mechanics..."
                className="pl-9"
              />
            </div>
          </div>

          {/* Filter */}

          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value
                )
              }
              className="h-9 rounded-md border bg-background px-3 text-sm"
            >
              <option>
                All Status
              </option>

              <option>
                Available
              </option>

              <option>
                On Service
              </option>

              <option>
                Offline
              </option>
            </select>

            {hasFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={
                  clearFilters
                }
              >
                Clear filters
              </Button>
            )}
          </div>

          {/* Table */}

          <MechanicsTable
            data={
              paginatedMechanics
            }
            onMechanicClick={
              handleMechanicClick
            }
            onEditMechanic={
              handleEditMechanic
            }
          />

          {/* Empty */}

          {filteredMechanics.length ===
            0 && (
            <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>

              <h3 className="mt-4 font-semibold">
                No mechanics found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Try changing your
                search or status
                filter.
              </p>

              {hasFilters && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={
                    clearFilters
                  }
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}

          {/* Pagination */}

          {filteredMechanics.length >
            0 && (
            <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {(page - 1) *
                    pageSize +
                    1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-foreground">
                  {Math.min(
                    page *
                      pageSize,
                    filteredMechanics.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {
                    filteredMechanics.length
                  }
                </span>
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    page === 1
                  }
                  onClick={() =>
                    setPage(
                      (current) =>
                        current - 1
                    )
                  }
                >
                  Previous
                </Button>

                <div className="flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-xs font-medium">
                  {page}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    page ===
                    totalPages
                  }
                  onClick={() =>
                    setPage(
                      (current) =>
                        current + 1
                    )
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details */}

      <MechanicDetails
        mechanic={
          selectedMechanic
        }
        open={detailsOpen}
        onOpenChange={
          setDetailsOpen
        }
        onEdit={
          handleEditMechanic
        }
      />

      {/* Add / Edit */}

      <MechanicFormDialog
        open={formOpen}
        onOpenChange={
          setFormOpen
        }
        mode={formMode}
        mechanic={
          editingMechanic
        }
        onSave={
          handleSaveMechanic
        }
      />
    </div>
  );
}