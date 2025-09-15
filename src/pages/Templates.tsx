import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Filter, 
  Eye, 
  Plus,
  Code,
  Archive,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Template } from "@/types";

// Mock templates data
const mockTemplates: Template[] = [
  {
    id: "TMPL-IPA-001",
    part_no: "IPA-SG-99.9",
    xml_file: "isopropanol_semiconductor_grade.xml",
    created_at: "2024-01-10T09:00:00Z",
    status: "active"
  },
  {
    id: "TMPL-ACE-001", 
    part_no: "ACE-EG-99.5",
    xml_file: "acetone_electronic_grade.xml",
    created_at: "2024-01-08T14:30:00Z",
    status: "active"
  },
  {
    id: "TMPL-MET-001",
    part_no: "MET-UHP-99.999",
    xml_file: "methanol_ultra_high_purity.xml",
    created_at: "2024-01-05T11:15:00Z",
    status: "archived"
  },
  {
    id: "TMPL-ETH-001",
    part_no: "ETH-AN-200P",
    xml_file: "ethanol_anhydrous_200proof.xml", 
    created_at: "2023-12-20T16:45:00Z",
    status: "inactive"
  },
  {
    id: "TMPL-WAF-001",
    part_no: "WAF-CZ-300MM",
    xml_file: "silicon_wafer_cz_300mm.xml",
    created_at: "2023-12-15T10:30:00Z",
    status: "deleted"
  }
];

const StatusBadge = ({ status }: { status: string }) => {
  const getVariant = () => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success border-success/20";
      case "inactive":
        return "bg-warning/10 text-warning border-warning/20";
      case "archived":
        return "bg-muted text-muted-foreground border-border";
      case "deleted":
        return "bg-error/10 text-error border-error/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getIcon = () => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case "inactive": 
        return <AlertTriangle className="h-3 w-3 mr-1" />;
      case "archived":
        return <Archive className="h-3 w-3 mr-1" />;
      case "deleted":
        return <XCircle className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <Badge variant="outline" className={getVariant()}>
      {getIcon()}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export function Templates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredTemplates = mockTemplates.filter(template => 
    template.part_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.xml_file.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Templates</h1>
          <p className="text-muted-foreground mt-1">
            Manage XML templates for certificate of analysis generation
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="enterprise-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates by part number or filename..."
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Status</label>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">All</Button>
                    <Button variant="outline" size="sm">Active</Button>
                    <Button variant="outline" size="sm">Inactive</Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Date Range</label>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">Last 30 days</Button>
                    <Button variant="outline" size="sm">Last 90 days</Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Part Type</label>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">Chemicals</Button>
                    <Button variant="outline" size="sm">Wafers</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Templates Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="enterprise-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Templates</p>
                <p className="text-2xl font-bold">{mockTemplates.length}</p>
              </div>
              <Archive className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="enterprise-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-success">
                  {mockTemplates.filter(t => t.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="enterprise-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold text-warning">
                  {mockTemplates.filter(t => t.status === 'inactive').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="enterprise-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Archived</p>
                <p className="text-2xl font-bold text-muted-foreground">
                  {mockTemplates.filter(t => t.status === 'archived').length}
                </p>
              </div>
              <Archive className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Templates Table */}
      <Card className="enterprise-card">
        <CardHeader>
          <CardTitle>All Templates</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Template ID</th>
                  <th>Part Number</th>
                  <th>XML File</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTemplates.map((template) => (
                  <tr key={template.id}>
                    <td>
                      <Link 
                        to={`/templates/${template.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {template.id}
                      </Link>
                    </td>
                    <td>
                      <div className="font-medium">{template.part_no}</div>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <Code className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-mono">{template.xml_file}</span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={template.status} />
                    </td>
                    <td className="text-sm text-muted-foreground">
                      {new Date(template.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex space-x-1">
                        <Link to={`/templates/${template.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(`/api/templates/${template.id}/xml`, '_blank')}
                        >
                          <Code className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Showing {filteredTemplates.length} of {mockTemplates.length} templates
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}