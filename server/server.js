const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Utilitaire pour lire JSON
function readJSON(filename) {
    const data = fs.readFileSync(path.join(__dirname, 'data', filename));
    return JSON.parse(data);
}

// Utilitaire pour écrire JSON
function writeJSON(filename, data) {
    fs.writeFileSync(path.join(__dirname, 'data', filename), JSON.stringify(data, null, 2));
}

// ---------- API ----------

app.get('/api/clubs', (req, res) => res.json(readJSON('clubs.json')));
app.get('/api/joueurs', (req, res) => res.json(readJSON('joueurs.json')));
app.get('/api/matchs', (req, res) => res.json(readJSON('matchs.json')));
app.get('/api/classements', (req, res) => res.json(readJSON('classements.json')));
app.get('/api/talents', (req, res) => res.json(readJSON('talents.json')));

app.post('/api/talents', (req, res) => {
    const talents = readJSON('talents.json');
    talents.push(req.body);
    writeJSON('talents.json', talents);
    res.status(201).json({message: 'Talent ajouté'});
});

// ---------- Routes HTML ----------
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../views/index.html')));
app.get('/clubs.html', (req, res) => res.sendFile(path.join(__dirname, '../views/clubs.html')));
app.get('/joueurs.html', (req, res) => res.sendFile(path.join(__dirname, '../views/joueurs.html')));
app.get('/calendrier.html', (req, res) => res.sendFile(path.join(__dirname, '../views/calendrier.html')));
app.get('/resultats.html', (req, res) => res.sendFile(path.join(__dirname, '../views/resultats.html')));
app.get('/classement.html', (req, res) => res.sendFile(path.join(__dirname, '../views/classement.html')));
app.get('/talents.html', (req, res) => res.sendFile(path.join(__dirname, '../views/talents.html')));

// ---------- Serveur ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur LSFP démarré sur http://localhost:${PORT}`));
