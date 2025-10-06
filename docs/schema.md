# Schema Documentation

This document outlines the database schemas for various entities within the system.

## Part Numbers Table Schema

This table stores information about part numbers.

| Field Name | Data Type | Description | Optional |
|---|---|---|---|
| id | integer | Unique identifier for the part number | No |
| number | varchar(255) | The part number | No |
| description | text | Description of the part number | Yes |
| created_at | datetime | Timestamp when the record was created | No |
| updated_at | datetime | Timestamp when the record was last updated | Yes |

## Plants Table Schema

This table stores information about manufacturing plants.

| Field Name | Data Type | Description | Optional |
|---|---|---|---|
| id | integer | Unique identifier for the plant | No |
| name | varchar(255) | Name of the plant | No |
| description | text | Description of the plant | Yes |
| created_at | datetime | Timestamp when the record was created | No |
| updated_at | datetime | Timestamp when the record was last updated | Yes |

## Templates Table Schema

This table stores metadata about XML templates used for generating certificates of analysis.

| Field Name | Data Type | Description | Optional | Enum Values |
|---|---|---|---|---|
| id | integer | Unique identifier for the template | No | |
| tamplate_code | varchar(255) | auto generated template code | No | |
| part_id | varchar(255) | Part number associated with the template | No | |
| xml_file_path | varchar(255) | content of the XML | No | |
| hintl_enabled | boolean | Indicates if Human-in-the-loop is enabled | Yes | |
| status | enum | Current status of the template | No | inactive, active, archived, deleted |
| created_at | datetime | Timestamp when the template was created | No | |
| updated_at | datetime | Timestamp when the template was last updated | Yes | |

## Responsibilities Table Schema

This table defines the responsibilities assigned to users for specific parts, plants, and templates.

| Field Name | Data Type | Description | Optional | Reference Details |
|---|---|---|---|---|
| id | integer | Unique identifier for the responsibility assignment | No | |
| user_id | integer | Foreign key referencing the Users table | No | Users.id |
| part_id | integer | Foreign key referencing the Part Numbers table | No | Part_Numbers.id |
| plant_id | integer | Foreign key referencing the Plants table | No | Plants.id |
| created_at | datetime | Timestamp when the record was created | No | |
| updated_at | datetime | Timestamp when the record was last updated | Yes | |

## Requests Table Schema

This table stores information about requests made in the system.

| Field Name | Data Type | Description | Optional | Enum Values |
|---|---|---|---|---|
| id | integer | Unique identifier for the request | No | |
| RequestId | varchar(255) | Unique for the request | No | |
| originator_name | varchar(255) | Name of the request originator | Yes | |
| originator_email | varchar(255) | Email of the request originator | Yes | |
| recepient_email | varchar(255) | Email of the recipient | Yes | |
| title | varchar(255) | Subject of the email | Yes | |
| status | enum | Current status of the request | Yes | completed, in_progress, failed, queued, template_generated, parsed |
| created_at | datetime | Timestamp when the record was created | Yes | |
| updated_at | datetime | Timestamp when the record was last updated | Yes | |

## Documents Table Schema

This table stores information about documents associated with requests.

| Field Name | Data Type | Description | Optional | Enum Values | Reference Details |
|---|---|---|---|---|---|
| id | integer | Unique identifier for the document | No | | |
| request_id | integer | Foreign key referencing the Requests table | Yes | | Requests.id |
| document_id | integer | Unique for document id | Yes | | Yes |
| part_id | integer | Foreign key referencing the Part Numbers table | No | Part_Numbers.id |
| plant_id | integer | Foreign key referencing the Plants table | No | Plants.id |
| file_name | varchar(255) | Name of the document file | Yes | | |
| owner_ids | json array of integers | JSON array of user IDs who own the document | Yes | | Users.id |
| owner_status | enum | Status of the document owner | Yes | pending, accepted, rejected, unassigned | |
| status | enum | Current status of the document | Yes | completed, in_progress, failed, queued, pending | |

## Users Table Schema

This table stores information about system users.

| Field Name | Data Type | Description | Optional |
|---|---|---|---|
| id | varchar(255) | Unique identifier for the user | No |
| name | varchar(255) | Full name of the user | No |
| email | varchar(64) | Email address of the user | No |
| contact_number | varchar(16) | Contact number of the user | Yes |
| title | varchar(255) | Job title of the user | Yes |
| department | varchar(255) | Department the user belongs to | Yes |
| description | varchar(1024) | Description of the user or their role | Yes |
| role | varchar(255) | Role of the user (e.g., ADMIN, USER) | No |
| last_login | datetime | Timestamp of the user's last login | Yes |
| created_at | datetime | Timestamp when the user record was created | No |
| updated_at | datetime | Timestamp when the user record was last updated | Yes |
