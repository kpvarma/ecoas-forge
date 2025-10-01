import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Request } from "@/types";
import { generateMockRequests } from "@/lib/mock/requests";
import { useRequestsFilter } from "@/hooks/useRequestsFilter";
import { RequestsHeader } from "@/components/requests/RequestsHeader";
import { RequestsFilter } from "@/components/requests/RequestsFilter";
import { RequestsTable } from "@/components/requests/RequestsTable";
import { RequestsPagination } from "@/components/requests/RequestsPagination";

export function Requests() {
	const [showFilters, setShowFilters] = useState(false);
	const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
	const initialRequests = generateMockRequests();
	const itemsPerPage = 10;
	const navigate = useNavigate();

	const {
		searchTerm,
		setSearchTerm,
		statusFilter,
		setStatusFilter,
		approvalStatusFilter,
		setApprovalStatusFilter,
		ownerFilter,
		setOwnerFilter,
		plantIdFilter,
		setPlantIdFilter,
		partNumberFilter,
		setPartNumberFilter,
		currentPage,
		setCurrentPage,
		filteredRequests,
		paginatedRequests,
		totalItems,
		totalPages,
	} = useRequestsFilter({ initialRequests, itemsPerPage });

	const getPaginatedData = () => {
		let flattenedData: Array<{item: Request; isChild: boolean; parent?: Request}> = [];
    
		paginatedRequests.forEach(request => {
			flattenedData.push({ item: request, isChild: false });
			if (expandedRows.has(request.id) && request.children) {
				request.children.forEach(child => {
					flattenedData.push({ item: child, isChild: true, parent: request });
				});
			}
		});

		return flattenedData;
	};

	const paginatedData = getPaginatedData();

	const toggleRowExpansion = (requestId: string) => {
		const newExpanded = new Set(expandedRows);
		if (newExpanded.has(requestId)) {
			newExpanded.delete(requestId);
		} else {
			newExpanded.add(requestId);
		}
		setExpandedRows(newExpanded);
	};

	const handleViewRequest = (id: string) => {
		navigate(`/requests/${id}`);
	};

	const handleViewDetail2 = (id: string) => {
		navigate(`/requests/${id}/detail2`);
	};

	const handleViewDocument = (id: string) => {
		navigate(`/requests/${id}/approval`);
	};

	return (
		<div className="p-6 space-y-6">
			<RequestsHeader  />
	
			<RequestsFilter
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				statusFilter={statusFilter}
				setStatusFilter={setStatusFilter}
				approvalStatusFilter={approvalStatusFilter}
				setApprovalStatusFilter={setApprovalStatusFilter}
				ownerFilter={ownerFilter}
				setOwnerFilter={setOwnerFilter}
				plantIdFilter={plantIdFilter}
				setPlantIdFilter={setPlantIdFilter}
				partNumberFilter={partNumberFilter}
				setPartNumberFilter={setPartNumberFilter}
				showFilters={showFilters}
				setShowFilters={setShowFilters}
				hideControls={true}
			/>

			<RequestsTable
				paginatedData={paginatedData}
				expandedRows={expandedRows}
				toggleRowExpansion={toggleRowExpansion}
				handleViewRequest={handleViewRequest}
				handleViewDetail2={handleViewDetail2}
				handleViewDocument={handleViewDocument}
			/>
		        
			<RequestsPagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
				totalItems={totalItems}
				itemsPerPage={itemsPerPage}
				startIndex={(currentPage - 1) * itemsPerPage}
				endIndex={currentPage * itemsPerPage}
			/>
		</div>
	);
}

export default Requests;
