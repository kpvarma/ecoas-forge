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
import { Badge } from "@/components/ui/badge";
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
import { MultipleOwnersDisplay } from "@/components/OwnerBadge";


// Generate comprehensive mock data
const generateMockRequests = (): Request[] => {
  const requests: Request[] = [];
  const owners = [
    ["Jane Smith"], 
    ["Mike Johnson"], 
    ["Sarah Davis", "Tom Wilson"], 
    ["Jane Smith", "Mike Johnson"], 
    [], 
    [], 
    ["Tom Wilson"]
  ]; // Array of arrays for multiple owners
  const statuses = ["completed", "in_progress", "failed", "queued"];
  const approvalStatuses = ["pending", "accepted", "rejected"];
  const plantIds = ["PLT-001", "PLT-002", "PLT-003", "PLT-004"];
  const partNumbers = ["IPA-SG-99.9", "ACE-EG-99.5", "MET-AL-98.7", "ETH-GL-97.2", "HEX-AN-99.8"];
  
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
    const approvalStatus = owner.length > 0 ? approvalStatuses[Math.floor(Math.random() * 3)] : "pending";
    
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
        owner: owner.length > 0 ? owner[0] : null, // Use first owner for child items
        owner_status: approvalStatus as any,
        status: childStatus as any,
        created_at: childCreatedDate.toISOString(),
        updated_at: childUpdatedDate.toISOString(),
        request_status_logs: [],
        parent_id: `REQ-2024-${String(i).padStart(3, '0')}`,
        plant_id: plantIds[Math.floor(Math.random() * plantIds.length)],
        part_number: partNumbers[Math.floor(Math.random() * partNumbers.length)]
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


export function Requests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [requests, setRequests] = useState<Request[]>(() => generateMockRequests());
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [approvalStatusFilter, setApprovalStatusFilter] = useState<string>("all");
  const [ownerFilter, setOwnerFilter] = useState<string>("all");
  const [plantIdFilter, setPlantIdFilter] = useState<string>("all");
  const [partNumberFilter, setPartNumberFilter] = useState<string>("all");
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
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Requests</h1>
          </div>
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
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                  <label className="text-sm font-medium block mb-2">Plant ID</label>
                  <Select value={plantIdFilter} onValueChange={setPlantIdFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="PLT-001">PLT-001</SelectItem>
                      <SelectItem value="PLT-002">PLT-002</SelectItem>
                      <SelectItem value="PLT-003">PLT-003</SelectItem>
                      <SelectItem value="PLT-004">PLT-004</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Part Number</label>
                  <Select value={partNumberFilter} onValueChange={setPartNumberFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="IPA-SG-99.9">IPA-SG-99.9</SelectItem>
                      <SelectItem value="ACE-EG-99.5">ACE-EG-99.5</SelectItem>
                      <SelectItem value="MET-AL-98.7">MET-AL-98.7</SelectItem>
                      <SelectItem value="ETH-GL-97.2">ETH-GL-97.2</SelectItem>
                      <SelectItem value="HEX-AN-99.8">HEX-AN-99.8</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Owner</label>
                  <Select value={ownerFilter} onValueChange={setOwnerFilter}>
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
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="w-8 h-8 text-left"></th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Request / Document ID</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Plant ID</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Part Number</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Originator</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Subject / Document Name</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Approval Status</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Owner</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Created At</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Updated At</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedData.map(({item, isChild, parent}) => (
                  <tr key={item.id} className={`${isChild ? "bg-muted/30" : "hover:bg-muted/50"} transition-colors`}>
                    <td className="px-2 py-2">
                      {!isChild && item.children && item.children.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleRowExpansion(item.id)}
                        >
                          {expandedRows.has(item.id) ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                    </td>
                    <td className={`px-2 py-2 ${isChild ? "pl-6" : ""}`}>
                      <Link 
                        to={`/requests/${item.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {item.id}
                      </Link>
                    </td>
                    <td className="px-2 py-2">
                      {isChild ? (
                        <div className="text-sm font-medium">{item.plant_id}</div>
                      ) : (
                        <div className="text-sm text-muted-foreground">-</div>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      {isChild ? (
                        <div className="text-sm font-medium">{item.part_number}</div>
                      ) : (
                        <div className="text-sm text-muted-foreground">-</div>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      {!isChild && (
                        <div>
                          <div className="text-sm font-medium">
                            {item.initiator_email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.initiator_email}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      <div className="text-sm font-medium">{item.document_name}</div>
                    </td>
                    <td className="px-2 py-2">
                      <StatusBadge status={item.status.toUpperCase()} type="status" />
                    </td>
                    <td className="px-2 py-2">
                      {isChild && (
                        <StatusBadge status={item.owner_status.toUpperCase()} type="approval" />
                      )}
                    </td>
                    <td className="px-2 py-2">
                      {isChild && (
                        <MultipleOwnersDisplay owners={item.owner ? [item.owner] : []} />
                      )}
                    </td>
                    <td className="px-2 py-2 text-xs text-muted-foreground">
                      {formatLongDate(item.created_at)}
                    </td>
                    <td className="px-2 py-2 text-xs text-muted-foreground">
                      {formatLongDate(item.updated_at)}
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex space-x-1">
                        {!isChild ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleViewRequest(item.id)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleViewDetail2(item.id)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </>
                         ) : (
                           <>
                             <Button
                               variant="ghost"
                               size="sm"
                               className="h-6 w-6 p-0"
                               onClick={() => handleViewRequest(item.id)}
                             >
                               <Eye className="h-3 w-3" />
                             </Button>
                             <Button
                               variant="ghost"
                               size="sm"
                               className="h-6 w-6 p-0"
                               onClick={() => handleViewDetail2(item.id)}
                             >
                               <Eye className="h-3 w-3" />
                             </Button>
                           </>
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
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  if (pageNum < 1 || pageNum > totalPages) return null;
                  
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