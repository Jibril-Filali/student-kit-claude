/* ===== TERMINAL IA — SetupClaude ===== */

const SYSTEM_PROMPT = `Tu es l'assistant du site SetupClaude. Tu réponds uniquement aux questions sur Claude Code, les skills, les sous-agents, le CLAUDE.md, les commandes PowerShell et le workflow du guide. Tes réponses sont courtes, directes et en français, style terminal. Maximum 4 lignes. Si la question concerne une section précise du site, commence ta réponse par [SECTION:nom-de-la-section] pour que le site puisse faire défiler vers cette section. Sections disponibles : installation, kit-installation, nouveau-projet, claudemd, commandes-ps, skills, sous-agents, raccourcis, workflow, prompts, telechargements.`;

const SECTION_MAP = {
  'installation': '#installation',
  'kit-installation': '#kit-installation',
  'nouveau-projet': '#nouveau-projet',
  'claudemd': '#claudemd',
  'commandes-ps': '#commandes-ps',
  'skills': '#skills',
  'sous-agents': '#sous-agents',
  'raccourcis': '#raccourcis',
  'workflow': '#workflow',
  'prompts': '#prompts',
  'telechargements': '#telechargements',
};

let messages = [];
let panelOpen = false;

/* ===== TOGGLE PANEL ===== */
function toggleTerminal() {
  panelOpen = !panelOpen;
  const panel = document.getElementById('ai-terminal-panel');
  const btn = document.getElementById('ai-terminal-btn');
  panel.classList.toggle('open', panelOpen);
  btn.classList.toggle('active', panelOpen);
  document.getElementById('ai-btn-label').textContent = panelOpen ? 'Fermer' : 'Assistant';

  if (panelOpen) {
    showDevScreen();
  }
}

/* ===== ÉCRAN EN DÉVELOPPEMENT ===== */
function showDevScreen() {
  const apiScreen = document.getElementById('ai-apikey-screen');
  const termBody = document.getElementById('ai-terminal-body');
  if (apiScreen) apiScreen.style.display = 'none';
  if (termBody) termBody.style.display = 'none';

  let devScreen = document.getElementById('ai-dev-screen');
  if (!devScreen) {
    devScreen = document.createElement('div');
    devScreen.id = 'ai-dev-screen';
    devScreen.className = 'apikey-content';
    devScreen.innerHTML = `
      <h3>Assistant IA</h3>
      <p style="margin-bottom:1.25rem;">Cette fonctionnalité est en cours de développement. Elle sera disponible prochainement.</p>
      <div style="display:flex;flex-direction:column;gap:0.5rem;margin-bottom:1.5rem;">
        <div class="ai-feature-item">Navigation guidée par voix</div>
        <div class="ai-feature-item">FAQ sans clé API (réponses statiques)</div>
        <div class="ai-feature-item">Scroll automatique vers les sections</div>
        <div class="ai-feature-item">Historique local de tes questions</div>
      </div>
      <button class="btn btn-ghost" onclick="toggleTerminal()" style="width:100%">Fermer</button>
    `;
    document.getElementById('ai-terminal-panel').appendChild(devScreen);
  }
  devScreen.style.display = 'block';
}

function showApiKeyScreen() {
  document.getElementById('ai-apikey-screen').style.display = 'flex';
  document.getElementById('ai-terminal-body').style.display = 'none';
  setTimeout(() => document.getElementById('apikey-input')?.focus(), 100);
}

function showTerminalBody() {
  document.getElementById('ai-apikey-screen').style.display = 'none';
  document.getElementById('ai-terminal-body').style.display = 'flex';

  // Message de bienvenue si première ouverture
  const messagesEl = document.getElementById('ai-messages');
  if (messagesEl && messagesEl.children.length === 0) {
    afficherMessage('assistant', '> Bonjour ! Pose une question sur Claude Code, les skills, le CLAUDE.md ou le workflow.\n> Exemples : "comment installer le kit ?" / "c\'est quoi ultrathink ?" / "les sous-agents disponibles ?"');
  }
  setTimeout(() => document.getElementById('ai-input')?.focus(), 100);
}

/* ===== VALIDATION CLÉ API ===== */
async function validerApiKey() {
  const input = document.getElementById('apikey-input');
  const errorEl = document.getElementById('apikey-error');
  const key = input.value.trim();

  if (!key.startsWith('sk-ant-')) {
    errorEl.textContent = 'Format invalide. La clé doit commencer par sk-ant-';
    return;
  }

  errorEl.textContent = '';
  input.disabled = true;
  errorEl.style.color = 'var(--text-muted)';
  errorEl.textContent = 'Vérification en cours...';

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'ok' }],
      }),
    });

    if (res.ok || res.status === 200) {
      sessionStorage.setItem('sc_apikey', key);
      showTerminalBody();
    } else if (res.status === 401) {
      errorEl.style.color = 'var(--red)';
      errorEl.textContent = 'Clé invalide. Vérifie sur console.anthropic.com/settings/keys';
    } else {
      // Accepter même si autre erreur (ex: quota) — la clé est probablement valide
      sessionStorage.setItem('sc_apikey', key);
      showTerminalBody();
    }
  } catch {
    errorEl.style.color = 'var(--red)';
    errorEl.textContent = 'Erreur réseau. Vérifie ta connexion.';
  }

  input.disabled = false;
}

