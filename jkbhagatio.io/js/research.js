(() => {
  const dialog = document.querySelector('.figure-dialog');
  if (!dialog) return;
  const image = dialog.querySelector('.figure-dialog-image');
  let opener;
  document.querySelectorAll('.figure-expand').forEach(button => {
    button.addEventListener('click', () => {
      opener = button;
      image.src = button.dataset.full;
      image.alt = button.querySelector('img').alt;
      dialog.querySelector('h2').textContent = button.dataset.title;
      dialog.querySelector('figcaption').replaceChildren(
        ...Array.from(button.closest('figure').querySelector('figcaption').childNodes, node => node.cloneNode(true))
      );
      dialog.showModal();
      dialog.scrollTop = 0;
      document.documentElement.classList.add('figure-open');
    });
  });
  dialog.querySelector('.figure-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('figure-open');
    opener?.focus({preventScroll: true});
  });
})();
