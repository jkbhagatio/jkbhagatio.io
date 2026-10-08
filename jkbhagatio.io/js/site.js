
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.nav-content');
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.textContent = open ? 'Close −' : 'Menu +';
    navigation.classList.toggle('open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navigation.classList.contains('open')) {
      menu.click(); menu.focus();
    }
  });
  document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => {
    if (navigation.classList.contains('open')) menu.click();
  }));
  document.querySelectorAll('.research-section').forEach(section => {
    const topics = [...section.querySelectorAll('.topic')];
    const nodes = [...section.querySelectorAll('.map-node')];
    const edges = [...section.querySelectorAll('.edge')];
    const question = section.querySelector('.diagram-question');
    const detailIndex = section.querySelector('.detail-index');
    const select = index => {
      topics.forEach((topic,i) => topic.setAttribute('aria-pressed', String(i===index)));
      nodes.forEach((node,i) => {
        node.classList.toggle('active', i===index);
        node.setAttribute('aria-pressed', String(i===index));
      });
      edges.forEach(edge => {
        const connected = section.id === 'interests'
          ? edge.dataset.to === 'center' && edge.dataset.from === String(index)
          : edge.dataset.from === String(index) || edge.dataset.to === String(index);
        edge.classList.toggle('active', connected);
      });
      question.textContent = topics[index].dataset.question;
      detailIndex.textContent = String(index+1).padStart(2,'0') + ' / ' + topics[index].dataset.short;
    };
    topics.forEach((topic,i) => topic.addEventListener('click', () => select(i)));
    nodes.forEach((node,i) => {
      node.addEventListener('click', () => select(i));
      node.addEventListener('keydown', event => {
        if (event.key==='Enter' || event.key===' ') {event.preventDefault(); select(i);}
      });
    });
    select(0);
  });
  if (!document.querySelector('.typed-word')) return;
  let paused = reduced.matches;
  let timer;
  const typed = document.querySelector('.typed-word');
  const words = ['learn', 'create', 'build', 'play', 'philosophize', 'science', 'research', 'program', 'solve', 'exercise', 'music', 'craft', 'meditate', 'ball', 'dance', 'teach', 'help', 'improve', 'gen i'];
  let word = Math.floor(Math.random() * words.length);
  let character = words[word].length, deleting = false;
  typed.textContent = words[word];
  const pickNextWord = () => (word + 1 + Math.floor(Math.random() * (words.length - 1))) % words.length;
  const setMotion = value => {
    paused = value;
    if (paused) {typed.textContent=words[word];character=words[word].length;deleting=false;}
    document.body.classList.toggle('paused', paused);
    document.querySelectorAll('.motion-toggle').forEach(button => {
      button.setAttribute('aria-pressed', String(paused));
      button.textContent = paused ? 'Play motion' : 'Pause motion';
    });
    clearTimeout(timer);
    if (!paused && !document.hidden) timer = setTimeout(tick, 1800);
  };
  function tick() {
    if (paused || document.hidden) return;
    const current = words[word];
    if (!deleting && character===current.length) {
      deleting = true; timer=setTimeout(tick,2000); return;
    }
    character += deleting ? -1 : 1;
    typed.textContent = current.slice(0,character);
    let delay = deleting ? 65 : 125;
    if (character===0 && deleting) {deleting=false;word=pickNextWord();delay=250;}
    timer=setTimeout(tick,delay);
  }
  document.querySelectorAll('.motion-toggle').forEach(button => button.addEventListener('click', () => {
    if (reduced.matches) return;
    setMotion(!paused);
  }));
  const handleReducedMotion = () => {
    document.querySelectorAll('.motion-toggle').forEach(button => {
      button.disabled = reduced.matches;
      button.title = reduced.matches ? 'Motion is off to respect your device’s reduced-motion setting.' : 'Pause or play all page animations';
    });
    setMotion(reduced.matches);
    if (reduced.matches) {typed.textContent='learn';document.querySelectorAll('.motion-toggle').forEach(button=>button.textContent='Motion off');}
  };
  reduced.addEventListener('change',handleReducedMotion);
  document.addEventListener('visibilitychange',()=>{
    clearTimeout(timer);
    document.body.classList.toggle('paused',paused || document.hidden);
    if(!document.hidden && !paused) timer=setTimeout(tick,1000);
  });
  handleReducedMotion();
  document.querySelectorAll('a[href^="#note-"]').forEach(link => link.addEventListener('click',()=>{
    document.querySelector('.footnotes').open=true;
  }));
})();
