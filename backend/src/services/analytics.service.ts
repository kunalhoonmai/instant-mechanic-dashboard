import Booking, {
  type BookingStatus,
} from "../models/Booking.js";

import Customer from "../models/Customer.js";
import Mechanic from "../models/Mechanic.js";
import Service from "../models/Service.js";

export type AnalyticsPeriod =
  | "today"
  | "week"
  | "month";

export interface AnalyticsOverview {
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
  newCustomers: number;

  totalMechanics: number;
  activeMechanics: number;

  totalServices: number;
}

export interface BookingStatusBreakdown {
  status: BookingStatus;
  count: number;
  percentage: number;
}

export interface ServicePerformance {
  serviceId: string;
  name: string;
  bookings: number;
  completedBookings: number;
  revenue: number;
  averageValue: number;
}

export interface MechanicPerformance {
  mechanicId: string;
  name: string;
  jobs: number;
  completedJobs: number;
  revenue: number;
  rating: number;
  rate: number;
}

export interface DailyAnalytics {
  date: string;
  bookings: number;
  completedBookings: number;
  cancelledBookings: number;
  revenue: number;
}

export interface AnalyticsResponse {
  period: AnalyticsPeriod;
  overview: AnalyticsOverview;
  bookingStatus: BookingStatusBreakdown[];
  servicePerformance: ServicePerformance[];
  mechanicPerformance: MechanicPerformance[];
  dailyTrend: DailyAnalytics[];
}

function roundNumber(
  value: number,
  decimals = 2
): number {
  const multiplier = 10 ** decimals;

  return (
    Math.round(value * multiplier) / multiplier
  );
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

function getTodayStart(): Date {
  const today = new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  return today;
}

function getTomorrowStart(): Date {
  const tomorrow =
    getTodayStart();

  tomorrow.setDate(
    tomorrow.getDate() + 1
  );

  return tomorrow;
}

function getWeekStart(): Date {
  const today =
    getTodayStart();

  const day =
    today.getDay();

  const daysSinceMonday =
    day === 0 ? 6 : day - 1;

  today.setDate(
    today.getDate() -
      daysSinceMonday
  );

  return today;
}

function getNextWeekStart(): Date {
  const nextWeek =
    getWeekStart();

  nextWeek.setDate(
    nextWeek.getDate() + 7
  );

  return nextWeek;
}

function getMonthStart(): Date {
  const today =
    new Date();

  return new Date(
    today.getFullYear(),
    today.getMonth(),
    1,
    0,
    0,
    0,
    0
  );
}

function getNextMonthStart(): Date {
  const today =
    new Date();

  return new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    1,
    0,
    0,
    0,
    0
  );
}

function getPeriodRange(
  period: AnalyticsPeriod
): {
  start: Date;
  end: Date;
} {
  if (period === "today") {
    return {
      start: getTodayStart(),
      end: getTomorrowStart(),
    };
  }

  if (period === "week") {
    return {
      start: getWeekStart(),
      end: getNextWeekStart(),
    };
  }

  return {
    start: getMonthStart(),
    end: getNextMonthStart(),
  };
}

function getPreviousPeriodRange(
  period: AnalyticsPeriod
): {
  start: Date;
  end: Date;
} {
  if (period === "today") {
    const start =
      getTodayStart();

    const end =
      new Date(start);

    end.setDate(
      end.getDate() - 1
    );

    return {
      start: end,
      end: start,
    };
  }

  if (period === "week") {
    const currentStart =
      getWeekStart();

    const previousEnd =
      new Date(currentStart);

    const previousStart =
      new Date(currentStart);

    previousStart.setDate(
      previousStart.getDate() - 7
    );

    return {
      start: previousStart,
      end: previousEnd,
    };
  }

  const currentStart =
    getMonthStart();

  const previousStart =
    new Date(
      currentStart
    );

  previousStart.setMonth(
    previousStart.getMonth() - 1
  );

  return {
    start: previousStart,
    end: currentStart,
  };
}

