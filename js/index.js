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

  //печатная машинка  офф

  // бургер меню мобильное

  const burger = document.querySelector(".header__hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");
  const overlay = document.querySelector(".mobile-menu-overlay");
  const closeBtn = document.querySelector(".mobile-menu__close");

  burger.addEventListener("click", () => {
    mobileMenu.classList.add("active");
    overlay.classList.add("active");
  });

  closeBtn.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    overlay.classList.remove("active");
  });

  overlay.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    overlay.classList.remove("active");
  });
});
