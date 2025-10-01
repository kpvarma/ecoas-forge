import { User } from "lucide-react";
import UsersTable from "@/components/users/UsersTable";
import { mockUsers } from "@/lib/mock/users";

export function Users() {
  return (
    <div className="space-y-1 p-4">
      <div className="flex items-center space-x-2">
        <User className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Users</h1>
      </div>
      <p className="text-muted-foreground mt-0.5">Manage system users and their access</p>
      <UsersTable users={mockUsers} />
    </div>
  );
}

export default Users;