import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background noise">
      <header className="border-b border-border bg-card/50 py-4">
        <div className="container mx-auto px-4">
          <Button variant="ghost" onClick={() => navigate(-1 as any)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto prose prose-invert">
          <h1 className="text-3xl font-bold text-foreground mb-8">Termos e Obrigações</h1>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Aceitação dos Termos</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Ao utilizar o A.X.I.O. — Análise do Fator X do Inconsciente de Origem, você concorda com todos os termos e condições aqui descritos. O uso continuado da plataforma constitui aceitação integral destes termos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Descrição do Serviço</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              O A.X.I.O. é uma ferramenta de biofeedback quântico para autoconhecimento e desenvolvimento pessoal. Os diagnósticos e comandos de reprogramação não substituem tratamento médico, psicológico ou psiquiátrico profissional.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Assinaturas e Pagamentos</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Os planos Premium (Mensal, Trimestral e Semestral) são cobrados de forma recorrente. Você pode cancelar a qualquer momento. O cancelamento encerra a cobrança no próximo ciclo, mantendo o acesso até o fim do período pago.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Privacidade e Dados</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Seus áudios e dados de diagnóstico são criptografados e armazenados de forma segura. Não compartilhamos seus dados pessoais com terceiros. Você pode solicitar a exclusão de todos os seus dados a qualquer momento.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Comunidade</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Ao publicar relatos na Comunidade de Elevação de Frequência, você se compromete a manter o respeito e a ética. Relatos ofensivos, falsos ou que violem a privacidade de terceiros serão removidos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Garantia</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Oferecemos garantia de 7 dias para todos os planos. Se não estiver satisfeito, solicite o reembolso integral dentro deste período.
            </p>
          </section>

          <div className="text-center mt-12">
            <p className="text-xs text-muted-foreground">
              Última atualização: Fevereiro 2026 • © A.X.I.O. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
