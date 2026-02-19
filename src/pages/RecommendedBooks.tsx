import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import bookPoderSubconsciente from "@/assets/book-poder-subconsciente.jpg";
import bookCureSe from "@/assets/book-cure-se.webp";
import bookVocePlacebo from "@/assets/book-voce-e-o-placebo.jpeg";
import bookCorpoHolografico from "@/assets/book-corpo-holografico.jpg";

const books = [
  {
    image: bookPoderSubconsciente,
    title: "O Poder do Subconsciente",
    author: "Dr. Joseph Murphy",
    description: "Um clássico que revela como utilizar o poder da mente subconsciente para reprogramar crenças limitantes e alcançar saúde e prosperidade.",
    link: "https://amzn.to/4cCYLCP",
  },
  {
    image: bookCureSe,
    title: "Cure-se a Si Próprio",
    author: "Dr. Joe Dispenza",
    description: "Evidências científicas de que o pensamento pode alterar a biologia do corpo, com meditações e práticas para ativar a autocura.",
    link: "https://amzn.to/4tKuPeb",
  },
  {
    image: bookVocePlacebo,
    title: "Você é o Placebo",
    author: "Dr. Joe Dispenza",
    description: "Como mudanças no pensamento e nas emoções podem reprogramar o corpo e criar uma nova realidade pessoal.",
    link: "https://amzn.to/4tLuQyk",
  },
  {
    image: bookCorpoHolografico,
    title: "Corpo Holográfico",
    author: "Ruslan Haidar",
    description: "Segredos sobre purificação e consciência. A tecnologia divina do corpo e verdades ocultas sobre a purificação humana.",
    link: "https://amzn.to/40kXEAg",
  },
];
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

      <div className="container mx-auto px-4 sm:px-8 py-8 sm:py-10 max-w-4xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {books.map((book, i) => (
            <div key={i} className="rounded-2xl border border-white/[0.06] bg-card/60 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.2)] p-3 sm:p-5 flex flex-col items-center text-center gap-2 sm:gap-3">
              <img src={book.image} alt={book.title} className="w-20 sm:w-28 h-auto rounded-lg shadow-lg" draggable={false} />
              <div className="min-w-0">
                <h2 className="font-semibold text-foreground text-xs sm:text-sm leading-tight">{book.title}</h2>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{book.author}</p>
              </div>
              <p className="text-[10px] sm:text-xs text-foreground/70 leading-relaxed line-clamp-4">
                {book.description}
              </p>
              <Button variant="cyanOutline" size="sm" className="text-[10px] sm:text-xs h-7 sm:h-8 px-3 sm:px-4 opacity-80 hover:opacity-100 mt-auto" onClick={() => window.open(book.link, "_blank")}>
                <ExternalLink className="h-3 w-3" />
                Adquirir
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendedBooks;
