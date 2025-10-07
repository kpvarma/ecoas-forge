import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, User as UserIcon, Mail, Building, Briefcase, Clock, Settings, Shield, Filter } from "lucide-react";
import { PaginationControls } from "@/components/common/PaginationControls";

type User = {
  id: string;
  name: string;
  email: string;
  title: string;
  role: string;
  department: string;
  last_login: string;
  status: string;
};

export default function UsersTable({ users, itemsPerPage = 10, onSelectUser }: { users: User[]; itemsPerPage?: number; onSelectUser?: (id: string) => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const uniqueDepartments = useMemo(() => Array.from(new Set(users.map(u => u.department))), [users]);
  const uniqueStatuses = useMemo(() => Array.from(new Set(users.map(u => u.status))), [users]);

  const filteredUsers = useMemo(() => users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesDepartment = !departmentFilter || user.department === departmentFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
  }), [users, searchTerm, roleFilter, departmentFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <>
      <div className="space-y-2 mb-4">
        <div className="flex items-center" >
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email, department, or title..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-10 py-2 w-full"
              />
            </div>
          </div>
          <div className="ml-3">
            <Button variant="outline" className="h-10" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="p-3 border border-border rounded-lg bg-muted/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-medium block mb-1">Role</label>
                <Select value={roleFilter} onValueChange={(value) => { setRoleFilter(value === "all" ? "" : value); setCurrentPage(1); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                    <SelectItem value="USER">USER</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Department</label>
                <Select value={departmentFilter} onValueChange={(value) => { setDepartmentFilter(value === "all" ? "" : value); setCurrentPage(1); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {uniqueDepartments.map((dept) => (<SelectItem key={dept} value={dept}>{dept}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Status</label>
                <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value === "all" ? "" : value); setCurrentPage(1); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {uniqueStatuses.map((status) => (<SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <Button variant="outline" size="sm" onClick={() => { setRoleFilter(""); setDepartmentFilter(""); setStatusFilter(""); setCurrentPage(1); }}>
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-md border mt-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Login</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-3 text-center text-muted-foreground">No users found</td>
              </tr>
            ) : (
              currentUsers.map((u) => (
                <tr key={u.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-3 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        {onSelectUser ? (
                          <button onClick={() => onSelectUser(u.id)} className="text-sm font-medium text-primary hover:underline">{u.name}</button>
                        ) : (
                          <Link to={`/users/${u.id}`} className="text-sm font-medium text-primary hover:underline">{u.name}</Link>
                        )}
                        <div className="text-xs text-muted-foreground flex items-center"><Mail className="h-3 w-3 mr-1" />{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3"><Badge variant={u.role === 'ADMIN' ? 'default' : 'secondary'} className="text-xs">{u.role}</Badge></td>
                  <td className="px-3 py-3"><div className="flex items-center text-sm"><Briefcase className="h-3 w-3 mr-2 text-muted-foreground" />{u.title}</div></td>
                  <td className="px-3 py-3"><div className="flex items-center text-sm"><Building className="h-3 w-3 mr-2 text-muted-foreground" />{u.department}</div></td>
                  <td className="px-3 py-3"><div className="flex items-center text-xs text-muted-foreground"><Clock className="h-3 w-3 mr-2" />{formatDate(u.last_login)}</div></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center space-x-1">
                      <Link to={`/responsibilities?user=${u.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View user roles"><Shield className="h-4 w-4" /></Button>
                      </Link>
                      <Link to={`/users/${u.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="User settings"><Settings className="h-4 w-4" /></Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
          startIndex={startIndex}
          endIndex={endIndex}
        />
      )}
    </>
  );
}
