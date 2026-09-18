import type { ServicePerformance } from "@/lib/analytics-types";

interface ServiceBreakdownProps {
  servicePerformance: ServicePerformance[];
}

export function ServiceBreakdown({
  servicePerformance,
}: ServiceBreakdownProps) {
  const services =
    servicePerformance.slice(0, 6);

  const totalBookings =
    servicePerformance.reduce(
      (total, service) =>
        total + service.bookings,
      0
    );

  return (
    <div className="rounded-xl border bg-background p-5">
      <div>
        <h3 className="text-base font-medium">
          Service Breakdown
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Bookings by service category
        </p>
      </div>

      <div className="mt-5 space-y-4">
        {services.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No service data available.
          </div>
        ) : (
          services.map((service) => {
            const percentage =
              totalBookings > 0
                ? (service.bookings /
                    totalBookings) *
                  100
                : 0;

            return (
              <div
                key={service.serviceId}
                className="space-y-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm font-medium">
                    {service.name}
                  </span>

                  <span className="shrink-0 text-xs text-muted-foreground">
                    {service.bookings.toLocaleString(
                      "en-IN"
                    )}{" "}
                    bookings
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{
                      width: `${Math.max(
                        percentage,
                        2
                      )}%`,
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}