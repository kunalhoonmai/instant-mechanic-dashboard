"use client";

import * as React from "react";

import {
  Award,
  Phone,
  User,
  Wrench,
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAppAlert } from "@/components/ui/app-alert";
import api from "@/lib/api";

import type {
  Mechanic,
  MechanicAvailability,
} from "@/lib/operations-types";

import {
  mapBackendMechanic,
  type BackendMechanic,
} from "@/lib/mappers";

interface MechanicFormDialogProps {
  open: boolean;
  onOpenChange: (
    open: boolean
  ) => void;
  mechanic?: Mechanic | null;
  mode: "create" | "edit";
  onSave: (
    mechanic: Mechanic
  ) => void;
}

const specializations = [
  "Engine & General Repair",
  "AC & Electrical",
  "General Repair",
  "Brakes & Suspension",
  "Engine & Transmission",
  "Battery & Electrical",
  "AC & General Repair",
];

const availabilities: MechanicAvailability[] =
  [
    "Available",
    "Offline",
  ];

interface MechanicResponse {
  success: boolean;
  message?: string;
  data: BackendMechanic;
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
    const response =
      (
        error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        }
      ).response;

    if (
      response?.data?.message
    ) {
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

export function MechanicFormDialog({
  open,
  onOpenChange,
  mechanic,
  mode,
  onSave,
}: MechanicFormDialogProps) {
  const { showAlert } =
    useAppAlert();

  const [name, setName] =
    React.useState("");

  const [phone, setPhone] =
    React.useState("");

  const [
    specialization,
    setSpecialization,
  ] = React.useState("");

  const [
    experience,
    setExperience,
  ] = React.useState("");

  const [rating, setRating] =
    React.useState("");

  const [
    availability,
    setAvailability,
  ] =
    React.useState<MechanicAvailability>(
      "Available"
    );

  const [error, setError] =
    React.useState("");

  const [saving, setSaving] =
    React.useState(false);

  /*
   * --------------------------------
   * LOAD FORM
   * --------------------------------
   */

  React.useEffect(() => {
    if (!open) {
      return;
    }

    setError("");

    if (
      mode === "edit" &&
      mechanic
    ) {
      setName(mechanic.name);

      setPhone(
        mechanic.phone
      );

      setSpecialization(
        mechanic.specialization
      );

      setExperience(
        mechanic.experience
      );

      setRating(
        String(mechanic.rating)
      );

      setAvailability(
        mechanic.availability
      );
    } else {
      setName("");
      setPhone("");
      setSpecialization("");
      setExperience("");
      setRating("5.0");
      setAvailability(
        "Available"
      );
    }
  }, [
    open,
    mode,
    mechanic,
  ]);

  /*
   * --------------------------------
   * SUBMIT
   * --------------------------------
   */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    setError("");

    const trimmedName =
      name.trim();

    const trimmedPhone =
      phone.trim();

    const trimmedExperience =
      experience.trim();

    if (!trimmedName) {
      const message =
        "Please enter the mechanic name.";

      setError(message);
      showAlert(message, "error");
      return;
    }

    if (!trimmedPhone) {
      const message =
        "Please enter the phone number.";

      setError(message);
      showAlert(message, "error");
      return;
    }

    if (!specialization) {
      const message =
        "Please select a specialization.";

      setError(message);
      showAlert(message, "error");
      return;
    }

    if (!trimmedExperience) {
      const message =
        "Please enter the mechanic's experience.";

      setError(message);
      showAlert(message, "error");
      return;
    }

    const numericExperience =
      Number(trimmedExperience);

    if (
      Number.isNaN(
        numericExperience
      ) ||
      numericExperience < 0
    ) {
      const message =
        "Experience must be a valid number of years.";

      setError(message);
      showAlert(message, "error");
      return;
    }

    const numericRating =
      Number(rating);

    if (
      !rating ||
      Number.isNaN(
        numericRating
      ) ||
      numericRating < 0 ||
      numericRating > 5
    ) {
      const message =
        "Rating must be between 0 and 5.";

      setError(message);
      showAlert(message, "error");
      return;
    }

    setSaving(true);

    try {
      /*
       * --------------------------------
       * CREATE
       * --------------------------------
       */

      if (mode === "create") {
        const response =
          await api.post<MechanicResponse>(
            "/mechanics",
            {
              name: trimmedName,
              phone: trimmedPhone,
              specialization,
              experience:
                numericExperience,
              rating:
                Number(
                  numericRating.toFixed(1)
                ),
              availability,
            }
          );

        if (
          !response.data.success
        ) {
          throw new Error(
            response.data.message ||
              "Failed to create mechanic."
          );
        }

        const mappedMechanic =
          mapBackendMechanic(
            response.data.data
          );

        /*
         * Update local UI immediately
         * with the actual backend record.
         *
         * Socket.IO will also emit
         * mechanic:created, and the store
         * safely upserts the same mechanic.
         */
        onSave(mappedMechanic);

        showAlert(
          "Mechanic added successfully.",
          "success"
        );

        onOpenChange(false);

        return;
      }

      /*
       * --------------------------------
       * EDIT
       * --------------------------------
       */

      if (!mechanic) {
        throw new Error(
          "Mechanic information is missing."
        );
      }

      const response =
        await api.patch<MechanicResponse>(
          `/mechanics/${mechanic.id}`,
          {
            name: trimmedName,
            phone: trimmedPhone,
            specialization,
            experience:
              numericExperience,
            rating:
              Number(
                numericRating.toFixed(1)
              ),
            availability,
          }
        );

      if (
        !response.data.success
      ) {
        throw new Error(
          response.data.message ||
            "Failed to update mechanic."
        );
      }

      const mappedMechanic =
        mapBackendMechanic(
          response.data.data
        );

      onSave(mappedMechanic);

      showAlert(
        "Mechanic updated successfully.",
        "success"
      );

      onOpenChange(false);
    } catch (error) {
      console.error(
        "Failed to save mechanic:",
        error
      );

      const message =
        getApiErrorMessage(
          error,
          mode === "create"
            ? "Failed to create mechanic."
            : "Failed to update mechanic."
        );

      setError(message);

      showAlert(
        message,
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * --------------------------------
   * RENDER
   * --------------------------------
   */

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {mode === "create"
              ? "Add Mechanic"
              : "Edit Mechanic"}
          </DialogTitle>

          <DialogDescription>
            {mode === "create"
              ? "Add a new mechanic to your team."
              : `Update details for ${mechanic?.name}.`}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-6"
        >
          {/* Personal Information */}

          <section className="space-y-4">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </span>

                Personal Information
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Enter the mechanic&apos;s
                basic contact
                information.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Name */}

              <div className="space-y-2">
                <Label htmlFor="mechanic-name">
                  Full Name
                </Label>

                <Input
                  id="mechanic-name"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target
                        .value
                    )
                  }
                  placeholder="e.g. Amit Kumar"
                  autoComplete="name"
                  disabled={saving}
                />
              </div>

              {/* Phone */}

              <div className="space-y-2">
                <Label htmlFor="mechanic-phone">
                  Phone Number
                </Label>

                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="mechanic-phone"
                    value={phone}
                    onChange={(event) =>
                      setPhone(
                        event.target
                          .value
                      )
                    }
                    placeholder="+91 98765 43210"
                    className="pl-9"
                    type="tel"
                    autoComplete="tel"
                    disabled={saving}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Professional Information */}

          <section className="space-y-4 border-t pt-6">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Wrench className="h-4 w-4" />
                </span>

                Professional Information
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Add the mechanic&apos;s
                skills and
                experience.
              </p>
            </div>

            {/* Specialization */}

            <div className="space-y-2">
              <Label>
                Specialization
              </Label>

              <Select
                value={
                  specialization
                }
                onValueChange={(
                  value
                ) =>
                  setSpecialization(
                    value
                  )
                }
                disabled={saving}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>

                <SelectContent>
                  {specializations.map(
                    (item) => (
                      <SelectItem
                        key={item}
                        value={item}
                      >
                        {item}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Experience */}

              <div className="space-y-2">
                <Label htmlFor="mechanic-experience">
                  Experience
                </Label>

                <Input
                  id="mechanic-experience"
                  type="number"
                  min="0"
                  step="1"
                  value={
                    experience
                  }
                  onChange={(
                    event
                  ) =>
                    setExperience(
                      event.target
                        .value
                    )
                  }
                  placeholder="e.g. 5"
                  disabled={saving}
                />

                <p className="text-xs text-muted-foreground">
                  Enter experience
                  in years.
                </p>
              </div>

              {/* Rating */}

              <div className="space-y-2">
                <Label htmlFor="mechanic-rating">
                  Customer Rating
                </Label>

                <div className="relative">
                  <Award className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="mechanic-rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={rating}
                    onChange={(
                      event
                    ) =>
                      setRating(
                        event.target
                          .value
                      )
                    }
                    placeholder="5.0"
                    className="pl-9"
                    disabled={saving}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  Enter a rating
                  between 0 and
                  5.
                </p>
              </div>
            </div>
          </section>

          {/* Availability */}

          <section className="space-y-4 border-t pt-6">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Wrench className="h-4 w-4" />
                </span>

                Availability
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Set whether the
                mechanic is
                available for
                assignment.
              </p>
            </div>

            <div className="space-y-2">
              <Label>
                Availability
              </Label>

              <Select
                value={
                  availability
                }
                onValueChange={(
                  value
                ) =>
                  setAvailability(
                    value as MechanicAvailability
                  )
                }
                disabled={saving}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {availabilities.map(
                    (item) => (
                      <SelectItem
                        key={item}
                        value={item}
                      >
                        {item}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>

              <p className="text-xs text-muted-foreground">
                A mechanic with
                an active Pending
                or Assigned booking
                today will
                automatically appear
                as On Service.
              </p>
            </div>
          </section>

          {/* Error */}

          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Footer */}

          <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(
                  false
                )
              }
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={saving}
            >
              {saving
                ? mode === "create"
                  ? "Adding..."
                  : "Saving..."
                : mode === "create"
                  ? "Add Mechanic"
                  : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}