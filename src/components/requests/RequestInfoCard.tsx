import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Request } from "@/types";

interface RequestInfoCardProps {
  request: Request;
  formatDateOnly: (dateString: string) => string;
  formatDateTime: (dateString: string) => string;
}

export function RequestInfoCard({ request, formatDateOnly, formatDateTime }: RequestInfoCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card className="enterprise-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{request.children[0].id}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">STATUS:</span>
                <StatusBadge status={request.status} type="status" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">APPROVAL STATUS:</span>
                <StatusBadge status={request.owner_status} type="approval" />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showDetails && (
          <div className="grid grid-cols-3 gap-4 text-sm">
            {/* Row 1: Request / Document ID, Subject, Owner */}
            
            <div>
              <div className="text-muted-foreground mb-1">Document Name</div>
              <div className="font-medium">{request.children[0].document_name}</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Owner</div>
              <div className="font-medium">{request.owner || "Unassigned"}</div>
            </div>

            {/* Row 2: Plant ID, Part Number, Originator */}
            <div>
              <div className="text-muted-foreground mb-1">Plant ID</div>
              <div className="font-medium">PLT-001</div> {/* Mocked data */}
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Part Number</div>
              <div className="font-medium">IPA-SG-99.9</div> {/* Mocked data */}
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Originator</div>
              <div className="font-medium">
                <div>John Doe</div> {/* Mocked data */}
                <div className="text-muted-foreground text-xs">{request.initiator_email}</div>
              </div>
            </div>
         
            {/* Row 4: Created At, Updated At */}
            <div>
              <div className="text-muted-foreground mb-1">Received On</div>
              <div className="font-medium">{formatDateOnly(request.created_at)}</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Updated At</div>
              <div className="font-medium">{formatDateTime(request.updated_at)}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}