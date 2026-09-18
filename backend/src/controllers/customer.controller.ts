import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  type CreateCustomerInput,
  type UpdateCustomerInput,
} from "../services/customer.service.js";

import { getIO } from "../socket/socket.js";

function getParamId(req: Request): string {
  const id = req.params.id;

  if (Array.isArray(id)) {
    return id[0];
  }

  return id;
}

export async function getCustomers(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const customers = await getAllCustomers();

    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCustomer(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const customer = await getCustomerById(
      getParamId(req)
    );

    if (!customer) {
      res.status(404).json({
        success: false,
        message: "Customer not found.",
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
}

export async function createNewCustomer(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = req.body as CreateCustomerInput;

    const requiredFields = [
      "name",
      "phone",
      "email",
      "address",
    ] as const;

    const missingFields = requiredFields.filter(
      (field) =>
        input[field] === undefined ||
        input[field] === null ||
        input[field] === ""
    );

    if (missingFields.length > 0) {
      res.status(400).json({
        success: false,
        message: "Missing required customer fields.",
        fields: missingFields,
      });

      return;
    }

    const customer = await createCustomer(input);

    getIO().emit(
      "customer:created",
      customer
    );

    res.status(201).json({
      success: true,
      message: "Customer created successfully.",
      data: customer,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateExistingCustomer(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = req.body as UpdateCustomerInput;

    const customer = await updateCustomer(
      getParamId(req),
      input
    );

    if (!customer) {
      res.status(404).json({
        success: false,
        message: "Customer not found.",
      });

      return;
    }

    getIO().emit(
      "customer:updated",
      customer
    );

    res.status(200).json({
      success: true,
      message: "Customer updated successfully.",
      data: customer,
    });
  } catch (error) {
    next(error);
  }
}