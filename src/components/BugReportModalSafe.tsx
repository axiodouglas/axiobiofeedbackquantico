import { Component, type ReactNode } from "react";
import BugReportModal from "@/components/BugReportModal";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface State {
  hasError: boolean;
}

class BugReportErrorBoundary extends Component<Props & { children: ReactNode }, State> {
  constructor(props: Props & { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // Close modal on error instead of showing diagnosis screen
    this.props.onOpenChange(false);
    this.setState({ hasError: false });
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export default function BugReportModalSafe({ open, onOpenChange }: Props) {
  return (
    <BugReportErrorBoundary open={open} onOpenChange={onOpenChange}>
      <BugReportModal open={open} onOpenChange={onOpenChange} />
    </BugReportErrorBoundary>
  );
}
