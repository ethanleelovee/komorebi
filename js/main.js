/* ============================================================
   KOMOREBI — main.js
   GSAP + ScrollTrigger — 3-phase cinematic zoom
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ── Mobile: swap videos + text slide-up setup ──────────── */
if (window.innerWidth <= 768) {
  document.querySelector('.act1__cut').src = 'vertical3.mp4';
  document.querySelector('.act3__video').src = 'vertical%20(pourover1).mp4';

  // Set initial slide-up state for all texts
  gsap.set(['.act1__text--phase1', '.act1__text--phase2', '.act3__text'], { y: 30 });

  // Phase1 text: slide up on load
  gsap.to('.act1__text--phase1', { y: 0, duration: 1.2, ease: 'power3.out', delay: 0.6 });
}

/* ── Page load: scroll hint entrance ───────────────────────*/
gsap.to('.act1__scroll-hint', { opacity: 1, duration: 1.2, delay: 2, ease: 'power2.out' });


/* ── ACT 1 (pinned) — 2-phase scroll sequence ──────────────

   Phase 1 (0.00 – 0.30): city video zooms in + fades to black,
                           "The world never stops" fades out together.
                           Scrub reversal restores text (no GSAP
                           load tween = no from-value conflict).

   Phase 2 (0.30 – 1.00): cut image zooms in over ~2 scroll lengths,
                           "We do" appears midway, then both fade out
                           → Act 3 pourover fades in.                 */

const act3Video = document.querySelector('.act3__video');

const zoomTl = gsap.timeline({
  scrollTrigger: {
    trigger: '.act1',
    start: 'top top',
    end: '+=500%',       /* 5 viewport heights — extra scroll for Act 3 text overlay */
    scrub: 1.5,
    pin: true,
    anticipatePin: 1,
    onUpdate: (self) => {
      if (self.progress > 0.78) {
        if (act3Video.paused) act3Video.play();
      } else {
        if (!act3Video.paused) {
          act3Video.pause();
          act3Video.currentTime = 0;
        }
      }
    }
  }
});

zoomTl
  /* Scroll hint fades immediately */
  .to('.act1__scroll-hint', { opacity: 0, duration: 0.06 }, 0)

  /* Phase 1 — city video zooms in */
  .to('.act1__zoom-wrap', {
    scale: 5,
    ease: 'power1.inOut',
    duration: 0.20,
  }, 0.02)

  /* City video + "The world never stops" fade to black together */
  .to('.act1__zoom-wrap',       { opacity: 0, ease: 'power1.in', duration: 0.10 }, 0.18)
  .to('.act1__text--phase1',    { opacity: 0, ease: 'power1.in', duration: 0.10 }, 0.18)
  .to('.act1__overlay',         { backgroundColor: 'rgba(15,13,11,1)', duration: 0.10 }, 0.18)

  /* Phase 2 — cut image fades and zooms in (~2 scroll lengths: 0.30–0.72) */
  .to('.act1__cut', {
    opacity: 1,
    scale: 1.10,
    ease: 'power1.inOut',
    duration: 0.42,
  }, 0.30)

  /* "We do" appears — y: 0 drives slide-up on mobile */
  .to('.act1__text--phase2', {
    opacity: 1,
    y: 0,
    ease: 'power2.out',
    duration: 0.10,
  }, 0.52)

  /* Cut image continues zooming in and fades out */
  .to('.act1__cut', {
    opacity: 0,
    scale: 1.22,
    ease: 'power2.in',
    duration: 0.14,
  }, 0.76)

  /* "We do" fades out simultaneously */
  .to('.act1__text--phase2', {
    opacity: 0,
    ease: 'power2.in',
    duration: 0.12,
  }, 0.76)

  /* Act 3 pourover video fades in */
  .to('.act3', { opacity: 1, duration: 0.12 }, 0.90)

  /* "Pause and have a rest" fades in — y: 0 drives slide-up on mobile */
  .to('.act3__text', { opacity: 1, y: 0, duration: 0.10 }, 1.02);


/* ── ACT 3 → ACT 4: Section Cover Slide ─────────────────────
   Act 4 travels 30vh more than the scroll distance, rushing
   over Act 3 like a film frame advancing to the next scene.  */
gsap.fromTo('.act4',
  { y: '30vh' },
  {
    y: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '.act4',
      start: 'top bottom',
      end: 'top top',
      scrub: true,
    }
  }
);

/* ── ACT 4: Staggered content reveal ────────────────────── */
gsap.fromTo(
  ['.act4__title', '.act4__subtitle'],
  { opacity: 0, y: 40 },
  {
    opacity: 1,
    y: 0,
    stagger: 0.15,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.act4__title', start: 'top 78%' }
  }
);

gsap.utils.toArray('.act4__category').forEach((cat, i) => {
  gsap.fromTo(cat,
    { opacity: 0, y: 35 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      delay: i * 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: cat, start: 'top 84%' }
    }
  );
});


/* ── ACT 5: Find Us reveal ──────────────────────────────── */
gsap.to('.act5__title', {
  opacity: 1,
  duration: 1.2,
  ease: 'power2.out',
  scrollTrigger: { trigger: '.act5__title', start: 'top 80%' }
});

gsap.to('.act5__info', {
  opacity: 1,
  y: 0,
  duration: 1,
  ease: 'power2.out',
  scrollTrigger: { trigger: '.act5__info', start: 'top 80%' }
});

gsap.to('.act5__map', {
  opacity: 1,
  y: 0,
  duration: 1,
  delay: 0.2,
  ease: 'power2.out',
  scrollTrigger: { trigger: '.act5__map', start: 'top 80%' }
});


/* ── Nav: fade-in background on scroll ──────────────────── */
ScrollTrigger.create({
  start: 'top -80px',
  end: 99999,
  toggleClass: { className: 'nav--scrolled', targets: '.nav' },
});
