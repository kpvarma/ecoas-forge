import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, User, Mail, Building, Briefcase, Clock, Settings, Shield, Filter, X } from "lucide-react";

// Mock user data - in real app this would come from API
const mockUsers = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@entegris.com", 
    title: "Senior Engineer",
    role: "ADMIN",
    department: "Engineering",
    last_login: "2024-01-15T10:30:00Z",
    status: "active"
  },
  {
    id: "2", 
    name: "Sarah Johnson",
    email: "sarah.johnson@entegris.com",
    title: "Product Manager",
    role: "USER",
    department: "Product",
    last_login: "2024-01-14T15:45:00Z",
    status: "active"
  },
  {
    id: "3",
    name: "Mike Chen",
    email: "mike.chen@entegris.com", 
    title: "Quality Analyst",
    role: "USER",
    department: "Quality Assurance",
    last_login: "2024-01-13T09:15:00Z",
    status: "active"
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@entegris.com",
    title: "Operations Lead", 
    role: "ADMIN",
    department: "Operations",
    last_login: "2024-01-12T14:20:00Z",
    status: "inactive"
  },
  {
    id: "5",
    name: "Robert Wilson",
    email: "robert.wilson@entegris.com",
    title: "Research Scientist",
    role: "USER",
    department: "R&D",
    last_login: "2024-01-11T11:10:00Z", 
    status: "active"
  },
  {
    id: "6",
    name: "Lisa Anderson",
    email: "lisa.anderson@entegris.com",
    title: "Manufacturing Engineer",
    role: "USER",
    department: "Manufacturing",
    last_login: "2024-01-10T16:30:00Z",
    status: "active"
  },
  {
    id: "7",
    name: "David Brown",
    email: "david.brown@entegris.com", 
    title: "Supply Chain Manager",
    role: "ADMIN",
    department: "Supply Chain",
    last_login: "2024-01-09T08:45:00Z",
    status: "active"
  },
  {
    id: "8",
    name: "Jennifer Taylor",
    email: "jennifer.taylor@entegris.com",
    title: "Compliance Officer",
    role: "USER",
    department: "Compliance", 
    last_login: "2024-01-08T13:25:00Z",
    status: "active"
  },
  {
    id: "9",
    name: "Thomas Martinez",
    email: "thomas.martinez@entegris.com",
    title: "IT Administrator", 
    role: "ADMIN",
    department: "IT",
    last_login: "2024-01-07T12:15:00Z",
    status: "active"
  },
  {
    id: "10",
    name: "Amanda White",
    email: "amanda.white@entegris.com",
    title: "Finance Analyst",
    role: "USER",
    department: "Finance",
    last_login: "2024-01-06T10:50:00Z",
    status: "active"
  },
  {
    id: "11",
    name: "Kevin Garcia",
    email: "kevin.garcia@entegris.com",
    title: "Process Engineer",
    role: "USER",
    department: "Engineering", 
    last_login: "2024-01-05T14:35:00Z",
    status: "active"
  },
  {
    id: "12",
    name: "Rachel Thompson",
    email: "rachel.thompson@entegris.com",
    title: "Project Manager",
    role: "ADMIN",
    department: "PMO",
    last_login: "2024-01-04T09:40:00Z",
    status: "inactive"
  }
];

export function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique values for filter dropdowns
  const uniqueRoles = Array.from(new Set(mockUsers.map(user => user.role)));
  const uniqueDepartments = Array.from(new Set(mockUsers.map(user => user.department)));
  const uniqueStatuses = Array.from(new Set(mockUsers.map(user => user.status)));

  // Filter users based on search term and filters
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesDepartment = !departmentFilter || user.department === departmentFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short", 
      year: "numeric"
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <User className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Users</h1>
          </div>
          <p className="text-muted-foreground">
            Manage system users and their access
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email, department, or title..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
        
        {showFilters && (
          <div className="p-4 border border-border rounded-lg bg-muted/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">Role</label>
                <Select value={roleFilter} onValueChange={(value) => {
                  setRoleFilter(value === "all" ? "" : value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                    <SelectItem value="USER">USER</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Department</label>
                <Select value={departmentFilter} onValueChange={(value) => {
                  setDepartmentFilter(value === "all" ? "" : value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {uniqueDepartments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Status</label>
                <Select value={statusFilter} onValueChange={(value) => {
                  setStatusFilter(value === "all" ? "" : value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {uniqueStatuses.map((status) => (
                      <SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setRoleFilter("");
                  setDepartmentFilter("");
                  setStatusFilter("");
                  setCurrentPage(1);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Login</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-2 py-2 text-center text-muted-foreground">
                    No users found
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-2 py-2">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <Link 
                            to={`/users/${user.id}`}
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            {user.name}
                          </Link>
                          <div className="text-xs text-muted-foreground flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className="text-xs">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center text-sm">
                        <Briefcase className="h-3 w-3 mr-2 text-muted-foreground" />
                        {user.title}
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center text-sm">
                        <Building className="h-3 w-3 mr-2 text-muted-foreground" />
                        {user.department}
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-2" />
                        {formatDate(user.last_login)}
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center space-x-1">
                        <Link to={`/roles?user=${user.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View user roles">
                            <Shield className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link to={`/users/${user.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="User settings">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of{" "}
            {filteredUsers.length} users
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}