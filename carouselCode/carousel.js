/* I can't explain this even if I wanted to - Saisanthosh S 2025 */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.carousel').forEach(initCarousel);
});

function initCarousel(root) {
  const track = root.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const prev  = root.querySelector('.carousel-btn.prev');
  const next  = root.querySelector('.carousel-btn.next');
  const dots  = root.querySelector('.carousel-dots');

  if (!track || slides.length === 0) return;

  // build dots
  dots.innerHTML = slides.map((_, i) =>
    `<button type="button" aria-label="Go to slide ${i+1}" aria-selected="${i===0}"></button>`
  ).join('');
  const dotBtns = Array.from(dots.querySelectorAll('button'));

  let index = 0;
  const slideCount = slides.length;

  const goTo = (i) => {
    index = (i + slideCount) % slideCount;
    track.style.transform = `translateX(-${index * 100}%)`;
    dotBtns.forEach((b, bi) => b.setAttribute('aria-selected', bi === index ? 'true' : 'false'));
  };

  // controls
  next?.addEventListener('click', () => goTo(index + 1));
  prev?.addEventListener('click', () => goTo(index - 1));
  dotBtns.forEach((b, i) => b.addEventListener('click', () => goTo(i)));

  // keyboard (when section is focused)
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goTo(index + 1);
    if (e.key === 'ArrowLeft')  goTo(index - 1);
  });

  // pointer/touch swipe
  let startX = 0, deltaX = 0, dragging = false, pointerId = null;

  track.addEventListener('pointerdown', (e) => {
    dragging = true; pointerId = e.pointerId; startX = e.clientX; deltaX = 0;
    track.setPointerCapture(pointerId);
  });
  track.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    deltaX = e.clientX - startX;
    // optional: visual drag feedback (small translate)
    track.style.transform = `translateX(calc(-${index * 100}% + ${deltaX}px))`;
  });
  track.addEventListener('pointerup', () => {
    if (!dragging) return;
    dragging = false;
    // snap threshold
    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) goTo(index + 1);
      else            goTo(index - 1);
    } else {
      goTo(index); // snap back
    }
    pointerId = null; deltaX = 0;
  });
  track.addEventListener('pointercancel', () => { dragging = false; goTo(index); });

  // on resize, keep the same index (layout stays 100%-based)
  window.addEventListener('resize', () => goTo(index));

  // init
  goTo(0);
}