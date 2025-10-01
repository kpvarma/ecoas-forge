import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaginationControls } from "@/components/common/PaginationControls";
import { ResponsibilitiesHeader } from "@/components/responsibilities/ResponsibilitiesHeader";
import { ResponsibilitiesFilter } from "@/components/responsibilities/ResponsibilitiesFilter";
import { ResponsibilitiesTable } from "@/components/responsibilities/ResponsibilitiesTable";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";

// Mock user roles data - in real app this would come from API
const mockUserRoles = [
  {
    id: "1",
    roleId: "ROLE-1001",
    user: {
      name: "John Smith",
      email: "john.smith@company.com"
    },
    role: "ADMIN",
    part_number: "PN001",
    plant_id: "P001",
    hitl_enabled: true,
    created_at: "2024-01-15T08:30:00Z"
  },
  {
    id: "2",
    roleId: "ROLE-1002",
    user: {
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com"
    },
    role: "USER",
    part_number: "PN004",
    plant_id: "P003",
    hitl_enabled: false,
    created_at: "2024-01-14T14:20:00Z"
  },
  {
    id: "3",
    roleId: "ROLE-1003",
    user: {
      name: "Michael Brown",
      email: "michael.brown@company.com"
    },
    role: "USER",
    part_number: "PN006",
    plant_id: "P001",
    hitl_enabled: true,
    created_at: "2024-01-13T11:45:00Z"
  },
  {
    id: "4",
    roleId: "ROLE-1004",
    user: {
      name: "Emily Davis",
      email: "emily.davis@company.com"
    },
    role: "ADMIN",
    part_number: "PN007",
    plant_id: "P002",
    hitl_enabled: false,
    created_at: "2024-01-12T09:15:00Z"
  },
  {
    id: "5",
    roleId: "ROLE-1005",
    user: {
      name: "David Wilson",
      email: "david.wilson@company.com"
    },
    role: "USER",
    part_number: "PN011",
    plant_id: "P003",
    hitl_enabled: true,
    created_at: "2024-01-11T16:30:00Z"
  }
];

export function Responsibilities() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<any>(null);
  
  // Filter states
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPartNo, setSelectedPartNo] = useState("");
  const [selectedPlantId, setSelectedPlantId] = useState("");
  const [selectedHitl, setSelectedHitl] = useState("");
  
  const itemsPerPage = 10;

  // Filter user roles based on search term and filters
  const filteredUserRoles = mockUserRoles.filter(userRole => {
    const matchesSearch = userRole.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userRole.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userRole.part_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userRole.plant_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUser = !selectedUser || userRole.user.name === selectedUser;
    const matchesRole = !selectedRole || userRole.role === selectedRole;
    const matchesPartNo = !selectedPartNo || userRole.part_number === selectedPartNo;
    const matchesPlantId = !selectedPlantId || userRole.plant_id === selectedPlantId;
    const matchesHitl = !selectedHitl ||
                       (selectedHitl === "Yes" && userRole.hitl_enabled) ||
                       (selectedHitl === "No" && !userRole.hitl_enabled);

    return matchesSearch && matchesUser && matchesRole && matchesPartNo && matchesPlantId && matchesHitl;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredUserRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUserRoles = filteredUserRoles.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const clearFilters = () => {
    setSelectedUser("");
    setSelectedRole("");
    setSelectedPartNo("");
    setSelectedPlantId("");
    setSelectedHitl("");
  };

  const toggleHitl = (id: string) => {
    // In real app, this would make API call to update the user role
    console.log(`Toggle HITL for user role ${id}`);
  };

  const handleEdit = (role: any) => {
    setEditingRole(role);
    setIsFormOpen(true);
  };

  const handleDelete = (role: any) => {
    setRoleToDelete(role);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    // In real app, this would make API call to delete the user role
    console.log('Delete user role:', roleToDelete?.id);
    setDeleteConfirmOpen(false);
    setRoleToDelete(null);
  };

  return (
    <div className="space-y-6 p-6">
      <ResponsibilitiesHeader
        isFormOpen={isFormOpen}
        setIsFormOpen={setIsFormOpen}
        editingRole={editingRole}
        setEditingRole={setEditingRole}
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
        selectedHitl={selectedHitl}
        setSelectedHitl={setSelectedHitl}
        clearFilters={clearFilters}
        setCurrentPage={setCurrentPage}
      />

      <ResponsibilitiesTable
        currentUserRoles={currentUserRoles}
        formatDate={formatDate}
        toggleHitl={toggleHitl}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        deleteConfirmOpen={deleteConfirmOpen}
        setDeleteConfirmOpen={setDeleteConfirmOpen}
        roleToDelete={roleToDelete}
        confirmDelete={confirmDelete}
      />

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredUserRoles.length}
        itemsPerPage={itemsPerPage}
        startIndex={startIndex}
        endIndex={endIndex}
      />
    </div>
  );
}