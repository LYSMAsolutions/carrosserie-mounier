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
const COOKIE_CONSENT_VERSION = 3;

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
      <p>Nous utilisons des cookies nécessaires au fonctionnement du site. Les échanges avec la chatbox peuvent être enregistrés afin d'améliorer la qualité des réponses. Un identifiant anonyme peut signaler une réponse améliorée sur ce site, sans usage publicitaire.</p>
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
      <p>Vous pouvez choisir les finalités que vous acceptez. Les cookies nécessaires restent toujours actifs. La chatbox peut utiliser un identifiant anonyme uniquement pour retrouver une conversation et signaler une réponse améliorée.</p>
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


function initSmartEmailLinks() {
  const links = document.querySelectorAll(".js-email-action[data-webmail]");
  if (!links.length) return;

  const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (isTouchDevice) return;
      const webmailUrl = link.dataset.webmail;
      if (!webmailUrl) return;
      event.preventDefault();
      window.open(webmailUrl, "_blank", "noopener,noreferrer");
    });
  });
}

initSmartEmailLinks();

function initMounierChatBox() {
  if (document.querySelector(".site-chat")) return;

  const chatboxLogEndpoint = window.MOUNIER_CHATBOX_LOG_ENDPOINT || "https://lysma-super-admin.vercel.app/api/chatbox/log";
  const chatboxUpdatesEndpoint = window.MOUNIER_CHATBOX_UPDATES_ENDPOINT || chatboxLogEndpoint.replace(/\/log\/?$/, "/updates");
  const chatboxSource = "site-vitrine:carrosserie-mounier";
  const chatboxStoragePrefix = "mounier:chatbox:v3";
  const chatboxVisitorKey = `${chatboxStoragePrefix}:visitorId`;
  const chatboxSessionKey = `${chatboxStoragePrefix}:sessionId`;
  const chatboxConversationKey = `${chatboxStoragePrefix}:conversationId`;
  const chatboxOptOutKey = `${chatboxStoragePrefix}:disabled`;

  const randomChatboxId = (prefix) => {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return `${prefix}_${window.crypto.randomUUID()}`;
    }
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
  };

  const isChatboxStorageDisabled = () => {
    try {
      return localStorage.getItem(chatboxOptOutKey) === "true";
    } catch {
      return false;
    }
  };

  const getStoredChatboxId = (storage, key, prefix) => {
    if (!storage) return randomChatboxId(prefix);

    try {
      const existing = storage.getItem(key);
      if (existing) return existing;
      const generated = randomChatboxId(prefix);
      storage.setItem(key, generated);
      return generated;
    } catch {
      return randomChatboxId(prefix);
    }
  };

  const getVisitorId = () => {
    if (isChatboxStorageDisabled()) return null;
    return getStoredChatboxId(localStorage, chatboxVisitorKey, "visitor");
  };

  const getSessionId = () => {
    if (isChatboxStorageDisabled()) return randomChatboxId("session");
    return getStoredChatboxId(sessionStorage, chatboxSessionKey, "session");
  };

  const getConversationId = () => {
    if (isChatboxStorageDisabled()) return randomChatboxId("conversation");
    try {
      const existing = sessionStorage.getItem(chatboxConversationKey);
      if (existing) return existing;

      const generated = randomChatboxId("conversation");
      sessionStorage.setItem(chatboxConversationKey, generated);
      return generated;
    } catch {
      return randomChatboxId("conversation");
    }
  };

  let visitorId = getVisitorId();
  let sessionId = getSessionId();
  let conversationId = getConversationId();

  const logChatExchange = (question, answerText, options = {}) => {
    if (!chatboxLogEndpoint || !window.fetch) return;

    fetch(chatboxLogEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "omit",
      keepalive: true,
      body: JSON.stringify({
        source: chatboxSource,
        conversationId,
        visitorId,
        sessionId,
        userPrompt: question,
        assistantResponse: answerText,
        quality: options.quality,
        qualityNotes: options.qualityNotes,
        problemType: options.problemType,
        metadata: {
          site: "carrosserie-mounier",
          page: {
            path: window.location.pathname,
            url: window.location.href,
            title: document.title || "",
            referrer: document.referrer || null,
          },
          privacy: {
            visitorIdEnabled: Boolean(visitorId),
            storageDisabled: isChatboxStorageDisabled(),
          },
          ...(options.metadata || {}),
        },
      }),
    }).catch(() => {
      // Logging must never block the visitor experience.
    });
  };

  const answers = [
    {
      keywords: ["devis", "prix", "tarif", "combien", "cout", "coût", "estimation"],
      text: "Pour vous donner un prix sérieux, il faut quelques informations sur le véhicule et les travaux à prévoir. Le plus simple est de demander un devis en ligne avec des photos si possible, ou de nous appeler directement.",
      actions: [
        { label: "Demander un devis", href: new URL("../contact/", scriptBase).href },
        { label: "Appeler", href: "tel:+33608378217" }
      ]
    },
    {
      keywords: ["assurance", "assureur", "sinistre", "accident", "expert", "dossier"],
      text: "Après un sinistre, vous gardez le choix de votre réparateur. L'équipe peut vous accompagner dans les échanges avec l'assurance, l'expert et les étapes de prise en charge.",
      actions: [
        { label: "Nous contacter", href: new URL("../contact/", scriptBase).href }
      ]
    },
    {
      keywords: ["rayure", "carrosserie", "choc", "pare-chocs", "parechoc", "peinture", "aile", "portiere", "portière"],
      text: "Oui, l'atelier intervient sur les rayures, chocs, pare-chocs, éléments de carrosserie et travaux de peinture. Une observation du véhicule permet ensuite de choisir la solution la plus adaptée.",
      actions: [
        { label: "Voir les réalisations", href: new URL("../realisations/", scriptBase).href },
        { label: "Demander un devis", href: new URL("../contact/", scriptBase).href }
      ]
    },
    {
      keywords: ["phare", "optique", "optiques", "renovation", "rénovation", "controle technique", "contrôle technique"],
      text: "Si vos phares sont ternis, la rénovation d'optiques peut améliorer la visibilité, l'esthétique du véhicule et aider au contrôle technique. Le tarif dépend surtout de l'état des phares.",
      actions: [
        { label: "Rénovation optique", href: new URL("../prestations/renovation-optique/", scriptBase).href }
      ]
    },
    {
      keywords: ["covering", "flocage", "marquage", "publicitaire", "utilitaire", "entreprise", "flotte"],
      text: "Oui, l'atelier propose du covering automobile et du flocage professionnel pour véhicules d'entreprise, utilitaires et flottes. Le devis dépend du support, du visuel et du niveau de personnalisation.",
      actions: [
        { label: "Covering", href: new URL("../prestations/covering/", scriptBase).href },
        { label: "Flocage", href: new URL("../prestations/flocage/", scriptBase).href }
      ]
    },
    {
      keywords: ["revision", "révision", "vidange", "frein", "freinage", "courroie", "distribution", "amortisseur", "bougie", "mecanique", "mécanique", "entretien"],
      text: "L'atelier peut aussi vous aider sur plusieurs entretiens mécaniques : révision, vidange, freinage, courroie de distribution, amortisseurs et bougies d'allumage.",
      actions: [
        { label: "Prestations", href: new URL("../prestations/", scriptBase).href }
      ]
    },
    {
      keywords: ["horaire", "horaires", "ouvert", "adresse", "itineraire", "itinéraire", "venir", "telephone", "téléphone", "mail", "email"],
      text: "Pour nous joindre, vous pouvez appeler la Carrosserie Mounier au 06 08 37 82 17, écrire par email ou ouvrir l'itinéraire Google Maps pour venir à l'atelier.",
      actions: [
        { label: "Appeler", href: "tel:+33608378217" },
        { label: "Itinéraire", href: "https://www.google.com/maps/search/?api=1&query=32+Route+du+Pouyault+24750+Tr%C3%A9lissac", external: true }
      ]
    },
    {
      keywords: ["rendez-vous", "rdv", "disponibilite", "disponibilité", "creneau", "créneau", "passer"],
      text: "Je ne peux pas prendre rendez-vous directement ici. Le plus fiable est d'appeler l'atelier ou d'envoyer une demande avec vos coordonnées.",
      actions: [
        { label: "Appeler", href: "tel:+33608378217" },
        { label: "Contact", href: new URL("../contact/", scriptBase).href }
      ]
    },
    {
      keywords: ["recrutement", "emploi", "poste", "candidature", "cv", "travail", "embauche"],
      text: "Vous pouvez déposer une candidature depuis la page recrutement. Le CV est nécessaire, et un court message aide l'équipe à comprendre votre parcours et ce que vous recherchez.",
      actions: [
        { label: "Recrutement", href: new URL("../recrutement/", scriptBase).href }
      ]
    }
  ];

  const normalize = (value) => String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const escapeHtml = (value) => String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  const normalizeSignal = (value) => normalize(value)
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const detectNegativeFeedback = (message) => {
    const text = normalizeSignal(message);
    if ([
      "tu nas pas repondu",
      "tu n as pas repondu",
      "ce nest pas ma question",
      "ce n est pas ma question",
      "tu reponds a cote",
      "tu nas pas compris",
      "tu n as pas compris",
    ].some((phrase) => text.includes(phrase))) {
      return "MISUNDERSTANDING";
    }

    if ([
      "relis ma question",
      "ce nest pas ce que jai demande",
      "ce n est pas ce que j ai demande",
      "pourquoi tu me parles de ca",
    ].some((phrase) => text.includes(phrase))) {
      return "LOST_CONTEXT";
    }

    if (["cest faux", "c est faux", "nimporte quoi", "n importe quoi"].some((phrase) => text.includes(phrase))) {
      return "USER_NEGATIVE_FEEDBACK";
    }

    return null;
  };

  const findAnswer = (question) => {
    const normalizedQuestion = normalize(question);
    return answers.find((answer) => answer.keywords.some((keyword) => normalizedQuestion.includes(normalize(keyword)))) || {
      text: "Je peux vous orienter sur les devis, l'assurance, la carrosserie, les optiques, le covering, le flocage, l'entretien ou le recrutement. Si votre cas est précis, contactez l'atelier : ce sera plus fiable qu'une réponse générale.",
      actions: [
        { label: "Appeler", href: "tel:+33608378217" },
        { label: "Contact", href: new URL("../contact/", scriptBase).href }
      ]
    };
  };

  const preMessages = [
    "Demander un devis",
    "Assurance / sinistre",
    "Horaires / contact",
    "Rénovation optique",
    "Covering / flocage",
  ];

  const chat = document.createElement("section");
  chat.className = "site-chat";
  chat.setAttribute("aria-label", "Assistant Carrosserie Mounier");
  chat.innerHTML = `
    <button class="site-chat-toggle" type="button" aria-expanded="false" aria-label="Ouvrir l'assistant">
      <span Assistant aria-hidden="true"></span>
      
    </button>
    <div class="site-chat-panel" aria-hidden="true">
      <div class="site-chat-header">
        <span>Assistant</span>
        <strong>Carrosserie Mounier</strong>
        <button type="button" aria-label="Fermer l'assistant" data-chat-close>×</button>
      </div>
      <div class="site-chat-updates" hidden></div>
      <div class="site-chat-messages" role="log" aria-live="polite">
        <div class="site-chat-message is-bot">Bonjour. Dites-moi ce qu'il vous faut : devis, assurance, carrosserie, optiques, horaires ou contact atelier.</div>
      </div>
      <p class="site-chat-feedback" hidden></p>
      <p class="site-chat-notice">Les échanges peuvent être enregistrés pour améliorer la qualité des réponses. L'identifiant anonyme sert seulement à retrouver cette conversation sur ce site.</p>
      <div class="site-chat-pre-messages" aria-label="Pré-messages disponibles">
        <span>Pré-messages</span>
        <div class="site-chat-suggestions">
          ${preMessages.map((message) => `<button type="button" data-chat-preset="${message}">${message}</button>`).join("")}
        </div>
      </div>
      <form class="site-chat-form">
        <input type="text" name="question" placeholder="Posez votre question..." autocomplete="off" maxlength="180">
        <button type="submit">Envoyer</button>
      </form>
      <button class="site-chat-optout" type="button">Ne pas conserver ma conversation</button>
    </div>
  `;

  document.body.append(chat);

  const toggleButton = chat.querySelector(".site-chat-toggle");
  const panel = chat.querySelector(".site-chat-panel");
  const closeButton = chat.querySelector("[data-chat-close]");
  const messages = chat.querySelector(".site-chat-messages");
  const badge = chat.querySelector(".site-chat-badge");
  const updatesPanel = chat.querySelector(".site-chat-updates");
  const feedback = chat.querySelector(".site-chat-feedback");
  const optOutButton = chat.querySelector(".site-chat-optout");
  const preMessagesPanel = chat.querySelector(".site-chat-pre-messages");
  const form = chat.querySelector(".site-chat-form");
  const input = form.querySelector("input");
  let unreadUpdates = [];
  let lastExchange = null;

  const setOpen = (isOpen) => {
    chat.classList.toggle("is-open", isOpen);
    toggleButton.setAttribute("aria-expanded", String(isOpen));
    toggleButton.setAttribute("aria-label", isOpen ? "Fermer l'assistant" : "Ouvrir l'assistant");
    panel.setAttribute("aria-hidden", String(!isOpen));
    if (isOpen) markUpdatesSeen();
    if (isOpen) setTimeout(() => input.focus(), 120);
  };

  const renderUpdates = () => {
    if (!updatesPanel || unreadUpdates.length === 0) return;

    updatesPanel.hidden = false;
    updatesPanel.innerHTML = `
      <strong>Une réponse à votre question a été améliorée.</strong>
      ${unreadUpdates.map((update) => `
        <div>
          <span>Question initiale</span>
          <p>${escapeHtml(update.userPrompt || "")}</p>
          <span>Nouvelle réponse</span>
          <p>${escapeHtml(update.improvedResponse || "")}</p>
        </div>
      `).join("")}
    `;
    if (badge) badge.classList.add("is-visible");
  };

  const loadUpdates = () => {
    if (!chatboxUpdatesEndpoint || !visitorId || !window.fetch) return;

    const url = new URL(chatboxUpdatesEndpoint);
    url.searchParams.set("source", chatboxSource);
    url.searchParams.set("visitorId", visitorId);

    fetch(url.toString(), {
      method: "GET",
      credentials: "omit",
    })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        unreadUpdates = Array.isArray(data?.updates) ? data.updates : [];
        renderUpdates();
      })
      .catch(() => undefined);
  };

  const markUpdatesSeen = () => {
    if (!chatboxUpdatesEndpoint || !visitorId || unreadUpdates.length === 0 || !window.fetch) return;

    if (badge) badge.classList.remove("is-visible");
    unreadUpdates.forEach((update) => {
      fetch(chatboxUpdatesEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        keepalive: true,
        body: JSON.stringify({
          source: chatboxSource,
          visitorId,
          updateId: update.id,
        }),
      }).catch(() => undefined);
    });
  };

  const appendMessage = (text, type, actions = [], report = null) => {
    const message = document.createElement("div");
    message.className = `site-chat-message is-${type}`;
    message.textContent = text;
    messages.append(message);

    if (report) {
      const reportButton = document.createElement("button");
      reportButton.type = "button";
      reportButton.className = "site-chat-report";
      reportButton.textContent = "Signaler cette réponse";
      reportButton.addEventListener("click", () => {
        logChatExchange(report.question, report.answer, {
          quality: "BAD",
          problemType: "USER_REPORTED",
          qualityNotes: "Signalement utilisateur depuis la chatbox.",
          metadata: { report: { reportedAnswer: report.answer } },
        });
        feedback.textContent = "Merci, le retour a bien été transmis. Cela nous aide à améliorer les réponses.";
        feedback.hidden = false;
      });
      messages.append(reportButton);
    }

    if (actions.length) {
      const actionList = document.createElement("div");
      actionList.className = "site-chat-actions";
      actions.forEach((action) => {
        const link = document.createElement("a");
        link.href = action.href;
        link.textContent = action.label;
        if (action.external) {
          link.target = "_blank";
          link.rel = "noopener";
        }
        actionList.append(link);
      });
      messages.append(actionList);
    }

    messages.scrollTop = messages.scrollHeight;
  };

  const removePreMessages = () => {
    if (preMessagesPanel && preMessagesPanel.isConnected) preMessagesPanel.remove();
  };

  const submitQuestion = (rawQuestion) => {
    const question = String(rawQuestion || "").trim();
    if (!question) return;

    removePreMessages();
    feedback.hidden = true;
    appendMessage(question, "user");
    input.value = "";

    const problemType = detectNegativeFeedback(question);
    if (problemType) {
      const answerText = lastExchange
        ? `D'accord, je reprends en partant de votre question précédente. ${findAnswer(lastExchange.question).text}`
        : "D'accord, je reprends. Ma réponse précédente n'était pas assez claire : précisez le point à corriger.";

      logChatExchange(question, lastExchange?.answer || answerText, {
        quality: "BAD",
        problemType,
        qualityNotes: "Signal d'incomprehension utilisateur depuis la chatbox.",
        metadata: lastExchange ? { feedback: lastExchange } : undefined,
      });
      setTimeout(() => appendMessage(answerText, "bot"), 220);
      return;
    }

    const answer = findAnswer(question);
    logChatExchange(question, answer.text);
    lastExchange = { question, answer: answer.text };
    setTimeout(() => appendMessage(answer.text, "bot", answer.actions, { question, answer: answer.text }), 220);
  };

  toggleButton.addEventListener("click", () => setOpen(!chat.classList.contains("is-open")));
  closeButton.addEventListener("click", () => setOpen(false));
  chat.querySelectorAll("[data-chat-preset]").forEach((button) => {
    button.addEventListener("click", () => submitQuestion(button.textContent));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitQuestion(input.value);
  });

  optOutButton.addEventListener("click", () => {
    try {
      localStorage.setItem(chatboxOptOutKey, "true");
      localStorage.removeItem(chatboxVisitorKey);
      sessionStorage.removeItem(chatboxSessionKey);
      sessionStorage.removeItem(chatboxConversationKey);
    } catch {
      // Keep the assistant usable even if storage is unavailable.
    }

    visitorId = null;
    sessionId = randomChatboxId("session");
    conversationId = randomChatboxId("conversation");
    unreadUpdates = [];
    if (badge) badge.classList.remove("is-visible");
    if (updatesPanel) updatesPanel.hidden = true;
    optOutButton.textContent = "Conversation non conservée";
    optOutButton.disabled = true;
  });

  if (isChatboxStorageDisabled()) {
    optOutButton.textContent = "Conversation non conservée";
    optOutButton.disabled = true;
  }

  loadUpdates();
}

initMounierChatBox();
