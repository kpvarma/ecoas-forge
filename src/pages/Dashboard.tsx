import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  XCircle,
  TrendingUp,
  Users,
  Archive,
  UserX,
  ThumbsUp,
  ThumbsDown,
  Files,
  Home
} from "lucide-react";

// Mock data - will be replaced with real data later
const dashboardMetrics = {
  totalRequests: 1247,
  totalDocuments: 3421,
  unassigned: 156,
  totalRejections: 23,
  totalApprovals: 789,
  requestStatusCounts: {
    queued: 145,
    in_progress: 234,
    failed: 35,
    completed: 833
  },
  documentStatusCounts: {
    queued: 245,
    in_progress: 456,
    failed: 67,
    completed: 2653
  },
  approvalStatusCounts: {
    pending: 234,
    accepted: 789,
    rejected: 23
  },
  ownerBreakdown: {
    "Jane Smith": 189,
    "Mike Johnson": 156,
    "Sarah Davis": 203,
    "Tom Wilson": 178,
    "Unassigned": 156
  }
};

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
      <div>
        <div className="flex items-center space-x-3">
          <Home className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Dashboard</h1>
        </div>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your eCoA operations.
        </p>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatusCard
          title="Total Requests"
          count={dashboardMetrics.totalRequests}
          icon={FileText}
        />
        <StatusCard
          title="Total Documents"
          count={dashboardMetrics.totalDocuments}
          icon={Files}
        />
        <StatusCard
          title="Unassigned"
          count={dashboardMetrics.unassigned}
          icon={UserX}
          variant="warning"
        />
        <StatusCard
          title="Total Approvals"
          count={dashboardMetrics.totalApprovals}
          icon={ThumbsUp}
          variant="success"
        />
        <StatusCard
          title="Total Rejections"
          count={dashboardMetrics.totalRejections}
          icon={ThumbsDown}
          variant="error"
        />
      </div>

      {/* Detailed Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Request Status Breakdown */}
        <Card className="enterprise-card border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm font-medium">
              <FileText className="h-4 w-4 mr-2 text-primary" />
              Request Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(dashboardMetrics.requestStatusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {status === 'completed' && <CheckCircle className="h-3 w-3 text-success" />}
                  {status === 'in_progress' && <Clock className="h-3 w-3 text-warning" />}
                  {status === 'failed' && <XCircle className="h-3 w-3 text-destructive" />}
                  {status === 'queued' && <TrendingUp className="h-3 w-3 text-muted-foreground" />}
                  <span className="text-xs capitalize text-muted-foreground">
                    {status.replace(/_/g, ' ')}
                  </span>
                </div>
                <span className="text-sm font-medium">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Document Status Breakdown */}
        <Card className="enterprise-card border-l-4 border-l-secondary">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm font-medium">
              <Files className="h-4 w-4 mr-2 text-secondary" />
              Document Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(dashboardMetrics.documentStatusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {status === 'completed' && <CheckCircle className="h-3 w-3 text-success" />}
                  {status === 'in_progress' && <Clock className="h-3 w-3 text-warning" />}
                  {status === 'failed' && <XCircle className="h-3 w-3 text-destructive" />}
                  {status === 'queued' && <TrendingUp className="h-3 w-3 text-muted-foreground" />}
                  <span className="text-xs capitalize text-muted-foreground">
                    {status.replace(/_/g, ' ')}
                  </span>
                </div>
                <span className="text-sm font-medium">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Approval Status Breakdown */}
        <Card className="enterprise-card border-l-4 border-l-accent">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm font-medium">
              <CheckCircle className="h-4 w-4 mr-2 text-accent" />
              Approval Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(dashboardMetrics.approvalStatusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {status === 'accepted' && <ThumbsUp className="h-3 w-3 text-success" />}
                  {status === 'pending' && <Clock className="h-3 w-3 text-warning" />}
                  {status === 'rejected' && <ThumbsDown className="h-3 w-3 text-destructive" />}
                  <span className="text-xs capitalize text-muted-foreground">
                    {status}
                  </span>
                </div>
                <span className="text-sm font-medium">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Owner Breakdown */}
        <Card className="enterprise-card border-l-4 border-l-muted">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm font-medium">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              Owner Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(dashboardMetrics.ownerBreakdown).map(([owner, count]) => (
              <div key={owner} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {owner === 'Unassigned' ? (
                    <UserX className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <Users className="h-3 w-3 text-primary" />
                  )}
                  <span className="text-xs text-muted-foreground truncate">
                    {owner}
                  </span>
                </div>
                <span className="text-sm font-medium">{count}</span>
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