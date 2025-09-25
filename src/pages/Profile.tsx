import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  User, 
  Mail, 
  Building, 
  Briefcase, 
  Calendar,
  Shield,
  Info
} from "lucide-react";

// Mock user data - in real app this would come from authentication context
const currentUser = {
  name: "Admin User",
  email: "admin.user@entegris.com",
  title: "System Administrator", 
  department: "IT",
  role: "admin",
  last_login: "2024-01-15T10:30:00Z",
  created_at: "2023-06-15T09:00:00Z",
  status: "active"
};

export function Profile() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Your account information and settings
          </p>
        </div>
      </div>

      {/* SSO Notice */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Your login is managed by Microsoft - Company SSO. Profile information cannot be modified here.
        </AlertDescription>
      </Alert>

      {/* User Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>User Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-lg">{currentUser.name}</div>
                  <Badge variant={currentUser.status === 'active' ? 'default' : 'secondary'}>
                    {currentUser.status.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">{currentUser.email}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Title</div>
                    <div className="text-sm text-muted-foreground">{currentUser.title}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Department</div>
                    <div className="text-sm text-muted-foreground">{currentUser.department}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Role</div>
                    <div className="text-sm text-muted-foreground">
                      <Badge variant="outline">{currentUser.role.toUpperCase()}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Info */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Account Activity</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Last Login</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(currentUser.last_login)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Account Created</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(currentUser.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>System Access</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p>Your access to this system is managed through Microsoft Single Sign-On (SSO).</p>
            <p className="mt-2">
              For any account-related issues or access requests, please contact your IT administrator 
              or use your organization's standard IT support channels.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}