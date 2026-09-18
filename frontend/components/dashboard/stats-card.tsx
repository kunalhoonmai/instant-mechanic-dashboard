import {
  ArrowDownRight,
  ArrowUpRight,
  LucideIcon,
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  description: string;
  icon: LucideIcon;
}

export function StatsCard({
  title,
  value,
  change,
  trend,
  description,
  icon: Icon,
}: StatsCardProps) {
  const isPositive = trend === "up";
  const isNegative = trend === "down";

  return (
    <div className="group rounded-xl border bg-background p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <h3 className="mt-2 truncate text-2xl font-bold tracking-tight">
            {value}
          </h3>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs">
        {trend === "neutral" ? (
          <span className="font-medium text-primary">
            {change}
          </span>
        ) : (
          <span
            className={`flex items-center gap-0.5 font-medium ${
              isPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : isNegative
                  ? "text-red-600 dark:text-red-400"
                  : "text-muted-foreground"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}

            {change}
          </span>
        )}

        <span className="truncate text-muted-foreground">
          {description}
        </span>
      </div>
    </div>
  );
}