import {
  Document,
  Types,
} from "mongoose";

import Booking, {
  type BookingStatus,
} from "../models/Booking.js";

import Mechanic, {
  type IMechanic,
  type MechanicStatus,
} from "../models/Mechanic.js";

const ACTIVE_BOOKING_STATUSES: BookingStatus[] = [
  "Pending",
  "Assigned",
];

function getTodayStart(): Date {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return today;
}

function getTomorrowStart(): Date {
  const tomorrow = getTodayStart();

  tomorrow.setDate(tomorrow.getDate() + 1);

  return tomorrow;
}

function getDerivedStatus(
  mechanic: IMechanic,
  hasActiveBookingToday: boolean
): MechanicStatus {
  if (hasActiveBookingToday) {
    return "On Service";
  }

  if (mechanic.availability === "Offline") {
    return "Offline";
  }

  return "Available";
}

export interface MechanicWithStats {
  _id: Types.ObjectId;
  mechanicId: string;
  name: string;
  phone: string;
  specialization: string;
  experience: number;
  rating: number;
  availability: "Available" | "Offline";
  createdAt: Date;
  updatedAt: Date;
  status: MechanicStatus;
  jobsToday: number;
}

export interface CreateMechanicInput {
  name: string;
  phone: string;
  specialization: string;
  experience: number;
  rating?: number;
  availability?: "Available" | "Offline";
}

export interface UpdateMechanicInput {
  name?: string;
  phone?: string;
  specialization?: string;
  experience?: number;
  rating?: number;
  availability?: "Available" | "Offline";
}

async function calculateMechanicStats(
  mechanic: IMechanic
): Promise<MechanicWithStats> {
  const todayStart = getTodayStart();
  const tomorrowStart = getTomorrowStart();

  const mechanicId = new Types.ObjectId(
    mechanic._id.toString()
  );

  const todayBookings = await Booking.find({
    mechanic: mechanicId,
    date: {
      $gte: todayStart,
      $lt: tomorrowStart,
    },
  }).select("status");

  const jobsToday = todayBookings.filter(
    (booking) => booking.status !== "Cancelled"
  ).length;

  const hasActiveBookingToday =
    todayBookings.some((booking) =>
      ACTIVE_BOOKING_STATUSES.includes(
        booking.status
      )
    );

  return {
    ...mechanic.toObject(),
    status: getDerivedStatus(
      mechanic,
      hasActiveBookingToday
    ),
    jobsToday,
  } as MechanicWithStats;
}

function generateMechanicId(): string {
  return `MEC-${Date.now()
    .toString()
    .slice(-6)}${Math.floor(10 + Math.random() * 90)}`;
}

export async function getAllMechanics(): Promise<
  MechanicWithStats[]
> {
  const mechanics = await Mechanic.find().sort({
    createdAt: 1,
  });

  return Promise.all(
    mechanics.map(calculateMechanicStats)
  );
}

export async function getMechanicById(
  id: string
): Promise<MechanicWithStats | null> {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid mechanic ID.");
  }

  const mechanic = await Mechanic.findById(id);

  if (!mechanic) {
    return null;
  }

  return calculateMechanicStats(mechanic);
}

export async function createMechanic(
  input: CreateMechanicInput
): Promise<MechanicWithStats> {
  const mechanic = await Mechanic.create({
    mechanicId: generateMechanicId(),
    name: input.name,
    phone: input.phone,
    specialization: input.specialization,
    experience: input.experience,
    rating: input.rating ?? 0,
    availability:
      input.availability ?? "Available",
  });

  return calculateMechanicStats(mechanic);
}

export async function updateMechanic(
  id: string,
  input: UpdateMechanicInput
): Promise<MechanicWithStats | null> {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid mechanic ID.");
  }

  const mechanic =
    await Mechanic.findByIdAndUpdate(
      id,
      {
        $set: input,
      },
      {
        new: true,
        runValidators: true,
      }
    );

  if (!mechanic) {
    return null;
  }

  return calculateMechanicStats(mechanic);
}