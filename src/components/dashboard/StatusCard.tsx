import React from "react";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  title: string;
  count: number;
  icon: any;
  variant?: "default" | "success" | "warning" | "error";
};

export const StatusCard: React.FC<Props> = ({
  title,
  count,
  icon: Icon,
  variant = "default",
}) => {
  const variantClasses: Record<string, string> = {
    default: "border-border",
    success: "border-success/20 bg-success-light",
    warning: "border-warning/20 bg-warning-light",
    error: "border-error/20 bg-error-light",
  };

  const iconColor =
    variant === "success"
      ? "text-success"
      : variant === "warning"
      ? "text-warning"
      : variant === "error"
      ? "text-error"
      : "text-primary";

  return (
    <Card className={`enterprise-card ${variantClasses[variant]}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{count.toLocaleString()}</p>
          </div>
          <Icon className={`h-8 w-8 ${iconColor}`} />
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
