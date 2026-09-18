import { Types } from "mongoose";
import Service, { type IService } from "../models/Service.js";

function validateObjectId(id: string): Types.ObjectId {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid service ID.");
  }

  return new Types.ObjectId(id);
}

export async function getAllServices(): Promise<IService[]> {
  return Service.find({
    active: true,
  }).sort({
    name: 1,
  });
}

export async function getServiceById(
  id: string
): Promise<IService | null> {
  const serviceObjectId = validateObjectId(id);

  return Service.findById(serviceObjectId);
}