import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users, Crown, DollarSign, FileText, ArrowLeft, Sparkles,
  AlertTriangle, Eye, Search, TrendingUp, BarChart3, Percent
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from "recharts";

interface ProfileRow {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  is_premium: boolean | null;
  subscription_type: string | null;
  subscription_expires_at: string | null;
  created_at: string;
}

const PLAN_PRICES: Record<string, number> = {
  monthly: 29.9, quarterly: 74.97, semiannual: 119.4,
  mensal: 29.9, trimestral: 74.97, semestral: 119.4,
};

const PLAN_LABELS: Record<string, string> = {
  monthly: "Mensal", quarterly: "Trimestral", semiannual: "Semestral",
  mensal: "Mensal", trimestral: "Trimestral", semestral: "Semestral",
};

const PLAN_TAG_COLORS: Record<string, string> = {
  Mensal: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  Trimestral: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  Semestral: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Gratuito: "bg-muted text-muted-foreground border-border",
};

const BAR_COLORS = ["hsl(199, 89%, 48%)", "hsl(263, 70%, 58%)", "hsl(160, 60%, 45%)"];

// Sparkline mini-component
const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} className="mx-auto mt-1.5 opacity-70">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
    </svg>
  );
};

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/"); return; }
    checkAdminAndLoad();
  }, [user, authLoading]);

  const checkAdminAndLoad = async () => {
    try {
      const { data: roleData } = await supabase
        .from("user_roles").select("role")
        .eq("user_id", user!.id).eq("role", "admin").single();
      if (!roleData) { navigate("/"); return; }
      setIsAdmin(true);
      await loadUsers();
    } catch { navigate("/"); }
  };

  const loadUsers = async () => {
    setLoading(true);
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users?action=list-users`,
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );
    const result = await res.json();
    setProfiles(result.profiles || []);
    setLoading(false);
  };

  const viewReport = async (userId: string) => {
    setReportLoading(true);
    setReportOpen(true);
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users?action=user-report&userId=${userId}`,
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );
    const result = await res.json();
    setSelectedReport(result.diagnosis);
    setReportLoading(false);
  };

  // ── Metrics ──
  const totalUsers = profiles.length;
  const premiumUsers = profiles.filter((p) => p.is_premium).length;
  const conversionRate = totalUsers > 0 ? ((premiumUsers / totalUsers) * 100).toFixed(1) : "0";
  const estimatedRevenue = profiles.reduce((sum, p) => {
    if (p.is_premium && p.subscription_type) return sum + (PLAN_PRICES[p.subscription_type] || 0);
    return sum;
  }, 0);

  const monthlyUsers = profiles.filter((p) => p.is_premium && ["monthly", "mensal"].includes(p.subscription_type || "")).length;
  const quarterlyUsers = profiles.filter((p) => p.is_premium && ["quarterly", "trimestral"].includes(p.subscription_type || "")).length;
  const semiannualUsers = profiles.filter((p) => p.is_premium && ["semiannual", "semestral"].includes(p.subscription_type || "")).length;

  // Fake sparkline data (trend simulation based on count)
  const sparkData = (base: number) => Array.from({ length: 7 }, (_, i) => Math.max(0, base - 7 + i + Math.round(Math.random() * 3)));

  // ── Charts data ──
  const planDistribution = [
    { name: "Mensal", value: monthlyUsers },
    { name: "Trimestral", value: quarterlyUsers },
    { name: "Semestral", value: semiannualUsers },
  ];

  const revenueOverMonth = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 30 }, (_, i) => {
      const day = new Date(now.getFullYear(), now.getMonth(), i + 1);
      const dayStr = format(day, "dd");
      const usersBeforeDay = profiles.filter(p => p.is_premium && new Date(p.created_at) <= day).length;
      const avgRevPerUser = totalUsers > 0 ? estimatedRevenue / Math.max(premiumUsers, 1) : 0;
      return { day: dayStr, receita: Math.round(usersBeforeDay * avgRevPerUser) };
    });
  }, [profiles]);

  // Expired but premium
  const expiredButPremium = profiles.filter((p) => {
    if (!p.is_premium || !p.subscription_expires_at) return false;
    return new Date(p.subscription_expires_at) < new Date();
  });

  // Filtered users
  const filteredProfiles = useMemo(() => {
    if (!searchQuery.trim()) return profiles;
    const q = searchQuery.toLowerCase();
    return profiles.filter(p => (p.email || "").toLowerCase().includes(q) || (p.full_name || "").toLowerCase().includes(q));
  }, [profiles, searchQuery]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-primary animate-pulse" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const getInitials = (email: string | null) => {
    if (!email) return "?";
    return email.substring(0, 2).toUpperCase();
  };

  const getPlanLabel = (p: ProfileRow) => {
    if (!p.is_premium) return "Gratuito";
    return PLAN_LABELS[p.subscription_type || ""] || p.subscription_type || "Premium";
  };

  const isActive = (p: ProfileRow) => {
    if (!p.is_premium) return false;
    if (!p.subscription_expires_at) return true;
    return new Date(p.subscription_expires_at) > new Date();
  };

  return (
    <div className="min-h-screen bg-[hsl(210,18%,5%)] text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[hsl(210,18%,5%)]/80 backdrop-blur-xl border-b border-border/50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-xl hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="text-xs text-muted-foreground">Painel analítico A.X.I.O.</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground rounded-xl"
          onClick={() => window.open("/venda-oficial", "_blank")}
        >
          <Eye className="h-4 w-4" />
          <span className="hidden sm:inline">Página de Vendas</span>
        </Button>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── Top Metrics Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Users, label: "Usuários Totais", value: totalUsers, spark: sparkData(totalUsers), color: "hsl(175, 70%, 50%)" },
            { icon: Crown, label: "Assinantes Premium", value: premiumUsers, spark: sparkData(premiumUsers), color: "hsl(263, 70%, 58%)" },
            { icon: DollarSign, label: "MRR", value: `R$ ${estimatedRevenue.toFixed(0)}`, spark: sparkData(Math.round(estimatedRevenue / 10)), color: "hsl(160, 60%, 45%)" },
            { icon: Percent, label: "Taxa de Conversão", value: `${conversionRate}%`, spark: sparkData(Number(conversionRate)), color: "hsl(199, 89%, 48%)" },
          ].map((m, i) => (
            <Card key={i} className="bg-[hsl(215,14%,9%)] border-0 rounded-xl shadow-lg hover:shadow-[0_0_30px_hsl(175,70%,50%,0.07)] transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg" style={{ background: `${m.color}15` }}>
                    <m.icon className="h-4 w-4" style={{ color: m.color }} />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">{m.label}</span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: m.color }}>
                  {m.value}
                </p>
                <Sparkline data={m.spark} color={m.color} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue Area Chart */}
          <Card className="lg:col-span-2 bg-[hsl(215,14%,9%)] border-0 rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Faturamento Estimado no Mês
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueOverMonth}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(175, 70%, 50%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(175, 70%, 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 10%, 15%)" />
                  <XAxis dataKey="day" tick={{ fill: "hsl(220, 8%, 45%)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(220, 8%, 45%)", fontSize: 10 }} axisLine={false} tickLine={false} width={45} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(215, 14%, 12%)", border: "1px solid hsl(220, 10%, 20%)",
                      borderRadius: 8, color: "hsl(180, 30%, 96%)", fontSize: 12,
                    }}
                    formatter={(v: number) => [`R$ ${v}`, "Receita"]}
                  />
                  <Area type="monotone" dataKey="receita" stroke="hsl(175, 70%, 50%)" strokeWidth={2} fill="url(#revenueGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Plan Distribution Bar Chart */}
          <Card className="bg-[hsl(215,14%,9%)] border-0 rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Distribuição de Planos
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={planDistribution} layout="vertical" barCategoryGap="28%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 10%, 15%)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "hsl(220, 8%, 45%)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" tick={{ fill: "hsl(220, 8%, 45%)", fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(215, 14%, 12%)", border: "1px solid hsl(220, 10%, 20%)",
                      borderRadius: 8, color: "hsl(180, 30%, 96%)", fontSize: 12,
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {planDistribution.map((_, i) => (
                      <Cell key={i} fill={BAR_COLORS[i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* ── Expired Plans Alert ── */}
        {expiredButPremium.length > 0 && (
          <Card className="bg-[hsl(0,50%,10%)] border border-destructive/20 rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                Planos Vencidos Não Bloqueados ({expiredButPremium.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pb-2">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-destructive/10 hover:bg-transparent">
                      <TableHead className="text-xs text-destructive/70">E-mail</TableHead>
                      <TableHead className="text-xs text-destructive/70">Plano</TableHead>
                      <TableHead className="text-xs text-destructive/70">Expirou em</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expiredButPremium.map((p) => (
                      <TableRow key={p.id} className="border-destructive/10 hover:bg-destructive/5">
                        <TableCell className="text-xs">{p.email || "—"}</TableCell>
                        <TableCell className="text-xs">{PLAN_LABELS[p.subscription_type || ""] || p.subscription_type || "—"}</TableCell>
                        <TableCell className="text-xs text-destructive">
                          {p.subscription_expires_at ? format(new Date(p.subscription_expires_at), "dd/MM/yy", { locale: ptBR }) : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Users Table ── */}
        <Card className="bg-[hsl(215,14%,9%)] border-0 rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
            <CardTitle className="text-base font-semibold">Usuários</CardTitle>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por e-mail..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-muted/40 border-0 rounded-lg text-sm placeholder:text-muted-foreground/60 focus-visible:ring-primary/40"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 pb-2">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/30 hover:bg-transparent">
                    <TableHead className="text-xs font-medium text-muted-foreground">Usuário</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Cadastro</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Plano</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles.map((p) => {
                    const planLabel = getPlanLabel(p);
                    const active = isActive(p);
                    return (
                      <TableRow key={p.id} className="border-border/20 hover:bg-muted/20 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                {getInitials(p.email)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm truncate max-w-[200px]">{p.email || "—"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {format(new Date(p.created_at), "dd/MM/yy", { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold ${PLAN_TAG_COLORS[planLabel] || PLAN_TAG_COLORS.Gratuito}`}>
                            {planLabel}
                          </span>
                        </TableCell>
                        <TableCell>
                          {p.is_premium ? (
                            <Badge className={`text-[10px] border ${active ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-red-500/15 text-red-400 border-red-500/30"}`}>
                              {active ? "Ativo" : "Inativo"}
                            </Badge>
                          ) : (
                            <Badge className="text-[10px] bg-muted text-muted-foreground border-border">
                              Free
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2.5 rounded-lg text-muted-foreground hover:text-primary gap-1.5"
                            onClick={() => viewReport(p.user_id)}
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline text-xs">Diagnósticos</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredProfiles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Nenhum usuário encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Dialog */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto bg-[hsl(215,14%,9%)] border-border/50 text-foreground rounded-xl">
          <DialogHeader>
            <DialogTitle>Último Relatório</DialogTitle>
          </DialogHeader>
          {reportLoading ? (
            <div className="flex justify-center py-8">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
          ) : selectedReport ? (
            <div className="space-y-3 text-sm">
              <p><strong>Área:</strong> {selectedReport.area}</p>
              <p><strong>Data:</strong> {format(new Date(selectedReport.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
              <p><strong>Score:</strong> {selectedReport.frequency_score}</p>
              {selectedReport.diagnosis_result && (
                <div className="bg-muted/30 rounded-xl p-3">
                  <pre className="whitespace-pre-wrap text-xs text-muted-foreground">
                    {typeof selectedReport.diagnosis_result === "string"
                      ? selectedReport.diagnosis_result
                      : JSON.stringify(selectedReport.diagnosis_result, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">Nenhum relatório encontrado para este usuário.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
