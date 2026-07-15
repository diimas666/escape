(function () {
  const CONFIG = {
    GA4_ID: "G-CZF6ZZN5TP",
    GADS_ID: "AW-11236629410",
    GADS_LEAD_CONVERSION: "AW-11236629410/eqc7CLj4wrscEKK3he4p",
    // Вставте ID пікселя з Meta Events Manager для відстеження Instagram / Facebook
    META_PIXEL_ID: "",
    STORAGE_KEY: "escape_traffic",
  };

  const TRAFFIC_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"];

  const SERVICE_VALUES = {
    "Landing page (візитівка)": 600,
    "Корпоративний сайт": 850,
    "Інтернет-магазин": 1650,
    "Мобільний додаток": 1500,
    "Мобільний додаток — Стартовий ($1 500)": 1500,
    "Мобільний додаток — Бізнес ($2 800)": 2800,
    "Мобільний додаток — Преміум ($5 300)": 5300,
    "Мобільний додаток — Індивідуальний розрахунок": 1500,
    Консультація: 0,
    "Повідомлення з контактів": 0,
    Замовлення: 0,
  };

  function captureTrafficParams() {
    const params = new URLSearchParams(window.location.search);
    const stored = readStoredTraffic();
    const traffic = { ...stored };
    let hasNew = false;

    TRAFFIC_KEYS.forEach((key) => {
      const value = params.get(key);
      if (value) {
        traffic[key] = value;
        hasNew = true;
      }
    });

    if (hasNew) {
      sessionStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(traffic));
    }

    return getTrafficContext();
  }

  function readStoredTraffic() {
    try {
      return JSON.parse(sessionStorage.getItem(CONFIG.STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function getTrafficContext() {
    return readStoredTraffic();
  }

  function resolveTrafficSource(traffic) {
    if (traffic.utm_source) return traffic.utm_source;
    if (traffic.gclid) return "google_ads";
    if (traffic.fbclid) return "instagram_facebook";
    return "direct";
  }

  function resolveTrafficChannel(traffic) {
    if (traffic.utm_medium) return traffic.utm_medium;
    if (traffic.gclid) return "cpc";
    if (traffic.fbclid) return "paid_social";
    return "organic";
  }

  function getServiceValue(serviceType) {
    return SERVICE_VALUES[serviceType] ?? 0;
  }

  function buildEventPayload(extra = {}) {
    const traffic = getTrafficContext();

    return {
      traffic_source: resolveTrafficSource(traffic),
      traffic_medium: resolveTrafficChannel(traffic),
      traffic_campaign: traffic.utm_campaign || "",
      traffic_content: traffic.utm_content || "",
      traffic_term: traffic.utm_term || "",
      page_location: window.location.href,
      page_path: window.location.pathname,
      ...traffic,
      ...extra,
    };
  }

  function gtagEvent(eventName, params) {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }
  }

  function metaEvent(eventName, params) {
    if (typeof window.fbq === "function") {
      window.fbq("track", eventName, params);
    }
  }

  function initMetaPixel() {
    if (!CONFIG.META_PIXEL_ID || window.fbq) return;

    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    window.fbq("init", CONFIG.META_PIXEL_ID);
    window.fbq("track", "PageView");
  }

  function trackPageAttribution() {
    const payload = buildEventPayload();

    gtagEvent("traffic_attribution", payload);

    if (payload.traffic_source !== "direct") {
      gtagEvent("campaign_visit", payload);
    }
  }

  function trackCtaClick({ action, label, serviceType = "" }) {
    const payload = buildEventPayload({
      event_category: "cta",
      event_action: action,
      event_label: label,
      service_type: serviceType,
    });

    gtagEvent("cta_click", payload);
    metaEvent("ViewContent", {
      content_name: label,
      content_category: action,
      service_type: serviceType,
    });
  }

  function trackFormStart({ formType, serviceType = "" }) {
    const payload = buildEventPayload({
      form_type: formType,
      service_type: serviceType,
    });

    gtagEvent("form_start", payload);
    metaEvent("InitiateCheckout", {
      content_name: serviceType || formType,
      content_category: formType,
    });
  }

  function trackLead({ serviceType, formType }) {
    const value = getServiceValue(serviceType);
    const payload = buildEventPayload({
      form_type: formType,
      service_type: serviceType,
      value,
      currency: "USD",
    });

    gtagEvent("generate_lead", payload);

    gtagEvent("conversion", {
      send_to: CONFIG.GADS_LEAD_CONVERSION,
      value,
      currency: "USD",
      transaction_id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    });

    metaEvent("Lead", {
      content_name: serviceType,
      content_category: formType,
      value,
      currency: "USD",
    });

    const serviceEventMap = {
      "Landing page (візитівка)": "lead_landing",
      "Корпоративний сайт": "lead_corporate",
      "Інтернет-магазин": "lead_ecommerce",
      Консультація: "lead_consultation",
      "Повідомлення з контактів": "lead_contacts",
    };

    const serviceEvent = serviceEventMap[serviceType];
    if (serviceEvent) {
      gtagEvent(serviceEvent, payload);
    }
  }

  function formatTrafficForTelegram() {
    const traffic = getTrafficContext();
    const source = resolveTrafficSource(traffic);
    const medium = resolveTrafficChannel(traffic);

    if (source === "direct" && !traffic.utm_campaign) {
      return "Джерело: прямий захід";
    }

    const lines = [`📊 Джерело: ${source}`, `📣 Канал: ${medium}`];

    if (traffic.utm_campaign) lines.push(`🎯 Кампанія: ${traffic.utm_campaign}`);
    if (traffic.utm_content) lines.push(`🖼 Креатив: ${traffic.utm_content}`);
    if (traffic.utm_term) lines.push(`🔑 Ключ: ${traffic.utm_term}`);
    if (traffic.gclid) lines.push("🔗 Google Ads (gclid)");
    if (traffic.fbclid) lines.push("🔗 Instagram/Facebook (fbclid)");

    return lines.join("\n");
  }

  function bindCtaTracking() {
    document.querySelectorAll(".price__btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        trackCtaClick({
          action: "price_order",
          label: btn.dataset.type || "Замовити",
          serviceType: btn.dataset.type || "",
        });
        trackFormStart({
          formType: "price_modal",
          serviceType: btn.dataset.type || "",
        });
      });
    });

    document.querySelectorAll(".header__cta-btn, .btn--primary").forEach((btn) => {
      btn.addEventListener("click", () => {
        trackCtaClick({
          action: "header_cta",
          label: btn.textContent.trim(),
        });
      });
    });

    const consultBtn = document.querySelector(".consult__btn");
    if (consultBtn) {
      consultBtn.addEventListener("click", () => {
        trackCtaClick({
          action: "consult_form",
          label: consultBtn.textContent.trim(),
          serviceType: "Консультація",
        });
        trackFormStart({
          formType: "consult",
          serviceType: "Консультація",
        });
      });
    }

    const contactsBtn = document.querySelector(".contacts__btn");
    if (contactsBtn) {
      contactsBtn.addEventListener("click", () => {
        trackCtaClick({
          action: "contacts_form",
          label: contactsBtn.textContent.trim(),
        });
        trackFormStart({
          formType: "contacts",
          serviceType: "Повідомлення з контактів",
        });
      });
    }

    document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]').forEach((link) => {
      link.addEventListener("click", () => {
        trackCtaClick({
          action: "contact_link",
          label: link.getAttribute("href") || link.textContent.trim(),
        });
      });
    });
  }

  function init() {
    initMetaPixel();
    captureTrafficParams();
    trackPageAttribution();
    bindCtaTracking();
  }

  window.EscapeAnalytics = {
    getTrafficContext,
    formatTrafficForTelegram,
    trackLead,
    trackCtaClick,
    trackFormStart,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
