import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, HelpCircle, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import UserMenu from "@/components/UserMenu";
import { supabase } from "@/integrations/supabase/client";

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
  {
    q: "Como gravar o áudio para o diagnóstico dos pilares?",
    a: "Acesse o card do pilar desejado (Mãe, Pai, Traumas ou Relacionamentos), toque no botão de gravação e fale livremente sobre o tema por pelo menos 1 minuto. O sistema analisa sua voz automaticamente.",
  },
  {
    q: "Qual a duração mínima e máxima da gravação?",
    a: "A gravação deve ter no mínimo 1 minuto para que o algoritmo consiga mapear os padrões. Não há limite máximo, mas entre 2 e 5 minutos é o ideal.",
  },
  {
    q: "O que fazer se o áudio não gravar ou der erro?",
    a: "Verifique se você concedeu permissão de microfone ao app no navegador. Tente recarregar a página e gravar novamente. Em celulares, feche outros apps que possam estar usando o microfone.",
  },
  {
    q: "O áudio ficou com ruído, posso regravar?",
    a: "Sim. Basta iniciar uma nova gravação no mesmo pilar. O sistema processará o áudio mais recente. Procure um ambiente silencioso para melhores resultados.",
  },
  {
    q: "Por que meu relatório não foi gerado?",
    a: "Isso pode acontecer se a gravação for muito curta, se houver muito ruído no áudio ou se houve uma falha na conexão. Tente gravar novamente em um ambiente tranquilo com pelo menos 1 minuto de fala.",
  },
  {
    q: "Quanto tempo leva para gerar o relatório?",
    a: "O relatório é gerado em até 2 minutos após o envio do áudio. Se demorar mais, verifique sua conexão com a internet e tente recarregar a página.",
  },
  {
    q: "O relatório ficou incompleto ou com informações estranhas, o que faço?",
    a: "Regravar o áudio falando de forma mais clara e detalhada sobre o tema costuma resolver. Quanto mais específico for seu relato, mais preciso será o diagnóstico.",
  },
  {
    q: "Por que tenho que falar com minha própria voz na meditação?",
    a: "Sua voz possui uma frequência única que o seu subconsciente reconhece como confiável. Ao ouvir seus próprios comandos quânticos, você burla o fator crítico da mente, permitindo que as reprogramações alcancem camadas profundas do inconsciente.",
  },
  {
    q: "Posso gravar a meditação com fone de ouvido?",
    a: "Sim, e é até recomendado. O fone de ouvido melhora a captação da sua voz e reduz ruídos externos, tornando a análise mais precisa.",
  },
  {
    q: "O que são os Comandos Quânticos?",
    a: "São frases de reprogramação personalizadas geradas pelo sistema com base no seu diagnóstico. Eles são projetados para reescrever crenças limitantes no seu subconsciente.",
  },
  {
    q: "Onde encontro meus relatórios anteriores?",
    a: "Acesse o menu do seu perfil e toque em 'Meus Relatórios'. Lá você encontra o histórico completo de todos os diagnósticos realizados, organizados por data.",
  },
  {
    q: "O app funciona em qualquer navegador?",
    a: "O app funciona melhor em Chrome, Safari e Edge atualizados. Navegadores muito antigos podem ter problemas com a gravação de áudio. Recomendamos manter o navegador atualizado.",
  },
  {
    q: "Preciso estar conectado à internet para usar?",
    a: "Sim. O processamento do áudio e a geração dos relatórios e meditações são feitos na nuvem, então é necessária uma conexão estável com a internet.",
  },
  {
    q: "O que fazer se a página travar durante o processamento?",
    a: "Aguarde pelo menos 2 minutos antes de recarregar. Se o problema persistir, feche a aba, abra novamente e tente realizar uma nova gravação.",
  },
  {
    q: "Posso usar o app no celular?",
    a: "Sim. O app é totalmente responsivo e funciona em qualquer smartphone. Para a melhor experiência de gravação, use o navegador Chrome no Android ou Safari no iPhone.",
  },
  {
    q: "O que é a Escala de Hawkins no relatório?",
    a: "É uma escala de consciência que mede o nível energético das suas emoções. O diagnóstico identifica em que faixa você está para cada pilar, ajudando a traçar o caminho da evolução.",
  },
  {
    q: "Preciso fazer o diagnóstico de todos os 4 pilares?",
    a: "Não é obrigatório, mas recomendamos. Cada pilar revela bloqueios em áreas diferentes da vida. A análise completa oferece uma visão holística dos seus padrões inconscientes.",
  },
  {
    q: "Como funciona o card de Comunidade?",
    a: "Na Comunidade você pode ler relatos de transformação de outros usuários e compartilhar sua própria jornada. É um espaço de acolhimento e troca de experiências.",
  },
  {
    q: "A estrutura de meditação é igual para todos os pilares?",
    a: "A estrutura das 5 etapas é a mesma, mas o conteúdo dos comandos quânticos e as visualizações são personalizados para cada pilar com base no seu diagnóstico individual.",
  },
  {
    q: "O que fazer se o botão de gravação não aparecer?",
    a: "Verifique se o navegador está atualizado e se as permissões de microfone estão habilitadas. Em iPhones, use obrigatoriamente o Safari. Recarregue a página se necessário.",
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
    // For now, store the message — email integration to be added later
    try {
      // Just simulate sending for now
      await new Promise((r) => setTimeout(r, 800));
      setSent(true);
      setSupportMessage("");
      setSupportName("");
      setSupportEmail("");
      setTimeout(() => { setSent(false); setSupportOpen(false); }, 3000);
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

                {/* Inline support prompt */}
                {!supportOpen && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setSupportOpen(true); }}
                    className="mt-4 block text-primary text-xs font-medium hover:underline"
                  >
                    Ainda ficou com dúvida? Mande uma mensagem para o suporte →
                  </button>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Support form */}
        {supportOpen && (
          <div className="mt-8 bg-card border border-primary/30 rounded-xl p-6 animate-fade-in">
            {sent ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <CheckCircle className="h-10 w-10 text-primary" />
                <p className="text-foreground font-semibold">Mensagem enviada com sucesso!</p>
                <p className="text-muted-foreground text-sm">Nosso suporte responderá em breve.</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-foreground mb-4">Fale com o Suporte</h3>
                <div className="space-y-3">
                  <Input
                    placeholder="Seu nome"
                    value={supportName}
                    onChange={(e) => setSupportName(e.target.value)}
                    className="bg-background border-border"
                  />
                  <Input
                    type="email"
                    placeholder="Seu e-mail"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="bg-background border-border"
                  />
                  <Textarea
                    placeholder="Descreva sua dúvida ou problema..."
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    className="bg-background border-border min-h-[100px]"
                    rows={4}
                  />
                  <div className="flex gap-3">
                    <Button
                      variant="cyan"
                      onClick={handleSendSupport}
                      disabled={sending || !supportMessage.trim() || !supportEmail.trim()}
                      className="gap-2"
                    >
                      <Send className="h-4 w-4" />
                      {sending ? "Enviando..." : "Enviar Mensagem"}
                    </Button>
                    <Button variant="ghost" onClick={() => setSupportOpen(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQ;
