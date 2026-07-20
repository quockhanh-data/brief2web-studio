const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");

function syncHeader() {
  header?.classList.toggle("scrolled", window.scrollY > 24);
}

function closeMenu() {
  document.body.classList.remove("menu-open");
  nav?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
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
  if (event.target instanceof HTMLAnchorElement) closeMenu();
});
