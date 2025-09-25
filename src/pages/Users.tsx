import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Search, User, Mail, Building, Briefcase, Clock } from "lucide-react";

// Mock user data - in real app this would come from API
const mockUsers = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@entegris.com", 
    title: "Senior Engineer",
    department: "Engineering",
    last_login: "2024-01-15T10:30:00Z",
    status: "active"
  },
  {
    id: "2", 
    name: "Sarah Johnson",
    email: "sarah.johnson@entegris.com",
    title: "Product Manager",
    department: "Product",
    last_login: "2024-01-14T15:45:00Z",
    status: "active"
  },
  {
    id: "3",
    name: "Mike Chen",
    email: "mike.chen@entegris.com", 
    title: "Quality Analyst",
    department: "Quality Assurance",
    last_login: "2024-01-13T09:15:00Z",
    status: "active"
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@entegris.com",
    title: "Operations Lead", 
    department: "Operations",
    last_login: "2024-01-12T14:20:00Z",
    status: "inactive"
  },
  {
    id: "5",
    name: "Robert Wilson",
    email: "robert.wilson@entegris.com",
    title: "Research Scientist",
    department: "R&D",
    last_login: "2024-01-11T11:10:00Z", 
    status: "active"
  },
  {
    id: "6",
    name: "Lisa Anderson",
    email: "lisa.anderson@entegris.com",
    title: "Manufacturing Engineer",
    department: "Manufacturing",
    last_login: "2024-01-10T16:30:00Z",
    status: "active"
  },
  {
    id: "7",
    name: "David Brown",
    email: "david.brown@entegris.com", 
    title: "Supply Chain Manager",
    department: "Supply Chain",
    last_login: "2024-01-09T08:45:00Z",
    status: "active"
  },
  {
    id: "8",
    name: "Jennifer Taylor",
    email: "jennifer.taylor@entegris.com",
    title: "Compliance Officer",
    department: "Compliance", 
    last_login: "2024-01-08T13:25:00Z",
    status: "active"
  },
  {
    id: "9",
    name: "Thomas Martinez",
    email: "thomas.martinez@entegris.com",
    title: "IT Administrator", 
    department: "IT",
    last_login: "2024-01-07T12:15:00Z",
    status: "active"
  },
  {
    id: "10",
    name: "Amanda White",
    email: "amanda.white@entegris.com",
    title: "Finance Analyst",
    department: "Finance",
    last_login: "2024-01-06T10:50:00Z",
    status: "active"
  },
  {
    id: "11",
    name: "Kevin Garcia",
    email: "kevin.garcia@entegris.com",
    title: "Process Engineer",
    department: "Engineering", 
    last_login: "2024-01-05T14:35:00Z",
    status: "active"
  },
  {
    id: "12",
    name: "Rachel Thompson",
    email: "rachel.thompson@entegris.com",
    title: "Project Manager",
    department: "PMO",
    last_login: "2024-01-04T09:40:00Z",
    status: "inactive"
  }
];

export function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter users based on search term
  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground">
            Manage system users and their access
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users by name, email, department, or title..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="pl-10"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Briefcase className="h-3 w-3 mr-2 text-muted-foreground" />
                      {user.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Building className="h-3 w-3 mr-2 text-muted-foreground" />
                      {user.department}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 mr-2" />
                      {formatDate(user.last_login)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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