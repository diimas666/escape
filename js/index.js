document.addEventListener("DOMContentLoaded", function () {
  const typedEl = document.querySelector(".header__typed");

  if (!typedEl) return;

  // Слова, которые будут печататься
  const phrases = ["Сучасні", "Швидкі", "Ефективні"];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typeSpeed = 100;
  const backSpeed = 60;
  const delayBetweenWords = 1000;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      typedEl.textContent = currentPhrase.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentPhrase.length) {
        setTimeout(() => {
          isDeleting = true;
          type();
        }, delayBetweenWords);
        return;
      }
    } else {
      typedEl.textContent = currentPhrase.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    const timeout = isDeleting ? backSpeed : typeSpeed;
    setTimeout(type, timeout);
  }

  type();
});
