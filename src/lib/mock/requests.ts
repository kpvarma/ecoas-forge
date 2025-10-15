import { Request } from "@/types";
import { formatDateTime } from "@/lib/utils";

// Utility function to format date in long format
export const formatLongDate = (dateString: string) => {
	return formatDateTime(dateString);
};

// Generate comprehensive mock data
export const generateMockRequests = (): Request[] => {
	const requests: Request[] = [];
	const owners = [
		["Jane Smith"], 
		["Mike Johnson"], 
		["Sarah Davis", "Tom Wilson"], 
		["Jane Smith", "Mike Johnson"], 
		[], 
		[], 
		["Tom Wilson"]
	]; // Array of arrays for multiple owners
	const statuses = ["completed", "in_progress", "failed", "queued"];
	const approvalStatuses = ["pending", "approved", "rejected","HITL Approved"];
	const plantIds = ["PLT-001", "PLT-002", "PLT-003", "PLT-004"];
	const partNumbers = ["IPA-SG-99.9", "ACE-EG-99.5", "MET-AL-98.7", "ETH-GL-97.2", "HEX-AN-99.8"];
  
	const subjects = [
		"Weekly Chemical Shipment Analysis Request",
		"Monthly Quality Control Batch Review", 
		"Quarterly Material Certification Request",
		"Emergency Chemical Analysis Protocol",
		"Annual Compliance Documentation Review",
		"Bi-Weekly Production Quality Assessment",
		"Critical Material Safety Evaluation",
		"Routine Laboratory Testing Protocol",
		"Special Investigation Analysis Request",
		"Standard Operating Procedure Review",
		"Additional Quality Review Request",
		"Extended Material Testing Protocol"
	];

	const documentTypes = [
		"IPA-SG-99.9", "ACE-EG-99.5", "MET-AL-98.7", "ETH-GL-97.2", 
		"HEX-AN-99.8", "TOL-UE-96.5", "XYL-EN-98.1", "BEN-ZE-99.3",
		"CYC-HX-97.9", "BUT-AN-98.6"
	];

	for (let i = 1; i <= 12; i++) {
		const numChildren = Math.floor(Math.random() * 5) + 1; // 1-5 children
		const createdDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
		const updatedDate = new Date(createdDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000); // Up to 30 days later
    
		const owner = owners[Math.floor(Math.random() * owners.length)];
		const status = statuses[Math.floor(Math.random() * statuses.length)];
		const approvalStatus = owner.length > 0 ? approvalStatuses[Math.floor(Math.random() * 3)] : "HITL Approved";
    
		const children: Request[] = [];
    
		// Determine overall request status based on children completion
		let overallRequestStatus = "queued";
		const childStatuses: string[] = [];
    
		for (let j = 1; j <= numChildren; j++) {
			const docType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
			const batch = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + (Math.floor(Math.random() * 999) + 100);
			const childCreatedDate = new Date(createdDate.getTime() + j * 60000); // 1 minute apart
			const childUpdatedDate = new Date(childCreatedDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000); // Up to 5 days later
			const childStatus = statuses[Math.floor(Math.random() * statuses.length)];
			childStatuses.push(childStatus);
      
			children.push({
				id: `CoA-2024-${String(i).padStart(3, '0')}-${j}`,
				message_id: `MSG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`, // Added message_id
				lot_id: Math.floor(Math.random() * 1000000).toString(),
				initiator_email: `user${i}@entegris.com`,
				recipient_email: "qa@entegris.com",
				document_name: `${docType}-Batch-${batch}.pdf`,
				request_status: childStatus as any,
				owner: owner.length > 0 ? owner[0] : null, // Use first owner for child items
				owner_status: approvalStatus as any,
				status: childStatus as any,
				created_at: childCreatedDate.toISOString(),
				updated_at: childUpdatedDate.toISOString(),
				request_status_logs: [],
				parent_id: `REQ-2024-${String(i).padStart(3, '0')}`,
				plant_id: plantIds[Math.floor(Math.random() * plantIds.length)],
				part_number: partNumbers[Math.floor(Math.random() * partNumbers.length)],
				supplier_information: `Supplier ${j} (Contact ${j}, supplier${j}@example.com)` // Added supplier_information as string
			});
		}
    
		// Set overall status based on children
		if (childStatuses.every(s => s === "completed")) {
			overallRequestStatus = "completed";
		} else if (childStatuses.some(s => s === "failed")) {
			overallRequestStatus = "failed";
		} else {
			overallRequestStatus = "in_progress";
		}

		requests.push({
			id: `REQ-2024-${String(i).padStart(3, '0')}`,
			message_id: `MSG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`, // Added message_id
			lot_id: Math.floor(Math.random() * 1000000).toString(),
			initiator_email: `user${i}@entegris.com`,
			recipient_email: "qa@entegris.com",
			document_name: subjects[Math.floor(Math.random() * subjects.length)],
			request_status: overallRequestStatus as any,
			owner: null, // Parent rows don't have owners
			owner_status: "pending" as any, // Default approval status
			status: overallRequestStatus as any,
			created_at: createdDate.toISOString(),
			updated_at: updatedDate.toISOString(),
			request_status_logs: [],
			plant_id: plantIds[Math.floor(Math.random() * plantIds.length)],
			children: children,
			supplier_information: `Supplier ${i} (Contact ${i}, supplier${i}@example.com)` // Added supplier_information as string
		});
	}
  
	return requests;
};
