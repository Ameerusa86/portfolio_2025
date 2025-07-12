import * as React from "react";

export interface SwitchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <label className={`flex items-center gap-2 cursor-pointer ${className}`}>
        <input
          type="checkbox"
          className="peer appearance-none w-10 h-6 bg-gray-200 rounded-full checked:bg-primary transition-colors relative outline-none focus:ring-2 focus:ring-primary/30"
          ref={ref}
          {...props}
        />
        <span className="w-4 h-4 bg-white rounded-full shadow absolute left-1 top-1 peer-checked:translate-x-4 transition-transform" />
        {label && (
          <span className="ml-3 text-sm text-muted-foreground">{label}</span>
        )}
      </label>
    );
  }
);
Switch.displayName = "Switch";
