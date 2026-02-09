import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AreaCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  isPremium?: boolean;
  isLocked?: boolean;
  badge?: string;
  onClick?: () => void;
  compact?: boolean;
}

export const AreaCard = ({
  title,
  description,
  icon,
  iconColor,
  isPremium = false,
  isLocked = false,
  badge,
  onClick,
  compact = false,
}: AreaCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 cursor-pointer",
        "hover:border-primary/40 hover:shadow-[0_0_30px_hsl(175,70%,50%,0.15)]",
        isLocked && "opacity-80",
        compact ? "p-3" : "p-6"
      )}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Icon container */}
      <div
        className={cn(
          "flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
          iconColor,
          compact ? "mb-2 h-9 w-9" : "mb-4 h-14 w-14"
        )}
      >
        {icon}
      </div>

      {/* Content */}
      <h3 className={cn("font-semibold text-foreground", compact ? "mb-1 text-sm" : "mb-2 text-lg")}>{title}</h3>
      <p className={cn("text-muted-foreground", compact ? "text-xs leading-tight" : "text-sm")}>{description}</p>

      {/* Premium Lock */}
      {isLocked && (
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5">
          <Lock className="h-2.5 w-2.5 text-primary-foreground" />
          <span className="text-[10px] font-semibold text-primary-foreground">Premium</span>
        </div>
      )}

      {/* Free badge */}
      {badge && !isLocked && (
        <div className="absolute right-3 top-3 rounded-full bg-primary px-2 py-0.5">
          <span className="text-[10px] font-semibold text-primary-foreground">{badge}</span>
        </div>
      )}

      {/* Hover glow effect */}
      <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 blur transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  );
};
