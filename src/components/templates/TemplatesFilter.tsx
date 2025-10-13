import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Template } from "@/types";

export interface TemplatesFilterProps {
  templates: Template[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  plantIdFilter: string;
  setPlantIdFilter: (plantId: string) => void;
  ownerFilter: string;
  setOwnerFilter: (owner: string) => void;
  setCurrentPage: (page: number) => void;
}

export const TemplatesFilter = ({
  templates,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  plantIdFilter,
  setPlantIdFilter,
  ownerFilter,
  setOwnerFilter,
  setCurrentPage,
}: TemplatesFilterProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const uniquePlantIds = Array.from(new Set(templates.map(t => t.plant_id))).filter(Boolean);
  const uniqueOwners = Array.from(new Set(templates.flatMap(t => t.owners || []))).filter(Boolean);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value === "all" ? "" : value);
    setCurrentPage(1);
  };

  const handlePlantIdChange = (value: string) => {
    setPlantIdFilter(value === "all" ? "" : value);
    setCurrentPage(1);
  };

  const handleOwnerChange = (value: string) => {
    setOwnerFilter(value === "all" ? "" : value);
    setCurrentPage(1);
  };

  return (
    <Card className="enterprise-card mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">Status</label>
                <Select value={statusFilter} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Plant ID</label>
                <Select value={plantIdFilter} onValueChange={handlePlantIdChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border">
                    <SelectItem value="all">All</SelectItem>
                    {uniquePlantIds.map(id => (
                      <SelectItem key={id} value={id}>{id}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Owner</label>
                <Select value={ownerFilter} onValueChange={handleOwnerChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border">
                    <SelectItem value="all">All</SelectItem>
                    {uniqueOwners.map(owner => (
                      <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                    ))}
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}