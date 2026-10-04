/* Page-wide motion. All decorations are inert; native scrolling and controls stay in charge. */
(() => {
  const main = document.querySelector('main');
  if (!main) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const stack = document.querySelector('.specimen-stack');
  const card = document.querySelector('.hero-specimen');
  const skills = [...document.querySelectorAll('.skills-path article')];
  const trackedAnimations = new Set();
  const counters = [];
  const pixelLayers = new Set();
  let typingFrame = 0;
  let finishTyping = () => {};
  let frame = 0;
  let pointer = { x:0, y:0 };
  const clamp = value => Math.max(0, Math.min(1, value));
  function animate(element, frames, options = {}) {
    if (!element || reduced.matches || document.hidden) return;
    element.getAnimations().forEach(animation => animation.cancel());
    const animation = element.animate(frames, { duration:620, easing:'cubic-bezier(.16,1,.3,1)', ...options });
    trackedAnimations.add(animation);
    const release = () => trackedAnimations.delete(animation);
    animation.onfinish = release;
    animation.oncancel = release;
    return animation;
  }

  // Small, finite tile reveals keep the pixels inside the object being introduced.
  function revealPixels(surface, columns, rows) {
    if (reduced.matches || document.hidden) return;
    const previous = surface.querySelector(':scope > .pixel-reveal');
    if (previous) {
      previous.querySelectorAll('i').forEach(tile => tile.getAnimations().forEach(animation => animation.cancel()));
      previous.remove(); pixelLayers.delete(previous);
    }
    const layer = document.createElement('span');
    layer.className = 'pixel-reveal'; layer.setAttribute('aria-hidden','true');
    layer.style.setProperty('--pixel-columns', columns);
    layer.style.setProperty('--pixel-rows', rows);
    surface.classList.add('pixel-surface');
    surface.append(layer); pixelLayers.add(layer);
    const effects = [];
    for (let index = 0; index < columns * rows; index++) {
      const tile = document.createElement('i');
      tile.style.setProperty('--tile-color', index % 17 === 0 ? '#c7ff3d' : index % 11 === 0 ? '#c5b5ff' : '#17241e');
      layer.append(tile);
      const delay = (Math.floor(index / columns) + index % columns) * 22 + (index * 37 % 90);
      effects.push(animate(tile, [{opacity:1,transform:'scale(1.02)'},{opacity:0,transform:'scale(.15)'}], {duration:260,delay,easing:'steps(3,end)',fill:'backwards'}));
    }
    Promise.all(effects.map(effect => effect.finished.catch(() => {}))).then(() => {layer.remove(); pixelLayers.delete(layer);});
  }

  const intro = document.querySelector('.intro-description strong');
  function typeIntroduction() {
    if (!intro || reduced.matches || document.hidden) return;
    const text = intro.textContent;
    const source = document.createElement('span');
    source.className = 'typewriter-source'; source.textContent = text;
    const output = document.createElement('span');
    output.className = 'typewriter-output'; output.setAttribute('aria-hidden','true');
    intro.replaceChildren(source,output); intro.classList.add('typewriter','is-typing');
    let start;
    finishTyping = () => {
      cancelAnimationFrame(typingFrame); typingFrame = 0;
      output.textContent = text; intro.classList.remove('is-typing');
    };
    const tick = time => {
      start ??= time;
      const characters = Math.min(text.length, Math.floor((time - start) / 30));
      output.textContent = text.slice(0, characters);
      if (characters < text.length) typingFrame = requestAnimationFrame(tick);
      else finishTyping();
    };
    typingFrame = requestAnimationFrame(tick);
  }
  const entrance = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entrance.unobserve(entry.target);
      if (entry.target === intro) typeIntroduction();
      else revealPixels(entry.target,8,12);
    });
  }, {threshold:.35});
  if (intro) entrance.observe(intro);
  const portrait = document.querySelector('.hero-portrait');
  const photo = portrait?.querySelector('img');
  if (photo?.complete && photo.naturalWidth) entrance.observe(portrait);
  else photo?.addEventListener('load', () => entrance.observe(portrait), {once:true});

  function render() {
    frame = 0;
    if (document.hidden) return;
    if (reduced.matches) return;
    const stackRect = stack.getBoundingClientRect();
    const skillRects = skills.map(skill => skill.getBoundingClientRect());
    const spread = clamp((innerHeight - stackRect.top) / (innerHeight * .8));
    stack.style.setProperty('--deck-spread', spread);
    stack.style.setProperty('--deck-rx', `${-pointer.y * 2}deg`);
    stack.style.setProperty('--deck-ry', `${pointer.x * 3}deg`);
    stack.style.setProperty('--deck-light-x', `${50 + pointer.x * 50}%`);
    stack.style.setProperty('--deck-light-y', `${50 + pointer.y * 50}%`);
    const closest = skillRects.reduce((best, rect, index) => Math.abs(rect.top + rect.height / 2 - innerHeight * .48) < best.distance ? {index, distance:Math.abs(rect.top + rect.height / 2 - innerHeight * .48)} : best, {index:-1, distance:Infinity});
    skills.forEach((skill, index) => {
      skill.classList.toggle('reading-now', index === closest.index && skillRects[index].top < innerHeight && skillRects[index].bottom > 0);
    });
  }
  function schedule() { if (!frame && !document.hidden) frame = requestAnimationFrame(render); }
  addEventListener('scroll', () => { if (!reduced.matches) schedule(); }, {passive:true});
  addEventListener('resize', schedule, {passive:true});

  stack.addEventListener('pointermove', event => {
    if (reduced.matches || !fine.matches) return;
    const rect = stack.getBoundingClientRect();
    pointer = {x:Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1)), y:Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1))};
    schedule();
  }, {passive:true});
  stack.addEventListener('pointerleave', () => { pointer = {x:0,y:0}; schedule(); });
  let previousCard = 0;
  card.addEventListener('portfolio:card-change', event => {
    const direction = event.detail.index >= previousCard ? 1 : -1;
    previousCard = event.detail.index;
    revealPixels(card,12,8);
    animate(card.querySelector('.specimen-question'), [{opacity:.4, transform:`translateX(${direction * 10}px)`}, {opacity:1, transform:'none'}], {duration:400});
    animate(card.querySelector('.specimen-drawing'), [{opacity:0, transform:'translateY(14px)'}, {opacity:1, transform:'none'}], {delay:80});
  });

  const workbench = document.querySelector('.story-workbench');
  let previousChapter = 0;
  workbench.addEventListener('portfolio:story-change', event => {
    const direction = event.detail.chapter >= previousChapter ? 1 : -1;
    previousChapter = event.detail.chapter;
    const scene = workbench.querySelector('.story-scene');
    const artifact = scene.querySelector('.story-artifact');
    if (!artifact.hidden) animate(artifact, [{opacity:0, transform:`translateX(${direction * -24}px) rotate(-5deg)`}, {opacity:1, transform:'rotate(-2deg)'}]);
    const narrative = scene.querySelector('.story-narrative');
    [...narrative.children].forEach((element, index) => animate(element, [{opacity:0, transform:`translateX(${direction * 20}px)`}, {opacity:1, transform:'none'}], {delay:index * 45}));
    if (!scene.querySelector('.story-demo').hidden) animate(scene.querySelector('.story-demo'), [{opacity:0, transform:'translateY(20px) scale(.98)'}, {opacity:1, transform:'none'}]);
  });

  document.querySelectorAll('.principles-list details, .outcome-ledger details').forEach(details => {
    details.addEventListener('toggle', () => {
      if (details.open) [...details.children].filter(child => child.tagName !== 'SUMMARY').forEach((child, index) => animate(child, [{opacity:0, transform:'translateY(-8px)'}, {opacity:1, transform:'none'}], {duration:420, delay:index * 45}));
    });
  });

  // The accessible number stays exact throughout the decorative count-up.
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      countObserver.unobserve(entry.target);
      const counter = counters.find(item => item.element === entry.target);
      if (reduced.matches || document.hidden) return;
      let start;
      const tick = time => {
        start ??= time;
        const progress = clamp((time - start) / 950);
        counter.visual.textContent = (counter.value * (1 - Math.pow(1 - progress, 3))).toFixed(counter.decimals) + counter.suffix;
        if (progress < 1) counter.frame = requestAnimationFrame(tick);
        else { counter.visual.textContent = counter.label; counter.frame = 0; }
      };
      counter.frame = requestAnimationFrame(tick);
    });
  }, {threshold:.7});
  document.querySelectorAll('.outcome-ledger summary > strong').forEach(element => {
    const label = element.textContent.trim();
    const number = label.match(/^([\d.]+)(.*)$/);
    if (!number) return;
    const accessible = document.createElement('span');
    accessible.className = 'motion-sr-only'; accessible.textContent = label;
    const visual = document.createElement('span');
    visual.setAttribute('aria-hidden','true'); visual.textContent = label;
    element.replaceChildren(accessible, visual);
    counters.push({element,visual,label,value:Number(number[1]),decimals:number[1].includes('.')?1:0,suffix:number[2],frame:0});
    countObserver.observe(element);
  });

  function stopTransientMotion() {
    finishTyping();
    trackedAnimations.forEach(animation => animation.cancel());
    trackedAnimations.clear();
    pixelLayers.forEach(layer => layer.remove()); pixelLayers.clear();
    counters.forEach(counter => { cancelAnimationFrame(counter.frame); counter.frame = 0; counter.visual.textContent = counter.label; });
  }
  reduced.addEventListener('change', () => { stopTransientMotion(); pointer={x:0,y:0}; schedule(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopTransientMotion(); else schedule(); });
  schedule();
})();
