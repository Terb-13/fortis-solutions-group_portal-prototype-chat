"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type SwitchProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  onCheckedChange?: (checked: boolean) => void;
};

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, onCheckedChange, checked, defaultChecked, ...props }, ref) => (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-3 select-none",
        props.disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <input
        type="checkbox"
        role="switch"
        ref={ref}
        className="peer sr-only"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        {...props}
      />
      <span
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full bg-muted transition-colors",
          "after:absolute after:top-0.5 after:left-0.5 after:h-6 after:w-6 after:rounded-full after:bg-white after:shadow-sm after:transition-transform",
          "peer-checked:bg-[#00A651] peer-checked:after:translate-x-6",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-[#003087]/35 peer-focus-visible:ring-offset-2",
        )}
        aria-hidden
      />
    </label>
  ),
);
Switch.displayName = "Switch";

export { Switch };
