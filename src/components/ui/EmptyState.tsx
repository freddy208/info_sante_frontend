import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  iconClassName?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  iconClassName,
  title,
  description,
  actionLabel,
  onAction,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 space-y-4 h-full animate-in fade-in duration-300",
        className
      )}
    >
      {Icon && (
        <Icon
          className={cn("w-16 h-16 text-muted-foreground/50", iconClassName)}
        />
      )}

      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-muted-foreground max-w-sm">{description}</p>
        )}
      </div>

      {action ? (
        action
      ) : actionLabel && onAction ? (
        <Button onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
