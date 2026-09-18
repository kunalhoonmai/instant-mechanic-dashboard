"use client";

import * as React from "react";

import api from "@/lib/api";

import {
  connectSocket,
  disconnectSocket,
} from "@/lib/socket";

import {
  mapBackendBooking,
  mapBackendCustomer,
  mapBackendMechanic,
  type BackendBooking,
  type BackendCustomerWithStats,
  type BackendMechanic,
} from "@/lib/mappers";

import type {
  Booking,
  BookingStatus,
  Customer,
  Mechanic,
  MechanicStatus,
} from "@/lib/operations-types";

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

interface OperationsContextValue {
  mechanics: Mechanic[];
  bookings: Booking[];
  customers: Customer[];

  mechanicsLoading: boolean;
  mechanicsError: string | null;

  bookingsLoading: boolean;
  bookingsError: string | null;

  customersLoading: boolean;
  customersError: string | null;

  addBooking: (
    booking: Booking
  ) => void;

  updateBooking: (
    booking: Booking
  ) => void;

  cancelBooking: (
    id: string
  ) => Promise<void>;

  addMechanic: (
    mechanic: Mechanic
  ) => void;

  updateMechanic: (
    mechanic: Mechanic
  ) => void;

  updateMechanicStatus: (
    id: string,
    status:
      | "Available"
      | "Offline"
  ) => Promise<void>;

  addCustomer: (
    customer: Customer
  ) => void;

  updateCustomer: (
    customer: Customer
  ) => void;
}

const OperationsContext =
  React.createContext<OperationsContextValue | null>(
    null
  );

/* -------------------------------------------------------------------------- */
/* Date Helpers                                                               */
/* -------------------------------------------------------------------------- */

export function getTodayDateKey(
  date: Date = new Date()
): string {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getBookingDateKey(
  bookingOrDate:
    | Booking
    | string
): string {
  const value =
    typeof bookingOrDate ===
    "string"
      ? bookingOrDate
      : bookingOrDate.date;

  if (!value) {
    return "";
  }

  if (
    /^\d{4}-\d{2}-\d{2}/.test(
      value
    )
  ) {
    return value.slice(0, 10);
  }

  const parsedDate =
    new Date(value);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "";
  }

  return getTodayDateKey(
    parsedDate
  );
}

/* -------------------------------------------------------------------------- */
/* Mechanic Helpers                                                           */
/* -------------------------------------------------------------------------- */

export function getMechanicJobsToday(
  mechanic: Mechanic,
  bookings: Booking[],
  todayKey: string = getTodayDateKey()
): number {
  return bookings.filter(
    (booking) => {
      const mechanicMatches =
        booking.mechanicId
          ? booking.mechanicId ===
            mechanic.id
          : booking.mechanic ===
            mechanic.name;

      return (
        mechanicMatches &&
        getBookingDateKey(
          booking
        ) === todayKey &&
        booking.status !==
          "Cancelled" &&
        booking.status !==
          "Completed"
      );
    }
  ).length;
}

export function getMechanicStatus(
  mechanic: Mechanic,
  bookings: Booking[],
  todayKey: string = getTodayDateKey()
): MechanicStatus {
  const jobsToday =
    getMechanicJobsToday(
      mechanic,
      bookings,
      todayKey
    );

  if (jobsToday > 0) {
    return "On Service";
  }

  if (
    mechanic.availability ===
    "Offline"
  ) {
    return "Offline";
  }

  return "Available";
}

/* -------------------------------------------------------------------------- */
/* Customer Helpers                                                           */
/* -------------------------------------------------------------------------- */

function getBookingTimestamp(
  booking: Booking
): number {
  if (!booking.date) {
    return 0;
  }

  const datePart =
    booking.date.slice(0, 10);

  const timePart =
    booking.time || "00:00";

  const timestamp =
    new Date(
      `${datePart}T${timePart}`
    ).getTime();

  if (
    Number.isNaN(timestamp)
  ) {
    const fallback =
      new Date(
        booking.date
      ).getTime();

    return Number.isNaN(
      fallback
    )
      ? 0
      : fallback;
  }

  return timestamp;
}

/**
 * Finds the customer's latest
 * booking that has actually occurred
 * or is scheduled for today.
 *
 * Future bookings are ignored.
 */
