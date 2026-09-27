CREATE TYPE user_role AS ENUM ('admin', 'doctor', 'receptionist');

CREATE TABLE users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);