import { Search, Filter } from "lucide-react";
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
import { User } from "@/types";

interface DropdownItem {
  id: string;
  name: string;
  description: string;
}

interface ResponsibilitiesFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  selectedUser: string;
  setSelectedUser: (user: string) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  selectedPartNo: string;
  setSelectedPartNo: (partNo: string) => void;
  selectedPlantId: string;
  setSelectedPlantId: (plantId: string) => void;
  clearFilters: () => void;
  setCurrentPage: (page: number) => void;
  users: User[];
  partNumbers: DropdownItem[];
  plantIds: DropdownItem[];
  hideControls?: boolean; // New prop to hide controls
}

export function ResponsibilitiesFilter({
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters,
  selectedUser,
  setSelectedUser,
  selectedRole,
  setSelectedRole,
  selectedPartNo,
  setSelectedPartNo,
  selectedPlantId,
  setSelectedPlantId,
  clearFilters,
  setCurrentPage,
  users,
  partNumbers,
  plantIds,
  hideControls = false, // Default to false
}: ResponsibilitiesFilterProps) {
  if (hideControls) {
    return null; // Render nothing if hideControls is true
  }

  return (
    <>
      {/* Search Bar and Filter Toggle */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by user name, email, part number, or plant ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="shrink-0"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="rounded-lg border p-4 space-y-4 bg-muted/50">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">User</label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.name}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Role</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Part No</label>
              <Select value={selectedPartNo} onValueChange={setSelectedPartNo}>
                <SelectTrigger>
                  <SelectValue placeholder="Select part no" />
                </SelectTrigger>
                <SelectContent>
                  {partNumbers.map((partNo) => (
                    <SelectItem key={partNo.id} value={partNo.name}>
                      {partNo.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Plant ID</label>
              <Select value={selectedPlantId} onValueChange={setSelectedPlantId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select plant ID" />
                </SelectTrigger>
                <SelectContent>
                  {plantIds.map((plantId) => (
                    <SelectItem key={plantId.id} value={plantId.name}>
                      {plantId.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      )}
    </>
  );
}