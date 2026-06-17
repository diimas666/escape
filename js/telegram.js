// === API (токен лише на сервері — Vercel Environment Variables) ===
const API_URL = "/api/telegram";

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

const openBtns = document.querySelectorAll(".price__btn");

// === STATE ===
let isSubmitting = false;

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

function showSuccessPopup() {
    let popup = document.querySelector(".success-popup");
    if (!popup) {
        popup = document.createElement("div");
        popup.className = "success-popup";
        popup.innerText = "Заявку успішно надіслано!";
        document.body.appendChild(popup);
    }

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

    let type = "Консультація";
    let tariff = "";
    let packageName = "";
    let name = "";
    let phone = "";
    let email = "";
    let userMessage = "";

    if (form.classList.contains("modal__form") && !isAdsForm && !isMobileForm) {
        type = orderTypeInput.value.trim() || "Замовлення";
        const nameInput = form.querySelector('input[placeholder="Ваше ім’я"]');
        const phoneInput = form.querySelector('input[placeholder="Телефон"]');
        name = nameInput ? nameInput.value.trim() : "";
        phone = phoneInput ? phoneInput.value.trim() : "";
    } else if (isMobileForm) {
        type = "Мобільний додаток";
        packageName = mobilePackageInput ? mobilePackageInput.value.trim() : "";
        const nameInput = form.querySelector('input[placeholder="Ваше ім’я"]');
        const phoneInput = form.querySelector('input[placeholder="Телефон"]');
        name = nameInput ? nameInput.value.trim() : "";
        phone = phoneInput ? phoneInput.value.trim() : "";
    } else if (isAdsForm) {
        type = "Реклама";
        tariff = adsOrderTypeInput ? adsOrderTypeInput.value.trim() : "";
        const nameInput = form.querySelector('input[placeholder="Ваше ім’я"]');
        const phoneInput = form.querySelector('input[placeholder="Телефон"]');
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

    if (name.length < 2) {
        alert("Введіть коректне ім’я");
        isSubmitting = false;
        return;
    }

    if (!/^\+?\d{9,14}$/.test(phone)) {
        alert("Введіть коректний номер телефону");
        isSubmitting = false;
        return;
    }

    const privacyCheckbox = form.querySelector('input[name="privacy"]');
    if (!privacyCheckbox || !privacyCheckbox.checked) {
        alert("Потрібно погодитись з обробкою персональних даних");
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
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: message }),
        });

        const result = await response.json().catch(() => ({}));

        if (response.ok && result.ok) {
            if (window.EscapeAnalytics) {
                let formType = "contacts";
                if (isAdsForm) formType = "ads_modal";
                else if (isMobileForm) formType = "mobile_modal";
                else if (form.classList.contains("modal__form")) formType = "price_modal";
                else if (form.classList.contains("consult__form")) formType = "consult";

                window.EscapeAnalytics.trackLead({
                    serviceType: isAdsForm ? `Реклама — ${tariff}` : isMobileForm ? `Мобільний додаток — ${packageName}` : type,
                    formType,
                });
            }

            if (form.classList.contains("modal__form") && !isAdsForm && !isMobileForm) {
                closeModal();
            }
            if (isAdsForm) {
                closeAdsModal();
            }
            if (isMobileForm) {
                closeMobileModal();
            }
            showSuccessPopup();
            form.reset();
        } else {
            throw new Error("Telegram API Error");
        }
    } catch (error) {
        console.error(error);
        alert("Помилка надсилання. Спробуйте ще раз!");
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

    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    if (adsCloseBtn) {
        adsCloseBtn.addEventListener("click", closeAdsModal);
    }

    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener("click", closeMobileModal);
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
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal();
            closeAdsModal();
            closeMobileModal();
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
    if (consultForm) {
        consultForm.addEventListener("submit", sendTelegram);
    }

    const contactsForm = document.querySelector(".contacts__form");
    if (contactsForm) {
        contactsForm.addEventListener("submit", sendTelegram);
    }
});
