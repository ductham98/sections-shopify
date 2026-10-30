import React from "react";

interface PlanBadgeProps {
  plan?: "free" | "gold";
}

export function PlanBadge({ plan = "free" }: PlanBadgeProps) {
  if (plan === "gold") {
    return (
      <span className="inline-flex items-center rounded-md bg-amber-50/95 backdrop-blur-xs px-2 py-0.5 text-[11px] font-semibold text-amber-800 border border-amber-300 shadow-2xs">
        Gold
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-md bg-sky-50/95 backdrop-blur-xs px-2 py-0.5 text-[11px] font-semibold text-sky-700 border border-sky-300/80 shadow-2xs">
      Free
    </span>
  );
}