function getLatestCustomerBooking(
  customerId: string,
  bookings: Booking[]
): Booking | null {
  const now =
    Date.now();

  const customerBookings =
    bookings.filter(
      (booking) => {
        if (
          booking.customerId !==
          customerId
        ) {
          return false;
        }

        if (
          booking.status ===
          "Cancelled"
        ) {
          return false;
        }

        const timestamp =
          getBookingTimestamp(
            booking
          );

        /*
         * Never treat a future booking
         * as the customer's "Last Booking".
         */
        if (
          timestamp > now
        ) {
          return false;
        }

        return true;
      }
    );

  if (
    customerBookings.length ===
    0
  ) {
    return null;
  }

  return (
    [...customerBookings].sort(
      (a, b) =>
        getBookingTimestamp(
          b
        ) -
        getBookingTimestamp(
          a
        )
    )[0] ?? null
  );
}

function formatCustomerBookingDate(
  booking: Booking | null
): string {
  if (!booking) {
    return "No bookings";
  }

  const timestamp =
    getBookingTimestamp(
      booking
    );

  if (
    !timestamp ||
    timestamp > Date.now()
  ) {
    return "No bookings";
  }

  return new Date(
    timestamp
  ).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function getCustomerStatus(
  latestBooking: Booking | null
): "Active" | "Inactive" {
  if (!latestBooking) {
    return "Inactive";
  }

  const latestTimestamp =
    getBookingTimestamp(
      latestBooking
    );

  if (
    !latestTimestamp ||
    latestTimestamp > Date.now()
  ) {
    return "Inactive";
  }

  const now =
    Date.now();

  const ninetyDays =
    90 *
    24 *
    60 *
    60 *
    1000;

  return (
    now -
      latestTimestamp <=
      ninetyDays
  )
    ? "Active"
    : "Inactive";
}

function enrichCustomers(
  customers: Customer[],
  bookings: Booking[]
): Customer[] {
  return customers.map(
    (customer) => {
      const latestBooking =
        getLatestCustomerBooking(
          customer.id,
          bookings
        );

      const latestVehicle =
        latestBooking?.vehicle;

      const vehicle =
        customer.vehicle !==
          "No vehicle"
          ? customer.vehicle
          : latestVehicle ||
            "No vehicle";

      return {
        ...customer,

        vehicle,

        lastBooking:
          formatCustomerBookingDate(
            latestBooking
          ),

        status:
          getCustomerStatus(
            latestBooking
          ),
      };
    }
  );
}

/* -------------------------------------------------------------------------- */
/* API Types                                                                  */
/* -------------------------------------------------------------------------- */

interface MechanicsResponse {
  success: boolean;
  count?: number;
  data: BackendMechanic[];
}

interface CustomersResponse {
  success: boolean;
  count?: number;
  data: BackendCustomerWithStats[];
}

interface BookingResponse {
  success: boolean;
  data: BackendBooking;
}

/* -------------------------------------------------------------------------- */
/* API Error                                                                  */
/* -------------------------------------------------------------------------- */

function getApiErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (
    error &&
    typeof error ===
      "object" &&
    "response" in error
  ) {
    const response =
      (
        error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        }
      ).response;

    if (
      response?.data?.message
    ) {
      return response.data
        .message;
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
/* Upsert Helpers                                                             */
/* -------------------------------------------------------------------------- */

function upsertBooking(
  current: Booking[],
  incoming: Booking
): Booking[] {
  const index =
    current.findIndex(
      (booking) =>
        booking.id ===
        incoming.id
    );

  if (index === -1) {
    return [
      incoming,
      ...current,
    ];
  }

  return current.map(
    (booking, itemIndex) =>
      itemIndex === index
        ? incoming
        : booking
  );
}

function upsertMechanic(
  current: Mechanic[],
  incoming: Mechanic
): Mechanic[] {
  const index =
    current.findIndex(
      (mechanic) =>
        mechanic.id ===
        incoming.id
    );

  if (index === -1) {
    return [
      ...current,
      incoming,
    ];
  }

  return current.map(
    (mechanic, itemIndex) =>
      itemIndex === index
        ? {
            ...mechanic,
            ...incoming,
          }
        : mechanic
  );
}

function upsertCustomer(
  current: Customer[],
  incoming: Customer
): Customer[] {
  const index =
    current.findIndex(
      (customer) =>
        customer.id ===
        incoming.id
    );

  if (index === -1) {
    return [
      incoming,
      ...current,
    ];
  }

  return current.map(
    (customer, itemIndex) =>
      itemIndex === index
        ? incoming
        : customer
  );
}

/* -------------------------------------------------------------------------- */
/* Provider                                                                   */
/* -------------------------------------------------------------------------- */

export function OperationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [
    mechanics,
    setMechanics,
  ] = React.useState<Mechanic[]>(
    []
  );

  const [
    mechanicsLoading,
    setMechanicsLoading,
  ] = React.useState(true);

  const [
    mechanicsError,
    setMechanicsError,
  ] = React.useState<
    string | null
  >(null);

  const [
    bookings,
    setBookings,
  ] = React.useState<Booking[]>(
    []
  );

  const [
    bookingsLoading,
    setBookingsLoading,
  ] = React.useState(true);

  const [
    bookingsError,
    setBookingsError,
  ] = React.useState<
    string | null
  >(null);

  const [
    customers,
    setCustomers,
  ] = React.useState<Customer[]>(
    []
  );

  const [
    customersLoading,
    setCustomersLoading,
  ] = React.useState(true);

  const [
    customersError,
    setCustomersError,
  ] = React.useState<
    string | null
  >(null);

  /* ------------------------------------------------------------------------ */
  /* Load Mechanics                                                           */
  /* ------------------------------------------------------------------------ */

  const loadMechanics =
    React.useCallback(
      async () => {
        try {
          setMechanicsError(
            null
          );

          const response =
            await api.get<MechanicsResponse>(
              "/mechanics"
            );

          if (
            !response.data.success
          ) {
            throw new Error(
              "Failed to load mechanics."
            );
          }

          const mapped =
            (
              response.data.data ??
              []
            ).map(
              mapBackendMechanic
            );

          setMechanics(
            mapped
          );
        } catch (error) {
          console.error(
            "Failed to load mechanics:",
            error
          );

          setMechanicsError(
            getApiErrorMessage(
              error,
              "Could not load mechanics."
            )
          );
        } finally {
          setMechanicsLoading(
            false
          );
        }
      },
      []
    );

  /* ------------------------------------------------------------------------ */
  /* Load Bookings                                                            */
  /* ------------------------------------------------------------------------ */

  const loadBookings =
    React.useCallback(
      async () => {
        try {
          setBookingsError(
            null
          );

          const response =
            await api.get<{
              success: boolean;
              data: BackendBooking[];
            }>(
              "/bookings"
            );

          if (
            !response.data.success
          ) {
            throw new Error(
              "Failed to load bookings."
            );
          }

          const mapped =
            (
              response.data.data ??
              []
            ).map(
              mapBackendBooking
            );

          setBookings(
            mapped
          );
        } catch (error) {
          console.error(
            "Failed to load bookings:",
            error
          );

          setBookingsError(
            getApiErrorMessage(
              error,
              "Could not load bookings."
            )
          );
        } finally {
          setBookingsLoading(
            false
          );
        }
      },
      []
    );

  /* ------------------------------------------------------------------------ */
  /* Load Customers                                                           */
  /* ------------------------------------------------------------------------ */

  const loadCustomers =
    React.useCallback(
      async () => {
        try {
          setCustomersError(
            null
          );

          const response =
            await api.get<CustomersResponse>(
              "/customers"
            );

          if (
            !response.data.success
          ) {
            throw new Error(
              "Failed to load customers."
            );
          }

          const mapped =
            (
              response.data.data ??
              []
            ).map(
              mapBackendCustomer
            );

          setCustomers(
            mapped
          );
        } catch (error) {
          console.error(
            "Failed to load customers:",
            error
          );

          setCustomersError(
            getApiErrorMessage(
              error,
              "Could not load customers."
            )
          );
        } finally {
          setCustomersLoading(
            false
          );
        }
      },
      []
    );

  /* ------------------------------------------------------------------------ */
  /* Initial Data                                                             */
  /* ------------------------------------------------------------------------ */

  React.useEffect(() => {
    void Promise.all([
      loadMechanics(),
      loadBookings(),
      loadCustomers(),
    ]);
  }, [
    loadMechanics,
    loadBookings,
    loadCustomers,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Re-enrich Customers Whenever Bookings Change                            */
  /* ------------------------------------------------------------------------ */

  const enrichedCustomers =
    React.useMemo(() => {
      return enrichCustomers(
        customers,
        bookings
      );
    }, [
      customers,
      bookings,
    ]);

  /* ------------------------------------------------------------------------ */
  /* Socket.IO                                                                */
  /* ------------------------------------------------------------------------ */

  React.useEffect(() => {
    let mounted = true;

    const socket =
      connectSocket();

    const handleBookingCreated =
      (
        booking: BackendBooking
      ) => {
        if (!mounted) {
          return;
        }

        const mapped =
          mapBackendBooking(
            booking
          );

        setBookings(
          (current) =>
            upsertBooking(
              current,
              mapped
            )
        );

        void loadMechanics();
        void loadCustomers();
      };

    const handleBookingUpdated =
      (
        booking: BackendBooking
      ) => {
        if (!mounted) {
          return;
        }

        const mapped =
          mapBackendBooking(
            booking
          );

        setBookings(
          (current) =>
            upsertBooking(
              current,
              mapped
            )
        );

        void loadMechanics();
        void loadCustomers();
      };

    const handleBookingDeleted =
      (
        booking:
          | BackendBooking
          | {
              _id?: string;
            }
      ) => {
        if (!mounted) {
          return;
        }

        const deletedId =
          booking._id;

        if (!deletedId) {
          return;
        }

        setBookings(
          (current) =>
            current.filter(
              (item) =>
                item.id !==
                deletedId
            )
        );

        void loadMechanics();
        void loadCustomers();
      };

    const handleMechanicCreated =
      (
        mechanic: BackendMechanic
      ) => {
        if (!mounted) {
          return;
        }

        const mapped =
          mapBackendMechanic(
            mechanic
          );

        setMechanics(
          (current) =>
            upsertMechanic(
              current,
              mapped
            )
        );
      };

    const handleMechanicUpdated =
      (
        mechanic: BackendMechanic
      ) => {
        if (!mounted) {
          return;
        }

        const mapped =
          mapBackendMechanic(
            mechanic
          );

        setMechanics(
          (current) =>
            upsertMechanic(
              current,
              mapped
            )
        );
      };

    const handleCustomerCreated =
      (
        customer: BackendCustomerWithStats
      ) => {
        if (!mounted) {
          return;
        }

        const mapped =
          mapBackendCustomer(
            customer
          );

        setCustomers(
          (current) =>
            upsertCustomer(
              current,
              mapped
            )
        );
      };

    const handleCustomerUpdated =
      (
        customer: BackendCustomerWithStats
      ) => {
        if (!mounted) {
          return;
        }

        const mapped =
          mapBackendCustomer(
            customer
          );

        setCustomers(
          (current) =>
            upsertCustomer(
              current,
              mapped
            )
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

    socket.on(
      "mechanic:created",
      handleMechanicCreated
    );

    socket.on(
      "mechanic:updated",
      handleMechanicUpdated
    );

    socket.on(
      "customer:created",
      handleCustomerCreated
    );

    socket.on(
      "customer:updated",
      handleCustomerUpdated
    );

    return () => {
      mounted = false;

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

      socket.off(
        "mechanic:created",
        handleMechanicCreated
      );

      socket.off(
        "mechanic:updated",
        handleMechanicUpdated
      );

      socket.off(
        "customer:created",
        handleCustomerCreated
      );

      socket.off(
        "customer:updated",
        handleCustomerUpdated
      );

      disconnectSocket();
    };
  }, [
    loadMechanics,
    loadCustomers,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Booking Actions                                                          */
  /* ------------------------------------------------------------------------ */

  const addBooking =
    React.useCallback(
      (booking: Booking) => {
        setBookings(
          (current) =>
            upsertBooking(
              current,
              booking
            )
        );
      },
      []
    );

  const updateBooking =
    React.useCallback(
      (booking: Booking) => {
        setBookings(
          (current) =>
            upsertBooking(
              current,
              booking
            )
        );
      },
      []
    );

  const cancelBooking =
    React.useCallback(
      async (id: string) => {
        const previous =
          bookings;

        setBookings(
          (current) =>
            current.map(
              (booking) =>
                booking.id === id
                  ? {
                      ...booking,
                      status:
                        "Cancelled" as BookingStatus,
                    }
                  : booking
            )
        );

        try {
          const response =
            await api.patch<BookingResponse>(
              `/bookings/${id}`,
              {
                status:
                  "Cancelled",
              }
            );

          if (
            !response.data.success
          ) {
            throw new Error(
              "Failed to cancel booking."
            );
          }

          const mapped =
            mapBackendBooking(
              response.data.data
            );

          setBookings(
            (current) =>
              upsertBooking(
                current,
                mapped
              )
          );

          await Promise.all([
            loadMechanics(),
            loadCustomers(),
          ]);
        } catch (error) {
          console.error(
            "Failed to cancel booking:",
            error
          );

          setBookings(
            previous
          );

          throw new Error(
            getApiErrorMessage(
              error,
              "Failed to cancel booking."
            )
          );
        }
      },
      [
        bookings,
        loadMechanics,
        loadCustomers,
      ]
    );

  /* ------------------------------------------------------------------------ */
  /* Mechanic Actions                                                         */
  /* ------------------------------------------------------------------------ */

  const addMechanic =
    React.useCallback(
      (mechanic: Mechanic) => {
        setMechanics(
          (current) =>
            upsertMechanic(
              current,
              mechanic
            )
        );
      },
      []
    );

  const updateMechanic =
    React.useCallback(
      (mechanic: Mechanic) => {
        setMechanics(
          (current) =>
            upsertMechanic(
              current,
              mechanic
            )
        );
      },
      []
    );

  const updateMechanicStatus =
    React.useCallback(
      async (
        id: string,
        status:
          | "Available"
          | "Offline"
      ) => {
        const previous =
          mechanics;

        setMechanics(
          (current) =>
            current.map(
              (mechanic) =>
                mechanic.id === id
                  ? {
                      ...mechanic,
                      availability:
                        status,
                      status:
                        status ===
                        "Offline"
                          ? "Offline"
                          : "Available",
                    }
                  : mechanic
            )
        );

        try {
          const response =
            await api.patch<{
              success: boolean;
              data: BackendMechanic;
            }>(
              `/mechanics/${id}`,
              {
                availability:
                  status,
              }
            );

          if (
            !response.data.success
          ) {
            throw new Error(
              "Failed to update mechanic."
            );
          }

          const mapped =
            mapBackendMechanic(
              response.data.data
            );

          setMechanics(
            (current) =>
              upsertMechanic(
                current,
                mapped
              )
          );
        } catch (error) {
          console.error(
            "Failed to update mechanic:",
            error
          );

          setMechanics(
            previous
          );

          throw new Error(
            getApiErrorMessage(
              error,
              "Failed to update mechanic."
            )
          );
        }
      },
      [mechanics]
    );

  /* ------------------------------------------------------------------------ */
  /* Customer Actions                                                         */
  /* ------------------------------------------------------------------------ */

  const addCustomer =
    React.useCallback(
      (customer: Customer) => {
        setCustomers(
          (current) =>
            upsertCustomer(
              current,
              customer
            )
        );
      },
      []
    );

  const updateCustomer =
    React.useCallback(
      (customer: Customer) => {
        setCustomers(
          (current) =>
            upsertCustomer(
              current,
              customer
            )
        );
      },
      []
    );

  /* ------------------------------------------------------------------------ */
  /* Derived Mechanics                                                        */
  /* ------------------------------------------------------------------------ */

  const derivedMechanics =
    React.useMemo(() => {
      const todayKey =
        getTodayDateKey();

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
    ]);

  /* ------------------------------------------------------------------------ */
  /* Context Value                                                            */
  /* ------------------------------------------------------------------------ */

  const value =
    React.useMemo<OperationsContextValue>(
      () => ({
        mechanics:
          derivedMechanics,

        bookings,

        customers:
          enrichedCustomers,

        mechanicsLoading,

        mechanicsError,

        bookingsLoading,

        bookingsError,

        customersLoading,

        customersError,

        addBooking,

        updateBooking,

        cancelBooking,

        addMechanic,

        updateMechanic,

        updateMechanicStatus,

        addCustomer,

        updateCustomer,
      }),
      [
        derivedMechanics,
        bookings,
        enrichedCustomers,
        mechanicsLoading,
        mechanicsError,
        bookingsLoading,
        bookingsError,
        customersLoading,
        customersError,
        addBooking,
        updateBooking,
        cancelBooking,
        addMechanic,
        updateMechanic,
        updateMechanicStatus,
        addCustomer,
        updateCustomer,
      ]
    );

  return (
    <OperationsContext.Provider
      value={value}
    >
      {children}
    </OperationsContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* Hook                                                                       */
/* -------------------------------------------------------------------------- */

export function useOperationsStore() {
  const context =
    React.useContext(
      OperationsContext
    );

  if (!context) {
    throw new Error(
      "useOperationsStore must be used inside OperationsProvider."
    );
  }

  return context;
}