import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { 
	Search, 
	Filter, 
	Eye, 
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
			case "active": return "bg-success/10 text-success border-success/20";
			case "inactive": return "bg-warning/10 text-warning border-warning/20";
			case "archived": return "bg-muted text-muted-foreground border-border";
			case "deleted": return "bg-error/10 text-error border-error/20";
			default: return "bg-muted text-muted-foreground border-border";
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
	return (<Badge variant="outline" className={getVariant()}>{getIcon()}{status.toUpperCase()}</Badge>);
};

export function TemplatesTable() {
	const [searchTerm, setSearchTerm] = useState("");
	const [showFilters, setShowFilters] = useState(false);
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [plantIdFilter, setPlantIdFilter] = useState<string>("all");
	const [partNumberFilter, setPartNumberFilter] = useState<string>("all");
	const [ownerFilter, setOwnerFilter] = useState<string>("all");
	const [dateRangeFilter, setDateRangeFilter] = useState<string>("all");
	const [xmlDialogOpen, setXmlDialogOpen] = useState(false);
	const [selectedTemplate, setSelectedTemplate] = useState<ExtendedTemplate | null>(null);
	const [templates, setTemplates] = useState<ExtendedTemplate[]>(mockTemplates);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [templateToDelete, setTemplateToDelete] = useState<ExtendedTemplate | null>(null);

	const filteredTemplates = templates.filter(template => {
		const matchesSearch = template.part_no.toLowerCase().includes(searchTerm.toLowerCase()) || template.xml_file.toLowerCase().includes(searchTerm.toLowerCase()) || template.plant_id.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus = statusFilter === "all" || template.status === statusFilter;
		const matchesPlantId = plantIdFilter === "all" || template.plant_id === plantIdFilter;
		const matchesPartNumber = partNumberFilter === "all" || template.part_no === partNumberFilter;
		const matchesOwner = ownerFilter === "all" || (ownerFilter === "unassigned" && (!template.owners || template.owners.length === 0)) || (template.owners && template.owners.some(owner => owner.toLowerCase().replace(' ', '-') === ownerFilter));
		let matchesDateRange = true;
		if (dateRangeFilter !== "all") {
			const templateDate = new Date(template.created_at);
			const now = new Date();
			const diffTime = now.getTime() - templateDate.getTime();
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
			switch (dateRangeFilter) { case "last-30": matchesDateRange = diffDays <= 30; break; case "last-90": matchesDateRange = diffDays <= 90; break; case "last-year": matchesDateRange = diffDays <= 365; break; }
		}
		return matchesSearch && matchesStatus && matchesPlantId && matchesPartNumber && matchesOwner && matchesDateRange;
	});

	// Pagination derived from filtered results
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
		<div className="pt-0 space-y-6">
			
						<Card className="enterprise-card">
							<CardContent className="p-4">
								<div className="flex items-center justify-between space-x-4">
									<div className="flex-1">
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
										<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
											<div>
												<label className="text-sm font-medium block mb-2">Status</label>
												<Select value={statusFilter} onValueChange={setStatusFilter}>
													<SelectTrigger>
														<SelectValue placeholder="All" />
													</SelectTrigger>
													<SelectContent className="bg-background border border-border">
														<SelectItem value="all">All</SelectItem>
														<SelectItem value="active">Active</SelectItem>
														<SelectItem value="inactive">Inactive</SelectItem>
														<SelectItem value="archived">Archived</SelectItem>
														<SelectItem value="deleted">Deleted</SelectItem>
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
														<SelectItem value="MET-UHP-99.999">MET-UHP-99.999</SelectItem>
														<SelectItem value="ETH-AN-200P">ETH-AN-200P</SelectItem>
														<SelectItem value="WAF-CZ-300MM">WAF-CZ-300MM</SelectItem>
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
													</SelectContent>
												</Select>
											</div>
											<div>
												<label className="text-sm font-medium block mb-2">Date Range</label>
												<Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
													<SelectTrigger>
														<SelectValue placeholder="All time" />
													</SelectTrigger>
													<SelectContent className="bg-background border border-border">
														<SelectItem value="all">All time</SelectItem>
														<SelectItem value="last-30">Last 30 days</SelectItem>
														<SelectItem value="last-90">Last 90 days</SelectItem>
														<SelectItem value="last-year">Last year</SelectItem>
													</SelectContent>
												</Select>
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
										<p className="text-2xl font-bold text-success">{mockTemplates.filter(t => t.status === 'active').length}</p>
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
										<p className="text-2xl font-bold text-warning">{mockTemplates.filter(t => t.status === 'inactive').length}</p>
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
										<p className="text-2xl font-bold text-muted-foreground">{mockTemplates.filter(t => t.status === 'archived').length}</p>
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
								<table className="w-full">
									<thead>
										<tr className="border-b border-border">
											<th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Template ID</th>
											<th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Part Number</th>
											<th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Plant ID</th>
											<th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">XML File</th>
											<th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Owner</th>
											<th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Hintl</th>
											<th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
											<th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Created At</th>
											<th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Updated At</th>
											<th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-border">
										{displayedTemplates.map((template) => (
											<tr key={template.id} className="hover:bg-muted/50 transition-colors">
												<td className="px-2 py-2"><div className="text-sm font-medium">{template.id}</div></td>
												<td className="px-2 py-2"><div className="text-sm font-medium">{template.part_no}</div></td>
												<td className="px-2 py-2"><div className="text-sm font-medium">{template.plant_id}</div></td>
												<td className="px-2 py-2"><button onClick={() => handleViewXml(template)} className="text-sm font-mono text-primary hover:underline transition-colors">{template.xml_file}</button></td>
												<td className="px-2 py-2"><MultipleOwnersDisplay owners={template.owners || []} /></td>
												<td className="px-2 py-2"><Switch checked={template.hintl_enabled} onCheckedChange={() => toggleHintl(template.id)} /></td>
												<td className="px-2 py-2"><StatusBadge status={template.status} /></td>
												<td className="px-2 py-2 text-sm text-muted-foreground">{formatDate(template.created_at)}</td>
												<td className="px-2 py-2 text-sm text-muted-foreground">{formatDate(template.updated_at)}</td>
												<td className="px-2 py-2">
													<div className="flex space-x-1">
														<Button variant="ghost" size="sm" onClick={() => handleViewXml(template)}><Code className="h-4 w-4" /></Button>
														<Button variant="ghost" size="sm" onClick={() => handleDownloadXml(template)}><Download className="h-4 w-4" /></Button>
														<Link to={`/templates/${template.id}/edit`}><Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button></Link>
														<Button variant="ghost" size="sm" onClick={() => handleDeleteClick(template)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
								</div>
								<div className="px-6 py-4 border-t">
									<PaginationControls
										currentPage={currentPage}
										totalPages={totalPages}
										onPageChange={setCurrentPage}
										totalItems={totalItems}
										itemsPerPage={itemsPerPage}
										startIndex={startIndex}
										endIndex={endIndex}
									/>
								</div>
							</CardContent>
						</Card>

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
					</div>
				);
			}

		export default TemplatesTable;