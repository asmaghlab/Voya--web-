import { Heart } from "lucide-react";
import { cn } from "@/utils/utils";

interface WishlistButtonProps {
  active: boolean;
  onToggle: () => void;
  size?: number;
  className?: string;
  showBadge?: boolean;
  badgeCount?: number;
}

export const WishlistButton = ({
  active,
  onToggle,
  size = 22,
  className = "",
  showBadge = false,
  badgeCount = 0,
}: WishlistButtonProps) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={cn(
        "relative flex items-center justify-center p-2 rounded-full transition",
        className
      )}
    >
      <span className="relative flex items-center justify-center">
        <Heart
          size={size}
          className={cn(
            `
              transition
              ${active ? "stroke-blue-400 fill-blue-400" : "stroke-muted-foreground"}
              hover:stroke-blue-400 hover:fill-blue-400
            `
          )}
        />

        {showBadge && badgeCount > 0 && (
          <span
            className="
              absolute 
              font-semibold
              text-xs
              text-white
              pointer-events-none
            "
            style={{
              top: "41%",
              left: "50%",
              transform: "translate(-50%, -48%)",
            }}
          >
            {badgeCount > 99 ? "99+" : badgeCount}
          </span>
        )}
      </span>
    </button>
  );
};