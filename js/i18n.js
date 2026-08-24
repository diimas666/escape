(function () {
  const STORAGE_KEY = "escape_lang";
  const DEFAULT_LANG = "uk";
  const SUPPORTED = ["uk", "en", "ru"];

  function getNested(obj, path) {
    return path.split(".").reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), obj);
  }

  function getLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED.includes(stored) ? stored : DEFAULT_LANG;
  }

  function dict(lang) {
    return window.ESCAPE_I18N?.[lang || getLang()] || {};
  }

  function t(key, lang) {
    if (!key) return "";
    const value = getNested(dict(lang), key);
    return value ?? "";
  }

  function setText(sel, key, lang, root = document) {
    const el = root.querySelector(sel);
    const value = t(key, lang);
    if (el && value) el.textContent = value;
  }

  function setHtml(sel, key, lang, root = document) {
    const el = root.querySelector(sel);
    const value = t(key, lang);
    if (el && value) el.innerHTML = value;
  }

  function setAll(sel, key, lang) {
    const value = t(key, lang);
    if (!value) return;
    document.querySelectorAll(sel).forEach((el) => {
      el.textContent = value;
    });
  }

  function setList(sel, key, lang, root = document) {
    const el = root.querySelector(sel);
    const items = t(key, lang);
    if (el && Array.isArray(items)) {
      el.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
    }
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    localStorage.setItem(STORAGE_KEY, lang);
    applyLanguage(lang);
    document.documentElement.lang = lang === "uk" ? "uk" : lang;
    window.dispatchEvent(new CustomEvent("escape:langchange", { detail: { lang } }));
  }

  function applyNav(lang) {
    const d = dict(lang).nav;
    if (!d) return;
    setAll('[data-i18n="nav.about"]', "nav.about", lang);
    setAll('[data-i18n="nav.why"]', "nav.why", lang);
    setAll('[data-i18n="nav.services"]', "nav.services", lang);
    setAll('[data-i18n="nav.servicesAll"]', "nav.servicesAll", lang);
    setAll('[data-i18n="nav.mobileApps"]', "nav.mobileApps", lang);
    setAll('[data-i18n="nav.price"]', "nav.price", lang);
    setAll('[data-i18n="nav.ads"]', "nav.ads", lang);
    setAll('[data-i18n="nav.portfolio"]', "nav.portfolio", lang);
    setAll('[data-i18n="nav.faq"]', "nav.faq", lang);
    setAll('[data-i18n="nav.blog"]', "nav.blog", lang);
    setAll('[data-i18n="nav.contacts"]', "nav.contacts", lang);
    setAll('[data-i18n="nav.ctaFull"]', "nav.ctaFull", lang);
    setAll('[data-i18n="nav.ctaShort"]', "nav.ctaShort", lang);
    setAll('[data-i18n="nav.menu"]', "nav.menu", lang);
    document.querySelectorAll('[data-i18n-aria="nav.openMenu"]').forEach((el) => {
      el.setAttribute("aria-label", d.openMenu);
    });
    document.querySelectorAll('[data-i18n-aria="nav.mobileNav"]').forEach((el) => {
      el.setAttribute("aria-label", d.mobileNav);
    });
  }

  function applyMeta(lang) {
    const m = dict(lang).meta;
    if (!m) return;
    document.title = m.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", m.description);
  }

  function applyHero(lang) {
    const h = dict(lang).hero;
    if (!h) return;
    setText(".header__badge", null, lang);
    document.querySelectorAll(".header__badge").forEach((el) => (el.textContent = h.badge));
    setText(".header__title-static", null, lang);
    document.querySelectorAll(".header__title-static").forEach((el) => (el.textContent = h.titleStatic));
    setText(".header__lead", null, lang);
    document.querySelectorAll(".header__lead").forEach((el) => (el.textContent = h.lead));
    const feats = document.querySelectorAll(".header__feature span:last-child");
    [h.feat1, h.feat2, h.feat3].forEach((text, i) => {
      if (feats[i] && text) feats[i].textContent = text;
    });
    const primary = document.querySelector(".header__actions .btn--primary");
    const ghost = document.querySelector(".header__actions .btn--ghost");
    if (primary) primary.textContent = h.ctaPrimary;
    if (ghost) ghost.textContent = h.ctaGhost;
    document.querySelectorAll(".header__visual img").forEach((img) => {
      img.alt = h.imgAlt;
    });
    window.__escapeTypedWords = [h.typed1, h.typed2, h.typed3];
  }

  function applyAbout(lang) {
    const a = dict(lang).about;
    if (!a) return;
    setText("#about .section-label", null, lang);
    document.querySelector("#about .section-label") && (document.querySelector("#about .section-label").textContent = a.label);
    setText(".about__title", null, lang);
    const aboutTitle = document.querySelector(".about__title");
    if (aboutTitle && a.title) {
      aboutTitle.innerHTML = a.title.includes("Escape")
        ? a.title.replace("Escape", '<span class="about__title-accent">Escape</span>')
        : a.title;
    }
    setText(".about__metrics-label", null, lang);
    document.querySelector(".about__metrics-label") && (document.querySelector(".about__metrics-label").textContent = a.metricsLabel);
    setText(".about__metrics-title", null, lang);
    document.querySelector(".about__metrics-title") && (document.querySelector(".about__metrics-title").textContent = a.metricsTitle);
    const metricLabels = document.querySelectorAll(".about__metric-label");
    [a.metric1label, a.metric2label, a.metric3label, a.metric4label].forEach((text, i) => {
      if (metricLabels[i] && text) metricLabels[i].textContent = text;
    });
    document.querySelectorAll("[data-about-intro]").forEach((el, i) => {
      if (a.intro?.[i]) el.innerHTML = a.intro[i];
    });
    setList("[data-about-highlights]", null, lang);
    const hl = document.querySelector("[data-about-highlights]");
    if (hl && a.highlights) hl.innerHTML = a.highlights.map((item) => `<li>${item}</li>`).join("");
    setText(".reviews-showcase__label", null, lang);
    document.querySelector(".reviews-showcase__label") && (document.querySelector(".reviews-showcase__label").textContent = a.reviewsLabel);
    setText(".reviews-showcase__note", null, lang);
    document.querySelector(".reviews-showcase__note") && (document.querySelector(".reviews-showcase__note").textContent = a.reviewsNote);
    [1, 2, 3].forEach((i) => {
      const slide = document.querySelector(`[data-review="${i}"]`);
      if (!slide) return;
      const text = slide.querySelector(".review-text");
      const name = slide.querySelector(".review-author__info h5");
      const role = slide.querySelector(".review-author__info span");
      const verified = slide.querySelector(".review-card__verified");
      if (text) text.textContent = a[`review${i}text`];
      if (name) name.textContent = a[`review${i}name`];
      if (role) role.textContent = a[`review${i}role`];
      if (verified) verified.textContent = a.verified;
    });
  }

  function applyWhy(lang) {
    const w = dict(lang).why;
    if (!w) return;
    const section = document.querySelector("#why");
    if (!section) return;
    setText("#why .section-label", null, lang);
    section.querySelector(".section-label") && (section.querySelector(".section-label").textContent = w.label);
    setText(".why__title", null, lang);
    section.querySelector(".why__title") && (section.querySelector(".why__title").textContent = w.title);
    setText(".why__subtitle", null, lang);
    section.querySelector(".why__subtitle") && (section.querySelector(".why__subtitle").textContent = w.subtitle);
    section.querySelectorAll(".why__card").forEach((card, index) => {
      const data = w.cards?.[index];
      if (!data) return;
      const title = card.querySelector(".why__card-title");
      const text = card.querySelector(".why__card-text");
      if (title) title.textContent = data.title;
      if (text) text.textContent = data.text;
      const chips = card.querySelector(".why__chips");
      if (chips && data.chips) chips.innerHTML = data.chips.map((c) => `<span>${c}</span>`).join("");
      const tags = card.querySelector(".why__tags");
      if (tags && data.tags) tags.innerHTML = data.tags.map((tag) => `<span>${tag}</span>`).join("");
      const metricLabel = card.querySelector(".why__metric-label");
      if (metricLabel && data.metricLabel) metricLabel.textContent = data.metricLabel;
      const bonusTitle = card.querySelector(".why__bonus-title");
      if (bonusTitle && data.bonusTitle) bonusTitle.textContent = data.bonusTitle;
      const bonusText = card.querySelector(".why__bonus-text, .why__bonus p");
      if (bonusText && data.bonusText) bonusText.textContent = data.bonusText;
    });
    section.querySelectorAll(".why__mini-stat").forEach((stat, index) => {
      const data = w.stats?.[index];
      if (!data) return;
      const val = stat.querySelector("span:first-child");
      const lbl = stat.querySelector("small");
      if (val) val.textContent = data.value;
      if (lbl) lbl.textContent = data.label;
    });
  }

  function applyConsult(lang) {
    const c = dict(lang).consult;
    if (!c) return;
    setText(".consult__title", null, lang);
    document.querySelector(".consult__title") && (document.querySelector(".consult__title").textContent = c.title);
    setText(".consult__subtitle", null, lang);
    document.querySelector(".consult__subtitle") && (document.querySelector(".consult__subtitle").textContent = c.subtitle);
    document.querySelectorAll(".consult__benefits li").forEach((el, i) => {
      if (c.benefits?.[i]) el.textContent = c.benefits[i];
    });
    setText(".consult__btn", null, lang);
    document.querySelector(".consult__btn") && (document.querySelector(".consult__btn").textContent = c.btn);
    applyFormPlaceholders(lang);
  }

  function applyServices(lang) {
    const s = dict(lang).services;
    if (!s) return;
    setText("#services .section-label", null, lang);
    document.querySelector("#services .section-label") && (document.querySelector("#services .section-label").textContent = s.label);
    setText(".services__title", null, lang);
    document.querySelector(".services__title") && (document.querySelector(".services__title").textContent = s.title);
    setText(".services__subtitle", null, lang);
    document.querySelector(".services__subtitle") && (document.querySelector(".services__subtitle").textContent = s.subtitle);
    document.querySelectorAll(".service-card").forEach((card, index) => {
      const data = s.cards?.[index];
      if (!data) return;
      const title = card.querySelector(".service-card__title");
      const desc = card.querySelector(".service-card__description");
      const tags = card.querySelector(".service-card__tags");
      if (title) {
        if (data.title.includes("Web-")) {
          title.innerHTML = `Web-<span>${data.title.replace("Web-", "")}</span>`;
        } else if (data.title.includes(" ")) {
          const [a, ...b] = data.title.split(" ");
          title.innerHTML = `${a} <span>${b.join(" ")}</span>`;
        } else {
          title.innerHTML = `<span>${data.title}</span>`;
        }
      }
      if (desc) desc.textContent = data.desc;
      if (tags && data.tags) tags.innerHTML = data.tags.map((tag) => `<li>${tag}</li>`).join("");
    });
  }

  function applyPortfolio(lang) {
    const p = dict(lang).portfolio;
    if (!p) return;
    setText("#portfolio .section-label", null, lang);
    document.querySelector("#portfolio .section-label") && (document.querySelector("#portfolio .section-label").textContent = p.label);
    setText(".portfolio__title", null, lang);
    document.querySelector(".portfolio__title") && (document.querySelector(".portfolio__title").textContent = p.title);
    setText(".portfolio__subtitle", null, lang);
    document.querySelector(".portfolio__subtitle") && (document.querySelector(".portfolio__subtitle").textContent = p.subtitle);
    document.querySelectorAll(".portfolio__btn--prev").forEach((btn) => btn.setAttribute("aria-label", p.prev));
    document.querySelectorAll(".portfolio__btn--next").forEach((btn) => btn.setAttribute("aria-label", p.next));
    const lb = document.querySelector(".portfolio-lightbox__img");
    if (lb) lb.alt = p.lightboxAlt;
    window.__escapePortfolioI18n = dict(lang).portfolioProjects;
    if (typeof window.renderPortfolioSlides === "function") window.renderPortfolioSlides();
  }

  function applyMobileApps(lang) {
    const m = dict(lang).mobileApps;
    if (!m) return;
    const section = document.querySelector("#mobile-apps");
    if (!section) return;
    section.querySelector(".section-label") && (section.querySelector(".section-label").textContent = m.label);
    const title = section.querySelector(".mobile-apps__title");
    if (title && m.titleHtml) title.innerHTML = m.titleHtml;
    section.querySelector(".mobile-apps__subtitle") && (section.querySelector(".mobile-apps__subtitle").textContent = m.subtitle);
    section.querySelectorAll(".mobile-apps__platform").forEach((el, i) => {
      const text = el.querySelector("svg")?.nextSibling;
      if (m.platforms?.[i]) {
        const label = m.platforms[i];
        const svg = el.querySelector("svg");
        el.textContent = "";
        if (svg) el.appendChild(svg);
        el.append(` ${label}`);
      }
    });
    section.querySelector(".mobile-apps__focus-badge") && (section.querySelector(".mobile-apps__focus-badge").textContent = m.focusBadge);
    section.querySelector(".mobile-apps__focus-title") && (section.querySelector(".mobile-apps__focus-title").textContent = m.focusTitle);
    section.querySelector(".mobile-apps__focus-text") && (section.querySelector(".mobile-apps__focus-text").textContent = m.focusText);
    const focusList = section.querySelector(".mobile-apps__focus-list");
    if (focusList && m.focusList) focusList.innerHTML = m.focusList.map((item) => `<li>${item}</li>`).join("");
    section.querySelector(".mobile-apps__stages-title") && (section.querySelector(".mobile-apps__stages-title").textContent = m.stagesTitle);
    section.querySelectorAll(".mobile-apps__stage").forEach((stage, i) => {
      const data = m.stages?.[i];
      if (!data) return;
      stage.querySelector(".mobile-apps__stage-name") && (stage.querySelector(".mobile-apps__stage-name").textContent = data.name);
      stage.querySelector(".mobile-apps__stage-text") && (stage.querySelector(".mobile-apps__stage-text").textContent = data.text);
    });
    section.querySelector(".mobile-apps__pricing-title") && (section.querySelector(".mobile-apps__pricing-title").textContent = m.pricingTitle);
    section.querySelector(".mobile-apps__pricing-note") && (section.querySelector(".mobile-apps__pricing-note").innerHTML = m.pricingNote);
    section.querySelectorAll(".mobile-apps__card").forEach((card, i) => {
      const data = m.pricingCards?.[i];
      if (!data) return;
      const label = card.querySelector(".mobile-apps__card-label");
      if (label && data.label) label.textContent = data.label;
      card.querySelector(".mobile-apps__card-name") && (card.querySelector(".mobile-apps__card-name").textContent = data.name);
      card.querySelector(".mobile-apps__card-desc") && (card.querySelector(".mobile-apps__card-desc").textContent = data.desc);
      const priceEl = card.querySelector(".mobile-apps__card-price");
      if (priceEl && data.price) {
        const unit = data.priceUnit ? ` <span>${data.priceUnit}</span>` : "";
        priceEl.innerHTML = `${data.price}${unit}`;
      }
      const list = card.querySelector(".mobile-apps__card-list");
      if (list && data.features) list.innerHTML = data.features.map((f) => `<li>${f}</li>`).join("");
      card.querySelector(".mobile-apps__btn") && (card.querySelector(".mobile-apps__btn").textContent = data.btn);
    });
    section.querySelector(".mobile-apps__cta-text") && (section.querySelector(".mobile-apps__cta-text").textContent = m.cta.text);
    const ctaBtn = section.querySelector(".mobile-apps__cta-btn--primary");
    if (ctaBtn) ctaBtn.textContent = m.cta.btn;
    const tg = section.querySelector(".mobile-apps__cta-btn--telegram");
    if (tg) {
      const svg = tg.querySelector("svg");
      tg.textContent = "";
      if (svg) tg.appendChild(svg);
      tg.append(` ${m.cta.telegram}`);
    }
    const modal = document.querySelector("#mobile-modal");
    if (modal && m.modal) {
      modal.querySelector("h3") && (modal.querySelector("h3").textContent = m.modal.title);
      modal.querySelector(".mobile-modal__intro") && (modal.querySelector(".mobile-modal__intro").textContent = m.modal.intro);
      modal.querySelector(".mobile-modal__divider") && (modal.querySelector(".mobile-modal__divider").textContent = m.modal.divider);
      const tgLink = modal.querySelector(".mobile-modal__telegram-link");
      if (tgLink) {
        const svg = tgLink.querySelector("svg");
        tgLink.textContent = "";
        if (svg) tgLink.appendChild(svg);
        tgLink.append(` ${m.modal.telegram}`);
      }
      modal.querySelector('button[type="submit"]') && (modal.querySelector('button[type="submit"]').textContent = m.modal.submit);
    }
  }

  function applyReadyApps(lang) {
    const r = dict(lang).readyApps;
    if (!r) return;
    const section = document.querySelector("#ready-apps");
    if (!section) return;
    section.querySelector(".ready-apps__label") && (section.querySelector(".ready-apps__label").textContent = r.label);
    const title = section.querySelector(".ready-apps__title");
    if (title && r.titleHtml) title.innerHTML = r.titleHtml;
    section.querySelector(".ready-apps__subtitle") && (section.querySelector(".ready-apps__subtitle").textContent = r.subtitle);

    const readyModal = document.querySelector("#ready-apps-modal");
    if (readyModal && r.modal) {
      readyModal.querySelector("h3") && (readyModal.querySelector("h3").textContent = r.modal.title);
      readyModal.querySelector(".ready-apps-modal__intro") && (readyModal.querySelector(".ready-apps-modal__intro").textContent = r.modal.intro);
      readyModal.querySelector('button[type="submit"]') && (readyModal.querySelector('button[type="submit"]').textContent = r.modal.submit);
      const closeBtn = readyModal.querySelector(".ready-apps-modal__close");
      if (closeBtn) closeBtn.setAttribute("aria-label", r.modal.close);
    }

    if (typeof window.renderReadyAppsCards === "function") window.renderReadyAppsCards();
  }

  function applySteps(lang) {
    const s = dict(lang).steps;
    if (!s) return;
    document.querySelector(".steps .section-label") && (document.querySelector(".steps .section-label").textContent = s.label);
    document.querySelector(".steps__title") && (document.querySelector(".steps__title").textContent = s.title);
    document.querySelectorAll(".steps .step").forEach((step, i) => {
      const data = s.items?.[i];
      if (!data) return;
      step.querySelector(".step__name") && (step.querySelector(".step__name").textContent = data.name);
      step.querySelector(".step__text") && (step.querySelector(".step__text").textContent = data.text);
    });
  }

  function applyJunePromo(lang) {
    const j = dict(lang).junePromo;
    if (!j) return;
    const section = document.querySelector("#june-promo");
    if (!section) return;
    section.querySelector(".june-promo__badge") && (section.querySelector(".june-promo__badge").textContent = j.badge);
    section.querySelector(".june-promo__title") && (section.querySelector(".june-promo__title").innerHTML = j.title);
    section.querySelector(".june-promo__text") && (section.querySelector(".june-promo__text").innerHTML = j.text);
    section.querySelector(".june-promo__cta") && (section.querySelector(".june-promo__cta").textContent = j.cta);
    section.querySelector(".june-promo__timer-label") && (section.querySelector(".june-promo__timer-label").textContent = j.timerLabel);
    const units = section.querySelectorAll(".june-promo__timer-unit");
    [j.days, j.hours, j.mins, j.secs].forEach((label, i) => {
      if (units[i]) units[i].textContent = label;
    });
  }

  function applyAds(lang) {
    const a = dict(lang).ads;
    if (!a) return;
    const section = document.querySelector("#ads");
    if (!section) return;
    section.querySelector(".section-label") && (section.querySelector(".section-label").textContent = a.label);
    section.querySelector(".ads__title") && (section.querySelector(".ads__title").textContent = a.title);
    section.querySelector(".ads__subtitle") && (section.querySelector(".ads__subtitle").textContent = a.subtitle);
    section.querySelectorAll(".ads__step").forEach((step, i) => {
      const data = a.steps?.[i];
      if (!data) return;
      step.querySelector(".ads__step-num") && (step.querySelector(".ads__step-num").textContent = data.num);
      step.querySelector(".ads__step-title") && (step.querySelector(".ads__step-title").textContent = data.title);
      step.querySelector(".ads__step-text") && (step.querySelector(".ads__step-text").textContent = data.text);
      const list = step.querySelector(".ads__step-list");
      if (list && data.list) list.innerHTML = data.list.map((item) => `<li>${item}</li>`).join("");
    });
    section.querySelector(".ads__budget-banner-label") && (section.querySelector(".ads__budget-banner-label").textContent = a.budgetLabel);
    section.querySelector(".ads__budget-banner-text") && (section.querySelector(".ads__budget-banner-text").innerHTML = a.budgetText);
    section.querySelector(".ads__budget-banner-sub") && (section.querySelector(".ads__budget-banner-sub").textContent = a.budgetSub);
    section.querySelector(".ads__pricing-title") && (section.querySelector(".ads__pricing-title").textContent = a.pricingTitle);
    section.querySelectorAll(".ads__card").forEach((card, i) => {
      const data = a.packages?.[i];
      if (!data) return;
      const label = card.querySelector(".ads__card-label, .ads__label");
      if (label && data.label) label.textContent = data.label;
      card.querySelector(".ads__card-name") && (card.querySelector(".ads__card-name").textContent = data.name);
      card.querySelector(".ads__card-desc") && (card.querySelector(".ads__card-desc").textContent = data.desc);
      const list = card.querySelector(".ads__content");
      if (list && data.features) list.innerHTML = data.features.map((f) => `<li>${f}</li>`).join("");
      card.querySelector(".ads__btn") && (card.querySelector(".ads__btn").textContent = data.btn);
    });
    section.querySelector(".ads__faq-title") && (section.querySelector(".ads__faq-title").textContent = a.faqTitle);
    section.querySelectorAll(".ads__faq .faq__item").forEach((item, i) => {
      const data = a.faq?.[i];
      if (!data) return;
      item.querySelector(".faq__question h3") && (item.querySelector(".faq__question h3").textContent = data.q);
      item.querySelector(".faq__answer p") && (item.querySelector(".faq__answer p").innerHTML = data.a);
    });
    section.querySelector(".ads__cta-title") && (section.querySelector(".ads__cta-title").textContent = a.ctaTitle);
    section.querySelector(".ads__cta-text") && (section.querySelector(".ads__cta-text").textContent = a.ctaText);
    section.querySelector(".ads__cta-link") && (section.querySelector(".ads__cta-link").textContent = a.ctaLink);
    const adsModal = document.querySelector("#ads-modal");
    if (adsModal && a.modal) {
      adsModal.querySelector("h3") && (adsModal.querySelector("h3").textContent = a.modal.title);
      adsModal.querySelector('button[type="submit"]') && (adsModal.querySelector('button[type="submit"]').textContent = a.modal.submit);
    }
  }

  function applyPrice(lang) {
    const p = dict(lang).price;
    if (!p) return;
    document.querySelector("#price .section-label") && (document.querySelector("#price .section-label").textContent = p.label);
    document.querySelector(".price__title") && (document.querySelector(".price__title").textContent = p.title);
    document.querySelector(".price__subtitle") && (document.querySelector(".price__subtitle").textContent = p.subtitle);
    document.querySelectorAll("#price .price__card").forEach((card, i) => {
      const data = p.cards?.[i];
      if (!data) return;
      const label = card.querySelector(".price__label");
      if (label && data.label) label.textContent = data.label;
      card.querySelector(".price__card-title") && (card.querySelector(".price__card-title").textContent = data.title);
      const list = card.querySelector(".price__content");
      if (list && data.features) list.innerHTML = data.features.map((f) => `<li>${f}</li>`).join("");
      card.querySelector(".price__btn") && (card.querySelector(".price__btn").textContent = data.btn);
    });
    const priceModal = document.querySelector("#modal");
    if (priceModal && p.modal) {
      priceModal.querySelector("h3") && (priceModal.querySelector("h3").textContent = p.modal.title);
      priceModal.querySelector('button[type="submit"]') && (priceModal.querySelector('button[type="submit"]').textContent = p.modal.submit);
    }
  }

  function applyDesignOffer(lang) {
    const d = dict(lang).designOffer;
    if (!d) return;
    document.querySelector(".design-offer__title") && (document.querySelector(".design-offer__title").textContent = d.title);
    document.querySelector(".design-offer__text") && (document.querySelector(".design-offer__text").textContent = d.text);
    document.querySelector(".design-offer__btn") && (document.querySelector(".design-offer__btn").textContent = d.btn);
  }

  function applyFaq(lang) {
    const f = dict(lang).faq;
    if (!f) return;
    const section = document.querySelector("#faq");
    if (!section) return;
    section.querySelector(".section-label") && (section.querySelector(".section-label").textContent = f.label);
    section.querySelector(".faq__title") && (section.querySelector(".faq__title").textContent = f.title);
    section.querySelector(".faq__group-title") && (section.querySelector(".faq__group-title").textContent = f.groupMobile);
    section.querySelectorAll('[data-faq-item]').forEach((item) => {
      const i = item.dataset.faqItem;
      const q = f[`q${i}`];
      const a = f[`a${i}`];
      item.querySelector(".faq__question h3") && (item.querySelector(".faq__question h3").textContent = q);
      item.querySelector(".faq__answer p") && (item.querySelector(".faq__answer p").innerHTML = a);
    });
  }

  function applyContacts(lang) {
    const c = dict(lang).contacts;
    if (!c) return;
    document.querySelector("#contacts .section-label") && (document.querySelector("#contacts .section-label").textContent = c.label);
    document.querySelector(".contacts__title") && (document.querySelector(".contacts__title").textContent = c.title);
    document.querySelector(".contacts__subtitle") && (document.querySelector(".contacts__subtitle").textContent = c.subtitle);
    const form = document.querySelector(".contacts__form");
    if (form) {
      const labelKeys = ["nameLabel", "phoneLabel", "emailLabel", "messageLabel"];
      form.querySelectorAll(".contacts__input-group").forEach((group, i) => {
        const label = group.querySelector(".contacts__label");
        if (label && labelKeys[i]) label.textContent = c[labelKeys[i]];
      });
      form.querySelector('[name="name"]') && (form.querySelector('[name="name"]').placeholder = c.namePlaceholder);
      form.querySelector('[name="phone"]') && (form.querySelector('[name="phone"]').placeholder = c.phonePlaceholder);
      form.querySelector('[name="email"]') && (form.querySelector('[name="email"]').placeholder = c.emailPlaceholder);
      form.querySelector('[name="message"]') && (form.querySelector('[name="message"]').placeholder = c.messagePlaceholder);
      form.querySelector(".contacts__btn") && (form.querySelector(".contacts__btn").textContent = c.submit);
    }
    const ch = c.channels;
    if (ch) {
      document.querySelectorAll("[data-i18n-channel]").forEach((h4) => {
        const key = h4.dataset.i18nChannel;
        if (ch[key]) h4.textContent = ch[key];
      });
      const tgItem = document.querySelector('[data-i18n-channel="telegram"]')?.closest(".contacts__item");
      const tgLink = tgItem?.querySelector("a");
      if (tgLink && ch.telegramLink) tgLink.textContent = ch.telegramLink;
    }
  }

  function applyFooter(lang) {
    const f = dict(lang).footer;
    if (!f) return;
    const copy = document.querySelector(".footer__copyright");
    if (copy) {
      copy.innerHTML = `${f.copyright} <a class="footer__legal-link" href="./privacy.html">${f.privacy}</a>`;
    }
    setAll('[data-i18n="footer.services"]', "footer.services", lang);
    setAll('[data-i18n="footer.faq"]', "footer.faq", lang);
  }

  function applyFormConsent(lang) {
    const f = dict(lang).form;
    if (!f) return;
    document.querySelectorAll(".form-consent__text").forEach((el) => {
      const link = el.querySelector("a");
      el.innerHTML = `${f.consent} `;
      if (link) {
        link.textContent = f.consentLink;
        el.appendChild(link);
      }
    });
  }

  function applyFormPlaceholders(lang) {
    const f = dict(lang).form;
    const c = dict(lang).consult;
    if (!f) return;
    document.querySelectorAll('.consult__input[name="name"]').forEach((el) => {
      if (c?.namePlaceholder) el.placeholder = c.namePlaceholder;
    });
    document.querySelectorAll('.consult__input[name="phone"]').forEach((el) => {
      if (c?.phonePlaceholder) el.placeholder = c.phonePlaceholder;
    });
    document.querySelectorAll(".modal__form input[placeholder], .mobile-modal__form input[placeholder], .ready-apps-modal__form input[placeholder]").forEach((el) => {
      if (el.type === "tel") el.placeholder = f.phonePlaceholder;
      else if (el.type === "text" && !el.readOnly) el.placeholder = f.namePlaceholder;
    });
  }

  function applyTextNodes(lang) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const value = t(el.dataset.i18n, lang);
      if (value) el.textContent = value;
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const value = t(el.dataset.i18nHtml, lang);
      if (value) el.innerHTML = value;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const value = t(el.dataset.i18nPlaceholder, lang);
      if (value) el.placeholder = value;
    });
  }

  function applyPrivacy(lang) {
    const p = window.PRIVACY_I18N?.[lang];
    if (!p || !document.body.classList.contains("privacy-page")) return;
    document.title = p.metaTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", p.metaDescription);
    const label = document.querySelector(".privacy__label");
    const title = document.querySelector(".privacy__title");
    const updated = document.querySelector(".privacy__updated");
    const content = document.querySelector(".privacy__content");
    const footer = document.querySelector(".privacy-footer p");
    if (label) label.textContent = p.label;
    if (title) title.textContent = p.title;
    if (updated) updated.textContent = p.updated;
    if (content && p.contentHtml) content.innerHTML = p.contentHtml;
    if (footer) {
      footer.innerHTML = `${p.footerText} <a href="./index.html">${p.homeLink}</a>`;
    }
  }

  function applyBlogPage(lang) {
    if (!document.body.classList.contains("blog-page")) return;
    const b = dict(lang).blog;
    if (!b) return;
    const metaTitle = document.querySelector('meta[property="og:title"]');
    if (metaTitle && b.title) metaTitle.setAttribute("content", `${b.label} | Escape`);
  }

  function updateLangSwitcher(lang) {
    const labels = { uk: "UA", en: "EN", ru: "RU" };
    document.querySelectorAll(".lang-switcher__current").forEach((el) => {
      el.textContent = labels[lang] || "UA";
    });
    document.querySelectorAll(".lang-switcher__option").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.lang === lang);
    });
  }

  function applyLanguage(lang) {
    if (!window.ESCAPE_I18N?.[lang]) return;
    applyMeta(lang);
    applyNav(lang);
    applyHero(lang);
    applyAbout(lang);
    applyWhy(lang);
    applyConsult(lang);
    applyServices(lang);
    applyPortfolio(lang);
    applyMobileApps(lang);
    applyReadyApps(lang);
    applySteps(lang);
    applyJunePromo(lang);
    applyAds(lang);
    applyPrice(lang);
    applyDesignOffer(lang);
    applyFaq(lang);
    applyContacts(lang);
    applyFooter(lang);
    applyFormConsent(lang);
    applyFormPlaceholders(lang);
    applyTextNodes(lang);
    applyPrivacy(lang);
    applyBlogPage(lang);
    updateLangSwitcher(lang);
    if (typeof window.applyBlogArticle === "function") window.applyBlogArticle(lang);
  }

  function initLangSwitcher() {
    document.querySelectorAll(".lang-switcher__option").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        setLang(btn.dataset.lang);
        btn.closest(".lang-switcher")?.classList.remove("is-open");
      });
    });
    document.querySelectorAll(".lang-switcher").forEach((switcher) => {
      const trigger = switcher.querySelector(".lang-switcher__trigger");
      if (!trigger) return;
      switcher.addEventListener("click", (e) => e.stopPropagation());
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = switcher.classList.contains("is-open");
        document.querySelectorAll(".lang-switcher.is-open").forEach((s) => s.classList.remove("is-open"));
        if (!isOpen) switcher.classList.add("is-open");
        trigger.setAttribute("aria-expanded", String(!isOpen));
      });
    });
    document.addEventListener("click", () => {
      document.querySelectorAll(".lang-switcher.is-open").forEach((s) => {
        s.classList.remove("is-open");
        s.querySelector(".lang-switcher__trigger")?.setAttribute("aria-expanded", "false");
      });
    });
  }

  function init() {
    const lang = getLang();
    document.documentElement.lang = lang === "uk" ? "uk" : lang;
    applyLanguage(lang);
    initLangSwitcher();
  }

  window.EscapeI18n = { getLang, setLang, t, applyLanguage };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
