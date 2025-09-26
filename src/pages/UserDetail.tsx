import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, Mail, Building, Briefcase, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Mock user data - in real app this would come from API
const mockUserDetail = {
  id: "1",
  name: "John Smith",
  email: "john.smith@entegris.com",
  title: "Senior Engineer", 
  role: "ADMIN",
  department: "Engineering",
  last_login: "2024-01-15T10:30:00Z",
  status: "active",
  created_at: "2023-06-15T08:00:00Z",
  phone: "+1 (555) 123-4567",
  manager: "Jane Williams",
  location: "San Jose, CA"
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric", 
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

export function UserDetail() {
  const { id } = useParams();
  const user = mockUserDetail;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/users">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </Link>
      </div>

      {/* User Profile Card */}
      <Card className="enterprise-card">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <p className="text-muted-foreground">{user.title}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className="text-xs">
                  {user.role}
                </Badge>
                <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                  {user.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">{user.email}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="font-medium">{user.location}</div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Work Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Work Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Department</div>
                  <div className="font-medium">{user.department}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Manager</div>
                  <div className="font-medium">{user.manager}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Role</div>
                  <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className="text-xs">
                    {user.role}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* System Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">System Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Last Login</div>
                  <div className="font-medium">{formatDateTime(user.last_login)}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Account Created</div>
                  <div className="font-medium">{formatDate(user.created_at)}</div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* SSO Notice */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Login is managed by Microsoft - Company SSO</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}