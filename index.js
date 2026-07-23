const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JOSKUL MESSENGER</title>
  <script src="/socket.io/socket.io.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b141a; color: #e9edef; height: 100vh; display: flex; justify-content: center; align-items: center; }
    #auth-container { background-color: #111b21; padding: 30px; border-radius: 12px; width: 90%; max-width: 400px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
    #auth-container h2 { color: #00a884; margin-bottom: 10px; font-size: 24px; }
    #auth-container p { color: #8696a0; font-size: 14px; margin-bottom: 20px; }
    .input-group { margin-bottom: 15px; text-align: left; }
    .input-group label { display: block; font-size: 12px; color: #8696a0; margin-bottom: 5px; }
    input { width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #222d34; background-color: #202c33; color: #e9edef; font-size: 15px; outline: none; }
    input:focus { border-color: #00a884; }
    .phone-row { display: flex; gap: 8px; }
    .phone-row input:first-child { width: 30%; }
    .phone-row input:last-child { width: 70%; }
    button { width: 100%; padding: 12px; border: none; border-radius: 8px; background-color: #00a884; color: #111b21; font-size: 16px; font-weight: bold; cursor: pointer; margin-top: 10px; }
    button:hover { background-color: #029071; }
    #chat-container { display: none; width: 100%; height: 100vh; flex-direction: column; background-color: #0b141a; }
    #chat-header { background-color: #202c33; padding: 15px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #222d34; }
    #chat-header h3 { color: #e9edef; font-size: 18px; }
    #messages { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
    .message { max-width: 75%; padding: 8px 12px; border-radius: 8px; font-size: 14px; word-wrap: break-word; }
    .message.mine { background-color: #005c4b; align-self: flex-end; color: #e9edef; }
    .message.other { background-color: #202c33; align-self: flex-start; color: #e9edef; }
    .message .sender { font-size: 11px; color: #8696a0; margin-bottom: 2px; font-weight: bold; }
    #input-area { background-color: #202c33; padding: 10px; display: flex; gap: 10px; align-items: center; }
    #input-area input { flex: 1; }
    #input-area button { width: auto; padding: 12px 20px; margin-top: 0; }
  </style>
</head>
<body>

  <div id="auth-container">
    <h2>📱 JOSKUL MESSENGER</h2>
    <p>Accès direct au chat</p>

    <div class="input-group">
      <label>Pseudo / Nom</label>
      <input type="text" id="username" placeholder="Ex: José" required>
    </div>

    <div class="input-group">
      <label>Numéro de téléphone</label>
      <div class="phone-row">
        <input type="text" id="code" value="+243">
        <input type="tel" id="phone" placeholder="810000000" required>
      </div>
    </div>

    <button onclick="joinChat()">ENTRER DANS LE CHAT</button>
  </div>

  <div id="chat-container">
    <div id="chat-header">
      <h3 id="user-display">JOSKUL MESSENGER</h3>
    </div>
    <div id="messages"></div>
    <div id="input-area">
      <input type="text" id="msgInput" placeholder="Écrivez un message..." onkeypress="handleKey(event)">
      <button onclick="sendMsg()">Envoyer</button>
    </div>
  </div>

  <script>
    const socket = io();
    let currentUser = "";

    function joinChat() {
      const name = document.getElementById('username').value.trim();
      const code = document.getElementById('code').value.trim();
      const phone = document.getElementById('phone').value.trim();

      if (!name || !phone) {
        alert("Veuillez remplir votre nom et numéro");
        return;
      }

      currentUser = name;
      document.getElementById('user-display').innerText = "💬 Connecté en tant que " + name + " (" + code + phone + ")";
      document.getElementById('auth-container').style.display = 'none';
      document.getElementById('chat-container').style.display = 'flex';
    }

    function sendMsg() {
      const input = document.getElementById('msgInput');
      const text = input.value.trim();
      if (!text) return;

      socket.emit('chatMessage', { sender: currentUser, text: text });
      input.value = '';
    }

    function handleKey(e) {
      if (e.key === 'Enter') sendMsg();
    }

    socket.on('chatMessage', (data) => {
      const box = document.getElementById('messages');
      const msgDiv = document.createElement('div');
      msgDiv.classList.add('message');
      
      if (data.sender === currentUser) {
        msgDiv.classList.add('mine');
        msgDiv.innerHTML = data.text;
      } else {
        msgDiv.classList.add('other');
        msgDiv.innerHTML = '<div class="sender">' + data.sender + '</div>' + data.text;
      }

      box.appendChild(msgDiv);
      box.scrollTop = box.scrollHeight;
    });
  </script>
</body>
</html>
  `);
});

io.on('connection', (socket) => {
  socket.on('chatMessage', (data) => {
    io.emit('chatMessage', data);
  });
});

server.listen(PORT, () => console.log(`Serveur prêt sur le port ${PORT}`));
