import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Request } from "@/types";
import { StatusBadge } from "@/components/StatusBadge";
import { DocumentViewer } from "@/components/DocumentViewer";

// Mock data for the specific request
const mockRequestDetail: Request = {
  id: "REQ-2024-001",
  initiator_email: "john.doe@entegris.com",
  recipient_email: "qa@entegris.com",
  document_name: "Semiconductor Grade Chemical Analysis Report",
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
      id: "CoA-2024-001-1",
      initiator_email: "john.doe@entegris.com",
      recipient_email: "qa@entegris.com", 
      document_name: "Chemical Purity Analysis Report.pdf",
      request_status: "template_generated",
      owner_status: "approved",
      status: "completed",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T12:15:00Z",
      request_status_logs: [],
      parent_id: "REQ-2024-001"
    },
    {
      id: "CoA-2024-001-2",
      initiator_email: "john.doe@entegris.com",
      recipient_email: "qa@entegris.com", 
      document_name: "Trace Metal Analysis Report.pdf",
      request_status: "queued",
      owner_status: "unassigned",
      status: "in_progress",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T11:45:00Z",
      request_status_logs: [],
      parent_id: "REQ-2024-001"
    },
    {
      id: "CoA-2024-001-3",
      initiator_email: "john.doe@entegris.com",
      recipient_email: "qa@entegris.com", 
      document_name: "Particle Count Analysis Report.pdf",
      request_status: "parsed",
      owner_status: "approved",
      status: "completed",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T13:20:00Z",
      request_status_logs: [],
      parent_id: "REQ-2024-001"
    },
    {
      id: "CoA-2024-001-4",
      initiator_email: "john.doe@entegris.com",
      recipient_email: "qa@entegris.com", 
      document_name: "Moisture Content Analysis Report.pdf",
      request_status: "template_generated",
      owner_status: "rejected",
      status: "failed",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T15:10:00Z",
      request_status_logs: [],
      parent_id: "REQ-2024-001"
    },
    {
      id: "CoA-2024-001-5",
      initiator_email: "john.doe@entegris.com",
      recipient_email: "qa@entegris.com", 
      document_name: "Elemental Composition Report.pdf",
      request_status: "queued",
      owner_status: "unassigned",
      status: "pending",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:35:00Z",
      request_status_logs: [],
      parent_id: "REQ-2024-001"
    }
  ]
};

// Mock parent document (always one item)
const parentDocument = {
  id: "REQ-2024-001",
  document_name: "Master Request Document",
  status: "completed",
  approval_status: "approved",
  owner: "Jane Smith",
  created_at: "2024-01-15T10:30:00Z",
  updated_at: "2024-01-15T14:20:00Z"
};

// Mock document data for the viewer
const mockDocumentData = {
  requestId: "REQ-2024-001",
  documentName: "Semiconductor Grade Chemical Analysis",
  pdfUrl: "https://sample-files.com/downloads/documents/pdf/basic-text.pdf",
  xmlContent: `<Shipment xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="K S_P05767J.xsd" MaterialDesc="PE PLATE 68X34X0.5 QT4125" PartID="P05767J" Supplier="K S" SupplierPlantCode="120037" CustomerName="Entegris" CustomerPlantId="4165" CompanyGroup="Entegris" PONumber="4501130764-50" ShipmentDate="20-05-2025" ShipQty="9984" SQMSCHEMANAME="K S_P05767J">
<Lot LotId="250520">
<SYMBOLICS>
<Burr VALUE="PASS"/>
<Stain VALUE="PASS"/>
<Scratch VALUE="PASS"/>
<Foreign_Matter_Adhesion VALUE="PASS"/>
<Packing_Condition VALUE="OK"/>
</SYMBOLICS>
<Outside_Diameter>
<RAW VALUE="68.18"/>
</Outside_Diameter>
<Inner_Diameter>
<RAW VALUE="34.03"/>
</Inner_Diameter>
<Plate_Thickness>
<RAW VALUE="0.48"/>
</Plate_Thickness>
</Lot>
</Shipment>`,
  templateId: "TMPL-IPA-001",
  hasXml: true,
  isGenerated: true
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short", 
    year: "numeric"
  });
};

