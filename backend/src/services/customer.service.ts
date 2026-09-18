import { Types } from "mongoose";

import Booking from "../models/Booking.js";
import Customer, {
  type ICustomer,
} from "../models/Customer.js";

export interface CustomerWithStats {
  _id: Types.ObjectId;
  customerId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  vehicles: ICustomer["vehicles"];
  createdAt: Date;
  updatedAt: Date;

  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalSpent: number;
}

export interface CreateCustomerInput {
  name: string;
  phone: string;
  email: string;
  address: string;
  vehicles?: ICustomer["vehicles"];
}

export interface UpdateCustomerInput {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  vehicles?: ICustomer["vehicles"];
}

function validateObjectId(
  id: string,
  fieldName: string
): Types.ObjectId {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ${fieldName}.`);
  }

  return new Types.ObjectId(id);
}

function generateCustomerId(): string {
  return `CUS-${Date.now().toString().slice(-6)}${Math.floor(
    10 + Math.random() * 90
  )}`;
}

async function calculateCustomerStats(
  customer: ICustomer
): Promise<CustomerWithStats> {
  const customerId = new Types.ObjectId(
    customer._id.toString()
  );

  const bookings = await Booking.find({
    customer: customerId,
  }).select("status amount");

  const totalBookings = bookings.length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "Completed"
  ).length;

  const pendingBookings = bookings.filter(
    (booking) =>
      booking.status === "Pending" ||
      booking.status === "Assigned"
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "Cancelled"
  ).length;

  const totalSpent = bookings
    .filter((booking) => booking.status === "Completed")
    .reduce((total, booking) => total + booking.amount, 0);

  return {
    ...customer.toObject(),

    totalBookings,
    completedBookings,
    pendingBookings,
    cancelledBookings,
    totalSpent,
  };
}

export async function getAllCustomers(): Promise<
  CustomerWithStats[]
> {
  const customers = await Customer.find().sort({
    createdAt: -1,
  });

  return Promise.all(
    customers.map(calculateCustomerStats)
  );
}

export async function getCustomerById(
  id: string
): Promise<CustomerWithStats | null> {
  const customerObjectId = validateObjectId(
    id,
    "customer ID"
  );

  const customer = await Customer.findById(
    customerObjectId
  );

  if (!customer) {
    return null;
  }

  return calculateCustomerStats(customer);
}

export async function createCustomer(
  input: CreateCustomerInput
): Promise<CustomerWithStats> {
  const customer = await Customer.create({
    customerId: generateCustomerId(),
    name: input.name,
    phone: input.phone,
    email: input.email,
    address: input.address,
    vehicles: input.vehicles ?? [],
  });

  return calculateCustomerStats(customer);
}

export async function updateCustomer(
  id: string,
  input: UpdateCustomerInput
): Promise<CustomerWithStats | null> {
  const customerObjectId = validateObjectId(
    id,
    "customer ID"
  );

  const customer = await Customer.findByIdAndUpdate(
    customerObjectId,
    {
      $set: input,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!customer) {
    return null;
  }

  return calculateCustomerStats(customer);
}