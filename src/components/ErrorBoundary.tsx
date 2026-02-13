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
                Diagnóstico Interrompido
              </h2>
              <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                O áudio enviado não foi audível ou o assunto está fora do tema deste card.
                Para um diagnóstico preciso, grave novamente focando exclusivamente no assunto selecionado.
              </p>
              <Button variant="cyan" size="lg" onClick={this.handleReset}>
                Tentar Novamente
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
