(() => {
  'use strict';
  const menu = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');
  const closeMenu = () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.querySelector('span').textContent = '＋';
  };
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
    menu.querySelector('span').textContent = open ? '−' : '＋';
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.matchMedia('(min-width:601px)').addEventListener('change', closeMenu);

  let dialogOpener = null;
  const openDialog = (dialog, opener) => {
    dialogOpener = opener;
    closeMenu();
    dialog.showModal();
    document.body.classList.add('modal-open');
  };
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
      if (dialogOpener) dialogOpener.focus({ preventScroll: true });
    });
  });
  const imageDialog = document.getElementById('image-dialog');
  document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => {
    const image = imageDialog.querySelector('img');
    image.src = button.dataset.image;
    image.alt = button.querySelector('img').alt;
    imageDialog.querySelector('p').textContent = button.dataset.caption || image.alt;
    openDialog(imageDialog, button);
  }));
  const sourceButton = document.getElementById('source-open');
  sourceButton.addEventListener('click', () => openDialog(document.getElementById('source-dialog'), sourceButton));

  let toastTimer;
  const toast = message => {
    const element = document.querySelector('.toast');
    element.textContent = message;
    element.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => element.classList.remove('visible'), 2800);
  };
  document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    const value = button.dataset.copy;
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(value);
      else {
        const input = document.createElement('textarea');
        input.value = value;
        input.style.cssText = 'position:fixed;left:-9999px;top:0';
        document.body.appendChild(input);
        input.select();
        const copied = document.execCommand('copy');
        input.remove();
        if (!copied) throw new Error('Copy unavailable');
      }
      toast('微信号已复制：' + value);
    } catch { toast('微信号：' + value + '（可长按复制）'); }
  }));
  document.querySelectorAll('.workflow-step').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.workflow-step').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelector('.workflow-explainer').textContent = button.dataset.step;
  }));

  const sectionMap = { top: null, skills: 'skills', work: 'work', commercial: 'work', podcast: 'work', copywriting: 'work', more: 'work', journey: 'journey', about: 'about', contact: 'contact' };
  const sections = Object.keys(sectionMap).map(id => document.getElementById(id));
  let scrollPending = false;
  const updateNav = () => {
    let current = null;
    sections.forEach(section => { if (section.getBoundingClientRect().top <= 170) current = sectionMap[section.id]; });
    nav.querySelectorAll('a').forEach(link => {
      const active = current && link.hash === '#' + current;
      link.classList.toggle('active', Boolean(active));
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scrollPending = false;
  };
  window.addEventListener('scroll', () => {
    if (!scrollPending) {
      scrollPending = true;
      requestAnimationFrame(updateNav);
    }
  }, { passive: true });
  updateNav();

})();
