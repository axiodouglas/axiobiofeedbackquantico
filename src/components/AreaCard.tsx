import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface AreaCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  isPremium?: boolean;
  isLocked?: boolean;
  onClick?: () => void;
}

export const AreaCard = ({
  title,
  description,
  icon,
  iconColor,
  isPremium = false,
  isLocked = false,
  onClick,
}: AreaCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 cursor-pointer",
        "hover:border-primary/40 hover:shadow-[0_0_30px_hsl(175,70%,50%,0.15)]",
        isLocked && "opacity-80"
      )}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Icon container */}
      <div
        className={cn(
          "mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
          iconColor
        )}
      >
        {icon}
      </div>

      {/* Content */}
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>

      {/* Premium Lock */}
      {isLocked && (
        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-primary/20 px-2.5 py-1">
          <Lock className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">Premium</span>
        </div>
      )}

      {/* Hover glow effect */}
      <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 blur transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  );
};
