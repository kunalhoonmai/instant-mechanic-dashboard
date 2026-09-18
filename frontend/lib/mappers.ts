import type {
  Booking,
  Customer,
  Mechanic,
} from "@/lib/operations-types";

export type FrontendBookingStatus =
  | "Completed"
  | "Pending"
  | "Assigned"
  | "Cancelled";

export type FrontendMechanicStatus =
  | "Available"
  | "On Service"
  | "Offline";

export type FrontendMechanicAvailability =
  | "Available"
  | "Offline";

export type FrontendCustomerStatus =
  | "Active"
  | "Inactive";

export interface BackendVehicle {
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
}

export interface BackendCustomer {
  _id: string;
  customerId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  vehicles: BackendVehicle[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendCustomerWithStats
  extends BackendCustomer {
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalSpent: number;
}

export interface BackendService {
  _id: string;
  serviceId: string;
  name: string;
  description: string;
  basePrice: number;
  duration: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendMechanic {
  _id: string;
  mechanicId: string;
  name: string;
  phone: string;
  specialization: string;
  experience: number;
  rating: number;
  availability:
    | "Available"
    | "Offline";
  status:
    | "Available"
    | "On Service"
    | "Offline";
  jobsToday: number;
}

export interface BackendBooking {
  _id: string;
  bookingId: string;

  customer: BackendCustomer;

  mechanic:
    | BackendMechanic
    | null;

  service: BackendService;

  vehicle: BackendVehicle;

  date: string;
  time: string;

  amount: number;

  status:
    | "Pending"
    | "Assigned"
    | "Completed"
    | "Cancelled";

  notes?: string;

  createdAt?: string;
  updatedAt?: string;
}

export function mapBackendBooking(
  booking: BackendBooking
): Booking {
  return {
    /*
     * MongoDB ID.
     *
     * Keep this internally because API
     * update/delete requests use it.
     */
    id: booking._id,

    /*
     * Human-readable business booking ID.
     *
     * This should be displayed in the UI.
     */
    bookingId: booking.bookingId,

    mechanicId:
      booking.mechanic?._id ?? null,

    customerId:
      booking.customer?._id ?? null,

    customer:
      booking.customer.name,

    phone:
      booking.customer.phone,

    vehicle:
      `${booking.vehicle.make} ${booking.vehicle.model}`,

    service:
      booking.service.name,

    mechanic:
      booking.mechanic?.name ??
      "Unassigned",

    date:
      booking.date,

    time:
      booking.time,

    amount:
      booking.amount,

    status:
      booking.status,
  };
}

export function mapBackendMechanic(
  mechanic: BackendMechanic
): Mechanic {
  return {
    /*
     * MongoDB ID.
     *
     * Used internally for API requests
     * and booking relationships.
     */
    id: mechanic._id,

    /*
     * Human-readable mechanic ID.
     *
     * Example:
     * MEC-001
     */
    mechanicId:
      mechanic.mechanicId,

    name:
      mechanic.name,

    phone:
      mechanic.phone,

    specialization:
      mechanic.specialization,

    experience:
      String(
        mechanic.experience
      ),

    jobsToday:
      mechanic.jobsToday,

    rating:
      mechanic.rating,

    availability:
      mechanic.availability,

    status:
      mechanic.status,
  };
}

export function mapBackendCustomer(
  customer: BackendCustomerWithStats
): Customer {
  const firstVehicle =
    customer.vehicles?.[0];

  const vehicle =
    firstVehicle
      ? `${firstVehicle.make} ${firstVehicle.model}`
      : "No vehicle";

  return {
    /*
     * MongoDB ID.
     *
     * Keep this internally for API requests
     * and booking relationships.
     */
    id: customer._id,

    /*
     * Human-readable customer ID.
     *
     * Example:
     * CUS-0001
     *
     * This is what should be displayed
     * in the customer UI.
     */
    customerId:
      customer.customerId,

    name:
      customer.name,

    phone:
      customer.phone,

    email:
      customer.email,

    address:
      customer.address,

    vehicle,

    totalBookings:
      customer.totalBookings,

    completedBookings:
      customer.completedBookings,

    pendingBookings:
      customer.pendingBookings,

    cancelledBookings:
      customer.cancelledBookings,

    lastBooking:
      "No bookings",

    totalSpent:
      customer.totalSpent,

    status:
      "Inactive" as FrontendCustomerStatus,

    createdAt:
      customer.createdAt,

    updatedAt:
      customer.updatedAt,
  };
}