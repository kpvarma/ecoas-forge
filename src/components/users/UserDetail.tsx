import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User as UserIcon, Mail, Shield, Clock } from "lucide-react";

export default function UserDetail({ user }: { user: any }) {
  if (!user) return null;

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <Card className="enterprise-card">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <UserIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">{user.name}</CardTitle>
            <div className="text-sm text-muted-foreground">{user.title}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          <div className="text-sm"><Mail className="h-3 w-3 inline mr-2" />{user.email}</div>
          <div className="text-sm"><Shield className="h-3 w-3 inline mr-2" />{user.role}</div>
          <div className="text-sm"><Clock className="h-3 w-3 inline mr-2" />Last login: {formatDate(user.last_login)}</div>
        </div>
      </CardContent>
    </Card>
  );
}
