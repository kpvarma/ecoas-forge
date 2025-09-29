import React from "react";
import { FileText, Files, UserX, ThumbsUp, ThumbsDown, CheckCircle, Clock, XCircle, TrendingUp, Users } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatusCard from "@/components/dashboard/StatusCard";
import BreakdownCard from "@/components/dashboard/BreakdownCard";
import RecentActivity from "@/components/dashboard/RecentActivity";

export function Dashboard() {
  // Mock data - keep this local for now, can be pulled into a hook later
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
      completed: 833,
    },
    documentStatusCounts: {
      queued: 245,
      in_progress: 456,
      failed: 67,
      completed: 2653,
    },
    approvalStatusCounts: {
      pending: 234,
      accepted: 789,
      rejected: 23,
    },
    ownerBreakdown: {
      "Jane Smith": 189,
      "Mike Johnson": 156,
      "Sarah Davis": 203,
      "Tom Wilson": 178,
      Unassigned: 156,
    },
  };

  const requestItems = Object.entries(dashboardMetrics.requestStatusCounts).map(([k, v]) => ({
    key: k,
    label: k.replace(/_/g, " "),
    value: v,
    icon:
      k === "completed" ? <CheckCircle className="h-3 w-3 text-success" /> :
      k === "in_progress" ? <Clock className="h-3 w-3 text-warning" /> :
      k === "failed" ? <XCircle className="h-3 w-3 text-destructive" /> :
      <TrendingUp className="h-3 w-3 text-muted-foreground" />,
  }));

  const documentItems = Object.entries(dashboardMetrics.documentStatusCounts).map(([k, v]) => ({
    key: k,
    label: k.replace(/_/g, " "),
    value: v,
    icon:
      k === "completed" ? <CheckCircle className="h-3 w-3 text-success" /> :
      k === "in_progress" ? <Clock className="h-3 w-3 text-warning" /> :
      k === "failed" ? <XCircle className="h-3 w-3 text-destructive" /> :
      <TrendingUp className="h-3 w-3 text-muted-foreground" />,
  }));

  const approvalItems = Object.entries(dashboardMetrics.approvalStatusCounts).map(([k, v]) => ({
    key: k,
    label: k,
    value: v,
    icon: k === "accepted" ? <ThumbsUp className="h-3 w-3 text-success" /> : k === "pending" ? <Clock className="h-3 w-3 text-warning" /> : <ThumbsDown className="h-3 w-3 text-destructive" />,
  }));

  const ownerItems = Object.entries(dashboardMetrics.ownerBreakdown).map(([k, v]) => ({
    key: k,
    label: k,
    value: v,
    icon: k === "Unassigned" ? <UserX className="h-3 w-3 text-muted-foreground" /> : <Users className="h-3 w-3 text-primary" />,
  }));

  return (
    <div className="p-6 space-y-6">
      <DashboardHeader />

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatusCard title="Total Requests" count={dashboardMetrics.totalRequests} icon={FileText} />
        <StatusCard title="Total Documents" count={dashboardMetrics.totalDocuments} icon={Files} />
        <StatusCard title="Unassigned" count={dashboardMetrics.unassigned} icon={UserX} variant="warning" />
        <StatusCard title="Total Approvals" count={dashboardMetrics.totalApprovals} icon={ThumbsUp} variant="success" />
        <StatusCard title="Total Rejections" count={dashboardMetrics.totalRejections} icon={ThumbsDown} variant="error" />
      </div>

      {/* Detailed Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
  <BreakdownCard compact title="Request Status Breakdown" titleIcon={<FileText className="h-4 w-4 mr-2 text-primary" />} items={requestItems} borderClass="border-primary" />
  <BreakdownCard compact title="Document Status Breakdown" titleIcon={<Files className="h-4 w-4 mr-2 text-secondary" />} items={documentItems} borderClass="border-secondary" />
  <BreakdownCard compact title="Approval Status Breakdown" titleIcon={<CheckCircle className="h-4 w-4 mr-2 text-accent" />} items={approvalItems} borderClass="border-accent" />
  <BreakdownCard compact title="Owner Breakdown" titleIcon={<Users className="h-4 w-4 mr-2 text-muted-foreground" />} items={ownerItems} borderClass="border-muted-foreground" />
      </div>

      <RecentActivity />
    </div>
  );
}

export default Dashboard;