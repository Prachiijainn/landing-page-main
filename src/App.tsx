import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Home from "./pages/Home";
import About from "./pages/About";
import Help from "./pages/Help";
import Events from "./pages/Events";
import Stories from "./pages/Stories";
import Join from "./pages/Join";
import Contact from "./pages/Contact";
import Projects from "./pages/Projects";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import GlobalToastDisplay from "./components/GlobalToastDisplay";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <GlobalToastDisplay />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
            <Route path="/events" element={<Events />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/join" element={<Join />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/login" element={<Login />} />

            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Analytics />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
