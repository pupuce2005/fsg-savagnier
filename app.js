import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

// Pour avoir __dirname en ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


app.use('/public', express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Fonction générique pour générer la page complète
function renderPage(title, content) {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="keywords" content="Savagnier, gymnastique, volleyball, FSG, F.S.G., volley-ball, gym, volley, neuchâtel, région, tournoi, val-de-ruz" />
      <meta name="description" content="FSG Savagnier, club de gymnastique et volleyball de Savagnier" />
      <title>FSG Savagnier</title>
      <link rel="stylesheet" href="/public/style.css">
      <link rel="icon" type="image/x-icon" href="/img/logo/favicon.ico">
      <script src="https://unpkg.com/htmx.org@1.9.2"></script>
    </head>
    <body>
      <header>
    <h1>FSG Savagnier</h1>
    <nav>
      <a href="/">Accueil</a>
      <a href="/horaires">Horaires</a>
      <a href="/societe">Société</a>
      <a href="/resultats">Résultats</a>
      <a href="/contact">Contact</a>
    </nav>
  </header>
      <main>
        ${content}
      </main>
      <aside>
        <h1>Sponsor</h1>
        <div id="slideshow">
          <img class="slide" src="/public/img/sponsor/Bracelli.png" alt="Image 1">
          <img class="slide" src="/public/img/sponsor/La_gourmandise.png" alt="Image 2">
          <img class="slide" src="/public/img/sponsor/marti.png" alt="Image 3">
          <img class="slide" src="/public/img/sponsor/chasseur.jpg" alt="Image 4">
        </div>
        <h1>Agenda</h1>
      </aside>

      <footer>
        <p>&copy; 2025 Club Gym & Volley - Tous droits réservés</p>
      </footer>
    </body>
    </html>
  `;
}

// Fonction générique pour servir une page HTML
async function serveHtmlPage(req, res, pageName) {
  try {
    // Chemin complet vers le fichier HTML dans /views
    const filePath = path.join(__dirname, 'views', `${pageName}.html`);
    const content = await fs.readFile(filePath, 'utf-8');
    const title = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    res.send(renderPage(title, content));
  } catch (err) {
    console.error(`❌ Erreur lors du chargement de "${pageName}.html" : ${err.message}`);
    res.status(404).send(renderPage(
      'Page non trouvée',
      `<h1>404 - Page introuvable</h1><p>La page "<strong>${pageName}</strong>" n'existe pas.</p>`
    ));
  }
}

// Route racine (redirige vers accueil.html)
app.get('/', (req, res) => {
  serveHtmlPage(req, res, 'accueil');
});

// Route dynamique : /contact → views/contact.html, etc.
app.get('/:page', (req, res) => {
  const pageName = req.params.page;
  serveHtmlPage(req, res, pageName);
});

// Lancement serveur
app.listen(3000, () => {
  console.log('Serveur lancé sur http://localhost:3000');
});