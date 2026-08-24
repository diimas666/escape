// === API (токен лише на сервері — Vercel Environment Variables) ===
const PRODUCTION_API_URL = "https://escape-webshop.com/api/telegram";

function getApiUrl() {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
        return PRODUCTION_API_URL;
    }
    return "/api/telegram";
}

// === DOM ELEMENTS ===
const modal = document.querySelector("#modal");
const modalForm = document.querySelector("#modal .modal__form");
const consultForm = document.querySelector(".consult__form");
const orderTypeInput = document.querySelector("#order-type");
const closeBtn = document.querySelector("#modal .modal__close");

const adsModal = document.querySelector("#ads-modal");
const adsModalForm = document.querySelector(".ads-modal__form");
const adsOrderTypeInput = document.querySelector("#ads-order-type");
const adsCloseBtn = document.querySelector(".ads-modal__close");
const openAdsBtns = document.querySelectorAll(".ads__btn");

const mobileModal = document.querySelector("#mobile-modal");
const mobileModalForm = document.querySelector(".mobile-modal__form");
const mobileOrderTypeInput = document.querySelector("#mobile-order-type");
const mobilePackageInput = document.querySelector("#mobile-package");
const mobileCloseBtn = document.querySelector(".mobile-modal__close");
const openMobileBtns = document.querySelectorAll(".mobile-apps__btn");

const readyAppsModal = document.querySelector("#ready-apps-modal");
const readyAppsModalForm = document.querySelector(".ready-apps-modal__form");
const readyAppNameInput = document.querySelector("#ready-app-name");
const readyAppsModalAppLabel = document.querySelector("#ready-apps-modal-app");
const readyAppsCloseBtn = document.querySelector(".ready-apps-modal__close");

const openBtns = document.querySelectorAll(".price__btn");

// === STATE ===
let isSubmitting = false;

function i18n(key) {
    return window.EscapeI18n?.t(key) || "";
}

function getFormField(form, name) {
    return form.querySelector(`[name="${name}"]`);
}

// === FUNCTIONS ===

function openModal(type) {
    if (orderTypeInput) orderTypeInput.value = type;
    if (modal) modal.classList.add("active");
}

function closeModal() {
    if (modal) modal.classList.remove("active");
}

function openAdsModal(tariff) {
    if (adsOrderTypeInput) adsOrderTypeInput.value = tariff;
    if (adsModal) adsModal.classList.add("active");
}

function closeAdsModal() {
    if (adsModal) adsModal.classList.remove("active");
}

function openMobileModal(packageName) {
    if (mobileOrderTypeInput) mobileOrderTypeInput.value = "Мобільний додаток";
    if (mobilePackageInput) mobilePackageInput.value = packageName || "Індивідуальний розрахунок";
    if (mobileModal) mobileModal.classList.add("active");
}

function closeMobileModal() {
    if (mobileModal) mobileModal.classList.remove("active");
}

function openReadyAppsModal(appName) {
    if (readyAppNameInput) readyAppNameInput.value = appName || "";
    if (readyAppsModalAppLabel) readyAppsModalAppLabel.textContent = appName || "";
    if (readyAppsModal) readyAppsModal.classList.add("active");
}

function closeReadyAppsModal() {
    if (readyAppsModal) readyAppsModal.classList.remove("active");
}

function showSuccessPopup(customMessage) {
    let popup = document.querySelector(".success-popup");
    const message = customMessage || i18n("form.success") || "Заявку успішно надіслано!";
    if (!popup) {
        popup = document.createElement("div");
        popup.className = "success-popup";
        document.body.appendChild(popup);
    }

    popup.innerText = message;
    popup.offsetHeight;
    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");
        setTimeout(() => popup.remove(), 300);
    }, 2000);
}

