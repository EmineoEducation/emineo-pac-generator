# Éminéo — Générateur PAC

Générateur de **Parcours Activation Compétences** (PAC) depuis un référentiel RNCP officiel (PDF France Compétences).

## Ce que ça fait

1. Tu uploades le PDF référentiel RNCP + plan de formation
2. Tu sélectionnes le bloc certifiant cible (BC1 à BC6)
3. Claude extrait les compétences verbatim et génère le spec JSON
4. Le générateur produit 3 fichiers JSX prêts à déployer :
   - `data.js` — Univers narratif Lumio + config PAC
   - `app-livrable.jsx` — Formulaire compétences + jury IA RNCP
   - `app-assistant.jsx` — Jefferson, guide procédural

## Stack

- HTML/JS vanilla — aucun framework, aucune build step
- Vercel — déploiement auto depuis ce repo
- Anthropic API — via proxy `api/chat.js` (clé côté serveur, pas dans le navigateur)
- JSZip — téléchargement ZIP des fichiers générés

## Déploiement

### Vercel

1. Importer ce repo dans Vercel
2. Configurer la variable d'environnement : `ANTHROPIC_API_KEY=sk-ant-...`
3. Deploy → URL automatique

### Variable d'environnement requise

```
ANTHROPIC_API_KEY=sk-ant-...
```

## Usage des fichiers générés

Les 3 fichiers JSX produits sont à déposer dans le repo du BC correspondant
(`lumio-bc1`, `lumio-bc2`, etc.) avec les fichiers fixes (desktop, session, styles).

⚠️ Compléter le contenu narratif des documents fictifs dans `data.js` (marqués `// TODO`).

---

Éminéo Education · Direction des Programmes · Usage interne
