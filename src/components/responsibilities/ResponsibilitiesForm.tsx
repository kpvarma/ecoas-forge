import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for dropdowns (these would typically come from an API or context)
const mockUsers = [
  { id: "1", name: "John Smith", email: "john.smith@company.com" },
  { id: "2", name: "Sarah Johnson", email: "sarah.johnson@company.com" },
  { id: "3", name: "Michael Brown", email: "michael.brown@company.com" },
  { id: "4", name: "Emily Davis", email: "emily.davis@company.com" },
  { id: "5", name: "David Wilson", email: "david.wilson@company.com" }
];

const mockPartNumbers = [
  { id: "PN001", name: "PN001", description: "Engine Component A" },
  { id: "PN002", name: "PN002", description: "Brake System B" },
  { id: "PN003", name: "PN003", description: "Transmission C" },
  { id: "PN004", name: "PN004", description: "Steering Wheel D" },
  { id: "PN005", name: "PN005", description: "Suspension E" },
  { id: "PN006", name: "PN006", description: "Exhaust System F" },
  { id: "PN007", name: "PN007", description: "Air Filter G" },
  { id: "PN008", name: "PN008", description: "Oil Filter H" },
  { id: "PN009", name: "PN009", description: "Battery I" },
  { id: "PN010", name: "PN010", description: "Alternator J" },
  { id: "PN011", name: "PN011", description: "Radiator K" },
  { id: "PN012", name: "PN012", description: "Carburetor L" }
];

const mockPlantIds = [
  { id: "P001", name: "P001", description: "Detroit Manufacturing" },
  { id: "P002", name: "P002", description: "Chicago Assembly" },
  { id: "P003", name: "P003", description: "Houston Production" },
  { id: "P004", name: "P004", description: "Phoenix Factory" },
  { id: "P005", name: "P005", description: "Atlanta Facility" }
];

interface ResponsibilitiesFormProps {
  role: any; // Replace 'any' with actual type when available
  onClose: () => void;
  onSave: () => void;
}

export function ResponsibilitiesForm({ role, onClose, onSave }: ResponsibilitiesFormProps) {
  const [formData, setFormData] = useState({
    user: role?.user?.name || "",
    partNo: role?.part_number || "",
    plantId: role?.plant_id || "",
    hitlEnabled: role?.hitl_enabled ? "Yes" : "No"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would make API call to save the user role
    console.log('Save user role:', formData);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {role && (
        <div>
          <label className="text-sm font-medium mb-2 block">Role ID</label>
          <Input value={role.roleId} disabled className="bg-muted" />
        </div>
      )}
      
      <div>
        <label className="text-sm font-medium mb-2 block">Select User</label>
        <Select value={formData.user} onValueChange={(value) => setFormData({...formData, user: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select user" />
          </SelectTrigger>
          <SelectContent>
            {mockUsers.map((user) => (
              <SelectItem key={user.id} value={user.name}>
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
        <Select value={formData.partNo} onValueChange={(value) => setFormData({...formData, partNo: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select part number" />
          </SelectTrigger>
          <SelectContent>
            {mockPartNumbers.map((partNo) => (
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
        <Select value={formData.plantId} onValueChange={(value) => setFormData({...formData, plantId: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select plant ID" />
          </SelectTrigger>
          <SelectContent>
            {mockPlantIds.map((plantId) => (
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
        <label className="text-sm font-medium mb-2 block">HITL Enabled</label>
        <Select value={formData.hitlEnabled} onValueChange={(value) => setFormData({...formData, hitlEnabled: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select HITL setting" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
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