async function sendTelegram(e) {
    e.preventDefault();
    const form = e.target;

    if (isSubmitting) return;
    isSubmitting = true;

    const isAdsForm = form.classList.contains("ads-modal__form");
    const isMobileForm = form.classList.contains("mobile-modal__form");
    const isReadyAppsForm = form.classList.contains("ready-apps-modal__form");

    let type = "Консультація";
    let tariff = "";
    let packageName = "";
    let appName = "";
    let name = "";
    let phone = "";
    let email = "";
    let userMessage = "";

    if (form.classList.contains("modal__form") && !isAdsForm && !isMobileForm && !isReadyAppsForm) {
        type = orderTypeInput.value.trim() || "Замовлення";
        const nameInput = getFormField(form, "name");
        const phoneInput = getFormField(form, "phone");
        name = nameInput ? nameInput.value.trim() : "";
        phone = phoneInput ? phoneInput.value.trim() : "";
    } else if (isMobileForm) {
        type = "Мобільний додаток";
        packageName = mobilePackageInput ? mobilePackageInput.value.trim() : "";
        const nameInput = getFormField(form, "name");
        const phoneInput = getFormField(form, "phone");
        name = nameInput ? nameInput.value.trim() : "";
        phone = phoneInput ? phoneInput.value.trim() : "";
    } else if (isReadyAppsForm) {
        type = "Готовий додаток";
        appName = readyAppNameInput ? readyAppNameInput.value.trim() : "";
        const phoneInput = getFormField(form, "phone");
        phone = phoneInput ? phoneInput.value.trim() : "";
    } else if (isAdsForm) {
        type = "Реклама";
        tariff = adsOrderTypeInput ? adsOrderTypeInput.value.trim() : "";
        const nameInput = getFormField(form, "name");
        const phoneInput = getFormField(form, "phone");
        name = nameInput ? nameInput.value.trim() : "";
        phone = phoneInput ? phoneInput.value.trim() : "";
    } else if (form.classList.contains("consult__form")) {
        const nameInput = form.querySelector('input[name="name"]');
        const phoneInput = form.querySelector('input[name="phone"]');
        name = nameInput ? nameInput.value.trim() : "";
        phone = phoneInput ? phoneInput.value.trim() : "";
    } else if (form.classList.contains("contacts__form")) {
        type = "Повідомлення з контактів";
        const nameInput = form.querySelector('input[name="name"]');
        const phoneInput = form.querySelector('input[name="phone"]');
        const emailInput = form.querySelector('input[name="email"]');
        const msgInput = form.querySelector('textarea[name="message"]');

        name = nameInput ? nameInput.value.trim() : "";
        phone = phoneInput ? phoneInput.value.trim() : "";
        email = emailInput ? emailInput.value.trim() : "";
        userMessage = msgInput ? msgInput.value.trim() : "";
    }

    if (!isReadyAppsForm && name.length < 2) {
        alert(i18n("form.errors.name") || "Введіть коректне ім’я");
        isSubmitting = false;
        return;
    }

    if (!/^\+?\d{9,14}$/.test(phone)) {
        alert(i18n("form.errors.phone") || "Введіть коректний номер телефону");
        isSubmitting = false;
        return;
    }

    const privacyCheckbox = form.querySelector('input[name="privacy"]');
    if (!privacyCheckbox || !privacyCheckbox.checked) {
        alert(i18n("form.errors.privacy") || "Потрібно погодитись з обробкою персональних даних");
        isSubmitting = false;
        return;
    }

    let message;

    if (isAdsForm) {
        message = `📣 РЕКЛАМА — НОВА ЗАЯВКА
---------------------------
🏷 Категорія: Реклама
📦 Тарифний план: ${tariff || "не вказано"}
👤 Ім’я: ${name}
📞 Телефон: ${phone}`;
    } else if (isReadyAppsForm) {
        message = `📱 ГОТОВИЙ ДОДАТОК — НОВА ЗАЯВКА
---------------------------
📲 Додаток: ${appName || "не вказано"}
📞 Телефон: ${phone}`;
    } else if (isMobileForm) {
        message = `📱 МОБІЛЬНИЙ ДОДАТОК — НОВА ЗАЯВКА
---------------------------
🔶 Послуга: Мобільний додаток (iOS / Android)
📦 Пакет: ${packageName || "не вказано"}
👤 Ім’я: ${name}
📞 Телефон: ${phone}`;
    } else {
        message = `📩 НОВА ЗАЯВКА
---------------------------
🔶 Послуга: ${type}
👤 Ім’я: ${name}
📞 Телефон: ${phone}`;
    }

    if (email) {
        message += `\n📧 Email: ${email}`;
    }

    if (userMessage) {
        message += `\n💬 Повідомлення: ${userMessage}`;
    }

    message += `\n🌐 Сторінка: ${window.location.href}
⏰ Час: ${new Date().toLocaleString()}`;

    if (window.EscapeAnalytics) {
        message += `\n${window.EscapeAnalytics.formatTrafficForTelegram()}`;
    }

    message += "\n";

    try {
        const response = await fetch(getApiUrl(), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: message }),
        });

        const result = await response.json().catch(() => ({}));

        if (response.ok && result.ok) {
            if (window.EscapeAnalytics) {
                let formType = "contacts";
                if (isAdsForm) formType = "ads_modal";
                else if (isReadyAppsForm) formType = "ready_apps_modal";
                else if (isMobileForm) formType = "mobile_modal";
                else if (form.classList.contains("modal__form")) formType = "price_modal";
                else if (form.classList.contains("consult__form")) formType = "consult";

                window.EscapeAnalytics.trackLead({
                    serviceType: isAdsForm
                        ? `Реклама — ${tariff}`
                        : isReadyAppsForm
                          ? `Готовий додаток — ${appName}`
                          : isMobileForm
                            ? `Мобільний додаток — ${packageName}`
                            : type,
                    formType,
                });
            }

            if (form.classList.contains("modal__form") && !isAdsForm && !isMobileForm && !isReadyAppsForm) {
                closeModal();
            }
            if (isAdsForm) {
                closeAdsModal();
            }
            if (isMobileForm) {
                closeMobileModal();
            }
            if (isReadyAppsForm) {
                closeReadyAppsModal();
            }
            showSuccessPopup(isReadyAppsForm ? i18n("readyApps.success") : undefined);
            form.reset();
        } else {
            const apiError = result.error || response.statusText || "Unknown error";
            throw new Error(apiError);
        }
    } catch (error) {
        console.error(error);
        const isLocal =
            window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        const localHint = isLocal
            ? "\n\n(Локально: переконайтесь, що на Vercel налаштовані TELEGRAM_BOT_TOKEN та TELEGRAM_CHAT_ID, або тестуйте на escape-webshop.com)"
            : "";
        alert((i18n("form.errors.sendError") || "Помилка надсилання. Спробуйте ще раз!") + localHint);
    } finally {
        isSubmitting = false;
    }
}

