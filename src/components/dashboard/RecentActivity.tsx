import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export const RecentActivity: React.FC = () => {
  return (
    <Card className="enterprise-card">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Recent activity will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
