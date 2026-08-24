function getReadyAppsTranslations() {
  const lang = window.EscapeI18n?.getLang?.() || "uk";
  return window.ESCAPE_I18N?.[lang]?.readyApps || window.ESCAPE_I18N?.uk?.readyApps;
}

function renderReadyAppsCards() {
  const grid = document.getElementById("ready-apps-grid");
  const data = window.ESCAPE_READY_APPS;
  const t = getReadyAppsTranslations();
  if (!grid || !data?.length || !t) return;

  grid.innerHTML = data
    .map((app) => {
      const card = t.cards?.find((c) => c.id === app.id);
      if (!card) return "";

      const appLabel = `${card.name} (${card.price})`;

      return `
        <article class="ready-apps__card">
          <a
            class="ready-apps__card-link"
            href="${app.appStoreUrl}"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="${t.viewInStore}: ${card.name}"
          >
            <img
              class="ready-apps__card-img"
              src="${app.image}"
              alt="${card.name}"
              width="140"
              height="140"
              loading="lazy"
            />
            <span class="ready-apps__card-store-hint">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              ${t.viewInStore}
            </span>
          </a>
          <div class="ready-apps__card-body">
            <h4 class="ready-apps__card-name">${card.name}</h4>
            <div class="ready-apps__card-footer">
              <p class="ready-apps__card-price">${card.price}</p>
              <button
                type="button"
                class="ready-apps__card-btn"
                data-app="${appLabel}"
              >${card.btn}</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

window.renderReadyAppsCards = renderReadyAppsCards;

document.addEventListener("DOMContentLoaded", () => {
  renderReadyAppsCards();

  document.addEventListener("escape:langchange", () => {
    renderReadyAppsCards();
  });
});
