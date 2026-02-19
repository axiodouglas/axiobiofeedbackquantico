import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import bookPoderSubconsciente from "@/assets/book-poder-subconsciente.jpg";

const RecommendedBooks = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background noise">
      <nav className="sticky top-0 z-20 py-3 bg-black/80 backdrop-blur-md border-b border-primary/5">
        <div className="container mx-auto px-4 sm:px-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold text-foreground">Livros Indicados</h1>
        </div>
      </nav>

      <div className="container mx-auto px-5 sm:px-8 py-10 max-w-2xl">
        <div className="rounded-2xl border border-white/[0.06] bg-card/60 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.2)] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img
              src={bookPoderSubconsciente}
              alt="O Poder do Subconsciente - Dr. Joseph Murphy"
              className="w-32 h-auto rounded-lg shadow-lg shrink-0"
              draggable={false}
            />
            <div className="flex flex-col gap-3 text-center sm:text-left">
              <div>
                <h2 className="font-semibold text-foreground text-lg">O Poder do Subconsciente</h2>
                <p className="text-sm text-muted-foreground">Dr. Joseph Murphy</p>
              </div>
              <p className="text-sm text-foreground/70 leading-relaxed">
                Um clássico atemporal que revela como utilizar o poder da mente subconsciente para transformar sua vida. 
                Murphy ensina técnicas práticas para reprogramar crenças limitantes e alcançar saúde, prosperidade e paz interior.
              </p>
              <Button
                variant="cyanOutline"
                size="sm"
                className="self-center sm:self-start text-xs h-8 px-4 opacity-80 hover:opacity-100"
                onClick={() => window.open("#", "_blank")}
              >
                <ExternalLink className="h-3 w-3" />
                Adquirir Livro
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendedBooks;
