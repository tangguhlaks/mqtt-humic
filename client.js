// mqttClient.js
const mqtt = require('mqtt');

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

// When the client connects to the broker
client.on('connect', () => {
  console.log('Connected to HiveMQ broker with authentication and TLS');

  // Subscribe to a topic
  client.subscribe('monitoring-data', (err) => {
    if (!err) {
      // Publish a message to the topic
      client.publish('monitoring-data', 'Hello from HiveMQ with auth and TLS');
    }
  });
});

// When a message is received
client.on('message', (topic, message) => {
  // message is a Buffer
  console.log(`Received message: ${message.toString()} on topic: ${topic}`);
});
