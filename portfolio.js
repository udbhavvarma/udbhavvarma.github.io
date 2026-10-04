/* Enhancements use local illustrative data; no account or delivery is created. */
/* Event-driven motion: no idle render loop, no scroll interception. */
(() => {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const portrait = hero.querySelector('.hero-portrait');
  const targets = [...document.querySelectorAll('.workbench-heading, .story-picker, .decision-board, .skills-path article, .principles-heading, .principles-list details, .contact-finale')];
  let frame = 0;
  let observer;
  let pointerX = 0;
  let pointerY = 0;
  const clamp = value => Math.max(0, Math.min(1, value));

  function render() {
    frame = 0;
    if (preference.matches || document.hidden) return;
    // Read geometry before writing styles to avoid repeated layouts per frame.
    const rect = hero.getBoundingClientRect();
    const viewHeight = innerHeight;
    const progress = clamp(-rect.top / Math.max(1, rect.height * .65));
    if (rect.bottom > 0 && rect.top < viewHeight) {
      const strength = innerWidth > 700 ? 1 : .35;
      hero.style.setProperty('--title-drift', `${-32 * progress * strength}px`);
      hero.style.setProperty('--portrait-drift', `${40 * progress * strength}px`);
      hero.style.setProperty('--exhibit-drift', `${20 * (1 - progress) * strength}px`);
      hero.style.setProperty('--exhibit-scale', String(1 - .025 * (1 - progress) * strength));
      portrait.style.setProperty('--portrait-rx', `${-pointerY * 3}deg`);
      portrait.style.setProperty('--portrait-ry', `${pointerX * 4}deg`);
      portrait.style.setProperty('--frame-x', `${pointerX * 5}px`);
      portrait.style.setProperty('--frame-y', `${pointerY * 5}px`);
      portrait.style.setProperty('--shine-x', `${50 + pointerX * 50}%`);
      portrait.style.setProperty('--shine-y', `${50 + pointerY * 50}%`);
    }
  }

  function schedule() {
    if (!frame && !preference.matches && !document.hidden) frame = requestAnimationFrame(render);
  }

  function configure() {
    observer?.disconnect();
    cancelAnimationFrame(frame);
    frame = 0;
    document.documentElement.classList.toggle('motion-active', !preference.matches);
    if (preference.matches) return;
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('motion-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold:0, rootMargin:'0px 0px -35px 0px' });
    targets.forEach((target, index) => {
      target.dataset.motionReveal = '';
      target.style.setProperty('--reveal-delay', `${(index % 3) * 65}ms`);
      // Content already on screen stays visible, including restored anchor positions.
      if (target.getBoundingClientRect().top < innerHeight - 35) target.classList.add('motion-visible');
      observer.observe(target);
    });
    schedule();
  }

  portrait.addEventListener('pointermove', event => {
    if (preference.matches || !finePointer.matches) return;
    const rect = portrait.getBoundingClientRect();
    pointerX = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
    pointerY = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
    schedule();
  }, { passive:true });
  portrait.addEventListener('pointerleave', () => { pointerX = pointerY = 0; schedule(); });
  addEventListener('scroll', schedule, { passive:true });
  addEventListener('resize', schedule, { passive:true });
  document.addEventListener('visibilitychange', schedule);
  preference.addEventListener('change', configure);
  configure();
})();

(() => {
  const menu = document.querySelector('.mobile-navigation');
  menu.addEventListener('click', event => {
    if (event.target.closest('a')) menu.open = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
  document.addEventListener('click', event => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });

  const permissionStates = {
    waiting: ['Rider waiting. Collector ready.', 'The OTP went to someone who cannot respond. The parcel cannot be handed over yet.'],
    planned: ['Arrange collection before arrival.', 'Choose a trusted collector in advance. Completing an OTP-free handoff still requires a courier-approved verification route; that integration is pending.'],
  };
  const permissionButtons = [...document.querySelectorAll('[data-permission]')];
  permissionButtons.forEach(button => button.addEventListener('click', () => {
    const state = button.dataset.permission;
    const [title, explanation] = permissionStates[state];
    document.getElementById('handoff-status').textContent = title;
    document.getElementById('handoff-explanation').textContent = explanation;
    document.querySelector('.handoff-result').dataset.state = state;
    permissionButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  }));

})();

/* Each chapter is an editorial reconstruction, not a live product session. */
(() => {
  const stories = {
    'auxiliaire': {
      name: 'Auxiliaire', chapters: [
        ['The meeting ends. The context scatters.', 'A decision lives in a conversation, its follow-up in a task list. Later, the reason behind it is hard to recover.', 'The opening', 'Keep the reason attached to the next step.', 'Meeting notes', '“Let’s go with the second option.”', [['The missing piece', 'What did we decide—and why?']]],
        ['A summary is not a decision.', 'I chose to preserve the original capture and suggest structured actions beside it. A person reviews what should become part of the product’s memory.', 'The tradeoff', 'An extra review step buys a chance to catch a wrong interpretation.', 'A product decision', 'Suggest. Link. Let a person decide.', [['Preserve', 'Original words + source'], ['Propose', 'An action, not an automatic commitment']]],
        ['Give the next step a memory.', 'Speech-to-text and LLM extraction turn a capture into reviewable suggestions. Accepted actions stay linked to their source.', 'Built today', 'Capture → suggestion → review → linked action.', 'A reviewable suggestion', 'Send the pricing brief.', [['Source', 'The original meeting capture'], ['Review', 'Edit or accept before saving']]],
        ['Useful extraction needs a better test.', 'I’d measure whether suggested actions are accepted, edited, or rejected, then use evaluation cases and traces to investigate the failures.', 'Next test · not a reported result', 'Does the suggestion preserve intent, not just sound plausible?', 'An evaluation plan', 'Right words. Right next step?', [['Inspect', 'Missing context · wrong action · duplicate'], ['Compare', 'Suggestion quality before and after a change']]],
      ],
    },
    'low-cortisol': {
      name: 'Low Cortisol UX', chapters: [
        ['The form disappears. The work was real.', 'A portal times out halfway through a form. The person returns to an empty screen and has to repeat the same work.', 'The opening', 'A session ending should not mean effort disappearing.', 'An interrupted form', 'Session expired.', [['Already done', 'Details entered. Documents prepared.'], ['What remains', 'Start again.']]],
        ['Improve the layer people already use.', 'I cannot redesign every portal. I can build a browser companion that preserves progress and helps people prepare what the portal needs.', 'The tradeoff', 'Portal-specific adapters need care as the underlying pages change.', 'A product decision', 'Work around the friction.', [['Keep', 'The existing portal'], ['Add', 'Local recovery + autofill + document tools']]],
        ['Leave a way back in.', 'The extension combines a local vault, portal adapters, and form assistance. Separate document tools help prepare uploads before submission.', 'Built today', 'Data stays in the browser. Passwords are excluded from saved drafts.', 'A recovery path', 'Resume the form.', [['Restore', 'Previously saved fields'], ['Prepare', 'Resize a document for upload']]],
        ['Recovery has to survive reality.', 'I’d test timeouts, changed fields, and interrupted saves across supported portals. A reassuring message is only useful if the right data comes back.', 'Next test · not a reported result', 'Can people resume accurately after an interruption?', 'A reliability checklist', 'What came back?', [['Check', 'Correct values · correct fields'], ['Watch', 'Portal changes · save failures']]],
      ],
    },
    'funauth': {
      name: 'FunAuth', chapters: [
        ['Some products start with curiosity.', 'A gesture can be familiar, expressive, and memorable. I wanted to explore what happens when a sequence of movements becomes an interface.', 'The opening', 'Make a technical interaction feel physical and playful.', 'An interaction sketch', 'A signature you can perform.', [['Try', 'A hand gesture. A wink. A sequence.']]],
        ['Make the recognition visible.', 'Uncertain recognition is frustrating when the interface stays silent. I chose step-by-step feedback and on-device processing so people can see what is happening.', 'The tradeoff', 'Clear feedback helps usability; it does not establish security.', 'A product decision', 'Show what the system sees.', [['Keep local', 'Camera processing'], ['Make visible', 'Recognized steps + hold progress']]],
        ['Turn movement into a sequence.', 'Hand and face recognition feed timed challenges. The interface shows progress through the sequence and provides a local session experience.', 'Built today', 'An experimental interaction. Production authentication needs stronger verification.', 'A sample sequence', 'One step at a time.', [['01', 'Peace sign + wink'], ['02', 'Point + raised eyebrows'], ['03', 'Fist · hold to complete']]],
        ['Can people tell why it missed?', 'I’d observe completion, retries, and where people hesitate across lighting and camera conditions. The next iteration should make recognition failures easier to recover from.', 'Next test · not a reported result', 'Separate interaction quality from the work needed for secure authentication.', 'An observation plan', 'Watch the hesitation.', [['Measure', 'Completion · retries · time per step'], ['Investigate', 'Lighting · camera · unclear feedback']]],
      ],
    },
    'delivery-delegate': {
      name: 'Delivery Delegate', chapters: [
        ['Everyone is ready. Except the OTP.', 'The rider is at the door. Someone is home to collect. But the OTP has gone to a person who cannot respond, so the handoff stalls.', 'The opening', 'The bottleneck is availability at the moment of collection.', 'At the doorstep', 'The parcel has to wait.', [['Rider', 'At the door'], ['Collector', 'Ready'], ['OTP recipient', 'Unavailable']]],
        ['Move coordination before the doorstep.', 'I built around arranging a trusted collector in advance. But a collector’s confirmation and a courier’s verification are two different requirements.', 'The dependency', 'A useful alternative needs a courier-supported verification route.', 'A product decision', 'Plan earlier. Verify properly.', [['Coordinate', 'Who will collect?'], ['Resolve with courier', 'How can that person complete verification?']]],
        ['Make the handoff plan tangible.', 'The prototype supports advance delegation, collector confirmation, and a simulated pickup. It makes the coordination flow testable before courier integration.', 'Built today', 'A prototype and sandbox handoff—not an OTP bypass.', 'The prototype flow', 'A collector is confirmed.', [['Available', 'Invite → confirm → simulate pickup'], ['Still required', 'Courier-approved verification']]],
        ['The next step is outside the UI.', 'A courier partner needs to validate an alternate collection route. Only then would I test whether planning ahead reduces waiting and repeat delivery attempts.', 'Integration pending · no measured delivery result', 'A polished screen cannot remove an operational dependency.', 'The next dependency', 'Bring the courier into the loop.', [['Validate first', 'Supported verification route'], ['Measure later', 'Handoff wait · completion · repeat attempts']]],
      ],
    },
  };
  const labels = ['The loose end', 'The decision', 'The build', 'The next question'];
  const root = document.querySelector('.story-workbench');
  if (!root) return;
  const scene = root.querySelector('.story-scene');
  const choices = [...root.querySelectorAll('[data-story]')];
  const steps = [...root.querySelectorAll('[data-story-step]')];
  const prev = document.getElementById('story-prev');
  const next = document.getElementById('story-next');
  let product = 'auxiliaire';
  let chapter = 0;
  function render() {
    const story = stories[product];
    const [title, description, noteLabel, note, artifactLabel, quote, rows] = story.chapters[chapter];
    for (const [id, value] of Object.entries({ 'story-title': title, 'story-description': description, 'story-note-label': noteLabel, 'story-note': note, 'artifact-label': artifactLabel })) document.getElementById(id).textContent = value;
    document.getElementById('story-note-label').hidden = chapter !== 3;
    const artifact = document.getElementById('artifact-body');
    artifact.replaceChildren();
    const quoteEl = document.createElement('p');
    quoteEl.className = 'artifact-quote'; quoteEl.textContent = quote; artifact.append(quoteEl);
    rows.forEach(([label, value]) => {
      const row = document.createElement('div'); row.className = 'artifact-slip';
      const small = document.createElement('span'); small.textContent = label;
      const strong = document.createElement('strong'); strong.textContent = value;
      row.append(small, strong); artifact.append(row);
    });
    document.getElementById('story-product-link').hidden = chapter === 2;
    scene.querySelector('.story-artifact').hidden = chapter === 2;
    scene.querySelector('.story-demo').hidden = chapter !== 2;
    scene.querySelectorAll('.workbench-product').forEach(panel => { panel.hidden = panel.id !== product; });
    scene.dataset.phase = chapter; scene.dataset.product = product;
    root.style.setProperty('--story-stage', chapter);
    root.style.setProperty('--story-column', chapter % 2);
    root.style.setProperty('--story-row', Math.floor(chapter / 2));
    root.dispatchEvent(new CustomEvent('portfolio:story-change', { detail: { product, chapter } }));
    choices.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.story === product)));
    steps.forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.storyStep) === chapter)));
    prev.disabled = chapter === 0; next.disabled = chapter === 3;
    next.textContent = chapter === 3 ? 'End of story ✓' : `${labels[chapter + 1]} →`;
  }
  document.getElementById('story-product-link').addEventListener('click', () => { chapter = 2; render(); steps[2].focus({preventScroll:true}); });
  choices.forEach(button => button.addEventListener('click', () => { product = button.dataset.story; chapter = 0; render(); }));
  steps.forEach(button => button.addEventListener('click', () => { chapter = Number(button.dataset.storyStep); render(); }));
  prev.addEventListener('click', () => { if (chapter > 0) { chapter--; render(); } });
  next.addEventListener('click', () => { if (chapter < 3) { chapter++; render(); } });
  document.querySelectorAll('[data-open-story]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    product = link.dataset.openStory; chapter = Number(link.dataset.openStep || 1); render();
    if (location.hash !== '#about') history.pushState(null, '', '#about');
    root.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    steps[chapter].focus({ preventScroll: true });
  }));
  function openProductHash() {
    const key = location.hash.slice(1);
    if (!stories[key]) return;
    product = key; chapter = 2; render();
    requestAnimationFrame(() => root.scrollIntoView({block:'start',behavior:'instant'}));
  }
  addEventListener('hashchange', openProductHash);
  render();
  openProductHash();
})();

