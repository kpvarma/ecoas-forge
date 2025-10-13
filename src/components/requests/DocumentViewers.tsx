import { useState } from "react";
import Editor from '@monaco-editor/react';
import { Eye, Download, Check, X, Edit, FileText as FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DocumentViewersProps {
  mockDocumentData: {
    requestId: string;
    documentName: string;
    pdfUrl: string;
    xmlContent: string;
    templateId: string;
    hasXml: boolean;
    isGenerated: boolean;
  };
}

export function DocumentViewers({ mockDocumentData }: DocumentViewersProps) {
  const [xmlEditMode, setXmlEditMode] = useState(false);
  const [xmlContent, setXmlContent] = useState(mockDocumentData.xmlContent);
  const [showPdfFullScreen, setShowPdfFullScreen] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const handleXmlChange = (value: string | undefined) => {
    if (value) {
      try {
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

  const handleApprove = () => {
    console.log("Document Approved");
    setShowApproveDialog(false);
  };

  const handleReject = () => {
    console.log("Document Rejected");
    setShowRejectDialog(false);
  };
 
   return (
     <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PDF Viewer */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">PDF Document</h3>
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" className="h-7 px-2" onClick={() => setShowPdfFullScreen(true)}>
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
              <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Approve
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Approval</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to approve this document? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleApprove}>Approve</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Reject
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Rejection</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to reject this document? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReject}>Reject</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
                  // onClick={() => setXmlEditMode(true)}
                  disabled={!mockDocumentData.hasXml}
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

      <Dialog open={showPdfFullScreen} onOpenChange={setShowPdfFullScreen}>
        <DialogContent className="max-w-full h-full flex flex-col">
          <DialogHeader>
            <DialogTitle>{mockDocumentData.documentName} (PDF)</DialogTitle>
            <DialogDescription>
              Full-screen view of the PDF document.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow">
            <iframe
              src={mockDocumentData.pdfUrl}
              className="w-full h-full border-0"
              title="PDF Document Full Screen"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
 
