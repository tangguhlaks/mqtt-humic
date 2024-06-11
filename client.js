const mqtt = require('mqtt');
const fs = require('fs');

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

  // Add new message to messages array
  messages.push({ timestamp: new Date().toISOString(), message: message.toString() });

  // Write messages array back to JSON file
  fs.writeFileSync('monitoring-data.json', JSON.stringify(messages, null, 2));
}


// When the client connects to the broker
client.on('connect', () => {
  console.log('Connected to HiveMQ broker with authentication and TLS');
  console.log('--- Welcome to Client ---');

  // Subscribe to a topic
  client.subscribe('monitoring-data', (err) => {
    if (!err) {
      console.log("suscribe monitoring-data success");
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
