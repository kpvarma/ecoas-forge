import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, User, FileText, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Template } from "@/types";

interface TemplateFormProps {
  initialData?: Template;
  isEditMode?: boolean;
  onSubmit: (data: TemplateFormData) => Promise<void>;
}

interface TemplateFormData {
  partNumber: string;
  plantId: string;
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
    partNumber: initialData?.part_no || "",
    plantId: initialData?.plant_id || "",
    hintl: initialData?.hintl_enabled || false,
    xmlFile: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        partNumber: initialData.part_no || "",
        plantId: initialData.plant_id || "",
        hintl: initialData.hintl_enabled || false,
        xmlFile: null, // XML file is not pre-filled for security/practical reasons
      });
    }
  }, [initialData]);

  // Add a useEffect to update formData when initialData changes, especially for partNumber and plantId
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        partNumber: initialData.part_no || "",
        plantId: initialData.plant_id || "",
        owner: initialData.owners?.[0] || "unassigned",
        hintl: initialData.hintl_enabled || false,
        description: initialData.description || "",
      }));
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

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsSubmitting(true);
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Part Number */}
              <div className="space-y-2">
                <Label htmlFor="partNumber" className="text-sm font-medium">
                  Part Number <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.partNumber}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, partNumber: value }))}
                >
                  <SelectTrigger id="partNumber" className="w-full">
                    <SelectValue placeholder="Select a part number" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPartNumbers.map((partNumber) => (
                      <SelectItem key={partNumber} value={partNumber}>
                        {partNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Plant ID (only for edit mode, or if it's a new field) */}
              {isEditMode && (
                <div className="space-y-2">
                  <Label htmlFor="plantId" className="text-sm font-medium">Plant ID <span className="text-destructive">*</span></Label>
                  <Input id="plantId" placeholder="e.g., PLT-001" value={formData.plantId} onChange={(e) => setFormData(prev => ({ ...prev, plantId: e.target.value }))} className="w-full" />
                </div>
              )}

              {/* XML File Upload */}
              <div className="space-y-2">
                <Label htmlFor="xmlFile" className="text-sm font-medium">
                  XML Template File {isEditMode ? "" : <span className="text-destructive">*</span>}
                </Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {formData.xmlFile ? formData.xmlFile.name : (isEditMode && initialData ? initialData.xml_file : "Click to upload XML file or drag and drop")}
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
                {isEditMode && !formData.xmlFile && initialData?.xml_file && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>Current: {initialData.xml_file}</span>
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
                      {isEditMode ? "Save Changes" : "Create Template"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}