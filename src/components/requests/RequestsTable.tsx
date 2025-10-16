import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { OwnerBadge, MultipleOwnersDisplay } from "@/components/OwnerBadge";
import { formatDateTime, formatDateOnly } from "@/lib/utils";
import { Request } from "@/types";

interface RequestsTableProps {
  paginatedData: Array<{ item: Request; isChild: boolean; parent?: Request }>;
  expandedRows: Set<string>;
  toggleRowExpansion: (requestId: string) => void;
  handleViewRequest: (id: string) => void;
  handleViewDetail2: (id: string) => void;
  handleViewDocument: (id: string) => void;
  columnFilters: Record<string, string>;
  onFilterChange: (columnId: string, value: string) => void;
}

export function RequestsTable({
  paginatedData,
  expandedRows,
  toggleRowExpansion,
  handleViewRequest,
  handleViewDetail2,
  handleViewDocument,
  columnFilters,
  onFilterChange,
}: RequestsTableProps) {
  return (
    <Card className="enterprise-card">
      <CardHeader>
        <CardTitle>All Requests</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="w-8 h-8 text-left"></th>
                <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Request / Document ID
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Lot Id
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Part Number
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Plant ID/Email
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Subject / Document Name
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <div>Processing Status</div>
                  <div className="text-[0.65rem] font-normal normal-case">(PDF to XML Conversion)</div>
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Approval Status
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Received On
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Updated At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedData.map(({ item, isChild }) => (
                <tr key={item.id} className={`${isChild ? "bg-muted/30" : "hover:bg-muted/50"} transition-colors`}>
                  <td className="px-2 py-2">
                    {!isChild && item.children && item.children.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => toggleRowExpansion(item.id)}
                      >
                        {expandedRows.has(item.id) ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </Button>
                    )}
                  </td>
                  <td className={`px-2 py-2 ${isChild ? "pl-6" : ""}`}>
                    {isChild ? (
                      <span
                        onClick={() => handleViewDetail2(item.id)}
                        className="text-sm font-medium text-primary hover:underline cursor-pointer"
                      >
                        {item.id}
                      </span>
                    ) : (
                      <span className="text-sm font-medium">{item.id}</span>
                    )}
                  </td>
                  <td className={`px-2 py-2 ${isChild ? "pl-6" : ""}`}>
                    {isChild ? (
                      <div className="text-sm font-medium">{item.lot_id}</div>
                    ) : (
                      <div className="text-sm text-muted-foreground">-</div>
                    )}
                  </td>
                 
                  <td className="px-2 py-2">
                    {isChild ? (
                      <div className="text-sm font-medium">{item.part_number}</div>
                    ) : (
                      <div className="text-sm text-muted-foreground">-</div>
                    )}
                  </td>
                  <td className="px-2 py-2">
                    
                      <div>
                        <div className="text-sm font-medium">
                          {item.plant_id}
                        </div>
                        {!isChild && (
                        <div className="text-xs text-muted-foreground">
                          {item.initiator_email}
                        </div>
                         )}
                      </div>
                   
                  </td>
                  <td className="px-2 py-2">
                    <div className="text-sm font-medium">{item.document_name}</div>
                  </td>
                  <td className="px-2 py-2">
                    <StatusBadge status={item.status.toUpperCase()} type="status" />
                  </td>
                  <td className="px-2 py-2">
                    {isChild ? (
                      <StatusBadge status={item.owner_status.toUpperCase()} type="approval" />
                    ):(
                     <div className="text-sm text-muted-foreground">-</div>
                    )}
                   
                  </td>
                  <td className="px-2 py-2">
                    {isChild ? (
                      <MultipleOwnersDisplay owners={item.owner ? [item.owner] : []} />
                    ):(
                      <div className="text-sm text-muted-foreground">-</div>
                    )}
                  </td>
                 
                   <td className="px-2 py-2">
                    {isChild ? (
                      <>John </>
                    ):(
                      <div className="text-sm text-muted-foreground">-</div>
                    )}
                  </td>
                  <td className="px-2 py-2 text-xs text-muted-foreground">
                    {formatDateTime(item.created_at)}
                  </td>
                  <td className="px-2 py-2 text-xs text-muted-foreground">
                    {isChild ? (
                      <>
                    {formatDateTime(item.updated_at)}
                    </>
                    ):(
                      <div className="text-sm text-muted-foreground">-</div>
                    )}
                  </td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