// === EVENT LISTENERS ===

document.addEventListener("DOMContentLoaded", () => {
    if (openBtns) {
        openBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                const type = btn.dataset.type;
                openModal(type);
            });
        });
    }

    if (openAdsBtns) {
        openAdsBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                const tariff = btn.dataset.tariff;
                openAdsModal(tariff);
            });
        });
    }

    if (openMobileBtns) {
        openMobileBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                const packageName = btn.dataset.package;
                openMobileModal(packageName);
            });
        });
    }

    const readyAppsGrid = document.getElementById("ready-apps-grid");
    if (readyAppsGrid) {
        readyAppsGrid.addEventListener("click", (e) => {
            const btn = e.target.closest(".ready-apps__card-btn");
            if (!btn) return;
            e.preventDefault();
            openReadyAppsModal(btn.dataset.app);
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    if (adsCloseBtn) {
        adsCloseBtn.addEventListener("click", closeAdsModal);
    }

    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener("click", closeMobileModal);
    }

    if (readyAppsCloseBtn) {
        readyAppsCloseBtn.addEventListener("click", closeReadyAppsModal);
    }

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
        if (e.target === adsModal) {
            closeAdsModal();
        }
        if (e.target === mobileModal) {
            closeMobileModal();
        }
        if (e.target === readyAppsModal) {
            closeReadyAppsModal();
        }
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal();
            closeAdsModal();
            closeMobileModal();
            closeReadyAppsModal();
        }
    });

    if (modalForm) {
        modalForm.addEventListener("submit", sendTelegram);
    }
    if (adsModalForm) {
        adsModalForm.addEventListener("submit", sendTelegram);
    }
    if (mobileModalForm) {
        mobileModalForm.addEventListener("submit", sendTelegram);
    }
    if (readyAppsModalForm) {
        readyAppsModalForm.addEventListener("submit", sendTelegram);
    }
    if (consultForm) {
        consultForm.addEventListener("submit", sendTelegram);
    }

    const contactsForm = document.querySelector(".contacts__form");
    if (contactsForm) {
        contactsForm.addEventListener("submit", sendTelegram);
    }
});
