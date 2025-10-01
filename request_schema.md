# Request Schema

This document outlines the schema for a `Request` object, derived from the application's mock data and UI components.

## Request Interface

```typescript
interface Request {
  id: string; // Unique identifier for the request (e.g., "REQ-2024-001", "CoA-2024-001-1")
  created_date: string; // ISO date string of when the request was created
  initiator_email: string; // Email of the user who initiated the request
  recipient_email: string; // Email of the recipient for the request
  document_name: string; // Name of the document associated with the request
  pdf_file?: string; // Optional: Path to the PDF file
  xml_file?: string; // Optional: Path to the XML file
  request_status: "completed" | "in_progress" | "failed" | "queued" | "template_generated" | "parsed" | string; // Current status of the request
  owner: string | null; // Name of the owner, or null if unassigned
  owner_status: "pending" | "accepted" | "rejected" | "unassigned" | string; // Approval status by the owner
  status: "completed" | "in_progress" | "failed" | "queued" | "pending" | string; // General status (similar to request_status but used in UI)
  created_at: string; // ISO date string of when the record was created (for auditing)
  updated_at: string; // ISO date string of when the record was last updated (for auditing)
  request_status_logs: any[]; // Array to store status change logs (details not fully defined in mock)
  parent_id?: string; // Optional: ID of the parent request if this is a child request (Foreign Key to Request.id)
  children?: Request[]; // Optional: Array of child requests (representing a one-to-many relationship where child.parent_id links to this request's id)
  plant_id?: string; // Optional: Plant ID, primarily for child requests
  part_number?: string; // Optional: Part number, primarily for child requests
}
```

## Field Descriptions

*   **`id`**: A unique identifier for each request. Parent requests typically start with "REQ-" and child requests with "CoA-".
*   **`created_date`**: The date and time when the request was initially created, in ISO 8601 format.
*   **`initiator_email`**: The email address of the user who initiated the request.
*   **`recipient_email`**: The email address of the intended recipient for the request.
*   **`document_name`**: The name or subject of the document associated with the request.
*   **`pdf_file`** (Optional): The file path to the PDF version of the document.
*   **`xml_file`** (Optional): The file path to the XML version of the document.
*   **`request_status`**: The internal processing status of the request. Possible values observed include "completed", "in_progress", "failed", "queued", "template_generated", "parsed".
*   **`owner`**: The name of the individual assigned to own or process the request. Can be `null` if unassigned.
*   **`owner_status`**: The approval status related to the owner's action on the request. Possible values include "pending", "accepted", "rejected", "unassigned".
*   **`status`**: A general status for the request, often used for display in the UI. Similar to `request_status` but might represent a consolidated view. Possible values include "completed", "in_progress", "failed", "queued", "pending".
*   **`created_at`**: Timestamp indicating when the request record was created in the system, in ISO 8601 format. This is for auditing purposes.
*   **`updated_at`**: Timestamp indicating the last time the request record was updated, in ISO 8601 format. This is for auditing purposes.
*   **`request_status_logs`**: An array that would typically contain a history of status changes for the request. The exact structure of log entries is not detailed in the mock data.
*   **`parent_id`** (Optional): If the request is a child request (e.g., a CoA), this field links it to its parent request. This acts as a **Foreign Key** referencing the `id` field of another `Request` object.
*   **`children`** (Optional): An array of `Request` objects, representing sub-requests or child documents associated with a parent request. This establishes a **one-to-many relationship** where the `parent_id` of each child in this array would link back to the `id` of the current request.
*   **`plant_id`** (Optional): An identifier for the plant associated with the request, primarily seen in child requests.
*   **`part_number`** (Optional): The part number related to the request, primarily seen in child requests.