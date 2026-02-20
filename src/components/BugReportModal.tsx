import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Send, X, ImagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface BugReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  { value: "relatorio", label: "Relatório AXIO" },
  { value: "meditacao", label: "Meditação da Semana" },
  { value: "comandos", label: "Comandos Quânticos" },
  { value: "outros", label: "Outros / Sugestão Geral" },
];

export default function BugReportModal({ open, onOpenChange }: BugReportModalProps) {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Imagem muito grande", description: "Máximo 5MB.", variant: "destructive" });
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setCategory("");
    setDescription("");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!category || !description.trim()) {
      toast({ title: "Preencha todos os campos", description: "Categoria e descrição são obrigatórios.", variant: "destructive" });
      return;
    }
    if (!user) {
      toast({ title: "Faça login para enviar", variant: "destructive" });
      return;
    }

    setSending(true);
    try {
      let imageUrl = "";

      if (imageFile) {
        // Upload image to storage
        const ext = imageFile.name.split(".").pop() || "png";
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("error-reports")
          .upload(path, imageFile, { contentType: imageFile.type });

        if (uploadError) throw uploadError;

        const { data: urlData, error: signedUrlError } = await supabase.storage
          .from("error-reports")
          .createSignedUrl(path, 60 * 60 * 24 * 30); // 30 days
        if (signedUrlError || !urlData?.signedUrl) throw signedUrlError || new Error("Failed to generate URL");
        imageUrl = urlData.signedUrl;
      }

      const categoryLabel = categories.find((c) => c.value === category)?.label || category;
      const userName = profile?.full_name || user.email?.split("@")[0] || "Usuário";

      // Send via edge function
      const { error } = await supabase.functions.invoke("send-support-email", {
        body: {
          name: userName,
          email: user.email,
          subject: `RELATO DE ERRO: ${categoryLabel}`,
          message: `Categoria: ${categoryLabel}\n\nDescrição:\n${description}${imageUrl ? `\n\nPrint do erro: ${imageUrl}` : ""}`,
        },
      });

      if (error) throw error;

      toast({ title: "Agradecemos sua sugestão", description: "Seu relato foi enviado com sucesso." });
      resetForm();
      onOpenChange(false);
    } catch (err: any) {
      toast({ title: "Erro ao enviar", description: err.message || "Tente novamente.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Relatar Erro ou Sugestão</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Ajude-nos a ser mais precisos. Se encontrou um erro no relatório ou tem uma sugestão, informe abaixo. Se for erro de contexto, o print é obrigatório.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Descreva o erro ou sua sugestão..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
            className="min-h-[100px] text-sm"
          />

          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            {!imagePreview ? (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center gap-1.5 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
              >
                <ImagePlus className="h-5 w-5" />
                <span className="text-xs font-medium">Anexar print do erro (opcional)</span>
              </button>
            ) : (
              <div className="relative rounded-lg overflow-hidden border border-border">
                <img src={imagePreview} alt="Preview" className="w-full max-h-40 object-contain bg-secondary/30" />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5 hover:bg-destructive/20 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          <Button
            variant="cyan"
            size="sm"
            className="w-full gap-1.5"
            onClick={handleSubmit}
            disabled={sending || !category || !description.trim()}
          >
            <Send className="h-3.5 w-3.5" />
            {sending ? "Enviando..." : "Enviar Relato"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
