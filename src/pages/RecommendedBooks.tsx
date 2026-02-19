import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import bookPoderSubconsciente from "@/assets/book-poder-subconsciente.jpg";
import bookCureSe from "@/assets/book-cure-se.webp";
import bookVocePlacebo from "@/assets/book-voce-e-o-placebo.jpeg";

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

      <div className="container mx-auto px-5 sm:px-8 py-10 max-w-2xl flex flex-col gap-4">
        {/* Livro 1 */}
        <div className="rounded-2xl border border-white/[0.06] bg-card/60 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.2)] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img src={bookPoderSubconsciente} alt="O Poder do Subconsciente" className="w-28 h-auto rounded-lg shadow-lg shrink-0" draggable={false} />
            <div className="flex flex-col gap-3 text-center sm:text-left">
              <div>
                <h2 className="font-semibold text-foreground text-lg">O Poder do Subconsciente</h2>
                <p className="text-sm text-muted-foreground">Dr. Joseph Murphy</p>
              </div>
              <p className="text-sm text-foreground/70 leading-relaxed">
                Um clássico atemporal que revela como utilizar o poder da mente subconsciente para transformar sua vida. 
                Murphy ensina técnicas práticas para reprogramar crenças limitantes e alcançar saúde, prosperidade e paz interior.
              </p>
              <Button variant="cyanOutline" size="sm" className="self-center sm:self-start text-xs h-8 px-4 opacity-80 hover:opacity-100" onClick={() => window.open("#", "_blank")}>
                <ExternalLink className="h-3 w-3" />
                Adquirir Livro
              </Button>
            </div>
          </div>
        </div>

        {/* Livro 2 */}
        <div className="rounded-2xl border border-white/[0.06] bg-card/60 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.2)] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img src={bookCureSe} alt="Cure-se a Si Próprio" className="w-28 h-auto rounded-lg shadow-lg shrink-0" draggable={false} />
            <div className="flex flex-col gap-3 text-center sm:text-left">
              <div>
                <h2 className="font-semibold text-foreground text-lg">Cure-se a Si Próprio</h2>
                <p className="text-sm text-muted-foreground">Dr. Joe Dispenza</p>
              </div>
              <p className="text-sm text-foreground/70 leading-relaxed">
                Descubra como usar a mente no processo curativo. Dispenza apresenta evidências científicas de que o pensamento 
                pode alterar a biologia do corpo, ensinando meditações e práticas para ativar a autocura.
              </p>
              <Button variant="cyanOutline" size="sm" className="self-center sm:self-start text-xs h-8 px-4 opacity-80 hover:opacity-100" onClick={() => window.open("#", "_blank")}>
                <ExternalLink className="h-3 w-3" />
                Adquirir Livro
              </Button>
            </div>
          </div>
        </div>

        {/* Livro 3 */}
        <div className="rounded-2xl border border-white/[0.06] bg-card/60 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.2)] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img src={bookVocePlacebo} alt="Você é o Placebo" className="w-28 h-auto rounded-lg shadow-lg shrink-0" draggable={false} />
            <div className="flex flex-col gap-3 text-center sm:text-left">
              <div>
                <h2 className="font-semibold text-foreground text-lg">Você é o Placebo</h2>
                <p className="text-sm text-muted-foreground">Dr. Joe Dispenza</p>
              </div>
              <p className="text-sm text-foreground/70 leading-relaxed">
                Explore o poder de curar a si mesmo através da transformação mental. Dispenza revela como mudanças no pensamento 
                e nas emoções podem reprogramar o corpo e criar uma nova realidade pessoal.
              </p>
              <Button variant="cyanOutline" size="sm" className="self-center sm:self-start text-xs h-8 px-4 opacity-80 hover:opacity-100" onClick={() => window.open("#", "_blank")}>
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
