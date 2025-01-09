let currentUser = null;
let healthData = {}; // Health data for users will be dynamically added
let patients = []; // Patients list will be dynamically managed
const apiUrl = "http://localhost:8080/api/auth"; // Adjust the URL if necessary

// Login function to handle login requests
async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log('Starting login process...');

    if (email && password) {
        console.log(`Email entered: ${email}`);
        showLoader();

        try {
            console.log('Sending login request...');
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            // We now handle the response as a plain text string, not JSON
            const data = await response.text();

            console.log('Login response received');
            hideLoader();

            if (response.ok) {
                console.log('Login successful');

                // Determine the role and token from the response string
                const role = data.includes('Admin') ? 'Admin' : data.includes('Doctor') ? 'Doctor' : 'Patient';
                const token = data.split(": ")[1]; // Extract the token part

                currentUser = {
                    email,
                    role,
                    token
                };
                console.log(`Role determined: ${currentUser.role}`);

                // Store the JWT token in localStorage
                localStorage.setItem('jwtToken', currentUser.token);
                console.log('JWT token saved to localStorage');

                // Redirect user based on their role
                if (currentUser.role === 'Admin') {
                    console.log('Redirecting to Admin Dashboard...');
                    showAdminDashboard();
                } else if (currentUser.role === 'Doctor') {
                    console.log('Redirecting to Doctor Dashboard...');
                    showDoctorDashboard();
                } else {
                    console.log('Redirecting to Patient Dashboard...');
                    showDashboard();
                }
            } else {
                console.log('Login failed');
                alert(data); // Display the string message returned by the server
            }
        } catch (error) {
            console.log('Error occurred during login request:', error);
            hideLoader();
            alert('An error occurred during login. Please try again.');
        }
    } else {
        console.log('Email or password not entered');
        alert('Please enter both email and password');
    }
}

/****************************************************************************************
*******************************************************************************************
*************************************Admin Functions**************************************/

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

// Fetch all doctors for admin
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
                row.innerHTML = `
                    <td>${patient.firstName}</td>
                    <td>${patient.email}</td>
                    <td>${patient.doctor ? patient.doctor.firstName + ' ' + patient.doctor.lastName : 'No doctor assigned'}</td>
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

/****************************************************************************************
*******************************************************************************************
*************************************Doctor Functions**************************************/




























// Function to show success popup
function showSuccessPopup(message) {
    alert(message);
}


