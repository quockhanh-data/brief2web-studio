const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
let filters = [];
let cards = [];
let search;

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
    card.hidden = !matchesCategory || !matchesSearch;
  });
  const empty = document.querySelector("[data-news-empty]");
  if (empty) empty.hidden = [...cards].some(card => !card.hidden);
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

addEventListener('news-ready', event => {
  filters = document.querySelectorAll('#app-page [data-filter]');
  cards = document.querySelectorAll('#app-page [data-category]');
  search = document.querySelector('#app-page [data-search]');
  filters.forEach(button => {
    button.classList.toggle('active', button.dataset.filter === event.detail);
    button.setAttribute('aria-pressed', String(button.classList.contains('active')));
    button.addEventListener('click', () => {
      filters.forEach(item => { item.classList.remove('active'); item.setAttribute('aria-pressed', 'false'); });
      button.classList.add('active'); button.setAttribute('aria-pressed', 'true'); filterCards();
    });
  });
  if (![...filters].some(button => button.classList.contains('active'))) filters[0].classList.add('active');
  search.addEventListener('input', filterCards); filterCards();
});

document.querySelectorAll('[data-dropdown]').forEach(dropdown => {
const dropdownButton = dropdown.querySelector('button');
const panel = dropdown.querySelector('.dropdown-panel');
function toggleDropdown(open) {
  dropdownButton.setAttribute('aria-expanded', String(open));
  panel.hidden = !open;
}
dropdownButton.addEventListener('click', (event) => {
  // Hover already opens the desktop menu before the pointer click arrives.
  // Keep that click open; keyboard and mobile still toggle normally.
  const desktopPointer = event.detail > 0 && matchMedia('(hover: hover) and (min-width: 941px)').matches;
  toggleDropdown(desktopPointer || panel.hidden);
  if (desktopPointer && dropdownButton.hasAttribute("data-news-toggle")) location.hash = "/news";
});
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

});
