(function () {
  if (!document.body.classList.contains("blog-article-page")) return;

  const localeMap = { uk: "uk-UA", en: "en-US", ru: "ru-RU" };

  function getSlug() {
    if (document.body.dataset.blogSlug) return document.body.dataset.blogSlug;
    const match = window.location.pathname.match(/\/blog\/([^/]+)\.html$/);
    return match ? match[1] : null;
  }

  function getReadingLabel(lang, readTime) {
    const labels = {
      uk: `${readTime} читання`,
      en: `${readTime} read`,
      ru: `${readTime} чтения`,
    };
    if (readTime.includes("читання") || readTime.includes("read") || readTime.includes("чтения")) {
      return readTime;
    }
    return labels[lang] || readTime;
  }

  function applyArticle(lang) {
    const slug = getSlug();
    const entry = window.BLOG_ARTICLES_I18N?.[slug];
    const data = entry?.[lang] || entry?.uk;
    if (!data) return;

    document.title = `${data.title} | Escape`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && data.metaDescription) metaDesc.setAttribute("content", data.metaDescription);

    const category = document.querySelector(".blog-article__category");
    const title = document.querySelector(".blog-article__title");
    const subtitle = document.querySelector(".blog-article__subtitle");
    const content = document.querySelector(".blog-article__content");
    const img = document.querySelector(".blog-article__image");
    const metaTime = document.querySelector(".blog-article__meta time");
    const metaRead = document.querySelector(".blog-article__meta span:last-child");
    const ctaTitle = document.querySelector(".blog-article__cta-title");
    const ctaText = document.querySelector(".blog-article__cta-text");
    const ctaBtn = document.querySelector(".blog-article__cta-btn");

    if (category) category.textContent = data.category;
    if (title) title.textContent = data.title;
    if (subtitle) subtitle.textContent = data.subtitle;
    if (content && data.contentHtml) content.innerHTML = data.contentHtml;
    if (img && data.imageAlt) img.alt = data.imageAlt;
    if (metaTime && entry?.date) {
      const locale = localeMap[lang] || "uk-UA";
      metaTime.textContent = new Date(entry.date).toLocaleDateString(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    if (metaRead && data.readTime) metaRead.textContent = getReadingLabel(lang, data.readTime);
    if (ctaTitle) ctaTitle.textContent = data.ctaTitle;
    if (ctaText) ctaText.textContent = data.ctaText;
    if (ctaBtn) ctaBtn.textContent = data.ctaBtn;

    const ldJson = document.querySelector('script[type="application/ld+json"]');
    if (ldJson && entry?.date) {
      try {
        const schema = JSON.parse(ldJson.textContent);
        schema.headline = data.title;
        schema.inLanguage = lang === "uk" ? "uk-UA" : lang === "ru" ? "ru-RU" : "en-US";
        ldJson.textContent = JSON.stringify(schema);
      } catch (_) {
        /* ignore */
      }
    }
  }

  function init() {
    const lang = window.EscapeI18n?.getLang() || "uk";
    applyArticle(lang);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.addEventListener("escape:langchange", (e) => {
    applyArticle(e.detail?.lang || window.EscapeI18n?.getLang() || "uk");
  });
})();
