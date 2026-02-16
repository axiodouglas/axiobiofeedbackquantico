interface AxioLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { icon: 54, title: "text-xl", subtitle: "text-[9px]", gap: "gap-2.5" },
  md: { icon: 72, title: "text-3xl", subtitle: "text-[11px]", gap: "gap-3" },
  lg: { icon: 96, title: "text-4xl", subtitle: "text-sm", gap: "gap-4" },
};

const AxioLogo = ({ className = "", size = "md" }: AxioLogoProps) => {
  const s = sizes[size];
  const c = "hsl(175,70%,50%)";
  const cLight = "hsl(175,90%,70%)";

  return (
    <div className={`flex items-center ${s.gap} select-none ${className}`}>
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-[0_0_14px_hsl(175,70%,50%,0.5)]"
      >
        {/* === X shape: 4 arms made of parallel curved circuit lines === */}

        {/* Top-left arm (3 parallel lines curving inward) */}
        <path d="M10 10 Q30 30 55 50" stroke={c} strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M6 16 Q28 34 52 52" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7"/>
        <path d="M16 6 Q34 28 58 48" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7"/>
        <path d="M3 22 Q26 38 50 54" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/>
        <path d="M22 3 Q38 26 60 46" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/>

        {/* Top-right arm */}
        <path d="M110 10 Q90 30 65 50" stroke={c} strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M114 16 Q92 34 68 52" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7"/>
        <path d="M104 6 Q86 28 62 48" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7"/>
        <path d="M117 22 Q94 38 70 54" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/>
        <path d="M98 3 Q82 26 60 46" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/>

        {/* Bottom-left arm */}
        <path d="M10 110 Q30 90 55 70" stroke={c} strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M6 104 Q28 86 52 68" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7"/>
        <path d="M16 114 Q34 92 58 72" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7"/>
        <path d="M3 98 Q26 82 50 66" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/>
        <path d="M22 117 Q38 94 60 74" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/>

        {/* Bottom-right arm */}
        <path d="M110 110 Q90 90 65 70" stroke={c} strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M114 104 Q92 86 68 68" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7"/>
        <path d="M104 114 Q86 92 62 72" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7"/>
        <path d="M117 98 Q94 82 70 66" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/>
        <path d="M98 117 Q82 94 60 74" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/>

        {/* Circuit endpoint dots */}
        <circle cx="10" cy="10" r="3.5" fill={c}/>
        <circle cx="110" cy="10" r="3.5" fill={c}/>
        <circle cx="10" cy="110" r="3.5" fill={c}/>
        <circle cx="110" cy="110" r="3.5" fill={c}/>
        <circle cx="6" cy="16" r="2" fill={c} opacity="0.7"/>
        <circle cx="16" cy="6" r="2" fill={c} opacity="0.7"/>
        <circle cx="114" cy="16" r="2" fill={c} opacity="0.7"/>
        <circle cx="104" cy="6" r="2" fill={c} opacity="0.7"/>
        <circle cx="6" cy="104" r="2" fill={c} opacity="0.7"/>
        <circle cx="16" cy="114" r="2" fill={c} opacity="0.7"/>
        <circle cx="114" cy="104" r="2" fill={c} opacity="0.7"/>
        <circle cx="104" cy="114" r="2" fill={c} opacity="0.7"/>
        <circle cx="3" cy="22" r="1.5" fill={c} opacity="0.4"/>
        <circle cx="22" cy="3" r="1.5" fill={c} opacity="0.4"/>
        <circle cx="117" cy="22" r="1.5" fill={c} opacity="0.4"/>
        <circle cx="98" cy="3" r="1.5" fill={c} opacity="0.4"/>
        <circle cx="3" cy="98" r="1.5" fill={c} opacity="0.4"/>
        <circle cx="22" cy="117" r="1.5" fill={c} opacity="0.4"/>
        <circle cx="117" cy="98" r="1.5" fill={c} opacity="0.4"/>
        <circle cx="98" cy="117" r="1.5" fill={c} opacity="0.4"/>

        {/* Side circuit branches with dots */}
        <path d="M55 50 L40 50 L36 56" stroke={c} strokeWidth="1.5" fill="none" opacity="0.6"/>
        <circle cx="36" cy="56" r="2" fill={c} opacity="0.6"/>
        <path d="M65 50 L80 50 L84 56" stroke={c} strokeWidth="1.5" fill="none" opacity="0.6"/>
        <circle cx="84" cy="56" r="2" fill={c} opacity="0.6"/>
        <path d="M55 70 L40 70 L36 64" stroke={c} strokeWidth="1.5" fill="none" opacity="0.6"/>
        <circle cx="36" cy="64" r="2" fill={c} opacity="0.6"/>
        <path d="M65 70 L80 70 L84 64" stroke={c} strokeWidth="1.5" fill="none" opacity="0.6"/>
        <circle cx="84" cy="64" r="2" fill={c} opacity="0.6"/>

        {/* Atom symbol at top */}
        <circle cx="60" cy="26" r="2.5" fill="white" opacity="0.95"/>
        <ellipse cx="60" cy="26" rx="9" ry="3.5" stroke="white" strokeWidth="1" fill="none" opacity="0.8"/>
        <ellipse cx="60" cy="26" rx="9" ry="3.5" stroke="white" strokeWidth="1" fill="none" opacity="0.8" transform="rotate(60 60 26)"/>
        <ellipse cx="60" cy="26" rx="9" ry="3.5" stroke="white" strokeWidth="1" fill="none" opacity="0.8" transform="rotate(-60 60 26)"/>

        {/* Brain icon at center */}
        <path d="M54 56 Q52 54 52 58 Q50 56 50 60 Q48 58 49 62 Q48 64 50 65 Q50 67 52 67 Q54 68 56 67 L56 60 Q56 57 54 56Z" fill="white" opacity="0.85"/>
        <path d="M66 56 Q68 54 68 58 Q70 56 70 60 Q72 58 71 62 Q72 64 70 65 Q70 67 68 67 Q66 68 64 67 L64 60 Q64 57 66 56Z" fill="white" opacity="0.85"/>
        <line x1="60" y1="55" x2="60" y2="68" stroke="white" strokeWidth="1" opacity="0.6"/>
      </svg>

      {/* Text block */}
      <div className="flex flex-col leading-none">
        <span className={`${s.title} font-extrabold tracking-widest`}>
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
