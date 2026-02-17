import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CtaBannerProps {
  text: string;
}

const CtaBanner = ({ text }: CtaBannerProps) => (
  <section className="relative z-10 py-8 sm:py-10 px-4 sm:px-6">
    <div className="max-w-2xl mx-auto text-center space-y-4 sm:space-y-5">
      <p className="text-base sm:text-lg md:text-xl font-bold text-gradient-brand">{text}</p>
      <Button variant="premium" size="xl" className="text-xs sm:text-sm md:text-base px-5 sm:px-10 py-4 sm:py-6 rounded-xl sm:rounded-2xl w-full max-w-sm" asChild>
        <a href="https://axiobiofeedbackquantico.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
          <Download className="h-4 w-4 sm:h-5 sm:w-5" />
          BAIXAR APP AGORA
        </a>
      </Button>
    </div>
  </section>
);

export default CtaBanner;
