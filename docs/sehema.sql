-- Drop tables and types if they exist to allow for re-execution
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS responsibilities CASCADE;
DROP TABLE IF EXISTS requests CASCADE;
DROP TABLE IF EXISTS templates CASCADE;
DROP TABLE IF EXISTS plants CASCADE;
DROP TABLE IF EXISTS part_numbers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS template_status_enum;
DROP TYPE IF EXISTS request_status_enum;
DROP TYPE IF EXISTS owner_status_enum;
DROP TYPE IF EXISTS document_status_enum;

-- Create ENUM types
CREATE TYPE template_status_enum AS ENUM ('inactive', 'active', 'archived', 'deleted');
CREATE TYPE request_status_enum AS ENUM ('completed', 'in_progress', 'failed', 'queued', 'template_generated', 'parsed');
CREATE TYPE owner_status_enum AS ENUM ('pending', 'accepted', 'rejected', 'unassigned');
CREATE TYPE document_status_enum AS ENUM ('completed', 'in_progress', 'failed', 'queued', 'pending');

-- Create Users Table
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(64) NOT NULL UNIQUE,
    contact_number VARCHAR(16),
    title VARCHAR(255),
    department VARCHAR(255),
    description VARCHAR(1024),
    role VARCHAR(255) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Part Numbers Table
CREATE TABLE part_numbers (
    id INTEGER PRIMARY KEY,
    number VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Plants Table
CREATE TABLE plants (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Templates Table
CREATE TABLE templates (
    id INTEGER PRIMARY KEY,
    part_id VARCHAR(255) NOT NULL, -- Note: Schema specifies varchar(255) here, not integer referencing part_numbers.id
    xml_file_path VARCHAR(255) NOT NULL,
    hintl_enabled BOOLEAN,
    status template_status_enum NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Requests Table
CREATE TABLE requests (
    id INTEGER PRIMARY KEY,
    request_code VARCHAR(255) NOT NULL UNIQUE,
    email_date TIMESTAMP WITH TIME ZONE NOT NULL,
    originator_name VARCHAR(255),
    originator_email VARCHAR(255),
    recipient_email VARCHAR(255),
    title VARCHAR(255),
    status request_status_enum,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Responsibilities Table
CREATE TABLE responsibilities (
    id INTEGER PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id),
    part_id INTEGER NOT NULL REFERENCES part_numbers(id),
    plant_id INTEGER NOT NULL REFERENCES plants(id),
    template_id INTEGER NOT NULL REFERENCES templates(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Documents Table
CREATE TABLE documents (
    id INTEGER PRIMARY KEY,
    request_id INTEGER REFERENCES requests(id),
    document_id INTEGER UNIQUE, -- Unique but optional
    part_id INTEGER NOT NULL REFERENCES part_numbers(id),
    plant_id INTEGER NOT NULL REFERENCES plants(id),
    file_name VARCHAR(255),
    owner_ids JSONB, -- Storing as JSONB for array of integers
    owner_status owner_status_enum,
    status document_status_enum
);
