import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Request } from "@/types";

interface RequestDetailHeaderProps {
  requestId: string;
}

export function RequestDetailHeader({ requestId }: RequestDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <Link to="/requests">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Requests
        </Button>
      </Link>
      <div className="text-right">
        <h1 className="text-lg font-bold">{requestId}</h1>
      </div>
    </div>
  );
}