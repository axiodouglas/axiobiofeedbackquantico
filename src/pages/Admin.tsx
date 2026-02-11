import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Crown, DollarSign, FileText, ArrowLeft, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
  monthly: 49.9,
  quarterly: 119.9,
  semiannual: 199.9,
};

const PLAN_LABELS: Record<string, string> = {
  monthly: "Mensal",
  quarterly: "Trimestral",
  semiannual: "Semestral",
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

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/");
      return;
    }
    checkAdminAndLoad();
  }, [user, authLoading]);

  const checkAdminAndLoad = async () => {
    try {
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .eq("role", "admin")
        .single();

      if (!roleData) {
        navigate("/");
        return;
      }
      setIsAdmin(true);
      await loadUsers();
    } catch {
      navigate("/");
    }
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

  const totalUsers = profiles.length;
  const premiumUsers = profiles.filter((p) => p.is_premium).length;
  const freeUsers = profiles.filter((p) => !p.is_premium).length;
  const monthlyUsers = profiles.filter((p) => p.is_premium && p.subscription_type === "monthly").length;
  const quarterlyUsers = profiles.filter((p) => p.is_premium && p.subscription_type === "quarterly").length;
  const semiannualUsers = profiles.filter((p) => p.is_premium && p.subscription_type === "semiannual").length;
  const estimatedRevenue = profiles.reduce((sum, p) => {
    if (p.is_premium && p.subscription_type) {
      return sum + (PLAN_PRICES[p.subscription_type] || 0);
    }
    return sum;
  }, 0);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-primary animate-pulse" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Painel Admin
        </h1>
      </div>

      <div className="max-w-5xl mx-auto p-4 space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">{totalUsers}</p>
              <p className="text-xs text-muted-foreground">Total Usuários</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <Crown className="h-6 w-6 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">{premiumUsers}</p>
              <p className="text-xs text-muted-foreground">Premium Ativos</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-6 w-6 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">
                R$ {estimatedRevenue.toFixed(0)}
              </p>
              <p className="text-xs text-muted-foreground">Faturamento Est.</p>
            </CardContent>
          </Card>
        </div>

        {/* Plan Distribution */}
        <div className="grid grid-cols-4 gap-3">
          <Card className="bg-card border-border">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-foreground">{freeUsers}</p>
              <p className="text-xs text-muted-foreground">Gratuito</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-foreground">{monthlyUsers}</p>
              <p className="text-xs text-muted-foreground">Mensal</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-foreground">{quarterlyUsers}</p>
              <p className="text-xs text-muted-foreground">Trimestral</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-foreground">{semiannualUsers}</p>
              <p className="text-xs text-muted-foreground">Semestral</p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Usuários</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">E-mail</TableHead>
                    <TableHead className="text-xs">Criado em</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs">Plano</TableHead>
                    <TableHead className="text-xs">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-xs max-w-[150px] truncate">
                        {p.email || "—"}
                      </TableCell>
                      <TableCell className="text-xs whitespace-nowrap">
                        {format(new Date(p.created_at), "dd/MM/yy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={p.is_premium ? "default" : "secondary"}
                          className="text-[10px]"
                        >
                          {p.is_premium ? "Premium" : "Free"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        {p.subscription_type
                          ? PLAN_LABELS[p.subscription_type] || p.subscription_type
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2"
                          onClick={() => viewReport(p.user_id)}
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Dialog */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto bg-card text-foreground">
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
                <div className="bg-muted rounded-lg p-3">
                  <pre className="whitespace-pre-wrap text-xs text-muted-foreground">
                    {typeof selectedReport.diagnosis_result === "string"
                      ? selectedReport.diagnosis_result
                      : JSON.stringify(selectedReport.diagnosis_result, null, 2)}
                  </pre>
                </div>
              )}
              {!selectedReport && <p className="text-muted-foreground">Nenhum relatório encontrado.</p>}
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
