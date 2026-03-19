import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import PlaceholderPage from "./pages/PlaceholderPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/trips" element={<ProtectedRoute><PlaceholderPage title="Trips" /></ProtectedRoute>} />
            <Route path="/drivers" element={<ProtectedRoute><PlaceholderPage title="Driver Management" /></ProtectedRoute>} />
            <Route path="/riders" element={<ProtectedRoute><PlaceholderPage title="Riders" /></ProtectedRoute>} />
            <Route path="/earnings" element={<ProtectedRoute><PlaceholderPage title="Earnings" /></ProtectedRoute>} />
            <Route path="/requests" element={<ProtectedRoute><PlaceholderPage title="Ride Requests" /></ProtectedRoute>} />
            <Route path="/documents" element={<ProtectedRoute><PlaceholderPage title="Document Verification" /></ProtectedRoute>} />
            <Route path="/live-map" element={<ProtectedRoute><PlaceholderPage title="Live Map" /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><PlaceholderPage title="Settings" /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
