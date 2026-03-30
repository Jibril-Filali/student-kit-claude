# CLAUDE.md — SetupClaude

## DÉMARRAGE DE SESSION OBLIGATOIRE
1. Lire `tasks/session-log.md` — comprendre l'état exact du projet
2. Lire `tasks/todo.md` — voir les tâches en cours
3. Mettre à jour `session-log.md` avec la date et l'état au démarrage

## CLÔTURE DE SESSION OBLIGATOIRE
Avant la fin (ou dès qu'une tâche est terminée) :
1. Écrire dans `tasks/session-log.md` ce qui a été fait
2. Mettre à jour `tasks/todo.md` avec ce qui reste

---

## PROJET
Site statique HTML/CSS/JS — guide d'installation de Claude Code pour étudiants.

**Stack :** HTML · CSS vanilla · JavaScript vanilla (pas de framework)
**Pages :** `index.html` (landing) · `guide.html` (11 sections)
**Assets :** `css/style.css` · `js/main.js` · `js/terminal.js`
**Downloads :** `downloads/student-kit.zip` · `downloads/claude-profile.ps1`

## ARCHITECTURE
- `js/main.js` — checklist localStorage, animation terminal hero, copie, scroll progress
- `js/terminal.js` — assistant IA flottant : clé API Anthropic (sessionStorage), appel Haiku, typewriter, scroll vers section
- Pas de build tool — tout est servi en statique (port 3000 avec `npx serve . -p 3000`)

## RÈGLES CODE
- Pas de framework JS
- Pas de dépendances npm dans le code source
- Clés API → sessionStorage uniquement, jamais localStorage
- Commentaires en français

## APPRENTISSAGES
Format : [date] | ce qui a mal tourné | règle pour l'éviter