(() => {
  const panels = { work: document.getElementById('exhibit-work'), terminal: document.getElementById('exhibit-terminal') };
  const switches = [...document.querySelectorAll('[data-exhibit]')];
  function showExhibit(name) {
    Object.entries(panels).forEach(([key, panel]) => { panel.hidden = key !== name; });
    switches.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.exhibit === name)));
  }
  switches.forEach(button => button.addEventListener('click', () => showExhibit(button.dataset.exhibit)));
  // Terminal commands elsewhere can still bring the original terminal into view.
  document.querySelectorAll('.palette-options [data-command]').forEach(button => button.addEventListener('click', () => {
    if (['theme cyberpunk', 'surprise me'].includes(button.dataset.command)) showExhibit('terminal');
  }));
  const cards = {
    'auxiliaire': ['Auxiliaire', 'What if decisions had a memory?', 'A conversation', 'A next step', 'Working product', '#e4ecc8'],
    'low-cortisol': ['Low Cortisol UX', 'Why fill the same form twice?', 'An interruption', 'A way back', 'Browser companion', '#ded4ef'],
    'funauth': ['FunAuth', 'What if a gesture was your signature?', 'A movement', 'An interaction', 'An experiment', '#f0d4c5'],
    'delivery-delegate': ['Delivery Delegate', 'Someone is home. So why can’t the parcel stay?', 'An absent OTP', 'A handoff plan', 'Prototype', '#ece0ba'],
  };
  const card = document.querySelector('.hero-specimen');
  const specimenButtons = [...document.querySelectorAll('[data-specimen]')];
  specimenButtons.forEach((button, index) => button.addEventListener('click', () => {
    const key = button.dataset.specimen;
    const [name, question, from, to, state, color] = cards[key];
    for (const [id, value] of Object.entries({ 'specimen-name': name, 'specimen-question': question, 'specimen-node-one': from, 'specimen-node-two': to })) document.getElementById(id).textContent = value;
    card.dataset.openStory = key;
    card.style.setProperty('--specimen-paper', color);
    specimenButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    card.dispatchEvent(new CustomEvent('portfolio:card-change', { detail: { index } }));
  }));
  const links = [...document.querySelectorAll('.chapter-dock a')];
  const sections = links.map(link => document.querySelector(link.hash));
  const dock = document.querySelector('.chapter-dock');
  let scheduled = false;

  /* Apple Liquid Glass — Section Accent & Backdrop Detection */
  const sectionAccents = {
    'hero': {
      accent: '#c7ff3d',
      tint: 'rgba(199, 255, 61, 0.08)',
      border: 'rgba(199, 255, 61, 0.28)',
      pill: 'rgba(199, 255, 61, 0.16)',
      text: '#c7ff3d',
      glow: 'rgba(199, 255, 61, 0.20)'
    },
    'about': {
      accent: '#c5b5ff',
      tint: 'rgba(197, 181, 255, 0.08)',
      border: 'rgba(197, 181, 255, 0.28)',
      pill: 'rgba(197, 181, 255, 0.16)',
      text: '#c5b5ff',
      glow: 'rgba(197, 181, 255, 0.20)'
    },
    'skills': {
      accent: '#91caff',
      tint: 'rgba(145, 202, 255, 0.08)',
      border: 'rgba(145, 202, 255, 0.28)',
      pill: 'rgba(145, 202, 255, 0.16)',
      text: '#91caff',
      glow: 'rgba(145, 202, 255, 0.20)'
    },
    'experience': {
      accent: '#ffd36a',
      tint: 'rgba(255, 211, 106, 0.08)',
      border: 'rgba(255, 211, 106, 0.28)',
      pill: 'rgba(255, 211, 106, 0.16)',
      text: '#ffd36a',
      glow: 'rgba(255, 211, 106, 0.20)'
    },
    'principles': {
      accent: '#ff8a70',
      tint: 'rgba(255, 138, 112, 0.08)',
      border: 'rgba(255, 138, 112, 0.28)',
      pill: 'rgba(255, 138, 112, 0.16)',
      text: '#ff8a70',
      glow: 'rgba(255, 138, 112, 0.20)'
    },
    'contact': {
      accent: '#c7ff3d',
      tint: 'rgba(199, 255, 61, 0.08)',
      border: 'rgba(199, 255, 61, 0.28)',
      pill: 'rgba(199, 255, 61, 0.16)',
      text: '#c7ff3d',
      glow: 'rgba(199, 255, 61, 0.20)'
    }
  };
  const defaultAccent = sectionAccents['hero'];
  let currentSectionId = '';
  let currentBackdrop = '';

  function detectBackdropTheme() {
    if (!dock) return 'dark';
    const rect = dock.getBoundingClientRect();
    const samplePoints = [
      { x: rect.left + rect.width * 0.2, y: rect.top + rect.height * 0.5 },
      { x: rect.left + rect.width * 0.5, y: rect.top + rect.height * 0.5 },
      { x: rect.left + rect.width * 0.8, y: rect.top + rect.height * 0.5 }
    ];

    let lightCount = 0;
    for (const pt of samplePoints) {
      const x = Math.max(5, Math.min(window.innerWidth - 5, pt.x));
      const y = Math.max(5, Math.min(window.innerHeight - 5, pt.y));
      const elements = document.elementsFromPoint(x, y);

      for (const el of elements) {
        if (el === dock || dock.contains(el)) continue;

        if (el.closest('.story-workbench, #about, #contact, .contact-finale, .hero-specimen, .story-artifact, .decision-board, .story-scene, .light-theme, [data-theme="light"]')) {
          lightCount++;
          break;
        }

        const bg = window.getComputedStyle(el).backgroundColor;
        if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
          const rgb = bg.match(/\d+/g);
          if (rgb && rgb.length >= 3) {
            const r = Number(rgb[0]), g = Number(rgb[1]), b = Number(rgb[2]);
            const a = rgb.length >= 4 ? Number(rgb[3]) : 1;
            if (a > 0.4) {
              const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
              if (lum > 0.52) lightCount++;
              break;
            }
          }
        }
      }
    }

    return lightCount >= 2 ? 'light' : 'dark';
  }

  function updateChapter() {
    if (!dock) return;

    let active = sections[0];
    const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
    if (isAtBottom && sections.length > 0) {
      active = sections[sections.length - 1];
    } else {
      for (const section of sections) {
        if (section && section.getBoundingClientRect().top < innerHeight * 0.45) {
          active = section;
        }
      }
    }

    if (active) {
      links.forEach(link => {
        if (link.hash === '#' + active.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });

      if (active.id !== currentSectionId) {
        currentSectionId = active.id;
        const config = sectionAccents[active.id] || defaultAccent;
        dock.style.setProperty('--glass-accent', config.accent);
        dock.style.setProperty('--glass-tint', config.tint);
        dock.style.setProperty('--glass-border', config.border);
        dock.style.setProperty('--glass-pill', config.pill);
        dock.style.setProperty('--glass-text', config.text);
        dock.style.setProperty('--glass-glow', config.glow);
      }
    }

    const backdrop = detectBackdropTheme();
    if (backdrop !== currentBackdrop) {
      currentBackdrop = backdrop;
      dock.setAttribute('data-backdrop', backdrop);
    }

    scheduled = false;
  }

  addEventListener('scroll', () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateChapter);
    }
  }, { passive: true });
  addEventListener('resize', () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateChapter);
    }
  }, { passive: true });
  updateChapter();
})();

(() => {
  const button = document.getElementById('copy-email');
  const status = document.getElementById('copy-email-status');
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('varmaudbhav03@gmail.com');
      status.textContent = 'Email address copied.';
    } catch {
      status.textContent = 'Could not copy automatically. Select the address above, or use the email link.';
    }
  });
})();
