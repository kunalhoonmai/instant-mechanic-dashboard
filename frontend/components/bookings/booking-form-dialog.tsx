"use client";

import * as React from "react";

import {
  CalendarDays,
  Car,
  IndianRupee,
  Loader2,
  Phone,
  User,
  Wrench,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAppAlert } from "@/components/ui/app-alert";

import api from "@/lib/api";

import {
  mapBackendBooking,
  type BackendBooking,
  type BackendCustomer,
  type BackendMechanic,
  type BackendService,
} from "@/lib/mappers";

import type {
  Booking,
  BookingStatus,
} from "@/lib/operations-types";

/* -------------------------------------------------------------------------- */
/* Props                                                                      */
/* -------------------------------------------------------------------------- */

interface BookingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking?: Booking | null;
  mode: "create" | "edit";
  onSave: (booking: Booking) => void;
}

/* -------------------------------------------------------------------------- */
/* API Response Types                                                         */
/* -------------------------------------------------------------------------- */

interface CustomersResponse {
  success: boolean;
  data: BackendCustomer[];
}

interface MechanicsResponse {
  success: boolean;
  data: BackendMechanic[];
}

interface ServicesResponse {
  success: boolean;
  data: BackendService[];
}

interface BookingResponse {
  success: boolean;
  data: BackendBooking;
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const statuses: BookingStatus[] = [
  "Pending",
  "Assigned",
  "Completed",
  "Cancelled",
];

/* -------------------------------------------------------------------------- */
/* Date Helpers                                                               */
/* -------------------------------------------------------------------------- */

function getToday(): string {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateForDisplay(
  date: string
): string {
  if (!date) {
    return "";
  }

  const parsed = new Date(
    `${date}T00:00:00`
  );

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return date;
  }

  return parsed.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }
  );
}

