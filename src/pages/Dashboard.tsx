import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  XCircle,
  TrendingUp,
  Users,
  Archive,
  Plus
} from "lucide-react";

// Mock data - will be replaced with real data later
const dashboardMetrics = {
  totalRequests: 1247,
  statusCounts: {
    queued: 45,
    parsed: 892,
    parsing_failed: 23,
    error: 12,
    abandoned: 8,
    template_generated: 267,
    template_generation_failed: 15
  },
  ownerStatusCounts: {
    unassigned: 156,
    assigned: 234,
    approved: 789,
    retried: 45,
    rejected: 23
  }
};

const quickActions = [
  { title: "New Request", icon: Plus, action: () => {}, variant: "default" as const },
  { title: "View Templates", icon: Archive, action: () => {}, variant: "outline" as const },
  { title: "Pending Reviews", icon: Clock, action: () => {}, variant: "outline" as const },
];

const StatusCard = ({ 
  title, 
  count, 
  icon: Icon, 
  variant = "default" 
}: { 
  title: string; 
  count: number; 
  icon: any; 
  variant?: "default" | "success" | "warning" | "error" 
}) => {
  const variantClasses = {
    default: "border-border",
    success: "border-success/20 bg-success-light",
    warning: "border-warning/20 bg-warning-light", 
    error: "border-error/20 bg-error-light"
  };

  return (
    <Card className={`enterprise-card ${variantClasses[variant]}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{count.toLocaleString()}</p>
          </div>
          <Icon className={`h-8 w-8 ${
            variant === 'success' ? 'text-success' :
            variant === 'warning' ? 'text-warning' :
            variant === 'error' ? 'text-error' :
            'text-primary'
          }`} />
        </div>
      </CardContent>
    </Card>
  );
};

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your eCoA operations.
          </p>
        </div>
        <div className="flex space-x-3">
          {quickActions.map((action) => (
            <Button key={action.title} variant={action.variant} onClick={action.action}>
              <action.icon className="h-4 w-4 mr-2" />
              {action.title}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard
          title="Total Requests"
          count={dashboardMetrics.totalRequests}
          icon={FileText}
        />
        <StatusCard
          title="Approved"
          count={dashboardMetrics.ownerStatusCounts.approved}
          icon={CheckCircle}
          variant="success"
        />
        <StatusCard
          title="Pending"
          count={dashboardMetrics.ownerStatusCounts.assigned}
          icon={Clock}
          variant="warning"
        />
        <StatusCard
          title="Issues"
          count={dashboardMetrics.statusCounts.error + dashboardMetrics.statusCounts.parsing_failed}
          icon={AlertTriangle}
          variant="error"
        />
      </div>

      {/* Detailed Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Status */}
        <Card className="enterprise-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Request Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(dashboardMetrics.statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm capitalize text-muted-foreground">
                  {status.replace(/_/g, ' ')}
                </span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Owner Status */}
        <Card className="enterprise-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Owner Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(dashboardMetrics.ownerStatusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {status === 'approved' && <CheckCircle className="h-4 w-4 text-success" />}
                  {status === 'assigned' && <Clock className="h-4 w-4 text-warning" />}
                  {status === 'rejected' && <XCircle className="h-4 w-4 text-error" />}
                  {status === 'unassigned' && <Users className="h-4 w-4 text-muted-foreground" />}
                  {status === 'retried' && <AlertTriangle className="h-4 w-4 text-warning" />}
                  <span className="text-sm capitalize text-muted-foreground">
                    {status}
                  </span>
                </div>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity - Placeholder for future implementation */}
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
    </div>
  );
}