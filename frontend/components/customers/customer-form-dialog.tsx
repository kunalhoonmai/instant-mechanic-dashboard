"use client";

import * as React from "react";

import {
  Car,
  Mail,
  Phone,
  User,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAppAlert } from "@/components/ui/app-alert";

import api from "@/lib/api";

import {
  mapBackendCustomer,
  type BackendCustomerWithStats,
} from "@/lib/mappers";

import type { Customer } from "@/lib/operations-types";

interface CustomerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: Customer | null;
  mode: "create" | "edit";
  onSave: (customer: Customer) => void;
}

interface CustomerResponse {
  success: boolean;
  data: BackendCustomerWithStats;
}

interface VehicleForm {
  make: string;
  model: string;
  year: string;
  registrationNumber: string;
}

function getApiErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (
    error &&
    typeof error === "object" &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
    ).response;

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  if (
    error instanceof Error &&
    error.message
  ) {
    return error.message;
  }

  return fallback;
}

function getVehicleParts(
  vehicle: string
): {
  make: string;
  model: string;
} {
  const parts = vehicle.trim().split(/\s+/);

  if (parts.length === 0) {
    return {
      make: "",
      model: "",
    };
  }

  if (parts.length === 1) {
    return {
      make: parts[0],
      model: "",
    };
  }

  return {
    make: parts[0],
    model: parts.slice(1).join(" "),
  };
}

function createEmptyVehicle(): VehicleForm {
  return {
    make: "",
    model: "",
    year: String(new Date().getFullYear()),
    registrationNumber: "",
  };
}

