import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, HelpCircle, Send, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import UserMenu from "@/components/UserMenu";

const faqItems = [
  {
    q: "Por que o Método AXIO é diferente de outros apps?",
    a: "Porque usamos a sua própria voz para reprogramar o seu subconsciente, atacando a crença raiz identificada pelo nosso Biofeedback vocal.",
  },
  {
    q: "Como devo ouvir a meditação?",
    a: "O protocolo AXIO foi desenhado para ser ouvido durante o sono em loop. Ao dormir, sua mente consciente relaxa, permitindo que a reprogramação penetre diretamente no subconsciente.",
  },
  {
    q: "Qual a importância de escrever a meditação à mão?",
    a: "A escrita ativa o Córtex Pré-Frontal, transformando o trauma emocional em uma informação lógica, o que potencializa a limpeza que ocorrerá enquanto você dorme.",
  },
  {
    q: "Posso gravar mais de um pilar no mesmo dia?",
    a: "O app é liberado, mas o ideal para resultados reais é gravar um pilar por vez e seguir o protocolo de 7 dias ouvindo a meditação todas as noites. Se você não seguir o protocolo e fizer de forma aleatória, os resultados ficam comprometidos e sob sua própria responsabilidade.",
  },
  {
    q: "Por que devo usar a minha própria voz?",
    a: "O seu subconsciente aceita a sua voz como uma ordem absoluta. Ouvir a si mesmo é a chave para a transformação real.",
  },
  {
    q: "O Oráculo AXIO pode me dar diagnósticos?",
    a: "O Oráculo complementa o seu relatório com base na PNL e Neurociência, ajudando você a entender a origem comportamental dos seus bloqueios.",
  },
  {
    q: "Como o app identifica bloqueios no meu áudio?",
    a: "Analisamos padrões de frequência e termos específicos que revelam onde a sua energia emocional está estagnada.",
  },
  {
    q: "Como deve ser a minha gravação de voz?",
    a: "O áudio é composto apenas pela sua voz. Ao gravar, fale de forma calma, pausada e relaxada. Não precisa ser perfeito, apenas leia o roteiro com tranquilidade. Sua mente reconhece sua voz como a maior autoridade que existe.",
  },
  {
    q: "O que sinto após as primeiras noites de loop?",
    a: "É comum sentir mais clareza mental e uma leveza emocional, pois o seu cérebro está substituindo caminhos neurais antigos por novos padrões de força.",
  },
  {
    q: "Como faço para assinar ou mudar meu plano?",
    a: "Você pode escolher ou alterar seu plano diretamente no menu 'Planos de Assinatura', localizado no ícone da coroa no menu superior. Lá você encontra as melhores opções de desconto.",
  },
];

const FAQ = () => {
  const navigate = useNavigate();
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportName, setSupportName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendSupport = async () => {
    if (!supportMessage.trim() || !supportEmail.trim()) return;
    setSending(true);
    try {
      const { error } = await supabase.functions.invoke("send-support-email", {
        body: {
          name: supportName.trim(),
          email: supportEmail.trim(),
          message: supportMessage.trim(),
        },
      });
      if (error) throw error;
      setSent(true);
      setSupportMessage("");
      setSupportName("");
      setSupportEmail("");
      setTimeout(() => { setSent(false); setSupportOpen(false); }, 4000);
    } catch {
      // silently fail
    } finally {
      setSending(false);
    }
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
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2.5 mb-5">
            <HelpCircle className="h-5 w-5 text-primary" />
            <span className="text-base font-bold text-primary">Perguntas Frequentes</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">FAQ do Método A.X.I.O.</h1>
          <p className="text-base text-foreground/70 mt-3 max-w-lg mx-auto leading-relaxed">Tudo o que você precisa saber sobre o sistema</p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqItems.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="bg-card border border-border rounded-xl px-5 data-[state=open]:border-primary/30"
            >
              <AccordionTrigger className="text-left text-foreground hover:no-underline text-base font-semibold leading-snug">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/75 text-sm leading-relaxed pt-1">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Support section at the bottom */}
        <div className="mt-8 text-center">
          {!supportOpen ? (
            <button
              onClick={() => setSupportOpen(true)}
              className="text-primary text-sm font-medium hover:underline"
            >
              Ainda ficou com dúvida? Mande uma mensagem para o suporte →
            </button>
          ) : (
            <div className="bg-card border border-primary/30 rounded-xl p-6 animate-fade-in text-left">
              {sent ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <CheckCircle className="h-10 w-10 text-primary" />
                  <p className="text-foreground font-semibold">Sua mensagem foi enviada!</p>
                  <p className="text-muted-foreground text-sm">Responderemos em breve.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-foreground mb-4">Fale com o Suporte</h3>
                  <div className="space-y-3">
                    <Input placeholder="Seu nome" value={supportName} onChange={(e) => setSupportName(e.target.value)} className="bg-background border-border" />
                    <Input type="email" placeholder="Seu e-mail" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} className="bg-background border-border" />
                    <Textarea placeholder="Descreva sua dúvida ou problema..." value={supportMessage} onChange={(e) => setSupportMessage(e.target.value)} className="bg-background border-border min-h-[100px]" rows={4} />
                    <div className="flex gap-3">
                      <Button variant="cyan" onClick={handleSendSupport} disabled={sending || !supportMessage.trim() || !supportEmail.trim()} className="gap-2">
                        <Send className="h-4 w-4" />
                        {sending ? "Enviando..." : "Enviar Mensagem"}
                      </Button>
                      <Button variant="ghost" onClick={() => setSupportOpen(false)}>Cancelar</Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