function convertExistingDate(
  date: string
): string {
  if (!date) {
    return getToday();
  }

  /*
   * Preserve YYYY-MM-DD values directly.
   * This avoids timezone-related date shifts.
   */
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

  const parsed = new Date(date);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return getToday();
  }

  const year =
    parsed.getFullYear();

  const month = String(
    parsed.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    parsed.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function convertTimeToInput(
  time: string
): string {
  if (!time) {
    return "09:30";
  }

  /*
   * Already in HTML time-input format.
   */
  if (
    /^\d{2}:\d{2}$/.test(time)
  ) {
    return time;
  }

  const match = time.match(
    /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
  );

  if (!match) {
    return time;
  }

  let hour = Number(
    match[1]
  );

  const minute = match[2];

  const period =
    match[3].toUpperCase();

  if (
    period === "PM" &&
    hour !== 12
  ) {
    hour += 12;
  }

  if (
    period === "AM" &&
    hour === 12
  ) {
    hour = 0;
  }

  return `${String(hour).padStart(
    2,
    "0"
  )}:${minute}`;
}

function formatTimeForDisplay(
  time: string
): string {
  if (!time) {
    return "";
  }

  const [hours, minutes] =
    time.split(":");

  let hour = Number(hours);

  if (
    Number.isNaN(hour) ||
    !minutes
  ) {
    return time;
  }

  const period =
    hour >= 12 ? "PM" : "AM";

  hour =
    hour % 12 || 12;

  return `${String(hour).padStart(
    2,
    "0"
  )}:${minutes} ${period}`;
}

/* -------------------------------------------------------------------------- */
/* Vehicle Helper                                                             */
/* -------------------------------------------------------------------------- */

function parseVehicle(
  vehicle: string
): {
  make: string;
  model: string;
} {
  const cleaned =
    vehicle.trim();

  if (!cleaned) {
    return {
      make: "Unknown",
      model: "Vehicle",
    };
  }

  const parts =
    cleaned.split(/\s+/);

  if (
    parts.length === 1
  ) {
    return {
      make: parts[0],
      model: "Vehicle",
    };
  }

  return {
    make: parts[0],
    model: parts
      .slice(1)
      .join(" "),
  };
}

/* -------------------------------------------------------------------------- */
/* Customer Helpers                                                           */
/* -------------------------------------------------------------------------- */

function digitsOnly(
  value: string
): string {
  return value.replace(
    /\D/g,
    ""
  );
}

function createFallbackEmail(
  phone: string
): string {
  const digits =
    digitsOnly(phone);

  return `customer-${
    digits || Date.now()
  }@instantmechanic.local`;
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
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function BookingFormDialog({
  open,
  onOpenChange,
  booking,
  mode,
  onSave,
}: BookingFormDialogProps) {
  const { showAlert } = useAppAlert();

  const [customer, setCustomer] =
    React.useState("");

  const [phone, setPhone] =
    React.useState("");

  const [vehicle, setVehicle] =
    React.useState("");

  const [service, setService] =
    React.useState("");

  const [mechanic, setMechanic] =
    React.useState("");

  const [date, setDate] =
    React.useState(getToday());

  const [time, setTime] =
    React.useState("09:30");

  const [amount, setAmount] =
    React.useState(0);

  const [status, setStatus] =
    React.useState<BookingStatus>(
      "Pending"
    );

  const [error, setError] =
    React.useState("");

  const [submitting, setSubmitting] =
    React.useState(false);

  const [mechanics, setMechanics] =
    React.useState<
      BackendMechanic[]
    >([]);

  const [services, setServices] =
    React.useState<
      BackendService[]
    >([]);

  const [customers, setCustomers] =
    React.useState<
      BackendCustomer[]
    >([]);

  const [
    loadingOptions,
    setLoadingOptions,
  ] = React.useState(false);

  /* ------------------------------------------------------------------------ */
  /* Load backend options                                                     */
  /* ------------------------------------------------------------------------ */

  React.useEffect(() => {
    if (!open) {
      return;
    }

    let mounted = true;

    async function loadOptions() {
      setLoadingOptions(true);
      setError("");

      try {
        const [
          mechanicsResponse,
          servicesResponse,
          customersResponse,
        ] = await Promise.all([
          api.get<MechanicsResponse>(
            "/mechanics"
          ),

          api.get<ServicesResponse>(
            "/services"
          ),

          api.get<CustomersResponse>(
            "/customers"
          ),
        ]);

        if (!mounted) {
          return;
        }

        setMechanics(
          mechanicsResponse.data
            .data ?? []
        );

        setServices(
          servicesResponse.data
            .data ?? []
        );

        setCustomers(
          customersResponse.data
            .data ?? []
        );
      } catch (loadError) {
        console.error(
          "Failed to load booking form options:",
          loadError
        );

        if (mounted) {
          const message =
            getApiErrorMessage(
              loadError,
              "Could not load booking options. Please make sure the backend is running."
            );

          setError(message);

          showAlert(
            message,
            "error"
          );
        }
      } finally {
        if (mounted) {
          setLoadingOptions(
            false
          );
        }
      }
    }

    void loadOptions();

    return () => {
      mounted = false;
    };
  }, [open]);

  /* ------------------------------------------------------------------------ */
  /* Load form data                                                           */
  /* ------------------------------------------------------------------------ */

  React.useEffect(() => {
    if (!open) {
      return;
    }

    setError("");

    if (
      mode === "edit" &&
      booking
    ) {
      setCustomer(
        booking.customer
      );

      setPhone(
        booking.phone
      );

      setVehicle(
        booking.vehicle
      );

      setService(
        booking.service
      );

      setMechanic(
        booking.mechanic ===
          "Unassigned"
          ? ""
          : booking.mechanic
      );

      setDate(
        convertExistingDate(
          booking.date
        )
      );

      setTime(
        convertTimeToInput(
          booking.time
        )
      );

      setAmount(
        booking.amount
      );

      setStatus(
        booking.status
      );

      return;
    }

    setCustomer("");
    setPhone("");
    setVehicle("");
    setService("");
    setMechanic("");
    setDate(getToday());
    setTime("09:30");
    setAmount(0);
    setStatus("Pending");
  }, [
    open,
    mode,
    booking,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Service                                                                  */
  /* ------------------------------------------------------------------------ */

  const handleServiceChange = (
    value: string | null
  ) => {
    const nextValue =
      value ?? "";

    setService(nextValue);

    if (!nextValue) {
      setAmount(0);
      return;
    }

    const selectedService =
      services.find(
        (item) =>
          item.name ===
          nextValue
      );

    if (selectedService) {
      setAmount(
        selectedService.basePrice
      );
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Mechanic                                                                 */
  /* ------------------------------------------------------------------------ */

  const handleMechanicChange = (
    value: string | null
  ) => {
    setMechanic(
      value ?? ""
    );
  };

  /* ------------------------------------------------------------------------ */
  /* Status                                                                   */
  /* ------------------------------------------------------------------------ */

  const handleStatusChange = (
    value: string | null
  ) => {
    if (!value) {
      return;
    }

    setStatus(
      value as BookingStatus
    );
  };

  /* ------------------------------------------------------------------------ */
  /* Find or create customer                                                  */
  /* ------------------------------------------------------------------------ */

  const findOrCreateCustomer =
    async (): Promise<BackendCustomer> => {
      const normalizedPhone =
        digitsOnly(phone);

      const normalizedName =
        customer
          .trim()
          .toLowerCase();

      const existingCustomer =
        customers.find(
          (item) =>
            normalizedPhone &&
            digitsOnly(
              item.phone
            ) ===
              normalizedPhone
        ) ??
        customers.find(
          (item) =>
            item.name
              .trim()
              .toLowerCase() ===
            normalizedName
        );

      if (existingCustomer) {
        return existingCustomer;
      }

      const response =
        await api.post<{
          success: boolean;
          data: BackendCustomer;
        }>("/customers", {
          name: customer.trim(),

          phone: phone.trim(),

          email:
            createFallbackEmail(
              phone
            ),

          address:
            "Not provided",

          vehicles: [],
        });

      if (
        !response.data.success ||
        !response.data.data
      ) {
        throw new Error(
          "Customer could not be created."
        );
      }

      return response.data.data;
    };

  /* ------------------------------------------------------------------------ */
  /* Find backend service                                                     */
  /* ------------------------------------------------------------------------ */

  const findService =
    React.useCallback(() => {
      return services.find(
        (item) =>
          item.name ===
          service
      );
    }, [
      services,
      service,
    ]);

  /* ------------------------------------------------------------------------ */
  /* Find backend mechanic                                                    */
  /* ------------------------------------------------------------------------ */

  const findMechanic =
    React.useCallback(() => {
      return mechanics.find(
        (item) =>
          item.name ===
          mechanic
      );
    }, [
      mechanics,
      mechanic,
    ]);

  /* ------------------------------------------------------------------------ */
  /* Submit                                                                   */
  /* ------------------------------------------------------------------------ */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    /* ---------------------------------------------------------------------- */
    /* Basic validation                                                       */
    /* ---------------------------------------------------------------------- */

    if (!customer.trim()) {
      setError(
        "Please enter the customer name."
      );
      return;
    }

    if (!phone.trim()) {
      setError(
        "Please enter the phone number."
      );
      return;
    }

    if (
      digitsOnly(phone).length <
      10
    ) {
      setError(
        "Please enter a valid phone number."
      );
      return;
    }

    if (!vehicle.trim()) {
      setError(
        "Please enter the vehicle."
      );
      return;
    }

    if (!service) {
      setError(
        "Please select a service."
      );
      return;
    }

    if (!mechanic) {
      setError(
        "Please select a mechanic."
      );
      return;
    }

    if (!date) {
      setError(
        "Please select an appointment date."
      );
      return;
    }

    if (!time) {
      setError(
        "Please select an appointment time."
      );
      return;
    }

    if (amount <= 0) {
      setError(
        "Please enter a valid service amount."
      );
      return;
    }

    const selectedService =
      findService();

    if (!selectedService) {
      setError(
        "Selected service could not be found in the backend."
      );
      return;
    }

    const selectedMechanic =
      findMechanic();

    if (!selectedMechanic) {
      setError(
        "Selected mechanic could not be found in the backend."
      );
      return;
    }

    setSubmitting(true);

    try {
      /* -------------------------------------------------------------------- */
      /* Customer                                                             */
      /* -------------------------------------------------------------------- */

      const selectedCustomer =
        await findOrCreateCustomer();

      /* -------------------------------------------------------------------- */
      /* Vehicle                                                              */
      /* -------------------------------------------------------------------- */

      const parsedVehicle =
        parseVehicle(vehicle);

      /* -------------------------------------------------------------------- */
      /* CREATE                                                               */
      /* -------------------------------------------------------------------- */

      if (
        mode === "create"
      ) {
        const response =
          await api.post<BookingResponse>(
            "/bookings",
            {
              customerId:
                selectedCustomer._id,

              mechanicId:
                selectedMechanic._id,

              serviceId:
                selectedService._id,

              vehicle: {
                make:
                  parsedVehicle.make,

                model:
                  parsedVehicle.model,

                year:
                  new Date().getFullYear(),

                /*
                 * The current UI does not
                 * collect a registration number.
                 *
                 * Keep a temporary backend-safe
                 * value until that field is added.
                 */
                registrationNumber:
                  `PENDING-${Date.now()
                    .toString()
                    .slice(-6)}`,
              },

              date,

              time:
                formatTimeForDisplay(
                  time
                ),

              amount,

              status,

              notes:
                "Created from admin dashboard.",
            }
          );

        if (
          !response.data.success ||
          !response.data.data
        ) {
          throw new Error(
            "Booking could not be created."
          );
        }

        const savedBooking =
          response.data.data;

        /*
         * Update the local store immediately.
         *
         * Socket.IO will also emit the
         * booking:created event, and the
         * store will safely upsert it.
         */
        showAlert(
          "Booking created successfully.",
          "success"
        );

        onSave(
          mapBackendBooking(
            savedBooking
          )
        );

        onOpenChange(false);

        onOpenChange(false);

        return;
      }

      /* -------------------------------------------------------------------- */
      /* EDIT                                                                 */
      /* -------------------------------------------------------------------- */

      if (!booking) {
        setError(
          "Booking details are missing."
        );
        return;
      }

      /*
       * Fetch the current backend booking.
       *
       * The frontend Booking type only contains
       * display names. The backend requires
       * MongoDB ObjectIds.
       *
       * We use the existing booking to preserve
       * vehicle information such as year and
       * registration number.
       */
      const existingResponse =
        await api.get<BookingResponse>(
          `/bookings/${booking.id}`
        );

      if (
        !existingResponse.data
          .success ||
        !existingResponse.data
          .data
      ) {
        throw new Error(
          "Existing booking could not be loaded."
        );
      }

      const existingBooking =
        existingResponse.data.data;

      const response =
        await api.patch<BookingResponse>(
          `/bookings/${booking.id}`,
          {
            customerId:
              selectedCustomer._id,

            mechanicId:
              selectedMechanic._id,

            serviceId:
              selectedService._id,

            vehicle: {
              make:
                parsedVehicle.make,

              model:
                parsedVehicle.model,

              year:
                existingBooking
                  .vehicle?.year ??
                new Date().getFullYear(),

              registrationNumber:
                existingBooking
                  .vehicle
                  ?.registrationNumber ??
                `PENDING-${Date.now()
                  .toString()
                  .slice(-6)}`,
            },

            date,

            time:
              formatTimeForDisplay(
                time
              ),

            amount,

            status,
          }
        );

      if (
        !response.data.success ||
        !response.data.data
      ) {
        throw new Error(
          "Booking could not be updated."
        );
      }

      const savedBooking =
        response.data.data;

      showAlert(
        "Booking updated successfully.",
        "success"
      );

      onSave(
        mapBackendBooking(
          savedBooking
        )
      );

      onOpenChange(false);

      onOpenChange(false);
    } catch (submitError) {
      console.error(
        "Failed to save booking:",
        submitError
      );

      const message =
        getApiErrorMessage(
          submitError,
          "Failed to save booking. Please try again."
        );

      setError(message);

      showAlert(
        message,
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <Dialog
      open={open}
      onOpenChange={
        submitting
          ? undefined
          : onOpenChange
      }
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {mode === "create"
              ? "New Booking"
              : "Edit Booking"}
          </DialogTitle>

          <DialogDescription>
            {mode === "create"
              ? "Create a new customer service booking."
              : `Update details for ${booking?.id}.`}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* ---------------------------------------------------------------- */}
          {/* Customer                                                          */}
          {/* ---------------------------------------------------------------- */}

          <section className="space-y-4">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </span>

                Customer Information
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Enter the customer's contact information.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Customer Name */}
              <div className="space-y-2">
                <Label htmlFor="customer">
                  Customer Name
                </Label>

                <Input
                  id="customer"
                  value={customer}
                  onChange={(event) =>
                    setCustomer(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Rahul Sharma"
                  autoComplete="name"
                  disabled={submitting}
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number
                </Label>

                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="phone"
                    value={phone}
                    onChange={(event) =>
                      setPhone(
                        event.target.value
                      )
                    }
                    placeholder="+91 98765 43210"
                    className="pl-9"
                    type="tel"
                    autoComplete="tel"
                    disabled={submitting}
                  />
                </div>
              </div>
            </div>

            {/* Vehicle */}
            <div className="space-y-2">
              <Label htmlFor="vehicle">
                Vehicle
              </Label>

              <div className="relative">
                <Car className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="vehicle"
                  value={vehicle}
                  onChange={(event) =>
                    setVehicle(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Hyundai Creta"
                  className="pl-9"
                  disabled={submitting}
                />
              </div>
            </div>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* Service                                                           */}
          {/* ---------------------------------------------------------------- */}

          <section className="space-y-4 border-t pt-6">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Wrench className="h-4 w-4" />
                </span>

                Service Details
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Select the service and assign a mechanic.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Service */}
              <div className="space-y-2">
                <Label>
                  Service
                </Label>

                <Select
                  value={service}
                  onValueChange={
                    handleServiceChange
                  }
                  disabled={
                    submitting ||
                    loadingOptions
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        loadingOptions
                          ? "Loading services..."
                          : "Select service"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {services.map(
                      (item) => (
                        <SelectItem
                          key={item._id}
                          value={item.name}
                        >
                          {item.name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Mechanic */}
              <div className="space-y-2">
                <Label>
                  Mechanic
                </Label>

                <Select
                  value={mechanic}
                  onValueChange={
                    handleMechanicChange
                  }
                  disabled={
                    submitting ||
                    loadingOptions
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        loadingOptions
                          ? "Loading mechanics..."
                          : "Select mechanic"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {mechanics.map(
                      (item) => (
                        <SelectItem
                          key={item._id}
                          value={item.name}
                          disabled={
                            item.status ===
                              "Offline" ||
                            item.availability ===
                              "Offline"
                          }
                        >
                          <div className="flex items-center justify-between gap-4">
                            <span>
                              {
                                item.name
                              }
                            </span>

                            <span className="text-xs text-muted-foreground">
                              {
                                item.status
                              }
                            </span>
                          </div>
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">
                Service Amount
              </Label>

              <div className="relative">
                <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="amount"
                  type="number"
                  min="0"
                  value={
                    amount === 0
                      ? ""
                      : amount
                  }
                  onChange={(event) =>
                    setAmount(
                      Number(
                        event.target.value
                      )
                    )
                  }
                  placeholder="0"
                  className="pl-9"
                  disabled={submitting}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Selecting a service automatically
                fills the recommended amount. You
                can modify it if required.
              </p>
            </div>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* Appointment                                                       */}
          {/* ---------------------------------------------------------------- */}

          <section className="space-y-4 border-t pt-6">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CalendarDays className="h-4 w-4" />
                </span>

                Appointment
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Schedule the customer's service.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">
                  Date
                </Label>

                <Input
                  id="date"
                  type="date"
                  value={date}
                  min={getToday()}
                  onChange={(event) =>
                    setDate(
                      event.target.value
                    )
                  }
                  disabled={submitting}
                />

                <p className="text-xs text-muted-foreground">
                  {formatDateForDisplay(
                    date
                  )}
                </p>
              </div>

              {/* Time */}
              <div className="space-y-2">
                <Label htmlFor="time">
                  Time
                </Label>

                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(event) =>
                    setTime(
                      event.target.value
                    )
                  }
                  disabled={submitting}
                />

                <p className="text-xs text-muted-foreground">
                  {formatTimeForDisplay(
                    time
                  )}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>
                Status
              </Label>

              <Select
                value={status}
                onValueChange={
                  handleStatusChange
                }
                disabled={submitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {statuses.map(
                    (item) => (
                      <SelectItem
                        key={item}
                        value={item}
                      >
                        {item}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* ---------------------------------------------------------------- */}
          {/* Error                                                             */}
          {/* ---------------------------------------------------------------- */}

          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* Footer                                                            */}
          {/* ---------------------------------------------------------------- */}

          <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
              disabled={submitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                submitting ||
                loadingOptions
              }
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />

                  {mode === "create"
                    ? "Creating..."
                    : "Saving..."}
                </>
              ) : (
                <>
                  {mode === "create"
                    ? "Create Booking"
                    : "Save Changes"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}