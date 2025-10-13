import { useState, useMemo } from "react";
import { Request } from "@/types";

interface UseRequestsFilterProps {
  initialRequests: Request[];
  itemsPerPage: number;
}

export const useRequestsFilter = ({ initialRequests, itemsPerPage }: UseRequestsFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [approvalStatusFilter, setApprovalStatusFilter] = useState<string>("all");
  const [ownerFilter, setOwnerFilter] = useState<string>("all");
  const [plantIdFilter, setPlantIdFilter] = useState<string>("all");
  const [partNumberFilter, setPartNumberFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRequests = useMemo(() => {
    return initialRequests.filter(request => {
      const matchesSearch =
        request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.document_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.initiator_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (request.plant_id && request.plant_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (request.part_number && request.part_number.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === "all" || request.status === statusFilter;
      const matchesApprovalStatus = approvalStatusFilter === "all" || request.owner_status === approvalStatusFilter;
      const matchesOwner =
        ownerFilter === "all" ||
        (ownerFilter === "unassigned" && !request.owner) ||
        (request.owner && request.owner.toLowerCase().includes(ownerFilter.toLowerCase()));
      const matchesPlantId = plantIdFilter === "all" || request.plant_id === plantIdFilter;
      const matchesPartNumber = partNumberFilter === "all" || request.part_number === partNumberFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesApprovalStatus &&
        matchesOwner &&
        matchesPlantId &&
        matchesPartNumber
      );
    });
  }, [
    initialRequests,
    searchTerm,
    statusFilter,
    approvalStatusFilter,
    ownerFilter,
    plantIdFilter,
    partNumberFilter,
  ]);

  const totalItems = filteredRequests.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredRequests.slice(startIndex, endIndex);
  }, [filteredRequests, currentPage, itemsPerPage]);

  return {
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
  };
};