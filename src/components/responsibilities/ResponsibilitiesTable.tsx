import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { User, ClipboardList, Edit, Trash2 } from "lucide-react";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";

interface UserRole {
  id: string;
  roleId: string;
  user: {
    name: string;
    email: string;
  };
  role: string;
  part_number: string;
  plant_id: string;
  hitl_enabled: boolean;
  created_at: string;
}

interface ResponsibilitiesTableProps {
  currentUserRoles: UserRole[];
  formatDate: (dateString: string) => string;
  toggleHitl: (id: string) => void;
  handleDelete: (role: UserRole) => void;
  deleteConfirmOpen: boolean;
  setDeleteConfirmOpen: (isOpen: boolean) => void;
  roleToDelete: UserRole | null;
  confirmDelete: () => void;
}

export function ResponsibilitiesTable({
  currentUserRoles,
  formatDate,
  toggleHitl,
  handleDelete,
  deleteConfirmOpen,
  setDeleteConfirmOpen,
  roleToDelete,
  confirmDelete,
}: ResponsibilitiesTableProps) {
  const navigate = useNavigate();

  const handleViewRequests = (role: UserRole) => {
    // Navigate to requests page with filters
    navigate(`/requests?partNumber=${role.part_number}&plantId=${role.plant_id}&userId=${role.user.email}`);
  };

  return (
    <>
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
                        <ClipboardList className="h-4 w-4" />
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

      <ConfirmationDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Role Assignment"
        description={`Are you sure you want to delete the role assignment for ${roleToDelete?.user?.name}? This action cannot be undone.`}
        onConfirm={confirmDelete}
      />
    </>
  );
}