export function Detail_2() {
  const { id } = useParams();
  const request = mockRequestDetail;

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
      </div>

      {/* Request Information - Compact Design */}
      <Card className="enterprise-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Request Information</CardTitle>
            <Link to={`/requests/${request.id}/approval`}>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                View Document
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-sm">
            {/* Row 1: Request / Document ID & Subject */}
            <div className="col-span-2">
              <div className="text-muted-foreground mb-1">Request / Document ID</div>
              <div className="font-medium">{request.id}</div>
            </div>
            <div className="col-span-2">
              <div className="text-muted-foreground mb-1">Subject</div>
              <div className="font-medium">{request.document_name}</div>
            </div>

            {/* Row 2: Owner - span 2 columns */}
            <div className="col-span-4">
              <div className="text-muted-foreground mb-1">Owner</div>
              <div className="font-medium">{request.owner || "Unassigned"}</div>
            </div>

            {/* Row 3: Status and Approval Status */}
            <div className="col-span-2">
              <div className="text-muted-foreground mb-1">Status</div>
              <StatusBadge status={request.status} type="status" />
            </div>
            <div className="col-span-2">
              <div className="text-muted-foreground mb-1">Approval Status</div>
              <StatusBadge status={request.owner_status} type="approval" />
            </div>

            {/* Row 4: Originator, Recipient Email */}
            <div className="col-span-2">
              <div className="text-muted-foreground mb-1">Originator</div>
              <div className="font-medium">
                <div>John Doe</div>
                <div className="text-muted-foreground">{request.initiator_email}</div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="text-muted-foreground mb-1">Recipient Email</div>
              <div className="font-medium">{request.recipient_email}</div>
            </div>

            {/* Row 5: Created at, Updated at */}
            <div className="col-span-2">
              <div className="text-muted-foreground mb-1">Created at</div>
              <div className="font-medium">{formatDate(request.created_at)}</div>
            </div>
            <div className="col-span-2">
              <div className="text-muted-foreground mb-1">Updated at</div>
              <div className="font-medium">{formatDate(request.updated_at)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Viewer */}
      <div className="space-y-6">
        <DocumentViewer documentData={mockDocumentData} showApprovalButtons={false} />
      </div>

      {/* Parent Document Table - Compact */}
      <Card className="enterprise-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Parent Document</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead className="py-2">ID</TableHead>
                  <TableHead className="py-2">Document Name</TableHead>
                  <TableHead className="py-2">Status</TableHead>
                  <TableHead className="py-2">Approval</TableHead>
                  <TableHead className="py-2">Owner</TableHead>
                  <TableHead className="py-2">Created</TableHead>
                  <TableHead className="py-2">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="text-sm">
                  <TableCell className="py-2">
                    <Link 
                      to={`/requests/${parentDocument.id}/detail2`}
                      target="_blank"
                      className="font-medium text-primary hover:underline"
                    >
                      {parentDocument.id}
                    </Link>
                  </TableCell>
                  <TableCell className="py-2">{parentDocument.document_name}</TableCell>
                  <TableCell className="py-2">
                    <StatusBadge status={parentDocument.status} type="status" />
                  </TableCell>
                  <TableCell className="py-2">
                    <StatusBadge status={parentDocument.approval_status} type="approval" />
                  </TableCell>
                  <TableCell className="py-2">{parentDocument.owner}</TableCell>
                  <TableCell className="py-2">{formatDate(parentDocument.created_at)}</TableCell>
                  <TableCell className="py-2">
                    <div className="flex space-x-1">
                      <Link to={`/requests/${parentDocument.id}/detail2`} target="_blank">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Related Documents Table - Compact */}
      <Card className="enterprise-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Related Documents</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead className="py-2">ID</TableHead>
                  <TableHead className="py-2">Document Name</TableHead>
                  <TableHead className="py-2">Status</TableHead>
                  <TableHead className="py-2">Approval</TableHead>
                  <TableHead className="py-2">Owner</TableHead>
                  <TableHead className="py-2">Created</TableHead>
                  <TableHead className="py-2">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {request.children?.map((child) => (
                  <TableRow key={child.id} className="text-sm">
                    <TableCell className="py-2">
                      <Link 
                        to={`/requests/${child.id}/detail2`}
                        target="_blank"
                        className="font-medium text-primary hover:underline"
                      >
                        {child.id}
                      </Link>
                    </TableCell>
                    <TableCell className="py-2">{child.document_name}</TableCell>
                    <TableCell className="py-2">
                      <StatusBadge status={child.status} type="status" />
                    </TableCell>
                    <TableCell className="py-2">
                      <StatusBadge status={child.owner_status} type="approval" />
                    </TableCell>
                    <TableCell className="py-2">{child.owner || ""}</TableCell>
                    <TableCell className="py-2">{formatDate(child.created_at)}</TableCell>
                    <TableCell className="py-2">
                      <div className="flex space-x-1">
                        <Link to={`/requests/${child.id}/detail2`} target="_blank">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}