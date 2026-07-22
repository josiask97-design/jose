const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wkpuynvqamboltufiokp.supabase.co';
const supabaseKey = 'VOTRE_CLE_API_ANON_ICI'; 
const supabase = createClient(supabaseUrl, supabaseKey);

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = expresconst PORT = 3000;
const PORT = process.env.PORT || 3000;
const PORT = process.env.PORT || 3000;ox
app.use(express.urlencoded({ extended: true }));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 🟢 ÉTAPE CLÉ : Rendre le dossier des fichiers téléchargeables publiquement
app.use('/telecharger', express.static(uploadDir));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

const USERNAME_ADMIN = "admin";
const PASSWORD_ADMIN = "joskul2026";

// 1. Page de Connexion (Login)
app.get('/login', (req, res) => {
    res.send(`
        <div style="max-width: 300px; margin: 100px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; font-family: sans-serif; text-align: center;">
            <h2>JOSKUL CLOUD</h2>
            <p>Veuillez vous connecter</p>
            <form action="/login" method="POST">
                <input type="text" name="username" placeholder="Identifiant" required style="width: 100%; padding: 8px; margin: 10px 0; box-sizing: border-box;"><br>
                <input type="password" name="password" placeholder="Mot de passe" required style="width: 100%; padding: 8px; margin: 10px 0; box-sizing: border-box;"><br>
                <button type="submit" style="width: 100%; padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Se connecter</button>
            </form>
        </div>
    `);
});

// 2. Traitement de la connexion
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === USERNAME_ADMIN && password === PASSWORD_ADMIN) {
        res.redirect('/dashboard');
    } else {
        res.send(`
            <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
                <h3 style="color: red;">Identifiant ou mot de passe incorrect !</h3>
                <a href="/login">Réessayer</a>
            </div>
        `);
    }
});

// 3. Page d'accueil sécurisée (Dashboard)
app.get('/dashboard', (req, res) => {
    const files = fs.readdirSync(uploadDir);
    
    let fileListHTML = "<ul>";
    if (files.length === 0) {
        fileListHTML += "<li>Aucun fichier stocké pour le moment.</li>";
    } else {
        files.forEach(file => {
            // 🟢 ÉTAPE CLÉ : On crée un lien vers /telecharger/nom_du_fichier
            fileListHTML += `
                <li style="margin: 12px 0; font-size: 16px;">
                    📁 <a href="/telecharger/${encodeURIComponent(file)}" target="_blank" style="color: #007bff; text-decoration: none; font-weight: bold;">${file}</a>
                </li>`;
        });
    }
    fileListHTML += "</ul>";

    res.send(`
        <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #007bff;">☁️ Mon Espace JOSKUL CLOUD</h1>
            <p>Bienvenue dans votre stockage personnel.</p>
            <hr>
            
            <h3>📤 Envoyer un nouveau fichier</h3>
            <form action="/upload" method="POST" enctype="multipart/form-data" style="background: #f4f4f4; padding: 15px; border-radius: 5px;">
                <input type="file" name="cloudFile" required style="margin-bottom: 10px;"><br>
                <button type="submit" style="padding: 8px 15px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">Sauvegarder sur le Cloud</button>
            </form>

            <hr style="margin-top: 20px;">
            <h3>📂 Vos Fichiers Stockés :</h3>
            <p style="font-size: 13px; color: #666;"><i>(Cliquez sur un fichier pour l'ouvrir ou le télécharger)</i></p>
            ${fileListHTML}

            <br><br>
            <a href="/login" style="color: red; text-decoration: none;">Se déconnecter</a>
        </div>
    `);
});

// 4. Traitement de la réception de fichier
app.post('/upload', upload.single('cloudFile'), (req, res) => {
    if (!req.file) {
        return res.send("Erreur : Aucun fichier reçu.");
    }
    res.redirect('/dashboard');
});

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.listen(PORT, () => {
    console.log(`Serveur JOSKUL CLOUD avec visualisation actif sur http://localhost:${PORT}`);
});
x
