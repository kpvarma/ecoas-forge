import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Template } from "@/types";
import { mockTemplates } from "@/lib/mock/templates";
import { TemplateForm } from "@/components/templates/TemplateForm";

export function UpdateTemplate() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;

    const currentTemplate = isEditMode ? mockTemplates.find(t => t.id === id) as Template : undefined;

    const handleSubmit = async (formData: any) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast({ title: "Template Updated", description: `Template for ${formData.partNumber} has been updated successfully.` });
        
        navigate('/templates');
    };

    return (
        <TemplateForm initialData={currentTemplate} isEditMode={true} onSubmit={handleSubmit} />
    );
}

export default UpdateTemplate;
