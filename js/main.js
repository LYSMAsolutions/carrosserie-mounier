const nav = document.querySelector(".main-nav");
const toggle = document.querySelector(".mobile-toggle");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("is-open"));
  });
}

const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();
