import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, Mail, Building, Briefcase, Clock, Shield, ClipboardList, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";

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

// Mock user roles data - in real app this would come from API
const mockUserRoles = [
  {
    id: "ROLE-1001",
    user: "John Smith",
    partNumber: "IPA-SG-99.9",
    plantId: "PLT-001",
    createdAt: "2024-01-10T09:00:00Z",
  },
  {
    id: "ROLE-1002",
    user: "John Smith", 
    partNumber: "ACE-EG-99.5",
    plantId: "PLT-002",
    createdAt: "2024-01-08T14:30:00Z",
  },
  {
    id: "ROLE-1003",
    user: "John Smith",
    partNumber: "MET-AL-98.7", 
    plantId: "PLT-003",
    createdAt: "2024-01-05T11:15:00Z",
  }
];

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

  const handleDeleteRole = (roleId: string) => {
    // Handle role deletion - in real app this would call an API
    console.log(`Deleting role ${roleId}`);
  };

  const handleViewRequests = (partNumber: string, plantId: string, userId: string) => {
    // Navigate to requests page with filters
    window.open(`/requests?partNumber=${partNumber}&plantId=${plantId}&userId=${userId}`, '_blank');
  };

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

      {/* User Summary Table */}
      <Card className="enterprise-card">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <p className="text-muted-foreground">{user.title}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableHead className="font-medium w-48">Email</TableHead>
                <TableCell>{user.email}</TableCell>
                <TableHead className="font-medium w-48">Department</TableHead>
                <TableCell>{user.department}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="font-medium">Role</TableHead>
                <TableCell>
                  <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className="text-xs">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableHead className="font-medium">Status</TableHead>
                <TableCell>
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                    {user.status.toUpperCase()}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="font-medium">Phone</TableHead>
                <TableCell>{user.phone}</TableCell>
                <TableHead className="font-medium">Location</TableHead>
                <TableCell>{user.location}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="font-medium">Manager</TableHead>
                <TableCell>{user.manager}</TableCell>
                <TableHead className="font-medium">Account Created</TableHead>
                <TableCell>{formatDate(user.created_at)}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="font-medium">Last Login</TableHead>
                <TableCell>{formatDateTime(user.last_login)}</TableCell>
                <TableHead className="font-medium"></TableHead>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Roles Table */}
      <Card className="enterprise-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role ID</TableHead>
                <TableHead>Part Number</TableHead>
                <TableHead>Plant ID</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUserRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.id}</TableCell>
                  <TableCell>{role.partNumber}</TableCell>
                  <TableCell>{role.plantId}</TableCell>
                  <TableCell>{formatDate(role.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleViewRequests(role.partNumber, role.plantId, user.id)}
                        title="View requests"
                      >
                        <ClipboardList className="h-4 w-4" />
                      </Button>
                      <Link to={`/roles/${role.id}/edit`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Edit role">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <ConfirmationDialog
                        title="Delete Role"
                        description={`Are you sure you want to delete role ${role.id}? This action cannot be undone.`}
                        onConfirm={() => handleDeleteRole(role.id)}
                        triggerButton={
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Delete role">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* SSO Notice */}
      <Card className="enterprise-card">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Login is managed by Microsoft - Company SSO</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}