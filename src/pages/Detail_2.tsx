import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, Eye, Download, Check, X, ChevronDown, ChevronUp, Edit, FileText as FileIcon } from "lucide-react";
import Editor from '@monaco-editor/react';
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
  const [showDetails, setShowDetails] = useState(false);
  const [xmlEditMode, setXmlEditMode] = useState(false);
  const [xmlContent, setXmlContent] = useState(mockDocumentData.xmlContent);
  
  const handleXmlChange = (value: string | undefined) => {
    if (value) {
      // Simple validation to prevent structural changes - only allow value modifications
      try {
        // Parse to check if XML is still valid
        const parser = new DOMParser();
        const doc = parser.parseFromString(value, "application/xml");
        const error = doc.querySelector("parsererror");
        
        if (!error) {
          setXmlContent(value);
        } else {
          console.warn("Invalid XML structure - changes not saved");
        }
      } catch (e) {
        console.warn("Invalid XML - changes not saved");
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/requests">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Requests
          </Button>
        </Link>
        <div className="text-right">
          <h1 className="text-lg font-bold">{request.id}</h1>
        </div>
      </div>

      {/* Combined Request Information and Document Status */}
      <Card className="enterprise-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">{request.id}</h1>
              <p className="text-muted-foreground">{request.document_name}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">STATUS:</span>
                  <StatusBadge status={request.status} type="status" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">APPROVAL STATUS:</span>
                  <StatusBadge status={request.owner_status} type="approval" />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {showDetails && (
            <div className="grid grid-cols-3 gap-4 text-sm">
              {/* Row 1: Request / Document ID, Subject, Owner */}
              <div>
                <div className="text-muted-foreground mb-1">Request / Document ID</div>
                <div className="font-medium">{request.id}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Subject</div>
                <div className="font-medium">{request.document_name}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Owner</div>
                <div className="font-medium">{request.owner || "Unassigned"}</div>
              </div>

              {/* Row 2: Plant ID, Part Number, Originator */}
              <div>
                <div className="text-muted-foreground mb-1">Plant ID</div>
                <div className="font-medium">PLT-001</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Part Number</div>
                <div className="font-medium">IPA-SG-99.9</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Originator</div>
                <div className="font-medium">
                  <div>John Doe</div>
                  <div className="text-muted-foreground text-xs">{request.initiator_email}</div>
                </div>
              </div>

              {/* Row 3: Status, Approval Status, Recipient Email */}
              <div>
                <div className="text-muted-foreground mb-1">Status</div>
                <StatusBadge status={request.status} type="status" />
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Approval Status</div>
                <StatusBadge status={request.owner_status} type="approval" />
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Recipient Email</div>
                <div className="font-medium">{request.recipient_email}</div>
              </div>

              {/* Row 4: Created At, Updated At */}
              <div>
                <div className="text-muted-foreground mb-1">Created At</div>
                <div className="font-medium">{formatDate(request.created_at)}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Updated At</div>
                <div className="font-medium">{formatDate(request.updated_at)}</div>
              </div>
            </div>
          )}
          
          {/* Horizontal Separator */}
          <div className="my-6">
            <div className="border-t border-border"></div>
          </div>
          
          {/* PDF and XML Content Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PDF Viewer */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">PDF Document</h3>
                <div className="flex space-x-1">
                  <Button variant="outline" size="sm" className="h-7 px-2">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 px-2">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
              <Card className="border rounded-lg">
                <CardContent className="p-4">
                  <iframe
                    src={mockDocumentData.pdfUrl}
                    className="w-full h-144 rounded border"
                    title="PDF Document Viewer"
                  />
                </CardContent>
              </Card>
            </div>

            {/* XML Content */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">XML Template</h3>
                <div className="flex items-center space-x-1">
                  <Button variant="outline" size="sm" className="h-7 px-2">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                    onClick={() => console.log('Approve clicked')}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Approve
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    onClick={() => console.log('Reject clicked')}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Reject
                  </Button>
                  <div className="flex border rounded-md">
                    <Button
                      variant={!xmlEditMode ? "default" : "ghost"}
                      size="sm"
                      className="h-7 px-2 rounded-r-none"
                      onClick={() => setXmlEditMode(false)}
                    >
                      <FileIcon className="h-3 w-3 mr-1" />
                      Read
                    </Button>
                    <Button
                      variant={xmlEditMode ? "default" : "ghost"}
                      size="sm"
                      className="h-7 px-2 rounded-l-none"
                      onClick={() => setXmlEditMode(true)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
              <Card className="border rounded-lg">
                <CardContent className="p-0">
                  <div className="h-144">
                    {xmlEditMode ? (
                      <Editor
                        height="36rem"
                        language="xml"
                        theme="vs-dark"
                        value={xmlContent}
                        onChange={handleXmlChange}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 12,
                          lineNumbers: "on",
                          readOnly: false,
                          automaticLayout: true,
                          scrollBeyondLastLine: false,
                          wordWrap: "on",
                          formatOnPaste: true,
                          formatOnType: true
                        }}
                      />
                    ) : (
                      <Editor
                        height="36rem"
                        language="xml"
                        theme="vs-dark"
                        value={xmlContent}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 12,
                          lineNumbers: "on",
                          readOnly: true,
                          automaticLayout: true,
                          scrollBeyondLastLine: false,
                          wordWrap: "on"
                        }}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parent Document Table - Compact */}
      <Card className="enterprise-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Request Details</CardTitle>
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