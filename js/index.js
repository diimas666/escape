document.addEventListener("DOMContentLoaded", function () {
  // ====== PRELOADER ======
  const preloader = document.querySelector(".preloader");
  const video = document.querySelector(".header__video");

  if (preloader) {
    const hidePreloader = () => {
      preloader.classList.add("loaded");
      setTimeout(() => {
        preloader.style.display = "none";
      }, 500); // Wait for transition to finish
    };

    if (video) {
      // If video is already ready
      if (video.readyState >= 3) {
        hidePreloader();
      } else {
        // Wait for video to load
        video.addEventListener("canplaythrough", hidePreloader, { once: true });
        video.addEventListener("load", hidePreloader, { once: true });

        // Fallback if video takes too long
        setTimeout(hidePreloader, 5000);
      }
    } else {
      // No video, hide immediately
      hidePreloader();
    }
  }

  // ====== TYPED ANIMATION ======
  const typedEl = document.querySelector(".header__typed");

  if (typedEl) {
    // Words to type
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
  }

  // ====== MOBILE MENU ======
  const burger = document.querySelector(".header__hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");
  const overlay = document.querySelector(".mobile-menu-overlay");
  const closeBtn = document.querySelector(".mobile-menu__close");

  if (burger && mobileMenu && overlay && closeBtn) {
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
  }

  // ====== COUNTERS ANIMATION ======
  const aboutSection = document.querySelector(".about");
  const counters = document.querySelectorAll(".counter");

  const startCounter = (counter) => {
    const target = +counter.getAttribute("data-target");
    const duration = 2000; // Reduced from 8000 for better UX
    const step = target / (duration / 16);

    let current = 0;

    const updateCounter = () => {
      current += step;

      if (current < target) {
        counter.innerText = Math.ceil(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.innerText = target;
      }
    };

    updateCounter();
  };

  const observerOptions = {
    root: null,
    threshold: 0.3,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        counters.forEach((counter) => {
          startCounter(counter);
        });
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  if (aboutSection) {
    observer.observe(aboutSection);
  }

  // ====== SWIPER REVIEWS ======
  if (document.querySelector(".reviews-slider")) {
    new Swiper(".reviews-slider", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      grabCursor: true,
      autoHeight: true,
      navigation: {
        nextEl: ".reviews-next",
        prevEl: ".reviews-prev",
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
    });
  }

  // ====== SWIPER PORTFOLIO ======
  if (document.querySelector(".portfolio-slider")) {
    new Swiper(".portfolio-slider", {
      slidesPerView: 3,
      spaceBetween: 24,
      loop: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1200: {
          slidesPerView: 3,
        },
      },
    });
  }

  // ====== FIXED HEADER ON SCROLL ======
  const headerTop = document.querySelector(".header__top");

  if (headerTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        headerTop.classList.add("header__top--fixed");
      } else {
        headerTop.classList.remove("header__top--fixed");
      }
    });
  }
});
