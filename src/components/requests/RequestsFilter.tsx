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

interface RequestsFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  approvalStatusFilter: string;
  setApprovalStatusFilter: (status: string) => void;
  ownerFilter: string;
  setOwnerFilter: (owner: string) => void;
  plantIdFilter: string;
  setPlantIdFilter: (plantId: string) => void;
  partNumberFilter: string;
  setPartNumberFilter: (partNumber: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export function RequestsFilter({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  approvalStatusFilter,
  setApprovalStatusFilter,
  ownerFilter,
  setOwnerFilter,
  plantIdFilter,
  setPlantIdFilter,
  partNumberFilter,
  setPartNumberFilter,
  showFilters,
  setShowFilters,
}: RequestsFilterProps) {
  return (
    <Card className="enterprise-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="queued">Queued</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Plant ID</label>
                <Select value={plantIdFilter} onValueChange={setPlantIdFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="PLT-001">PLT-001</SelectItem>
                    <SelectItem value="PLT-002">PLT-002</SelectItem>
                    <SelectItem value="PLT-003">PLT-003</SelectItem>
                    <SelectItem value="PLT-004">PLT-004</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Part Number</label>
                <Select value={partNumberFilter} onValueChange={setPartNumberFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="IPA-SG-99.9">IPA-SG-99.9</SelectItem>
                    <SelectItem value="ACE-EG-99.5">ACE-EG-99.5</SelectItem>
                    <SelectItem value="MET-AL-98.7">MET-AL-98.7</SelectItem>
                    <SelectItem value="ETH-GL-97.2">ETH-GL-97.2</SelectItem>
                    <SelectItem value="HEX-AN-99.8">HEX-AN-99.8</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Owner</label>
                <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                    <SelectItem value="sarah-davis">Sarah Davis</SelectItem>
                    <SelectItem value="tom-wilson">Tom Wilson</SelectItem>
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