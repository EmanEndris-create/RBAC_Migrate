CREATE TABLE medical_records (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_id INT NOT NULL,

    symptoms TEXT,
    diagnosis TEXT,
    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES users(id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);
