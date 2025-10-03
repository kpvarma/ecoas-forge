import { FileText } from "lucide-react";

interface RequestsHeaderProps {
  hideControls?: boolean;
}

export function RequestsHeader({ hideControls = false }: RequestsHeaderProps) {
  if (hideControls) {
    return null;
  }
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Requests</h1>
        </div>
        <p className="text-muted-foreground mt-1">
          Manage and track all certificate of analysis requests
        </p>
      </div>
    </div>
  );
}