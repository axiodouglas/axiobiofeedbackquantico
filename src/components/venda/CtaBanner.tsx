import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CtaBannerProps {
  text: string;
}

const CtaBanner = ({ text }: CtaBannerProps) => (
  <section className="relative z-10 py-10 px-4">
    <div className="max-w-2xl mx-auto text-center space-y-5">
      <p className="text-lg sm:text-xl font-bold text-foreground">{text}</p>
      <Button variant="premium" size="xl" className="text-sm sm:text-base md:text-lg px-6 sm:px-10 py-5 sm:py-6 rounded-2xl" asChild>
        <a href="https://axiobiofeedbackquantico.lovable.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          BAIXAR APP AGORA
        </a>
      </Button>
    </div>
  </section>
);

export default CtaBanner;
