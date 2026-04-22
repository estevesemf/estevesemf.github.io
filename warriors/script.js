document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('currentYear');
  if (year) year.textContent = new Date().getFullYear();

  const revealItems = document.querySelectorAll('.story-card, .moment-card, .quote-panel, .gallery-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.2 });

  revealItems.forEach((item) => {
    item.classList.add('reveal');
    observer.observe(item);
  });

  const momentCards = document.querySelectorAll('[data-moment]');
  momentCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      momentCards.forEach((item) => item.classList.remove('is-active'));
      card.classList.add('is-active');
    });
  });
});
