# Users Table Schema

This table stores information about system users.

| Field Name | Data Type | Description                                  |
|------------|-----------|----------------------------------------------|
| id         | string    | Unique identifier for the user               |
| name       | string    | Full name of the user                        |
| email      | string    | Email address of the user                    |
| title      | string    | Job title of the user                        |
| role       | string    | Role of the user (e.g., ADMIN, USER)         |
| department | string    | Department the user belongs to               |
| last_login | string    | Timestamp of the user's last login           |
| status     | string    | Current status of the user (e.g., active, inactive) |
| created_at | datetime  | Timestamp when the user record was created           |
| updated_at | datetime  | Timestamp when the user record was last updated      |