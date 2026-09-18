import { Document, Model, Schema, model } from "mongoose";

export interface IService extends Document {
  serviceId: string;
  name: string;
  description: string;
  basePrice: number;
  duration: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    serviceId: {
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

    description: {
      type: String,
      required: true,
      trim: true,
    },

    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Service: Model<IService> = model<IService>(
  "Service",
  serviceSchema
);

export default Service;