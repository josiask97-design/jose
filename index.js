const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3000;

// Config Supabase
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
      <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
      <script src="/socket.io/socket.io.js"></script>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100%; height: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #121212; color: white; overflow: hidden; }
        
        /* Layout principal Responsive */
        #app-container { display: flex; width: 100vw; height: 100vh; }
        
        /* Sidebar (Responsive Mobile) */
        #sidebar { width: 100%; max-width: 350px; background: #1e1e1e; border-right: 1px solid #333; display: flex; flex-direction: column; height: 100%; }
        #user-profile { padding: 15px; border-bottom: 1px solid #333; background: #252525; display: flex; justify-content: space-between; align-items: center; }
        #conv-list { flex: 1; overflow-y: auto; }
        .conv-item { padding: 15px; border-bottom: 1px solid #2a2a2a; cursor: pointer; display: flex; flex-direction: column; }
        .conv-item:hover { background: #2a2a2a; }
        
        /* Chat Main Zone */
        #chat-area { flex: 1; display: flex; flex-direction: column; background: #121212; height: 100%; }
        #chat-header { padding: 15px; background: #1e1e1e; border-bottom: 1px solid #333; font-weight: bold; }
        #chat-box { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
        
        /* Messages */
        .msg { max-width: 80%; padding: 10px 14px; border-radius: 12px; font-size: 15px; word-wrap: break-word; }
        .sent { background: #0084ff; color: white; align-self: flex-end; border-bottom-right-radius: 2px; }
        .received { background: #2a2a2a; color: white; align-self: flex-start; border-bottom-left-radius: 2px; }
        .msg-time { font-size: 10px; opacity: 0.7; margin-top: 5px; text-align: right; display: block; }
        .status-dot { width: 10px; height: 10px; background: #4CAF50; border-radius: 50%; display: inline-block; margin-right: 5px; }

        /* Input Controls */
        #input-area { padding: 12px; background: #1e1e1e; display: flex; gap: 8px; align-items: center; border-top: 1px solid #2a2a2a; }
        input[type="text"], input[type="tel"], input[type="password"] { flex: 1; padding: 12px 14px; border-radius: 20px; border: 1px solid #333; background: #2a2a2a; color: white; outline: none; font-size: 15px; }
        button { padding: 12px 18px; border-radius: 20px; border: none; background: #0084ff; color: white; cursor: pointer; font-weight: bold; font-size: 14px; }
        .btn-icon { background: #333; padding: 10px 12px; border-radius: 50%; border: none; cursor: pointer; font-size: 16px; }

        /* Écran d'authentification Plein Écran */
        #auth-screen { position: fixed; inset: 0; background: #121212; display: flex; justify-content: center; align-items: center; z-index: 100; padding: 20px; }
        .auth-box { background: #1e1e1e; padding: 25px 20px; border-radius: 16px; width: 100%; max-width: 420px; display: flex; flex-direction: column; gap: 15px; box-shadow: 0 8px 24px rgba(0,0,0,0.6); }
        .auth-box h2 { text-align: center; color: #0084ff; font-size: 22px; }
        .phone-group { display: flex; gap: 8px; width: 100%; }
        select { padding: 12px; border-radius: 10px; border: 1px solid #333; background: #2a2a2a; color: white; outline: none; font-size: 14px; }
        .auth-box input { border-radius: 10px; width: 100%; }
        .auth-box button { border-radius: 10px; padding: 14px; margin-top: 5px; width: 100%; }

        @media (max-width: 768px) {
          #sidebar { display: none; } /* Mode mobile : plein écran sur le chat */
        }
      </style>
    </head>
    <body>

      <!-- ÉCRAN D'AUTHENTIFICATION PLEIN ÉCRAN -->
      <div id="auth-screen">
        <div class="auth-box">
          <h2>📱 JOSKUL MESSENGER</h2>
          <p style="font-size: 13px; opacity: 0.7; text-align: center; margin-bottom: 5px;">Connectez-vous avec votre numéro de téléphone</p>
          
          <input type="text" id="pseudo" placeholder="Votre Pseudo / Nom" />

          <div class="phone-group">
            <select id="country-code">
              <option value="+243">🇨🇩 +243 (RDC)</option>
              <option value="+33">🇫🇷 +33 (France)</option>
              <option value="+225">🇨🇮 +225 (Côte d'Ivoire)</option>
              <option value="+221">🇸🇳 +221 (Sénégal)</option>
              <option value="+237">🇨🇲 +237 (Cameroun)</option>
              <option value="+1">🇺🇸 +1 (USA/Canada)</option>
              <option value="+242">🇨🇬 +242 (Congo BZ)</option>
              <option value="+250">🇷🇼 +250 (Rwanda)</option>
              <option value="+257">🇧🇮 +257 (Burundi)</option>
              <option value="+212">🇲🇦 +212 (Maroc)</option>
              <option value="+216">🇹🇳 +216 (Tunisie)</option>
              <option value="+213">🇩🇿 +213 (Algérie)</option>
            </select>
            <input type="tel" id="phone-number" placeholder="812345678" />
          </div>

          <input type="password" id="password" placeholder="Mot de passe" />

          <button onclick="loginWithPhone()">Se Connecter / S'inscrire</button>
        </div>
      </div>

      <!-- INTERFACE MESSAGERIE -->
      <div id="app-container">
        <div id="sidebar">
          <div id="user-profile">
            <span id="my-pseudo">Mon Profil</span>
            <button onclick="createGroup()" style="font-size: 11px; padding: 6px 12px;">+ Groupe</button>
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
            <input type="file" id="file-input" style="display:none" onchange="sendFile(this)" />
            <button class="btn-icon" onclick="document.getElementById('file-input').click()">📷</button>
            <button class="btn-icon" id="voice-btn" onclick="toggleVoiceRecord()">🎙️</button>
            <input type="text" id="msg-input" placeholder="Écrivez un message..." />
            <button onclick="sendTextMessage()">Envoyer</button>
          </div>
        </div>
      </div>

      <script>
        const supabaseClient = window.supabase.createClient('${supabaseUrl}', '${supabaseKey}');
        const socket = io();
        let currentUser = null;
        let userPseudo = "";
        let mediaRecorder;
        let audioChunks = [];

        async function loginWithPhone() {
          const code = document.getElementById('country-code').value;
          const number = document.getElementById('phone-number').value.trim();
          const pseudo = document.getElementById('pseudo').value.trim();
          const password = document.getElementById('password').value.trim();

          if(!number || !password || !pseudo) {
            return alert("Veuillez remplir tous les champs.");
          }

          const fullPhone = code + number.replace(/^0+/, '');
          userPseudo = pseudo;
          const virtualEmail = fullPhone.replace('+', '') + '@joskul.chat';

          let { data, error } = await supabaseClient.auth.signInWithPassword({
            email: virtualEmail,
            password: password
          });

          if (error) {
            const signupRes = await supabaseClient.auth.signUp({
              email: virtualEmail,
              password: password,
              options: { data: { phone_number: fullPhone, pseudo: pseudo } }
            });

            if (signupRes.error) {
              alert("Erreur de connexion : " + signupRes.error.message);
              return;
            }
            currentUser = signupRes.data.user;
          } else {
            currentUser = data.user;
          }

          document.getElementById('auth-screen').style.display = 'none';
          document.getElementById('my-pseudo').innerText = pseudo;
          initSocket();
          requestNotificationPermission();
        }

        function initSocket() {
          socket.emit('user_online', userPseudo);
          socket.on('receive_message', (msg) => {
            appendMessage(msg);
            showNotification(msg);
          });
        }

        function sendTextMessage() {
          const input = document.getElementById('msg-input');
          if(!input.value.trim()) return;

          const msg = {
            sender: userPseudo,
            text: input.value,
            type: 'text',
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          };

          socket.emit('send_message', msg);
          input.value = '';
        }

        function appendMessage(msg) {
          const box = document.getElementById('chat-box');
          const div = document.createElement('div');
          const isMe = msg.sender === userPseudo;
          div.className = \`msg \${isMe ? 'sent' : 'received'}\`;

          let content = \`<b>\${msg.sender}</b><br>\`;
          if(msg.type === 'text') content += msg.text;
          else if(msg.type === 'photo') content += \`<img src="\${msg.mediaUrl}" width="100%" style="border-radius:8px; margin-top:5px;" />\`;
          else if(msg.type === 'audio') content += \`<audio controls src="\${msg.mediaUrl}"></audio>\`;

          content += \`<span class="msg-time">\${msg.time}</span>\`;
          div.innerHTML = content;
          box.appendChild(div);
          box.scrollTop = box.scrollHeight;
        }

        async function sendFile(input) {
          const file = input.files[0];
          if(!file) return;
          const filePath = \`chat/\${Date.now()}_\${file.name}\`;

          let { data, error } = await supabaseClient.storage.from('chat-media').upload(filePath, file);
          if(error) return alert("Erreur upload photo");

          const { data: publicUrl } = supabaseClient.storage.from('chat-media').getPublicUrl(filePath);

          socket.emit('send_message', {
            sender: userPseudo,
            type: 'photo',
            mediaUrl: publicUrl.publicUrl,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          });
        }

        async function toggleVoiceRecord() {
          const btn = document.getElementById('voice-btn');
          if (!mediaRecorder || mediaRecorder.state === "inactive") {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];
            mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
            mediaRecorder.onstop = async () => {
              const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
              const filePath = \`voice/\${Date.now()}.webm\`;
              await supabaseClient.storage.from('chat-media').upload(filePath, audioBlob);
              const { data: publicUrl } = supabaseClient.storage.from('chat-media').getPublicUrl(filePath);

              socket.emit('send_message', {
                sender: userPseudo,
                type: 'audio',
                mediaUrl: publicUrl.publicUrl,
                time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
              });
            };
            mediaRecorder.start();
            btn.style.background = "red";
          } else {
            mediaRecorder.stop();
            btn.style.background = "#333";
          }
        }

        function requestNotificationPermission() {
          if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
          }
        }

        function showNotification(msg) {
          if (Notification.permission === "granted" && msg.sender !== userPseudo) {
            new Notification(\`Nouveau message de \${msg.sender}\`, {
              body: msg.type === 'text' ? msg.text : 'Fichier multimédia'
            });
          }
        }

        function createGroup() {
          const name = prompt("Nom du groupe :");
          if(name) alert("Groupe " + name + " créé !");
        }
      </script>
    </body>
    </html>
  `);
});

io.on('connection', (socket) => {
  socket.on('user_online', (pseudo) => {
    io.emit('user_status', { pseudo, status: 'online' });
  });

  socket.on('send_message', (data) => {
    io.emit('receive_message', data);
  });
});

server.listen(PORT, () => console.log(`Serveur Messagerie Fullscreen sur le port ${PORT}`));

