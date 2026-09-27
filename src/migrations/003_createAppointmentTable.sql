CREATE TABLE appointments (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,

    appointment_date TIMESTAMP NOT NULL,
    reason TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled'
        CHECK (status IN ('scheduled', 'completed', 'cancelled')),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (patient_id)
        REFERENCES patients(id),

    FOREIGN KEY (doctor_id)
        REFERENCES users(id)
);