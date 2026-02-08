import { Component, type ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // Silent catch — no console.error to avoid noisy logs
  }

  handleReset = () => {
    // Cleanup all diagnosis state
    sessionStorage.removeItem("axio_audio");
    sessionStorage.removeItem("axio_result");
    sessionStorage.removeItem("axio_area");
    sessionStorage.removeItem("axio_focus_error");
    this.setState({ hasError: false });
    window.location.href = "/area-selection";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background noise flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/20 flex items-center justify-center">
                <AlertCircle className="h-10 w-10 text-destructive" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-4">
                Análise não concluída
              </h2>
              <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                Ops! Algo não saiu como esperado. Por favor, tente gravar novamente
                focando apenas no tema deste card para que seu diagnóstico seja preciso.
              </p>
              <Button variant="cyan" size="lg" onClick={this.handleReset}>
                Voltar ao Início
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
