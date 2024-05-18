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

  rl.question('Enter a message: ', (message) => {
    client.publish('monitoring-data', message, (err) => {
      if (!err) {
        console.log(`Published message: ${message} to topic: monitoring-data`);
      } else {
        console.log(`Error publishing message: ${err}`);
      }
      rl.close();
    });
  });
});