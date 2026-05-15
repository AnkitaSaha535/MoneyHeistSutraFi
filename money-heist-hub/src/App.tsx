import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HeistProvider, useHeist } from "@/context/HeistContext";
import HeistLayout from "@/components/HeistLayout";
import SplashPage from "@/pages/SplashPage";
import AuthPage from "@/pages/AuthPage";
import IntroPage from "@/pages/IntroPage";
import DashboardPage from "@/pages/DashboardPage";
import GalaxyPage from "@/pages/GalaxyPage";
import ArcadePage from "@/pages/ArcadePage";
import KnowledgePage from "@/pages/KnowledgePage";
import BooksPage from "@/pages/BooksPage";
import CAMSPage from "@/pages/CAMSPage";
import DownloadCAMSPage from "@/pages/DownloadCAMSPage";
import FIREPlannerPage from "@/pages/FIREPlannerPage";
import HealthScorePage from "@/pages/HealthScorePage";
import LifeEventPage from "@/pages/LifeEventPage";
import TaxWizardPage from "@/pages/TaxWizardPage";
import CouplePlannerPage from "@/pages/CouplePlannerPage";
import CalculatorsPage from "@/pages/CalculatorsPage";
import BankConnectPage from "@/pages/BankConnectPage";
import CreditSimulatorPage from "@/pages/CreditSimulatorPage";
import FraudAlertPage from "@/pages/FraudAlertPage";
import AIAdvisorPage from "@/pages/AIAdvisorPage";
import BorrowerDashboardPage from "@/pages/BorrowerDashboardPage";
import LenderDashboardPage from "@/pages/LenderDashboardPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { userData } = useHeist();

  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/intro" element={<IntroPage />} />
      <Route element={<HeistLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/galaxy" element={<GalaxyPage />} />
        <Route path="/arcade" element={<ArcadePage />} />
        <Route path="/knowledge" element={<KnowledgePage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/cams" element={<CAMSPage />} />
        <Route path="/download-cams" element={<DownloadCAMSPage />} />
        <Route path="/fire-planner" element={<FIREPlannerPage />} />
        <Route path="/health-score" element={<HealthScorePage />} />
        <Route path="/life-events" element={<LifeEventPage />} />
        <Route path="/tax-wizard" element={<TaxWizardPage />} />
        <Route path="/couple-planner" element={<CouplePlannerPage />} />
        <Route path="/calculators" element={<CalculatorsPage />} />
        <Route path="/bank-connect" element={<BankConnectPage />} />
        <Route path="/credit-simulator" element={<CreditSimulatorPage />} />
        <Route path="/fraud-alert" element={<FraudAlertPage />} />
        <Route path="/ai-advisor" element={<AIAdvisorPage />} />
        <Route path="/borrower-dashboard" element={<BorrowerDashboardPage />} />
        <Route path="/lender-dashboard" element={<LenderDashboardPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HeistProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </HeistProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
