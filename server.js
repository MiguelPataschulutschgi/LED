const express = require("express");
const mqtt = require("mqtt");
const http = require("http");
const socketIo = require("socket.io");

// MQTT Broker Verbindung
const mqttBroker = "mqtt://DEIN_MQTT_BROKER"; // Beispiel: mqtt://localhost
const mqttTopic = "led"; // MQTT-Topic für LED-Steuerung

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const client = mqtt.connect(mqttBroker);
client.on("connect", () => console.log("MQTT verbunden!"));

app.use(express.static(__dirname + "/public")); // Statische Dateien bereitstellen

// WebSocket-Verbindung für Echtzeit-Steuerung
io.on("connection", (socket) => {
  console.log("WebSocket verbunden!");

  socket.on("setColor", (data) => {
    console.log("Setze LED:", data);

    const message = JSON.stringify({
      led: data.led,
      color: data.color
    });

    client.publish(mqttTopic, message);
  });
});

// Server starten
const port = 3000;
server.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
