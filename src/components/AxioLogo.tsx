import axioLogoX from "@/assets/axio-logo-x.png";

interface AxioLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { icon: 48, title: "text-lg", subtitle: "text-[8px]", gap: "gap-2" },
  md: { icon: 64, title: "text-2xl", subtitle: "text-[10px]", gap: "gap-2.5" },
  lg: { icon: 96, title: "text-3xl", subtitle: "text-xs", gap: "gap-3" },
};

const AxioLogo = ({ className = "", size = "md" }: AxioLogoProps) => {
  const s = sizes[size];

  return (
    <div className={`flex items-center ${s.gap} select-none ${className}`}>
      <img
        src={axioLogoX}
        alt="A.X.I.O. ícone"
        width={s.icon}
        height={s.icon}
        className="shrink-0 object-contain"
        draggable={false}
      />

      <div className="flex flex-col leading-none">
        <span className={`${s.title} font-extrabold tracking-widest`}>
          <span className="text-gradient-brand">A.</span>
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
