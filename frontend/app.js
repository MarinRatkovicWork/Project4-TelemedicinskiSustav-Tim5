let loginType = 'patient';
let healthData = {};
let patients = [];
let currentUserId = null;
let recentHealthRecords = [];

// Postavljanje tipa prijave
function setLoginType(type) {
    loginType = type;
    document.querySelectorAll('.login-option').forEach(option => {
        option.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Funkcija za prijavu
async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value; // Lozinka umjesto imena

    // Provjera da li su email i lozinka uneseni
    if (!email || !password) {
        alert('Molimo unesite email i lozinku!');
        return;
    }

    // Slanje POST zahtjeva na backend za prijavu
    const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // Šaljemo email i lozinku
    });

    // Obrada odgovora sa servera
    if (response.ok) {
        const user = await response.json();
        currentUserId = user.id; // Save the user ID
        alert('Prijava uspješna!');
        showDashboard(user); // Prikaz dashboarda nakon uspješne prijave
    } else {
        const errorMessage = await response.text();
        alert(`Greška: ${errorMessage}`);
    }
}


// Funkcija za registraciju
async function register() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    // Provjera da li se lozinke podudaraju
    if (password !== confirmPassword) {
        alert('Lozinke se ne podudaraju!');
        return;
    }

    // Provjera da li je lozinka prazna
    if (!password || password.trim() === "") {
        alert('Lozinka ne smije biti prazna!');
        return;
    }

    // Priprema podataka za slanje
    const patientData = {
        name: name,
        email: email,
        password: password
    };

    // Slanje POST zahtjeva na backend
    const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData),
    });

    // Obrada odgovora sa servera
    if (response.ok) {
        alert(response.ok + 'Registracija uspješna! Sada se možete prijaviti.');
        showLoginScreen();
    } else {
        const errorMessage = await response.text();
        alert(`Greška: ${errorMessage}`);
    }
}
/// Fetch recent health records from the backend
 async function fetchRecentHealthRecords() {
     const response = await fetch('http://localhost:8080/api/health-records/recent'); // Get recent records from the backend

     // Check if the response is successful
     if (response.ok) {
         recentHealthRecords = await response.json(); // Store the records in the global variable
         updateRecentRecordsTable(); // Call function to update the table
     } else {
         const errorMessage = await response.text();
         alert(`Error fetching records: ${errorMessage}`);
     }
 }


 // Update the table with the fetched recent health records
 function updateRecentRecordsTable() {
     const tableBody = document.getElementById('recentRecordsBody');
     tableBody.innerHTML = ''; // Clear any existing data

     // Loop through the records and insert rows in the table
     recentHealthRecords.forEach(record => {
         const row = tableBody.insertRow();

         // Create table cells and populate them with the record data
         row.insertCell(0).textContent = record.date;
         row.insertCell(1).textContent = record.heartRate;
         row.insertCell(2).textContent = record.bloodPressure;
         row.insertCell(3).textContent = record.bloodSugar;
     });
 }


 // Prikaz prethodnih podataka (which will fetch and display all health data)
 function showPreviousData() {
     hideAllScreens();
     document.getElementById('previousDataScreen').style.display = 'block';
     displayHealthData();
 }

 // Function to display health data in another screen
 function displayHealthData() {
     // Assuming this is where we want to display the full list of records
     const tableBody = document.getElementById('fullHealthDataBody');
     tableBody.innerHTML = ''; // Clear any existing data

     // Loop through the records and insert rows
     recentHealthRecords.forEach(record => {
         const row = tableBody.insertRow();
         row.insertCell(0).textContent = record.date;
         row.insertCell(1).textContent = record.heartRate;
         row.insertCell(2).textContent = record.bloodPressure;
         row.insertCell(3).textContent = record.bloodSugar;
     });
 }

async function addHealthRecord() {
    const heartRate = document.getElementById('heartRate').value;
    const bloodPressure = document.getElementById('bloodPressure').value;
    const bloodSugar = document.getElementById('bloodSugar').value;

    // Use the current date in 'YYYY-MM-DD' format
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in ISO format (YYYY-MM-DD)

    // Ensure all fields are filled
    if (!heartRate || !bloodPressure || !bloodSugar || !currentUserId) {
        alert('Please fill in all the fields!');
        return;
    }

    // Prepare the health record object
    const healthRecord = {
        date: currentDate, // Use current date
        heartRate: parseInt(heartRate),
        bloodPressure: bloodPressure,
        bloodSugar: parseInt(bloodSugar),
        patient: { id: currentUserId }, // Use the current logged-in user's ID
    };

    // Send the POST request to the backend to add the health record
    const response = await fetch('http://localhost:8080/api/health-records', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(healthRecord),
    });


    if (response.ok) {
        const record = await response.json();
        alert('Health record added successfully!');
        console.log('Added record:', record);
    } else {
        const errorMessage = await response.text();
        alert(`Error: ${errorMessage}`);
    }
}

// Prikazuje ekran za prijavu
 function showLoginScreen() {
     hideAllScreens(); // Sakrij sve ekrane
     const loginScreen = document.getElementById('loginScreen');
     if (loginScreen) {
         loginScreen.style.display = 'block'; // Prikazujemo ekran za prijavu
     } else {
         console.error("Ekran za prijavu nije pronađen!");
     }
 }
