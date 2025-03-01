import * as React from "react";
import { cn } from "@lib/utils"; // ✅ Use alias as defined in tsconfig.json

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn("border p-2 rounded-md w-full", className)}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

export default Select;