/* نادي الاتحاد — shared behaviour (no backend, no accounts) */

/* رقم واتساب المتجر — يجب استبداله برقم المتجر الفعلي */
const WA_NUMBER = "966500000000";

const waLink = (text) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

/* ----- روابط واتساب ----- */
document.querySelectorAll("[data-wa]").forEach((link) => {
  const message = link.dataset.waText || "مرحباً نادي الاتحاد، أود الاستفسار عن التشكيلة.";
  link.href = waLink(message);
  link.setAttribute("target", "_blank");
  link.setAttribute("rel", "noopener noreferrer");
});

/* ----- قائمة الجوال ----- */
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".main-nav");

if (toggle && nav) {
  const close = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "فتح القائمة");
  };

  toggle.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) close();
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
}

/* ----- فلترة المنتجات ----- */
const chips = document.querySelectorAll(".filter-chip");
const products = document.querySelectorAll(".product-card");

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((item) => {
      item.classList.toggle("is-active", item === chip);
      item.setAttribute("aria-pressed", String(item === chip));
    });

    const filter = chip.dataset.filter;
    products.forEach((product) => {
      product.hidden = filter !== "all" && product.dataset.category !== filter;
    });
  });
});

/* ----- ظهور العناصر عند التمرير ----- */
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

/* ----- نموذج التواصل: إرسال عبر واتساب ----- */
const form = document.querySelector("#contact-form");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = form.elements.name.value.trim();
    const phone = form.elements.phone.value.trim();
    const message = form.elements.message.value.trim();
    const status = document.querySelector("#form-status");

    if (!name || !message) {
      if (status) status.textContent = "يرجى كتابة الاسم والرسالة قبل الإرسال.";
      (!name ? form.elements.name : form.elements.message).focus();
      return;
    }

    const text =
      `مرحباً نادي الاتحاد،\n\nالاسم: ${name}\n` +
      `رقم الجوال: ${phone || "غير محدد"}\n\nالرسالة:\n${message}`;

    window.open(waLink(text), "_blank", "noopener,noreferrer");

    if (status) {
      status.textContent = "تم تجهيز رسالتك في واتساب. أغلق النافذة بعد الإرسال.";
    }
    form.reset();
  });
}

/* ----- السنة ----- */
document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});
