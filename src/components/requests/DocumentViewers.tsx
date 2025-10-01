import { useState } from "react";
import Editor from '@monaco-editor/react';
import { Eye, Download, Check, X, Edit, FileText as FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DocumentViewer } from "@/components/DocumentViewer"; // Assuming this component exists and is used for PDF

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

  return (
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
  );
}