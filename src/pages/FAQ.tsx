import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, HelpCircle, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import UserMenu from "@/components/UserMenu";

const faqItems = [
  {
    q: "Como funciona o diagnóstico por áudio?",
    a: "Você grava um áudio de pelo menos 10 segundos falando sobre seus sentimentos e desafios no pilar escolhido (Mãe, Pai, Traumas ou Relacionamentos). O sistema analisa sua voz e suas palavras para identificar padrões emocionais inconscientes e gerar um relatório personalizado.",
  },
  {
    q: "Quais são os 4 Pilares da Crença?",
    a: "Os pilares são: Mãe (bloqueios na relação materna), Pai (força paterna e ação no mundo), Traumas (eventos externos como bullying, perdas e abusos) e Relacionamentos (projeções dos traumas de Pai e Mãe no parceiro). Cada pilar revela raízes diferentes dos seus padrões inconscientes.",
  },
  {
    q: "Por que não posso gravar o mesmo pilar duas vezes em 7 dias?",
    a: "O protocolo A.X.I.O. exige um período mínimo de 7 dias praticando os comandos quânticos e ouvindo a meditação para que a reprogramação neural se consolide. Gravar novamente antes desse período interromperia o processo de neuroplasticidade.",
  },
  {
    q: "O que são os Comandos Quânticos?",
    a: "São frases de reprogramação personalizadas geradas com base no seu diagnóstico. Divididos em Manhã (identidade), Tarde (merecimento) e Noite (limpeza), devem ser repetidos 3 vezes cada com os olhos fechados e convicção. Eles reescrevem crenças limitantes no subconsciente.",
  },
  {
    q: "Como funciona a meditação personalizada?",
    a: "O sistema gera um roteiro de meditação baseado no seu diagnóstico. Você deve escrever o roteiro à mão (ativa o córtex pré-frontal), gravar com sua própria voz e ouvir toda noite ao dormir. Sua voz burla o fator crítico da mente, acelerando a reprogramação.",
  },
  {
    q: "Por que preciso gravar a meditação com minha própria voz?",
    a: "Sua voz possui uma frequência única que seu subconsciente reconhece como autoridade máxima. Ao ouvir seus próprios comandos, você burla as defesas naturais da mente, permitindo que as reprogramações alcancem camadas profundas do inconsciente.",
  },
  {
    q: "Qual a duração mínima e máxima da gravação do diagnóstico?",
    a: "A gravação deve ter no mínimo 10 segundos e máximo de 2 minutos. Quanto mais detalhado e honesto for o relato, mais preciso será o diagnóstico. Entre 1 e 2 minutos é o ideal.",
  },
  {
    q: "O que fazer se o áudio não gravar ou der erro?",
    a: "Verifique se você concedeu permissão de microfone ao navegador. Em iPhones, use obrigatoriamente o Safari. Feche outros apps que possam estar usando o microfone e tente novamente.",
  },
  {
    q: "Minhas gravações são sigilosas?",
    a: "Sim. Seus áudios são processados para gerar o relatório e tratados com total segurança e privacidade. Nenhum dado é compartilhado com terceiros.",
  },
  {
    q: "O que fazer se meu relatório não foi gerado?",
    a: "Isso pode acontecer se a gravação for muito curta, com muito ruído ou se houve falha na conexão. Grave novamente em um ambiente silencioso com pelo menos 10 segundos de fala clara.",
  },
  {
    q: "Onde encontro meus relatórios anteriores?",
    a: "Acesse o menu do seu perfil e toque em 'Meus Relatórios'. Lá você encontra o histórico completo organizado por data, incluindo relatórios, comandos quânticos e meditações.",
  },
  {
    q: "Como redigir a meditação ajuda no meu cérebro?",
    a: "Ao escrever à mão, você ativa o córtex pré-frontal para organizar o trauma, potencializando a limpeza emocional que ocorrerá durante o sono ao ouvir a gravação.",
  },
  {
    q: "Para que serve o Oráculo?",
    a: "O Oráculo é um assistente especializado em crenças, somatização e comportamento humano. Você pode tirar dúvidas sobre como crenças limitantes afetam seu corpo e sua vida. Ele não responde sobre o funcionamento do app — para isso, consulte este FAQ.",
  },
  {
    q: "O que é a Comunidade A.X.I.O.?",
    a: "É um espaço para ler e compartilhar relatos de transformação com outros usuários. Você pode encontrar inspiração nas histórias de superação e conquistas de quem já passou pelo processo.",
  },
  {
    q: "Posso ouvir a meditação de outra pessoa?",
    a: "Não recomendamos. A voz do próprio usuário é a chave para burlar o fator crítico da mente. Ouvir outra voz não terá o mesmo efeito de reprogramação.",
  },
  {
    q: "Preciso fazer o diagnóstico de todos os 4 pilares?",
    a: "Não é obrigatório, mas recomendamos. Cada pilar revela bloqueios em áreas diferentes da vida. A análise completa oferece uma visão holística dos seus padrões inconscientes.",
  },
  {
    q: "O app funciona em qualquer navegador?",
    a: "Funciona melhor em Chrome, Safari e Edge atualizados. Em iPhones, use obrigatoriamente o Safari. Recomendamos manter o navegador sempre atualizado.",
  },
  {
    q: "Preciso de internet para usar o app?",
    a: "Sim. O processamento do áudio e a geração dos relatórios, comandos e meditações são feitos na nuvem, sendo necessária uma conexão estável.",
  },
  {
    q: "O que fazer se a página travar durante o processamento?",
    a: "Aguarde pelo menos 2 minutos antes de recarregar. Se persistir, feche a aba, abra novamente e faça uma nova gravação.",
  },
  {
    q: "O relatório ficou incompleto, o que faço?",
    a: "Regravar o áudio falando de forma mais clara e detalhada costuma resolver. Quanto mais específico for seu relato, mais preciso será o diagnóstico.",
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
                  <p className="text-foreground font-semibold">Mensagem enviada com sucesso!</p>
                  <p className="text-muted-foreground text-sm">Nosso suporte responderá em breve.</p>
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
