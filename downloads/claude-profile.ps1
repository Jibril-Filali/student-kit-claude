# ================================
# Kit Claude Code — Automatisation
# ================================

# Chemin vers ton kit étudiant
$KIT = "$HOME\Downloads\student-kit"

# --------------------------------
# nouveau-projet
# Initialise un projet avec le kit Claude
# Usage : nouveau-projet
# --------------------------------
function nouveau-projet {
    if (-not (Test-Path $KIT)) {
        Write-Host "ERREUR : Le dossier student-kit est introuvable dans Telechargements." -ForegroundColor Red
        Write-Host "Verifie que student-kit est bien dans : $HOME\Downloads\" -ForegroundColor Yellow
        return
    }

    Copy-Item "$KIT\CLAUDE.md" .\CLAUDE.md -Force
    Copy-Item -Recurse "$KIT\tasks" .\tasks -Force

    Write-Host ""
    Write-Host "Kit Claude pret !" -ForegroundColor Green
    Write-Host "  CLAUDE.md cree" -ForegroundColor Cyan
    Write-Host "  tasks/ cree (todo.md + lessons.md)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Lance claude pour demarrer." -ForegroundColor White
}

# --------------------------------
# nouveau-projet-vide
# Initialise sans CLAUDE.md (si tu as deja le tien)
# Usage : nouveau-projet-vide
# --------------------------------
function nouveau-projet-vide {
    if (-not (Test-Path $KIT)) {
        Write-Host "ERREUR : student-kit introuvable." -ForegroundColor Red
        return
    }

    Copy-Item -Recurse "$KIT\tasks" .\tasks -Force

    Write-Host ""
    Write-Host "Dossier tasks/ cree." -ForegroundColor Green
}

# --------------------------------
# aller-projet
# Va dans un projet et lance Claude Code directement
# Usage : aller-projet C:\Users\jibri\Documents\mon-projet
# --------------------------------
function aller-projet {
    param([string]$chemin)

    if (-not $chemin) {
        Write-Host "Usage : aller-projet C:\chemin\vers\projet" -ForegroundColor Yellow
        return
    }

    if (-not (Test-Path $chemin)) {
        Write-Host "ERREUR : Ce chemin n existe pas." -ForegroundColor Red
        return
    }

    cd $chemin

    if (-not (Test-Path .\CLAUDE.md)) {
        Write-Host "Pas de CLAUDE.md detecte. Initialisation du kit..." -ForegroundColor Yellow
        nouveau-projet
    }

    Write-Host "Ouverture de Claude Code..." -ForegroundColor Cyan
    claude
}

# --------------------------------
# update-kit
# Met a jour les skills et agents globaux depuis le kit
# Usage : update-kit
# --------------------------------
function update-kit {
    if (-not (Test-Path $KIT)) {
        Write-Host "ERREUR : student-kit introuvable dans Telechargements." -ForegroundColor Red
        return
    }

    Copy-Item -Recurse "$KIT\.claude\skills\*" "$HOME\.claude\skills\" -Force
    Copy-Item -Recurse "$KIT\.claude\agents\*" "$HOME\.claude\agents\" -Force

    Write-Host ""
    Write-Host "Skills et agents mis a jour !" -ForegroundColor Green
    Write-Host "  Skills : /debug-java /explain /sql /mongo /simplify /techdebt /commit-push-pr /route" -ForegroundColor Cyan
    Write-Host "  Agents : tutor, java-reviewer, code-reviewer, test-writer, doc-generator" -ForegroundColor Cyan
}

# --------------------------------
# aide-claude
# Affiche toutes les commandes disponibles
# Usage : aide-claude
# --------------------------------
function aide-claude {
    Write-Host ""
    Write-Host "=== Kit Claude Code ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "COMMANDES POWERSHELL :" -ForegroundColor Yellow
    Write-Host "  nouveau-projet          Initialise le kit dans le projet actuel"
    Write-Host "  nouveau-projet-vide     Cree juste le dossier tasks/"
    Write-Host "  aller-projet [chemin]   Va dans un projet et lance Claude"
    Write-Host "  update-kit              Met a jour skills et agents globaux"
    Write-Host "  aide-claude             Affiche cette aide"
    Write-Host ""
    Write-Host "SKILLS DANS CLAUDE CODE :" -ForegroundColor Yellow
    Write-Host "  /debug-java             Corriger une erreur Java"
    Write-Host "  /explain                Comprendre un concept ou du code"
    Write-Host "  /sql                    Aide avec MySQL"
    Write-Host "  /mongo                  Aide avec MongoDB"
    Write-Host "  /simplify               Simplifier du code complexe"
    Write-Host "  /techdebt               Analyser la dette technique"
    Write-Host "  /commit-push-pr         Commit + push + PR automatique"
    Write-Host "  /route [ta tache]       Savoir ou aller (extension vs terminal)"
    Write-Host ""
    Write-Host "SOUS-AGENTS DANS CLAUDE CODE :" -ForegroundColor Yellow
    Write-Host "  tutor                   Explique comme un prof"
    Write-Host "  java-reviewer           Relit ton code Java"
    Write-Host "  test-writer             Ecrit les tests"
    Write-Host "  doc-generator           Genere la documentation"
    Write-Host ""
    Write-Host "RACCOURCIS CLAUDE CODE :" -ForegroundColor Yellow
    Write-Host "  Shift+Tab (x2)          Active Plan Mode"
    Write-Host "  ultrathink              Force une analyse profonde"
    Write-Host ""
}

Write-Host "Kit Claude charge. Tape aide-claude pour voir les commandes." -ForegroundColor DarkGray
