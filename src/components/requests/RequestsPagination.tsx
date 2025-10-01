import { PaginationControls } from "@/components/common/PaginationControls";

interface RequestsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
}

export function RequestsPagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  startIndex,
  endIndex,
}: RequestsPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <PaginationControls
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      startIndex={startIndex}
      endIndex={endIndex}
    />
  );
}