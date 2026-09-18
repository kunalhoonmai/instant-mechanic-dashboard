import {
  Document,
  Model,
  Schema,
  Types,
  model,
} from "mongoose";

export type BookingStatus =
  | "Pending"
  | "Assigned"
  | "Completed"
  | "Cancelled";

export interface IBooking extends Document {
  bookingId: string;
  customer: Types.ObjectId;
  mechanic: Types.ObjectId | null;
  service: Types.ObjectId;
  vehicle: {
    make: string;
    model: string;
    year: number;
    registrationNumber: string;
  };
  date: Date;
  time: string;
  amount: number;
  status: BookingStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingVehicleSchema = new Schema(
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

const bookingSchema = new Schema<IBooking>(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    mechanic: {
      type: Schema.Types.ObjectId,
      ref: "Mechanic",
      default: null,
    },

    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    vehicle: {
      type: bookingVehicleSchema,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Assigned",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ date: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ customer: 1 });
bookingSchema.index({ mechanic: 1 });
bookingSchema.index({ service: 1 });

const Booking: Model<IBooking> = model<IBooking>(
  "Booking",
  bookingSchema
);

export default Booking;