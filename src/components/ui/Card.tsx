import * as React from "react";
import { cn } from "@lib/utils"; // ✅ Use alias as defined in tsconfig.json

export const Card: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <div className={cn("p-4 border rounded-lg shadow-sm", className)}>
    {children}
  </div>
);

export default Card;