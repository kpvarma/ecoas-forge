import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  FileText, 
  Code, 
  CheckCircle, 
  XCircle, 
  Download,
  ExternalLink,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const mockDocumentData = {
  requestId: "REQ-2024-001",
  documentName: "Semiconductor Grade Chemical Analysis",
  pdfUrl: "/docs/sample1.pdf",
  xmlContent: `<?xml version="1.0" encoding="UTF-8"?>
<certificate_of_analysis>
  <header>
    <document_id>COA-2024-001</document_id>
    <batch_number>SG-240115-001</batch_number>
    <product_name>Semiconductor Grade Isopropanol</product_name>
    <manufacturer>Entegris Inc.</manufacturer>
    <test_date>2024-01-15</test_date>
  </header>
  
  <specifications>
    <parameter name="Purity" value="99.9%" specification=">= 99.5%" status="Pass" />
    <parameter name="Water Content" value="0.02%" specification="<= 0.05%" status="Pass" />
    <parameter name="Residue after Evaporation" value="0.001%" specification="<= 0.002%" status="Pass" />
    <parameter name="Acidity" value="0.0001%" specification="<= 0.0005%" status="Pass" />
    <parameter name="Basicity" value="0.0001%" specification="<= 0.0005%" status="Pass" />
  </specifications>
  
  <quality_control>
    <tested_by>John Analyst</tested_by>
    <approved_by>Jane Manager</approved_by>
    <certification_date>2024-01-15</certification_date>
  </quality_control>
</certificate_of_analysis>`,
  templateId: "TMPL-IPA-001",
  hasXml: true,
  isGenerated: true
};

export function Approval() {
  const { id } = useParams();
  const docData = mockDocumentData;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to={`/requests/${id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Request
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Document Approval</h1>
          <p className="text-muted-foreground mt-1">{docData.documentName}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Link to={`/templates/${docData.templateId}`}>
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Template
            </Button>
          </Link>
        </div>
      </div>

      {/* Document Status */}
      <Card className="enterprise-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <span className="font-medium">Request ID: {docData.requestId}</span>
              </div>
              <Badge className="bg-success/10 text-success border-success/20">
                XML Generated
              </Badge>
              <Badge className="bg-primary/10 text-primary border-primary/20">
                Ready for Review
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Template: {docData.templateId}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content - PDF and XML Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-300px)]">
        {/* PDF Viewer */}
        <Card className="enterprise-card h-full">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              PDF Document
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-full">
            <div className="h-full bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
              <div className="text-center p-8">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">PDF Viewer</h3>
                <p className="text-muted-foreground mb-4">
                  PDF document would be displayed here
                </p>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* XML Viewer */}
        <Card className="enterprise-card h-full">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Code className="h-5 w-5 mr-2 text-primary" />
                Generated XML
              </div>
              {docData.hasXml ? (
                <Badge className="bg-success/10 text-success border-success/20">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Generated
                </Badge>
              ) : (
                <Badge className="bg-warning/10 text-warning border-warning/20">
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Generating...
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-full">
            {docData.hasXml ? (
              <div className="h-full">
                <pre className="h-full overflow-auto p-4 bg-muted/30 text-sm font-mono rounded-lg border">
                  <code>{docData.xmlContent}</code>
                </pre>
              </div>
            ) : (
              <div className="h-full bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                <div className="text-center p-8">
                  <AlertCircle className="h-16 w-16 mx-auto text-warning mb-4" />
                  <h3 className="text-lg font-medium mb-2">XML Not Generated</h3>
                  <p className="text-muted-foreground mb-4">
                    XML content is currently being processed. This may take a few minutes.
                  </p>
                  <Button variant="outline" size="sm">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Refresh Status
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Approval Actions */}
      <Card className="enterprise-card">
        <CardHeader>
          <CardTitle>Review & Approval</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">
              Review Comments (Optional)
            </label>
            <Textarea
              placeholder="Add any comments about this document review..."
              className="min-h-[100px]"
            />
          </div>
          
          <div className="flex space-x-4 pt-4">
            <Button className="flex-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Document
            </Button>
            <Button variant="outline" className="flex-1">
              <XCircle className="h-4 w-4 mr-2" />
              Reject & Send Back
            </Button>
            <Button variant="outline">
              Save as Draft
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground pt-2">
            <p>
              • Approving this document will update the request status to "Approved"
            </p>
            <p>
              • Rejecting will send the document back for revision
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}