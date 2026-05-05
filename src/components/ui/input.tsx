import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
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
        <input
          id={id}
          ref={ref}
          className={cn(
            "block w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors",
            "placeholder:text-slate-400",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            error
              ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500"
              : "border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-blue-500",
            "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-50",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
