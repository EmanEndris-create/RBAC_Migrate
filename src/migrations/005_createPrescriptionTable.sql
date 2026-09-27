CREATE TABLE prescriptions (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    medical_record_id INT NOT NULL,

    medicine_name VARCHAR(150) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    instructions TEXT,

    FOREIGN KEY (medical_record_id)
        REFERENCES medical_records(id)
        ON DELETE CASCADE
);
