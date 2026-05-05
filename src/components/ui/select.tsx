import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={id}
            ref={ref}
            className={cn(
              "block w-full appearance-none rounded-md border bg-white px-3 py-2 pr-10 text-sm shadow-sm transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              error
                ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500"
                : "border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-blue-500",
              "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-50",
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
