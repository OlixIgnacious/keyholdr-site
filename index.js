/* ============================================================
   Keyholdr site — reveals, header theming, live demo
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initReveals();
  initHeaderTheme();
  initTicker();
  initClock();
  initDemo();
  initDownloadMenus();
  initCodeCopyButtons();
});

/* ---- Docs: "Copy" button on every command block ---- */

function initCodeCopyButtons() {
  document.querySelectorAll('.docs-section pre > code').forEach((code) => {
    const pre = code.parentElement;
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    wrapper.insertBefore(btn, pre);

    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.textContent);
        const original = btn.textContent;
        btn.textContent = 'Copied ✓';
        btn.dataset.copied = 'true';
        setTimeout(() => {
          btn.textContent = original;
          delete btn.dataset.copied;
        }, 1800);
      } catch {
        // Clipboard unavailable — command remains selectable manually.
      }
    });
  });
}

/* ---- Scroll reveals ---- */

function initReveals() {
  const targets = document.querySelectorAll('.reveal, .hero-title, .cta-title');
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  targets.forEach((el) => io.observe(el));
}

/* ---- Header: swap light/dark theme to match the section behind it,
        add a blurred backdrop once scrolled ---- */

function initHeaderTheme() {
  const header = document.getElementById('site-header');
  const sections = document.querySelectorAll('[data-section-theme]');

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        document.body.dataset.theme = entry.target.dataset.sectionTheme;
      }
    }
  }, { rootMargin: '-2% 0px -97% 0px' }); // a sliver at the very top of the viewport

  sections.forEach((el) => io.observe(el));

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---- Ticker: duplicate the track so the -50% loop is seamless ---- */

function initTicker() {
  const track = document.getElementById('ticker-track');
  if (track) track.innerHTML += track.innerHTML;
}

/* ---- Menu bar clock ---- */

function initClock() {
  const clock = document.getElementById('demo-clock');
  if (!clock) return;
  const tick = () => {
    clock.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };
  tick();
  setInterval(tick, 30000);
}

/* ---- Hero demo: a KEYS | NOTES popover. Keys copy behind a mock biometric
        check; notes are plain text and copy instantly, as in the app. ---- */

const DEMO_KEYS = [
  { platform: 'OpenAI', label: 'prod · sk-proj-4Y9f…Qx', initials: 'AI' },
  { platform: 'GitHub', label: 'olix · ghp_kT72…M1', initials: 'GH' },
  { platform: 'Stripe', label: 'live · sk_live_8Hn2…vR', initials: 'ST' },
  { platform: 'AWS', label: 'deploy · AKIA…W4PZ', initials: 'AW' },
];

const DEMO_NOTES = [
  { platform: 'Standup — Fri', label: 'ship the notes tab · reply to App Review', initials: '¶' },
  { platform: 'curl staging health', label: 'curl -s https://staging.example.com/health', initials: '¶' },
  { platform: 'Call dentist', label: 'Thursday after 2pm, ask about a cleaning slot', initials: '¶' },
];

