import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { 
	Search,
	Filter,
	Plus,
	Download,
	Archive,
	CheckCircle,
	XCircle,
	AlertTriangle,
	User,
	X,
	ToggleLeft,
	ToggleRight,
	Code,
	Building,
	Mail,
	FolderOpen,
	Edit,
	Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { MultipleOwnersDisplay } from "@/components/OwnerBadge";
import { Template } from "@/types";
import { PaginationControls } from "@/components/common/PaginationControls";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

export interface ExtendedTemplate extends Template {
	owners?: string[];
	hintl_enabled: boolean;
	updated_at: string;
	plant_id: string;
}

const mockUsers = {
	"Jane Smith": { name: "Jane Smith", title: "Senior Quality Analyst", department: "Quality Assurance", email: "jane.smith@entegris.com" },
	"Mike Johnson": { name: "Mike Johnson", title: "QC Supervisor", department: "Quality Control", email: "mike.johnson@entegris.com" },
	"Sarah Davis": { name: "Sarah Davis", title: "Lab Manager", department: "Laboratory Services", email: "sarah.davis@entegris.com" },
	"Tom Wilson": { name: "Tom Wilson", title: "Quality Engineer", department: "Quality Engineering", email: "tom.wilson@entegris.com" }
};

export const mockTemplates: ExtendedTemplate[] = [
	{ id: "TMPL-IPA-001", part_no: "IPA-SG-99.9", xml_file: "isopropanol_semiconductor_grade.xml", created_at: "2024-01-10T09:00:00Z", updated_at: "2024-01-15T14:30:00Z", status: "active", owners: ["Jane Smith", "Mike Johnson"], hintl_enabled: true, plant_id: "PLT-001" },
	{ id: "TMPL-ACE-001", part_no: "ACE-EG-99.5", xml_file: "acetone_electronic_grade.xml", created_at: "2024-01-08T14:30:00Z", updated_at: "2024-01-12T10:15:00Z", status: "active", owners: ["Mike Johnson"], hintl_enabled: false, plant_id: "PLT-002" },
	{ id: "TMPL-MET-001", part_no: "MET-UHP-99.999", xml_file: "methanol_ultra_high_purity.xml", created_at: "2024-01-05T11:15:00Z", updated_at: "2024-01-20T16:45:00Z", status: "archived", owners: [], hintl_enabled: true, plant_id: "PLT-003" },
	{ id: "TMPL-ETH-001", part_no: "ETH-AN-200P", xml_file: "ethanol_anhydrous_200proof.xml", created_at: "2023-12-20T16:45:00Z", updated_at: "2024-01-05T09:30:00Z", status: "inactive", owners: ["Sarah Davis", "Tom Wilson"], hintl_enabled: false, plant_id: "PLT-001" },
	{ id: "TMPL-WAF-001", part_no: "WAF-CZ-300MM", xml_file: "silicon_wafer_cz_300mm.xml", created_at: "2023-12-15T10:30:00Z", updated_at: "2023-12-18T13:20:00Z", status: "deleted", owners: [], hintl_enabled: true, plant_id: "PLT-002" }
];

const mockXmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<Certificate xmlns="http://www.entegris.com/coa" version="2.0">
	<Header>
		<DocumentType>Certificate of Analysis</DocumentType>
		<DocumentID>{{DOCUMENT_ID}}</DocumentID>
		<IssueDate>{{ISSUE_DATE}}</IssueDate>
		<PartNumber>{{PART_NUMBER}}</PartNumber>
		<BatchNumber>{{BATCH_NUMBER}}</BatchNumber>
	</Header>
	<Product>
		<Name>{{PRODUCT_NAME}}</Name>
		<Grade>{{GRADE}}</Grade>
		<Purity>{{PURITY}}</Purity>
	</Product>
	<TestResults>
		<Test name="Purity" method="GC-MS">
			<Result>{{PURITY_RESULT}}</Result>
			<Units>%</Units>
			<Specification>>99.9</Specification>
		</Test>
		<Test name="Water Content" method="Karl Fischer">
			<Result>{{WATER_CONTENT}}</Result>
			<Units>ppm</Units>
			<Specification><50</Specification>
		</Test>
	</TestResults>
</Certificate>`;

const formatDate = (dateString: string) => { const date = new Date(dateString); return format(date, 'dd MMM yyyy'); };

const StatusBadge = ({ status }: { status: string }) => {
	const getVariant = () => {
		switch (status) {
			case "active": return "default";
			case "inactive": return "secondary";
			case "archived": return "outline";
			case "deleted": return "destructive";
			default: return "secondary";
		}
	};
	const getIcon = () => {
		switch (status) {
			case "active": return <CheckCircle className="h-3 w-3 mr-1" />;
			case "inactive": return <AlertTriangle className="h-3 w-3 mr-1" />;
			case "archived": return <Archive className="h-3 w-3 mr-1" />;
			case "deleted": return <XCircle className="h-3 w-3 mr-1" />;
			default: return null;
		}
	};
	return (<Badge variant={getVariant()} className="text-xs">{getIcon()}{status.toUpperCase()}</Badge>);
};

export function TemplatesTable() {
	const [searchTerm, setSearchTerm] = useState("");
	const [showFilters, setShowFilters] = useState(false);
	const [statusFilter, setStatusFilter] = useState<string>("");
	const [plantIdFilter, setPlantIdFilter] = useState<string>("");
	const [ownerFilter, setOwnerFilter] = useState<string>("");
	const [xmlDialogOpen, setXmlDialogOpen] = useState(false);
	const [selectedTemplate, setSelectedTemplate] = useState<ExtendedTemplate | null>(null);
	const [templates, setTemplates] = useState<ExtendedTemplate[]>(mockTemplates);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [templateToDelete, setTemplateToDelete] = useState<ExtendedTemplate | null>(null);

	const uniquePlantIds = Array.from(new Set(templates.map(t => t.plant_id)));
	const uniqueStatuses = Array.from(new Set(templates.map(t => t.status)));
	const uniqueOwners = Array.from(new Set(templates.flatMap(t => t.owners || [])));

	const filteredTemplates = templates.filter(template => {
		const matchesSearch = template.part_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
			template.xml_file.toLowerCase().includes(searchTerm.toLowerCase()) ||
			template.plant_id.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesStatus = !statusFilter || template.status === statusFilter;
		const matchesPlantId = !plantIdFilter || template.plant_id === plantIdFilter;
		const matchesOwner = !ownerFilter || (ownerFilter === "unassigned" && (!template.owners || template.owners.length === 0)) || (template.owners && template.owners.includes(ownerFilter));

		return matchesSearch && matchesStatus && matchesPlantId && matchesOwner;
	});

	const totalItems = filteredTemplates.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const displayedTemplates = filteredTemplates.slice(startIndex, endIndex);

	const handleViewXml = (template: ExtendedTemplate) => { setSelectedTemplate(template); setXmlDialogOpen(true); };
	const handleDownloadXml = (template: ExtendedTemplate) => {
		const blob = new Blob([mockXmlContent], { type: 'application/xml' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = template.xml_file;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const toggleHintl = (templateId: string) => {
		setTemplates(prev => prev.map(template => template.id === templateId ? { ...template, hintl_enabled: !template.hintl_enabled } : template));
	};

	const handleDeleteClick = (template: ExtendedTemplate) => {
		setTemplateToDelete(template);
		setDeleteDialogOpen(true);
	};

	const handleDeleteTemplate = () => {
		if (templateToDelete) {
			setTemplates(prev => prev.filter(template => template.id !== templateToDelete.id));
			setDeleteDialogOpen(false);
			setTemplateToDelete(null);
		}
	};

	return (
		<>
			<div className="space-y-2 mb-4">
				<div className="flex items-center" style={{display:'none'}}>
					<div className="flex-1">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search templates by part number, filename, or plant ID..."
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
					<div className="p-3 border border-border rounded-lg bg-muted/30"  style={{display:'none'}}>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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

							<div>
								<label className="text-sm font-medium block mb-1">Plant ID</label>
								<Select value={plantIdFilter} onValueChange={(value) => { setPlantIdFilter(value === "all" ? "" : value); setCurrentPage(1); }}>
									<SelectTrigger>
										<SelectValue placeholder="All Plant IDs" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Plant IDs</SelectItem>
										{uniquePlantIds.map((id) => (<SelectItem key={id} value={id}>{id}</SelectItem>))}
									</SelectContent>
								</Select>
							</div>

							<div>
								<label className="text-sm font-medium block mb-1">Owner</label>
								<Select value={ownerFilter} onValueChange={(value) => { setOwnerFilter(value === "all" ? "" : value); setCurrentPage(1); }}>
									<SelectTrigger>
										<SelectValue placeholder="All Owners" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Owners</SelectItem>
										<SelectItem value="unassigned">Unassigned</SelectItem>
										{uniqueOwners.map((owner) => (<SelectItem key={owner} value={owner}>{owner}</SelectItem>))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="flex justify-end mt-2">
							<Button variant="outline" size="sm" onClick={() => { setStatusFilter(""); setPlantIdFilter(""); setOwnerFilter(""); setCurrentPage(1); }}>
								Clear
							</Button>
						</div>
					</div>
				)}
			</div>

			<div className="rounded-md border">
				<table className="w-full">
					<thead>
						<tr className="border-b border-border">
							<th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Template</th>
							<th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Part ID</th>
							<th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
							<th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Updated At</th>
							<th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border">
						{displayedTemplates.length === 0 ? (
							<tr>
								<td colSpan={6} className="px-3 py-3 text-center text-muted-foreground">No templates found</td>
							</tr>
						) : (
							displayedTemplates.map((template) => (
								<tr key={template.id} className="hover:bg-muted/50 transition-colors">
									<td className="px-3 py-3">
										<div className="flex items-center space-x-3">
											<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
												<FolderOpen className="h-4 w-4 text-primary" />
											</div>
											<div>
												<button onClick={() => handleViewXml(template)} className="text-sm font-medium text-primary hover:underline">{template.part_no}</button>
												<div className="text-xs text-muted-foreground flex items-center"><Code className="h-3 w-3 mr-1" />{template.xml_file}</div>
											</div>
										</div>
									</td>
									<td className="px-3 py-3"><div className="flex items-center text-sm"><Building className="h-3 w-3 mr-2 text-muted-foreground" />{template.plant_id}</div></td>
									<td className="px-3 py-3"><StatusBadge status={template.status} /></td>
									<td className="px-3 py-3"><div className="flex items-center text-xs text-muted-foreground">{formatDate(template.updated_at)}</div></td>
									<td className="px-3 py-3">
										<div className="flex items-center space-x-1">
											<Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View XML" onClick={() => handleViewXml(template)}><Code className="h-4 w-4" /></Button>
											<Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Download XML" onClick={() => handleDownloadXml(template)}><Download className="h-4 w-4" /></Button>
											<Link to={`/templates/${template.id}/edit`}>
												<Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Edit Template"><Edit className="h-4 w-4" /></Button>
											</Link>
											<Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Delete Template" onClick={() => handleDeleteClick(template)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
					totalItems={totalItems}
					itemsPerPage={itemsPerPage}
					startIndex={startIndex}
					endIndex={endIndex}
				/>
			)}

			{/* XML Viewer Dialog */}
			<Dialog open={xmlDialogOpen} onOpenChange={setXmlDialogOpen}>
				<DialogContent className="max-w-4xl h-[80vh]">
					<DialogHeader>
						<DialogTitle className="flex items-center"><Code className="h-5 w-5 mr-2 text-primary" />XML Template: {selectedTemplate?.xml_file}</DialogTitle>
						<DialogDescription>Part Number: {selectedTemplate?.part_no}</DialogDescription>
					</DialogHeader>
					<div className="flex-1 overflow-hidden"><div className="h-full overflow-auto"><SyntaxHighlighter language="xml" style={tomorrow} className="!bg-muted/30 !m-0 h-full text-sm rounded-lg" customStyle={{ margin: 0, padding: '1rem', background: 'hsl(var(--muted) / 0.3)', height: '100%', overflow: 'auto', borderRadius: '0.5rem' }}>{mockXmlContent}</SyntaxHighlighter></div></div>
					<DialogFooter className="flex justify-between"><Button variant="outline" onClick={() => selectedTemplate && handleDownloadXml(selectedTemplate)}><Download className="h-4 w-4 mr-2"/>Download</Button><Button onClick={() => setXmlDialogOpen(false)}><X className="h-4 w-4 mr-2"/>Close</Button></DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the template "{templateToDelete?.part_no}" (ID: {templateToDelete?.id}).
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteTemplate}>Delete</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

export default TemplatesTable;