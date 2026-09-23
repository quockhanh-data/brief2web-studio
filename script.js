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

const dropdown = document.querySelector('[data-dropdown]');
const dropdownButton = dropdown.querySelector('button');
const panel = dropdown.querySelector('.dropdown-panel');
function toggleDropdown(open) {
  dropdownButton.setAttribute('aria-expanded', String(open));
  panel.hidden = !open;
}
dropdownButton.addEventListener('click', () => toggleDropdown(panel.hidden));
dropdown.addEventListener('mouseenter', () => {
  if (matchMedia('(hover: hover) and (min-width: 941px)').matches) toggleDropdown(true);
});
dropdown.addEventListener('mouseleave', () => {
  if (!dropdown.contains(document.activeElement)) toggleDropdown(false);
});
dropdown.addEventListener('focusout', (event) => {
  if (!dropdown.contains(event.relatedTarget)) toggleDropdown(false);
});
dropdownButton.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowDown') { event.preventDefault(); toggleDropdown(true); panel.querySelector('a').focus(); }
});
document.addEventListener('click', (event) => {
  if (!dropdown.contains(event.target)) toggleDropdown(false);
  if (!header.contains(event.target)) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (!panel.hidden) { toggleDropdown(false); dropdownButton.focus(); }
    else { closeMenu(); menuToggle.focus(); }
  }
});
nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) { toggleDropdown(false); closeMenu(); }
});
