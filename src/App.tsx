import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Recording from "./pages/Recording";
import Processing from "./pages/Processing";
import Report from "./pages/Report";
import Checkout from "./pages/Checkout";
import AreaSelection from "./pages/AreaSelection";
import HowItWorks from "./pages/HowItWorks";
import Community from "./pages/Community";
import Terms from "./pages/Terms";
import Profile from "./pages/Profile";
import DiagnosisDetail from "./pages/DiagnosisDetail";
import MeditationStructure from "./pages/MeditationStructure";
import MyReports from "./pages/MyReports";
import ReportsByDate from "./pages/ReportsByDate";
import Oracle from "./pages/Oracle";
import FAQ from "./pages/FAQ";
import Plans from "./pages/Plans";
import VendaOficial from "./pages/VendaOficial";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ErrorBoundary>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/recording" element={<ProtectedRoute><Recording /></ProtectedRoute>} />
              <Route path="/processing" element={<Processing />} />
              <Route path="/report" element={<Report />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/area-selection" element={<AreaSelection />} />
              <Route path="/como-funciona" element={<HowItWorks />} />
              <Route path="/community" element={
                <ProtectedRoute requirePremium>
                  <Community />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={<Profile />} />
              <Route path="/diagnosis/:id" element={<DiagnosisDetail />} />
              <Route path="/meus-relatorios" element={<MyReports />} />
              <Route path="/meus-relatorios/:date" element={<ReportsByDate />} />
              <Route path="/meditation-structure" element={<MeditationStructure />} />
              <Route path="/oraculo" element={<Oracle />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/planos" element={<Plans />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/venda-oficial" element={<VendaOficial />} />
              <Route path="/admin" element={<Admin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
