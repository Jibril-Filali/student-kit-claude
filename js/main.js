/* ===== PAGE LOADER ===== */
(function(){
  var l = document.getElementById('page-loader');
  if (!l) return;
  var t0 = Date.now();
  var MIN = 500;
  function hide() {
    var wait = Math.max(0, MIN - (Date.now() - t0));
    setTimeout(function(){ l.classList.add('loader-done'); }, wait);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hide);
  } else {
    hide();
  }
})();

/* ===== ANIMATION TERMINAL HERO ===== */
const lignes = [
  { cmd: 'npm install -g @anthropic-ai/claude-code', output: 'claude-code installed successfully' },
  { cmd: 'nouveau-projet', output: 'CLAUDE.md et tasks/ copies dans le projet' },
  { cmd: 'claude', output: '> Bonjour ! Que veux-tu faire aujourd\'hui ?' },
];
let ligneIndex = 0, charIndex = 0, phase = 'typing';

function typeTerminal() {
  const ligne = lignes[ligneIndex];
  const cmdEl = document.getElementById('hero-cmd');
  const outputEl = document.getElementById('hero-output');
  if (!cmdEl) return;
  if (phase === 'typing') {
    if (charIndex < ligne.cmd.length) { cmdEl.textContent += ligne.cmd[charIndex++]; setTimeout(typeTerminal, 45); }
    else { phase = 'waiting'; setTimeout(typeTerminal, 600); }
    return;
  }
  if (phase === 'waiting') { outputEl.style.display = 'block'; outputEl.textContent = ligne.output; phase = 'done'; setTimeout(typeTerminal, 2200); return; }
  if (phase === 'done') { ligneIndex = (ligneIndex + 1) % lignes.length; charIndex = 0; phase = 'typing'; cmdEl.textContent = ''; outputEl.style.display = 'none'; setTimeout(typeTerminal, 500); }
}

/* ===== SCROLL PROGRESS BAR ===== */
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  const bar = document.getElementById('scroll-progress');
  if (bar) bar.style.width = pct + '%';
}

/* ===== LIEN ACTIF SOMMAIRE + OVERVIEW CARDS ===== */
function activerLiensActifs() {
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.som-link').forEach(l => l.classList.remove('active'));
        const lien = document.querySelector(`.som-link[href="#${entry.target.id}"]`);
        if (lien) lien.classList.add('active');
        document.querySelectorAll('.overview-card').forEach(c => c.classList.remove('active'));
        const card = document.querySelector(`.overview-card[href="#${entry.target.id}"]`);
        if (card) card.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => observer.observe(s));
}

/* ===== CHECKLIST INSTALLATION ===== */
function initChecklist() {
  const checks = document.querySelectorAll('.step-check');
  checks.forEach(cb => {
    const saved = localStorage.getItem('check_' + cb.dataset.step);
    if (saved === 'true') cb.checked = true;
  });
  updateChecklist();
}

function updateChecklist() {
  const checks = document.querySelectorAll('.step-check');
  let done = 0;
  checks.forEach(cb => {
    localStorage.setItem('check_' + cb.dataset.step, cb.checked);
    if (cb.checked) done++;
    // Style visuel de la step-card
    const card = cb.closest('.step-card');
    if (card) card.classList.toggle('step-done', cb.checked);
  });
  const total = checks.length;
  const countEl = document.getElementById('checklist-count');
  const fillEl = document.getElementById('checklist-fill');
  if (countEl) countEl.textContent = `${done} / ${total} étapes`;
  if (fillEl) fillEl.style.width = total > 0 ? (done / total * 100) + '%' : '0%';
}

/* ===== COPIE CODE ===== */
function copier(btn, texte) {
  navigator.clipboard.writeText(texte).then(() => {
    const orig = btn.textContent;
    btn.textContent = 'Copie !';
    btn.classList.add('copied');
    showToast('Copie dans le presse-papiers');
    setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 2000);
  }).catch(() => showToast('Erreur copie'));
}

function copierBloc(btn, id) {
  const el = document.getElementById(id);
  if (!el) return;
  navigator.clipboard.writeText(el.innerText).then(() => {
    const orig = btn.textContent;
    btn.textContent = 'Copie !';
    btn.classList.add('copied');
    showToast('Copie dans le presse-papiers');
    setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 2000);
  }).catch(() => showToast('Erreur copie'));
}