export function CustomerFormDialog({
  open,
  onOpenChange,
  customer,
  mode,
  onSave,
}: CustomerFormDialogProps) {
  const { showAlert } = useAppAlert();

  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");

  const [vehicle, setVehicle] =
    React.useState<VehicleForm>(
      createEmptyVehicle()
    );

  const [saving, setSaving] = React.useState(false);

  const [error, setError] =
    React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    setError(null);

    if (mode === "edit" && customer) {
      setName(customer.name);
      setPhone(customer.phone);
      setEmail(customer.email);

      const vehicleParts = getVehicleParts(
        customer.vehicle === "No vehicle"
          ? ""
          : customer.vehicle
      );

      setVehicle({
        make: vehicleParts.make,
        model: vehicleParts.model,
        year: String(new Date().getFullYear()),
        registrationNumber: "",
      });

      return;
    }

    setName("");
    setPhone("");
    setEmail("");
    setVehicle(createEmptyVehicle());
  }, [open, mode, customer]);

  const updateVehicle = (
    field: keyof VehicleForm,
    value: string
  ): void => {
    setVehicle((current: VehicleForm) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError(null);

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();

    const trimmedMake = vehicle.make.trim();
    const trimmedModel = vehicle.model.trim();
    const trimmedYear = vehicle.year.trim();
    const trimmedRegistration =
      vehicle.registrationNumber.trim().toUpperCase();

    if (
      !trimmedName ||
      !trimmedPhone ||
      !trimmedEmail ||
      !trimmedMake ||
      !trimmedModel ||
      !trimmedYear ||
      !trimmedRegistration
    ) {
      setError(
        "Please fill in all customer and vehicle fields."
      );

      return;
    }

    const numericYear = Number(trimmedYear);

    if (
      !Number.isInteger(numericYear) ||
      numericYear < 1900 ||
      numericYear > new Date().getFullYear() + 1
    ) {
      setError(
        "Please enter a valid vehicle year."
      );

      return;
    }

    setSaving(true);

    try {
      const vehiclePayload = {
        make: trimmedMake,
        model: trimmedModel,
        year: numericYear,
        registrationNumber: trimmedRegistration,
      };

      if (mode === "create") {
        const response =
          await api.post<CustomerResponse>(
            "/customers",
            {
              name: trimmedName,
              phone: trimmedPhone,
              email: trimmedEmail,
              address: "Not provided",
              vehicles: [vehiclePayload],
            }
          );

        if (!response.data.success) {
          throw new Error(
            "Customer could not be created."
          );
        }

        const mapped = mapBackendCustomer(
          response.data.data
        );

        onSave(mapped);

        showAlert(
          "Customer created successfully.",
          "success"
        );

        onOpenChange(false);

        return;
      }

      if (!customer) {
        throw new Error(
          "Customer information is missing."
        );
      }

      const response =
        await api.patch<CustomerResponse>(
          `/customers/${customer.id}`,
          {
            name: trimmedName,
            phone: trimmedPhone,
            email: trimmedEmail,
            address:
              customer.address || "Not provided",
            vehicles: [vehiclePayload],
          }
        );

      if (!response.data.success) {
        throw new Error(
          "Customer could not be updated."
        );
      }

      const mapped = mapBackendCustomer(
        response.data.data
      );

      onSave(mapped);

      showAlert(
        "Customer updated successfully.",
        "success"
      );

      onOpenChange(false);
    } catch (error) {
      console.error(
        "Customer save failed:",
        error
      );

      const message = getApiErrorMessage(
        error,
        mode === "create"
          ? "Failed to create customer."
          : "Failed to update customer."
      );

      setError(message);

      showAlert(message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={
        saving ? undefined : onOpenChange
      }
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {mode === "create"
              ? "Add Customer"
              : "Edit Customer"}
          </DialogTitle>

          <DialogDescription>
            {mode === "create"
              ? "Create a new customer profile."
              : `Update details for ${customer?.id}.`}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Customer Information */}
          <section className="space-y-4">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </span>

                Customer Information
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Enter the customer's basic information.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer-name">
                  Customer Name
                </Label>

                <Input
                  id="customer-name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="e.g. Rahul Sharma"
                  autoComplete="name"
                  disabled={saving}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customer-phone">
                    Phone Number
                  </Label>

                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="customer-phone"
                      type="tel"
                      value={phone}
                      onChange={(event) =>
                        setPhone(event.target.value)
                      }
                      placeholder="+91 98765 43210"
                      className="pl-9"
                      autoComplete="tel"
                      disabled={saving}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer-email">
                    Email Address
                  </Label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="customer-email"
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="customer@email.com"
                      className="pl-9"
                      autoComplete="email"
                      disabled={saving}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Vehicle Information */}
          <section className="space-y-4 border-t pt-6">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Car className="h-4 w-4" />
                </span>

                Vehicle Information
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Enter the customer's vehicle details.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customer-vehicle-make">
                  Vehicle Make
                </Label>

                <div className="relative">
                  <Car className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="customer-vehicle-make"
                    value={vehicle.make}
                    onChange={(event) =>
                      updateVehicle(
                        "make",
                        event.target.value
                      )
                    }
                    placeholder="e.g. Hyundai"
                    className="pl-9"
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer-vehicle-model">
                  Vehicle Model
                </Label>

                <Input
                  id="customer-vehicle-model"
                  value={vehicle.model}
                  onChange={(event) =>
                    updateVehicle(
                      "model",
                      event.target.value
                    )
                  }
                  placeholder="e.g. Creta"
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer-vehicle-year">
                  Vehicle Year
                </Label>

                <Input
                  id="customer-vehicle-year"
                  type="number"
                  min={1900}
                  max={new Date().getFullYear() + 1}
                  value={vehicle.year}
                  onChange={(event) =>
                    updateVehicle(
                      "year",
                      event.target.value
                    )
                  }
                  placeholder="e.g. 2022"
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer-registration">
                  Registration Number
                </Label>

                <Input
                  id="customer-registration"
                  value={vehicle.registrationNumber}
                  onChange={(event) =>
                    updateVehicle(
                      "registrationNumber",
                      event.target.value
                    )
                  }
                  placeholder="e.g. CG 04 AB 1234"
                  className="uppercase"
                  disabled={saving}
                />
              </div>
            </div>
          </section>

          {/* Status Information */}
          <section className="space-y-3 border-t pt-6">
            <div>
              <h3 className="text-sm font-semibold">
                Customer Status
              </h3>

              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Customer status is automatically determined from
                booking activity. It cannot be manually changed
                from this form.
              </p>
            </div>

            <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                Active
              </span>{" "}
              means the customer has recent non-cancelled
              booking activity. Otherwise the customer is shown
              as{" "}
              <span className="font-medium text-foreground">
                Inactive
              </span>
              .
            </div>
          </section>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={() =>
                onOpenChange(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : mode === "create"
                  ? "Add Customer"
                  : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}