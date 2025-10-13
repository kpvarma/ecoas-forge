import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { PaginationControls } from "@/components/common/PaginationControls";
import { ResponsibilitiesHeader } from "@/components/responsibilities/ResponsibilitiesHeader";
import { ResponsibilitiesFilter } from "@/components/responsibilities/ResponsibilitiesFilter";
import { ResponsibilitiesTable } from "@/components/responsibilities/ResponsibilitiesTable";
import { useResponsibilitiesData } from "@/hooks/useResponsibilitiesData";
import { useResponsibilitiesFilter } from "@/hooks/useResponsibilitiesFilter";
import { Responsibility } from "@/types";


export function Responsibilities() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    responsibilities,
    users,
    partNumbers,
    plantIds,
    isFormOpen,
    setIsFormOpen,
    editingResponsibility,
    setEditingResponsibility,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    responsibilityToDelete,
    setResponsibilityToDelete,
    handleEdit,
    handleDelete,
    confirmDelete,
  } = useResponsibilitiesData();

  const {
    searchTerm,
    setSearchTerm,
    selectedUser,
    setSelectedUser,
    selectedRole,
    setSelectedRole,
    selectedPartNo,
    setSelectedPartNo,
    selectedPlantId,
    setSelectedPlantId,
    filteredResponsibilities,
    clearFilters,
  } = useResponsibilitiesFilter({
    responsibilities,
    users,
    partNumbers,
    plantIds,
  });
  
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(filteredResponsibilities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResponsibilities = filteredResponsibilities.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const handleViewRequests = (responsibility: Responsibility) => {
    // Navigate to requests page with filters
    navigate(`/requests?partNumber=${responsibility.part_number}&plantId=${responsibility.plant_id}&userId=${responsibility.user.id}`);
  };

  return (
    <div className="space-y-6 p-6">
      <ResponsibilitiesHeader
        isFormOpen={isFormOpen}
        setIsFormOpen={setIsFormOpen}
        editingResponsibility={editingResponsibility}
        setEditingResponsibility={setEditingResponsibility}
      />

      <ResponsibilitiesFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        selectedPartNo={selectedPartNo}
        setSelectedPartNo={setSelectedPartNo}
        selectedPlantId={selectedPlantId}
        setSelectedPlantId={setSelectedPlantId}
        clearFilters={clearFilters}
        setCurrentPage={setCurrentPage}
        users={users}
        partNumbers={partNumbers}
        plantIds={plantIds}
      />

      <ResponsibilitiesTable
        currentResponsibilities={currentResponsibilities}
        formatDate={formatDate}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        deleteConfirmOpen={deleteConfirmOpen}
        setDeleteConfirmOpen={setDeleteConfirmOpen}
        responsibilityToDelete={responsibilityToDelete}
        confirmDelete={confirmDelete}
        handleViewRequests={handleViewRequests}
      />

      {/* Pagination */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredResponsibilities.length}
        itemsPerPage={itemsPerPage}
        startIndex={startIndex}
        endIndex={endIndex}
      />

      <ConfirmationDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Responsibility Assignment"
        description={`Are you sure you want to delete the responsibility assignment for ${responsibilityToDelete?.user?.name}? This action cannot be undone.`}
        onConfirm={confirmDelete}
      />
    </div>

  );
}
