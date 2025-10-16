import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Request } from "@/types";
import { generateMockRequests } from "@/lib/mock/requests";
import { useRequestsFilter } from "@/hooks/useRequestsFilter";
import { RequestsHeader } from "@/components/requests/RequestsHeader";
import { RequestsTable } from "@/components/requests/RequestsTable";
import { RequestsPagination } from "@/components/requests/RequestsPagination";
import { Input } from "@/components/ui/input";

export function Requests() {
	const [showFilters, setShowFilters] = useState(false);
	const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
	const [columnFilters, setColumnFilters] = useState<Record<string, string>>({
		id: "",
		lot_id: "",
		part_number: "",
		plant_id: "",
		document_name: "",
		status: "",
		owner_status: "",
		owner: "",
		supplier: "",
		created_at: "",
		updated_at: "",
	});
	const [searchTerm, setSearchTerm] = useState("");
	const initialRequests = generateMockRequests();
	const itemsPerPage = 10;
	const navigate = useNavigate();

	const handleFilterChange = (columnId: string, value: string) => {
		setColumnFilters(prevFilters => ({
			...prevFilters,
			[columnId]: value,
		}));
	};

	const handleSearchTermChange = (term: string) => {
		setSearchTerm(term);
		setCurrentPage(1); // Reset to first page on new search
	};

	const {
		currentPage,
		setCurrentPage,
		paginatedRequests,
		totalItems,
		totalPages,
	} = useRequestsFilter({ initialRequests, itemsPerPage, columnFilters, searchTerm });

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
			<RequestsHeader />
			<div className="mb-4">
				<Input
					placeholder="Search requests..."
					value={searchTerm}
					onChange={(event) => handleSearchTermChange(event.target.value)}
					className="w-full px-4 py-2"
				/>
			</div>
			<RequestsTable
				paginatedData={paginatedData}
				expandedRows={expandedRows}
				toggleRowExpansion={toggleRowExpansion}
				handleViewRequest={handleViewRequest}
				handleViewDetail2={handleViewDetail2}
				handleViewDocument={handleViewDocument}
				columnFilters={columnFilters}
				onFilterChange={handleFilterChange}
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
