

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