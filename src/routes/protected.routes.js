const express = require('express');
const protectedRoutes = express.Router();
const {viewPatient,findPatientInfo,addMedicalRecords,addPrescriptions,addPatient,changePassword} = require('../controllers/protected.controller');
// const { authenticateToken, allowedRoles } = require('../middlewares');
const  {authentication,allowedRoles} = require('../middlewares');

// Apply authentication middleware to all protected routes
protectedRoutes.use(authentication);

protectedRoutes.get('/view-patient/:id',allowedRoles('admin', 'doctor', 'receptionist'),viewPatient);
protectedRoutes.get('/find-patient-info/:id', allowedRoles('admin', 'doctor'), findPatientInfo);


protectedRoutes.put('/add-prescriptions/:id', allowedRoles('admin', 'doctor'), addPrescriptions);

protectedRoutes.post('/add-patient', allowedRoles('admin', 'receptionist'), addPatient);
protectedRoutes.post('/add-medical-records/:id', allowedRoles('admin', 'doctor'), addMedicalRecords);

protectedRoutes.patch('/user/change-password/:id', allowedRoles('admin'), changePassword);
protectedRoutes.patch('/change-password', allowedRoles('doctor', 'receptionist'), changePassword);
module.exports = protectedRoutes;