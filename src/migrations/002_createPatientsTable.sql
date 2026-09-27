CREATE TYPE gender_type AS ENUM ('male', 'female');

CREATE TABLE patients (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    patient_number VARCHAR(20) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender gender_type NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    emergency_contact VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
