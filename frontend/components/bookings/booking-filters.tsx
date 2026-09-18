"use client";

import {
  CalendarDays,
  Filter,
} from "lucide-react";

interface BookingsFiltersProps {
  status: string;
  service: string;
  date: string;

  services: string[];

  onStatusChange: (
    value: string
  ) => void;

  onServiceChange: (
    value: string
  ) => void;

  onDateChange: (
    value: string
  ) => void;

  onClear: () => void;

  hasFilters: boolean;
}

export function BookingsFilters({
  status,
  service,
  date,
  services,
  onStatusChange,
  onServiceChange,
  onDateChange,
  onClear,
  hasFilters,
}: BookingsFiltersProps) {
  return (
    <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:flex-wrap sm:items-center">
      {/* Filter label */}
      <div className="inline-flex h-9 items-center gap-2 text-sm font-medium">
        <Filter className="h-4 w-4 text-muted-foreground" />

        Filters
      </div>

      {/* Status */}
      <select
        value={status}
        onChange={(event) =>
          onStatusChange(
            event.target.value
          )
        }
        className="h-9 rounded-md border bg-background px-3 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring"
        aria-label="Filter by booking status"
      >
        <option value="All Status">
          All Status
        </option>

        <option value="Completed">
          Completed
        </option>

        <option value="Pending">
          Pending
        </option>

        <option value="Assigned">
          Assigned
        </option>

        <option value="Cancelled">
          Cancelled
        </option>
      </select>

      {/* Service */}
      <select
        value={service}
        onChange={(event) =>
          onServiceChange(
            event.target.value
          )
        }
        className="h-9 rounded-md border bg-background px-3 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring"
        aria-label="Filter by service"
      >
        <option value="All Services">
          All Services
        </option>

        {services.map(
          (serviceName) => (
            <option
              key={serviceName}
              value={serviceName}
            >
              {serviceName}
            </option>
          )
        )}
      </select>

      {/* Date */}
      <label
        className={`inline-flex h-9 items-center gap-2 rounded-md border bg-background px-3 text-sm transition-colors ${
          date
            ? "border-primary/40 bg-primary/5"
            : ""
        }`}
      >
        <CalendarDays className="h-4 w-4 text-muted-foreground" />

        <span className="whitespace-nowrap">
          {date
            ? "Date"
            : "Date"}
        </span>

        <input
          type="date"
          value={date}
          onChange={(event) =>
            onDateChange(
              event.target.value
            )
          }
          className="min-w-0 bg-transparent text-sm outline-none"
          aria-label="Filter by booking date"
        />
      </label>

      {/* Clear */}
      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground sm:ml-auto"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}