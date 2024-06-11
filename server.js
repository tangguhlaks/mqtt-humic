// server.js

const express = require('express');
const path = require('path');
const mqtt = require('mqtt');
const fs = require('fs');
const { Console } = require('console');

const app = express();
const PORT = process.env.PORT || 3000;

// Define connection options with username, password, and secure settings
const options = {
  username: 'tangguhlaksana',   // Replace with your username
  password: 'Laks123!!',   // Replace with your password
  protocol: 'mqtts',           // Use secure MQTT
  port: 8883,                  // Secure MQTT port
  rejectUnauthorized: false    // Accept self-signed certificates (if necessary)
};

// Connect to your HiveMQ broker with authentication
const client = mqtt.connect('mqtt://967b5b95d60a4dd4b357417bd61b4019.s1.eu.hivemq.cloud', options);

// Function to save message to JSON file
function saveMessageToJSON(message) {
  let messages = [];

  try {
    // Load existing messages from JSON file if it exists and contains valid JSON data
    if (fs.existsSync('monitoring-data.json')) {
      const data = fs.readFileSync('monitoring-data.json', 'utf8');
      messages = JSON.parse(data);
    }
  } catch (error) {
    console.error('Error parsing JSON file:', error.message);
    // If there's an error parsing JSON, log the error and proceed with an empty messages array
  }
  messages.push({ timestamp: new Date().toISOString(), message: message.toString() });

  // Write messages array back to JSON file
  fs.writeFileSync('monitoring-data.json', JSON.stringify(messages, null, 2));

  // Broadcast message to all connected clients

  sendToApi(message.toString());
  
  sendUpdates(messages);
}

function sendToApi(message){
  let messages = [];
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(message),
    redirect: "follow"
  };
  
  fetch("http://127.0.0.1:5000/predict", requestOptions)
    .then(response => response.json())
    .then(result => {
        try {
          // Load existing messages from JSON file if it exists and contains valid JSON data
          if (fs.existsSync('api-result-data.json')) {
            const data = fs.readFileSync('api-result-data.json', 'utf8');
            messages = JSON.parse(data);
          }
        } catch (error) {
          console.error('Error parsing JSON file:', error.message);
          // If there's an error parsing JSON, log the error and proceed with an empty messages array
        }
        messages.push(result);
      
        // Write messages array back to JSON file
        fs.writeFileSync('api-result-data.json', JSON.stringify(messages, null, 2));
    })
    .catch(error => console.error('Error:', error));
}
// Array to store connected clients
let clients = [];

// Function to send updates to connected clients
function sendUpdates(data) {
  clients.forEach(client => {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  });

}

// When the client connects to the broker
client.on('connect', () => {
  console.log('Connected to HiveMQ broker with authentication and TLS');
  console.log('--- Welcome to Client ---');

  // Subscribe to a topic
  client.subscribe('monitoring-data', (err) => {
    if (!err) {
      console.log("Subscribe to monitoring-data success");
    }
  });
});

// When a message is received
client.on('message', (topic, message) => {
  // message is a Buffer
  console.log(`Received message: ${message.toString()} on topic: ${topic}`);
  
  // Save message to JSON file
  saveMessageToJSON(message);
});

// Set up a route to serve the SSE stream
app.get('/events', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  // Send a comment to keep the connection alive
  res.write(':keep-alive\n\n');

  // Add client to array
  clients.push(res);

  // Remove client when connection is closed
  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname)));

// Serve index.html on root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/result', (req, res) => {
  res.sendFile(path.join(__dirname, 'result.html'));
});
app.get('/chart', (req, res) => {
  res.sendFile(path.join(__dirname, 'chart.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
