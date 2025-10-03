# Responsibilities Page Schema

This document describes the conceptual schema for responsibilities in the system.

## Responsibility Entities

```mermaid
erDiagram
    USER {
        string id PK
        string name
        string email
    }

    PART_NUMBER {
        string id PK
        string name
        string description
    }

    PLANT {
        string id PK
        string name
        string description
    }

    RESPONSIBILITY_ASSIGNMENT {
        string id PK
        string roleId
        string userId FK "User assigned to this responsibility"
        string role "e.g., ADMIN, VIEWER, etc."
        string partNumberId FK "Part number associated with this responsibility"
        string plantId FK "Plant associated with this responsibility"
        boolean hitlEnabled "Human-in-the-loop enabled"
        timestamp createdAt
        timestamp updatedAt
    }

    RESPONSIBILITY_ASSIGNMENT ||--o{ USER : "assigned to"
    RESPONSIBILITY_ASSIGNMENT ||--o{ PART_NUMBER : "for"
    RESPONSIBILITY_ASSIGNMENT ||--o{ PLANT : "at"