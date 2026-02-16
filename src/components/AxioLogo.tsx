import axioIcon from "@/assets/axio-icon.png";

interface AxioLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { icon: 81, title: "text-xl", subtitle: "text-[9px]", gap: "gap-2.5" },
  md: { icon: 108, title: "text-3xl", subtitle: "text-[11px]", gap: "gap-3" },
  lg: { icon: 144, title: "text-4xl", subtitle: "text-sm", gap: "gap-4" },
};

const AxioLogo = ({ className = "", size = "md" }: AxioLogoProps) => {
  const s = sizes[size];

  return (
    <div className={`flex items-center ${s.gap} select-none ${className}`}>
      <img
        src={axioIcon}
        alt="A.X.I.O. ícone"
        width={s.icon}
        height={s.icon}
        className="shrink-0 object-contain"
        style={{ background: "transparent" }}
        draggable={false}
      />

      <div className="flex flex-col leading-none">
        <span className={`${s.title} font-extrabold tracking-widest`}>
          <span className="text-primary">A.</span>
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
