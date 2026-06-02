const nav = document.querySelector(".main-nav");
const toggle = document.querySelector(".mobile-toggle");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    if (isOpen) {
      nav.querySelectorAll(".nav-group.is-open").forEach((group) => group.classList.remove("is-open"));
    }
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("is-open"));
  });
}

const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();

const footerInner = document.querySelector(".site-footer .footer-inner");
const scriptBase = document.currentScript ? new URL(".", document.currentScript.src) : new URL("./js/", window.location.href);

if (footerInner && !footerInner.querySelector(".footer-signature")) {
  const footerBrand = footerInner.firstElementChild;
  if (footerBrand) footerBrand.remove();

  const legacyCopyright = footerInner.querySelector("[data-year]")?.parentElement;
  if (legacyCopyright) legacyCopyright.remove();

  const signature = document.createElement("div");
  signature.className = "footer-signature";

  const currentYear = new Date().getFullYear();
  const facebookLogo = new URL("../assets/logo-reseau-sociaux/facebook-logo.png", scriptBase).href;
  const instagramLogo = new URL("../assets/logo-reseau-sociaux/instagram-logo.png", scriptBase).href;
  const cookiesUrl = new URL("../cookies/", scriptBase).href;

  signature.innerHTML = `
    <div class="footer-brand-social">
      <strong>Carrosserie Mounier</strong>
      <div class="footer-socials" aria-label="Réseaux sociaux">
        <a href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Instagram Carrosserie Mounier">
          <img src="${instagramLogo}" alt="">
        </a>
        <a href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="Facebook Carrosserie Mounier">
          <img src="${facebookLogo}" alt="">
        </a>
      </div>
    </div>
    <p class="footer-copy">&copy; ${currentYear} Carrosserie Mounier. Tous droits r&eacute;serv&eacute;s.</p>
    <p class="footer-credit"><a href="${cookiesUrl}">Cookies</a> &middot; Site d&eacute;velopp&eacute; par <a href="https://lysmasolutions.fr" target="_blank" rel="noopener">LYSMA</a></p>
  `;

  footerInner.prepend(signature);
}

const COOKIE_CONSENT_KEY = "mounierCookieConsent";
const COOKIE_CONSENT_VERSION = 1;

function readCookieConsent() {
  try {
    const consent = JSON.parse(localStorage.getItem(COOKIE_CONSENT_KEY) || "null");
    return consent?.version === COOKIE_CONSENT_VERSION ? consent : null;
  } catch {
    return null;
  }
}

