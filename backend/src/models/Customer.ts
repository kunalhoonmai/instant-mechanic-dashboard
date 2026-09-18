import { Document, Model, Schema, model } from "mongoose";

export interface IVehicle {
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
}

export interface ICustomer extends Document {
  customerId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  vehicles: IVehicle[];
  createdAt: Date;
  updatedAt: Date;
}

const vehicleSchema = new Schema<IVehicle>(
  {
    make: {
      type: String,
      required: true,
      trim: true,
    },

    model: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
      required: true,
      min: 1900,
    },

    registrationNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
  },
  {
    _id: false,
  }
);

const customerSchema = new Schema<ICustomer>(
  {
    customerId: {
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

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    vehicles: {
      type: [vehicleSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Customer: Model<ICustomer> = model<ICustomer>(
  "Customer",
  customerSchema
);

export default Customer;