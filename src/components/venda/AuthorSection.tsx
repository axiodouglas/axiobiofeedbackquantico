import { User, Sparkles, Music } from "lucide-react";

const AuthorSection = () => (
  <section className="relative z-10 py-10 sm:py-16 px-4 sm:px-6">
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 sm:px-5 py-1.5 sm:py-2 mb-4">
          <Music className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
          <span className="text-xs sm:text-sm font-semibold text-gradient-brand">O Autor &amp; A Inovação</span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground px-2">
          A história por trás do{" "}
          <span className="text-gradient-brand">Método A.X.I.O.</span>
        </h2>
      </div>

      <div className="card-glow rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Douglas</h3>
            <span className="text-xs text-muted-foreground">Criador do A.X.I.O.</span>
          </div>
        </div>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Eu sei o que é viver travado por crenças que parecem invisíveis. Durante{" "}
          <span className="text-primary font-medium">8 anos enfrentei crises de pânico constantes</span>,
          sem entender por que minha mente me sabotava em tudo — nos relacionamentos, na saúde e na prosperidade.
        </p>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Depois de muito estudo e vivência, entendi que{" "}
          <span className="text-primary font-medium">
            as crenças limitantes gravadas no subconsciente são a raiz de todos os bloqueios
          </span>. 
          Quando a inteligência artificial evoluiu, vi a chance de criar algo que unisse tecnologia com tudo que aprendi 
          no meu próprio processo de cura.
        </p>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Assim nasceu o A.X.I.O. — e com ele, a inovação que mudou minha vida:{" "}
          <span className="text-primary font-medium">
            a meditação gravada com a sua própria voz
          </span>. O subconsciente reconhece e obedece a voz do seu dono. Ao gravar os comandos de reprogramação 
          e ouvir em loop enquanto dorme, você fala diretamente com a parte mais profunda da sua mente. 
          Foi essa técnica, junto com a análise de voz por IA, que me permitiu curar traumas profundos 
          e finalmente encontrar paz depois de anos de sofrimento.
        </p>

        <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 mt-3">
          <p className="text-sm text-primary italic text-center leading-relaxed">
            "A voz é a impressão digital emocional. Quando você a usa como ferramenta de cura, o subconsciente não tem escolha senão obedecer."
            <span className="block text-xs text-primary/70 mt-1.5">— Douglas, Criador do A.X.I.O.</span>
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default AuthorSection;
