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
          As crenças limitantes são uma das maiores travas no processo de autoconhecimento. Eu sei disso porque também
          passei por dificuldades intensas — foram{" "}
          <span className="text-primary font-medium">8 anos de constantes crises de pânico</span>,
          enfrentando crenças que pareciam impossíveis de superar.
        </p>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Descobri que{" "}
          <span className="text-primary font-medium">
            nossas crenças limitantes são a raiz de tudo que trava nossas vidas
          </span>{" "}
          — elas moldam nossos relacionamentos, saúde e prosperidade. Com a evolução da inteligência artificial, vi a 
          oportunidade de unir o que me ajudou com meu conhecimento e vivência de cura.
        </p>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Foi assim que criei o A.X.I.O. — e a grande inovação do método:{" "}
          <span className="text-primary font-medium">
            a meditação gravada com a sua própria voz
          </span>. O subconsciente reconhece e obedece a voz do seu dono. Quando você grava os comandos de reprogramação 
          e ouve em loop enquanto dorme, está falando diretamente com a parte mais profunda da sua mente. 
          Foi essa técnica, aliada à análise de voz por IA, que me ajudou a me curar de vários traumas e 
          acalmar minha mente depois de anos de sofrimento.
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
