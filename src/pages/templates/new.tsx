import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { TemplateForm } from "@/components/templates/TemplateForm";
import { templatesClient } from "@/lib/clients/templates";

export function NewTemplate() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (formData: any) => {
    try {
      await templatesClient.create(formData);
      toast({
        title: "Template Created",
        description: `Template for ${formData.partNumber} has been created successfully.`,
      });
      navigate('/templates');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create template.",
        variant: "destructive",
      });
      console.error("Failed to create template:", error);
    }
  };

  return (
    <TemplateForm onSubmit={handleSubmit} />
  );
}

export default NewTemplate;
