import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { 
  Search, 
  Filter, 
  Eye, 
  FileText, 
  ChevronDown, 
  ChevronRight,
  MoreHorizontal,
  Check,
  X,
  Clock,
  User,
  Mail,
  Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button as PaginationButton } from "@/components/ui/button";
import { Request, FilterOptions } from "@/types";
import { StatusBadge } from "@/components/StatusBadge";

// Mock users data for popover
const mockUsers = {
  "Jane Smith": {
    name: "Jane Smith",
    title: "Senior Quality Analyst",
    department: "Quality Assurance",
    email: "jane.smith@entegris.com"
  },
  "Mike Johnson": {
    name: "Mike Johnson", 
    title: "QC Supervisor",
    department: "Quality Control",
    email: "mike.johnson@entegris.com"
  },
  "Sarah Davis": {
    name: "Sarah Davis",
    title: "Lab Manager",
    department: "Laboratory Services", 
    email: "sarah.davis@entegris.com"
  },
  "Tom Wilson": {
    name: "Tom Wilson",
    title: "Quality Engineer",
    department: "Quality Engineering",
    email: "tom.wilson@entegris.com"
  }
};

// Generate comprehensive mock data
const generateMockRequests = (): Request[] => {
  const requests: Request[] = [];
  const owners = ["Jane Smith", "Mike Johnson", "Sarah Davis", "Tom Wilson", null, null, null]; // More null values for unassigned
  const statuses = ["completed", "in_progress", "failed", "queued"];
  const approvalStatuses = ["pending", "accepted", "rejected"];
  
  const subjects = [
    "Weekly Chemical Shipment Analysis Request",
    "Monthly Quality Control Batch Review", 
    "Quarterly Material Certification Request",
    "Emergency Chemical Analysis Protocol",
    "Annual Compliance Documentation Review",
    "Bi-Weekly Production Quality Assessment",
    "Critical Material Safety Evaluation",
    "Routine Laboratory Testing Protocol",
    "Special Investigation Analysis Request",
    "Standard Operating Procedure Review",
    "Additional Quality Review Request",
    "Extended Material Testing Protocol"
  ];

  const documentTypes = [
    "IPA-SG-99.9", "ACE-EG-99.5", "MET-AL-98.7", "ETH-GL-97.2", 
    "HEX-AN-99.8", "TOL-UE-96.5", "XYL-EN-98.1", "BEN-ZE-99.3",
    "CYC-HX-97.9", "BUT-AN-98.6"
  ];

  for (let i = 1; i <= 12; i++) {
    const numChildren = Math.floor(Math.random() * 5) + 1; // 1-5 children
    const createdDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const updatedDate = new Date(createdDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000); // Up to 30 days later
    
    const owner = owners[Math.floor(Math.random() * owners.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const approvalStatus = owner ? approvalStatuses[Math.floor(Math.random() * 3)] : "pending";
    
    const children: Request[] = [];
    
    // Determine overall request status based on children completion
    let overallRequestStatus = "queued";
    const childStatuses: string[] = [];
    
    for (let j = 1; j <= numChildren; j++) {
      const docType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
      const batch = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + (Math.floor(Math.random() * 999) + 100);
      const childCreatedDate = new Date(createdDate.getTime() + j * 60000); // 1 minute apart
      const childUpdatedDate = new Date(childCreatedDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000); // Up to 5 days later
      const childStatus = statuses[Math.floor(Math.random() * statuses.length)];
      childStatuses.push(childStatus);
      
      children.push({
        id: `CoA-2024-${String(i).padStart(3, '0')}-${j}`,
        initiator_email: `user${i}@entegris.com`,
        recipient_email: "qa@entegris.com",
        document_name: `${docType}-Batch-${batch}.pdf`,
        request_status: childStatus as any,
        owner: owner,
        owner_status: approvalStatus as any,
        status: childStatus as any,
        created_at: childCreatedDate.toISOString(),
        updated_at: childUpdatedDate.toISOString(),
        request_status_logs: [],
        parent_id: `REQ-2024-${String(i).padStart(3, '0')}`
      });
    }
    
    // Set overall status based on children
    if (childStatuses.every(s => s === "completed")) {
      overallRequestStatus = "completed";
    } else if (childStatuses.some(s => s === "failed")) {
      overallRequestStatus = "failed";
    } else {
      overallRequestStatus = "in_progress";
    }

    requests.push({
      id: `REQ-2024-${String(i).padStart(3, '0')}`,
      initiator_email: `user${i}@entegris.com`,
      recipient_email: "qa@entegris.com",
      document_name: subjects[Math.floor(Math.random() * subjects.length)],
      request_status: overallRequestStatus as any,
      owner: null, // Parent rows don't have owners
      owner_status: "pending" as any, // Default approval status
      status: overallRequestStatus as any,
      created_at: createdDate.toISOString(),
      updated_at: updatedDate.toISOString(),
      request_status_logs: [],
      children: children
    });
  }
  
  return requests;
};

// Utility function to format date in long format
const formatLongDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, 'dd MMM yyyy');
};

