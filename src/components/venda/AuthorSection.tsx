import { User } from "lucide-react";

const AuthorSection = () => (
  <section className="relative z-10 py-10 sm:py-16 px-4 sm:px-6">
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground px-2">
          Por que o AXIO é inovador /{" "}
          <span className="text-gradient-brand">Conheça o Autor</span>
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
          As crenças são uma das maiores travas no processo de autoconhecimento. Eu sei disso porque também
          passei por dificuldades intensas — foram{" "}
          <span className="text-primary font-medium">8 anos de constantes crises de pânico</span>,
          enfrentando traumas e crenças que pareciam impossíveis de superar.
        </p>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Com a evolução da inteligência artificial, vi a oportunidade de unir o que me ajudou com meu
          conhecimento e vivência de cura de inúmeros traumas e crenças. Depois de muitos estudos, compreendi
          que nossa mente cria barreiras para acessar o subconsciente — e quanto mais traumas e crenças,
          mais bloqueios surgem.
        </p>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Descobri que{" "}
          <span className="text-primary font-medium">
            tudo parte do pai e da mãe, e se ramifica para relacionamentos e traumas
          </span>{" "}
          — esses são os pilares de tudo que trava nossas vidas. Foi assim que criei o A.X.I.O.: um app que
          ajuda você a se conhecer através das crenças e da meditação personalizada com sua própria voz.
        </p>
      </div>
    </div>
  </section>
);

export default AuthorSection;
