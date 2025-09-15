import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  AlertCircle
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
import { Request } from "@/types";

// Mock data - will be replaced with real data later
const mockRequests: Request[] = [
  {
    id: "REQ-2024-001",
    initiator_email: "john.doe@entegris.com",
    recipient_email: "qa@entegris.com",
    document_name: "Semiconductor Grade Chemical Analysis",
    pdf_file: "/docs/sample1.pdf",
    xml_file: "/docs/sample1.xml",
    request_status: "template_generated",
    owner: "Jane Smith",
    owner_status: "approved",
    status: "completed",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T14:20:00Z",
    request_status_logs: [],
    children: [
      {
        id: "REQ-2024-001-1",
        initiator_email: "john.doe@entegris.com",
        recipient_email: "qa@entegris.com",
        document_name: "Chemical Purity Report",
        request_status: "parsed",
        owner_status: "assigned",
        status: "in_progress",
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T12:15:00Z",
        request_status_logs: [],
        parent_id: "REQ-2024-001"
      }
    ]
  },
  {
    id: "REQ-2024-002",
    initiator_email: "sarah.wilson@entegris.com",
    recipient_email: "lab@entegris.com",
    document_name: "Material Safety Data Sheet",
    request_status: "parsing_failed",
    owner_status: "unassigned",
    status: "failed",
    created_at: "2024-01-14T09:15:00Z",
    updated_at: "2024-01-14T11:45:00Z",
    request_status_logs: []
  }
];

const StatusBadge = ({ status, type = "request" }: { status: string; type?: "request" | "owner" | "general" }) => {
  const getVariant = () => {
    if (type === "owner") {
      switch (status) {
        case "approved": return "bg-success/10 text-success border-success/20";
        case "assigned": return "bg-warning/10 text-warning border-warning/20";
        case "rejected": return "bg-error/10 text-error border-error/20";
        case "unassigned": return "bg-muted text-muted-foreground border-border";
        default: return "bg-muted text-muted-foreground border-border";
      }
    }
    
    switch (status) {
      case "completed": case "template_generated": case "parsed":
        return "bg-success/10 text-success border-success/20";
      case "in_progress": case "queued": case "assigned":
        return "bg-warning/10 text-warning border-warning/20";
      case "failed": case "error": case "parsing_failed": case "rejected":
        return "bg-error/10 text-error border-error/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <Badge variant="outline" className={getVariant()}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
};

export function Requests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
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
            <div className="flex-1 max-w-md">
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
              <p className="text-sm text-muted-foreground">Filters will be implemented here</p>
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
                  <th>Request ID</th>
                  <th>Originator</th>
                  <th>Document</th>
                  <th>Request Status</th>
                  <th>Owner Status</th>
                  <th>Status</th>
                  <th>Owner</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockRequests.map((request) => (
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
                        <StatusBadge status={request.request_status} />
                      </td>
                      <td>
                        <StatusBadge status={request.owner_status} type="owner" />
                      </td>
                      <td>
                        <StatusBadge status={request.status} type="general" />
                      </td>
                      <td>{request.owner || "Unassigned"}</td>
                      <td className="text-sm text-muted-foreground">
                        {new Date(request.created_at).toLocaleDateString()}
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
                            onClick={() => handleViewDocument(request.id)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Check className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <X className="h-4 w-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Clock className="h-4 w-4 mr-2" />
                                Assign
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Child Rows */}
                    {expandedRows.has(request.id) && request.children?.map((child) => (
                      <tr key={child.id} className="bg-muted/30">
                        <td className="pl-8">
                          <div className="w-4 h-4 border-l-2 border-b-2 border-border"></div>
                        </td>
                        <td>
                          <Link 
                            to={`/requests/${child.id}`}
                            className="font-medium text-primary hover:underline text-sm"
                          >
                            {child.id}
                          </Link>
                        </td>
                        <td>
                          <div className="text-sm">
                            <div className="font-medium">
                              {child.initiator_email.split('@')[0].replace('.', ' ')}
                            </div>
                            <div className="text-muted-foreground">
                              {child.initiator_email}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="font-medium text-sm">{child.document_name}</div>
                        </td>
                        <td>
                          <StatusBadge status={child.request_status} />
                        </td>
                        <td>
                          <StatusBadge status={child.owner_status} type="owner" />
                        </td>
                        <td>
                          <StatusBadge status={child.status} type="general" />
                        </td>
                        <td className="text-sm">{child.owner || "Unassigned"}</td>
                        <td className="text-sm text-muted-foreground">
                          {new Date(child.created_at).toLocaleDateString()}
                        </td>
                        <td>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewRequest(child.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDocument(child.id)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Showing 1 to 2 of 2 requests
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}