import * as React from "react";
import { cn } from "@lib/utils"; // ✅ Use alias as defined in tsconfig.json

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn("px-4 py-2 bg-blue-500 text-white rounded-md", className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export default Button;