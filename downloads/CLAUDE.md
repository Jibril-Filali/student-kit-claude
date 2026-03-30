# CLAUDE.md

## DÉMARRAGE DE SESSION
1. Lire tasks/lessons.md — appliquer toutes les leçons avant de toucher quoi que ce soit
2. Lire tasks/todo.md — comprendre l'état actuel
3. Lire tasks/session-log.md — comprendre ce qui a été fait avant
4. Si aucun des trois n'existe, les créer avant de commencer

---

## PROJET
Étudiant en développement. Stack principale : Java, MySQL, MongoDB.
Niveau : intermédiaire. Explique clairement, donne des exemples concrets, pas de condescendance.

---

## WORKFLOW

### 1. Planifier d'abord
- Passer en mode plan pour toute tâche non triviale (3+ étapes)
- Écrire le plan dans tasks/todo.md avant d'implémenter
- Si quelque chose ne va pas, STOP et re-planifier — ne jamais forcer

### 2. Stratégie sous-agents
- Utiliser des sous-agents pour garder le contexte principal propre
- Une tâche par sous-agent
- Investir plus de compute sur les problèmes difficiles

### 3. Boucle d'auto-amélioration
- Après toute correction : mettre à jour tasks/lessons.md
- Format : [date] | ce qui a mal tourné | règle pour l'éviter
- Relire les leçons à chaque démarrage de session

### 4. Standard de vérification
- Ne jamais marquer comme terminé sans preuve que ça fonctionne
- Compiler et tester avant de valider
- Se demander : « Est-ce qu'un prof validerait ça ? »

### 5. Correction de bugs autonome
- Quand on reçoit une erreur : lire le stack trace complet, trouver la cause racine
- Ne jamais patcher sans comprendre pourquoi ça cassait

---

## PRINCIPES FONDAMENTAUX
- Simplicité d'abord — le code le plus simple qui fonctionne
- Pas de copier-coller sans comprendre — toujours expliquer ce que fait le code
- Ne jamais supposer — vérifier les types, les connexions, les variables avant utilisation
- Demander une seule fois — une question en amont si nécessaire

---

## CODE — JAVA

- Nommage : classes PascalCase, méthodes et variables camelCase, constantes UPPER_SNAKE_CASE
- Toujours fermer les ressources (connexions DB, streams) avec try-with-resources
- Pas de `System.out.println` en production — utiliser un logger
- Gérer toutes les exceptions — jamais de `catch (Exception e) {}` vide
- Commentaires en français si le projet est en français

## CODE — SQL (MySQL)

- Toujours utiliser des requêtes préparées (PreparedStatement) — jamais de concaténation de strings
- Nommage : tables et colonnes en snake_case
- Toujours prévoir les index sur les colonnes utilisées dans WHERE et JOIN
- Tester les requêtes sur un petit jeu de données avant de les lancer sur toute la base

## CODE — MongoDB

- Valider le schéma des documents avant insertion
- Utiliser des index sur les champs fréquemment recherchés
- Préférer les agrégations aux boucles applicatives pour les calculs sur les données

---

## GESTION DES TÂCHES
1. Planifier → tasks/todo.md
2. Vérifier → confirmer avant d'implémenter
3. Suivre → marquer comme terminé au fur et à mesure
4. Expliquer → résumé de haut niveau à chaque étape
5. Apprendre → tasks/lessons.md après corrections

---

## APPRENTISSAGES
*(Claude remplit cette section au fil du temps)*

Format : [date] | ce qui a mal tourné | règle pour l'éviter
