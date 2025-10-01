import { Shield, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ResponsibilitiesForm } from "./ResponsibilitiesForm.tsx";

interface ResponsibilitiesHeaderProps {
  isFormOpen: boolean;
  setIsFormOpen: (isOpen: boolean) => void;
  editingRole: any; // Replace 'any' with actual type when available
  setEditingRole: (role: any) => void; // Replace 'any' with actual type when available
  hideControls?: boolean; // New prop to hide controls
}

export function ResponsibilitiesHeader({
  isFormOpen,
  setIsFormOpen,
  editingRole,
  setEditingRole,
  hideControls = false, // Default to false
}: ResponsibilitiesHeaderProps) {
  if (hideControls) {
    return null; // Render nothing if hideControls is true
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Responsibilities</h1>
        </div>
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
          <ResponsibilitiesForm
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
  );
}