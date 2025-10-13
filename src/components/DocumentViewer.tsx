import { useState } from "react";
import { 
  FileText, 
  Code, 
  CheckCircle, 
  XCircle, 
  Download,
  ExternalLink,
  AlertCircle,
  Loader2,
  User,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface DocumentViewerProps {
  documentData: {
    requestId: string;
    documentName: string;
    pdfUrl: string;
    xmlContent: string;
    templateId: string;
    hasXml: boolean;
    isGenerated: boolean;
  };
  showApprovalButtons?: boolean;
}

export function DocumentViewer({ documentData, showApprovalButtons = true }: DocumentViewerProps) {
  const [approvalDialog, setApprovalDialog] = useState<{ open: boolean; type: 'approve' | 'reject' | null }>({ 
    open: false, 
    type: null 
  });
  const [comments, setComments] = useState("");
  
  const currentUser = "Krishna@entegris.com";
  const currentTime = new Date().toLocaleString();

  const handleApprovalAction = (type: 'approve' | 'reject') => {
    setApprovalDialog({ open: true, type });
    setComments("");
  };

  const handleSubmitApproval = () => {
    console.log(`${approvalDialog.type}:`, comments);
    setApprovalDialog({ open: false, type: null });
    setComments("");
  };

  return (
    <>
      {/* Document Status */}
      <Card className="enterprise-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <span className="font-medium">Request ID: {documentData.requestId}</span>
              </div>
              <Badge className="bg-success/10 text-success border-success/20">
                XML Generated
              </Badge>
              <Badge className="bg-primary/10 text-primary border-primary/20">
                Ready for Review
              </Badge>
              <Badge className="bg-muted/10 text-muted-foreground border-muted/20">
                {documentData.templateId}
              </Badge>
            </div>
            {showApprovalButtons && (
              <div className="flex space-x-2">
                <Button 
                  onClick={() => handleApprovalAction('approve')}
                  className="bg-success hover:bg-success/90"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleApprovalAction('reject')}
                  className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content - PDF and XML Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
        {/* PDF Viewer */}
        <Card className="enterprise-card h-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                PDF Document
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-full pb-4">
            <div className="h-full rounded-lg overflow-hidden mx-4">
              <iframe
                src={documentData.pdfUrl}
                className="w-full h-full border-0 rounded-lg"
                title="PDF Document"
              />
            </div>
          </CardContent>
        </Card>

        {/* XML Viewer */}
        <Card className="enterprise-card h-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center">
                <Code className="h-5 w-5 mr-2 text-primary" />
                Generated XML
              </div>
              <div className="flex items-center space-x-2">
                {documentData.hasXml ? (
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
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Template
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-full pb-4">
            {documentData.hasXml ? (
              <div className="h-full overflow-auto mx-4">
                <SyntaxHighlighter
                  language="xml"
                  style={tomorrow}
                  className="!bg-muted/30 !m-0 h-full text-sm rounded-lg"
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    background: 'hsl(var(--muted) / 0.3)',
                    height: '100%',
                    overflow: 'auto',
                    borderRadius: '0.5rem'
                  }}
                >
                  {documentData.xmlContent}
                </SyntaxHighlighter>
              </div>
            ) : (
              <div className="h-full bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border mx-4">
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

      {/* Approval Dialog */}
      {showApprovalButtons && (
        <Dialog open={approvalDialog.open} onOpenChange={(open) => setApprovalDialog({ open, type: null })}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                {approvalDialog.type === 'approve' ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2 text-success" />
                    Approve Document
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 mr-2 text-destructive" />
                    Reject Document
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{currentUser}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{currentTime}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">
                  Review Comments (Optional)
                </label>
                <Textarea
                  placeholder={`Add any comments about this document ${approvalDialog.type}...`}
                  className="min-h-[100px]"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>
                  • {approvalDialog.type === 'approve' ? 'Approving' : 'Rejecting'} this document will update the request status
                </p>
                {approvalDialog.type === 'reject' && (
                  <p>• The document will be sent back for revision</p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setApprovalDialog({ open: false, type: null })}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitApproval}
                className={approvalDialog.type === 'approve' ? 'bg-success hover:bg-success/90' : 'bg-destructive hover:bg-destructive/90'}
              >
                {approvalDialog.type === 'approve' ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Document
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Document
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}