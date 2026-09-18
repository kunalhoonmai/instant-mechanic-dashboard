"use client";

import {
  CarFront,
  Mail,
  MoreHorizontal,
  Phone,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Customer } from "./customers-page";
import { CustomerStatusBadge } from "./customer-status-badge";

interface CustomersTableProps {
  data: Customer[];
  onCustomerClick?: (
    customer: Customer
  ) => void;
  onEditCustomer?: (
    customer: Customer
  ) => void;
  onViewBookings?: (
    customer: Customer
  ) => void;
}

export function CustomersTable({
  data,
  onCustomerClick,
  onEditCustomer,
  onViewBookings,
}: CustomersTableProps) {
  return (
    <>
      {/* Desktop / Tablet */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30 text-left">
              <th className="px-5 py-3 font-medium text-muted-foreground">
                Customer
              </th>

              <th className="px-5 py-3 font-medium text-muted-foreground">
                Vehicle
              </th>

              <th className="px-5 py-3 font-medium text-muted-foreground">
                Bookings
              </th>

              <th className="px-5 py-3 font-medium text-muted-foreground">
                Last Booking
              </th>

              <th className="px-5 py-3 font-medium text-muted-foreground">
                Total Spent
              </th>

              <th className="px-5 py-3 font-medium text-muted-foreground">
                Status
              </th>

              <th className="px-5 py-3" />
            </tr>
          </thead>

          <tbody>
            {data.map((customer) => (
              <tr
                key={customer.id}
                className="transition-colors hover:bg-muted/20"
              >
                {/* Customer */}

                <td className="px-5 py-4">
                  <div>
                    <p className="font-semibold">
                      {customer.name}
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {customer.customerId ??
                        "Customer ID unavailable"}
                    </p>

                    <div className="mt-1 flex flex-col gap-0.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />

                        {customer.phone}
                      </span>

                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />

                        {customer.email}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Vehicle */}

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <CarFront className="h-4 w-4 text-muted-foreground" />

                    <span className="font-medium">
                      {customer.vehicle}
                    </span>
                  </div>
                </td>

                {/* Bookings */}

                <td className="px-5 py-4">
                  <span className="font-medium">
                    {customer.totalBookings}
                  </span>
                </td>

                {/* Last Booking */}

                <td className="px-5 py-4">
                  <span>
                    {customer.lastBooking}
                  </span>
                </td>

                {/* Total Spent */}

                <td className="px-5 py-4 font-medium">
                  ₹
                  {customer.totalSpent.toLocaleString(
                    "en-IN"
                  )}
                </td>

                {/* Status */}

                <td className="px-5 py-4">
                  <CustomerStatusBadge
                    status={
                      customer.status
                    }
                  />
                </td>

                {/* Actions */}

                <td className="px-5 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted"
                      aria-label={`Actions for ${customer.name}`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          onCustomerClick?.(
                            customer
                          )
                        }
                      >
                        View details
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() =>
                          onEditCustomer?.(
                            customer
                          )
                        }
                      >
                        Edit customer
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() =>
                          onViewBookings?.(
                            customer
                          )
                        }
                      >
                        View bookings
                      </DropdownMenuItem>

                      <DropdownMenuItem className="text-destructive">
                        Deactivate customer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}

      <div className="divide-y md:hidden">
        {data.map((customer) => (
          <div
            key={customer.id}
            className="space-y-4 p-4 transition-colors hover:bg-muted/30"
          >
            {/* Header */}

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold">
                  {customer.name}
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {customer.customerId ??
                    "Customer ID unavailable"}
                </p>
              </div>

              <CustomerStatusBadge
                status={
                  customer.status
                }
              />
            </div>

            {/* Contact */}

            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />

                <span>
                  {customer.phone}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />

                <span className="truncate">
                  {customer.email}
                </span>
              </div>
            </div>

            {/* Details */}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">
                  Vehicle
                </p>

                <p className="mt-1 flex items-center gap-1.5 font-medium">
                  <CarFront className="h-3.5 w-3.5 text-muted-foreground" />

                  {customer.vehicle}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Bookings
                </p>

                <p className="mt-1 font-medium">
                  {customer.totalBookings}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Last Booking
                </p>

                <p className="mt-1 font-medium">
                  {customer.lastBooking}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Total Spent
                </p>

                <p className="mt-1 font-medium">
                  ₹
                  {customer.totalSpent.toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>
            </div>

            {/* Actions */}

            <div className="flex items-center justify-between border-t pt-3">
              <a
                href={`tel:${customer.phone.replace(
                  /\s/g,
                  ""
                )}`}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
              >
                <Phone className="h-3.5 w-3.5" />

                Call customer
              </a>

              <DropdownMenu>
                <DropdownMenuTrigger
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted"
                  aria-label={`Actions for ${customer.name}`}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      onCustomerClick?.(
                        customer
                      )
                    }
                  >
                    View details
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() =>
                      onEditCustomer?.(
                        customer
                      )
                    }
                  >
                    Edit customer
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() =>
                      onViewBookings?.(
                        customer
                      )
                    }
                  >
                    View bookings
                  </DropdownMenuItem>

                  <DropdownMenuItem className="text-destructive">
                    Deactivate customer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}