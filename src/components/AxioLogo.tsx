interface AxioLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { icon: 36, title: "text-lg", subtitle: "text-[8px]" },
  md: { icon: 48, title: "text-2xl", subtitle: "text-[10px]" },
  lg: { icon: 64, title: "text-3xl", subtitle: "text-xs" },
};

const AxioLogo = ({ className = "", size = "md" }: AxioLogoProps) => {
  const s = sizes[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Stylized Icon - quantum/neural symbol */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-[0_0_12px_hsl(175,70%,50%,0.6)]"
      >
        {/* Outer ring */}
        <circle cx="32" cy="32" r="28" stroke="hsl(175, 70%, 50%)" strokeWidth="2" opacity="0.4" />
        {/* Inner ring */}
        <circle cx="32" cy="32" r="18" stroke="hsl(175, 70%, 50%)" strokeWidth="1.5" opacity="0.6" />
        {/* Core glow */}
        <circle cx="32" cy="32" r="6" fill="hsl(175, 70%, 50%)" opacity="0.9" />
        <circle cx="32" cy="32" r="3" fill="hsl(175, 90%, 70%)" />
        {/* Orbital paths */}
        <ellipse cx="32" cy="32" rx="28" ry="12" stroke="hsl(175, 70%, 50%)" strokeWidth="1" opacity="0.35" transform="rotate(45 32 32)" />
        <ellipse cx="32" cy="32" rx="28" ry="12" stroke="hsl(175, 70%, 50%)" strokeWidth="1" opacity="0.35" transform="rotate(-45 32 32)" />
        {/* Electron dots */}
        <circle cx="50" cy="18" r="2.5" fill="hsl(175, 70%, 50%)" opacity="0.8" />
        <circle cx="14" cy="46" r="2.5" fill="hsl(175, 70%, 50%)" opacity="0.8" />
        <circle cx="50" cy="46" r="2" fill="hsl(175, 70%, 50%)" opacity="0.5" />
        <circle cx="14" cy="18" r="2" fill="hsl(175, 70%, 50%)" opacity="0.5" />
      </svg>

      {/* Text block */}
      <div className="flex flex-col leading-none">
        <span
          className={`${s.title} font-extrabold tracking-widest bg-gradient-to-r from-[hsl(175,70%,50%)] to-[hsl(175,90%,70%)] bg-clip-text text-transparent drop-shadow-[0_0_8px_hsl(175,70%,50%,0.4)]`}
        >
          A.X.I.O.
        </span>
        <span className={`${s.subtitle} font-medium tracking-wider text-white/70 mt-0.5`}>
          Análise do Fator X do Inconsciente de Origem
        </span>
      </div>
    </div>
  );
};

export default AxioLogo;
