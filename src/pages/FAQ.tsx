import { useNavigate } from "react-router-dom";
import { ArrowLeft, HelpCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import UserMenu from "@/components/UserMenu";

const faqItems = [
  {
    q: "Como o Oráculo sabe o que eu sinto?",
    a: "Ele utiliza algoritmos de Biofeedback que analisam a frequência da sua voz e as palavras usadas para identificar padrões no seu subconsciente.",
  },
  {
    q: "Posso trocar o tema da minha meditação no meio da semana?",
    a: "O protocolo AXIO recomenda focar em um único tema por 7 dias para garantir a neuroplasticidade, mas você pode iniciar um novo card a qualquer momento se sentir necessidade.",
  },
  {
    q: "O que significa 'Acesso Premium Liberado'?",
    a: "Significa que você tem acesso total aos cards de Pai, Traumas e ao Oráculo Quântico de forma ilimitada.",
  },
  {
    q: "Minhas gravações são sigilosas?",
    a: "Sim. Seus áudios são processados para gerar o relatório e criptografados para sua total segurança e privacidade.",
  },
  {
    q: "Como redigir a meditação ajuda no meu cérebro?",
    a: "Ao escrever à mão, você força o Córtex Pré-Frontal a organizar o trauma, o que potencializa a limpeza emocional que ocorrerá durante o sono.",
  },
  {
    q: "O que fazer se eu não conseguir segurar o ar por muito tempo na introdução?",
    a: "Respeite o limite do seu corpo. O vácuo pulmonar serve para silenciar a mente, mas o relaxamento é o objetivo principal. Segure apenas o quanto for confortável.",
  },
  {
    q: "Posso ouvir a meditação de outra pessoa?",
    a: "Não recomendamos. A voz do próprio usuário é a chave para burlar o fator crítico da mente. Ouvir outra voz não terá o mesmo efeito de reprogramação.",
  },
];

const FAQ = () => {
  const navigate = useNavigate();

  const handleSupport = () => {
    window.open("https://wa.me/5511999999999?text=Olá, preciso de ajuda com o app AXIO.", "_blank");
  };

  return (
    <div className="min-h-screen bg-background noise">
      <nav className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md py-3">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-1 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
          <UserMenu />
        </div>
      </nav>

      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 mb-4">
            <HelpCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Perguntas Frequentes</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">FAQ do Método A.X.I.O.</h1>
          <p className="text-muted-foreground mt-2">Tudo o que você precisa saber sobre o sistema</p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqItems.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="bg-card border border-border rounded-xl px-5 data-[state=open]:border-primary/30"
            >
              <AccordionTrigger className="text-left text-foreground hover:no-underline text-sm font-semibold">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Support CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-sm mb-4">Não encontrou o que procurava?</p>
          <Button variant="cyanOutline" size="lg" onClick={handleSupport} className="gap-2">
            <MessageCircle className="h-5 w-5" />
            Falar com Suporte Humano
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
