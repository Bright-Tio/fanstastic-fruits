
// Highlight current nav
const links = document.querySelectorAll("nav a");
links.forEach(link => {
    if (link.href === window.location.href) {
        link.style.color = "#1e3a8a";
        link.style.textDecoration = "underline";
    }
});

// Collapsible sections
const coll = document.getElementsByClassName("collapsible");
for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        const content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
}

// Save checkbox state in localStorage
const checkboxes = document.querySelectorAll(".checkbox-section input");
checkboxes.forEach(cb => {
    const id = cb.id;
    cb.checked = localStorage.getItem(id) === "true";
    cb.addEventListener("change", () => {
        localStorage.setItem(id, cb.checked);
    });
});

/* =====================
   MULTI-THEME PICKER + SMOOTH TRANSITIONS
   ===================== */
(function () {
  const THEMES = [
    { key: "light",  label: "Light",  swatch: "#f4f6f8" },
    { key: "dark",   label: "Dark",   swatch: "#0f172a" },
    { key: "slate",  label: "Slate",  swatch: "#0b1220" },
    { key: "sepia",  label: "Sepia",  swatch: "#fbf4e9" },
    { key: "forest", label: "Forest", swatch: "#0b1b12" },
    { key: "rose",   label: "Rose",   swatch: "#fff1f2" },
  ];

  function applyTheme(themeKey) {
    const key = themeKey || "light";
    document.documentElement.setAttribute("data-theme", key);
    localStorage.setItem("theme", key);
    updatePressed(key);
    updateToggleLabel(key);
  }

  function updateToggleLabel(key) {
    // Show current theme name on the button
    const found = THEMES.find(t => t.key === key);
    toggleBtn.textContent = `Theme: ${found ? found.label : "Light"}`;
  }

  function updatePressed(key) {
    if (!panel) return;
    panel.querySelectorAll(".theme-option").forEach(btn => {
      const pressed = btn.getAttribute("data-theme") === key;
      btn.setAttribute("aria-pressed", pressed ? "true" : "false");
    });
  }

  // Initialize theme from storage (default light)
  const stored = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", stored);

  // Build UI
  const toggleBtn = document.createElement("button");
  toggleBtn.className = "theme-toggle";
  toggleBtn.type = "button";
  document.body.appendChild(toggleBtn);

  const panel = document.createElement("div");
  panel.className = "theme-panel hidden";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Theme selection");

  panel.innerHTML = `
    <h3>Choose a theme</h3>
    <div class="theme-options">
      ${THEMES.map(t => `
        <button class="theme-option" type="button" data-theme="${t.key}" aria-pressed="false">
          <span class="swatch" style="background:${t.swatch}"></span>
          <span>${t.label}</span>
        </button>
      `).join("")}
    </div>
  `;
  document.body.appendChild(panel);

  function openPanel() {
    panel.classList.remove("hidden");
  }
  function closePanel() {
    panel.classList.add("hidden");
  }
  function togglePanel() {
    panel.classList.toggle("hidden");
  }

  toggleBtn.addEventListener("click", togglePanel);

  // Click selection
  panel.addEventListener("click", (e) => {
    const btn = e.target.closest(".theme-option");
    if (!btn) return;
    applyTheme(btn.getAttribute("data-theme"));
    closePanel();
  });

  // Close on outside click / Esc
  document.addEventListener("click", (e) => {
    const isInPanel = panel.contains(e.target);
    const isToggle = toggleBtn.contains(e.target);
    if (!isInPanel && !isToggle) closePanel();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePanel();
  });

  // Finalize initial state
  updateToggleLabel(stored);
  updatePressed(stored);
})();
