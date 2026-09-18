export type BookingStatus =
  | "Pending"
  | "Assigned"
  | "Completed"
  | "Cancelled";

export interface AnalyticsOverview {
  totalBookings: number;
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
  totalServices: number;
}

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
}

export interface DailyAnalytics {
  date: string;
  bookings: number;
  completedBookings: number;
  cancelledBookings: number;
  revenue: number;
}

export interface AnalyticsData {
  overview: AnalyticsOverview;
  bookingStatus: BookingStatusBreakdown[];
  servicePerformance: ServicePerformance[];
  mechanicPerformance: MechanicPerformance[];
  dailyTrend: DailyAnalytics[];
}

export interface AnalyticsApiResponse {
  success: boolean;
  data: AnalyticsData;
}