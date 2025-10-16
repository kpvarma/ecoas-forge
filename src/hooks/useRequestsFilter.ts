import { useState, useMemo } from "react";
import { Request, User as UserType } from "@/types";

interface UseRequestsFilterProps {
  initialRequests: Request[];
  itemsPerPage: number;
  columnFilters: Record<string, string>;
  searchTerm: string;
}

export const useRequestsFilter = ({
  initialRequests,
  itemsPerPage,
  columnFilters,
  searchTerm,
}: UseRequestsFilterProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRequests = useMemo(() => {
    let filtered = initialRequests.filter(request => {
      return Object.entries(columnFilters).every(([key, value]) => {
        if (!value) return true;
        const requestValue = (request as any)[key]?.toString().toLowerCase();
        return requestValue?.includes(value.toLowerCase());
      });
    });

    if (searchTerm) {
      filtered = filtered.filter(request =>
        Object.values(request).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    return filtered;
  }, [initialRequests, columnFilters, searchTerm]);

  const totalItems = filteredRequests.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredRequests.slice(startIndex, endIndex);
  }, [filteredRequests, currentPage, itemsPerPage]);

  return {
    currentPage,
    setCurrentPage,
    paginatedRequests,
    totalItems,
    totalPages,
  };
};
