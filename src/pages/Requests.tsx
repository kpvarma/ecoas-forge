import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
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
  const owners = ["Jane Smith", "Mike Johnson", "Sarah Davis", "Tom Wilson", null];
  const statuses = ["completed", "in_progress", "pending", "failed"];
  const ownerStatuses = ["approved", "assigned", "unassigned", "rejected", "retried"];
  const requestStatuses = ["parsed", "template_generated", "parsing_failed", "queued", "error"];
  
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
    "Standard Operating Procedure Review"
  ];

  const documentTypes = [
    "IPA-SG-99.9", "ACE-EG-99.5", "MET-AL-98.7", "ETH-GL-97.2", 
    "HEX-AN-99.8", "TOL-UE-96.5", "XYL-EN-98.1", "BEN-ZE-99.3",
    "CYC-HX-97.9", "BUT-AN-98.6"
  ];

  for (let i = 1; i <= 10; i++) {
    const numChildren = Math.floor(Math.random() * 5) + 1; // 1-5 children
    const createdDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const updatedDate = new Date(createdDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000); // Up to 30 days later
    
    const owner = owners[Math.floor(Math.random() * owners.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const ownerStatus = owner ? ownerStatuses.slice(1)[Math.floor(Math.random() * (ownerStatuses.length - 1))] : "unassigned";
    
    const children: Request[] = [];
    
    for (let j = 1; j <= numChildren; j++) {
      const docType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
      const batch = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + (Math.floor(Math.random() * 999) + 100);
      const childCreatedDate = new Date(createdDate.getTime() + j * 60000); // 1 minute apart
      const childUpdatedDate = new Date(childCreatedDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000); // Up to 5 days later
      
      children.push({
        id: `CoA-2024-${String(i).padStart(3, '0')}-${j}`,
        initiator_email: `user${i}@entegris.com`,
        recipient_email: "qa@entegris.com",
        document_name: `${docType}-Batch-${batch}.pdf`,
        request_status: requestStatuses[Math.floor(Math.random() * requestStatuses.length)] as any,
        owner: owner,
        owner_status: ownerStatus as any,
        status: status as any,
        created_at: childCreatedDate.toISOString(),
        updated_at: childUpdatedDate.toISOString(),
        request_status_logs: [],
        parent_id: `REQ-2024-${String(i).padStart(3, '0')}`
      });
    }

    requests.push({
      id: `REQ-2024-${String(i).padStart(3, '0')}`,
      initiator_email: `user${i}@entegris.com`,
      recipient_email: "qa@entegris.com",
      document_name: subjects[Math.floor(Math.random() * subjects.length)],
      request_status: status as any,
      owner: owner,
      owner_status: ownerStatus as any,
      status: status as any,
      created_at: createdDate.toISOString(),
      updated_at: updatedDate.toISOString(),
      request_status_logs: [],
      children: children
    });
  }
  
  return requests;
};

// Utility function to format relative time
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const relative = formatDistanceToNow(date, { addSuffix: true });
  const formatted = date.toLocaleDateString('en-US', { 
    month: '2-digit', 
    day: '2-digit', 
    year: 'numeric' 
  });
  return `${relative} (${formatted})`;
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
  const navigate = useNavigate();

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
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Document Status</label>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">All</Button>
                    <Button variant="outline" size="sm">Parsed</Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Status</label>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">All</Button>
                    <Button variant="outline" size="sm">Completed</Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Owner Status</label>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">All</Button>
                    <Button variant="outline" size="sm">Assigned</Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Owner</label>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">All</Button>
                    <Button variant="outline" size="sm">Assigned</Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Created At</label>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">Last 7 days</Button>
                  </div>
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
                  <th>Owner Status</th>
                  <th>Owner</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <>
                    <tr key={request.id} className="group">
                      <td>
                        {request.children && request.children.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRowExpansion(request.id)}
                          >
                            {expandedRows.has(request.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </td>
                      <td>
                        <Link 
                          to={`/requests/${request.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {request.id}
                        </Link>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium">
                            {request.initiator_email.split('@')[0].replace('.', ' ')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {request.initiator_email}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="font-medium">{request.document_name}</div>
                      </td>
                      <td>
                        <StatusBadge status={(request.request_status as any)?.toUpperCase() || 'UNKNOWN'} />
                      </td>
                      <td>
                        <StatusBadge status={request.owner_status.toUpperCase()} type="owner" />
                      </td>
                      <td>
                        {request.owner ? (
                          <UserPopover username={request.owner} />
                        ) : (
                          <span className="text-sm text-muted-foreground">Unassigned</span>
                        )}
                      </td>
                      <td className="text-sm text-muted-foreground">
                        {formatRelativeTime(request.created_at)}
                      </td>
                      <td className="text-sm text-muted-foreground">
                        {formatRelativeTime(request.updated_at)}
                      </td>
                      <td>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewRequest(request.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail2(request.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}