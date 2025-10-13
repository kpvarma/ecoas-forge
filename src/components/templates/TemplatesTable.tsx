import { useEffect, useState } from "react"; // Added for re-evaluation
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
	Eye,
	Plus,
	Download,
	Archive,
	CheckCircle,
	XCircle,
	AlertTriangle,
	X,
	Code,
	Building,
	FolderOpen,
	Edit,
	Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Template } from "@/types";
import { PaginationControls } from "@/components/common/PaginationControls";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { templatesClient } from "@/lib/clients/templates";
import { TemplatesFilter } from "./TemplatesFilter.tsx";

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

const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	if (isNaN(date.getTime())) {
		return "Invalid Date"; // Or an empty string, or a default date
	}
	return format(date, 'dd MMM yyyy HH:mm');
};


export function TemplatesTable() {
	const { toast } = useToast();
	const [xmlDialogOpen, setXmlDialogOpen] = useState(false);
	const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
	const [templates, setTemplates] = useState<Template[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);

	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [plantIdFilter, setPlantIdFilter] = useState("");
	const [ownerFilter, setOwnerFilter] = useState("");

	useEffect(() => {
		const fetchTemplates = async () => {
			const fetchedTemplates = await templatesClient.index();
			setTemplates(fetchedTemplates);
		};
		fetchTemplates();
	}, []);

	const filteredTemplates = templates.filter(template => {
		const matchesSearch = template.part_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
			template.xml_file.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(template.plant_id && template.plant_id.toLowerCase().includes(searchTerm.toLowerCase()));

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

	const handleViewXml = (template: Template) => { setSelectedTemplate(template); setXmlDialogOpen(true); };
	const handleDownloadXml = (template: Template) => {
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

	const toggleHintl = async (templateId: string, currentStatus: boolean) => {
		try {
			await templatesClient.update(templateId, { hintl_enabled: !currentStatus });
			setTemplates(prev => prev.map(template => template.id === templateId ? { ...template, hintl_enabled: !currentStatus } : template));
			toast({
				title: "HITL Status Updated",
				description: `Template HITL status changed to ${!currentStatus ? "enabled" : "disabled"}.`,
			});
		} catch (error) {
			console.error("Failed to toggle HITL status for template:", error);
			toast({
				title: "Error",
				description: "Failed to update HITL status. Please try again.",
				variant: "destructive",
			});
		}
	};

	const handleStatusChange = async (templateId: string, newStatus: 'active' | 'inactive') => {
		try {
			await templatesClient.update(templateId, { status: newStatus });
			setTemplates(prev => prev.map(template => template.id === templateId ? { ...template, status: newStatus } : template));
			toast({
				title: "Template Status Updated",
				description: `Template status changed to ${newStatus}.`,
			});
		} catch (error) {
			console.error("Failed to update template status:", error);
			toast({
				title: "Error",
				description: "Failed to update template status. Please try again.",
				variant: "destructive",
			});
		}
	};

	const handleDeleteClick = (template: Template) => {
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
			<TemplatesFilter
				templates={templates}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				statusFilter={statusFilter}
				setStatusFilter={setStatusFilter}
				plantIdFilter={plantIdFilter}
				setPlantIdFilter={setPlantIdFilter}
				ownerFilter={ownerFilter}
				setOwnerFilter={setOwnerFilter}
				setCurrentPage={setCurrentPage}
			/>

			<div className="rounded-md border">
				<table className="w-full">
					<thead>
						<tr className="border-b border-border">
							<th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Template</th>
							<th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Part ID</th>
							<th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Plant ID</th>
							<th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
							<th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">HITL</th>
							<th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Updated At</th>
							<th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border">
						{displayedTemplates.length === 0 ? (
							<tr>
								<td colSpan={7} className="px-3 py-3 text-center text-muted-foreground">No templates found</td>
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
												<button onClick={() => handleViewXml(template)} className="text-sm font-medium text-primary hover:underline">{template.template_code}</button>
											</div>
										</div>
									</td>
									<td className="px-3 py-3"><div className="flex items-center text-sm"><Building className="h-3 w-3 mr-2 text-muted-foreground" />{template.part_no}</div></td>
									<td className="px-3 py-3"><div className="flex items-center text-sm">{template.plant_id}</div></td>
									<td className="px-3 py-3">
										<Select value={template.status} onValueChange={(value: 'active' | 'inactive') => handleStatusChange(template.id, value)}>
											<SelectTrigger className="w-[120px]">
												<SelectValue placeholder="Status" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="active">Active</SelectItem>
												<SelectItem value="inactive">Inactive</SelectItem>
											</SelectContent>
										</Select>
									</td>
									<td className="px-3 py-3">
										<Switch
											checked={template.hintl_enabled}
											onCheckedChange={() => toggleHintl(template.id, template.hintl_enabled)}
										/>
									</td>
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
						{/* <DialogTitle className="flex items-center"><Code className="h-5 w-5 mr-2 text-primary" />XML Template: {selectedTemplate?.xml_file}</DialogTitle> */}
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