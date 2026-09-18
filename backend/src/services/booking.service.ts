import Booking, {
  type BookingStatus,
  type IBooking,
} from "../models/Booking.js";
import Customer from "../models/Customer.js";
import Mechanic from "../models/Mechanic.js";
import Service from "../models/Service.js";
import { Types } from "mongoose";

export interface CreateBookingInput {
  customerId: string;
  mechanicId?: string | null;
  serviceId: string;

  vehicle: {
    make: string;
    model: string;
    year: number;
    registrationNumber: string;
  };

  date: string;
  time: string;
  amount: number;
  status?: BookingStatus;
  notes?: string;
}

export interface UpdateBookingInput {
  customerId?: string;
  mechanicId?: string | null;
  serviceId?: string;

  vehicle?: {
    make: string;
    model: string;
    year: number;
    registrationNumber: string;
  };

  date?: string;
  time?: string;
  amount?: number;
  status?: BookingStatus;
  notes?: string;
}

function generateBookingId(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(100 + Math.random() * 900);

  return `BK-${timestamp}${random}`;
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

async function validateReferences(
  customerId: string,
  serviceId: string,
  mechanicId?: string | null
) {
  const customerObjectId = validateObjectId(
    customerId,
    "customer ID"
  );

  const serviceObjectId = validateObjectId(
    serviceId,
    "service ID"
  );

  const [customer, service] = await Promise.all([
    Customer.findById(customerObjectId),
    Service.findById(serviceObjectId),
  ]);

  if (!customer) {
    throw new Error("Customer not found.");
  }

  if (!service) {
    throw new Error("Service not found.");
  }

  let mechanic = null;
  let mechanicObjectId: Types.ObjectId | null = null;

  if (mechanicId) {
    mechanicObjectId = validateObjectId(
      mechanicId,
      "mechanic ID"
    );

    mechanic = await Mechanic.findById(mechanicObjectId);

    if (!mechanic) {
      throw new Error("Mechanic not found.");
    }
  }

  return {
    customer,
    service,
    mechanic,
    customerObjectId,
    serviceObjectId,
    mechanicObjectId,
  };
}

export async function getAllBookings(): Promise<IBooking[]> {
  return Booking.find()
    .populate(
      "customer",
      "customerId name phone email"
    )
    .populate(
      "mechanic",
      "mechanicId name phone specialization experience rating availability"
    )
    .populate(
      "service",
      "serviceId name description basePrice duration"
    )
    .sort({
      date: -1,
      createdAt: -1,
    });
}

export async function getBookingById(
  id: string
): Promise<IBooking | null> {
  const bookingObjectId = validateObjectId(
    id,
    "booking ID"
  );

  return Booking.findById(bookingObjectId)
    .populate(
      "customer",
      "customerId name phone email"
    )
    .populate(
      "mechanic",
      "mechanicId name phone specialization experience rating availability"
    )
    .populate(
      "service",
      "serviceId name description basePrice duration"
    );
}

export async function createBooking(
  input: CreateBookingInput
): Promise<IBooking> {
  const {
    customerId,
    mechanicId = null,
    serviceId,
    vehicle,
    date,
    time,
    amount,
    status = "Pending",
    notes,
  } = input;

  const references = await validateReferences(
    customerId,
    serviceId,
    mechanicId
  );

  const booking = await Booking.create({
    bookingId: generateBookingId(),

    customer: references.customerObjectId,

    mechanic: references.mechanicObjectId,

    service: references.serviceObjectId,

    vehicle,

    date: new Date(date),

    time,

    amount,

    status,

    notes,
  });

  const createdBooking = await getBookingById(
    booking._id.toString()
  );

  if (!createdBooking) {
    throw new Error(
      "Booking was created but could not be retrieved."
    );
  }

  return createdBooking;
}

export async function updateBooking(
  id: string,
  input: UpdateBookingInput
): Promise<IBooking | null> {
  const bookingObjectId = validateObjectId(
    id,
    "booking ID"
  );

  const existingBooking =
    await Booking.findById(bookingObjectId);

  if (!existingBooking) {
    return null;
  }

  const customerId =
    input.customerId ??
    existingBooking.customer.toString();

  const serviceId =
    input.serviceId ??
    existingBooking.service.toString();

  const mechanicId =
    input.mechanicId !== undefined
      ? input.mechanicId
      : existingBooking.mechanic?.toString() ?? null;

  const references = await validateReferences(
    customerId,
    serviceId,
    mechanicId
  );

  const updateData: Record<string, unknown> = {};

  if (input.customerId !== undefined) {
    updateData.customer =
      references.customerObjectId;
  }

  if (input.mechanicId !== undefined) {
    updateData.mechanic =
      references.mechanicObjectId;
  }

  if (input.serviceId !== undefined) {
    updateData.service =
      references.serviceObjectId;
  }

  if (input.vehicle !== undefined) {
    updateData.vehicle = input.vehicle;
  }

  if (input.date !== undefined) {
    updateData.date = new Date(input.date);
  }

  if (input.time !== undefined) {
    updateData.time = input.time;
  }

  if (input.amount !== undefined) {
    updateData.amount = input.amount;
  }

  if (input.status !== undefined) {
    updateData.status = input.status;
  }

  if (input.notes !== undefined) {
    updateData.notes = input.notes;
  }

  await Booking.findByIdAndUpdate(
    bookingObjectId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  return getBookingById(id);
}

export async function deleteBooking(
  id: string
): Promise<IBooking | null> {
  const bookingObjectId = validateObjectId(
    id,
    "booking ID"
  );

  return Booking.findByIdAndDelete(
    bookingObjectId
  );
}