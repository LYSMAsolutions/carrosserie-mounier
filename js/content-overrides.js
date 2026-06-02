(function () {
  function setText(selector, value) {
    if (!value) return;
    document.querySelectorAll(selector).forEach(function (node) {
      node.textContent = value;
    });
  }

  function setAttr(selector, attr, value) {
    if (!value) return;
    document.querySelectorAll(selector).forEach(function (node) {
      node.setAttribute(attr, value);
    });
  }

  function setMeta(name, value) {
    if (!value) return;
    var node = document.querySelector("meta[name='" + name + "']");
    if (!node) {
      node = document.createElement("meta");
      node.setAttribute("name", name);
      document.head.appendChild(node);
    }
    node.setAttribute("content", value);
  }

  function setProperty(property, value) {
    if (!value) return;
    var node = document.querySelector("meta[property='" + property + "']");
    if (!node) {
      node = document.createElement("meta");
      node.setAttribute("property", property);
      document.head.appendChild(node);
    }
    node.setAttribute("content", value);
  }

  function setCanonical(value) {
    if (!value) return;
    var node = document.querySelector("link[rel='canonical']");
    if (!node) {
      node = document.createElement("link");
      node.setAttribute("rel", "canonical");
      document.head.appendChild(node);
    }
    node.setAttribute("href", value);
  }

  function setColor(name, value) {
    if (!value) return;
    document.documentElement.style.setProperty(name, value);
  }

  function getSiteRoot() {
    var script = document.currentScript || document.querySelector("script[src*='content-overrides.js']");
    var src = script ? script.getAttribute("src") || "" : "";
    return src.replace(/js\/content-overrides\.js.*$/, "");
  }

  function pageKey() {
    var path = window.location.pathname;
    if (path.indexOf("/atelier/") !== -1) return "atelier";
    if (path.indexOf("/technologies/") !== -1) return "technologies";
    if (path.indexOf("/prestations/") !== -1) return "prestations";
    if (path.indexOf("/realisations/") !== -1) return "realisations";
    if (path.indexOf("/contact/") !== -1) return "contact";
    return "home";
  }

  function applyContent(content) {
    if (!content) return;

    var root = getSiteRoot();
    var colors = content.colors || {};
    setColor("--ral-7016", colors.primary);
    setColor("--ral-7016-dark", colors.primaryDark);
    setColor("--orange", colors.accent);
    setColor("--orange-soft", colors.accentSoft);
    setColor("--text", colors.text);
    setColor("--muted", colors.muted);
    if (colors.background) document.body.style.background = colors.background;

    var brand = content.brand || {};
    setText("[data-cms='brand.name']", brand.name);
    setAttr("[data-cms='brand.logo'], .logo-img", "src", root + (brand.logo || ""));
    setAttr("[data-cms='brand.logo'], .logo-img", "alt", brand.name);

    var hero = content.hero || {};
    setText("[data-cms='hero.eyebrow']", hero.eyebrow);
    setText("[data-cms='hero.title']", hero.title);
    setText("[data-cms='hero.highlight']", hero.highlight);
    setText("[data-cms='hero.description']", hero.description);
    setText("[data-cms='hero.primaryCta']", hero.primaryCta);
    setText("[data-cms='hero.secondaryCta']", hero.secondaryCta);
    setText("[data-cms='hero.panelTitle']", hero.panelTitle);
    setText("[data-cms='hero.panelText']", hero.panelText);

    if (hero.image) {
      document.querySelectorAll(".hero").forEach(function (node) {
        node.style.background =
          "linear-gradient(90deg, rgba(56, 62, 66, 0.96) 0%, rgba(56, 62, 66, 0.72) 42%, rgba(56, 62, 66, 0.18) 82%), url('" +
          root + hero.image +
          "') center right / cover no-repeat";
      });
    }

    var sections = content.sections || {};
    setText("[data-cms='sections.processTitle']", sections.processTitle);
    setText("[data-cms='sections.processDescription']", sections.processDescription);
    setText("[data-cms='sections.atelierTitle']", sections.atelierTitle);
    setText("[data-cms='sections.atelierText']", sections.atelierText);
    setText("[data-cms='sections.ctaTitle']", sections.ctaTitle);
    setText("[data-cms='sections.ctaText']", sections.ctaText);

    var currentPage = (content.pages || {})[pageKey()];
    var pageTitle = "";
    var pageDescription = "";
    if (currentPage) {
      setText(".section-dark .kicker", currentPage.kicker);
      setText(".section-dark .section-title, .section-dark h1.section-title", currentPage.title);
      setText(".section-dark .section-desc", currentPage.description);
      pageTitle = currentPage.seoTitle || "";
      pageDescription = currentPage.seoDescription || "";
      if (pageTitle) document.title = pageTitle;
      setMeta("description", pageDescription);
    }

    var contact = content.contact || {};
    setText("[data-cms='contact.address']", contact.address);
    setText("[data-cms='contact.phone']", contact.phone);
    setText("[data-cms='contact.email']", contact.email);
    setText("[data-cms='contact.hours']", contact.hours);

    var seo = content.seo || {};
    if (pageKey() === "home" && seo.title) document.title = seo.title;
    var effectiveTitle = pageTitle || seo.ogTitle || seo.title;
    var effectiveDescription = pageDescription || seo.ogDescription || seo.description;
    if (pageKey() === "home") {
      setMeta("description", seo.description);
      setCanonical(seo.canonical);
      setMeta("keywords", seo.keywords);
      setMeta("robots", seo.robots);
    }
    setProperty("og:type", "website");
    setProperty("og:title", effectiveTitle);
    setProperty("og:description", effectiveDescription);
    if (seo.ogImage) setProperty("og:image", root + seo.ogImage);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", effectiveTitle);
    setMeta("twitter:description", effectiveDescription);
    if (seo.ogImage) setMeta("twitter:image", root + seo.ogImage);
  }

  window.addEventListener("message", function (event) {
    if (!event.data || event.data.type !== "mounier-preview") return;
    applyContent(event.data.content);
  });

  fetch(getSiteRoot() + "content/site.json")
    .then(function (response) { return response.ok ? response.json() : null; })
    .then(applyContent)
    .catch(function () {});
})();


