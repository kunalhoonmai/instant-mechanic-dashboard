"use client";

import * as React from "react";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Search,
  Users,
  XCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Skeleton } from "@/components/ui/skeleton";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  useOperationsStore,
} from "@/lib/operations-store";

import type {
  Booking,
  Customer,
  CustomerStatus,
} from "@/lib/operations-types";

import { CustomersTable } from "./customers-table";
import { CustomerFilters } from "./customer-filters";
import { CustomerDetails } from "./customer-details";
import { CustomerFormDialog } from "./customer-form-dialog";

export type {
  Customer,
  CustomerStatus,
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatBookingDate(
  date: string
): string {
  if (!date) {
    return "No date";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return date;
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

function getStatusClassName(
  status: Booking["status"]
): string {
  switch (status) {
    case "Completed":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400";

    case "Pending":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400";

    case "Assigned":
      return "bg-primary/10 text-primary";

    case "Cancelled":
      return "bg-red-500/10 text-red-600 dark:text-red-400";

    default:
      return "bg-muted text-muted-foreground";
  }
}

/* -------------------------------------------------------------------------- */
/* Skeleton                                                                   */
/* -------------------------------------------------------------------------- */

function CustomersSkeleton() {
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
                  <Skeleton className="h-4 w-32" />

                  <Skeleton className="mt-3 h-8 w-16" />

                  <Skeleton className="mt-2 h-3 w-24" />
                </div>

                <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Customers */}

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Toolbar */}

          <div className="flex flex-col gap-4 border-b p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Skeleton className="h-5 w-28" />

              <Skeleton className="mt-2 h-3 w-24" />
            </div>

            <Skeleton className="h-10 w-full rounded-md lg:w-80" />
          </div>

          {/* Filters */}

          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
            <Skeleton className="h-9 w-full rounded-md sm:w-32" />

            <Skeleton className="h-9 w-28 rounded-md" />
          </div>

          {/* Desktop Table */}

          <div className="hidden md:block">
            {/* Table Header */}

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

            {/* Rows */}

            {Array.from({
              length: 5,
            }).map((_, index) => (
              <div
                key={index}
                className="border-b px-5 py-4 last:border-b-0"
              >
                <div className="grid grid-cols-6 items-center gap-4">
                  {/* Customer */}

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

                    <Skeleton className="mt-2 h-3 w-32" />
                  </div>

                  {/* Vehicle */}

                  <div>
                    <Skeleton className="h-4 w-28" />

                    <Skeleton className="mt-2 h-3 w-20" />
                  </div>

                  {/* Bookings */}

                  <div>
                    <Skeleton className="h-4 w-12" />

                    <Skeleton className="mt-2 h-3 w-24" />
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

          {/* Mobile Customers */}

          <div className="divide-y md:hidden">
            {Array.from({
              length: 5,
            }).map((_, index) => (
              <div
                key={index}
                className="space-y-4 p-4"
              >
                {/* Customer Header */}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Skeleton className="h-10 w-10 shrink-0 rounded-full" />

                    <div className="min-w-0">
                      <Skeleton className="h-4 w-32" />

                      <Skeleton className="mt-2 h-3 w-24" />
                    </div>
                  </div>

                  <Skeleton className="h-6 w-20 shrink-0 rounded-full" />
                </div>

                {/* Customer Details */}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Skeleton className="h-3 w-16" />

                    <Skeleton className="mt-2 h-4 w-24" />
                  </div>

                  <div>
                    <Skeleton className="h-3 w-16" />

                    <Skeleton className="mt-2 h-4 w-28" />
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

                {/* Actions */}

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
/* Error                                                                      */
/* -------------------------------------------------------------------------- */

function CustomersError({
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
          Operations / Customers
        </p>

        <div className="mt-1 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Customers
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage customer profiles and service history.
            </p>
          </div>
        </div>
      </div>

      {/* Error */}

      <Card>
        <CardContent className="flex min-h-80 flex-col items-center justify-center p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>

          <h2 className="mt-4 font-semibold">
            Unable to load customers
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
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export function CustomersPage() {
  const {
    customers: customerData,
    bookings,
    customersLoading,
    customersError,
    addCustomer,
    updateCustomer,
  } = useOperationsStore();

  const [
    search,
    setSearch,
  ] = React.useState("");

  const [
    status,
    setStatus,
  ] = React.useState(
    "All Status"
  );

  const [
    page,
    setPage,
  ] = React.useState(1);

  const [
    selectedCustomer,
    setSelectedCustomer,
  ] = React.useState<Customer | null>(
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
    editingCustomer,
    setEditingCustomer,
  ] = React.useState<Customer | null>(
    null
  );

  const [
    bookingsCustomer,
    setBookingsCustomer,
  ] = React.useState<Customer | null>(
    null
  );

  const [
    bookingsOpen,
    setBookingsOpen,
  ] = React.useState(false);

  const pageSize = 5;

  /* ------------------------------------------------------------------------ */
  /* Customer Actions                                                         */
  /* ------------------------------------------------------------------------ */

  const handleCustomerClick = (
    customer: Customer
  ) => {
    setSelectedCustomer(
      customer
    );

    setDetailsOpen(true);
  };

  const handleNewCustomer = () => {
    setFormMode("create");
    setEditingCustomer(null);
    setFormOpen(true);
  };

  const handleEditCustomer = (
    customer: Customer
  ) => {
    setFormMode("edit");
    setEditingCustomer(
      customer
    );
    setFormOpen(true);
  };

  const handleViewBookings = (
    customer: Customer
  ) => {
    setBookingsCustomer(
      customer
    );

    setBookingsOpen(true);
  };

  const handleSaveCustomer = (
    customer: Customer
  ) => {
    const existing =
      customerData.some(
        (item) =>
          item.id === customer.id
      );

    if (existing) {
      updateCustomer(
        customer
      );
    } else {
      addCustomer(
        customer
      );
    }

    setSelectedCustomer(
      customer
    );

    setFormOpen(false);
  };

  /* ------------------------------------------------------------------------ */
  /* Selected Customer Bookings                                               */
  /* ------------------------------------------------------------------------ */

  const customerBookings =
    React.useMemo(() => {
      if (!bookingsCustomer) {
        return [];
      }

      return bookings
        .filter(
          (booking) =>
            booking.customerId ===
            bookingsCustomer.id
        )
        .sort(
          (a, b) => {
            const first =
              new Date(
                `${a.date} ${a.time}`
              ).getTime();

            const second =
              new Date(
                `${b.date} ${b.time}`
              ).getTime();

            return second - first;
          }
        );
    }, [
      bookings,
      bookingsCustomer,
    ]);

  /* ------------------------------------------------------------------------ */
  /* Filtering                                                                */
  /* ------------------------------------------------------------------------ */

  const filteredCustomers =
    React.useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return customerData.filter(
        (customer) => {
          const matchesSearch =
            !query ||
            customer.id
              .toLowerCase()
              .includes(query) ||
            customer.name
              .toLowerCase()
              .includes(query) ||
            customer.phone
              .toLowerCase()
              .includes(query) ||
            customer.email
              .toLowerCase()
              .includes(query) ||
            customer.vehicle
              .toLowerCase()
              .includes(query);

          const matchesStatus =
            status ===
              "All Status" ||
            customer.status ===
              status;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      customerData,
      search,
      status,
    ]);

  /* ------------------------------------------------------------------------ */
  /* Pagination                                                               */
  /* ------------------------------------------------------------------------ */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredCustomers.length /
          pageSize
      )
    );

  const paginatedCustomers =
    filteredCustomers.slice(
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
  /* Filters                                                                  */
  /* ------------------------------------------------------------------------ */

  const clearFilters = () => {
    setSearch("");
    setStatus(
      "All Status"
    );
    setPage(1);
  };

  const hasFilters =
    search !== "" ||
    status !==
      "All Status";

  /* ------------------------------------------------------------------------ */
  /* Statistics                                                               */
  /* ------------------------------------------------------------------------ */

  const totalCustomers =
    customerData.length;

  const activeCustomers =
    customerData.filter(
      (customer) =>
        customer.status ===
        "Active"
    ).length;

  const inactiveCustomers =
    customerData.filter(
      (customer) =>
        customer.status ===
        "Inactive"
    ).length;

  const activePercentage =
    totalCustomers > 0
      ? Math.round(
          (activeCustomers /
            totalCustomers) *
            100
        )
      : 0;

  const currentMonth =
    new Date()
      .getMonth();

  const currentYear =
    new Date()
      .getFullYear();

  const newThisMonth =
    customerData.filter(
      (customer) => {
        if (
          !customer.createdAt
        ) {
          return false;
        }

        const created =
          new Date(
            customer.createdAt
          );

        return (
          created.getMonth() ===
            currentMonth &&
          created.getFullYear() ===
            currentYear
        );
      }
    ).length;

  const stats = [
    {
      title:
        "Total Customers",

      value:
        totalCustomers.toLocaleString(
          "en-IN"
        ),

      description:
        "Registered customers",

      icon: Users,
    },

    {
      title:
        "Active Customers",

      value:
        activeCustomers.toLocaleString(
          "en-IN"
        ),

      description:
        `${activePercentage}% active`,

      icon:
        CheckCircle2,
    },

    {
      title:
        "New This Month",

      value:
        newThisMonth.toLocaleString(
          "en-IN"
        ),

      description:
        "New customers",

      icon: Clock3,
    },

    {
      title:
        "Inactive",

      value:
        inactiveCustomers.toLocaleString(
          "en-IN"
        ),

      description:
        "No recorded bookings",

      icon:
        XCircle,
    },
  ];

  /* ------------------------------------------------------------------------ */
  /* Loading State                                                            */
  /* ------------------------------------------------------------------------ */

  if (
    customersLoading &&
    customerData.length === 0
  ) {
    return <CustomersSkeleton />;
  }

  /* ------------------------------------------------------------------------ */
  /* Error State                                                              */
  /* ------------------------------------------------------------------------ */

  if (
    customersError &&
    customerData.length === 0
  ) {
    return (
      <CustomersError
        message={
          customersError
        }
        onRetry={() => {
          window.location.reload();
        }}
      />
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Page                                                                     */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}

      <div>
        <p className="text-sm text-muted-foreground">
          Operations / Customers
        </p>

        <div className="mt-1 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Customers
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage customer profiles and service history.
            </p>
          </div>

          <Button
            className="w-full sm:w-auto"
            onClick={
              handleNewCustomer
            }
          >
            <Users className="h-4 w-4" />
            Add Customer
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

      {/* Customers */}

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Toolbar */}

          <div className="flex flex-col gap-4 border-b p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold">
                All Customers
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                {
                  filteredCustomers.length
                }{" "}
                customer
                {
                  filteredCustomers.length !==
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
                value={search}
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target
                      .value
                  )
                }
                placeholder="Search customers..."
                className="h-10 pl-9"
              />
            </div>
          </div>

          {/* Filters */}

          <CustomerFilters
            status={status}
            onStatusChange={
              setStatus
            }
            onClear={
              clearFilters
            }
            hasFilters={
              hasFilters
            }
          />

          {/* Table */}

          <CustomersTable
            data={
              paginatedCustomers
            }
            onCustomerClick={
              handleCustomerClick
            }
            onEditCustomer={
              handleEditCustomer
            }
            onViewBookings={
              handleViewBookings
            }
          />

          {/* Empty */}

          {filteredCustomers.length ===
            0 && (
            <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>

              <h3 className="mt-4 font-semibold">
                No customers found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Try changing your search or filters.
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

          {filteredCustomers.length >
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
                    filteredCustomers.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {
                    filteredCustomers.length
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

      {/* Customer Details */}

      <CustomerDetails
        customer={
          selectedCustomer
        }
        open={
          detailsOpen
        }
        onOpenChange={
          setDetailsOpen
        }
        onEdit={
          handleEditCustomer
        }
      />

      {/* Customer Form */}

      <CustomerFormDialog
        open={
          formOpen
        }
        onOpenChange={
          setFormOpen
        }
        mode={
          formMode
        }
        customer={
          editingCustomer
        }
        onSave={
          handleSaveCustomer
        }
      />

      {/* Customer Bookings */}

      <Dialog
        open={bookingsOpen}
        onOpenChange={
          setBookingsOpen
        }
      >
        <DialogContent className="max-h-[85vh] overflow-hidden sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {bookingsCustomer?.name
                ? `${bookingsCustomer.name}'s Bookings`
                : "Customer Bookings"}
            </DialogTitle>

            <DialogDescription>
              {bookingsCustomer
                ? `Booking history for ${bookingsCustomer.name}.`
                : "Customer booking history."}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[65vh] overflow-y-auto pr-1">
            {customerBookings.length ===
            0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                </div>

                <h3 className="mt-4 font-semibold">
                  No bookings found
                </h3>

                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  This customer does not have
                  any bookings yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">
                      Total bookings
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Complete booking history
                    </p>
                  </div>

                  <span className="text-lg font-bold">
                    {
                      customerBookings.length
                    }
                  </span>
                </div>

                {customerBookings.map(
                  (booking) => (
                    <div
                      key={
                        booking.id
                      }
                      className="rounded-xl border p-4 transition-colors hover:bg-muted/20"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold">
                              {
                                booking.service
                              }
                            </p>

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClassName(
                                booking.status
                              )}`}
                            >
                              {
                                booking.status
                              }
                            </span>
                          </div>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {
                              booking.bookingId
                            }
                          </p>
                        </div>

                        <p className="shrink-0 text-sm font-semibold">
                          ₹
                          {booking.amount.toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </div>

                      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Date
                          </p>

                          <p className="mt-1 font-medium">
                            {formatBookingDate(
                              booking.date
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground">
                            Time
                          </p>

                          <p className="mt-1 font-medium">
                            {
                              booking.time
                            }
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground">
                            Vehicle
                          </p>

                          <p className="mt-1 font-medium">
                            {
                              booking.vehicle
                            }
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground">
                            Mechanic
                          </p>

                          <p className="mt-1 font-medium">
                            {
                              booking.mechanic
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}