const { findPatientById ,findPatientInfo,insertMedicalRecord,addPrescriptions,addPatient} = require('../models/patient.model');
const { getUserById,updateUserPassword } = require('../models/user.model');
const { hashPassword ,comparePassword} = require('../utils/hashPwd');
exports.viewPatient = async (req, res) => {
    const { id } = req.params;
    const patient = await findPatientById(id);
    if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json(patient);
};
exports.findPatientInfo = async (req, res) => {
    const { id } = req.params;
    try{
const patientInfo = await findPatientInfo(id);
    if (!patientInfo) {
        return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json(patientInfo);
    }catch(error){
        console.log('error', error)
    }
    
};
exports.addMedicalRecords = async (req, res) => {
    const { id:patient_id } = req.params;
    const {
doctor_id,
appointment_id,symptoms,diagnosis,notes } = req.body;
    if (patient_id,
doctor_id,
appointment_id) {
        return res.status(400).json({ message: 'Diagnosis and patient ID are required' });
    }
    const medicalRecord =[patient_id,
doctor_id,
appointment_id,symptoms || null,diagnosis || null,notes ||null];
try{
const result =await insertMedicalRecord(medicalRecord);
if(!result.rows[0]){
    return res.status(500).json({message:'failed to add medical records'});
}
   res.status(201).json({message:'Medical records added successfully'});
}catch(error){
    console.error('Error adding medical record:', error);
    res.status(500).json({ message: 'Internal server error' });
}
};
exports.addPrescriptions= async (req, res)=>{
const  {id:patient_id}= req.params;

const {medical_record_id,medicine_name ,dosage,frequency,duration,instructions} = req.body;
if(!medical_record_id || !medicine_name || !dosage || !frequency || !duration){
    return res.status(400).json({message:'All fields are required'});
    const prescription=[medical_record_id,medicine_name ,dosage,frequency,duration,instructions ||null,];
}try{
    const result = await addPrescriptions(prescription) ;
    if(!result.rows[0]){
        return res.status(500).json({message:'failed to add prescription'});
    }
    res.status(201).json({message:'Prescription added successfully'});
}catch(error){
    console.error('Error adding prescription:', error);
    res.status(500).json({ message: 'Internal server error' });
}
}
exports.addPatient=async (req,res)=>{
    const {patient_number, first_name, last_name, date_of_birth, gender,phone, address,emergency_contact} = req.body;
    if(!patient_number ||!first_name || !last_name  || !gender  ){
        return res.status(400).json({message: 'All inputs are required.'});
    }
    const patient=[patient_number, first_name, last_name, date_of_birth??null, gender, phone??null, address??null, emergency_contact??null];
    try{
        const result = await addPatient(patient);
        if(!result.rows[0]){
            return res.status(500).json({message:'failed to add patient'});
        }
        res.status(201).json({message:'Patient added successfully'});
    }catch(error){
        console.error('Error adding patient:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.changePassword = async (req, res) => {
    let id;
    let old_password;
    let new_password;
    let isAdmin = false;

    // ADMIN
    if (req.user.role === "admin") {
        isAdmin = true;
        id = req.params.id;

        ({ new_password } = req.body);

        if (!new_password || !id) {
            return res.status(400).json({
                message: "New password and user ID are required."
            });
        }
    }

    // NORMAL USER
    else {
        id = req.user.id;

        ({ old_password, new_password } = req.body);

        if (!old_password || !new_password) {
            return res.status(400).json({
                message: "Old password and new password are required."
            });
        }
    }

    try {
        const result = await getUserById(id);

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const userdbPassword = result.rows[0].password_hash;

        // Only check old password when user changes their own password
        if (!isAdmin) {
            const isAuthenticated = await comparePassword(
                old_password,
                userdbPassword
            );

            if (!isAuthenticated) {
                return res.status(401).json({
                    message: "Password is incorrect"
                });
            }
        }

        // Hash the new password
        const hashedPassword = await hashPassword(new_password);

        // Update password
        const updatePassword = await updateUserPassword(
            id,
            hashedPassword
        );

        if (updatePassword.rowCount === 0) {
            return res.status(500).json({
                message: "Failed to update password"
            });
        }

        return res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (error) {
        console.error("Error changing password:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
