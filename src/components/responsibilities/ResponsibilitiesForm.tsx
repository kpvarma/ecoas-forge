import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { responsibilitiesClient } from "@/lib/clients/responsibilities";
import { CreateResponsibilityPayload, UpdateResponsibilityPayload, Responsibility } from "@/types";
import { mockUsers as users, mockPartNumbers as partNumbers, mockPlantIds as plantIds } from "@/lib/mock/responsibilities";


interface ResponsibilitiesFormProps {
  responsibility?: Responsibility; // Make responsibility optional for creation, use Responsibility type
  onClose: () => void;
  onSave: () => void;
}

export function ResponsibilitiesForm({ responsibility, onClose, onSave }: ResponsibilitiesFormProps) {
  const [formData, setFormData] = useState<CreateResponsibilityPayload | UpdateResponsibilityPayload>(() => {
    const initialUser = responsibility?.user || users[0];
    return {
      user: initialUser,
      part_number: responsibility?.part_number || "",
      plant_id: responsibility?.plant_id || "",
      status: responsibility?.status || 'active',
    };
  });

  useEffect(() => {
    if (users.length > 0 && !formData.user) {
      setFormData(prev => ({ ...prev, user: users[0] }));
    }
  }, [users, formData.user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (responsibility && responsibility.id) {
        // Update existing responsibility
        await responsibilitiesClient.update(responsibility.id, formData as UpdateResponsibilityPayload);
      } else {
        // Create new responsibility
        await responsibilitiesClient.create(formData as CreateResponsibilityPayload);
      }
      onSave();
    } catch (error) {
      console.error("Failed to save responsibility:", error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Select User</label>
        <Select value={formData.user?.id || ""} onValueChange={(value) => {
          const selectedUser = users.find(user => user.id === value);
          if (selectedUser) {
            setFormData(prev => ({...prev, user: selectedUser}));
          }
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select user" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                <div className="flex flex-col">
                  <span>{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Part Number</label>
        <Select value={formData.part_number} onValueChange={(value) => setFormData(prev => ({...prev, part_number: value}))}>
          <SelectTrigger>
            <SelectValue placeholder="Select part number" />
          </SelectTrigger>
          <SelectContent>
            {partNumbers.map((partNo) => (
              <SelectItem key={partNo.id} value={partNo.name}>
                <div className="flex flex-col">
                  <span>{partNo.name}</span>
                  <span className="text-xs text-muted-foreground">{partNo.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Plant ID</label>
        <Select value={formData.plant_id} onValueChange={(value) => setFormData(prev => ({...prev, plant_id: value}))}>
          <SelectTrigger>
            <SelectValue placeholder="Select plant ID" />
          </SelectTrigger>
          <SelectContent>
            {plantIds.map((plantId) => (
              <SelectItem key={plantId.id} value={plantId.name}>
                <div className="flex flex-col">
                  <span>{plantId.name}</span>
                  <span className="text-xs text-muted-foreground">{plantId.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Status</label>
        <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({...prev, status: value as 'active' | 'inactive' | 'archived'}))}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Save
        </Button>
      </div>
    </form>
  );
}