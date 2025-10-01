import { useParams } from "react-router-dom";
import { Request } from "@/types";
import { RequestDetailHeader } from "@/components/requests/RequestDetailHeader";
import { RequestInfoCard } from "@/components/requests/RequestInfoCard";
import { DocumentViewers } from "@/components/requests/DocumentViewers";
import { ParentDocumentTable } from "@/components/requests/ParentDocumentTable";
import { RelatedDocumentsTable } from "@/components/requests/RelatedDocumentsTable";

// Mock data for the specific request
const mockRequestDetail: Request = {
  id: "REQ-2024-001",
  created_date: "2024-01-15T10:30:00Z",
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
      created_date: "2024-01-15T10:31:00Z",
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
      created_date: "2024-01-15T10:32:00Z",
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
      created_date: "2024-01-15T10:32:00Z",
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
      created_date: "2024-01-15T10:33:00Z",
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
      created_date: "2024-01-15T10:33:00Z",
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

export default function RequestDetailPage() {
  const { id } = useParams();
  const request = mockRequestDetail;
  
  return (
    <div className="p-6 space-y-6">
      <RequestDetailHeader requestId={request.id} />

      <RequestInfoCard request={request} formatDate={formatDate} />
          
      {/* Horizontal Separator */}
      <div className="my-6">
        <div className="border-t border-border"></div>
      </div>
          
      <DocumentViewers mockDocumentData={mockDocumentData} />

      <ParentDocumentTable parentDocument={parentDocument} formatDate={formatDate} />

      {request.children && request.children.length > 0 && (
        <RelatedDocumentsTable children={request.children} formatDate={formatDate} />
      )}
    </div>
  );
}