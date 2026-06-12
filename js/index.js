document.addEventListener("DOMContentLoaded", function () {
  // ====== PRELOADER ======
  const preloader = document.querySelector(".preloader");
  const heroImage = document.querySelector(".header__image");

  if (preloader) {
    const hidePreloader = () => {
      preloader.classList.add("loaded");
      setTimeout(() => {
        preloader.style.display = "none";
      }, 500);
    };

    if (heroImage) {
      if (heroImage.complete) {
        hidePreloader();
      } else {
        heroImage.addEventListener("load", hidePreloader, { once: true });
        heroImage.addEventListener("error", hidePreloader, { once: true });
        setTimeout(hidePreloader, 3000);
      }
    } else {
      hidePreloader();
    }
  }

  // ====== TYPED ANIMATION ======
  const typedEl = document.querySelector(".header__typed");

  if (typedEl) {
    const typedWrap = typedEl.closest(".header__typed-wrap");
    const phrases = ["Преміальні", "Конверсійні", "Унікальні"];

    if (typedWrap) {
      const measure = document.createElement("span");
      const typedStyle = getComputedStyle(typedEl);
      measure.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;pointer-events:none;";
      measure.style.font = typedStyle.font;
      measure.style.fontStyle = typedStyle.fontStyle;
      measure.style.fontWeight = typedStyle.fontWeight;
      measure.style.fontSize = typedStyle.fontSize;
      document.body.appendChild(measure);

      let maxWidth = 0;
      phrases.forEach((phrase) => {
        measure.textContent = phrase;
        maxWidth = Math.max(maxWidth, measure.offsetWidth);
      });

      measure.remove();
      typedWrap.style.minWidth = `${maxWidth + 8}px`;
    }

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

  // ====== HEADER ENTRANCE ======
  const headerBlocks = document.querySelectorAll(
    ".header__badge, .header__title, .header__lead, .header__features, .header__actions, .header__visual",
  );

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    headerBlocks.forEach((el, index) => {
      el.classList.add("header-reveal");
      el.style.setProperty("--header-delay", `${0.35 + index * 0.12}s`);
    });
  }

  // ====== SCROLL REVEAL ======
  const initScrollReveal = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const revealElements = new Set();

    const addReveal = (el, delay = 0, variant = "") => {
      if (!el || revealElements.has(el)) return;
      el.classList.add("reveal");
      if (variant) el.classList.add(variant);
      if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
      revealElements.add(el);
    };

    document
      .querySelectorAll(
        "section .section-label, section h2, section [class*='__subtitle'], section [class*='subtitle']",
      )
      .forEach((el) => addReveal(el));

    document.querySelectorAll(".why__header").forEach((el) => addReveal(el));

    const staggerGroups = [
      { parent: ".about__metrics-grid", child: ".about__metric-card" },
      { parent: ".about__right", child: ".about__content", variant: "reveal--left" },
      { parent: ".about__right", child: ".about__reviews", variant: "reveal--left" },
      { parent: ".why__grid", child: ".why__card" },
      { parent: ".services__grid", child: ".service-card" },
      { parent: ".steps__wrapper", child: ".step" },
      { parent: ".price__wrapper", child: ".price__card" },
      { parent: ".faq__wrapper", child: ".faq__item" },
    ];

    staggerGroups.forEach(({ parent, child, variant }) => {
      document.querySelectorAll(`${parent} ${child}`).forEach((el, index) => {
        addReveal(el, index * 90, variant);
      });
    });

    addReveal(document.querySelector(".consult__wrapper"), 0, "reveal--scale");
    addReveal(document.querySelector(".june-promo__inner"), 0, "reveal--scale");
    addReveal(document.querySelector(".portfolio__slider"), 100);
    addReveal(document.querySelector(".portfolio__controls"), 200);
    addReveal(document.querySelector(".contacts__info"), 0, "reveal--right");
    addReveal(document.querySelector(".contacts__form-wrapper"), 120, "reveal--left");
    addReveal(document.querySelector(".footer"), 0);

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  };

  initScrollReveal();

  // ====== MOBILE MENU ======
  const burgerButtons = document.querySelectorAll(".mobile-bar__menu, .header__hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");
  const overlay = document.querySelector(".mobile-menu-overlay");
  const closeBtn = document.querySelector(".mobile-menu__close");

  const setBurgerExpanded = (expanded) => {
    burgerButtons.forEach((btn) => btn.setAttribute("aria-expanded", expanded ? "true" : "false"));
  };

  const closeMobileMenu = () => {
    mobileMenu?.classList.remove("active");
    overlay?.classList.remove("active");
    setBurgerExpanded(false);
    document.body.style.overflow = "";
  };

  const openMobileMenu = () => {
    mobileMenu?.classList.add("active");
    overlay?.classList.add("active");
    setBurgerExpanded(true);
    document.body.style.overflow = "hidden";
  };

  if (burgerButtons.length && mobileMenu && overlay && closeBtn) {
    burgerButtons.forEach((burger) => {
      burger.addEventListener("click", () => {
        if (mobileMenu.classList.contains("active")) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      });
    });

    closeBtn.addEventListener("click", closeMobileMenu);
    overlay.addEventListener("click", closeMobileMenu);

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
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
      effect: "fade",
      fadeEffect: { crossFade: true },
      speed: 600,
      autoHeight: true,
      navigation: {
        nextEl: ".reviews-next",
        prevEl: ".reviews-prev",
      },
      pagination: {
        el: ".reviews-pagination",
        clickable: true,
      },
      autoplay: {
        delay: 6000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
    });
  }

  // ====== SWIPER PORTFOLIO ======
  const portfolioWrapper = document.getElementById("portfolio-wrapper");
  const portfolioEl = document.querySelector(".portfolio-slider");

  if (portfolioWrapper && portfolioEl && typeof portfolioProjects !== "undefined") {
    const basePath = "./images/portfolio/";

    const renderPortfolioSlide = (project, index) => {
      const desktopSrc = `${basePath}${project.desktop}`;
      const alt = `${project.title} — ${project.desc}`;

      return `
        <div class="swiper-slide">
          <article class="portfolio__card">
            <div class="portfolio__card-visual">
              <div class="portfolio__devices portfolio__devices--single">
                <div class="portfolio__device portfolio__device--desktop">
                  <div class="portfolio__browser">
                    <div class="portfolio__browser-bar">
                      <span></span><span></span><span></span>
                    </div>
                    <div class="portfolio__browser-screen">
                      <img src="${desktopSrc}" alt="${alt}" loading="${index < 3 ? "eager" : "lazy"}" data-full="${desktopSrc}" />
                    </div>
                  </div>
                </div>
              </div>
              <button type="button" class="portfolio__card-zoom" aria-label="Переглянути повністю">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M15 3H21V9M9 21H3V15M21 3L14 10M3 21L10 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <div class="portfolio__card-meta">
              <span class="portfolio__card-tag">${project.tag}</span>
              <h3 class="portfolio__card-name">${project.title}</h3>
              <p class="portfolio__card-desc">${project.desc}</p>
            </div>
          </article>
        </div>
      `;
    };

    portfolioWrapper.innerHTML = portfolioProjects.map(renderPortfolioSlide).join("");

    const slides = portfolioEl.querySelectorAll(".swiper-slide");
    const progressBar = document.querySelector(".portfolio__progress-bar");
    const currentEl = document.querySelector(".portfolio__current");
    const totalEl = document.querySelector(".portfolio__total");
    const lightbox = document.getElementById("portfolio-lightbox");
    const lightboxImg = lightbox?.querySelector(".portfolio-lightbox__img");
    const lightboxClose = lightbox?.querySelector(".portfolio-lightbox__close");
    const lightboxBackdrop = lightbox?.querySelector(".portfolio-lightbox__backdrop");

    const openLightbox = (src) => {
      if (!lightbox || !lightboxImg || !src) return;
      lightboxImg.src = src;
      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
      if (!lightbox) return;
      lightbox.classList.remove("active");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    lightboxClose?.addEventListener("click", closeLightbox);
    lightboxBackdrop?.addEventListener("click", closeLightbox);

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox?.classList.contains("active")) {
        closeLightbox();
      }
    });

    portfolioEl.querySelectorAll(".portfolio__card-zoom").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const desktopImg = btn.closest(".portfolio__card")?.querySelector(".portfolio__browser-screen img");
        if (desktopImg) {
          openLightbox(desktopImg.dataset.full || desktopImg.src);
        }
      });
    });

    if (totalEl) {
      totalEl.textContent = String(portfolioProjects.length).padStart(2, "0");
    }

    const updatePortfolioUI = (swiper) => {
      const realIndex = swiper.realIndex + 1;
      const progress = (realIndex / portfolioProjects.length) * 100;

      if (currentEl) {
        currentEl.textContent = String(realIndex).padStart(2, "0");
      }

      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }
    };

    new Swiper(".portfolio-slider", {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: "auto",
      loop: true,
      speed: 700,
      spaceBetween: 0,
      coverflowEffect: {
        rotate: 8,
        stretch: 0,
        depth: 160,
        modifier: 1.8,
        slideShadows: false,
      },
      navigation: {
        nextEl: ".portfolio__btn--next",
        prevEl: ".portfolio__btn--prev",
      },
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      breakpoints: {
        0: {
          coverflowEffect: {
            rotate: 0,
            depth: 80,
            modifier: 1.2,
          },
        },
        768: {
          coverflowEffect: {
            rotate: 6,
            depth: 120,
            modifier: 1.5,
          },
        },
        1200: {
          coverflowEffect: {
            rotate: 8,
            depth: 160,
            modifier: 1.8,
          },
        },
      },
      on: {
        init(swiper) {
          updatePortfolioUI(swiper);
        },
        slideChange(swiper) {
          updatePortfolioUI(swiper);
        },
      },
    });
  }

  // ====== FIXED SITE HEADER ======
  const siteHeader = document.querySelector(".site-header");
  const headerSpacer = document.querySelector(".header__top-spacer");
  const MOBILE_HEADER_BREAKPOINT = 992;

  const syncSiteHeader = () => {
    if (!siteHeader) return;

    const isMobile = window.innerWidth <= MOBILE_HEADER_BREAKPOINT;
    const isScrolled = window.scrollY > 50;

    siteHeader.classList.toggle("site-header--scrolled", isMobile || isScrolled);

    const headerHeight = siteHeader.offsetHeight;
    document.documentElement.style.setProperty("--site-header-height", `${headerHeight}px`);

    if (headerSpacer) {
      headerSpacer.style.height = `${headerHeight}px`;
    }
  };

  syncSiteHeader();
  window.addEventListener("scroll", syncSiteHeader, { passive: true });
  window.addEventListener("resize", syncSiteHeader);
});
