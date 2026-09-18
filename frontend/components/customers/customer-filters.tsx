"use client";

import { Filter, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CustomerFiltersProps {
  status: string;
  onStatusChange: (status: string) => void;
  onClear: () => void;
  hasFilters: boolean;
}

export function CustomerFilters({
  status,
  onStatusChange,
  onClear,
  hasFilters,
}: CustomerFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>Filters</span>
      </div>

      <select
        value={status}
        onChange={(event) =>
          onStatusChange(event.target.value)
        }
        className="h-9 rounded-md border bg-background px-3 text-xs outline-none transition-colors focus:ring-2 focus:ring-primary/20"
      >
        <option>All Status</option>
        <option>Active</option>
        <option>Inactive</option>
      </select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-9 gap-1.5 text-xs"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
}