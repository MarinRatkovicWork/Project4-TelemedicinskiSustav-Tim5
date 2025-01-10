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

            const data = await response.text(); // Server response as plain text
            console.log('Login response received');
            hideLoader();

            if (response.ok) {
                console.log('Login successful');

                // Extract role and token
                const role = data.includes('Admin') ? 'Admin' : data.includes('Doctor') ? 'Doctor' : 'Patient';
                const token = data.split(": ")[1]; // Extract the token part

                // Initialize currentUser
                currentUser = {
                    email,
                    role,
                    token,
                    id: null,  // Place holder for ID to be added later
                };
                console.log(`Role determined: ${currentUser.role}`);

                // Store JWT token in localStorage
                localStorage.setItem('jwtToken', currentUser.token);
                console.log('JWT token saved to localStorage');

                // Fetch user ID if the role is Doctor or Patient
                if (currentUser.role === 'Doctor') {
                    console.log('Fetching user ID...');
                    try {
                        const idResponse = await fetch(`${apiUrl}/doctor-id?email=${encodeURIComponent(email)}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                            },
                        });

                        if (idResponse.ok) {
                        console.log(' fetch user ID');
                            const idData = await idResponse.json();
                            // Add the ID to currentUser as a new property
                            currentUser.id = idData.doctorId; // Assuming response contains "doctorId"
                            console.log(`User ID fetched: ${currentUser.id}`);
                        } else {
                            console.log('Failed to fetch user ID');
                            alert('Unable to retrieve user ID. Please try again later.');
                        }
                    } catch (idError) {
                        console.log('Error fetching user ID:', idError);
                        alert('An error occurred while fetching user ID.');
                    }
                }else if (currentUser.role === 'Patient') {
                      console.log('Fetching patient ID...');
                      try {
                          const idResponse = await fetch(`${apiUrl}/patient-id?email=${encodeURIComponent(email)}`, {
                              method: 'GET',
                              headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${token}`,
                              },
                          });

                          if (idResponse.ok) {
                              console.log('Patient ID fetched successfully');
                              const idData = await idResponse.json();
                              // Add the ID to currentUser as a new property
                              currentUser.id = idData.patientId; // Assuming response contains "patientId"
                              console.log(`User ID fetched: ${currentUser.id}`);
                          } else {
                              console.log('Failed to fetch patient ID');
                              alert('Unable to retrieve patient ID. Please try again later.');
                          }
                      } catch (idError) {
                          console.log('Error fetching patient ID:', idError);
                          alert('An error occurred while fetching patient ID.');
                      }
                }

                // Redirect based on role
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



// Funkcija za dohvat liste pacijenata za doktora
async function loadPatientList() {
    try {
        // Dohvati auth token iz localStorage
        const authToken = localStorage.getItem("jwtToken");
        if (!authToken) {
            alert("Authorization token is missing. Please log in first.");
            return;
        }

        // Pošalji zahtjev na backend API
        const response = await fetch('http://localhost:8080/api/doctors/patients', {
            method: 'GET',
            headers: {
                'Authorization': authToken,
                'Content-Type': 'application/json'
            }
        });

        // Provjeri status odgovora
        if (!response.ok) {
            throw new Error('Error fetching patient list: ' + response.statusText);
        }

        // Parsiraj odgovor u JSON
        const patients = await response.json();

        // Prikaz pacijenata u HTML elementima
        const patientListElement = document.getElementById('patientList');
        patientListElement.innerHTML = ''; // Očisti listu prije dodavanja novih stavki

        patients.forEach(patient => {
            const li = document.createElement('li');
            li.className = 'patient-item';
            li.textContent = `${patient.firstName} ${patient.lastName} - ${patient.email}`;
            patientListElement.appendChild(li);
        });

        console.log('Lista pacijenata prikazana:', patients);
        return patients;

    } catch (error) {
        console.error('Došlo je do greške:', error);
        alert('Došlo je do greške pri dohvaćanju liste pacijenata');
    }
}
/****************************************************************************************
*******************************************************************************************
*************************************Patient Functions**************************************/
async function loadAndDisplayRecentHealthRecords() {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`http://localhost:8080/api/patients/${currentUser.id}/health-records/recent`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const records = await response.json();
            const tbody = document.getElementById('recentRecordsBody');
            tbody.innerHTML = ''; // Clear existing rows

            records.forEach(record => {
                const row = document.createElement('tr');

                // Format dateTime from LocalDateTime (ISO format) to a readable string
                const date = new Date(record.dateTime);  // Converting the string to a Date object
                const formattedDate = date.toLocaleString();  // You can customize this format as per your requirement

                row.innerHTML = `
                    <td>${formattedDate || 'N/A'}</td>
                    <td>${record.heartRate || 'N/A'}</td>
                    <td>${record.bloodPressure || 'N/A'}</td>
                    <td>${record.bloodSugar || 'N/A'}</td>
                `;
                tbody.appendChild(row);
            });
        } else {
            console.error('Failed to fetch recent health records:', response.statusText);
            alert('Unable to fetch recent health records.');
        }
    } catch (error) {
        console.error('Error fetching recent health records:', error);
    }
}


async function saveHealthData() {
    // Get the values from the form
    const heartRate = document.getElementById('heartRate').value;
    const bloodPressure = document.getElementById('bloodPressure').value;
    const bloodSugar = document.getElementById('bloodSugar').value;

    // Validate that the necessary fields are filled in
    if (!heartRate || !bloodPressure || !bloodSugar) {
        alert("Please fill in all fields.");
        return;
    }

    // Get the current user ID (you may have stored it in local storage or elsewhere)
    const patientId = currentUser.id; // This should be set somewhere in your app, like after login

    // Get the current date and time
    const currentDateTime = new Date().toISOString();  // This will create an ISO 8601 string format "yyyy-MM-dd'T'HH:mm:ss.SSSZ"

    // Create a health record object to send to the backend
    const healthRecord = {
        heartRate: heartRate,
        bloodPressure: bloodPressure,
        bloodSugar: bloodSugar,
        dateTime: currentDateTime,  // Add current dateTime
    };

    try {
        // Get the token from local storage (if applicable)
        const token = localStorage.getItem('jwtToken');

        // Send the POST request to the backend
        const response = await fetch(`http://localhost:8080/api/patients/${patientId}/health-records`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(healthRecord), // Send the health record data with dateTime
        });

        // Handle the response from the backend
        if (response.ok) {
            const savedRecord = await response.json();
            alert("Health data saved successfully!");
            console.log("Saved Record:", savedRecord);
            // You might want to refresh the health record list here
            loadAndDisplayRecentHealthRecords();
        } else {
            console.error('Failed to save health record:', response.statusText);
            alert('Unable to save health data.');
        }
    } catch (error) {
        console.error('Error saving health record:', error);
        alert('An error occurred while saving the health data.');
    }
}























function viewPatientDetails(patientId) {
    alert(`Patient details for ID: ${patientId}`); // Zamijenite s navigacijom ili prikazom u modalnom prozoru
}

// Function to show success popup
function showSuccessPopup(message) {
    alert(message);
}