// User Popover Component
const UserPopover = ({ username }: { username: string }) => {
  const user = mockUsers[username as keyof typeof mockUsers];
  
  if (!user) {
    return <span className="text-sm">{username}</span>;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center space-x-2 text-sm hover:text-primary transition-colors">
          <User className="h-4 w-4" />
          <span>{username}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold">{user.name}</h4>
              <p className="text-sm text-muted-foreground">{user.title}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span>{user.department}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export function Requests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [requests, setRequests] = useState<Request[]>(() => generateMockRequests());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Calculate pagination - only count parent rows
  const totalItems = requests.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get paginated requests - only paginate parent rows
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedRequests = requests.slice(startIndex, endIndex);
    
    let flattenedData: Array<{item: Request; isChild: boolean; parent?: Request}> = [];
    
    paginatedRequests.forEach(request => {
      flattenedData.push({ item: request, isChild: false });
      if (expandedRows.has(request.id) && request.children) {
        request.children.forEach(child => {
          flattenedData.push({ item: child, isChild: true, parent: request });
        });
      }
    });

    return flattenedData;
  };

  const paginatedData = getPaginatedData();

  const toggleRowExpansion = (requestId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(requestId)) {
      newExpanded.delete(requestId);
    } else {
      newExpanded.add(requestId);
    }
    setExpandedRows(newExpanded);
  };

  const handleViewRequest = (id: string) => {
    navigate(`/requests/${id}`);
  };

  const handleViewDetail2 = (id: string) => {
    navigate(`/requests/${id}/detail2`);
  };

  const handleViewDocument = (id: string) => {
    navigate(`/requests/${id}/approval`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Requests</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all certificate of analysis requests
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="enterprise-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
            <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Status</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="queued">Queued</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Approval Status</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Owner</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="jane-smith">Jane Smith</SelectItem>
                      <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                      <SelectItem value="sarah-davis">Sarah Davis</SelectItem>
                      <SelectItem value="tom-wilson">Tom Wilson</SelectItem>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Created At</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All time" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border">
                      <SelectItem value="all">All time</SelectItem>
                      <SelectItem value="last-day">Last day</SelectItem>
                      <SelectItem value="last-week">Last Week</SelectItem>
                      <SelectItem value="last-month">Last Month</SelectItem>
                      <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                      <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card className="enterprise-card">
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-12"></th>
                  <th>Request / Document ID</th>
                  <th>Originator</th>
                  <th>Subject / Document Name</th>
                  <th>Status</th>
                  <th>Approval Status</th>
                  <th>Owner</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map(({item, isChild, parent}) => (
                  <tr key={item.id} className={isChild ? "bg-muted/30" : "group"}>
                    <td>
                      {!isChild && item.children && item.children.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRowExpansion(item.id)}
                        >
                          {expandedRows.has(item.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </td>
                    <td className={isChild ? "pl-8" : ""}>
                      <Link 
                        to={`/requests/${item.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                      >
                        {item.id}
                      </Link>
                    </td>
                    <td>
                      {!isChild && (
                        <div>
                          <div className="font-medium">
                            {item.initiator_email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.initiator_email}
                          </div>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="font-medium">{item.document_name}</div>
                    </td>
                    <td>
                      <StatusBadge status={item.status.toUpperCase()} type="status" />
                    </td>
                    <td>
                      {isChild && (
                        <StatusBadge status={item.owner_status.toUpperCase()} type="approval" />
                      )}
                    </td>
                    <td>
                      {isChild && (
                        item.owner ? (
                          <UserPopover username={item.owner} />
                        ) : (
                          <span className="text-sm text-muted-foreground">Unassigned</span>
                        )
                      )}
                    </td>
                    <td className="text-sm text-muted-foreground">
                      {formatLongDate(item.created_at)}
                    </td>
                    <td className="text-sm text-muted-foreground">
                      {formatLongDate(item.updated_at)}
                    </td>
                    <td>
                      <div className="flex space-x-1">
                        {!isChild ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewRequest(item.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetail2(item.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDocument(item.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} requests
              </div>
              <div className="flex items-center space-x-2">
                <PaginationButton
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </PaginationButton>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(currentPage - 2 + i, totalPages - 4 + i));
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <PaginationButton
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </PaginationButton>
                  );
                })}
                
                <PaginationButton
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </PaginationButton>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}