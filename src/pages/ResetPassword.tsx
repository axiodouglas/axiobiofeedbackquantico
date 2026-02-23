import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Lock, ArrowLeft, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import neuralWavesCyan from "@/assets/neural-waves-cyan.png";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    // Listen for PASSWORD_RECOVERY event from the magic link
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    // Also check URL hash for recovery token
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (err) {
      setError("Erro ao atualizar a senha. Tente novamente.");
      return;
    }

    setSuccess(true);
    toast({
      title: "Senha atualizada!",
      description: "Sua senha foi redefinida com sucesso.",
    });

    setTimeout(() => navigate("/"), 2000);
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen bg-background noise flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-xl font-bold text-foreground mb-2">Link inválido ou expirado</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Este link de recuperação não é válido. Solicite um novo link na tela de login.
          </p>
          <Button variant="cyan" onClick={() => navigate("/auth")}>
            Ir para o Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background noise flex flex-col">
      <header className="border-b border-border bg-card/50 py-4">
        <div className="container mx-auto px-4">
          <Button variant="ghost" onClick={() => navigate("/auth")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Login
          </Button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="relative w-20 h-20 mx-auto mb-4 overflow-hidden rounded-2xl">
              <img src={neuralWavesCyan} alt="" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center bg-card/60">
                <Brain className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Redefinir <span className="text-gradient-cyan">Senha</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Digite sua nova senha abaixo
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            {success ? (
              <div className="text-center py-4">
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <p className="text-foreground font-medium">Senha atualizada com sucesso!</p>
                <p className="text-sm text-muted-foreground mt-2">Redirecionando...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Nova senha (mínimo 6 caracteres)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pl-10 bg-secondary/50 border-border"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Confirmar nova senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pl-10 bg-secondary/50 border-border"
                  />
                </div>

                {error && (
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <Button type="submit" variant="cyan" size="lg" className="w-full" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 animate-spin" />
                      Atualizando...
                    </span>
                  ) : "Salvar Nova Senha"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
