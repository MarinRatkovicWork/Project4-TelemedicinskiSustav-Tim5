// Functions for showing/hiding loader
function showLoader() {
    document.getElementById('loader').style.display = 'flex';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

// Function to show the admin dashboard
function showAdminDashboard() {
    showLoader(); // Show loading spinner while waiting for data

    // Simulate delay for the loading spinner (can be removed if not necessary)
    setTimeout(() => {
        hideAllScreens(); // Hide other screens
        document.getElementById('adminScreen').style.display = 'block'; // Show the admin screen
        displayUserInfo('adminScreen'); // Display user info
        getDoctors();
        getPatients(); // Fetch and display the list of doctors
        hideLoader(); // Hide the loading spinner
    }, 1000);
}

// Function to show the doctor dashboard
function showDoctorDashboard() {
    showLoader();
    setTimeout(() => {
        hideAllScreens();
        document.getElementById('doctorScreen').style.display = 'block';
        loadPatientList();
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
        loadAndDisplayRecentHealthRecords()
        displayUserInfo('dashboardScreen');
        hideLoader();
    }, 1000);
}

// Function to show Register Form for Doctor
function showRegisterFormDoctor() {
    hideAllScreens();
    document.getElementById('registerScreenDoctor').style.display = 'block';
}

function showHealthRecordInputScreen() {
    hideAllScreens();
    document.getElementById('healthRecordInputScreen').style.display = 'block';
}

// Function to show Register Form for Admin
function showRegisterFormAdmin() {
    hideAllScreens();
    document.getElementById('registerScreenAdmin').style.display = 'block';
}

// Function to hide all screens
function hideAllScreens() {
    const screens = ['loginScreen', 'dashboardScreen', 'healthRecordInputScreen', 'doctorScreen',
        'viewDataScreen', 'addPatientScreen', 'patientRecordsScreen',
        'registerScreenDoctor', 'registerScreenAdmin', 'changePasswordScreen', 'adminScreen'];
    screens.forEach(screen => {
        document.getElementById(screen).style.display = 'none';
    });
}

// Function to select role (Doctor or Patient)
function selectRole(role) {
    // Reset the classes for both buttons
    document.getElementById('doctorButton').classList.remove('active');
    document.getElementById('patientButton').classList.remove('active');

    // Set the selected role in the hidden input field
    document.getElementById('selectedRole').value = role;

    // Highlight the active button
    if (role === 'Doctor') {
        document.getElementById('doctorButton').classList.add('active');
    } else if (role === 'Patient') {
        document.getElementById('patientButton').classList.add('active');
    }
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

function showPreviousData() {
        showLoader();
        setTimeout(() => {
            hideAllScreens();
            document.getElementById('viewDataScreen').style.display = 'block';
            loadAndDisplayAllHealthRecords()
            hideLoader();
        }, 1000);
    }