function initDemo() {
  const list = document.getElementById('demo-list');
  const search = document.getElementById('demo-search-input');
  const bio = document.getElementById('demo-bio');
  const bioText = document.getElementById('demo-bio-text');
  const tabKeys = document.getElementById('demo-tab-keys');
  const tabNotes = document.getElementById('demo-tab-notes');
  const footerHint = document.getElementById('demo-footer-hint');
  const lockText = document.getElementById('demo-lock-text');
  const shackle = document.getElementById('demo-lock-shackle');
  if (!list || !search || !bio) return;

  // Windows is hidden until testing completes — restore the platform check then:
  // const isMac = /Mac|iP(hone|ad|od)/.test(navigator.platform || '');
  // const bioMethod = isMac ? 'Touch ID' : 'Windows Hello';
  const bioMethod = 'Touch ID';
  let busy = false;
  let tab = 'keys';

  const TABS = {
    keys: {
      items: DEMO_KEYS, placeholder: 'Search keys…', empty: 'No keys match — they stay encrypted anyway.',
      hint: '⌘N to add a key', lock: 'Locked at rest', shackle: 'M8 11V8a4 4 0 0 1 8 0v3',
    },
    notes: {
      items: DEMO_NOTES, placeholder: 'Search notes…', empty: 'No notes match. ⌘N starts a new one.',
      hint: '⌘N to add a note', lock: 'Plain text', shackle: 'M8 11V8a4 4 0 0 1 7.5-1.9',
    },
  };

  function render(filter = '') {
    const view = TABS[tab];
    const q = filter.trim().toLowerCase();
    const items = view.items.filter(
      (k) => !q || k.platform.toLowerCase().includes(q) || k.label.toLowerCase().includes(q)
    );

    list.innerHTML = '';
    if (items.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'demo-empty';
      empty.textContent = view.empty;
      list.appendChild(empty);
      return;
    }

    for (const item of items) {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'demo-row';
      btn.innerHTML = `
        <span class="demo-row-icon">${item.initials}</span>
        <span class="demo-row-meta">
          <strong>${item.platform}</strong>
          <span>${item.label}</span>
        </span>
        <span class="demo-row-action">Copy</span>`;
      btn.addEventListener('click', () => (tab === 'keys' ? copyFlow(btn) : copyNote(btn)));
      li.appendChild(btn);
      list.appendChild(li);
    }
  }

  function setTab(next) {
    if (next === tab || busy) return;
    tab = next;
    const view = TABS[tab];
    tabKeys.setAttribute('aria-selected', String(tab === 'keys'));
    tabNotes.setAttribute('aria-selected', String(tab === 'notes'));
    search.placeholder = view.placeholder;
    search.value = '';
    footerHint.textContent = view.hint;
    lockText.textContent = view.lock;
    shackle.setAttribute('d', view.shackle);
    render();
  }

  // Notes are plain text: no biometric step, just the copy confirmation.
  function copyNote(row) {
    if (busy) return;
    busy = true;
    flashCopied(row);
  }

  function flashCopied(row) {
    const action = row.querySelector('.demo-row-action');
    action.textContent = 'Copied ✓';
    row.classList.add('is-copied');
    setTimeout(() => {
      action.textContent = 'Copy';
      row.classList.remove('is-copied');
      busy = false;
    }, 1400);
  }

  function copyFlow(row) {
    if (busy) return;
    busy = true;

    bioText.textContent = bioMethod;
    bio.classList.add('is-active');

    setTimeout(() => {
      bioText.textContent = 'Verified';
      setTimeout(() => {
        bio.classList.remove('is-active');
        flashCopied(row);
      }, 450);
    }, 950);
  }

  tabKeys.addEventListener('click', () => setTab('keys'));
  tabNotes.addEventListener('click', () => setTab('notes'));
  search.addEventListener('input', () => render(search.value));
  render();
}

/* ---- Download menus (hero + CTA) ---- */

function initDownloadMenus() {
  const menus = Array.from(document.querySelectorAll('.dl-menu'));
  if (!menus.length) return;

  document.addEventListener('click', (e) => {
    for (const menu of menus) {
      if (menu.open && !menu.contains(e.target)) menu.open = false;
    }
  });

  // Arm the animation in the click handler, which runs BEFORE the details
  // element opens. The toggle event fires after a painted frame, which
  // flashed the panel fully visible before the animation began.
  for (const menu of menus) {
    const pop = menu.querySelector('.dl-pop');
    const summary = menu.querySelector('summary');
    if (!pop || !summary) continue;
    summary.addEventListener('click', () => {
      if (menu.open) return; // this click is closing the menu

      // body{overflow-x:clip} guillotines anything past the viewport edge,
      // so right-anchor the panel when left-anchoring would overflow.
      const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const panelW = Math.min(28 * remPx, window.innerWidth - 2 * remPx);
      const wouldOverflow = menu.getBoundingClientRect().left + panelW > window.innerWidth - remPx;
      pop.classList.toggle('is-flipped', wouldOverflow);

      pop.classList.remove('is-rolling');
      void pop.offsetWidth; // commit the removal so the animation restarts
      pop.classList.add('is-rolling');
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') for (const menu of menus) menu.open = false;
  });

  for (const btn of document.querySelectorAll('.dl-row[data-copy]')) {
    btn.addEventListener('click', async () => {
      const hint = btn.querySelector('.dl-copy-hint');
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        if (hint) {
          hint.textContent = 'copied ✓';
          setTimeout(() => { hint.textContent = 'click to copy'; }, 1600);
        }
      } catch {
        // Clipboard unavailable — the command is visible in the row to select manually.
      }
    });
  }
}
