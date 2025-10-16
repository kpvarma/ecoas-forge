import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { User, ClipboardList, Edit, Trash2 } from "lucide-react";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";

import { Responsibility } from "@/types";

interface ResponsibilitiesTableProps {
  currentResponsibilities: Responsibility[];
  formatDate: (dateString: string) => string;
  handleEdit: (responsibility: Responsibility) => void;
  handleDelete: (responsibility: Responsibility) => void;
  deleteConfirmOpen: boolean;
  setDeleteConfirmOpen: (isOpen: boolean) => void;
  responsibilityToDelete: Responsibility | null;
  confirmDelete: () => void;
  handleViewRequests: (responsibility: Responsibility) => void;
}

export function ResponsibilitiesTable({
  currentResponsibilities,
  formatDate,
  handleEdit,
  handleDelete,
  deleteConfirmOpen,
  setDeleteConfirmOpen,
  responsibilityToDelete,
  confirmDelete,
  handleViewRequests,
}: ResponsibilitiesTableProps) {

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
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentResponsibilities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No responsibilities found
                </TableCell>
              </TableRow>
            ) : (
              currentResponsibilities.map((responsibility) => (
                <TableRow key={responsibility.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{responsibility.user.name}</div>
                        <div className="text-xs text-muted-foreground">{responsibility.user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={responsibility.user.role === 'Template Admin' ? 'default' : 'secondary'} className="text-xs">
                      {responsibility.user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{responsibility.part_number}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{responsibility.plant_id}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(responsibility.created_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={responsibility.status} type="status" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewRequests(responsibility)}
                        className="h-8 w-8 p-0"
                      >
                        <ClipboardList className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(responsibility)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

     
    </>
  );
}