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
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { Search, Filter, Plus, User, Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

// Mock data for dropdowns
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

export function Roles() {
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

  const handleViewRequests = (role: any) => {
    // Navigate to requests page with filters
    navigate(`/requests?partNumber=${role.part_number}&plantId=${role.plant_id}&userId=${role.user.email}`);
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
              <DialogTitle>{editingRole ? "Edit Role" : "Add New Role"}</DialogTitle>
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

      {/* User Roles Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Part Number</TableHead>
              <TableHead>Plant ID</TableHead>
              <TableHead>HITL</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUserRoles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
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
                    <div className="text-sm">{userRole.part_number}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{userRole.plant_id}</div>
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
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewRequests(userRole)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(userRole)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(userRole)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

      <ConfirmationDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Role Assignment"
        description={`Are you sure you want to delete the role assignment for ${roleToDelete?.user?.name}? This action cannot be undone.`}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

// Role Form Component
function RoleForm({ role, onClose, onSave }: { role: any; onClose: () => void; onSave: () => void }) {
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