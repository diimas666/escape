(function () {
  const grid = document.getElementById("blog-grid");
  if (!grid || typeof BLOG_ARTICLES === "undefined") return;

  const sorted = [...BLOG_ARTICLES].sort((a, b) => new Date(b.date) - new Date(a.date));

  grid.innerHTML = sorted
    .map((article) => {
      const dateFormatted = new Date(article.date).toLocaleDateString("uk-UA", {
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
            <p class="blog-card__excerpt">${article.excerpt}</p>
            <span class="blog-card__link">Читати статтю →</span>
          </div>
        </a>
      `;
    })
    .join("");
})();
