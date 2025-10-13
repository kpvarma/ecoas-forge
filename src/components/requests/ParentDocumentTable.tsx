import { Link } from "react-router-dom";
import { Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";

interface ParentDocumentTableProps {
  parentDocument: {
    id: string;
    document_name: string;
    status: string;
    approval_status: string;
    owner: string;
    plant_id: string;
    email: string;
    created_at: string;
    updated_at: string;
  };
  formatDateOnly: (dateString: string) => string;
}

export function ParentDocumentTable({ parentDocument, formatDateOnly }: ParentDocumentTableProps) {
  return (
    <Card className="enterprise-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Request Details</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead className="py-2">ID</TableHead>
                <TableHead className="py-2">Subject</TableHead>
                <TableHead className="py-2">Plant ID</TableHead>
                <TableHead className="py-2">Email</TableHead>
                <TableHead className="py-2">Status</TableHead>
                <TableHead className="py-2">Approval</TableHead>
                <TableHead className="py-2">Received On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="text-sm">
                <TableCell className="py-2">
                 
                    {parentDocument.id}
                  
                </TableCell>
                <TableCell className="py-2">{parentDocument.document_name}</TableCell>
                <TableCell className="py-2">{parentDocument.plant_id}</TableCell>
                <TableCell className="py-2">{parentDocument.email}</TableCell>
                <TableCell className="py-2">
                  <StatusBadge status={parentDocument.status} type="status" />
                </TableCell>
                <TableCell className="py-2">
                  <StatusBadge status={parentDocument.approval_status} type="approval" />
                </TableCell>
                <TableCell className="py-2">{formatDateOnly(parentDocument.created_at)}</TableCell>
             
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}