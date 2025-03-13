
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ExpenseProvider } from "./context/ExpenseContext";
import { AuthProvider, ProtectedRoute } from "./context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ExpensesPage from "./pages/ExpensesPage";
import AnalysisPage from "./pages/AnalysisPage";
import AuthPage from "./pages/AuthPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ExpenseProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth/sign-in" element={<AuthPage view="signIn" />} />
              <Route path="/auth/sign-up" element={<AuthPage view="signUp" />} />
              <Route path="/expenses" element={
                <ProtectedRoute>
                  <ExpensesPage />
                </ProtectedRoute>
              } />
              <Route path="/analysis" element={
                <ProtectedRoute>
                  <AnalysisPage />
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ExpenseProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
