"use client";

import * as React from "react";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Search,
  XCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { Skeleton } from "@/components/ui/skeleton";

import { BookingsTable } from "./bookings-table";
import { BookingsFilters } from "./booking-filters";
import { BookingDetails } from "./booking-details";
import { BookingFormDialog } from "./booking-form-dialog";

import { useOperationsStore } from "@/lib/operations-store";

import type {
  Booking,
  BookingStatus,
} from "@/lib/operations-types";

import api from "@/lib/api";

import {
  mapBackendBooking,
  type BackendBooking,
  type BackendService,
} from "@/lib/mappers";

import {
  connectSocket,
  disconnectSocket,
  getSocket,
} from "@/lib/socket";

export {
  type Booking,
  type BookingStatus,
};

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface DeletedBookingEvent {
  _id?: string;
  id?: string;
  bookingId?: string;
}

interface ServicesResponse {
  success: boolean;
  count?: number;
  data: BackendService[];
}

/* -------------------------------------------------------------------------- */
/* Date Helpers                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Return today's date in local YYYY-MM-DD format.
 *
 * This is intentionally based on local time instead
 * of UTC so that the date filter matches the date
 * shown to the admin.
 */
function getTodayDate(): string {
  const date = new Date();

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Normalize a backend booking date to YYYY-MM-DD.
 *
 * Handles:
 * YYYY-MM-DD
 * YYYY-MM-DDTHH:mm:ss...
 */
function normalizeBookingDate(
  date: string
): string {
  if (!date) {
    return "";
  }

  if (
    /^\d{4}-\d{2}-\d{2}$/.test(
      date
    )
  ) {
    return date;
  }

  if (
    /^\d{4}-\d{2}-\d{2}T/.test(
      date
    )
  ) {
    return date.slice(0, 10);
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "";
  }

  const year =
    parsedDate.getFullYear();

  const month = String(
    parsedDate.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    parsedDate.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* -------------------------------------------------------------------------- */
/* API Error Helper                                                           */
/* -------------------------------------------------------------------------- */

function getApiErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (
    error &&
    typeof error === "object" &&
    "response" in error
  ) {
    const axiosError =
      error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

    const message =
      axiosError.response
        ?.data?.message;

    if (message) {
      return message;
    }
  }

  if (
    error instanceof Error &&
    error.message
  ) {
    return error.message;
  }

  return fallback;
}

/* -------------------------------------------------------------------------- */
/* Bookings Skeleton                                                          */
/* -------------------------------------------------------------------------- */

function BookingsSkeleton() {
  return (
    <div
      className="space-y-6 pb-8"
      aria-busy="true"
      aria-label="Loading bookings"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div>
        <Skeleton className="h-4 w-48" />

        <div className="mt-1 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <Skeleton className="h-9 w-52 rounded-lg" />

            <Skeleton className="h-4 w-80 max-w-full" />
          </div>

          <Skeleton className="h-10 w-full rounded-lg sm:w-32" />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Statistics                                                         */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map(
          (_, index) => (
            <Card key={index}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Skeleton className="h-4 w-28" />

                    <Skeleton className="mt-3 h-8 w-20 rounded-lg" />

                    <Skeleton className="mt-2 h-3 w-32" />
                  </div>

                  <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Main bookings card                                                 */}
      {/* ------------------------------------------------------------------ */}

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* -------------------------------------------------------------- */}
          {/* Toolbar                                                        */}
          {/* -------------------------------------------------------------- */}

          <div className="flex flex-col gap-4 border-b p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />

              <Skeleton className="h-3 w-24" />
            </div>

            <Skeleton className="h-10 w-full rounded-lg lg:w-80" />
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Filters                                                        */}
          {/* -------------------------------------------------------------- */}

          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:flex-wrap sm:items-center">
            <Skeleton className="h-10 w-full rounded-lg sm:w-36" />

            <Skeleton className="h-10 w-full rounded-lg sm:w-40" />

            <Skeleton className="h-10 w-full rounded-lg sm:w-40" />

            <Skeleton className="h-10 w-full rounded-lg sm:w-24" />
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Table                                                          */}
          {/* -------------------------------------------------------------- */}

          <div className="overflow-hidden">
            {/* Table header */}
            <div className="hidden border-b bg-muted/20 px-5 py-3 md:grid md:grid-cols-[1.1fr_1.4fr_1.3fr_1.2fr_1fr_1fr_0.8fr] md:gap-4">
              {Array.from({
                length: 7,
              }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-3 w-16"
                />
              ))}
            </div>

            {/* Desktop / tablet rows */}
            <div className="hidden md:block">
              {Array.from({
                length: 5,
              }).map((_, index) => (
                <div
                  key={index}
                  className="grid min-h-19 grid-cols-[1.1fr_1.4fr_1.3fr_1.2fr_1fr_1fr_0.8fr] items-center gap-4 border-b px-5 py-4 last:border-b-0"
                >
                  {/* Booking ID */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />

                    <Skeleton className="h-3 w-14" />
                  </div>

                  {/* Customer */}
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 shrink-0 rounded-full" />

                    <div className="min-w-0 space-y-2">
                      <Skeleton className="h-4 w-24" />

                      <Skeleton className="h-3 w-28" />
                    </div>
                  </div>

                  {/* Vehicle */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />

                    <Skeleton className="h-3 w-20" />
                  </div>

                  {/* Service */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />

                    <Skeleton className="h-3 w-16" />
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />

                    <Skeleton className="h-3 w-14" />
                  </div>

                  {/* Amount */}
                  <Skeleton className="h-4 w-16" />

                  {/* Status / actions */}
                  <div className="flex justify-end">
                    <Skeleton className="h-7 w-20 rounded-full" />
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile rows */}
            <div className="divide-y md:hidden">
              {Array.from({
                length: 5,
              }).map((_, index) => (
                <div
                  key={index}
                  className="space-y-4 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <Skeleton className="h-10 w-10 shrink-0 rounded-full" />

                      <div className="min-w-0 space-y-2">
                        <Skeleton className="h-4 w-28" />

                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>

                    <Skeleton className="h-7 w-20 shrink-0 rounded-full" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-16" />

                      <Skeleton className="h-4 w-28" />
                    </div>

                    <div className="space-y-2">
                      <Skeleton className="h-3 w-16" />

                      <Skeleton className="h-4 w-24" />
                    </div>

                    <div className="space-y-2">
                      <Skeleton className="h-3 w-16" />

                      <Skeleton className="h-4 w-24" />
                    </div>

                    <div className="space-y-2">
                      <Skeleton className="h-3 w-16" />

                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Pagination                                                     */}
          {/* -------------------------------------------------------------- */}

          <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-3 w-40" />

            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20 rounded-md" />

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
/* BOOKINGS PAGE                                                              */
/* -------------------------------------------------------------------------- */

export function BookingsPage() {
  /* ------------------------------------------------------------------------ */
  /* Existing operations store                                                */
  /* ------------------------------------------------------------------------ */

  const {
    addBooking,
    updateBooking,
    cancelBooking,
  } = useOperationsStore();

  /* ------------------------------------------------------------------------ */
  /* Booking API state                                                        */
  /* ------------------------------------------------------------------------ */

  const [bookingData, setBookingData] =
    React.useState<Booking[]>([]);

  const [loading, setLoading] =
    React.useState(true);

  const [error, setError] =
    React.useState<string | null>(
      null
    );

  /* ------------------------------------------------------------------------ */
  /* Service filter options                                                   */
  /* ------------------------------------------------------------------------ */

  const [services, setServices] =
    React.useState<string[]>([]);

  const [
    servicesLoading,
    setServicesLoading,
  ] = React.useState(true);

  /* ------------------------------------------------------------------------ */
  /* Fetch bookings                                                           */
  /* ------------------------------------------------------------------------ */

  const fetchBookings =
    React.useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await api.get<{
            success: boolean;
            count: number;
            data: BackendBooking[];
          }>("/bookings");

        if (!response.data.success) {
          throw new Error(
            "The server returned an unsuccessful response."
          );
        }

        const mappedBookings =
          response.data.data.map(
            mapBackendBooking
          );

        setBookingData(
          mappedBookings
        );
      } catch (fetchError) {
        console.error(
          "Failed to fetch bookings:",
          fetchError
        );

        setError(
          getApiErrorMessage(
            fetchError,
            "Unable to load bookings from the backend."
          )
        );
      } finally {
        setLoading(false);
      }
    }, []);

  React.useEffect(() => {
    void fetchBookings();
  }, [fetchBookings]);

  /* ------------------------------------------------------------------------ */
  /* Fetch services                                                           */
  /* ------------------------------------------------------------------------ */

  const fetchServices =
    React.useCallback(async () => {
      try {
        setServicesLoading(true);

        const response =
          await api.get<ServicesResponse>(
            "/services"
          );

        if (
          !response.data.success
        ) {
          throw new Error(
            "The server returned an unsuccessful services response."
          );
        }

        const serviceNames =
          (response.data.data ?? [])
            .map(
              (item) =>
                item.name
            )
            .filter(Boolean)
            .sort(
              (a, b) =>
                a.localeCompare(b)
            );

        setServices(
          serviceNames
        );
      } catch (serviceError) {
        console.error(
          "Failed to fetch services:",
          serviceError
        );

        setServices([]);
      } finally {
        setServicesLoading(false);
      }
    }, []);

  React.useEffect(() => {
    void fetchServices();
  }, [fetchServices]);

  /* ------------------------------------------------------------------------ */
  /* Socket.IO live updates                                                   */
  /* ------------------------------------------------------------------------ */

  React.useEffect(() => {
    const socket =
      getSocket();

    const handleBookingCreated = (
      backendBooking: BackendBooking
    ) => {
      const booking =
        mapBackendBooking(
          backendBooking
        );

      setBookingData(
        (current) => {
          const alreadyExists =
            current.some(
              (item) =>
                item.id ===
                booking.id
            );

          if (
            alreadyExists
          ) {
            return current;
          }

          return [
            booking,
            ...current,
          ];
        }
      );
    };

    const handleBookingUpdated = (
      backendBooking: BackendBooking
    ) => {
      const booking =
        mapBackendBooking(
          backendBooking
        );

      setBookingData(
        (current) => {
          const exists =
            current.some(
              (item) =>
                item.id ===
                booking.id
            );

          if (!exists) {
            return [
              booking,
              ...current,
            ];
          }

          return current.map(
            (item) =>
              item.id ===
              booking.id
                ? booking
                : item
          );
        }
      );

      setSelectedBooking(
        (current) =>
          current?.id ===
          booking.id
            ? booking
            : current
      );
    };

    const handleBookingDeleted = (
      event: DeletedBookingEvent
    ) => {
      const deletedId =
        event._id ||
        event.id;

      const deletedBookingId =
        event.bookingId;

      if (
        !deletedId &&
        !deletedBookingId
      ) {
        return;
      }

      setBookingData(
        (current) =>
          current.filter(
            (booking) =>
              booking.id !==
                deletedId &&
              booking.bookingId !==
                deletedBookingId
          )
      );

      setSelectedBooking(
        (current) =>
          current &&
          (
            current.id ===
              deletedId ||
            current.bookingId ===
              deletedBookingId
          )
            ? null
            : current
      );

      setDetailsOpen(
        (current) => {
          if (!current) {
            return false;
          }

          return false;
        }
      );
    };

    socket.on(
      "booking:created",
      handleBookingCreated
    );

    socket.on(
      "booking:updated",
      handleBookingUpdated
    );

    socket.on(
      "booking:deleted",
      handleBookingDeleted
    );

    connectSocket();

    return () => {
      socket.off(
        "booking:created",
        handleBookingCreated
      );

      socket.off(
        "booking:updated",
        handleBookingUpdated
      );

      socket.off(
        "booking:deleted",
        handleBookingDeleted
      );

      disconnectSocket();
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Local UI state                                                           */
  /* ------------------------------------------------------------------------ */

  const [search, setSearch] =
    React.useState("");

  const [formOpen, setFormOpen] =
    React.useState(false);

  const [formMode, setFormMode] =
    React.useState<
      "create" | "edit"
    >("create");

  const [
    editingBooking,
    setEditingBooking,
  ] = React.useState<Booking | null>(
    null
  );

  const [status, setStatus] =
    React.useState(
      "All Status"
    );

  const [service, setService] =
    React.useState(
      "All Services"
    );

  const [date, setDate] =
    React.useState("");

  const [page, setPage] =
    React.useState(1);

  const [
    selectedBooking,
    setSelectedBooking,
  ] = React.useState<Booking | null>(
    null
  );

  const [
    detailsOpen,
    setDetailsOpen,
  ] = React.useState(false);

  const pageSize = 5;

  /* ------------------------------------------------------------------------ */
  /* Booking actions                                                          */
  /* ------------------------------------------------------------------------ */

  const handleBookingClick = (
    booking: Booking
  ) => {
    setSelectedBooking(
      booking
    );

    setDetailsOpen(true);
  };

  const handleNewBooking = () => {
    setFormMode("create");
    setEditingBooking(null);
    setFormOpen(true);
  };

  const handleEditBooking = (
    booking: Booking
  ) => {
    setFormMode("edit");

    setEditingBooking(
      booking
    );

    setFormOpen(true);
  };

  const handleSaveBooking = (
    booking: Booking
  ) => {
    const exists =
      bookingData.some(
        (item) =>
          item.id === booking.id
      );

    if (exists) {
      updateBooking(
        booking
      );
    } else {
      addBooking(
        booking
      );
    }

    setBookingData(
      (current) => {
        const existingIndex =
          current.findIndex(
            (item) =>
              item.id ===
              booking.id
          );

        if (
          existingIndex ===
          -1
        ) {
          return [
            booking,
            ...current,
          ];
        }

        return current.map(
          (item) =>
            item.id ===
            booking.id
              ? booking
              : item
        );
      }
    );

    setSelectedBooking(
      (current) =>
        current?.id ===
        booking.id
          ? booking
          : current
    );

    setFormOpen(false);
  };

  const handleCancelBooking = (
    booking: Booking
  ) => {
    cancelBooking(
      booking.id
    );

    const cancelledBooking =
      {
        ...booking,
        status:
          "Cancelled" as BookingStatus,
      };

    setBookingData(
      (current) =>
        current.map(
          (item) =>
            item.id ===
            booking.id
              ? cancelledBooking
              : item
        )
    );

    setSelectedBooking(
      (current) =>
        current?.id ===
        booking.id
          ? cancelledBooking
          : current
    );
  };

  /* ------------------------------------------------------------------------ */
  /* Filtering                                                                */
  /* ------------------------------------------------------------------------ */

  const filteredBookings =
    React.useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return bookingData.filter(
        (booking) => {
          const displayBookingId =
            (
              booking.bookingId ??
              booking.id
            ).toLowerCase();

          const matchesSearch =
            !query ||
            displayBookingId.includes(
              query
            ) ||
            booking.id
              .toLowerCase()
              .includes(query) ||
            booking.customer
              .toLowerCase()
              .includes(query) ||
            booking.phone
              .toLowerCase()
              .includes(query) ||
            booking.vehicle
              .toLowerCase()
              .includes(query) ||
            booking.service
              .toLowerCase()
              .includes(query) ||
            booking.mechanic
              .toLowerCase()
              .includes(query);

          const matchesStatus =
            status ===
              "All Status" ||
            booking.status ===
              status;

          const matchesService =
            service ===
              "All Services" ||
            booking.service ===
              service;

          const matchesDate =
            !date ||
            normalizeBookingDate(
              booking.date
            ) === date;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesService &&
            matchesDate
          );
        }
      );
    }, [
      bookingData,
      search,
      status,
      service,
      date,
    ]);

  /* ------------------------------------------------------------------------ */
  /* Pagination                                                               */
  /* ------------------------------------------------------------------------ */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredBookings.length /
          pageSize
      )
    );

  const paginatedBookings =
    filteredBookings.slice(
      (page - 1) *
        pageSize,
      page *
        pageSize
    );

  React.useEffect(() => {
    setPage(1);
  }, [
    search,
    status,
    service,
    date,
  ]);

  React.useEffect(() => {
    if (
      page >
      totalPages
    ) {
      setPage(
        totalPages
      );
    }
  }, [
    page,
    totalPages,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Filter reset                                                             */
  /* ------------------------------------------------------------------------ */

  const clearFilters = () => {
    setSearch("");

    setStatus(
      "All Status"
    );

    setService(
      "All Services"
    );

    setDate("");

    setPage(1);
  };

  const hasFilters =
    search !== "" ||
    status !==
      "All Status" ||
    service !==
      "All Services" ||
    date !== "";

  /* ------------------------------------------------------------------------ */
  /* Dynamic stats                                                            */
  /* ------------------------------------------------------------------------ */

  const totalBookings =
    bookingData.length;

  const completedBookings =
    bookingData.filter(
      (item) =>
        item.status ===
        "Completed"
    ).length;

  const pendingBookings =
    bookingData.filter(
      (item) =>
        item.status ===
        "Pending"
    ).length;

  const cancelledBookings =
    bookingData.filter(
      (item) =>
        item.status ===
        "Cancelled"
    ).length;

  const completionRate =
    totalBookings > 0
      ? Math.round(
          (completedBookings /
            totalBookings) *
            100
        )
      : 0;

  const stats = [
    {
      title:
        "Total Bookings",

      value:
        totalBookings.toLocaleString(
          "en-IN"
        ),

      description:
        "All bookings",

      icon:
        CalendarDays,
    },

    {
      title:
        "Completed",

      value:
        completedBookings.toLocaleString(
          "en-IN"
        ),

      description:
        `${completionRate}% completion`,

      icon:
        CheckCircle2,
    },

    {
      title:
        "Pending",

      value:
        pendingBookings.toLocaleString(
          "en-IN"
        ),

      description:
        "Needs attention",

      icon:
        Clock3,
    },

    {
      title:
        "Cancelled",

      value:
        cancelledBookings.toLocaleString(
          "en-IN"
        ),

      description:
        "Cancelled bookings",

      icon:
        XCircle,
    },
  ];

  /* ------------------------------------------------------------------------ */
  /* Loading state                                                            */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return <BookingsSkeleton />;
  }

  /* ------------------------------------------------------------------------ */
  /* Error state                                                              */
  /* ------------------------------------------------------------------------ */

  if (error) {
    return (
      <div className="space-y-6 pb-8">
        <div>
          <p className="text-sm text-muted-foreground">
            Operations / Bookings
          </p>

          <div className="mt-1">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Bookings
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage and track all customer
              service bookings.
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="flex min-h-80 flex-col items-center justify-center p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <XCircle className="h-6 w-6" />
            </div>

            <h2 className="mt-4 font-semibold">
              Unable to load bookings
            </h2>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              {error}
            </p>

            <Button
              variant="outline"
              className="mt-5"
              onClick={
                fetchBookings
              }
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Main UI                                                                  */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">
          Operations / Bookings
        </p>

        <div className="mt-1 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Bookings
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage and track all customer
              service bookings.
            </p>
          </div>

          <Button
            className="w-full sm:w-auto"
            onClick={
              handleNewBooking
            }
          >
            <CalendarDays className="h-4 w-4" />

            New Booking
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(
          (stat) => {
            const Icon =
              stat.icon;

            return (
              <Card
                key={
                  stat.title
                }
                className="group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {
                          stat.title
                        }
                      </p>

                      <p className="mt-2 text-2xl font-bold tracking-tight">
                        {
                          stat.value
                        }
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {
                          stat.description
                        }
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          }
        )}
      </div>

      {/* Bookings */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold">
                All Bookings
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                {
                  filteredBookings.length
                }{" "}
                booking
                {
                  filteredBookings.length !==
                  1
                    ? "s"
                    : ""
                }{" "}
                found
              </p>
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={
                  search
                }
                onChange={(
                  event
                ) =>
                  setSearch(
                    event
                      .target
                      .value
                  )
                }
                placeholder="Search bookings..."
                className="h-10 pl-9"
              />
            </div>
          </div>

          {/* Filters */}
          <BookingsFilters
            status={
              status
            }
            service={
              service
            }
            date={
              date
            }
            services={
              services
            }
            onStatusChange={
              setStatus
            }
            onServiceChange={
              setService
            }
            onDateChange={
              setDate
            }
            onClear={
              clearFilters
            }
            hasFilters={
              hasFilters
            }
          />

          {/* Table */}
          <BookingsTable
            data={
              paginatedBookings
            }
            onBookingClick={
              handleBookingClick
            }
            onEditBooking={
              handleEditBooking
            }
            onCancelBooking={
              handleCancelBooking
            }
          />

          {/* Empty */}
          {filteredBookings.length ===
            0 && (
            <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>

              <h3 className="mt-4 font-semibold">
                No bookings found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Try changing your search or
                filters to find the booking
                you&apos;re looking for.
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
          {filteredBookings.length >
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
                    filteredBookings.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {
                    filteredBookings.length
                  }
                </span>
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    page ===
                    1
                  }
                  onClick={() =>
                    setPage(
                      (
                        current
                      ) =>
                        current -
                        1
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
                      (
                        current
                      ) =>
                        current +
                        1
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
      <BookingDetails
        booking={
          selectedBooking
        }
        open={
          detailsOpen
        }
        onOpenChange={
          setDetailsOpen
        }
        onEdit={
          handleEditBooking
        }
        onCancel={
          handleCancelBooking
        }
      />

      {/* New / Edit Booking */}
      <BookingFormDialog
        open={
          formOpen
        }
        onOpenChange={
          setFormOpen
        }
        mode={
          formMode
        }
        booking={
          editingBooking
        }
        onSave={
          handleSaveBooking
        }
      />
    </div>
  );
}