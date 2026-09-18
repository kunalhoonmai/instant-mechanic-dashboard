"use client";

import {
  MoreHorizontal,
  Phone,
  Star,
  Wrench,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Mechanic } from "./mechanics-page";
import { MechanicStatusBadge } from "./mechanic-status-badge";

interface MechanicsTableProps {
  data: Mechanic[];
  onMechanicClick?: (mechanic: Mechanic) => void;
  onEditMechanic?: (mechanic: Mechanic) => void;
}

export function MechanicsTable({
  data,
  onMechanicClick,
  onEditMechanic,
}: MechanicsTableProps) {
  return (
    <>
      {/* Desktop / Tablet */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30 text-left">
              <th className="px-5 py-3 font-medium text-muted-foreground">
                Mechanic
              </th>

              <th className="px-5 py-3 font-medium text-muted-foreground">
                Specialization
              </th>

              <th className="px-5 py-3 font-medium text-muted-foreground">
                Experience
              </th>

              <th className="px-5 py-3 font-medium text-muted-foreground">
                Today&apos;s Jobs
              </th>

              <th className="px-5 py-3 font-medium text-muted-foreground">
                Rating
              </th>

              <th className="px-5 py-3 font-medium text-muted-foreground">
                Status
              </th>

              <th className="px-5 py-3" />
            </tr>
          </thead>

          <tbody>
            {data.map((mechanic) => (
              <tr
                key={mechanic.id}
                className="transition-colors hover:bg-muted/20"
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="font-semibold">
                      {mechanic.name}
                    </p>

                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {mechanic.phone}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-muted-foreground" />

                    <span>
                      {mechanic.specialization}
                    </span>
                  </div>
                </td>

                <td className="px-5 py-4 text-muted-foreground">
                  {mechanic.experience}
                </td>

                <td className="px-5 py-4">
                  <span className="font-medium">
                    {mechanic.jobsToday}
                  </span>

                  <span className="ml-1 text-xs text-muted-foreground">
                    jobs
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current text-amber-500" />

                    <span className="font-medium">
                      {mechanic.rating}
                    </span>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <MechanicStatusBadge
                    status={mechanic.status}
                  />
                </td>

                <td className="px-5 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted"
                      aria-label={`Actions for ${mechanic.name}`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          onMechanicClick?.(mechanic)
                        }
                      >
                        View details
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() =>
                          onEditMechanic?.(mechanic)
                        }
                      >
                        Edit mechanic
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        View bookings
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
        {data.map((mechanic) => (
          <div
            key={mechanic.id}
            className="space-y-4 p-4 transition-colors hover:bg-muted/30"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {mechanic.name}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {mechanic.id}
                </p>
              </div>

              <MechanicStatusBadge
                status={mechanic.status}
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />

              <span>{mechanic.phone}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">
                  Specialization
                </p>

                <p className="mt-1 font-medium">
                  {mechanic.specialization}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Experience
                </p>

                <p className="mt-1 font-medium">
                  {mechanic.experience}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Today&apos;s Jobs
                </p>

                <p className="mt-1 font-medium">
                  {mechanic.jobsToday} jobs
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Rating
                </p>

                <div className="mt-1 flex items-center gap-1 font-medium">
                  <Star className="h-4 w-4 fill-current text-amber-500" />
                  {mechanic.rating}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end border-t pt-3">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted"
                  aria-label={`Actions for ${mechanic.name}`}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      onMechanicClick?.(mechanic)
                    }
                  >
                    View details
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    Edit mechanic
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    View bookings
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