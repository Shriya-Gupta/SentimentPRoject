document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
        const contentElement = document.querySelector('.content');
        if (contentElement) {
            contentElement.classList.add('fade-in');
        } else {
            console.error('Content element not found');
        }
    }, 600);

    setTimeout(function() {
        const coverContainer = document.querySelector('.cover-container');
        if (coverContainer) {
            coverContainer.classList.add('fade-in');
        } else {
            console.error('Cover container not found');
        }
    }, 600);

    const startButton = document.getElementById("start-button");
    if (startButton) {
        startButton.addEventListener("click", function(event) {
            event.preventDefault(); // Prevent default anchor behavior
            const cover = document.getElementById("cover");
            if (cover) {
                cover.classList.add("fade-out");
                setTimeout(function() {
                    window.location.href = "index.html"; // Redirect to landing page after delay
                }, 500);
            } else {
                console.error('Cover element not found');
            }
        });
    } else {
        console.error('Start button not found');
    }
});
function startSpeechRecognition() {
    const recognition = new webkitSpeechRecognition(); // Create a new speech recognition object
    recognition.lang = 'en-US'; 

    recognition.start();

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

    // Hide the input button and speech recognition button
    document.getElementById('queryInput').style.display = 'none';
    document.getElementById('submitBtn').style.display = 'none';
    document.getElementById('speechRecognitionBtn').style.display = 'none';

    // Hide the 'Text Input' label and 'OR' divider
    document.getElementById('textInputLabel').style.display = 'none';
    document.getElementById('orDivider').style.display = 'none';

    // Get the first label (emotion) obtained from the response of the query
    const firstLabel = document.getElementById('myChart').chart.data.labels[0]; // Accessing chart instance
    // Display the emotion text
    document.getElementById('emotionText').style.color = '#ff6384';
    document.getElementById('emotionText').innerText = "You seem to be feeling: " + firstLabel;
    
    // Show the suggestions section
    document.getElementById('suggestionsSection').style.display = 'block';
}


// Function to hide the chart and overlay
function hideChart() {
    // Hide the chart
    document.getElementById('myChart').style.display = 'none';
    // Hide the overlay
    document.getElementById('video-overlay').style.display = 'none';
    // Show the input button and speech recognition button
    document.getElementById('queryInput').style.display = 'block';
    document.getElementById('submitBtn').style.display = 'block';
    document.getElementById('speechRecognitionBtn').style.display = 'block';

    // Hide the suggestions section
    document.getElementById('suggestionsSection').style.display = 'none';
}

function redirectToPage(pageUrl) {
    window.location.href = pageUrl;
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

            // Save the chart instance for later use
            ctx.chart = myChart;

            showChart(); // Show the chart after rendering
        } catch (error) {
            console.error('Error performing query:', error);
            // Handle error, e.g., show error message to user
        }
    } else {
        // Handle case where query input is empty
        console.warn('Query input is empty');
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
