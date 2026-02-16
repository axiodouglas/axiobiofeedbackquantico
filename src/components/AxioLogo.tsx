interface AxioLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { icon: 54, title: "text-xl", subtitle: "text-[9px]", gap: "gap-3" },
  md: { icon: 72, title: "text-3xl", subtitle: "text-[11px]", gap: "gap-4" },
  lg: { icon: 96, title: "text-4xl", subtitle: "text-sm", gap: "gap-5" },
};

const AxioLogo = ({ className = "", size = "md" }: AxioLogoProps) => {
  const s = sizes[size];

  return (
    <div className={`flex items-center ${s.gap} select-none ${className}`}>
      {/* Stylized X icon with circuit lines, brain & atom */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-[0_0_14px_hsl(175,70%,50%,0.5)]"
      >
        {/* X shape - top-left to bottom-right strokes */}
        <path d="M15 15 Q50 45 85 85" stroke="hsl(175, 70%, 50%)" strokeWidth="2.5" fill="none" opacity="0.9"/>
        <path d="M12 18 Q48 46 82 88" stroke="hsl(175, 70%, 50%)" strokeWidth="1.5" fill="none" opacity="0.6"/>
        <path d="M18 12 Q52 44 88 82" stroke="hsl(175, 70%, 50%)" strokeWidth="1.5" fill="none" opacity="0.6"/>
        <path d="M9 21 Q46 47 79 91" stroke="hsl(175, 70%, 50%)" strokeWidth="1" fill="none" opacity="0.35"/>
        <path d="M21 9 Q54 43 91 79" stroke="hsl(175, 70%, 50%)" strokeWidth="1" fill="none" opacity="0.35"/>

        {/* X shape - top-right to bottom-left strokes */}
        <path d="M85 15 Q50 45 15 85" stroke="hsl(175, 70%, 50%)" strokeWidth="2.5" fill="none" opacity="0.9"/>
        <path d="M88 18 Q52 46 18 88" stroke="hsl(175, 70%, 50%)" strokeWidth="1.5" fill="none" opacity="0.6"/>
        <path d="M82 12 Q48 44 12 82" stroke="hsl(175, 70%, 50%)" strokeWidth="1.5" fill="none" opacity="0.6"/>
        <path d="M91 21 Q54 47 21 91" stroke="hsl(175, 70%, 50%)" strokeWidth="1" fill="none" opacity="0.35"/>
        <path d="M79 9 Q46 43 9 79" stroke="hsl(175, 70%, 50%)" strokeWidth="1" fill="none" opacity="0.35"/>

        {/* Circuit dots at endpoints */}
        <circle cx="15" cy="15" r="3" fill="hsl(175, 70%, 50%)" opacity="0.9"/>
        <circle cx="85" cy="15" r="3" fill="hsl(175, 70%, 50%)" opacity="0.9"/>
        <circle cx="15" cy="85" r="3" fill="hsl(175, 70%, 50%)" opacity="0.9"/>
        <circle cx="85" cy="85" r="3" fill="hsl(175, 70%, 50%)" opacity="0.9"/>
        <circle cx="9" cy="21" r="2" fill="hsl(175, 70%, 50%)" opacity="0.5"/>
        <circle cx="91" cy="21" r="2" fill="hsl(175, 70%, 50%)" opacity="0.5"/>
        <circle cx="9" cy="79" r="2" fill="hsl(175, 70%, 50%)" opacity="0.5"/>
        <circle cx="91" cy="79" r="2" fill="hsl(175, 70%, 50%)" opacity="0.5"/>
        <circle cx="21" cy="9" r="2" fill="hsl(175, 70%, 50%)" opacity="0.5"/>
        <circle cx="79" cy="9" r="2" fill="hsl(175, 70%, 50%)" opacity="0.5"/>
        <circle cx="21" cy="91" r="2" fill="hsl(175, 70%, 50%)" opacity="0.5"/>
        <circle cx="79" cy="91" r="2" fill="hsl(175, 70%, 50%)" opacity="0.5"/>

        {/* Atom icon at top center */}
        <circle cx="50" cy="22" r="2" fill="white" opacity="0.9"/>
        <ellipse cx="50" cy="22" rx="7" ry="3" stroke="white" strokeWidth="0.8" fill="none" opacity="0.7"/>
        <ellipse cx="50" cy="22" rx="7" ry="3" stroke="white" strokeWidth="0.8" fill="none" opacity="0.7" transform="rotate(60 50 22)"/>
        <ellipse cx="50" cy="22" rx="7" ry="3" stroke="white" strokeWidth="0.8" fill="none" opacity="0.7" transform="rotate(-60 50 22)"/>

        {/* Brain icon at bottom center */}
        <path d="M44 75 Q44 70 47 68 Q50 66 50 70 Q50 66 53 68 Q56 70 56 75 Q56 79 50 80 Q44 79 44 75Z" stroke="white" strokeWidth="1" fill="none" opacity="0.8"/>
        <path d="M50 68 L50 80" stroke="white" strokeWidth="0.7" opacity="0.5"/>
        <path d="M46 72 Q48 71 50 72 Q52 71 54 72" stroke="white" strokeWidth="0.6" fill="none" opacity="0.5"/>

        {/* Center glow */}
        <circle cx="50" cy="50" r="4" fill="hsl(175, 70%, 50%)" opacity="0.3"/>
        <circle cx="50" cy="50" r="2" fill="hsl(175, 90%, 70%)" opacity="0.6"/>
      </svg>

      {/* Text block */}
      <div className="flex flex-col leading-none">
        <span
          className={`${s.title} font-extrabold tracking-widest`}
        >
          <span className="text-[hsl(175,70%,50%)]">A.</span>
          <span className="text-white">X.I.O.</span>
        </span>
        <span className={`${s.subtitle} font-medium tracking-wider text-white/60 mt-1`}>
          Análise do Fator X do Inconsciente de Origem
        </span>
      </div>
    </div>
  );
};

export default AxioLogo;
