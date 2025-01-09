let currentUser = null;
let healthData = {}; // Health data for users will be dynamically added
let patients = []; // Patients list will be dynamically managed
const apiUrl = "http://localhost:8080/api/auth"; // Adjust the URL if necessary

// Functions for showing/hiding loader
function showLoader() {
    document.getElementById('loader').style.display = 'flex';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

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


// Function to show the admin dashboard
function showAdminDashboard() {
    showLoader();
    setTimeout(() => {
        hideAllScreens();
        document.getElementById('adminScreen').style.display = 'block';

        displayUserInfo('adminScreen');
        hideLoader();
    }, 1000);
}

// Function to show the doctor dashboard
function showDoctorDashboard() {
    showLoader();
    setTimeout(() => {
        hideAllScreens();
        document.getElementById('doctorScreen').style.display = 'block';
        displayPatientList();
        displayUserInfo('doctorScreen');
        hideLoader();
    }, 1000);
}

// Function to show the user dashboard
function showDashboard() {
    showLoader();
    setTimeout(() => {
        hideAllScreens();
        document.getElementById('dashboardScreen').style.display = 'block';
        displayRecentRecords();
        displayUserInfo('dashboardScreen');
        hideLoader();
    }, 1000);
}
function showRegisterForm() {
        hideAllScreens();
        document.getElementById('registerScreen').style.display = 'block';
    }

 // Function to hide all screens
function hideAllScreens() {
    const screens = ['loginScreen', 'dashboardScreen', 'metricsScreen', 'doctorScreen', 'previousDataScreen', 'addPatientScreen', 'patientRecordsScreen', 'registerScreen', 'changePasswordScreen', 'adminScreen'];
    screens.forEach(screen => {
        document.getElementById(screen).style.display = 'none';
    });
}

// Displaying user information
function displayUserInfo(screenId) {
    const screen = document.getElementById(screenId);
    const existingUserInfo = screen.querySelector('.user-info');
    if (existingUserInfo) {
        existingUserInfo.remove();
    }
    const userInfoDiv = document.createElement('div');
    userInfoDiv.className = 'user-info';
    userInfoDiv.innerHTML = `
        <div>${currentUser.name}</div>
        <div>${currentUser.email}</div>
        <div>${currentUser.role}</div>
    `;
    screen.appendChild(userInfoDiv);
}

// Function to logout
function logout() {
    localStorage.removeItem('jwtToken');
    currentUser = null;
    hideAllScreens();
    document.getElementById('loginScreen').style.display = 'block';
}

// Function to register a new patient
async function addNewPatient() {
    showLoader();
    setTimeout(async () => {
        const name = document.getElementById('newPatientName').value;
        const email = document.getElementById('newPatientEmail').value;
        const password = document.getElementById('newPatientPassword').value;
        if (name && email && password) {
            const data = {
                type: 'patient',
                data: { name, email, password }
            };
            const token = localStorage.getItem('jwtToken');
            const response = await fetch(`${apiUrl}/register?role=doctor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            const responseData = await response.json();
            hideLoader();
            if (response.ok) {
                showDoctorDashboard();
                showSuccessPopup('New patient added successfully');
            } else {
                alert(responseData);
            }
        } else {
            hideLoader();
            alert('Please enter name, email, and password');
        }
    }, 1000);
}

// Function to show success popup
function showSuccessPopup(message) {
    alert(message);
}

// Function to save health data
async function saveHealthData() {
    showLoader();
    setTimeout(() => {
        const heartRate = document.getElementById('heartRate').value;
        const bloodPressure = document.getElementById('bloodPressure').value;
        const bloodSugar = document.getElementById('bloodSugar').value;
        const date = new Date().toLocaleString();
        if (!healthData[currentUser.email]) {
            healthData[currentUser.email] = [];
        }
        healthData[currentUser.email].push({ date, heartRate, bloodPressure, bloodSugar });
        hideLoader();
        showDashboard();
        displayRecentRecords();
        showSuccessPopup('Health data saved successfully');
    }, 1000);
}

// Function to display recent health records
function displayRecentRecords() {
    const tableBody = document.getElementById('recentRecordsBody');
    tableBody.innerHTML = '';
    if (healthData[currentUser.email]) {
        const recentData = healthData[currentUser.email].slice(-3).reverse();
        recentData.forEach(data => {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = data.date;
            row.insertCell(1).textContent = data.heartRate;
            row.insertCell(2).textContent = data.bloodPressure;
            row.insertCell(3).textContent = data.bloodSugar;
        });
    }
}

// Function to display the patient list
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
                    <a href="#" onclick="deletePatient(${index}); return false;">Delete Patient</a>
                    <a href="#" onclick="updatePatient(${index}); return false;">Update Patient</a>
                    <a href="#" onclick="showPatientRecords(${index}); return false;">View Records</a>
                </div>
            </div>
        `;
        patientList.appendChild(patientCard);
    });
}

// Function to delete a patient
async function deletePatient(index) {
    const patient = patients[index];
    const response = await fetch(`${apiUrl}/delete-patient/${patient.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
    });
    const responseData = await response.json();
    if (response.ok) {
        patients.splice(index, 1);
        displayPatientList();
        showSuccessPopup('Patient deleted successfully');
    } else {
        alert(responseData);
    }
}
function showAddUserForm() {
        const role = prompt("Enter user role (Doctor/Patient):");
        if (role && (role.toLowerCase() === 'doctor' || role.toLowerCase() === 'patient')) {
            const name = prompt("Enter user name:");
            const email = prompt("Enter user email:");
            const password = prompt("Enter user password:");
            if (name && email && password) {
                if (role.toLowerCase() === 'doctor') {
                    // Update the doctor's information
                    doctorEmail = email;
                    doctorPassword = password;
                    // Add the doctor to the allUsers array
                    allUsers.push({ name: name, email: email, role: 'Doctor' });
                } else {
                    const newId = patients.length + 1;
                    const newPatient = { id: newId, name, email, password };
                    patients.push(newPatient);
                    allUsers.push({ ...newPatient, role: 'Patient' });
                }
                showSuccessPopup('User added successfully');
                displayUserList();
            } else {
                alert('Please fill in all fields');
            }
        } else {
            alert('Invalid role. Please enter Doctor or Patient.');
        }
    }