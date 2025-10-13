import { Link } from "react-router-dom";
import { Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { Request } from "@/types";

import { formatDateOnly } from "@/lib/utils";

interface RelatedDocumentsTableProps {
  children: Request[];
  formatDateOnly: (dateString: string) => string;
}

export function RelatedDocumentsTable({ children, formatDateOnly }: RelatedDocumentsTableProps) {
  return (
    <Card className="enterprise-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Related Documents</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead className="py-2">ID</TableHead>
                <TableHead className="py-2">Document Name</TableHead>
                <TableHead className="py-2">Lot ID</TableHead>
                <TableHead className="py-2">Part Number</TableHead>
                <TableHead className="py-2">Plant ID</TableHead>
                <TableHead className="py-2">Status</TableHead>
                <TableHead className="py-2">Approval</TableHead>
                <TableHead className="py-2">Owner</TableHead>
                <TableHead className="py-2">Received On</TableHead>

              </TableRow>
            </TableHeader>
            <TableBody>
              {children?.map((child) => (
                <TableRow key={child.id} className="text-sm">
                  <TableCell className="py-2">
                    <Link
                      to={`/requests/${child.id}/detail2`}
                      target="_blank"
                      className="font-medium text-primary hover:underline"
                    >
                      {child.id}
                    </Link>
                  </TableCell>
                  <TableCell className="py-2">{child.document_name}</TableCell>
                  <TableCell className="py-2">{child.lot_id}</TableCell>
                  <TableCell className="py-2">{child.part_number}</TableCell>
                  <TableCell className="py-2">{child.plant_id}</TableCell>
                  <TableCell className="py-2">
                    <StatusBadge status={child.status} type="status" />
                  </TableCell>
                  <TableCell className="py-2">
                    <StatusBadge status={child.owner_status} type="approval" />
                  </TableCell>
                  <TableCell className="py-2">{child.owner || ""}</TableCell>
                  <TableCell className="py-2">{formatDateOnly(child.created_at)}</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}