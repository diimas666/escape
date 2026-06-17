(function () {
  const grid = document.getElementById("blog-grid");
  if (!grid || typeof BLOG_ARTICLES_I18N === "undefined") return;

  const localeMap = { uk: "uk-UA", en: "en-US", ru: "ru-RU" };

  const renderBlogGrid = () => {
    const lang = window.EscapeI18n?.getLang() || "uk";
    const locale = localeMap[lang] || "uk-UA";
    const readMore = window.EscapeI18n?.t("blog.readMore") || "Читати статтю →";

    const sorted = Object.entries(BLOG_ARTICLES_I18N)
      .map(([slug, entry]) => {
        const data = entry[lang] || entry.uk;
        return { slug, image: entry.image, date: entry.date, ...data };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    grid.innerHTML = sorted
      .map((article) => {
        const dateFormatted = new Date(article.date).toLocaleDateString(locale, {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        return `
        <a class="blog-card" href="./blog/${article.slug}.html">
          <div class="blog-card__image-wrap">
            <img
              class="blog-card__image"
              src="${article.image}"
              alt="${article.title}"
              width="400"
              height="300"
              loading="lazy"
            />
            <span class="blog-card__category">${article.category}</span>
          </div>
          <div class="blog-card__body">
            <div class="blog-card__meta">
              <time datetime="${article.date}">${dateFormatted}</time>
              <span>·</span>
              <span>${article.readTime}</span>
            </div>
            <h2 class="blog-card__title">${article.title}</h2>
            <p class="blog-card__excerpt">${article.subtitle}</p>
            <span class="blog-card__link">${readMore}</span>
          </div>
        </a>
      `;
      })
      .join("");
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderBlogGrid);
  } else {
    renderBlogGrid();
  }

  window.addEventListener("escape:langchange", renderBlogGrid);
})();
