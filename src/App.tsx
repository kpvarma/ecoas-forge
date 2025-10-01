import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import Dashboard from "./pages/dashboard/index";
import Requests from "./pages/requests/index";
import RequestDetailPage from "./pages/requests/show";
import { Approval } from "./pages/Approval";
import Templates from "./pages/templates/index";
import NewTemplate from "./pages/templates/new";
import EditTemplate from "./pages/templates/edit";
import Users from "./pages/users/index";
import {UserDetail} from "./pages/UserDetail";
import { Responsibilities } from "./pages/responsibilities";
import Profile from "./pages/profile/index";
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
            <Route path=":id/detail2" element={<RequestDetailPage />} />
            <Route path=":id/approval" element={<Approval />} />
          </Route>
          
          <Route path="/templates" element={<Layout />}>
            <Route index element={<Templates />} />
            <Route path="new" element={<NewTemplate />} />
            <Route path=":id/edit" element={<EditTemplate />} />
          </Route>

          <Route path="/users" element={<Layout />}>
            <Route index element={<Users />} />
            <Route path=":id" element={<UserDetail />} />
          </Route>

          <Route path="/responsibilities" element={<Layout />}>
            <Route index element={<Responsibilities />} />
          </Route>

          <Route path="/profile" element={<Layout />}>
            <Route index element={<Profile />} />
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
