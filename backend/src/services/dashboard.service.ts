import Booking, {
  type BookingStatus,
} from "../models/Booking.js";

import Customer from "../models/Customer.js";
import Mechanic from "../models/Mechanic.js";
import Service from "../models/Service.js";

export interface DashboardOverview {
  totalBookings: number;
  todayBookings: number;
  completedBookings: number;
  pendingBookings: number;
  assignedBookings: number;
  cancelledBookings: number;

  totalRevenue: number;
  averageBookingValue: number;
  completionRate: number;
  cancellationRate: number;

  totalCustomers: number;
  totalMechanics: number;
  activeMechanics: number;
  newCustomersThisMonth: number;
  totalServices: number;
}

export interface DashboardStatusBreakdown {
  status: BookingStatus;
  count: number;
  percentage: number;
}

export interface DashboardServicePerformance {
  serviceId: string;
  name: string;
  bookings: number;
  completedBookings: number;
  revenue: number;
  averageValue: number;
}

export interface DashboardDailyTrend {
  date: string;
  bookings: number;
  completedBookings: number;
  cancelledBookings: number;
  revenue: number;
}

export interface DashboardResponse {
  overview: DashboardOverview;
  bookingStatus: DashboardStatusBreakdown[];
  servicePerformance: DashboardServicePerformance[];
  dailyTrend: DashboardDailyTrend[];
}

function roundNumber(
  value: number,
  decimals = 2
): number {
  const multiplier = 10 ** decimals;

  return (
    Math.round(value * multiplier) /
    multiplier
  );
}

function startOfToday(): Date {
  const date = new Date();

  date.setHours(0, 0, 0, 0);

  return date;
}

function startOfTomorrow(): Date {
  const date = startOfToday();

  date.setDate(date.getDate() + 1);

  return date;
}

function startOfCurrentMonth(): Date {
  const date = new Date();

  date.setDate(1);
  date.setHours(0, 0, 0, 0);

  return date;
}

function startOfNextMonth(): Date {
  const date = startOfCurrentMonth();

  date.setMonth(date.getMonth() + 1);

  return date;
}

