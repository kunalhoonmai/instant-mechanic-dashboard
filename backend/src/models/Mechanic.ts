import { Document, Model, Schema, model } from "mongoose";

export type MechanicAvailability =
  | "Available"
  | "Offline";

export type MechanicStatus =
  | "Available"
  | "On Service"
  | "Offline";

export interface IMechanic extends Document {
  mechanicId: string;
  name: string;
  phone: string;
  specialization: string;
  experience: number;
  rating: number;
  availability: MechanicAvailability;
  createdAt: Date;
  updatedAt: Date;
}

const mechanicSchema = new Schema<IMechanic>(
  {
    mechanicId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    specialization: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
    },

    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },

    availability: {
      type: String,
      enum: ["Available", "Offline"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

const Mechanic: Model<IMechanic> = model<IMechanic>(
  "Mechanic",
  mechanicSchema
);

export default Mechanic;