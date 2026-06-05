import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const DataListOrientationContext = React.createContext<"horizontal" | "vertical">("horizontal");

const dataListVariants = cva("overflow-hidden text-left font-normal", {
  variants: {
    orientation: {
      horizontal: "flex flex-col",
      vertical: "flex flex-col",
    },
    size: {
      default: "text-base",
      sm: "text-sm",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    size: "default",
  },
});

type DataListProps = React.HTMLAttributes<HTMLDListElement> &
  VariantProps<typeof dataListVariants> & {
    readonly asChild?: boolean;
  };

const DataList = React.forwardRef<HTMLDListElement, DataListProps>(function DataList(
  { className, orientation = "horizontal", size, asChild = false, ...props },
  ref
) {
  const Comp = asChild ? Slot : "dl";

  return (
    <DataListOrientationContext.Provider value={orientation ?? "horizontal"}>
      <Comp
        ref={ref}
        className={cn(dataListVariants({ orientation, size }), className)}
        {...props}
      />
    </DataListOrientationContext.Provider>
  );
});

type DataListItemProps = React.HTMLAttributes<HTMLDivElement>;

const DataListItem = React.forwardRef<HTMLDivElement, DataListItemProps>(function DataListItem(
  { className, ...props },
  ref
) {
  const orientation = React.useContext(DataListOrientationContext);

  return (
    <div
      ref={ref}
      className={cn("flex", orientation === "horizontal" ? "items-center" : "flex-col", className)}
      {...props}
    />
  );
});

const DataListLabel = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  function DataListLabel({ className, ...props }, ref) {
    return <dt ref={ref} className={cn("text-muted-foreground", className)} {...props} />;
  }
);

const DataListValue = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  function DataListValue({ className, ...props }, ref) {
    return <dd ref={ref} className={cn("text-foreground", className)} {...props} />;
  }
);

export { DataList, DataListItem, DataListLabel, DataListValue };
