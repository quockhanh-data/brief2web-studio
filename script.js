const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const filters = document.querySelectorAll("[data-filter]");
const cards = document.querySelectorAll("[data-category]");
const search = document.querySelector("[data-search]");

function syncHeader() {
  header?.classList.toggle("scrolled", window.scrollY > 24);
}

function closeMenu() {
  document.body.classList.remove("menu-open");
  nav?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
}

function filterCards() {
  const active = document.querySelector("[data-filter].active")?.dataset.filter || "all";
  const query = (search?.value || "").trim().toLowerCase();

  cards.forEach((card) => {
    const matchesCategory = active === "all" || card.dataset.category === active;
    const matchesSearch = card.textContent.toLowerCase().includes(query);
    card.classList.toggle("hidden", !matchesCategory || !matchesSearch);
  });
}

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

menuToggle?.addEventListener("click", () => {
  const willOpen = !nav?.classList.contains("open");
  document.body.classList.toggle("menu-open", willOpen);
  nav?.classList.toggle("open", willOpen);
  menuToggle.setAttribute("aria-expanded", String(willOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    closeMenu();
  }
});

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    filterCards();
  });
});

search?.addEventListener("input", filterCards);
