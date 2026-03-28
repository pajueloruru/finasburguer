/* ============================================================
   FINA'S BURGER — JavaScript
   GSAP ScrollTrigger · Cinematic Scroll Experience
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- GSAP Setup ----
  gsap.registerPlugin(ScrollTrigger);

  // ============================================================
  // MODAL PEDIR
  // ============================================================
  const modalPedir  = document.getElementById('modalPedir');
  const modalClose  = document.getElementById('modalClose');
  const btnPedirNav    = document.getElementById('btnPedirNav');
  const btnPedirMob    = document.getElementById('btnPedirMobile');
  const btnPedirBottom = document.getElementById('btnPedirBottom');

  function openModal() {
    modalPedir.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modalPedir.classList.remove('open');
    document.body.style.overflow = '';
  }

  btnPedirNav    && btnPedirNav.addEventListener('click', openModal);
  btnPedirBottom && btnPedirBottom.addEventListener('click', openModal);
  btnPedirMob && btnPedirMob.addEventListener('click', () => {
    // Cerrar primero el menú mobile
    mobileMenu.classList.remove('open');
    navBurger.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(openModal, 200);
  });
  modalClose  && modalClose.addEventListener('click', closeModal);
  modalPedir  && modalPedir.addEventListener('click', e => {
    if (e.target === modalPedir) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // ============================================================
  // PROGRESS BAR
  // ============================================================
  const progressBar = document.getElementById('progressBar');

  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const progress   = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
  }, { passive: true });

  // ============================================================
  // NAV — scroll state
  // ============================================================
  const nav = document.getElementById('nav');

  ScrollTrigger.create({
    start: 80,
    onEnter:  () => nav.classList.add('scrolled'),
    onLeaveBack: () => nav.classList.remove('scrolled'),
  });

  // ============================================================
  // MOBILE MENU
  // ============================================================
  const navBurger  = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mmLinks    = document.querySelectorAll('.mm-link');

  navBurger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    navBurger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mmLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      navBurger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ============================================================
  // HERO VIDEO — autoplay, se detiene en el último frame
  // ============================================================
  const heroVideo = document.getElementById('heroVideo');

  if (heroVideo) {
    heroVideo.play().catch(() => {
      // Algunos navegadores móviles bloquean autoplay; reintentamos tras interacción
      document.addEventListener('touchstart', () => heroVideo.play(), { once: true });
    });

    heroVideo.addEventListener('timeupdate', () => {
      if (heroVideo.duration && heroVideo.currentTime >= heroVideo.duration - 0.08) {
        heroVideo.pause();
        heroVideo.currentTime = heroVideo.duration;
      }
    });
  }

  // ============================================================
  // HERO — entrance timeline
  // ============================================================
  const heroTl = gsap.timeline({ delay: 0.2 });

  heroTl
    .from('[data-anim="badge"]', {
      opacity: 0, y: 24, duration: 0.7, ease: 'power2.out'
    })
    .from('.hero__line', {
      opacity: 0, y: 80, duration: 1,
      stagger: 0.18, ease: 'power3.out'
    }, '-=0.3')
    .from('[data-anim="sub"]', {
      opacity: 0, y: 22, duration: 0.7, ease: 'power2.out'
    }, '-=0.4')
    .from('[data-anim="actions"] .btn', {
      opacity: 0, y: 20, duration: 0.6,
      stagger: 0.12, ease: 'power2.out'
    }, '-=0.4')
    .from('.hero__scroll', {
      opacity: 0, duration: 0.6, ease: 'power2.out'
    }, '-=0.2');

  // ============================================================
  // HERO — parallax on scroll
  // ============================================================
  gsap.to('.hero__video', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end:   'bottom top',
      scrub: true,
    },
    y: '20%',
    scale: 1.05,
    ease: 'none',
  });

  gsap.to('.hero__content', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end:   'bottom top',
      scrub: true,
    },
    y: '40%',
    opacity: 0,
    ease: 'none',
  });

  // ============================================================
  // PHILOSOPHY — staggered reveals
  // ============================================================
  gsap.from('.philosophy__copy > *', {
    scrollTrigger: {
      trigger: '.philosophy__copy',
      start: 'top 78%',
    },
    opacity: 0, y: 50, duration: 0.8,
    stagger: 0.14, ease: 'power2.out',
  });

  gsap.from('.ph', {
    scrollTrigger: {
      trigger: '.philosophy__images',
      start: 'top 80%',
    },
    opacity: 0, y: 70, scale: 0.95, duration: 0.9,
    stagger: 0.15, ease: 'power2.out',
  });

  // ---- Stat number counters ----
  document.querySelectorAll('.stat-n[data-target]').forEach(el => {
    const target = parseFloat(el.dataset.target);
    const isDecimal = target % 1 !== 0;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo({ val: 0 }, { val: target }, {
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = isDecimal
              ? this.targets()[0].val.toFixed(1)
              : Math.round(this.targets()[0].val);
          },
        });
      },
    });
  });

  // ============================================================
  // MENU — card reveals
  // ============================================================
  gsap.utils.toArray('.menu__section').forEach(section => {
    gsap.from(section.querySelectorAll('.card, .salsa-group'), {
      scrollTrigger: {
        trigger: section,
        start: 'top 82%',
      },
      opacity: 0, y: 48, duration: 0.65,
      stagger: 0.07, ease: 'power2.out',
    });
  });

  // ---- Sticky menu nav — active state via IntersectionObserver ----
  const mnavBtns = document.querySelectorAll('.mnav-btn');
  const menuSections = {
    entrantes:   document.getElementById('entrantes'),
    principales: document.getElementById('principales'),
    salsas:      document.getElementById('salsas'),
  };

  mnavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id  = btn.dataset.target;
      const el  = menuSections[id];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      mnavBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        mnavBtns.forEach(b => b.classList.toggle('active', b.dataset.target === id));
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  Object.values(menuSections).forEach(s => { if (s) sectionObserver.observe(s); });

  // ============================================================
  // REVIEWS — dramatic entrance
  // ============================================================
  gsap.from('.reviews__score', {
    scrollTrigger: {
      trigger: '.reviews__header',
      start: 'top 78%',
    },
    opacity: 0, y: 80, scale: 0.85, duration: 1.1, ease: 'power3.out',
  });

  gsap.from('.reviews__meta, .reviews__header .label', {
    scrollTrigger: {
      trigger: '.reviews__header',
      start: 'top 78%',
    },
    opacity: 0, y: 30, duration: 0.7, stagger: 0.12, ease: 'power2.out', delay: 0.3
  });

  gsap.from('.rcard', {
    scrollTrigger: {
      trigger: '.reviews__track',
      start: 'top 85%',
    },
    opacity: 0, x: 60, duration: 0.7,
    stagger: 0.1, ease: 'power2.out',
  });

  // ---- Reviews carousel ----
  const track       = document.getElementById('reviewsTrack');
  const dotsWrap    = document.getElementById('reviewsDots');
  const btnPrev     = document.getElementById('revPrev');
  const btnNext     = document.getElementById('revNext');
  const cards       = track ? Array.from(track.querySelectorAll('.rcard')) : [];
  let   current     = 0;
  let   autoTimer;

  if (cards.length) {
    // build dots
    cards.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'rdot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Reseña ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    });

    function goTo(idx) {
      current = Math.max(0, Math.min(idx, cards.length - 1));
      // Desplazamiento horizontal dentro del carrusel, sin tocar el scroll vertical de la página
      const gap       = 24;
      const cardW     = cards[0].offsetWidth + gap;
      track.scrollTo({ left: current * cardW, behavior: 'smooth' });
      dotsWrap.querySelectorAll('.rdot').forEach((d, i) => d.classList.toggle('active', i === current));
      resetAuto();
    }

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo((current + 1) % cards.length), 5500);
    }

    btnPrev && btnPrev.addEventListener('click', () => goTo(current - 1));
    btnNext && btnNext.addEventListener('click', () => goTo(current + 1));
    resetAuto();
  }

  // ============================================================
  // CONTACTO — reveals
  // ============================================================
  gsap.from('.cinfo-item', {
    scrollTrigger: { trigger: '.contacto__info', start: 'top 80%' },
    opacity: 0, x: -44, duration: 0.7, stagger: 0.14, ease: 'power2.out',
  });
  gsap.from('.cinfo-socials', {
    scrollTrigger: { trigger: '.cinfo-socials', start: 'top 90%' },
    opacity: 0, y: 24, duration: 0.6, ease: 'power2.out',
  });
  gsap.from('.contacto__map', {
    scrollTrigger: { trigger: '.contacto__map', start: 'top 85%' },
    opacity: 0, scale: 0.96, duration: 0.9, ease: 'power2.out',
  });


  // ============================================================
  // FOOTER
  // ============================================================
  gsap.from('.footer__inner > *', {
    scrollTrigger: { trigger: '.footer', start: 'top 95%' },
    opacity: 0, y: 20, duration: 0.6, stagger: 0.12, ease: 'power2.out',
  });

});
