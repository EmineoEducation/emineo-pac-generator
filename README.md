# Générateur PAC — Éminéo Education

Outil interne : ingère un référentiel RACE (PDF), laisse choisir un bloc, et produit un **PAC déployable** (Parcours Activation Compétences) pour l'univers Lumio Health.

## Déploiement du générateur (une fois)

1. `git push` ce repo sur GitHub.
2. Connecter à Vercel → déploiement statique, aucune variable d'environnement requise.
3. Ouvrir l'URL, saisir la clé Anthropic (stockée en `localStorage`, jamais envoyée à un serveur tiers).

> Le générateur appelle l'API Anthropic **directement depuis le navigateur**. Il n'a donc ni route serverless ni `vercel.json`.

## Architecture

```
index.html        Générateur (3 écrans : ingestion RACE → choix bloc → sortie + ZIP)
template/          Runtime PAC complet, embarqué tel quel dans chaque ZIP généré
  index.html, styles.css, icons.jsx, main.jsx, desktop.jsx
  app-mail/browser/pdf/voice/notes/slack/extras/trash.jsx
  api/chat.js, api/session.js, vercel.json, package.json
```

Le ZIP produit = `template/*` + 3 fichiers générés pour le bloc :

- **`data.js`** — backbone narratif. `window.LUMIO_DATA` (toutes les clés lues par le runtime, donc **aucun crash au chargement**) + `window.PAC_CONFIG` (+ alias `PASS_CONFIG`).
- **`app-livrable.jsx`** — `LivrableApp` générique : lit `PAC_CONFIG.competences`, compte les mots, soumet au jury via `/api/chat`.
- **`app-assistant.jsx`** — `JeffersonApp` générique : guide par acte selon le timer.

Personnalisation étudiant : `data.js` utilise `{{PRENOM}} {{NOM}} {{EMAIL_ETUDIANT}}`, substitués en un seul passage par `applyStudent()` (main.jsx) à la connexion **et** à la reprise de session.

## Déployer un PAC généré

1. Créer le repo `lumio-bcX` avec **tout le contenu du ZIP**.
2. `git push` → connecter à Vercel.
3. Variables Vercel : `ANTHROPIC_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.
4. Modèle des appels IA du PAC : `claude-sonnet-4-5` (via `/api/chat`).

## Limite connue — contenu narratif

Le PAC généré **tourne immédiatement**, mais les apps chrome (Mail, PDF, Navigateur, presse) portent encore un contenu générique : les expéditeurs, distracteurs et documents y sont partiellement codés en dur (héritage de l'architecture actuelle, où le contenu vit dans les apps et pas seulement dans `data.js`).

Avant mise en service d'un bloc, remplacer dans `data.js` toutes les balises **`[À COMPLÉTER]`** par le contenu réel.

Le **vrai zéro-touch** (apps 100 % pilotées par `data.js`) suppose une refonte moteur des apps chrome — chiffrable séparément.
