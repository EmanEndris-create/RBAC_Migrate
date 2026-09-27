const pool = require('../config/db');

exports.findPatientById = async (id) => {
    const result = await pool.query('SELECT p.id, p.first_name, p.last_name, p.date_of_birth, p.gender FROM patients p WHERE p.id = $1', [id]);
    return result.rows[0];
};
exports.findPatientInfo = async (id) => {

    const result = await pool.query('SELECT mr.symptoms, mr.diagnosis, mr.notes, pr.medicine_name, pr.dosage, pr.frequency, pr.duration, pr.instructions FROM medical_records mr JOIN prescriptions pr ON mr.id = pr.medical_record_id WHERE mr.patient_id = $1', [id]);
    return result.rows[0];
};
exports.insertMedicalRecord = async (medicalRecord) =>{
  const result = await pool.query('INSERT INTO medical_records (patient_id, doctor_id, appointment_id, symptoms, diagnosis, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', medicalRecord);
  return result;
}
exports.addPrescriptions=async (prescriptions)=>{
  const result = await pool.query('INSERT INTO prescriptions (medical_records_id, medicine_name, dosage, frequency, duration, instructions) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', prescriptions);
  return result;
}
exports.addPatient=async (patient)=>{
  const result = await pool.query('INSERT INTO patients (patient_number, first_name, last_name, date_of_birth, gender, phone, address, emergency_contact) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', patient);
  return result;
}
