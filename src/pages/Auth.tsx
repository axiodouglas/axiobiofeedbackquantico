import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Mail, Lock, User, ArrowLeft, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import neuralWavesCyan from "@/assets/neural-waves-cyan.png";

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    if (isLogin) {
      const { error: err } = await signIn(email, password);
      if (err) {
        setError(err);
      } else {
        navigate("/");
      }
    } else {
      const { error: err } = await signUp(email, password, fullName);
      if (err) {
        setError(err);
      } else {
        setSuccessMessage("Cadastro realizado! Verifique seu e-mail para confirmar sua conta.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background noise flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 py-4">
        <div className="container mx-auto px-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="relative w-20 h-20 mx-auto mb-4 overflow-hidden rounded-2xl">
              <img src={neuralWavesCyan} alt="" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center bg-card/60">
                <Brain className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {isLogin ? "Entrar no" : "Criar conta no"}{" "}
              <span className="text-gradient-cyan">A.X.I.O.</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {isLogin
                ? "Acesse seus diagnósticos e conteúdos Premium"
                : "Crie sua conta para salvar seus diagnósticos"}
            </p>
          </div>

          {/* Form */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 bg-secondary/50 border-border"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-secondary/50 border-border"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Senha (mínimo 6 caracteres)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

              {successMessage && (
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-primary">{successMessage}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="cyan"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 animate-spin" />
                    {isLogin ? "Entrando..." : "Criando conta..."}
                  </span>
                ) : isLogin ? "Entrar" : "Criar Conta"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isLogin ? (
                  <>Não tem conta? <span className="text-primary font-medium">Cadastre-se</span></>
                ) : (
                  <>Já tem conta? <span className="text-primary font-medium">Entre aqui</span></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