function copierPrompt(card) {
  const texte = card.querySelector('.prompt-text').innerText;
  navigator.clipboard.writeText(texte).then(() => {
    card.style.borderColor = 'var(--green)';
    showToast('Prompt copie !');
    setTimeout(() => { card.style.borderColor = ''; }, 1500);
  }).catch(() => showToast('Erreur copie'));
}

/* ===== TOAST ===== */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

/* ===== NAVIGATION RETOUR ===== */
let _derniereSectionAvantTelechargements = null;

function retourInstallation(e, fallback) {
  e.preventDefault();
  const cible = _derniereSectionAvantTelechargements || fallback;
  const el = document.querySelector(cible);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function initRetourNavigation() {
  // Mémorise la section active quand l'utilisateur clique vers #telechargements
  document.querySelectorAll('a[href="#telechargements"], a[href="guide.html#telechargements"]').forEach(lien => {
    lien.addEventListener('click', () => {
      // Trouve la section visible la plus proche
      const sections = document.querySelectorAll('section[id]');
      let plusProche = null;
      let distMin = Infinity;
      sections.forEach(s => {
        const rect = s.getBoundingClientRect();
        const dist = Math.abs(rect.top);
        if (dist < distMin) { distMin = dist; plusProche = '#' + s.id; }
      });
      if (plusProche && plusProche !== '#telechargements') {
        _derniereSectionAvantTelechargements = plusProche;
        // Met à jour les labels des boutons retour
        document.querySelectorAll('.btn-retour').forEach(btn => {
          btn.href = plusProche;
          const label = document.querySelector(plusProche + ' .section-title');
          if (label) btn.textContent = '← Reprendre : ' + label.textContent.replace(/^\d+\s*·\s*/, '').trim();
        });
      }
    });
  });
}

/* ===== 3D CARD TILT ===== */
function initCardTilt() {
  const cards = document.querySelectorAll('.feat-card, .skill-card, .tip-card, .dl-card, .raccourci-card, .agent-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (!card.classList.contains('anim-visible') && card.classList.contains('anim-hidden')) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transition = 'transform 0.06s ease, border-color 0.2s, box-shadow 0.2s';
      card.style.transform = `perspective(700px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.45s ease, border-color 0.2s, box-shadow 0.2s';
      card.style.transform = '';
    });
  });
}

/* ===== ENTRANCE ANIMATIONS ===== */
function initEntranceAnimations() {
  const targets = document.querySelectorAll(
    '.feat-card, .skill-card, .agent-card, .raccourci-card, .tip-card, .dl-card, .workflow-block, .prompt-category, .bp-card'
  );
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  targets.forEach(el => {
    el.classList.add('anim-hidden');
    observer.observe(el);
  });
}

/* ===== CURSEUR PERSONNALISE ===== */
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = -20, my = -20, rx = -40, ry = -40;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = Math.round(rx * 10) / 10 + 'px';
    ring.style.top = Math.round(ry * 10) / 10 + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button, [onclick], label, input[type="checkbox"]').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('grow'); ring.classList.add('grow'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('grow'); ring.classList.remove('grow'); });
  });

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '0.35'; });
}

/* ===== SIDEBAR DROITE ===== */
function initRightSidebar() {
  const sidebar = document.getElementById('sidebar-right');
  if (!sidebar) return;
  const sections = Array.from(document.querySelectorAll('section[id]'));
  if (!sections.length) { sidebar.style.display = 'none'; return; }

  sidebar.innerHTML = sections.map(s => {
    const titleEl = s.querySelector('.section-title');
    const label = titleEl ? titleEl.textContent.replace(/#\s*$/, '').trim() : s.id;
    return `<a class="sidebar-dot" href="#${s.id}" title="${label}"></a>`;
  }).join('');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        sidebar.querySelectorAll('.sidebar-dot').forEach(dot =>
          dot.classList.toggle('active', dot.getAttribute('href') === '#' + entry.target.id)
        );
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ===== BURGER MENU ===== */
function toggleMobileNav() {
  document.querySelector('.navbar-links').classList.toggle('open');
}

/* ===== ANCHOR LINKS ===== */
function initAnchorLinks() {
  document.querySelectorAll('section[id] .section-header').forEach(header => {
    const section = header.closest('section[id]');
    const titleEl = header.querySelector('.section-title');
    if (!titleEl) return;
    const btn = document.createElement('button');
    btn.className = 'anchor-btn';
    btn.textContent = '#';
    btn.title = 'Copier le lien';
    btn.addEventListener('click', () => {
      const url = location.origin + location.pathname + '#' + section.id;
      navigator.clipboard.writeText(url).then(() => showToast('Lien copie !'));
    });
    titleEl.appendChild(btn);
  });
}

/* ===== PS1 SYNTAX HIGHLIGHT ===== */
function highlightPS1(el) {
  if (el.querySelector('span')) return;
  let h = el.innerHTML;
  // comments
  h = h.replace(/(#[^\n<]*)/g, '<span class="ps1-comment">$1</span>');
  // strings double quotes
  h = h.replace(/"([^"<\n]*)"/g, '"<span class="ps1-string">$1</span>"');
  // strings single quotes
  h = h.replace(/'([^'<\n]*)'/g, '\'<span class="ps1-string">$1</span>\'');
  // cmdlets (PascalCase-with-dash, e.g. Copy-Item)
  h = h.replace(/\b([A-Z][a-z]+-[A-Z][a-zA-Z]+)\b/g, '<span class="ps1-cmd">$1</span>');
  // variables
  h = h.replace(/(\$[\w]+)/g, '<span class="ps1-var">$1</span>');
  // keywords
  ['function','param','if','else','elseif','foreach','while','return','begin','process','end'].forEach(kw => {
    h = h.replace(new RegExp('\\b(' + kw + ')\\b', 'gi'), '<span class="ps1-kw">$1</span>');
  });
  el.innerHTML = h;
}

function initPS1Highlight() {
  document.querySelectorAll('.code-block').forEach(block => {
    const langEl = block.querySelector('.code-lang');
    if (!langEl) return;
    const lang = langEl.textContent.toLowerCase().trim();
    if (lang !== 'powershell' && lang !== 'ps1') return;
    const codeEl = block.querySelector('pre code');
    if (codeEl) highlightPS1(codeEl);
  });
}

/* ===== SEARCH CTRL+K ===== */
const SEARCH_DATA = [
  { label: 'Guide complet d\'installation', href: 'guide.html', type: 'page' },
  { label: 'Comprendre Claude : IA, histoire, modèles', href: 'claude.html', type: 'page' },
  { label: '01 · Installer Claude CLI', href: 'guide.html#installation', type: 'section' },
  { label: '02 · Kit global d\'installation', href: 'guide.html#kit-installation', type: 'section' },
  { label: '03 · Nouveau projet', href: 'guide.html#nouveau-projet', type: 'section' },
  { label: '04 · CLAUDE.md : configuration', href: 'guide.html#claudemd', type: 'section' },
  { label: '05 · Commandes PowerShell', href: 'guide.html#commandes-ps', type: 'section' },
  { label: '06 · Skills et slash commands', href: 'guide.html#skills', type: 'section' },
  { label: '07 · Sous-agents', href: 'guide.html#sous-agents', type: 'section' },
  { label: '08 · Raccourcis clavier', href: 'guide.html#raccourcis', type: 'section' },
  { label: '09 · Workflow recommandé', href: 'guide.html#workflow', type: 'section' },
  { label: '10 · Prompts utiles', href: 'guide.html#prompts', type: 'section' },
  { label: '11 · Téléchargements', href: 'guide.html#telechargements', type: 'section' },
  { label: '12 · Problèmes fréquents', href: 'guide.html#troubleshooting', type: 'section' },
  { label: 'npm install -g @anthropic-ai/claude-code', href: 'guide.html#installation', type: 'commande' },
  { label: 'claude login', href: 'guide.html#installation', type: 'commande' },
  { label: 'nouveau-projet', href: 'guide.html#kit-installation', type: 'commande' },
  { label: 'claude --dangerously-skip-permissions', href: 'guide.html#commandes-ps', type: 'commande' },
  { label: 'claude --continue / -c', href: 'guide.html#commandes-ps', type: 'commande' },
  { label: '/reset : réinitialiser le contexte', href: 'guide.html#skills', type: 'commande' },
  { label: '/route : router une tâche', href: 'guide.html#skills', type: 'commande' },
  { label: 'CLAUDE.md : instructions projet', href: 'guide.html#claudemd', type: 'config' },
  { label: 'settings.json : permissions et hooks', href: 'guide.html#kit-installation', type: 'config' },
  { label: 'tasks/todo.md', href: 'guide.html#nouveau-projet', type: 'config' },
  { label: 'tasks/lessons.md', href: 'guide.html#nouveau-projet', type: 'config' },
  { label: 'tasks/session-log.md', href: 'guide.html#nouveau-projet', type: 'config' },
  { label: 'Télécharger student-kit.zip', href: 'guide.html#telechargements', type: 'download' },
  { label: 'Télécharger claude-profile.ps1', href: 'guide.html#telechargements', type: 'download' },
  { label: 'Télécharger CLAUDE.md', href: 'guide.html#telechargements', type: 'download' },
];

let _searchActive = -1;

function buildSearchIndex() {
  document.querySelectorAll('section[id]').forEach(s => {
    const titleEl = s.querySelector('.section-title');
    if (!titleEl) return;
    const href = '#' + s.id;
    if (!SEARCH_DATA.find(d => d.href === href)) {
      SEARCH_DATA.unshift({ label: titleEl.textContent.trim(), href, type: 'section' });
    }
  });
}

function openSearch() {
  document.getElementById('search-overlay').classList.add('open');
  const input = document.getElementById('search-input');
  input.value = '';
  input.focus();
  renderSearch('');
  _searchActive = -1;
}

function closeSearchForce() {
  const el = document.getElementById('search-overlay');
  if (el) el.classList.remove('open');
}

function renderSearch(q) {
  const list = document.getElementById('search-results');
  if (!list) return;
  const results = q.trim()
    ? SEARCH_DATA.filter(d => d.label.toLowerCase().includes(q.toLowerCase()))
    : SEARCH_DATA.slice(0, 9);
  if (!results.length) {
    list.innerHTML = '<div class="search-empty">Aucun résultat pour "' + q + '"</div>';
    return;
  }
  list.innerHTML = results.map(r =>
    `<a class="search-result-item" href="${r.href}" onclick="closeSearchForce()">
      <span class="result-type ${r.type}">${r.type}</span>
      <span class="result-label">${r.label}</span>
    </a>`
  ).join('');
  _searchActive = -1;
}

function initSearch() {
  buildSearchIndex();
  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('search-input');
  if (!overlay || !input) return;

  overlay.addEventListener('click', e => { if (e.target === overlay) closeSearchForce(); });

  input.addEventListener('input', e => { renderSearch(e.target.value); _searchActive = -1; });

  input.addEventListener('keydown', e => {
    const items = document.querySelectorAll('.search-result-item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      _searchActive = Math.min(_searchActive + 1, items.length - 1);
      items.forEach((el, i) => el.classList.toggle('active', i === _searchActive));
      if (items[_searchActive]) items[_searchActive].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      _searchActive = Math.max(_searchActive - 1, 0);
      items.forEach((el, i) => el.classList.toggle('active', i === _searchActive));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = _searchActive >= 0 ? items[_searchActive] : items[0];
      if (target) target.click();
    } else if (e.key === 'Escape') {
      closeSearchForce();
    }
  });

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
    else if (e.key === 'Escape' && overlay.classList.contains('open')) closeSearchForce();
  });
}

/* ===== CHEAT SHEET ===== */
function toggleCheatsheet() {
  const panel = document.getElementById('cheatsheet-panel');
  if (panel) panel.classList.toggle('open');
}

/* ===== WIZARD MODE ===== */
const WIZARD_STEPS = [
  { num: '01', title: 'Vérifier Node.js', desc: ['Ouvre PowerShell', 'Tape <code>node --version</code>', 'Si erreur → télécharge Node.js LTS sur nodejs.org'], anchor: 'guide.html#installation' },
  { num: '02', title: 'Installer Claude Code', desc: ['Tape <code>npm install -g @anthropic-ai/claude-code</code>', 'Attends la fin de l\'installation (~1 min)', 'Vérifie avec <code>claude --version</code>'], anchor: 'guide.html#installation' },
  { num: '03', title: 'Se connecter à Claude', desc: ['Tape <code>claude login</code>', 'Une page s\'ouvre dans le navigateur', 'Connecte-toi avec ton compte Anthropic'], anchor: 'guide.html#installation' },
  { num: '04', title: 'Installer le kit global', desc: ['Télécharge <strong>student-kit.zip</strong>', 'Copie les fichiers dans <code>C:\\Users\\TOI\\.claude\\</code>', 'Lance <code>nouveau-projet</code> pour tester'], anchor: 'guide.html#kit-installation' },
  { num: '05', title: 'Créer un nouveau projet', desc: ['Va dans ton dossier projet', 'Lance <code>nouveau-projet</code>', 'Vérifie que <code>CLAUDE.md</code> et <code>tasks/</code> existent'], anchor: 'guide.html#nouveau-projet' },
  { num: '06', title: 'Configurer CLAUDE.md', desc: ['Ouvre <code>CLAUDE.md</code> à la racine', 'Adapte la section PROJET à ton stack', 'Ajoute tes règles de code si besoin'], anchor: 'guide.html#claudemd' },
  { num: '07', title: 'Apprendre les commandes', desc: ['<code>claude -c</code> : reprendre la session', '<code>claude --dangerously-skip-permissions</code> : mode autonome', 'Utilise les alias PowerShell du profil'], anchor: 'guide.html#commandes-ps' },
  { num: '08', title: 'Utiliser les skills', desc: ['<code>/route</code> : router une tâche vers un agent', 'Skills stockés dans <code>.claude/commands/</code>', 'Crée tes propres <code>.md</code> pour automatiser'], anchor: 'guide.html#skills' },
];

let _wizardStep = 0;

function openWizard() {
  _wizardStep = 0;
  document.getElementById('wizard-overlay').classList.add('open');
  renderWizard();
}

function closeWizard() {
  document.getElementById('wizard-overlay').classList.remove('open');
}

function renderWizard() {
  const step = WIZARD_STEPS[_wizardStep];
  const total = WIZARD_STEPS.length;
  document.getElementById('wizard-fill').style.width = ((_wizardStep + 1) / total * 100) + '%';
  document.getElementById('wizard-count').textContent = (_wizardStep + 1) + ' / ' + total;
  const prevBtn = document.getElementById('wizard-prev');
  const nextBtn = document.getElementById('wizard-next');
  if (prevBtn) prevBtn.disabled = _wizardStep === 0;
  if (nextBtn) nextBtn.textContent = _wizardStep === total - 1 ? 'Termine' : 'Suivant →';
  document.getElementById('wizard-body').innerHTML = `
    <div class="wizard-step-num">ÉTAPE ${step.num} · ${total} AU TOTAL</div>
    <div class="wizard-step-title">${step.title}</div>
    <div class="wizard-step-desc"><ul>${step.desc.map(d => '<li>' + d + '</li>').join('')}</ul></div>
    <a class="wizard-goto" href="${step.anchor}" onclick="closeWizard()">↗ Voir dans le guide</a>
  `;
}

function wizardNext() {
  if (_wizardStep < WIZARD_STEPS.length - 1) { _wizardStep++; renderWizard(); }
  else closeWizard();
}

function wizardPrev() {
  if (_wizardStep > 0) { _wizardStep--; renderWizard(); }
}

/* ===== DARK / LIGHT THEME ===== */
function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = saved === 'dark' ? 'Clair' : 'Sombre';
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = next === 'dark' ? 'Clair' : 'Sombre';
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCustomCursor();
  initRightSidebar();
  initSearch();
  initAnchorLinks();
  initPS1Highlight();
  setTimeout(typeTerminal, 800);
  activerLiensActifs();
  initChecklist();
  initCardTilt();
  initEntranceAnimations();
  initRetourNavigation();
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();
});
