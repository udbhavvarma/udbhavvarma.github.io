/* Page-wide motion. All decorations are inert; native scrolling and controls stay in charge. */
(() => {
  const main = document.querySelector('main');
  if (!main) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const sections = [...main.querySelectorAll(':scope > section[id]')];
  const stack = document.querySelector('.specimen-stack');
  const card = document.querySelector('.hero-specimen');
  const skills = [...document.querySelectorAll('.skills-path article')];
  const trackedAnimations = new Set();
  const counters = [];
  let frame = 0;
  let dirty = true;
  let geometry = [];
  let mainTop = 0;
  let pointer = { x:0, y:0 };
  const clamp = value => Math.max(0, Math.min(1, value));
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.classList.add('page-thread');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  main.prepend(svg);
  const colors = ['#c7ff3d', '#667345', '#91caff', '#ffd36a', '#ff8a70', '#567533'];
  const pieces = sections.map((section, index) => {
    const group = document.createElementNS(svgNS, 'g');
    group.style.color = colors[index] || '#c7ff3d';
    const track = document.createElementNS(svgNS, 'path');
    track.classList.add('thread-track');
    const ink = document.createElementNS(svgNS, 'path');
    ink.classList.add('thread-ink');
    ink.setAttribute('pathLength', '1');
    const node = document.createElementNS(svgNS, 'circle');
    node.setAttribute('r', '3');
    const tip = document.createElementNS(svgNS, 'circle');
    tip.classList.add('thread-tip'); tip.setAttribute('r', '3.5');
    group.append(track, ink, node, tip);
    svg.append(group);
    return { section, group, track, ink, node, tip, length:0 };
  });

  function animate(element, frames, options = {}) {
    if (!element || reduced.matches || document.hidden) return;
    element.getAnimations().forEach(animation => animation.cancel());
    const animation = element.animate(frames, { duration:620, easing:'cubic-bezier(.16,1,.3,1)', ...options });
    trackedAnimations.add(animation);
    const release = () => trackedAnimations.delete(animation);
    animation.onfinish = release;
    animation.oncancel = release;
  }

  function measure() {
    const rect = main.getBoundingClientRect();
    mainTop = rect.top + scrollY;
    const textLeft = Math.min(...sections.slice(1).map(section => section.querySelector('h2').getBoundingClientRect().left - rect.left));
    const x = innerWidth < 700 ? 9 : Math.max(9, textLeft - 24);
    const bend = innerWidth < 700 ? 5 : 10;
    geometry = pieces.map(({section}, index) => {
      const bounds = section.getBoundingClientRect();
      const top = bounds.top - rect.top;
      const end = top + bounds.height;
      return { top:index === 0 ? end - 150 : top, end };
    });
    svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
    svg.style.height = `${rect.height}px`;
    pieces.forEach((piece, index) => {
      const {top, end} = geometry[index];
      const next = geometry[index + 1]?.top ?? end;
      const turn = Math.min(top + 100, end - 35);
      const path = `M ${x} ${top} V ${turn - 24} C ${x} ${turn - 10}, ${x + bend} ${turn - 10}, ${x + bend} ${turn} S ${x} ${turn + 14}, ${x} ${turn + 28} V ${next}`;
      piece.track.setAttribute('d', path);
      piece.ink.setAttribute('d', path);
      piece.length = piece.ink.getTotalLength();
      piece.node.setAttribute('cx', x + bend);
      piece.node.setAttribute('cy', turn);
    });
    dirty = false;
  }

  function render() {
    frame = 0;
    if (document.hidden) return;
    if (dirty) measure();
    if (reduced.matches) return;
    const readAt = scrollY + innerHeight * .68 - mainTop;
    const stackRect = stack.getBoundingClientRect();
    const skillRects = skills.map(skill => skill.getBoundingClientRect());
    pieces.forEach((piece, index) => {
      const {top, end} = geometry[index];
      const progress = clamp((readAt - top) / Math.max(1, end - top));
      piece.ink.style.strokeDashoffset = 1 - progress;
      const point = piece.ink.getPointAtLength(piece.length * progress);
      piece.tip.setAttribute('cx', point.x);
      piece.tip.setAttribute('cy', point.y);
      piece.tip.style.display = progress > 0 && progress < 1 ? '' : 'none';
      piece.group.classList.toggle('thread-passed', progress > .08);
    });
    const spread = clamp((innerHeight - stackRect.top) / (innerHeight * .8));
    stack.style.setProperty('--deck-spread', spread);
    stack.style.setProperty('--deck-rx', `${-pointer.y * 2}deg`);
    stack.style.setProperty('--deck-ry', `${pointer.x * 3}deg`);
    stack.style.setProperty('--deck-light-x', `${50 + pointer.x * 50}%`);
    stack.style.setProperty('--deck-light-y', `${50 + pointer.y * 50}%`);
    const closest = skillRects.reduce((best, rect, index) => Math.abs(rect.top + rect.height / 2 - innerHeight * .48) < best.distance ? {index, distance:Math.abs(rect.top + rect.height / 2 - innerHeight * .48)} : best, {index:-1, distance:Infinity});
    skills.forEach((skill, index) => {
      skill.classList.toggle('reading-now', index === closest.index && skillRects[index].top < innerHeight && skillRects[index].bottom > 0);
      skill.style.setProperty('--skill-progress', clamp((innerHeight * .7 - skillRects[index].top) / skillRects[index].height));
    });
  }
  function schedule() { if (!frame && !document.hidden) frame = requestAnimationFrame(render); }
  const resize = new ResizeObserver(() => { dirty = true; schedule(); });
  resize.observe(main);
  sections.forEach(section => resize.observe(section));
  addEventListener('scroll', () => { if (!reduced.matches) schedule(); }, {passive:true});
  addEventListener('resize', () => { dirty = true; schedule(); }, {passive:true});

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
    animate(card, [{opacity:.35, transform:`translate3d(${direction * 30}px,12px,0) rotate(${direction * 3}deg)`}, {opacity:1, transform:'none'}], {duration:600});
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
    trackedAnimations.forEach(animation => animation.cancel());
    trackedAnimations.clear();
    counters.forEach(counter => { cancelAnimationFrame(counter.frame); counter.frame = 0; counter.visual.textContent = counter.label; });
  }
  reduced.addEventListener('change', () => { stopTransientMotion(); pointer={x:0,y:0}; schedule(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopTransientMotion(); else schedule(); });
  schedule();
})();
