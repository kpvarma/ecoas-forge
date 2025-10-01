import { TemplatesTable } from "@/components/templates/TemplatesTable";
import { Link } from "react-router-dom";
import { Plus, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Templates() {
	return (
		<div className="p-6 space-y-3">
			<div className="flex items-start justify-between">
				<div>
					<div className="flex items-center space-x-3">
						<FolderOpen className="h-8 w-8 text-primary" />
						<h1 className="text-2xl font-bold">Templates</h1>
					</div>
					<p className="text-muted-foreground mt-1">Manage XML templates for certificate of analysis generation</p>
				</div>
				<Link to="/templates/new">
					<Button className="bg-red-700 text-white hover:bg-red-800">
						<Plus className="h-4 w-4 mr-2" />
						New Template
					</Button>
				</Link>
			</div>
			<TemplatesTable  />
		</div>
	);
}

export default Templates;

