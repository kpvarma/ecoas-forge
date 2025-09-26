import { useState } from "react";
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

const mockUsers = [
  "Jane Smith",
  "Mike Johnson", 
  "Sarah Davis",
  "Tom Wilson"
];

export function NewTemplate() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    partNumber: "",
    plantId: "",
    owner: "",
    hintl: false,
    description: "",
    xmlFile: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!formData.plantId.trim()) {
      toast({
        title: "Validation Error",
        description: "Plant ID is required.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.xmlFile) {
      toast({
        title: "Validation Error",
        description: "XML file is required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Template Created",
      description: `Template for ${formData.partNumber} has been created successfully.`,
    });
    
    setIsSubmitting(false);
    navigate('/templates');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/templates')}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Templates
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Template</h1>
          <p className="text-muted-foreground mt-1">
            Create a new XML template for certificate of analysis generation
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card className="enterprise-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Template Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Part Number */}
              <div className="space-y-2">
                <Label htmlFor="partNumber" className="text-sm font-medium">
                  Part Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="partNumber"
                  placeholder="e.g., IPA-SG-99.9"
                  value={formData.partNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, partNumber: e.target.value }))}
                  className="w-full"
                />
              </div>

              {/* Plant ID */}
              <div className="space-y-2">
                <Label htmlFor="plantId" className="text-sm font-medium">
                  Plant ID <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="plantId"
                  placeholder="e.g., PLT-001"
                  value={formData.plantId}
                  onChange={(e) => setFormData(prev => ({ ...prev, plantId: e.target.value }))}
                  className="w-full"
                />
              </div>

              {/* XML File Upload */}
              <div className="space-y-2">
                <Label htmlFor="xmlFile" className="text-sm font-medium">
                  XML Template File <span className="text-destructive">*</span>
                </Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {formData.xmlFile ? formData.xmlFile.name : "Click to upload XML file or drag and drop"}
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
              </div>

              {/* Owner */}
              <div className="space-y-2">
                <Label htmlFor="owner" className="text-sm font-medium">
                  Owner <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <Select value={formData.owner} onValueChange={(value) => setFormData(prev => ({ ...prev, owner: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select owner or leave unassigned" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border">
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {mockUsers.map((user) => (
                      <SelectItem key={user} value={user}>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{user}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter a description for this template..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[100px]"
                />
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Create Template
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