function getDateKey(date: Date): string {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getLast30Days(): string[] {
  const dates: string[] = [];

  const today = startOfToday();

  for (
    let index = 29;
    index >= 0;
    index--
  ) {
    const date = new Date(today);

    date.setDate(
      today.getDate() - index
    );

    dates.push(
      getDateKey(date)
    );
  }

  return dates;
}

export async function getDashboard(): Promise<DashboardResponse> {
  const todayStart = startOfToday();
  const tomorrowStart = startOfTomorrow();

  const monthStart =
    startOfCurrentMonth();

  const nextMonthStart =
    startOfNextMonth();

  const [
    bookings,
    todayBookings,
    totalCustomers,
    totalMechanics,
    activeMechanics,
    newCustomersThisMonth,
    totalServices,
  ] = await Promise.all([
    Booking.find()
      .populate(
        "service",
        "serviceId name"
      )
      .lean(),

    Booking.countDocuments({
      date: {
        $gte: todayStart,
        $lt: tomorrowStart,
      },
    }),

    Customer.countDocuments(),

    Mechanic.countDocuments(),

    Mechanic.countDocuments({
      availability: "Available",
    }),

    Customer.countDocuments({
      createdAt: {
        $gte: monthStart,
        $lt: nextMonthStart,
      },
    }),

    Service.countDocuments({
      active: true,
    }),
  ]);

  /* ---------------------------------------------------------------------- */
  /* Overview                                                               */
  /* ---------------------------------------------------------------------- */

  const totalBookings =
    bookings.length;

  const completedBookings =
    bookings.filter(
      (booking) =>
        booking.status === "Completed"
    ).length;

  const pendingBookings =
    bookings.filter(
      (booking) =>
        booking.status === "Pending"
    ).length;

  const assignedBookings =
    bookings.filter(
      (booking) =>
        booking.status === "Assigned"
    ).length;

  const cancelledBookings =
    bookings.filter(
      (booking) =>
        booking.status === "Cancelled"
    ).length;

  const totalRevenue =
    bookings
      .filter(
        (booking) =>
          booking.status === "Completed"
      )
      .reduce(
        (total, booking) =>
          total + booking.amount,
        0
      );

  const averageBookingValue =
    completedBookings > 0
      ? totalRevenue /
        completedBookings
      : 0;

  const completionRate =
    totalBookings > 0
      ? (completedBookings /
          totalBookings) *
        100
      : 0;

  const cancellationRate =
    totalBookings > 0
      ? (cancelledBookings /
          totalBookings) *
        100
      : 0;

  const overview: DashboardOverview = {
    totalBookings,
    todayBookings,

    completedBookings,
    pendingBookings,
    assignedBookings,
    cancelledBookings,

    totalRevenue:
      roundNumber(totalRevenue),

    averageBookingValue:
      roundNumber(
        averageBookingValue
      ),

    completionRate:
      roundNumber(completionRate),

    cancellationRate:
      roundNumber(cancellationRate),

    totalCustomers,
    totalMechanics,
    activeMechanics,
    newCustomersThisMonth,
    totalServices,
  };

  /* ---------------------------------------------------------------------- */
  /* Booking status                                                         */
  /* ---------------------------------------------------------------------- */

  const statuses: BookingStatus[] = [
    "Completed",
    "Pending",
    "Assigned",
    "Cancelled",
  ];

  const bookingStatus =
    statuses.map((status) => {
      const count =
        bookings.filter(
          (booking) =>
            booking.status === status
        ).length;

      return {
        status,
        count,

        percentage:
          totalBookings > 0
            ? roundNumber(
                (count /
                  totalBookings) *
                  100
              )
            : 0,
      };
    });

  /* ---------------------------------------------------------------------- */
  /* Service performance                                                    */
  /* ---------------------------------------------------------------------- */

  const serviceMap =
    new Map<
      string,
      DashboardServicePerformance
    >();

  for (const booking of bookings) {
    const service =
      booking.service;

    if (!service) {
      continue;
    }

    const serviceId =
      typeof service === "object" &&
      "serviceId" in service
        ? String(
            service.serviceId
          )
        : String(service);

    const serviceName =
      typeof service === "object" &&
      "name" in service
        ? String(service.name)
        : "Unknown Service";

    if (
      !serviceMap.has(
        serviceId
      )
    ) {
      serviceMap.set(
        serviceId,
        {
          serviceId,
          name: serviceName,
          bookings: 0,
          completedBookings: 0,
          revenue: 0,
          averageValue: 0,
        }
      );
    }

    const serviceStats =
      serviceMap.get(
        serviceId
      )!;

    serviceStats.bookings += 1;

    if (
      booking.status ===
      "Completed"
    ) {
      serviceStats.completedBookings +=
        1;

      serviceStats.revenue +=
        booking.amount;
    }
  }

  const servicePerformance =
    Array.from(
      serviceMap.values()
    )
      .map((service) => ({
        ...service,

        revenue:
          roundNumber(
            service.revenue
          ),

        averageValue:
          service.completedBookings >
          0
            ? roundNumber(
                service.revenue /
                  service.completedBookings
              )
            : 0,
      }))
      .sort(
        (a, b) =>
          b.bookings -
          a.bookings
      );

  /* ---------------------------------------------------------------------- */
  /* Daily trend                                                             */
  /* ---------------------------------------------------------------------- */

  const last30Days =
    getLast30Days();

  const dailyMap =
    new Map<
      string,
      DashboardDailyTrend
    >();

  for (const date of last30Days) {
    dailyMap.set(
      date,
      {
        date,
        bookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        revenue: 0,
      }
    );
  }

  for (const booking of bookings) {
    const bookingDate =
      new Date(
        booking.date
      );

    const dateKey =
      getDateKey(
        bookingDate
      );

    const dailyStats =
      dailyMap.get(
        dateKey
      );

    if (!dailyStats) {
      continue;
    }

    dailyStats.bookings += 1;

    if (
      booking.status ===
      "Completed"
    ) {
      dailyStats.completedBookings +=
        1;

      dailyStats.revenue +=
        booking.amount;
    }

    if (
      booking.status ===
      "Cancelled"
    ) {
      dailyStats.cancelledBookings +=
        1;
    }
  }

  const dailyTrend =
    Array.from(
      dailyMap.values()
    ).map((day) => ({
      ...day,

      revenue:
        roundNumber(
          day.revenue
        ),
    }));

  return {
    overview,
    bookingStatus,
    servicePerformance,
    dailyTrend,
  };
}