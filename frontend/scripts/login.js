// Statičke varijable vezane uz login
let currentUser = null;  // Trenutni prijavljeni korisnik
const apiUrl = "http://localhost:8080/api/auth";  // URL za API

// Funkcija za login
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
