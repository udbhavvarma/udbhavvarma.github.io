/* One event-driven motion system. Content remains readable without JavaScript. */
(() => {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const portrait = hero.querySelector('.hero-portrait');
  const stack = hero.querySelector('.specimen-stack');
  const card = hero.querySelector('.hero-specimen');
  const targets = [...document.querySelectorAll('.experience-heading, .impact-grid details, .exp-card, .workbench-heading, .project-choice, .decision-board, .skills-path article, .principles-heading, .principles-list details, .contact-direct')];
  const animations = new Set();
  let observer;
  let frame = 0;
  let portraitPointer = {x:0, y:0};
  let deckPointer = {x:0, y:0};
  const clamp = value => Math.max(0, Math.min(1, value));

  function animate(element, frames, options = {}) {
    if (!element || reduced.matches || document.hidden) return;
    element.getAnimations().forEach(animation => animation.cancel());
    const animation = element.animate(frames, {duration:480, easing:'cubic-bezier(.16,1,.3,1)', ...options});
    animations.add(animation);
    animation.onfinish = animation.oncancel = () => animations.delete(animation);
  }

  function render() {
    frame = 0;
    if (reduced.matches || document.hidden) return;
    const rect = hero.getBoundingClientRect();
    if (rect.bottom <= 0 || rect.top >= innerHeight) return;
    const drift = clamp(-rect.top / Math.max(1,rect.height)) * (finePointer.matches ? 16 : 0);
    portrait.style.setProperty('--portrait-drift', `${drift}px`);
    portrait.style.setProperty('--portrait-rx', `${-portraitPointer.y * 2}deg`);
    portrait.style.setProperty('--portrait-ry', `${portraitPointer.x * 3}deg`);
    portrait.style.setProperty('--shine-x', `${50 + portraitPointer.x * 45}%`);
    portrait.style.setProperty('--shine-y', `${50 + portraitPointer.y * 45}%`);
    stack.style.setProperty('--deck-rx', `${-deckPointer.y * 2}deg`);
    stack.style.setProperty('--deck-ry', `${deckPointer.x * 3}deg`);
    stack.style.setProperty('--deck-light-x', `${50 + deckPointer.x * 45}%`);
    stack.style.setProperty('--deck-light-y', `${50 + deckPointer.y * 45}%`);
  }
  function schedule() {
    if (!frame && !reduced.matches && !document.hidden) frame = requestAnimationFrame(render);
  }
  function trackPointer(element, update) {
    element.addEventListener('pointermove', event => {
      if (reduced.matches || !finePointer.matches) return;
      const rect = element.getBoundingClientRect();
      update({x:clamp((event.clientX - rect.left) / rect.width) * 2 - 1, y:clamp((event.clientY - rect.top) / rect.height) * 2 - 1});
      schedule();
    }, {passive:true});
    element.addEventListener('pointerleave', () => { update({x:0, y:0}); schedule(); });
  }
  trackPointer(portrait, value => {portraitPointer = value;});
  trackPointer(stack, value => {deckPointer = value;});

  function configure() {
    observer?.disconnect();
    cancelAnimationFrame(frame); frame = 0;
    animations.forEach(animation => animation.cancel()); animations.clear();
    const enabled = !reduced.matches && 'IntersectionObserver' in window;
    document.documentElement.classList.toggle('motion-active', enabled);
    if (!enabled) return;
    observer = new IntersectionObserver(entries => {
      entries.forEach(({isIntersecting,target}) => {
        if (!isIntersecting) return;
        target.classList.add('motion-visible');
        observer.unobserve(target);
      });
    }, {threshold:0, rootMargin:'0px 0px -24px 0px'});
    targets.forEach((target,index) => {
      target.dataset.motionReveal = '';
      target.style.setProperty('--reveal-delay', `${target.matches('.impact-grid details, .project-choice') ? (index % 2) * 55 : 0}ms`);
      if (target.getBoundingClientRect().top < innerHeight - 24) target.classList.add('motion-visible');
      observer.observe(target);
    });
    schedule();
  }
  card.addEventListener('portfolio:card-change', () => {
    animate(card, [{opacity:.55,transform:'translateY(8px) rotate(.7deg)'},{opacity:1,transform:'none'}]);
  });
  document.querySelector('.story-workbench').addEventListener('portfolio:story-change', event => {
    const scene = document.querySelector('.story-scene');
    animate(scene.querySelector('.story-narrative'), [{opacity:.25,transform:'translateY(12px)'},{opacity:1,transform:'none'}]);
    const artifact = scene.querySelector(event.detail.chapter === 2 ? '.story-demo' : '.story-artifact');
    animate(artifact, [{opacity:0,translate:'0 10px'},{opacity:1,translate:'0 0'}], {duration:550});
  });
  document.querySelectorAll('.principles-list details, .outcome-ledger details').forEach(details => {
    details.addEventListener('toggle', () => {
      if (!details.open) return;
      [...details.children].filter(child => child.tagName !== 'SUMMARY').forEach(child => animate(child,[{opacity:0,transform:'translateY(-5px)'},{opacity:1,transform:'none'}],{duration:320}));
    });
  });
  document.querySelectorAll('[data-exhibit]').forEach(button => button.addEventListener('click', () => {
    const panel = document.getElementById(`exhibit-${button.dataset.exhibit}`);
    animate(panel,[{opacity:.2,transform:'translateY(8px)'},{opacity:1,transform:'none'}]);
  }));
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; animations.forEach(animation => animation.cancel()); }
    else schedule();
  });
  reduced.addEventListener('change',configure);
  finePointer.addEventListener('change', () => {portraitPointer = deckPointer = {x:0,y:0}; schedule();});
  configure();
})();
