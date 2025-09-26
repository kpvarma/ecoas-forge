import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Filter, Plus, User } from "lucide-react";

// Mock user roles data - in real app this would come from API
const mockUserRoles = [
  {
    id: "1",
    user: {
      name: "John Smith",
      email: "john.smith@company.com"
    },
    role: "ADMIN",
    part_numbers: ["PN001", "PN002", "PN003"],
    plant_ids: ["P001", "P002"],
    hitl_enabled: true,
    created_at: "2024-01-15T08:30:00Z"
  },
  {
    id: "2",
    user: {
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com"
    },
    role: "USER",
    part_numbers: ["PN004", "PN005"],
    plant_ids: ["P003"],
    hitl_enabled: false,
    created_at: "2024-01-14T14:20:00Z"
  },
  {
    id: "3",
    user: {
      name: "Michael Brown",
      email: "michael.brown@company.com"
    },
    role: "USER",
    part_numbers: ["PN006"],
    plant_ids: ["P001", "P004"],
    hitl_enabled: true,
    created_at: "2024-01-13T11:45:00Z"
  },
  {
    id: "4",
    user: {
      name: "Emily Davis",
      email: "emily.davis@company.com"
    },
    role: "ADMIN",
    part_numbers: ["PN007", "PN008", "PN009", "PN010"],
    plant_ids: ["P002", "P005"],
    hitl_enabled: false,
    created_at: "2024-01-12T09:15:00Z"
  },
  {
    id: "5",
    user: {
      name: "David Wilson",
      email: "david.wilson@company.com"
    },
    role: "USER",
    part_numbers: ["PN011", "PN012"],
    plant_ids: ["P003", "P004", "P005"],
    hitl_enabled: true,
    created_at: "2024-01-11T16:30:00Z"
  }
];

// Mock data for dropdowns
const mockUsers = [
  { id: "1", name: "John Smith", email: "john.smith@company.com" },
  { id: "2", name: "Sarah Johnson", email: "sarah.johnson@company.com" },
  { id: "3", name: "Michael Brown", email: "michael.brown@company.com" },
  { id: "4", name: "Emily Davis", email: "emily.davis@company.com" },
  { id: "5", name: "David Wilson", email: "david.wilson@company.com" }
];

const mockPartNumbers = ["PN001", "PN002", "PN003", "PN004", "PN005", "PN006", "PN007", "PN008", "PN009", "PN010", "PN011", "PN012"];
const mockPlantIds = ["P001", "P002", "P003", "P004", "P005"];

export function Roles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  
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
                         userRole.part_numbers.some(pn => pn.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         userRole.plant_ids.some(pid => pid.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesUser = !selectedUser || userRole.user.name === selectedUser;
    const matchesRole = !selectedRole || userRole.role === selectedRole;
    const matchesPartNo = !selectedPartNo || userRole.part_numbers.includes(selectedPartNo);
    const matchesPlantId = !selectedPlantId || userRole.plant_ids.includes(selectedPlantId);
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

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Roles</h1>
          <p className="text-muted-foreground">
            Manage user assignments to part numbers and plant IDs
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingRole(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingRole ? "Edit Assignment" : "Add New Assignment"}</DialogTitle>
            </DialogHeader>
            <RoleForm 
              role={editingRole} 
              onClose={() => setIsFormOpen(false)}
              onSave={() => {
                setIsFormOpen(false);
                setEditingRole(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

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
                    <SelectItem key={partNo} value={partNo}>
                      {partNo}
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
                    <SelectItem key={plantId} value={plantId}>
                      {plantId}
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

      {/* User Roles Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Part Numbers</TableHead>
              <TableHead>Plant IDs</TableHead>
              <TableHead>HITL</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUserRoles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No user assignments found
                </TableCell>
              </TableRow>
            ) : (
              currentUserRoles.map((userRole) => (
                <TableRow key={userRole.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{userRole.user.name}</div>
                        <div className="text-xs text-muted-foreground">{userRole.user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={userRole.role === 'ADMIN' ? 'default' : 'secondary'} className="text-xs">
                      {userRole.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {userRole.part_numbers.slice(0, 2).map((partNo) => (
                        <Badge key={partNo} variant="outline" className="text-xs">
                          {partNo}
                        </Badge>
                      ))}
                      {userRole.part_numbers.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{userRole.part_numbers.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {userRole.plant_ids.slice(0, 2).map((plantId) => (
                        <Badge key={plantId} variant="outline" className="text-xs">
                          {plantId}
                        </Badge>
                      ))}
                      {userRole.plant_ids.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{userRole.plant_ids.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={userRole.hitl_enabled}
                      onCheckedChange={() => toggleHitl(userRole.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(userRole.created_at)}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredUserRoles.length)} of{" "}
            {filteredUserRoles.length} assignments
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

// Role Form Component
function RoleForm({ role, onClose, onSave }: { role: any; onClose: () => void; onSave: () => void }) {
  const [formData, setFormData] = useState({
    user: role?.user?.name || "",
    partNo: role?.part_numbers?.[0] || "",
    plantId: role?.plant_ids?.[0] || "",
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
      <div>
        <label className="text-sm font-medium mb-2 block">User</label>
        <Select value={formData.user} onValueChange={(value) => setFormData({...formData, user: value})}>
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
        <label className="text-sm font-medium mb-2 block">Part No</label>
        <Select value={formData.partNo} onValueChange={(value) => setFormData({...formData, partNo: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select part number" />
          </SelectTrigger>
          <SelectContent>
            {mockPartNumbers.map((partNo) => (
              <SelectItem key={partNo} value={partNo}>
                {partNo}
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
              <SelectItem key={plantId} value={plantId}>
                {plantId}
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
          {role ? "Update" : "Add"}
        </Button>
      </div>
    </form>
  );
}