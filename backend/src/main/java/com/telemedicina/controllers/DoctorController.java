package com.telemedicina.controllers;

import com.telemedicina.models.Doctor;
import com.telemedicina.models.HealthRecord;
import com.telemedicina.models.Patient;
import com.telemedicina.services.DoctorService;
import com.telemedicina.services.AuthService;
import com.telemedicina.services.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;
    private final AuthService authService;

    @Autowired
    private PatientService patientService;


    @Autowired
    public DoctorController(DoctorService doctorService, AuthService authService) {
        this.doctorService = doctorService;
        this.authService = authService;
    }

    // Endpoint to get all doctors only for Admins
    @GetMapping("/")
    public List<Doctor> getAllDoctors(@RequestHeader("Authorization") String authToken) {
        // Check if the token is valid and the user is an Admin
        if (authService.isAdmin(authToken)) {
            return doctorService.getAllDoctors();
        } else {
            throw new RuntimeException("You do not have permission to access this resource.");
        }
    }

    @GetMapping("/patients")
    public List<Patient> getPatientsForDoctor(@RequestHeader("Authorization") String authToken) {
        // Verify the token and get the authenticated doctor
        Long doctorId = authService.getAuthenticatedDoctorId(authToken);

        if (doctorId != null) {

            return patientService.getPatientsByDoctorId(doctorId);
        } else {
            throw new RuntimeException("You are not authorized to access this resource.");
        }
    }

    @GetMapping("/patients/{patientId}/records")
    public List<HealthRecord> getPatientHealthRecords(
            @RequestHeader("Authorization") String authToken,
            @PathVariable Long patientId) {

        // Verifikujte token i dobijte ID doktora
        Long doctorId = authService.getAuthenticatedDoctorId(authToken);

        if (doctorId != null) {
            // Proverite da li pacijent pripada doktoru
            if (patientService.isPatientAssignedToDoctor(patientId, doctorId)) {
                return patientService.getHealthRecordsByPatientId(patientId);
            } else {
                throw new RuntimeException("You are not authorized to access this patient's records.");
            }
        } else {
            throw new RuntimeException("You are not authorized to access this resource.");
        }
    }

    @DeleteMapping("/patients/{patientId}")
    public String deletePatientFromDoctorList(
            @RequestHeader("Authorization") String authToken,
            @PathVariable Long patientId) {

        // Verify doctor authorization
        Long doctorId = authService.getAuthenticatedDoctorId(authToken);

        if (doctorId == null) {
            throw new RuntimeException("You are not authorized to perform this action.");
        }

        // Find patient and doctor
        Patient patient = patientService.getPatientById(patientId);
        Doctor doctor = doctorService.getDoctorById(doctorId);

        if (patient == null || doctor == null) {
            throw new RuntimeException("Patient or Doctor not found.");
        }

        // Remove patient from doctor's list
        doctor.getPatients().remove(patient);

        // Set the doctor field in patient to null
        patient.setDoctor(null);

        // Save updated doctor and patient
        doctorService.saveDoctor(doctor);
        patientService.savePatient(patient);

        return "Patient removed from doctor's list successfully.";
    }

}
