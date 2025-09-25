import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  FileText, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Mail,
  Calendar,
  Eye,
  Edit,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Request } from "@/types";
import { StatusBadge } from "@/components/StatusBadge";

// Mock data for the specific request
const mockRequestDetail: Request = {
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
  request_status_logs: [
    { status: "queued", timestamp: "2024-01-15T10:30:00Z", user: "System" },
    { status: "parsed", timestamp: "2024-01-15T11:15:00Z", user: "System" },
    { status: "template_generated", timestamp: "2024-01-15T12:00:00Z", user: "System" }
  ],
  owner_status_logs: [
    { status: "unassigned", timestamp: "2024-01-15T10:30:00Z", user: "System" },
    { status: "assigned", timestamp: "2024-01-15T11:30:00Z", user: "Admin" },
    { status: "approved", timestamp: "2024-01-15T13:45:00Z", user: "Jane Smith" }
  ],
  status_logs: [
    { status: "pending", timestamp: "2024-01-15T10:30:00Z", user: "System" },
    { status: "in_progress", timestamp: "2024-01-15T11:15:00Z", user: "System" },
    { status: "completed", timestamp: "2024-01-15T14:20:00Z", user: "Jane Smith" }
  ],
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
};


const DetailItem = ({ icon: Icon, label, value, action }: {
  icon: any;
  label: string;
  value: string | React.ReactNode;
  action?: () => void;
}) => (
  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
    <Icon className="h-5 w-5 text-primary flex-shrink-0" />
    <div className="flex-1">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
    {action && (
      <Button variant="ghost" size="sm" onClick={action}>
        <Eye className="h-4 w-4" />
      </Button>
    )}
  </div>
);

export function RequestDetail() {
  const { id } = useParams();
  const request = mockRequestDetail; // In real app, fetch by id

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/requests">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Requests
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{request.id}</h1>
          <p className="text-muted-foreground mt-1">{request.document_name}</p>
        </div>
        <div className="flex space-x-2">
          <Link to={`/requests/${request.id}/approval`}>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              View Document
            </Button>
          </Link>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Request
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="enterprise-card">
            <CardHeader>
              <CardTitle>Request Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem
                  icon={FileText}
                  label="Request ID"
                  value={request.id}
                />
                <DetailItem
                  icon={Calendar}
                  label="Created Date"
                  value={new Date(request.created_at).toLocaleDateString()}
                />
                <DetailItem
                  icon={User}
                  label="Initiator"
                  value={
                    <div>
                      <div className="font-medium">John Doe</div>
                      <div className="text-sm text-muted-foreground">{request.initiator_email}</div>
                    </div>
                  }
                />
                <DetailItem
                  icon={Mail}
                  label="Recipient Email"
                  value={request.recipient_email}
                />
                <DetailItem
                  icon={User}
                  label="Owner"
                  value={request.owner || "Unassigned"}
                />
                <DetailItem
                  icon={Clock}
                  label="Last Updated"
                  value={new Date(request.updated_at).toLocaleDateString()}
                />
              </div>
            </CardContent>
          </Card>

          {/* Status Information */}
          <Card className="enterprise-card">
            <CardHeader>
              <CardTitle>Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <div className="text-sm text-muted-foreground mb-2">Request Status</div>
                  <StatusBadge status={request.request_status} />
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <div className="text-sm text-muted-foreground mb-2">Owner Status</div>
                  <StatusBadge status={request.owner_status} type="owner" />
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/30">
                  <div className="text-sm text-muted-foreground mb-2">Overall Status</div>
                  <StatusBadge status={request.status} type="request" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Child Requests */}
          {request.children && request.children.length > 0 && (
            <Card className="enterprise-card">
              <CardHeader>
                <CardTitle>Related Documents</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Document ID</th>
                        <th>Document Name</th>
                        <th>Request Status</th>
                        <th>Owner Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {request.children.map((child) => (
                        <tr key={child.id}>
                          <td>
                            <Link 
                              to={`/requests/${child.id}`}
                              className="font-medium text-primary hover:underline"
                            >
                              {child.id}
                            </Link>
                          </td>
                          <td>{child.document_name}</td>
                          <td>
                            <StatusBadge status={child.request_status} />
                          </td>
                          <td>
                            <StatusBadge status={child.owner_status} type="owner" />
                          </td>
                          <td>
                            <div className="flex space-x-1">
                              <Link to={`/requests/${child.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link to={`/requests/${child.id}/approval`}>
                                <Button variant="ghost" size="sm">
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          <Card className="enterprise-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to={`/requests/${request.id}/approval`} className="block">
                <Button className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  View Document
                </Button>
              </Link>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" className="w-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Request
              </Button>
              <Button variant="outline" className="w-full">
                <XCircle className="h-4 w-4 mr-2" />
                Reject Request
              </Button>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card className="enterprise-card">
            <CardHeader>
              <CardTitle>Status Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Request Status Timeline */}
                <div>
                  <h4 className="font-medium mb-4 text-sm text-muted-foreground">Request Status</h4>
                  <div className="space-y-4">
                    {request.request_status_logs.map((log, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                        <div className="flex-1 min-w-0">
                          <StatusBadge status={log.status} type="request" />
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            by {log.user}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Owner Status Timeline */}
                <div>
                  <h4 className="font-medium mb-4 text-sm text-muted-foreground">Owner Status</h4>
                  <div className="space-y-4">
                    {request.owner_status_logs?.map((log, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                        <div className="flex-1 min-w-0">
                          <StatusBadge status={log.status} type="owner" />
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            by {log.user}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Overall Status Timeline */}
                <div>
                  <h4 className="font-medium mb-4 text-sm text-muted-foreground">Overall Status</h4>
                  <div className="space-y-4">
                    {request.status_logs?.map((log, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                        <div className="flex-1 min-w-0">
                          <StatusBadge status={log.status} type="request" />
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            by {log.user}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}