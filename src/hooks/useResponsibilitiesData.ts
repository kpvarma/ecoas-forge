import { useState, useEffect, useCallback } from "react";
import { responsibilitiesClient } from "@/lib/clients/responsibilities";
import { Responsibility, User as UserType } from "@/types";

export const useResponsibilitiesData = () => {
  const [responsibilities, setResponsibilities] = useState<Responsibility[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [partNumbers, setPartNumbers] = useState<{ id: string; name: string; description: string }[]>([]);
  const [plantIds, setPlantIds] = useState<{ id: string; name: string; description: string }[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResponsibility, setEditingResponsibility] = useState<Responsibility | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [responsibilityToDelete, setResponsibilityToDelete] = useState<Responsibility | null>(null);

  const fetchResponsibilities = useCallback(async () => {
    try {
      const data = await responsibilitiesClient.index();
      setResponsibilities(data);
    } catch (error) {
      console.error("Failed to fetch responsibilities:", error);
    }
  }, []);

  const fetchDropdownData = useCallback(async () => {
    try {
      const fetchedUsers = await responsibilitiesClient.getUsers();
      setUsers(fetchedUsers);
      const fetchedPartNumbers = await responsibilitiesClient.getPartNumbers();
      setPartNumbers(fetchedPartNumbers);
      const fetchedPlantIds = await responsibilitiesClient.getPlantIds();
      setPlantIds(fetchedPlantIds);
    } catch (error) {
      console.error("Failed to fetch dropdown data:", error);
    }
  }, []);

  useEffect(() => {
    fetchResponsibilities();
    fetchDropdownData();
  }, [fetchResponsibilities, fetchDropdownData]);


  const handleEdit = (responsibility: Responsibility) => {
    setEditingResponsibility(responsibility);
    setIsFormOpen(true);
  };

  const handleDelete = (responsibility: Responsibility) => {
    setResponsibilityToDelete(responsibility);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (responsibilityToDelete) {
      try {
        await responsibilitiesClient.delete(responsibilityToDelete.id);
        fetchResponsibilities();
        setDeleteConfirmOpen(false);
        setResponsibilityToDelete(null);
      } catch (error) {
        console.error("Failed to delete responsibility:", error);
      }
    }
  };

  return {
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
    fetchResponsibilities,
    handleEdit,
    handleDelete,
    confirmDelete,
  };
};