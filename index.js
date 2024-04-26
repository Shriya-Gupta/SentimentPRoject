// Function to start speech recognition
function startSpeechRecognition() {
    const recognition = new webkitSpeechRecognition(); // Create a new speech recognition object
    recognition.lang = 'en-US'; // Set language to English (United States)

    // Start speech recognition
    recognition.start();

    // Event listener for speech recognition results
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript; // Get the transcript of the first result
        document.getElementById('queryInput').value = transcript; // Set the input field value to the transcript
        performQuery(); // Trigger query with speech input
    };
}

// Function to show the chart and overlay
function showChart() {
    // Show the chart
    document.getElementById('myChart').style.display = 'block';
    // Show the overlay
    document.getElementById('video-overlay').style.display = 'block';
}

// Function to hide the chart and overlay
function hideChart() {
    // Hide the chart
    document.getElementById('myChart').style.display = 'none';
    // Hide the overlay
    document.getElementById('video-overlay').style.display = 'none';
}

// Function to perform the API query
async function performQuery() {
    // Get the query input from the input field
    const queryInput = document.getElementById('queryInput').value;

    // Check if the query input is not empty
    if (queryInput.trim() !== '') {
        try {
            // Perform the API query with the user input as data
            const response = await query({ "inputs": queryInput });

            // Extract data from the response
            const responseData = response[0];
            const data = responseData.map(({ label, score }) => ({
                label: label,
                score: score
            }));

            // Render chart using Chart.js
            const ctx = document.getElementById('myChart');
            const myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.map(row => row.label),
                    datasets: [{
                        label: 'Emotions',
                        data: data.map(row => row.score),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            }); 
            showChart(); // Show the chart after rendering
        } catch (error) {
            console.error('Error performing query:', error);
            // Handle error, e.g., show error message to user
        }
    } else {
        // Handle case where query input is empty
        console.warn('Query input is empty');
        // Show message to user indicating that input is required
    }
}

// Function to perform the API request
async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/SamLowe/roberta-base-go_emotions",
        {
            headers: { Authorization: "Bearer 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" },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.json();
    return result;
}