function saveCookieConsent(preferences) {
  const consent = {
    version: COOKIE_CONSENT_VERSION,
    necessary: true,
    analytics: Boolean(preferences.analytics),
    marketing: Boolean(preferences.marketing),
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  document.documentElement.dataset.cookieConsent = consent.analytics || consent.marketing ? "accepted" : "refused";
  window.dispatchEvent(new CustomEvent("cookie-consent:update", { detail: consent }));
  return consent;
}

function initCookieConsent() {
  if (document.querySelector(".cookie-consent")) return;

  const existingConsent = readCookieConsent();
  if (existingConsent) {
    document.documentElement.dataset.cookieConsent = existingConsent.analytics || existingConsent.marketing ? "accepted" : "refused";
  }

  const banner = document.createElement("section");
  banner.className = "cookie-consent";
  banner.setAttribute("aria-label", "Gestion des cookies");
  banner.innerHTML = `
    <div>
      <strong>Gestion des cookies</strong>
      <p>Nous utilisons des cookies nécessaires au fonctionnement du site. Les cookies de mesure ou marketing ne sont activés qu'après votre accord.</p>
    </div>
    <div class="cookie-consent-actions">
      <button type="button" data-cookie-choice="reject">Refuser</button>
      <button type="button" data-cookie-open>Personnaliser</button>
      <button type="button" data-cookie-choice="accept">Accepter</button>
    </div>
  `;

  const modal = document.createElement("div");
  modal.className = "cookie-modal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="cookie-modal-panel" role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title">
      <button class="cookie-modal-close" type="button" aria-label="Fermer" data-cookie-close>×</button>
      <span>Confidentialité</span>
      <h2 id="cookie-modal-title">Préférences cookies</h2>
      <p>Vous pouvez choisir les finalités que vous acceptez. Les cookies nécessaires restent toujours actifs.</p>
      <label class="cookie-option is-disabled">
        <input type="checkbox" checked disabled>
        <span><strong>Nécessaires</strong><small>Fonctionnement du site et mémorisation du consentement.</small></span>
      </label>
      <label class="cookie-option">
        <input type="checkbox" data-cookie-toggle="analytics">
        <span><strong>Mesure d'audience</strong><small>Aide à comprendre l'utilisation du site.</small></span>
      </label>
      <label class="cookie-option">
        <input type="checkbox" data-cookie-toggle="marketing">
        <span><strong>Marketing</strong><small>Mesure des campagnes et outils publicitaires.</small></span>
      </label>
      <div class="cookie-modal-actions">
        <button type="button" data-cookie-choice="reject">Tout refuser</button>
        <button type="button" data-cookie-save>Enregistrer</button>
        <button type="button" data-cookie-choice="accept">Tout accepter</button>
      </div>
    </div>
  `;

  document.body.append(banner, modal);

  const syncModal = () => {
    const consent = readCookieConsent();
    modal.querySelector('[data-cookie-toggle="analytics"]').checked = Boolean(consent?.analytics);
    modal.querySelector('[data-cookie-toggle="marketing"]').checked = Boolean(consent?.marketing);
  };

  const showBanner = () => banner.classList.add("is-visible");
  const hideBanner = () => banner.classList.remove("is-visible");
  const openModal = () => {
    syncModal();
    modal.classList.add("is-visible");
    modal.setAttribute("aria-hidden", "false");
  };
  const closeModal = () => {
    modal.classList.remove("is-visible");
    modal.setAttribute("aria-hidden", "true");
  };
  const choose = (choice) => {
    saveCookieConsent({
      analytics: choice === "accept",
      marketing: choice === "accept",
    });
    hideBanner();
    closeModal();
  };

  document.querySelectorAll("[data-cookie-choice]").forEach((button) => {
    button.addEventListener("click", () => choose(button.dataset.cookieChoice));
  });

  document.querySelectorAll("[data-cookie-open]").forEach((button) => {
    button.addEventListener("click", openModal);
  });

  modal.querySelector("[data-cookie-close]").addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  modal.querySelector("[data-cookie-save]").addEventListener("click", () => {
    saveCookieConsent({
      analytics: modal.querySelector('[data-cookie-toggle="analytics"]').checked,
      marketing: modal.querySelector('[data-cookie-toggle="marketing"]').checked,
    });
    hideBanner();
    closeModal();
  });

  if (!existingConsent) showBanner();
}

initCookieConsent();

document.querySelectorAll(".accordion-item > button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".accordion-item");
    if (!item) return;
    item.classList.toggle("is-open");
  });
});

document.querySelectorAll(".nav-group > button").forEach((button) => {
  button.addEventListener("click", () => {
    const group = button.closest(".nav-group");
    if (!group) return;
    const shouldOpen = !group.classList.contains("is-open");
    document.querySelectorAll(".nav-group.is-open").forEach((openGroup) => {
      if (openGroup !== group) openGroup.classList.remove("is-open");
    });
    group.classList.toggle("is-open", shouldOpen);
  });
});

document.addEventListener("click", (event) => {
  if (event.target.closest(".nav-group")) return;
  document.querySelectorAll(".nav-group.is-open").forEach((group) => group.classList.remove("is-open"));
});

document.querySelectorAll(".ba-slider").forEach((slider) => {
  const input = slider.querySelector('input[type="range"]');
  if (!input) return;

  const update = (value) => {
    const position = Math.max(0, Math.min(100, Number(value)));
    slider.style.setProperty("--position", `${position}%`);
    input.value = position;
  };

  const updateFromPointer = (event) => {
    const rect = slider.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    update(((clientX - rect.left) / rect.width) * 100);
  };

  input.addEventListener("input", (event) => update(event.target.value));
  slider.addEventListener("pointerdown", (event) => {
    slider.setPointerCapture(event.pointerId);
    updateFromPointer(event);
  });
  slider.addEventListener("pointermove", (event) => {
    if (event.buttons !== 1) return;
    updateFromPointer(event);
  });
  slider.addEventListener("touchmove", (event) => {
    updateFromPointer(event);
  }, { passive: true });

  update(input.value || 50);
});



function initPrestationCardTilt() {
  const cards = document.querySelectorAll(".prestation-mini-card");
  const canTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!cards.length || !canTilt || reducedMotion) return;

  cards.forEach((card) => {
    let frame = null;

    const reset = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = null;
      card.classList.remove("is-tilting");
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
      card.style.setProperty("--shine-x", "50%");
      card.style.setProperty("--shine-y", "18%");
      card.style.setProperty("--shadow-x", "0px");
      card.style.setProperty("--shadow-y", "0px");
    };

    const update = (event) => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const clampedX = Math.max(0, Math.min(1, x));
        const clampedY = Math.max(0, Math.min(1, y));
        const rotateY = (clampedX - 0.5) * 22;
        const rotateX = (0.5 - clampedY) * 16;
        const shadowX = (clampedX - 0.5) * 28;
        const shadowY = (clampedY - 0.5) * 18;

        card.classList.add("is-tilting");
        card.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
        card.style.setProperty("--shine-x", `${(clampedX * 100).toFixed(1)}%`);
        card.style.setProperty("--shine-y", `${(clampedY * 100).toFixed(1)}%`);
        card.style.setProperty("--shadow-x", `${shadowX.toFixed(1)}px`);
        card.style.setProperty("--shadow-y", `${shadowY.toFixed(1)}px`);
      });
    };

    card.addEventListener("pointermove", update);
    card.addEventListener("mousemove", update);
    card.addEventListener("pointerleave", reset);
    card.addEventListener("mouseleave", reset);
    card.addEventListener("blur", reset);
  });
}

initPrestationCardTilt();

