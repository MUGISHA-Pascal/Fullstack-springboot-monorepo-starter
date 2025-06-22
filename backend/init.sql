-- Database initialization script
-- This script runs when the PostgreSQL container starts for the first time

-- Create database if it doesn't exist (usually handled by POSTGRES_DB env var)
-- SELECT 'CREATE DATABASE javadb' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'javadb')\gexec

-- Grant privileges (if needed)
-- GRANT ALL PRIVILEGES ON DATABASE javadb TO postgres;

-- You can add any additional initialization SQL here
-- For example, creating specific schemas, extensions, or initial data

-- Example: Enable UUID extension if needed
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Example: Create a custom schema
-- CREATE SCHEMA IF NOT EXISTS app_schema;

-- Example: Insert initial data (if needed)
-- INSERT INTO users (username, email, created_at) VALUES ('admin', 'admin@example.com', NOW()) ON CONFLICT DO NOTHING; 