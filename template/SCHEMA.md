# Contrat `data.js` — PAC (apps 100 % data-driven)

À partir de cette version, **aucune** des 6 apps de contenu (`app-mail`, `app-notes`,
`app-browser`, `app-pdf`, `app-extras`, `app-slack`) ne hardcode de narration.
Tout est lu depuis `window.LUMIO_DATA` (= `D`) et `window.PAC_CONFIG`.
Le générateur ne touche plus qu'à `data.js` + les 2 apps déjà génériques
(`app-livrable`, `app-assistant`). Les 6 apps sont copiées telles quelles (template figé).

`window.PASS_CONFIG = window.PAC_CONFIG` reste comme alias rétrocompatible.

---

## `window.LUMIO_DATA`

```
student            { name, role, email, company, initial }
contexte           { title, subtitle, body }
fictif             { startLabel, jours, dateBoardLabel, ... }   // libellés temps fictif (optionnel)

briefEmail         { from, fromEmail, subject, date, body, preview?, tags?[] }
mailbox            [ MailItem ]          // ← NOUVEAU : boîte mail complète, pilotée par data
notes              [ NoteItem ]          // ← NOUVEAU : notes app
browser            { sites:[Site], search:{...}, fausseUne:{...}, related:[...] }  // ← NOUVEAU
portraits          [ Portrait ]          // ← NOUVEAU : remplace PORTRAIT_META hardcodé
dossiers           [ Dossier ]           // ← NOUVEAU : PDF viewer (deck, veille, guide…)
pressArticles      [ Article ]           // déjà existant
voiceMemos         [ VoiceMemo ]         // ← NOUVEAU : remplace camilleVerbatims hardcodé
finder             { folders:{ id:{ title, items:[FinderItem] } }, order:[id] } // ← NOUVEAU
calendar           { events:{ day:[Event] }, deadlineDay, boardDay?, startOffset, monthLabel } // ← NOUVEAU
slack              { channels:[], dms:[], seed:{ id:[Msg] }, unreads:{} }       // ← NOUVEAU
slackPrompts       { commanditaire, commanditaireLivrable }  // prompts système IA, par bloc
fausseUne          { source, kicker, headline, chapo, date, body }              // déjà existant
```

### MailItem
`{ id, from, fromEmail, avatar, avatarColor, subject, date, preview, unread, flagged?, forwarded?, distractor?, tags?[], body, header?{from,to,cc,date,tag} }`
- `body` peut être une chaîne directe **ou** une réf `"@briefEmail.body"` (résolue par resolveRef).

### NoteItem
`{ id, title, date, preview, body, distractor? }`  (body string ou @ref)

### Site (browser)
`{ id, type:'corporate'|'article'|'linkedin'|'search'|'fausse-une'|'portrait', favicon, faviconColor, host, title, url, ...payload selon type }`
- `corporate` : `{ tagline, sections:[{h,p}] }`
- `linkedin`  : `{ name, headline, about, posts:[...] }`
- `search`    : `{ query, results:[{url,title,desc}] }`
- les `article` sont générés automatiquement depuis `pressArticles` si `browser.sites` ne les contient pas.

### Portrait
`{ id, key, favicon, faviconColor, host, title, url, file }`  (file = /portraits/xxx.html)

### Dossier (PDF viewer)
`{ id, kind:'deck'|'veille'|'rich'|'guide', title, subtitle?, date?, pages?[] , sections?[], stale?{date,note} }`

### VoiceMemo
`{ id, author, role, date, duration, context, transcript }`

### FinderItem
`{ name, kind:'mail'|'pdf'|'doc'|'audio'|'folder', app?, props?, label?, folder? }`

### Event (calendar)  `{ label, color, bg, bold? }`

### Slack Msg  `{ from, avatar, color, time, text }`

### slackPrompts (remplace les const *_PROMPT hardcodés)
```
commanditaire          : prompt système du commanditaire en chat libre (Acte 3)
commanditaireLivrable  : prompt système de réaction au livrable soumis (Acte 4)
```
Le nom du commanditaire, son rôle, le contexte du bloc sont injectés par le générateur
dans ces deux chaînes — plus aucun nom de personnage en dur dans `app-slack.jsx`.

---

## Résolution des `@ref`
`resolveRef("@briefEmail.body")` → `D.briefEmail.body`. Toute valeur string commençant
par `@` est résolue contre `D`. Permet de centraliser un corps long une seule fois.
Helper exposé : `window.LUMIO_RESOLVE`.
