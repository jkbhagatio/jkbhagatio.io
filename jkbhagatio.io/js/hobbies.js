(() => {
  const banner = document.querySelector('.hobby-panorama');
  const photo = banner?.querySelector('img');
  if (!photo) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let queued = false;
  const update = () => {
    queued = false;
    const bounds = banner.getBoundingClientRect();
    // Start only after the banner reaches the viewport top, keeping the whole
    // photograph visible initially and any uncovered area above the viewport.
    const offset = reducedMotion.matches ? 0 : Math.min(Math.max(-bounds.top, 0), bounds.height) * 0.18;
    photo.style.transform = `translateY(${offset}px)`;
  };
  const schedule = () => {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  reducedMotion.addEventListener('change', schedule);
  update();
})();
