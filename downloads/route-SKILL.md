# /route — Skill SetupClaude

## Déclencheur
Utilise cette skill quand l'utilisateur te demande où faire une tâche, hésite entre l'extension VS Code et le terminal Claude Code, ou quand tu dois choisir le bon outil pour lui.

## Comportement

Analyse la tâche demandée et retourne une recommandation claire :

### → Extension VS Code si :
- Lecture/navigation dans un fichier spécifique
- Suggestions d'autocomplétion en cours de frappe
- Refactoring visuel (renommer une variable dans l'UI)
- Débogage interactif avec breakpoints
- Comparaison visuelle de diff dans l'éditeur
- Tâche rapide et ponctuelle dans un seul fichier

### → Terminal Claude Code si :
- Tâche multi-fichiers ou multi-étapes
- Génération de code (nouveaux fichiers, nouvelles classes)
- Correction de bug à partir d'un stack trace
- Refactoring à grande échelle
- Commandes shell, git, npm
- Tout ce qui nécessite de lire + modifier + tester

## Format de réponse

```
→ [OUTIL] — [NOM DE L'OUTIL]
[Raison en 1 ligne]
[Commande ou action concrète à faire]
```

## Exemple

Utilisateur : "je veux créer un service Java pour gérer les connexions DB"

Réponse :
```
→ TERMINAL — Claude Code
Tâche multi-fichiers : nouvelle classe + injection de dépendances + test.
Lance : claude dans ton projet, puis décris la tâche.
```
