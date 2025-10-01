import React from "react";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  title: string;
  count: number | string;
  icon?: React.ComponentType<any>;
  variant?: "default" | "success" | "warning" | "error";
};

const StatusCard: React.FC<Props> = ({
  title,
  count,
  icon: Icon,
  variant = "default",
}) => {
  const variantClasses: Record<string, string> = {
    default: "",
    success: "",
    warning: "",
    error: "",
  };

  const iconColor =
    variant === "success"
      ? "text-success"
      : variant === "warning"
      ? "text-warning"
      : variant === "error"
      ? "text-destructive"
      : "text-primary";

  return (
    <Card className={`enterprise-card ${variantClasses[variant]}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{typeof count === "number" ? count.toLocaleString() : count}</p>
          </div>
          {Icon && <Icon className={`h-8 w-8 ${iconColor}`} />}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
