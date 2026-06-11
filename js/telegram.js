// === API (токен лише на сервері — Vercel Environment Variables) ===
const API_URL = "/api/telegram";

// === DOM ELEMENTS ===
const modal = document.querySelector("#modal");
const modalForm = document.querySelector(".modal__form");
const consultForm = document.querySelector(".consult__form");
const orderTypeInput = document.querySelector("#order-type");
const closeBtn = document.querySelector(".modal__close");
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

function showSuccessPopup() {
    let popup = document.querySelector(".success-popup");
    if (!popup) {
        popup = document.createElement("div");
        popup.className = "success-popup";
        popup.innerText = "Заявку успішно надіслано!";
        document.body.appendChild(popup);
    }

    popup.offsetHeight; // Trigger reflow
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

    // Determine data based on form
    let type = "Консультація";
    let name = "";
    let phone = "";
    let email = "";
    let userMessage = "";

    if (form.classList.contains("modal__form")) {
        type = orderTypeInput.value.trim() || "Замовлення";
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

    // Validation
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

    // Construct Message
    let message = `📩 НОВА ЗАЯВКА
---------------------------
🔶 Послуга: ${type}
👤 Ім’я: ${name}
📞 Телефон: ${phone}`;

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
                if (form.classList.contains("modal__form")) formType = "price_modal";
                else if (form.classList.contains("consult__form")) formType = "consult";

                window.EscapeAnalytics.trackLead({
                    serviceType: type,
                    formType,
                });
            }

            if (form.classList.contains("modal__form")) {
                closeModal();
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
    // Open Modal Buttons
    if (openBtns) {
        openBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                const type = btn.dataset.type;
                openModal(type);
            });
        });
    }

    // Close Button
    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    // Click Outside
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Escape Key
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal();
        }
    });

    // Forms Submit
    if (modalForm) {
        modalForm.addEventListener("submit", sendTelegram);
    }
    if (consultForm) {
        consultForm.addEventListener("submit", sendTelegram);
    }

    const contactsForm = document.querySelector(".contacts__form");
    if (contactsForm) {
        contactsForm.addEventListener("submit", sendTelegram);
    }
});
