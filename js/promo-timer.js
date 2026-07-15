(function () {
  const PROMO_END = new Date(2026, 6, 1, 0, 0, 0, 0);
  const DISCOUNT_PERCENT = 10;
  const LANDING_BASE_PRICE = 300;

  const promoSection = document.getElementById("june-promo");
  const consultBenefit = document.querySelector(".consult__benefit-promo");
  const landingCard = document.getElementById("landing-price-card");
  const landingBadge = document.getElementById("landing-promo-badge");
  const landingPriceOld = document.getElementById("landing-price-old");
  const landingPriceCurrent = document.getElementById("landing-price-current");

  const timerEls = {
    days: document.getElementById("promo-days"),
    hours: document.getElementById("promo-hours"),
    minutes: document.getElementById("promo-minutes"),
    seconds: document.getElementById("promo-seconds"),
  };

  function isPromoActive() {
    return Date.now() < PROMO_END.getTime();
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function getDiscountedPrice() {
    return Math.round(LANDING_BASE_PRICE * (1 - DISCOUNT_PERCENT / 100));
  }

  function applyLandingDiscount() {
    if (!landingCard) return;

    landingCard.classList.add("price__card--promo");

    if (landingBadge) landingBadge.hidden = false;
    if (landingPriceOld) landingPriceOld.hidden = false;
    if (landingPriceCurrent) {
      landingPriceCurrent.innerHTML = `$${getDiscountedPrice()} <span>/ сайт</span>`;
    }
  }

  function revertLandingDiscount() {
    if (landingCard) landingCard.classList.remove("price__card--promo");
    if (landingBadge) landingBadge.hidden = true;
    if (landingPriceOld) landingPriceOld.hidden = true;
    if (landingPriceCurrent) {
      landingPriceCurrent.innerHTML = `$${LANDING_BASE_PRICE} <span>/ сайт</span>`;
    }
  }

  function removePromoUi() {
    if (promoSection) promoSection.remove();
    if (consultBenefit) consultBenefit.remove();
    revertLandingDiscount();
  }

  function updateTimer() {
    const diff = PROMO_END.getTime() - Date.now();

    if (diff <= 0) {
      removePromoUi();
      return false;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (timerEls.days) timerEls.days.textContent = pad(days);
    if (timerEls.hours) timerEls.hours.textContent = pad(hours);
    if (timerEls.minutes) timerEls.minutes.textContent = pad(minutes);
    if (timerEls.seconds) timerEls.seconds.textContent = pad(seconds);

    return true;
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!isPromoActive()) {
      removePromoUi();
      return;
    }

    applyLandingDiscount();

    if (!updateTimer()) return;

    const intervalId = window.setInterval(() => {
      if (!updateTimer()) {
        window.clearInterval(intervalId);
      }
    }, 1000);
  });
})();
