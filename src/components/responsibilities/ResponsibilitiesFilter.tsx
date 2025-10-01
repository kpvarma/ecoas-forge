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
  selectedHitl: string;
  setSelectedHitl: (hitl: string) => void;
  clearFilters: () => void;
  setCurrentPage: (page: number) => void;
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
  selectedHitl,
  setSelectedHitl,
  clearFilters,
  setCurrentPage,
}: ResponsibilitiesFilterProps) {
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
                  {mockUsers.map((user) => (
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
                  {mockPartNumbers.map((partNo) => (
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
                  {mockPlantIds.map((plantId) => (
                    <SelectItem key={plantId.id} value={plantId.name}>
                      {plantId.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">HITL Enabled</label>
              <Select value={selectedHitl} onValueChange={setSelectedHitl}>
                <SelectTrigger>
                  <SelectValue placeholder="Select HITL" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
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