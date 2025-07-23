const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Route HTMX
app.get('/api/message', (req, res) => {
  const date = new Date().toLocaleString('fr-CH');
  res.send(`✨ Hello Vincent ! Il est ${date} ✨`);
});

// Toutes les autres routes -> index.html (optionnel si SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur HTMX lancé sur http://localhost:${PORT}`);
});
