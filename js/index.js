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

  // Находим секцию с цифрами
  const aboutSection = document.querySelector(".about");
  const counters = document.querySelectorAll(".counter");

  // Функция анимации чисел
  const startCounter = (counter) => {
    const target = +counter.getAttribute("data-target"); // Конечное число
    const duration = 8000; // Длительность анимации в мс (2 секунды)
    const step = target / (duration / 16); // Вычисляем шаг (16мс - это 60fps)

    let current = 0;

    const updateCounter = () => {
      current += step;

      if (current < target) {
        // Округляем в большую сторону и обновляем текст
        counter.innerText = Math.ceil(current);
        requestAnimationFrame(updateCounter);
      } else {
        // В конце ставим точное значение, чтобы не было дробей
        counter.innerText = target;
      }
    };

    updateCounter();
  };

  // Настраиваем Observer (наблюдатель)
  const observerOptions = {
    root: null, // следим относительно всего окна
    threshold: 0.3, // Анимация начнется, когда 30% секции будет видно
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      // Если секция появилась на экране
      if (entry.isIntersecting) {
        counters.forEach((counter) => {
          startCounter(counter);
        });
        // Отключаем наблюдение, чтобы анимация сработала только один раз
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Запускаем слежение за секцией about
  if (aboutSection) {
    observer.observe(aboutSection);
  }

  // слайдер старт !!
  // Ініціалізація слайдера відгуків
  const reviewsSlider = new Swiper(".reviews-slider", {
    // Базові налаштування
    slidesPerView: 1, // Показувати 1 слайд
    spaceBetween: 30, // Відстань між слайдами
    loop: true, // Нескінченний цикл
    grabCursor: true, // Змінює курсор при наведенні
    autoHeight: true, // Підлаштовувати висоту під контент слайда

    // Навігація стрілками
    navigation: {
      nextEl: ".reviews-next",
      prevEl: ".reviews-prev",
    },
    autoplay: {
      delay: 5000, // Пауза 5 секунд
      disableOnInteraction: false, // Не зупиняти після ручного перемикання
    },
  });
});
