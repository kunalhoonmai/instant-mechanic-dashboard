import {
  ArrowRight,
  CarFront,
  Clock3,
  MapPin,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const bookings = [
  {
    id: "#BK-10284",
    customer: "Rahul Sharma",
    vehicle: "Honda City",
    service: "Oil Change",
    mechanic: "Amit Kumar",
    location: "Sector 18",
    time: "10:30 AM",
    amount: "₹1,200",
    status: "Completed",
  },
  {
    id: "#BK-10283",
    customer: "Priya Singh",
    vehicle: "Maruti Swift",
    service: "Brake Service",
    mechanic: "Ravi Verma",
    location: "Sector 62",
    time: "11:15 AM",
    amount: "₹2,800",
    status: "In Progress",
  },
  {
    id: "#BK-10282",
    customer: "Arjun Mehta",
    vehicle: "Hyundai Creta",
    service: "AC Service",
    mechanic: "Mohit Sharma",
    location: "Noida Extension",
    time: "12:00 PM",
    amount: "₹1,800",
    status: "Assigned",
  },
  {
    id: "#BK-10281",
    customer: "Neha Gupta",
    vehicle: "Hyundai i20",
    service: "Battery Replacement",
    mechanic: "Rahul Singh",
    location: "Sector 15",
    time: "01:30 PM",
    amount: "₹4,500",
    status: "Pending",
  },
  {
    id: "#BK-10280",
    customer: "Vikas Yadav",
    vehicle: "Tata Nexon",
    service: "General Repair",
    mechanic: "Sandeep Kumar",
    location: "Sector 50",
    time: "02:15 PM",
    amount: "₹3,200",
    status: "Completed",
  },
];

const statusStyles: Record<string, string> = {
  Completed:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "In Progress":
    "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Assigned:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Pending:
    "bg-muted text-muted-foreground",
};

export function RecentBookings() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base">
              Recent Bookings
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Latest service requests and appointments
            </p>
          </div>

          <button
            type="button"
            className="
              hidden
              shrink-0
              items-center
              gap-1
              rounded-md
              text-sm
              font-medium
              text-primary
              transition-colors
              hover:text-primary/80
              sm:flex
            "
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Desktop / Tablet */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y bg-muted/30">
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                  Customer
                </th>

                <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                  Vehicle
                </th>

                <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                  Service
                </th>

                <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                  Mechanic
                </th>

                <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                  Status
                </th>

                <th className="px-6 py-3 text-right font-medium text-muted-foreground">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b last:border-0 transition-colors hover:bg-muted/30"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">
                        {booking.customer}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {booking.id}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CarFront className="h-4 w-4 text-muted-foreground" />
                      {booking.vehicle}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {booking.service}
                  </td>

                  <td className="px-6 py-4">
                    {booking.mechanic}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        statusStyles[booking.status]
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right font-medium">
                    {booking.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="divide-y md:hidden">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="p-4 transition-colors hover:bg-muted/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {booking.customer}
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {booking.id}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                    statusStyles[booking.status]
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CarFront className="h-3.5 w-3.5" />
                  <span className="truncate">
                    {booking.vehicle}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5" />
                  {booking.time}
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="truncate">
                    {booking.location}
                  </span>
                </div>

                <div className="text-right font-medium">
                  {booking.amount}
                </div>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                {booking.service} · {booking.mechanic}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="border-t p-4 sm:hidden">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-1 text-sm font-medium text-primary"
          >
            View all bookings
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}