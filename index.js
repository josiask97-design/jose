const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3000;

const supabaseUrl = "https://wkpuynvqamboltufiokp.supabase.co";
const supabaseKey = "sb_publishable_UQr_4YrSrBCvqpSejzIbkw_zCYBHHl2";
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <title>JOSKUL MESSENGER</title>
      <script src="/socket.io/socket.io.js"></script>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100vw; height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #121212; color: white; overflow: hidden; }
        
        #app-container { display: flex; width: 100vw; height: 100vh; }
        
        #sidebar { width: 100%; max-width: 320px; background: #1e1e1e; border-right: 1px solid #333; display: flex; flex-direction: column; height: 100%; }
        #user-profile { padding: 15px; border-bottom: 1px solid #333; background: #252525; display: flex; justify-content: space-between; align-items: center; }
        #conv-list { flex: 1; overflow-y: auto; }
        .conv-item { padding: 15px; border-bottom: 1px solid #2a2a2a; cursor: pointer; }
        
        #chat-area { flex: 1; display: flex; flex-direction: column; background: #121212; height: 100%; }
        #chat-header { padding: 15px; background: #1e1e1e; border-bottom: 1px solid #333; font-weight: bold; display: flex; align-items: center; gap: 8px; }
        #chat-box { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
        
        .msg { max-width: 80%; padding: 10px 14px; border-radius: 12px; font-size: 15px; word-wrap: break-word; }
        .sent { background: #0084ff; color: white; align-self: flex-end; border-bottom-right-radius: 2px; }
        .received { background: #2a2a2a; color: white; align-self: flex-start; border-bottom-left-radius: 2px; }
        .msg-time { font-size: 10px; opacity: 0.7; margin-top: 4px; text-align: right; display: block; }
        .status-dot { width: 10px; height: 10px; background: #4CAF50; border-radius: 50%; display: inline-block; }

        #input-area { padding: 12px; background: #1e1e1e; display: flex; gap: 8px; align-items: center; border-top: 1px solid #2a2a2a; }
        input[type="text"], input[type="tel"], input[type="password"] { flex: 1; padding: 12px 14px; border-radius: 20px; border: 1px solid #333; background: #2a2a2a; color: white; outline: none; font-size: 15px; }
        button { padding: 12px 18px; border-radius: 20px; border: none; background: #0084ff; color: white; cursor: pointer; font-weight: bold; font-size: 14px; }
        
        #auth-screen { position: fixed; inset: 0; background: #121212; display: flex; justify-content: center; align-items: center; z-index: 100; padding: 20px; }
        .auth-box { background: #1e1e1e; padding: 25px 20px; border-radius: 16px; width: 100%; max-width: 400px; display: flex; flex-direction: column; gap: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.6); }
        .auth-box h2 { text-align: center; color: #0084ff; font-size: 22px; }
        .phone-group { display: flex; gap: 8px; width: 100%; }
        select { padding: 12px; border-radius: 10px; border: 1px solid #333; background: #2a2a2a; color: white; outline: none; font-size: 14px; }
        .auth-box input { border-radius: 10px; width: 100%; }
        .auth-box button { border-radius: 10px; padding: 14px; width: 100%; margin-top: 5px; }

        @media (max-width: 768px) {
          #sidebar { display: none; }
        }
      </style>
    </head>
    <body>

      <div id="auth-screen">
        <div class="auth-box">
          <h2>📱 JOSKUL MESSENGER</h2>
          <p style="font-size: 13px; opacity: 0.7; text-align: center; margin-bottom: 5px;">Connexion directe</p>
          
          <input type="text" id="pseudo" placeholder="Votre Pseudo / Nom" />

          <div class="phone-group">
            <select id="country-code">
              <option value="+243">🇨🇩 +243 (RDC)</option>
              <option value="+33">🇫🇷 +33 (France)</option>
              <option value="+225">🇨🇮 +225 (Côte d'Ivoire)</option>
              <option value="+221">🇸🇳 +221 (Sénégal)</option>
              <option value="+237">🇨🇲 +237 (Cameroun)</option>
              <option value="+1">🇺🇸 +1 (USA/Canada)</option>
            </select>
            <input type="tel" id="phone-number" placeholder="812345678" />
          </div>

          <input type="password" id="password" placeholder="Mot de passe" />

          <button onclick="loginUser()">Entrer dans le Chat</button>
        </div>
      </div>

      <div id="app-container">
        <div id="sidebar">
          <div id="user-profile">
            <span id="my-pseudo">Mon Profil</span>
          </div>
          <div id="conv-list">
            <div class="conv-item">Discussion Générale</div>
          </div>
        </div>

        <div id="chat-area">
          <div id="chat-header">
            <span class="status-dot"></span> Discussion Générale
          </div>
          <div id="chat-box"></div>

          <div id="input-area">
            <input type="text" id="msg-input" placeholder="Écrivez un message..." />
            <button onclick="sendTextMessage()">Envoyer</button>
          </div>
        </div>
      </div>

      <script>
        const socket = io();
        let userPseudo = "";

        function loginUser() {
          const code = document.getElementById('country-code').value;
          const number = document.getElementById('phone-number').value.trim();
          const pseudo = document.getElementById('pseudo').value.trim();
          const password = document.getElementById('password').value.trim();

          if(!number || !password || !pseudo) {
            return alert("Veuillez remplir tous les champs.");
          }

          userPseudo = pseudo + " (" + code + number + ")";
          document.getElementById('auth-screen').style.display = 'none';
          document.getElementById('my-pseudo').innerText = pseudo;
          
          initSocket();
        }

        function initSocket() {
          socket.emit('user_online', userPseudo);
          socket.on('receive_message', (msg) => {
            appendMessage(msg);
          });
        }

        function sendTextMessage() {
          const input = document.getElementById('msg-input');
          if(!input.value.trim()) return;

          const msg = {
            sender: userPseudo,
            text: input.value,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          };

          socket.emit('send_message', msg);
          input.value = '';
        }

        function appendMessage(msg) {
          const box = document.getElementById('chat-box');
          const div = document.createElement('div');
          const isMe = msg.sender === userPseudo;
          div.className = `msg ${isMe ? 'sent' : 'received'}`;

          div.innerHTML = `<b>${msg.sender}</b><br>${msg.text}<span class="msg-time">${msg.time}</span>`;
          box.appendChild(div);
          box.scrollTop = box.scrollHeight;
        }
      </script>
    </body>
    </html>
  `);
});

io.on('connection', (socket) => {
  socket.on('send_message', (data) => {
    io.emit('receive_message', data);
  });
});

server.listen(PORT, () => console.log(`Serveur prêt sur le port ${PORT}`));
