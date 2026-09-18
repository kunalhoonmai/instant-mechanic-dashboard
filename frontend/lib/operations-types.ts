export type MechanicAvailability =
  | "Available"
  | "Offline";

export type MechanicStatus =
  | "Available"
  | "On Service"
  | "Offline";

export interface Mechanic {
  id: string;

  /**
   * Human-readable mechanic ID.
   *
   * Example:
   * MEC-001
   *
   * This is what should be displayed
   * to administrators.
   */
  mechanicId?: string;

  name: string;
  phone: string;
  specialization: string;
  experience: string;
  jobsToday: number;
  rating: number;
  availability: MechanicAvailability;
  status: MechanicStatus;
}

export type BookingStatus =
  | "Pending"
  | "Assigned"
  | "Completed"
  | "Cancelled";

export interface Booking {
  /**
   * MongoDB document ID.
   *
   * Used internally for API requests and
   * identifying the database record.
   */
  id: string;

  /**
   * Human-readable business booking ID.
   *
   * Example:
   * BK-123456
   *
   * This is what should be displayed to admins.
   */
  bookingId?: string;

  mechanicId?: string | null;
  customerId?: string | null;

  customer: string;
  phone: string;
  vehicle: string;
  service: string;
  mechanic: string;

  date: string;
  time: string;

  amount: number;
  status: BookingStatus;
}

export type CustomerStatus =
  | "Active"
  | "Inactive";

export interface Customer {
  /**
   * MongoDB document ID.
   *
   * Used internally for API requests and
   * relationships with bookings.
   */
  id: string;

  /**
   * Human-readable customer ID.
   *
   * Example:
   * CUS-0001
   *
   * This is what should be displayed
   * to administrators.
   */
  customerId?: string;

  name: string;
  phone: string;
  email: string;
  address: string;
  vehicle: string;

  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;

  lastBooking: string;
  totalSpent: number;

  status: CustomerStatus;

  createdAt?: string;
  updatedAt?: string;
}