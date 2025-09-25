import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Detail_2() {
  const { id } = useParams();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Requests
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Request Details (Alternative View)</h1>
          <p className="text-muted-foreground mt-1">
            Viewing request {id}
          </p>
        </div>
      </div>

      {/* Content Placeholder */}
      <Card className="enterprise-card">
        <CardHeader>
          <CardTitle>Alternative Detail View - Under Construction</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is an alternative detail view for request {id}. Content will be added here later.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}