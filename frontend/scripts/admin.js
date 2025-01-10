

async function registerAdmin() {
    const firstName = document.getElementById("registerFirstName").value;
    const lastName = document.getElementById("registerLastName").value;
    const email = document.getElementById("registerEmailAdmin").value;
    const password = document.getElementById("registerPasswordAdmin").value;
    const selectedRole = document.getElementById("selectedRole").value;

    // Ensure all fields are filled
    if (!firstName || !lastName || !email || !password || !selectedRole) {
        alert("Please fill out all fields.");
        return;
    }

    // Prepare the data in the required format
    const payload = {
        role: currentUser.role, // Since the role parameter is for authorization, set it as "admin"
        type: selectedRole.toLowerCase(),
        data: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        }
    };

    // Print payload to the console
    console.log("Payload to be sent:", JSON.stringify(payload, null, 2));

    // Fetch the JWT token for authentication
    const authToken = localStorage.getItem("jwtToken");
    if (!authToken) {
        alert("Authorization token is missing. Please log in first.");
        return;
    }

    // Backend endpoint for registering users
    const url = `http://localhost:8080/api/auth/register?role=admin`;

    try {
        // Send the POST request with the appropriate headers and payload
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(payload)
        });

        // Handle plain text or JSON response
        const responseText = await response.text();

        if (response.ok) {
            alert(responseText); // Show success message directly from the response
        } else {
            alert("Error: " + responseText); // Show error message directly from the response
        }
    } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred. Please try again.");
    }
}

async function getDoctors() {
    const doctorListAdmin = document.getElementById('doctorListAdmin');
    doctorListAdmin.innerHTML = '';  // Clear previous content

    const authToken = localStorage.getItem("jwtToken");
    if (!authToken) {
        alert('Authorization token is missing. Please log in first.');
        return;
    }

    try {
        // Send GET request to the backend to fetch doctors
        const response = await fetch("http://localhost:8080/api/doctors/", {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${authToken}`,
            }
        });

        if (response.ok) {
            const doctors = await response.json();  // Parse the response as JSON

            // Populate the doctor table
            doctors.forEach((doctor) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${doctor.firstName} ${doctor.lastName}</td>
                    <td>${doctor.email}</td>
                    <td>${doctor.patients ? doctor.patients.length : 0}</td>  <!-- Show the number of patients -->
                    <td><button class="button button-danger" onclick="deleteDoctor(${doctor.id})">Delete</button></td>
                `;
                doctorListAdmin.appendChild(row);
            });
        } else {
            const errorText = await response.text();
            alert(`Error fetching doctors: ${errorText}`);
        }
    } catch (error) {
        console.error('Error occurred while fetching doctors:', error);
        alert('An error occurred while fetching doctor data.');
    }
}

async function getPatients() {
    const patientListAdmin = document.getElementById('patientListAdmin');
    patientListAdmin.innerHTML = '';  // Clear previous content

    const authToken = localStorage.getItem("jwtToken");
    if (!authToken) {
        alert('Authorization token is missing. Please log in first.');
        return;
    }

    try {
        // Send GET request to the backend to fetch patients
        const response = await fetch("http://localhost:8080/api/patients/", {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${authToken}`,
            }
        });

        if (response.ok) {
            const patients = await response.json();  // Parse the response as JSON

            // Populate the patient table
            patients.forEach((patient) => {
                const row = document.createElement('tr');

                // Extract doctorName directly from the API response
                const doctorName = patient.doctorName ? patient.doctorName : 'No doctor assigned';

                row.innerHTML = `
                    <td>${patient.firstName}</td>
                    <td>${patient.email}</td>
                    <td>${doctorName}</td>
                    <td><button class="button button-danger" onclick="deletePatient(${patient.id})">Delete</button></td>
                `;
                patientListAdmin.appendChild(row);
            });
        } else {
            const errorText = await response.text();
            alert(`Error fetching patients: ${errorText}`);
        }
    } catch (error) {
        console.error('Error occurred while fetching patients:', error);
        alert('An error occurred while fetching patient data.');
    }
}

async function deleteDoctor(doctorId) {
    const authToken = localStorage.getItem("jwtToken");
    if (!authToken) {
        alert("Authorization token is missing. Please log in first.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/auth/doctor/${doctorId}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${authToken}`,
            },
        });

        const responseText = await response.text();
        if (response.ok) {
            alert(responseText);
            getDoctors(); // Refresh the doctor list after deletion
        } else {
            alert("Error: " + responseText);
        }
    } catch (error) {
        console.error('Error occurred while deleting doctor:', error);
        alert('An error occurred while deleting doctor.');
    }
}

async function deletePatient(patientId) {
    const authToken = localStorage.getItem("jwtToken");
    if (!authToken) {
        alert("Authorization token is missing. Please log in first.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/auth/patient/${patientId}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${authToken}`,
            },
        });

        const responseText = await response.text();
        if (response.ok) {
            alert(responseText);
            getPatients(); // Refresh the patient list after deletion
        } else {
            alert("Error: " + responseText);
        }
    } catch (error) {
        console.error('Error occurred while deleting patient:', error);
        alert('An error occurred while deleting patient.');
    }
}



