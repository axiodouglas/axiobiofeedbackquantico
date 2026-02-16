import axioIcon from "@/assets/axio-icon.png";

interface AxioLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { icon: "h-10", title: "text-xl", subtitle: "text-[9px]", gap: "gap-2.5" },
  md: { icon: "h-14", title: "text-3xl", subtitle: "text-[11px]", gap: "gap-3" },
  lg: { icon: "h-20", title: "text-4xl", subtitle: "text-sm", gap: "gap-4" },
};

const AxioLogo = ({ className = "", size = "md" }: AxioLogoProps) => {
  const s = sizes[size];

  return (
    <div className={`flex items-center ${s.gap} select-none ${className}`}>
      <img
        src={axioIcon}
        alt="A.X.I.O."
        className={`${s.icon} w-auto shrink-0 drop-shadow-[0_0_14px_hsl(175,70%,50%,0.5)]`}
      />
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
