import { useState, useMemo } from "react";
import { Responsibility, User as UserType } from "@/types";

interface UseResponsibilitiesFilterProps {
  responsibilities: Responsibility[];
  users: UserType[];
  partNumbers: { id: string; name: string; description: string }[];
  plantIds: { id: string; name: string; description: string }[];
}

export const useResponsibilitiesFilter = ({
  responsibilities,
}: UseResponsibilitiesFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPartNo, setSelectedPartNo] = useState("");
  const [selectedPlantId, setSelectedPlantId] = useState("");

  const filteredResponsibilities = useMemo(() => {
    return responsibilities.filter((responsibility) => {
      const matchesSearch =
        responsibility.user.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        responsibility.user.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        responsibility.part_number
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        responsibility.plant_id
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesUser =
        !selectedUser || responsibility.user.name === selectedUser;
      const matchesRole =
        !selectedRole || responsibility.user.role === selectedRole;
      const matchesPartNo =
        !selectedPartNo || responsibility.part_number === selectedPartNo;
      const matchesPlantId =
        !selectedPlantId || responsibility.plant_id === selectedPlantId;

      return (
        matchesSearch &&
        matchesUser &&
        matchesRole &&
        matchesPartNo &&
        matchesPlantId
      );
    });
  }, [
    responsibilities,
    searchTerm,
    selectedUser,
    selectedRole,
    selectedPartNo,
    selectedPlantId,
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedUser("");
    setSelectedRole("");
    setSelectedPartNo("");
    setSelectedPlantId("");
  };

  return {
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
  };
};