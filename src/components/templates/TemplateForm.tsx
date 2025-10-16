import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, User, FileText, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useToast } from "@/components/ui/use-toast";
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
import { Template } from "@/types";

interface TemplateFormProps {
  initialData?: Template;
  isEditMode?: boolean;
  onSubmit: (data: TemplateFormData) => Promise<void>;
}

interface TemplateFormData {
  partNumber: string;
  hintl: boolean;
  xmlFile: File | null;
}

const mockUsers = [
  "Jane Smith",
  "Mike Johnson", 
  "Sarah Davis",
  "Tom Wilson"
];

const mockPartNumbers = [
  "IPA-SG-99.9",
  "IPA-SG-99.5",
  "IPA-SG-99.0",
  "IPA-SG-98.0",
];

export function TemplateForm({ initialData, isEditMode = false, onSubmit }: TemplateFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<TemplateFormData>({
    partNumber: initialData?.part_id ? String(initialData.part_id) : "",
    hintl: initialData?.hintl_enabled || false,
    xmlFile: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        partNumber: initialData.part_id ? String(initialData.part_id) : "",
        hintl: initialData.hintl_enabled || false,
        xmlFile: null, // XML file is not pre-filled for security/practical reasons
      });
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'text/xml' && !file.name.endsWith('.xml')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an XML file.",
          variant: "destructive",
        });
        return;
      }
      setFormData(prev => ({ ...prev, xmlFile: file }));
    }
  };

  const handlePreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.partNumber.trim()) {
      toast({
        title: "Validation Error",
        description: "Part Number is required.",
        variant: "destructive",
      });
      return;
    }

    if (!isEditMode && !formData.xmlFile) {
      toast({
        title: "Validation Error",
        description: "XML file is required.",
        variant: "destructive",
      });
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setShowConfirmDialog(false);
    await onSubmit(formData);
    setIsSubmitting(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/templates')} className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Templates
        </Button>
        <div>
          <h1 className="text-3xl font-bold" style={{textAlign:"center"}}>{isEditMode ? "Edit Template" : "New Template"}</h1>
          <p className="text-muted-foreground mt-1">{isEditMode ? `Editing template ${initialData?.id}` : "Create a new XML template for certificate of analysis generation"}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="enterprise-card">
          <CardHeader>
            <CardTitle className="flex items-center"><FileText className="h-5 w-5 mr-2 text-primary"/>Template Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePreSubmit} className="space-y-6">
              {/* Part Number */}
              <div className="space-y-2">
                <Label htmlFor="partNumber" className="text-sm font-medium flex items-center">
                  Part Number <span className="text-destructive ml-1">*</span>
                  {isEditMode && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Part number cannot be changed in edit mode.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </Label>
                {isEditMode ? (
                  <Input
                    id="partNumber"
                    value={formData.partNumber}
                    readOnly
                    className="w-full bg-gray-100 cursor-not-allowed"
                  />
                ) : (
                  <SearchableSelect
                    placeholder="Select a part number"
                    options={mockPartNumbers.map(partNumber => ({ label: partNumber, value: partNumber }))}
                    value={formData.partNumber}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, partNumber: value }))}
                  />
                )}
              </div>


              {/* XML File Upload */}
              <div className="space-y-2">
                <Label htmlFor="xmlFile" className="text-sm font-medium">
                  XML Template File {isEditMode ? "" : <span className="text-destructive">*</span>}
                </Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {formData.xmlFile ? formData.xmlFile.name : (isEditMode && initialData?.xml_file_path ? initialData.xml_file_path.split('/').pop() : "Click to upload XML file or drag and drop")}
                    </p>
                    <input
                      id="xmlFile"
                      type="file"
                      accept=".xml,text/xml"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('xmlFile')?.click()}
                    >
                      Choose File
                    </Button>
                  </div>
                </div>
                {formData.xmlFile && (
                  <div className="flex items-center space-x-2 text-sm text-success">
                    <FileText className="h-4 w-4" />
                    <span>{formData.xmlFile.name}</span>
                  </div>
                )}
                {isEditMode && !formData.xmlFile && initialData?.xml_file_path && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>Current: {initialData.xml_file_path.split('/').pop()}</span>
                  </div>
                )}
              </div>

              {/* HINTL */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Switch
                    id="hintl"
                    checked={formData.hintl}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hintl: checked }))}
                  />
                  <Label htmlFor="hintl" className="text-sm font-medium">
                    Enable Human in the Loop (HINTL)
                  </Label>
                </div>
                <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>
                    When enabled, human review will be required before automated processing for this part number.
                  </p>
                </div>
              </div>


              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/templates')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                      {isEditMode ? "Saving..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      {isEditMode ? "Save Changes" : "Upload Template"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Template Upload</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to upload this template to part number "{formData.partNumber}"?
              This action will associate the uploaded XML file with the specified part number.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Upload"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}