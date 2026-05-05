import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  footer?: ReactNode;
}

function Card({
  className,
  title,
  description,
  footer,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-slate-200 bg-white shadow-sm",
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className="border-b border-slate-200 px-6 py-4">
          {title && (
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && (
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3">
          {footer}
        </div>
      )}
    </div>
  );
}

export { Card };