/* ===== ENVOI MESSAGE ===== */
function handleTerminalKey(e) {
  if (e.key === 'Enter') envoyerMessage();
}

async function envoyerMessage() {
  const input = document.getElementById('ai-input');
  const texte = input.value.trim();
  if (!texte) return;

  // Commande /reset
  if (texte.trim().toLowerCase() === '/reset') {
    input.value = '';
    sessionStorage.removeItem('sc_apikey');
    messages = [];
    const container = document.getElementById('ai-messages');
    if (container) container.innerHTML = '';
    showApiKeyScreen();
    return;
  }

  const apiKey = sessionStorage.getItem('sc_apikey');
  if (!apiKey) { showApiKeyScreen(); return; }

  input.value = '';
  input.disabled = true;

  // Afficher message utilisateur
  afficherMessage('user', texte);
  messages.push({ role: 'user', content: texte });

  // Afficher indicateur de frappe
  const typingId = afficherTyping();

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: messages,
      }),
    });

    supprimerTyping(typingId);

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const errMsg = errBody?.error?.message || '';
      const erreurs = {
        400: 'Solde insuffisant. Va sur console.anthropic.com → Plans & Billing pour recharger.',
        401: 'Clé API invalide. Tape /reset pour changer de clé.',
        429: 'Limite atteinte. Réessaie dans quelques secondes.',
        500: 'Erreur serveur Anthropic. Réessaie.',
      };
      afficherMessage('error', erreurs[res.status] || `Erreur ${res.status}${errMsg ? ': ' + errMsg : ''}`);
      if (res.status === 401) sessionStorage.removeItem('sc_apikey');
      input.disabled = false;
      return;
    }

    const data = await res.json();
    const reponse = data.content?.[0]?.text || 'Réponse vide.';

    // Parser le tag [SECTION:...]
    const sectionMatch = reponse.match(/^\[SECTION:([a-z-]+)\]/);
    let texteAffiche = reponse;

    if (sectionMatch) {
      const sectionId = sectionMatch[1];
      texteAffiche = reponse.replace(/^\[SECTION:[a-z-]+\]\s*/, '');
      scrollVersSection(sectionId);
    }

    // Afficher avec typewriter
    messages.push({ role: 'assistant', content: reponse });
    afficherMessageTypewriter('assistant', texteAffiche);

  } catch {
    supprimerTyping(typingId);
    afficherMessage('error', 'Erreur réseau. Vérifie ta connexion.');
  }

  input.disabled = false;
  input.focus();
}

/* ===== AFFICHAGE MESSAGES ===== */
function afficherMessage(role, texte) {
  const container = document.getElementById('ai-messages');
  if (!container) return;

  const el = document.createElement('div');
  el.className = `ai-msg ai-msg-${role}`;

  if (role === 'user') {
    el.innerHTML = `<span class="ai-msg-prompt">visitor@setupclaude:~$</span> <span class="ai-msg-text">${escapeHtml(texte)}</span>`;
  } else {
    el.innerHTML = `<span class="ai-msg-text">${escapeHtml(texte).replace(/\n/g, '<br>')}</span>`;
  }

  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
  return el;
}

function afficherMessageTypewriter(role, texte) {
  const container = document.getElementById('ai-messages');
  if (!container) return;

  const el = document.createElement('div');
  el.className = `ai-msg ai-msg-${role}`;
  el.innerHTML = `<span class="ai-msg-text"></span>`;
  container.appendChild(el);
  container.scrollTop = container.scrollHeight;

  const textEl = el.querySelector('.ai-msg-text');
  let i = 0;
  const interval = setInterval(() => {
    if (i < texte.length) {
      textEl.innerHTML = escapeHtml(texte.substring(0, ++i)).replace(/\n/g, '<br>');
      container.scrollTop = container.scrollHeight;
    } else {
      clearInterval(interval);
    }
  }, 12);
}

function afficherTyping() {
  const container = document.getElementById('ai-messages');
  if (!container) return null;
  const el = document.createElement('div');
  el.className = 'ai-msg ai-msg-typing';
  el.id = 'typing-' + Date.now();
  el.innerHTML = '<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>';
  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
  return el.id;
}

function supprimerTyping(id) {
  if (id) document.getElementById(id)?.remove();
}

function clearTerminalHistory() {
  messages = [];
  const container = document.getElementById('ai-messages');
  if (container) container.innerHTML = '';
  afficherMessage('assistant', '> Historique effacé. Pose une nouvelle question.');
}

/* ===== SCROLL VERS SECTION ===== */
function scrollVersSection(sectionId) {
  const anchor = SECTION_MAP[sectionId];
  if (!anchor) return;
  const el = document.querySelector(anchor);
  if (!el) return;
  setTimeout(() => {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Flash visuel de la section
    el.classList.add('section-highlight');
    setTimeout(() => el.classList.remove('section-highlight'), 2000);
  }, 400);
  showToast(`↓ Scroll vers : ${sectionId}`);
}

/* ===== UTILITAIRES ===== */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
