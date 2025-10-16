import React from "react";
import { FileText, Files, UserX, ThumbsUp, ThumbsDown, CheckCircle, Clock, XCircle, Users } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatusCard from "@/components/dashboard/StatusCard";
import BreakdownCard from "@/components/dashboard/BreakdownCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { DashboardFilter } from "@/components/dashboard/DashboardFilter";

interface DashboardFilters {
 partId?: string;
 plantId?: string;
 owner?: string;
 approvalStatus?: string;
 receivedOnFrom?: string;
 receivedOnTo?: string;
}

export function Dashboard() {
 const [filters, setFilters] = React.useState<DashboardFilters>({});

 const handleFilterChange = (newFilters: DashboardFilters) => {
   setFilters(newFilters);
   console.log("Applied Filters:", newFilters);
   // Here you would typically fetch new data based on the filters
 };

	// Mock data - keep this local for now, can be pulled into a hook later
	 const baseDashboardMetrics = {
	   totalRequests: 1247,
	   totalDocuments: 3421,
	   unassigned: 156,
	   totalRejections: 23,
	   totalAutoApprovals: 789,
	   totalHITLApprovals:43,
	   requestStatusCounts: {
	     in_progress: 234,
	     failed: 35,
	     completed: 833,
	   },
	   documentStatusCounts: {
	     in_progress: 456,
	     failed: 67,
	     completed: 2653,
	   },
	   approvalStatusCounts: {
	     pending: 234,
	     auto_approved: 789,
	     hitl_approved: 43,
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

	 const dashboardMetrics = React.useMemo(() => {
	   let filteredMetrics = { ...baseDashboardMetrics };

	   if (filters.approvalStatus) {
	     const status = filters.approvalStatus as keyof typeof baseDashboardMetrics.approvalStatusCounts;
	     filteredMetrics.approvalStatusCounts = {
	       pending: 0,
	       auto_approved: 0,
	       hitl_approved: 0,
	       rejected: 0,
	       [status]: baseDashboardMetrics.approvalStatusCounts[status as keyof typeof baseDashboardMetrics.approvalStatusCounts],
	     };
	     filteredMetrics.totalAutoApprovals = status === 'auto_approved' ? baseDashboardMetrics.approvalStatusCounts.auto_approved : 0;
	     filteredMetrics.totalHITLApprovals = status === 'hitl_approved' ? baseDashboardMetrics.approvalStatusCounts.hitl_approved : 0;
	     filteredMetrics.totalRejections = status === 'rejected' ? baseDashboardMetrics.approvalStatusCounts.rejected : 0;
	   } else {
	     filteredMetrics.totalAutoApprovals = baseDashboardMetrics.totalAutoApprovals;
	     filteredMetrics.totalHITLApprovals = baseDashboardMetrics.totalHITLApprovals;
	     filteredMetrics.totalRejections = baseDashboardMetrics.totalRejections;
	   }

	   if (filters.owner) {
	     const owner = filters.owner as keyof typeof baseDashboardMetrics.ownerBreakdown;
	     filteredMetrics.ownerBreakdown = {
	       "Jane Smith": 0,
	       "Mike Johnson": 0,
	       "Sarah Davis": 0,
	       "Tom Wilson": 0,
	       Unassigned: 0,
	       [owner]: baseDashboardMetrics.ownerBreakdown[owner],
	     };
	     filteredMetrics.unassigned = owner === 'Unassigned' ? baseDashboardMetrics.ownerBreakdown.Unassigned : 0;
	   } else {
	     filteredMetrics.unassigned = baseDashboardMetrics.unassigned;
	   }

	   // For PartId, PlantId, and Date Range, we'd need more granular mock data
	   // to effectively filter. For now, these filters will just be logged.

	   return filteredMetrics;
	 }, [filters]);

	const requestItems = Object.entries(dashboardMetrics.requestStatusCounts).map(([k, v]) => ({
		key: k,
		label: k.replace(/_/g, " "),
		value: v,
		icon:
			k === "completed" ? <CheckCircle className="h-3 w-3 text-success" /> :
			k === "in_progress" ? <Clock className="h-3 w-3 text-warning" /> :
			k === "failed" ? <XCircle className="h-3 w-3 text-destructive" /> :
			null,
	}));

	const documentItems = Object.entries(dashboardMetrics.documentStatusCounts).map(([k, v]) => ({
		key: k,
		label: k.replace(/_/g, " "),
		value: v,
		icon:
			k === "completed" ? <CheckCircle className="h-3 w-3 text-success" /> :
			k === "in_progress" ? <Clock className="h-3 w-3 text-warning" /> :
			k === "failed" ? <XCircle className="h-3 w-3 text-destructive" /> :
			null, // Removed 'queued' status, so default to null for other cases
	}));

	const approvalItems = Object.entries(dashboardMetrics.approvalStatusCounts).map(([k, v]) => ({
		key: k,
		label: k === "auto_approved" ? "Auto Approved" : k === "hitl_approved" ? "HITL Approved" : k.charAt(0).toUpperCase() + k.slice(1),
		value: v,
		icon:
			k === "auto_approved" ? <CheckCircle className="h-3 w-3 text-success" /> :
			k === "hitl_approved" ? <ThumbsUp className="h-3 w-3 text-success" /> :
			k === "pending" ? <Clock className="h-3 w-3 text-warning" /> :
			<ThumbsDown className="h-3 w-3 text-destructive" />,
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
			   <DashboardFilter onFilterChange={handleFilterChange} />

			{/* Overview Metrics */}
			<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
				<StatusCard title="Total Requests" count={dashboardMetrics.totalRequests} icon={FileText} />
				<StatusCard title="Total Documents" count={dashboardMetrics.totalDocuments} icon={Files} />
				<StatusCard title="Unassigned" count={dashboardMetrics.unassigned} icon={UserX} variant="warning" />
				<StatusCard title="Total HITL Approvals" count={dashboardMetrics.totalHITLApprovals} icon={ThumbsUp} variant="success" />
				   <StatusCard title="Total Auto Approvals" count={dashboardMetrics.totalAutoApprovals} icon={CheckCircle} variant="success" />

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
