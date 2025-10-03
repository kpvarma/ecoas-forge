import { Outlet, NavLink, useLocation, Link } from "react-router-dom";
import { 
  Home, 
  FileText, 
  FolderOpen, 
  User,
  Shield,
  LogOut,
  Bell,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Requests", href: "/requests", icon: FileText },
  { name: "Templates", href: "/templates", icon: FolderOpen },
  { name: "Users", href: "/users", icon: User },
  { name: "Responsibilities", href: "/responsibilities", icon: Shield },
];

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <img src="/logo_white.svg" alt="eCoA logo" className="h-6 w-8" />
              </div>
              <h1 className="text-xl font-bold text-foreground">eCoA</h1>
            </div>
            
            <nav className="flex space-x-6">
              {navigation.map((item) => {
                const isActive = location.pathname.startsWith(item.href);
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-3 pl-4 border-l border-border">
              <Link to="/profile" className="flex items-center space-x-2 hover:text-primary transition-colors">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Admin User</span>
              </Link>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}