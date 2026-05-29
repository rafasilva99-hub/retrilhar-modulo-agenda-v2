import * as React from "react";

import { cn } from "@/lib/utils";

import { Badge } from "./badge";

interface ParticipantCountBadgeProps extends React.ComponentProps<typeof Badge> {
  count: number;
}

export function ParticipantCountBadge({ count, className, ...props }: ParticipantCountBadgeProps) {
  return (
    <Badge
      className={cn(
        "h-auto gap-[4px] rounded-[6px] bg-[#0b5ed7] px-[6px] py-[2px] hover:bg-[#0b5ed7]",
        className
      )}
      {...props}
    >
      <svg className="size-[12px] shrink-0" fill="none" viewBox="0 0 16 16">
        <path
          d="M13.333 14v-1.333A2.667 2.667 0 0010.666 10H5.333a2.667 2.667 0 00-2.666 2.667V14M8 7.333A2.667 2.667 0 108 2a2.667 2.667 0 000 5.333z"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-['Helvetica_Neue:Medium',sans-serif] text-[12px] leading-[normal] text-white not-italic">
        {count}
      </span>
    </Badge>
  );
}
