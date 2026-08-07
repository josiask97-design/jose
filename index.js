const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Servir les fichiers statiques (index.html, styles, etc.)
app.use(express.static(__dirname));

let users = {};

io.on('connection', (socket) => {
  console.log(`⚡ Connexion établie : ${socket.id}`);

  // Connexion de l'utilisateur
  socket.on('user_login', (phone) => {
    users[socket.id] = { phone, socketId: socket.id };
    console.log(`📱 Utilisateur connecté : ${phone}`);
    io.emit('update_online_users', Object.values(users));
  });

  // Transmission des messages
  socket.on('send_message', (data) => {
    console.log(`💬 Message de ${data.sender} vers ${data.recipient} : ${data.message}`);
    io.emit('receive_message', data);
  });

  // Déconnexion
  socket.on('disconnect', () => {
    delete users[socket.id];
    console.log(`❌ Déconnexion : ${socket.id}`);
    io.emit('update_online_users', Object.values(users));
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur Josenet lancé sur le port ${PORT}`);
});
