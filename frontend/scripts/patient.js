
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

let selectedRecordId = null; // Variable to store the selected record ID

async function loadAndDisplayAllHealthRecords() {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`http://localhost:8080/api/patients/${currentUser.id}/health-records`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const records = await response.json();
            const tbody = document.getElementById('healthDataBody');
            tbody.innerHTML = ''; // Clear existing rows

            records.forEach(record => {
                const row = document.createElement('tr');
                row.setAttribute('data-record-id', record.id); // Store record id as a data attribute

                // Format dateTime from LocalDateTime (ISO format) to a readable string
                const date = new Date(record.dateTime);  // Converting the string to a Date object
                const formattedDate = date.toLocaleString();  // You can customize this format as per your requirement

                row.innerHTML = `
                    <td>${formattedDate || 'N/A'}</td>
                    <td>${record.heartRate || 'N/A'}</td>
                    <td>${record.bloodPressure || 'N/A'}</td>
                    <td>${record.bloodSugar || 'N/A'}</td>
                    <td><button class="delete-btn" onclick="selectRecordToDelete(event)">Delete</button></td> <!-- Delete button inside each row -->
                `;
                tbody.appendChild(row);
            });
        } else {
            console.error('Failed to fetch health records:', response.statusText);
            alert('Unable to fetch health records.');
        }
    } catch (error) {
        console.error('Error fetching health records:', error);
    }
}

// Function to select a record for deletion
function selectRecordToDelete(event) {
    const row = event.target.closest('tr');  // Get the closest row
    selectedRecordId = row.getAttribute('data-record-id');  // Get the record ID from the data attribute

    // Display the delete button
    document.getElementById('deleteButton').style.display = 'block';
}

// Function to delete the selected health record
async function deleteHealthRecord() {
    if (!selectedRecordId) {
        alert('No record selected for deletion.');
        return;
    }

    const token = localStorage.getItem('jwtToken');
    try {
        const response = await fetch(`http://localhost:8080/api/patients/${currentUser.id}/health-records/${selectedRecordId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('Record deleted successfully!');
            loadAndDisplayAllHealthRecords();  // Refresh the list of health records
            selectedRecordId = null;  // Reset the selected record ID
            document.getElementById('deleteButton').style.display = 'none';  // Hide the delete button
        } else {
            console.error('Failed to delete health record:', response.statusText);
            alert('Unable to delete the health record.');
        }
    } catch (error) {
        console.error('Error deleting health record:', error);
        alert('An error occurred while deleting the health record.');
    }
}
