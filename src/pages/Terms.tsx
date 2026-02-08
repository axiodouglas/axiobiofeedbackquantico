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
          <h1 className="text-3xl font-bold text-foreground mb-8">Termos de Uso e Segurança de Dados</h1>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Aceitação dos Termos</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Ao utilizar o A.X.I.O. — Análise do Fator X do Inconsciente de Origem, você concorda com todos os termos e condições aqui descritos. O uso continuado da plataforma constitui aceitação integral destes termos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Natureza do Serviço</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              O A.X.I.O. é uma ferramenta de autoconhecimento e desenvolvimento pessoal baseada em inteligência artificial. Os diagnósticos e comandos de reprogramação gerados pela plataforma têm caráter exclusivamente informativo e educacional, <strong className="text-foreground">não substituindo tratamento médico, psicológico ou psiquiátrico profissional</strong>. O usuário reconhece que os resultados apresentados são interpretações algorítmicas e não constituem parecer clínico.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Armazenamento e Segurança de Dados</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Todos os dados pessoais, áudios e transcrições são processados e armazenados em infraestrutura de nuvem segura com banco de dados PostgreSQL criptografado. Os áudios são processados de forma anônima pela inteligência artificial e não são compartilhados com terceiros, em conformidade com a Lei Geral de Proteção de Dados (LGPD). O usuário pode solicitar a exclusão completa de seus dados a qualquer momento.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Isenção de Responsabilidade</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3">
              Ao aceitar estes termos, o usuário reconhece e concorda que o A.X.I.O. se isenta de qualquer responsabilidade civil ou criminal nos seguintes cenários:
            </p>
            <ul className="text-muted-foreground text-sm leading-relaxed list-disc pl-5 space-y-2">
              <li>Invasões cibernéticas (hacks) em larga escala que comprometam os provedores de infraestrutura de nuvem utilizados pela plataforma;</li>
              <li>Má custódia de senhas e credenciais de acesso pelo próprio usuário;</li>
              <li>Uso inadequado dos diagnósticos como substituto a orientação profissional de saúde.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Assinaturas e Pagamentos</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Os planos Premium (Mensal, Trimestral e Semestral) são cobrados de forma recorrente. Você pode cancelar a qualquer momento. O cancelamento encerra a cobrança no próximo ciclo, mantendo o acesso até o fim do período pago. Oferecemos garantia de 7 dias para todos os planos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Comunidade</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Ao publicar relatos na Comunidade de Elevação de Frequência, você se compromete a manter o respeito e a ética. Relatos ofensivos, falsos ou que violem a privacidade de terceiros serão removidos.
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