function getDailyTrendRange(
  period: AnalyticsPeriod
): {
  start: Date;
  end: Date;
} {
  if (period === "today") {
    return {
      start: getTodayStart(),
      end: getTomorrowStart(),
    };
  }

  if (period === "week") {
    return {
      start: getWeekStart(),
      end: getNextWeekStart(),
    };
  }

  return {
    start: getMonthStart(),
    end: getNextMonthStart(),
  };
}

function getDateKeys(
  start: Date,
  end: Date
): string[] {
  const dates: string[] = [];

  const cursor =
    new Date(start);

  cursor.setHours(
    0,
    0,
    0,
    0
  );

  while (cursor < end) {
    dates.push(
      getDateKey(cursor)
    );

    cursor.setDate(
      cursor.getDate() + 1
    );
  }

  return dates;
}

function normalizePeriod(
  value?: string
): AnalyticsPeriod {
  if (value === "today") {
    return "today";
  }

  if (value === "month") {
    return "month";
  }

  return "week";
}

export async function getAnalytics(
  requestedPeriod?: string
): Promise<AnalyticsResponse> {
  const period =
    normalizePeriod(
      requestedPeriod
    );

  const {
    start: periodStart,
    end: periodEnd,
  } =
    getPeriodRange(period);

  const {
    start: previousPeriodStart,
    end: previousPeriodEnd,
  } =
    getPreviousPeriodRange(
      period
    );

  const [
    periodBookings,
    previousPeriodBookings,
    totalCustomers,
    totalMechanics,
    totalServices,
    activeMechanics,
    newCustomers,
  ] = await Promise.all([
    Booking.find({
      date: {
        $gte: periodStart,
        $lt: periodEnd,
      },
    })
      .populate(
        "service",
        "serviceId name"
      )
      .populate(
        "mechanic",
        "mechanicId name rating"
      )
      .lean(),

    Booking.find({
      date: {
        $gte: previousPeriodStart,
        $lt: previousPeriodEnd,
      },
    })
      .select(
        "status amount date"
      )
      .lean(),

    Customer.countDocuments(),

    Mechanic.countDocuments(),

    Service.countDocuments(),

    Mechanic.countDocuments({
      availability:
        "Available",
    }),

    Customer.countDocuments({
      createdAt: {
        $gte: periodStart,
        $lt: periodEnd,
      },
    }),
  ]);

  // --------------------------------------------------
  // OVERVIEW
  // --------------------------------------------------

  const totalBookings =
    periodBookings.length;

  const completedBookings =
    periodBookings.filter(
      (booking) =>
        booking.status ===
        "Completed"
    ).length;

  const pendingBookings =
    periodBookings.filter(
      (booking) =>
        booking.status ===
        "Pending"
    ).length;

  const assignedBookings =
    periodBookings.filter(
      (booking) =>
        booking.status ===
        "Assigned"
    ).length;

  const cancelledBookings =
    periodBookings.filter(
      (booking) =>
        booking.status ===
        "Cancelled"
    ).length;

  const totalRevenue =
    periodBookings
      .filter(
        (booking) =>
          booking.status ===
          "Completed"
      )
      .reduce(
        (total, booking) =>
          total +
          Number(
            booking.amount
          ),
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

  const todayStart =
    getTodayStart();

  const tomorrowStart =
    getTomorrowStart();

  const todayBookings =
    periodBookings.filter(
      (booking) => {
        const bookingDate =
          new Date(
            booking.date
          );

        return (
          bookingDate >=
            todayStart &&
          bookingDate <
            tomorrowStart
        );
      }
    ).length;

  const overview:
    AnalyticsOverview = {
    totalBookings,

    todayBookings,

    completedBookings,
    pendingBookings,
    assignedBookings,
    cancelledBookings,

    totalRevenue:
      roundNumber(
        totalRevenue
      ),

    averageBookingValue:
      roundNumber(
        averageBookingValue
      ),

    completionRate:
      roundNumber(
        completionRate
      ),

    cancellationRate:
      roundNumber(
        cancellationRate
      ),

    totalCustomers,

    newCustomers,

    totalMechanics,

    activeMechanics,

    totalServices,
  };

  // --------------------------------------------------
  // BOOKING STATUS
  // --------------------------------------------------

  const statusList:
    BookingStatus[] = [
    "Completed",
    "Pending",
    "Assigned",
    "Cancelled",
  ];

  const bookingStatus:
    BookingStatusBreakdown[] =
    statusList.map(
      (status) => {
        const count =
          periodBookings.filter(
            (booking) =>
              booking.status ===
              status
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
      }
    );

  // --------------------------------------------------
  // SERVICE PERFORMANCE
  // --------------------------------------------------

  const serviceMap =
    new Map<
      string,
      ServicePerformance
    >();

  for (
    const booking of periodBookings
  ) {
    const service =
      booking.service;

    if (!service) {
      continue;
    }

    const serviceId =
      typeof service ===
        "object" &&
      "serviceId" in service
        ? String(
            service.serviceId
          )
        : String(service);

    const serviceName =
      typeof service ===
        "object" &&
      "name" in service
        ? String(
            service.name
          )
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

    serviceStats.bookings +=
      1;

    if (
      booking.status ===
      "Completed"
    ) {
      serviceStats.completedBookings +=
        1;

      serviceStats.revenue +=
        Number(
          booking.amount
        );
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

  // --------------------------------------------------
  // MECHANIC PERFORMANCE
  // --------------------------------------------------

  const mechanicMap =
    new Map<
      string,
      MechanicPerformance
    >();

  for (
    const booking of periodBookings
  ) {
    const mechanic =
      booking.mechanic;

    if (!mechanic) {
      continue;
    }

    const mechanicId =
      typeof mechanic ===
        "object" &&
      "mechanicId" in mechanic
        ? String(
            mechanic.mechanicId
          )
        : String(mechanic);

    const mechanicName =
      typeof mechanic ===
        "object" &&
      "name" in mechanic
        ? String(
            mechanic.name
          )
        : "Unknown Mechanic";

    const rating =
      typeof mechanic ===
        "object" &&
      "rating" in mechanic
        ? Number(
            mechanic.rating
          )
        : 0;

    if (
      !mechanicMap.has(
        mechanicId
      )
    ) {
      mechanicMap.set(
        mechanicId,
        {
          mechanicId,
          name: mechanicName,
          jobs: 0,
          completedJobs: 0,
          revenue: 0,
          rating,
          rate: 0,
        }
      );
    }

    const mechanicStats =
      mechanicMap.get(
        mechanicId
      )!;

    if (
      booking.status !==
      "Cancelled"
    ) {
      mechanicStats.jobs +=
        1;
    }

    if (
      booking.status ===
      "Completed"
    ) {
      mechanicStats.completedJobs +=
        1;

      mechanicStats.revenue +=
        Number(
          booking.amount
        );
    }
  }

  const mechanicPerformance =
    Array.from(
      mechanicMap.values()
    )
      .map((mechanic) => ({
        ...mechanic,

        revenue:
          roundNumber(
            mechanic.revenue
          ),

        rate:
          mechanic.jobs > 0
            ? roundNumber(
                (mechanic.completedJobs /
                  mechanic.jobs) *
                  100
              )
            : 0,
      }))
      .sort(
        (a, b) =>
          b.completedJobs -
          a.completedJobs
      );

  // --------------------------------------------------
  // DAILY TREND
  // --------------------------------------------------

  const {
    start: trendStart,
    end: trendEnd,
  } =
    getDailyTrendRange(
      period
    );

  const dateKeys =
    getDateKeys(
      trendStart,
      trendEnd
    );

  const dailyMap =
    new Map<
      string,
      DailyAnalytics
    >();

  for (
    const date of dateKeys
  ) {
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

  for (
    const booking of periodBookings
  ) {
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

    dailyStats.bookings +=
      1;

    if (
      booking.status ===
      "Completed"
    ) {
      dailyStats.completedBookings +=
        1;

      dailyStats.revenue +=
        Number(
          booking.amount
        );
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
    period,

    overview,

    bookingStatus,

    servicePerformance,

    mechanicPerformance,

    dailyTrend,
  };
}