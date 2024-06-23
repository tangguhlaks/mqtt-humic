const { randomUUID } = require('crypto');
const mqtt = require('mqtt');
const readline = require('readline');

const options = {
  username: 'device',   // Replace with your username
  password: 'Device123!!',   // Replace with your password
  protocol: 'mqtts',           // Use secure MQTT
  port: 8883,                  // Secure MQTT port
  rejectUnauthorized: false    // Accept self-signed certificates (if necessary)
};

const client = mqtt.connect('mqtt://967b5b95d60a4dd4b357417bd61b4019.s1.eu.hivemq.cloud', options);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

client.on('connect', () => {
  console.log('Connected to HiveMQ broker with authentication and TLS');
  console.log('--- Welcome to Sender ---');
  setInterval(() => {
    // Generate random values for each parameter
  const message = {
    "id":randomUUID(),
    "Accel-X": +(Math.round(Math.random() * 200 - 100) / 100).toFixed(5),
    "Accel-Y": +(Math.round(Math.random() * 200 - 100) / 100).toFixed(5),
    "Accel-Z": +(Math.round(Math.random() * 100 + 900) / 100).toFixed(5),
    "Latt": +(Math.round(Math.random() * 1800000000 - 900000000) / 10000000).toFixed(9),
    "Long": +(Math.round(Math.random() * 3600000000 - 1800000000) / 10000000).toFixed(9),
    "Rot-X": +(Math.round(Math.random() * 20 - 10) / 100).toFixed(5),
    "Rot-Y": +(Math.round(Math.random() * 20 - 10) / 100).toFixed(5),
    "Rot-Z": +(Math.round(Math.random() * 20 - 10) / 100).toFixed(5),
    "Temp": +(Math.round(Math.random() * 50000 + 250000) / 10000).toFixed(5)
  };

  // Convert the object to JSON string
  const jsonData = JSON.stringify(message);

  client.publish('monitoring-data', jsonData, (err) => {
    if (!err) {
      console.log(`Published message: ${jsonData} to topic: monitoring-data`);
    } else {
      console.log(`Error publishing message: ${err}`);
    }
  });
  }, 5000);
  
});
