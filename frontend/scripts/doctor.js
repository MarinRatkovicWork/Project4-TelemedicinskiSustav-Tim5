// Global variable to store the selected patient data
let currentPatient = null;


async function registerPatientByDoctor() {
    // Get input values for patient registration form
    const firstName = document.getElementById("registerFirstNamePatient").value.trim();
    const lastName = document.getElementById("registerLastNamePatient").value.trim();
    const email = document.getElementById("registerEmailPatient").value.trim();
    const password = document.getElementById("registerPasswordPatient").value.trim();
    const doctorId = currentUser.id;

    // Check if all required fields are filled
    if (!firstName || !lastName || !email || !password) {
        alert("Please fill out all required fields.");
        console.log("Form validation failed: Missing required fields.");
        return;
    }

    // Prepare the payload data to send to the server
    const payload = {
        role: currentUser.role,  // Role of the current user (should be 'doctor')
        type: "patient",         // Type of entity to register ('patient')
        data: {
            firstName,
            lastName,
            email,
            password,
            doctor: {
                        id: currentUser.id|| null // Include doctor ID if available
                    }
        }
    };

    // Log the payload being sent to the server for debugging
    console.log("Payload to be sent:", JSON.stringify(payload, null, 2));

    // Fetch the JWT token for authentication from localStorage
    const authToken = localStorage.getItem("jwtToken");
    if (!authToken) {
        alert("Authorization token is missing. Please log in first.");
        console.log("Authorization token is missing.");
        return;
    }

    // Define the backend URL for registering patients
    const url = `http://localhost:8080/api/auth/register?role=doctor`;

    try {
        // Log the URL and the headers being used for the request
        console.log("Sending POST request to:", url);
        console.log("Request headers:", {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
        });

        // Send the POST request to register the patient
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`,
            },
            body: JSON.stringify(payload),  // Send the payload as the request body
        });

        // Log the response status and text
        const responseText = await response.text();
        console.log("Response Status:", response.status);
        console.log("Response Text:", responseText);

        // Handle the response based on whether the request was successful
        if (response.ok) {
            alert(responseText); // Show success message directly from the response
            console.log("Patient registered successfully:", responseText);
        } else {
            alert("Error: " + responseText); // Show error message directly from the response
            console.log("Error during registration:", responseText);
        }
    } catch (error) {
        // Log any unexpected errors
        console.error("Error during registration:", error);
        alert("An error occurred. Please try again.");
    }
}



// Funkcija za dohvat liste pacijenata
async function loadPatientList() {
    try {
        const authToken = localStorage.getItem("jwtToken");
        if (!authToken) {
            alert("Authorization token is missing. Please log in first.");
            return;
        }

        const response = await fetch('http://localhost:8080/api/doctors/patients', {
            method: 'GET',
            headers: {
                'Authorization': authToken,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching patient list: ' + response.statusText);
        }

        const patients = await response.json();
        const patientListElement = document.getElementById('patientList');
        patientListElement.innerHTML = '';

        // Add each patient as a clickable element
        patients.forEach(patient => {
            const li = document.createElement('li');
            li.className = 'patient-item';
            li.textContent = `${patient.firstName} ${patient.lastName} - ${patient.email}`;

            // When a patient is clicked, store their details globally and load health records
            li.onclick = () => {
                currentPatient = patient;  // Store the patient in the global variable
                loadPatientHealthRecords(patient.id);  // Use the patient's ID to load health records
            };

            patientListElement.appendChild(li);
        });

        console.log('Lista pacijenata prikazana:', patients);
        return patients;

    } catch (error) {
        console.error('Došlo je do greške:', error);
        alert('Došlo je do greške pri dohvaćanju liste pacijenata');
    }
}


async function loadPatientHealthRecords() {
    try {
        // Use the global currentPatient variable
        if (!currentPatient) {
            alert('No patient selected!');
            return;
        }

        const { id, firstName, lastName } = currentPatient;  // Extract data from currentPatient

        const authToken = localStorage.getItem("jwtToken");
        if (!authToken) {
            alert("Authorization token is missing. Please log in first.");
            return;
        }

        // Endpoint for fetching health records
        const response = await fetch(`http://localhost:8080/api/doctors/patients/${id}/records`, {
            method: 'GET',
            headers: {
                'Authorization': authToken,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching patient records: ' + response.statusText);
        }

        const records = await response.json();

        // Display health data on the screen
        document.getElementById('patientRecordsName').textContent = `${firstName} ${lastName}`;
        const patientHealthDataBody = document.getElementById('patientHealthDataBody');
        patientHealthDataBody.innerHTML = '';  // Clear previous records

        records.forEach(record => {
            const row = document.createElement('tr');
            const date = new Date(record.dateTime);
            const formattedDate = date.toLocaleString();

            row.innerHTML = `
                <td>${formattedDate || 'N/A'}</td>
                <td>${record.heartRate || 'N/A'}</td>
                <td>${record.bloodPressure || 'N/A'}</td>
                <td>${record.bloodSugar || 'N/A'}</td>
            `;
            patientHealthDataBody.appendChild(row);
        });

        // Show the patient's health records screen
        showPatientRecordsScreen();

    } catch (error) {
        console.error('Došlo je do greške pri dohvaćanju zdravstvenih podataka:', error);
        alert('Došlo je do greške pri dohvaćanju zdravstvenih podataka pacijenta');
    }
}



async function deletePatientFromDoctorList() {
    try {
        if (!currentPatient) {
            alert('No patient selected!');
            return;
        }

        const { id, firstName, lastName } = currentPatient;  // Extract data from currentPatient

        const authToken = localStorage.getItem("jwtToken");
        if (!authToken) {
            alert("Authorization token is missing. Please log in first.");
            return;
        }

        // Endpoint to delete the patient from the doctor's list
        const response = await fetch(`http://localhost:8080/api/doctors/patients/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': authToken,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error removing patient from doctor\'s list: ' + response.statusText);
        }

        // Success message after deleting the patient
        alert(`Patient ${firstName} ${lastName} has been removed from the doctor\'s list.`);

        // Optionally, update the UI or redirect after successful deletion
        showDoctorDashboard();  // Or any other function to show updated data

    } catch (error) {
        console.error('Error deleting patient from doctor\'s list:', error);
        alert('An error occurred while deleting the patient.');
    }
}



