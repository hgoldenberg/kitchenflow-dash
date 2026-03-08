import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DemoProvider } from "@/context/DemoContext";
import { DemoGuideProvider } from "@/context/DemoGuideContext";
import AppLayout from "@/components/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import VentasPage from "@/pages/VentasPage";
import RecetasPage from "@/pages/RecetasPage";
import StockPage from "@/pages/StockPage";
import ComprasPage from "@/pages/ComprasPage";
import FacturasPage from "@/pages/FacturasPage";
import PresentacionPage from "@/pages/PresentacionPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// App root – v2
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/kitchenflow-dash">
        <DemoProvider>
          <DemoGuideProvider>
            <AppLayout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/ventas" element={<VentasPage />} />
                <Route path="/recetas" element={<RecetasPage />} />
                <Route path="/stock" element={<StockPage />} />
                <Route path="/compras" element={<ComprasPage />} />
                <Route path="/facturas" element={<FacturasPage />} />
                <Route path="/presentacion" element={<PresentacionPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </DemoGuideProvider>
        </DemoProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
