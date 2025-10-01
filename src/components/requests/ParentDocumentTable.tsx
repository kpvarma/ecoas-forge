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
    created_at: string;
    updated_at: string;
  };
  formatDate: (dateString: string) => string;
}

export function ParentDocumentTable({ parentDocument, formatDate }: ParentDocumentTableProps) {
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
                <TableHead className="py-2">Document Name</TableHead>
                <TableHead className="py-2">Status</TableHead>
                <TableHead className="py-2">Approval</TableHead>
                <TableHead className="py-2">Owner</TableHead>
                <TableHead className="py-2">Created</TableHead>
                <TableHead className="py-2">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="text-sm">
                <TableCell className="py-2">
                  <Link 
                    to={`/requests/${parentDocument.id}/detail2`}
                    target="_blank"
                    className="font-medium text-primary hover:underline"
                  >
                    {parentDocument.id}
                  </Link>
                </TableCell>
                <TableCell className="py-2">{parentDocument.document_name}</TableCell>
                <TableCell className="py-2">
                  <StatusBadge status={parentDocument.status} type="status" />
                </TableCell>
                <TableCell className="py-2">
                  <StatusBadge status={parentDocument.approval_status} type="approval" />
                </TableCell>
                <TableCell className="py-2">{parentDocument.owner}</TableCell>
                <TableCell className="py-2">{formatDate(parentDocument.created_at)}</TableCell>
                <TableCell className="py-2">
                  <div className="flex space-x-1">
                    <Link to={`/requests/${parentDocument.id}/detail2`} target="_blank">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}