import { Badge } from "@/components/ui/badge";

export const StatusBadge = ({ status, type = "request" }: { status: string; type?: "request" | "owner" | "general" }) => {
  const getVariant = () => {
    if (type === "owner") {
      switch (status) {
        case "approved": return "bg-success/10 text-success border-success/20";
        case "assigned": return "bg-warning/10 text-warning border-warning/20";
        case "rejected": return "bg-error/10 text-error border-error/20";
        case "unassigned": return "bg-muted text-muted-foreground border-border";
        default: return "bg-muted text-muted-foreground border-border";
      }
    }
    
    switch (status) {
      case "completed": case "template_generated": case "parsed":
        return "bg-success/10 text-success border-success/20";
      case "in_progress": case "queued": case "assigned":
        return "bg-warning/10 text-warning border-warning/20";
      case "failed": case "error": case "parsing_failed": case "rejected":
        return "bg-error/10 text-error border-error/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const capitalizeStatus = (status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Badge variant="outline" className={getVariant()}>
      {capitalizeStatus(status)}
    </Badge>
  );
};