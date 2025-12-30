/* global netlifyIdentity */

const NAV = [
  { key: "cameron", label: "Cameron", href: "cameron.html" },
  { key: "michelle", label: "Michelle", href: "michelle.html" },
  { key: "wayne", label: "Wayne", href: "wayne.html" },
  { key: "amari", label: "Amari", href: "amari.html" },
  { key: "john", label: "John", href: "john.html" },
];

function $(sel) { return document.querySelector(sel); }
function $all(sel) { return Array.from(document.querySelectorAll(sel)); }

function highlightNav() {
  $all("nav a").forEach(a => {
    if (a.getAttribute("data-key") === window.PAGE_KEY) {
      a.style.color = "#1e3a8a";
      a.style.textDecoration = "underline";
    }
  });
}

function wireCollapsibles() {
  const coll = document.getElementsByClassName("collapsible");
  for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
      this.classList.toggle("active");
      const content = this.nextElementSibling;
      content.style.display = (content.style.display === "block") ? "none" : "block";
    });
  }
}

function wireCheckboxPersistence() {
  const checkboxes = document.querySelectorAll(".checkbox-section input");
  checkboxes.forEach(cb => {
    const id = cb.id;
    cb.checked = localStorage.getItem(id) === "true";
    cb.addEventListener("change", () => localStorage.setItem(id, cb.checked));
  });
}

function renderNav() {
  const nav = $("nav");
  nav.innerHTML = NAV.map(item => `<a href="${item.href}" data-key="${item.key}">${item.label}</a>`).join("\n");
}

async function getJwt() {
  const user = netlifyIdentity.currentUser();
  if (!user) return null;
  return await user.jwt();
}

async function loadProtectedContent() {
  const jwt = await getJwt();
  if (!jwt) return;

  const res = await fetch(`/.netlify/functions/get-page?page=${encodeURIComponent(window.PAGE_KEY)}`, {
    headers: { Authorization: `Bearer ${jwt}` }
  });

  if (res.status === 401 || res.status === 403) {
    showLoggedOut("Please log in to view this page.");
    return;
  }
  if (!res.ok) {
    showLoggedOut("Something went wrong loading this page.");
    return;
  }

  const data = await res.json();
  $("#pageTitle").textContent = data.title;
  $("#pageBadge").textContent = data.badge;
  $("#focusText").textContent = data.focus;

  const warningUl = $("#warningsList");
  warningUl.innerHTML = "";
  data.warnings.forEach(w => {
    const li = document.createElement("li");
    li.textContent = w;
    warningUl.appendChild(li);
  });

  const guidanceUl = $("#guidanceList");
  guidanceUl.innerHTML = "";
  data.guidance.forEach(g => {
    const li = document.createElement("li");
    li.textContent = g;
    guidanceUl.appendChild(li);
  });

  const cb = $("#focusCheckbox");
  cb.id = data.checkboxId;
  cb.checked = localStorage.getItem(cb.id) === "true";
  cb.addEventListener("change", () => localStorage.setItem(cb.id, cb.checked));

  showLoggedIn();
  highlightNav();
  wireCollapsibles();
}

function showLoggedOut(message) {
  $("#loggedOut").classList.remove("hidden");
  $("#loggedIn").classList.add("hidden");
  $("#noticeText").textContent = message || "Please log in.";
}

function showLoggedIn() {
  $("#loggedOut").classList.add("hidden");
  $("#loggedIn").classList.remove("hidden");
}

function initIdentity() {
  netlifyIdentity.init();

  $("#btnLogin").addEventListener("click", () => netlifyIdentity.open("login"));
  $("#btnSignup").addEventListener("click", () => netlifyIdentity.open("signup"));
  $("#btnLogout").addEventListener("click", () => netlifyIdentity.logout());

  netlifyIdentity.on("init", user => {
    if (user) loadProtectedContent();
    else showLoggedOut("Please log in to view this page.");
  });

  netlifyIdentity.on("login", () => {
    netlifyIdentity.close();
    loadProtectedContent();
  });

  netlifyIdentity.on("logout", () => {
    showLoggedOut("Logged out.");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderNav();
  initIdentity();
});
