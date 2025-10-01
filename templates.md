# Templates Table Schema

This table stores metadata about XML templates used for generating certificates of analysis.

| Field Name     | Data Type | Description                                      |
|----------------|-----------|--------------------------------------------------|
| id             | string    | Unique identifier for the template               |
| part_no        | string    | Part number associated with the template         |
| xml_file       | string    | Filename of the XML template                     |
| created_at     | datetime  | Timestamp when the template was created          |
| updated_at     | datetime  | Timestamp when the template was last updated     |
| status         | string    | Status of the template (active, inactive, etc.)  |
| owners         | string[]  | List of owner names associated with the template |
| hintl_enabled  | boolean   | Whether HINTL is enabled for the template        |
| plant_id       | string    | Identifier for the plant associated with template|
| description    | string    | Description of the template                      |

## Relationships

- `owners` field references users by name.