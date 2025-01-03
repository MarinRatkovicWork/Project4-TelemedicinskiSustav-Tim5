let loginType = 'patient';
let healthData = {};
let patients = [];

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
    const password = document.getElementById('password').value;

    if (email && password) {
        const response = await fetch(`/api/login?type=${loginType}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            if (loginType === 'doctor') {
                showDoctorDashboard();
            } else {
                showDashboard();
            }
        } else {
            alert('Invalid email or password');
        }
    } else {
        alert('Please enter both email and password');
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
// Prikaz korisničkog sučelja za pacijenta
function showDashboard() {
    hideAllScreens();
    document.getElementById('dashboardScreen').style.display = 'block';
    displayRecentRecords();
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
