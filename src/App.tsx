import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Requests } from "./pages/Requests";
import { RequestDetail } from "./pages/RequestDetail";
import { Detail_2 } from "./pages/Detail_2";
import { Approval } from "./pages/Approval";
import { Templates } from "./pages/Templates";
import { Layout } from "./components/Layout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Login page as landing page */}
          <Route path="/" element={<Login />} />
          
          {/* Protected routes with layout */}
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
          </Route>
          
          <Route path="/requests" element={<Layout />}>
            <Route index element={<Requests />} />
            <Route path=":id" element={<RequestDetail />} />
            <Route path=":id/detail2" element={<Detail_2 />} />
            <Route path=":id/approval" element={<Approval />} />
          </Route>
          
          <Route path="/templates" element={<Layout />}>
            <Route index element={<Templates />} />
          </Route>
          
          {/* Redirect /login to root */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