// Prikazuje ekran za registraciju
function showRegisterScreen() {
    hideAllScreens();
    const registerScreen = document.getElementById('registerScreen');
    if (registerScreen) {
        registerScreen.style.display = 'block';
    } else {
        console.error("Ekran za registraciju nije pronađen!");
    }
}
function showDashboard(user) {
    hideAllScreens();
    document.getElementById('dashboardScreen').style.display = 'block';
    fetchRecentHealthRecords(); // Fetch recent health records when dashboard is shown
}


// Prikaz korisničkog sučelja za doktora
async function showDoctorDashboard() {
    hideAllScreens();
    document.getElementById('doctorScreen').style.display = 'block';
    await fetchPatients();
    displayPatientList();
}

// Funkcija za prikaz prethodnih podataka
function showPreviousData() {
    hideAllScreens();
    document.getElementById('previousDataScreen').style.display = 'block';
    displayHealthData();
}

// Sakrij sve ekrane
function hideAllScreens() {
    const screens = ['loginScreen', 'dashboardScreen', 'metricsScreen', 'successScreen', 'doctorScreen', 'previousDataScreen', 'addPatientScreen', 'patientRecordsScreen'];
    screens.forEach(screen => {
        document.getElementById(screen).style.display = 'none';
    });
}

// Brisanje pacijenta
async function deletePatient(index) {
    const patient = patients[index];

    if (confirm('Are you sure you want to delete this patient?')) {
        const response = await fetch(`/api/patients/${patient.id}`, { method: 'DELETE' });

        if (response.ok) {
            patients.splice(index, 1);
            displayPatientList();
        }
    }
}

// Ažuriranje pacijenta
async function updatePatient(index) {
    const patient = patients[index];
    const name = prompt('Update patient name:', patient.name);
    const email = prompt('Update patient email:', patient.email);

    if (name && email) {
        const response = await fetch(`/api/patients/${patient.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        });

        if (response.ok) {
            patients[index] = { ...patient, name, email };
            displayPatientList();
        }
    }
}
function showHealthMetrics() {
        hideAllScreens();
        document.getElementById('metricsScreen').style.display = 'block';
    }
// Dodavanje novog pacijenta
async function addNewPatient() {
    const name = document.getElementById('newPatientName').value;
    const email = document.getElementById('newPatientEmail').value;

    if (name && email) {
        const response = await fetch('/api/patients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        });

        if (response.ok) {
            alert('Patient added successfully!');
            await fetchPatients();
            showDoctorDashboard();
        }
    } else {
        alert('Please enter both name and email');
    }
}

// Dohvaćanje popisa pacijenata s backenda
async function fetchPatients() {
    const response = await fetch('/api/patients');
    patients = await response.json();
}

// Prikaz popisa pacijenata
function displayPatientList() {
    const patientList = document.getElementById('patientList');
    patientList.innerHTML = '';
    patients.forEach((patient, index) => {
        const patientCard = document.createElement('div');
        patientCard.className = 'patient-card';
        patientCard.innerHTML = `
            <img src="https://i.pravatar.cc/150?img=${patient.id}" alt="${patient.name}">
            <div class="patient-info">
                <div class="patient-name">${patient.name}</div>
                <div class="patient-appointment">${patient.email}</div>
            </div>
            <div class="dropdown">
                <button class="button button-secondary">...</button>
                <div class="dropdown-content">
                    <a href="#" onclick="deletePatient(${index})">Delete Patient</a>
                    <a href="#" onclick="updatePatient(${index})">Update Patient</a>
                </div>
            </div>
        `;
        patientCard.onclick = () => showPatientRecords(patient);
        patientList.appendChild(patientCard);
    });
}

// Prikaz medicinskih podataka pacijenta
async function showPatientRecords(patient) {
    hideAllScreens();
    document.getElementById('patientRecordsScreen').style.display = 'block';
    document.getElementById('patientRecordsName').textContent = patient.name;

    const response = await fetch(`/api/patients/${patient.id}/records`);
    const records = await response.json();

    const tableBody = document.getElementById('patientHealthDataBody');
    tableBody.innerHTML = '';
    records.forEach(data => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = data.date;
        row.insertCell(1).textContent = data.heartRate;
        row.insertCell(2).textContent = data.bloodPressure;
        row.insertCell(3).textContent = data.bloodSugar;
    });
}

// Spremanje medicinskih podataka pacijenta
async function saveHealthData() {
    const heartRate = document.getElementById('heartRate').value;
    const bloodPressure = document.getElementById('bloodPressure').value;
    const bloodSugar = document.getElementById('bloodSugar').value;

    const response = await fetch('/api/health-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            date: new Date().toISOString().split('T')[0],
            heartRate: parseInt(heartRate),
            bloodPressure,
            bloodSugar: parseInt(bloodSugar),
            patient: { id: patients[0].id } // Replace with actual patient ID
        })
    });

    if (response.ok) {
        alert('Health data saved successfully!');
        showDashboard();
    }
}

// Inicijalizacija aplikacije
document.addEventListener('DOMContentLoaded', async () => {
    hideAllScreens();
    document.getElementById('loginScreen').style.display = 'block';
    await fetchPatients();
});
