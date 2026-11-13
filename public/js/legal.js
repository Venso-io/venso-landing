"use strict";
(() => {
  const data = window.VENSO_LEGAL_CONTENT;
  const docId = document.body.dataset.legalDoc;
  if (!data || !data.docs[docId]) return;
  const allowed = ["ru", "kk", "en"];
  const params = new URLSearchParams(window.location.search);
  let lang = params.get("lang") || localStorage.getItem("venso_lang") || "ru";
  if (!allowed.includes(lang)) lang = "ru";
  function setText(selector, value) {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  }
  function updateLanguage(next, updateUrl = false) {
    if (!allowed.includes(next)) return;
    lang = next;
    document.documentElement.lang = lang;
    localStorage.setItem("venso_lang", lang);
    const d = data.docs[docId][lang];
    const label = data.ui[lang];
    setText("[data-legal-title]", d.title);
    setText("[data-legal-subtitle]", d.subtitle);
    setText("[data-legal-back]", label.back);
    setText("[data-legal-draft]", label.draft);
    setText("[data-legal-updated]", label.updated);
    setText("[data-legal-other]", label.other);
    setText("[data-legal-contact]", label.contact);
    document.title = d.title + " — VENSO";
    document.querySelectorAll("[data-legal-nav]").forEach(link => {
      const item = link.dataset.legalNav;
      link.textContent = data.titles[lang][item];
      link.href = "/legal/" + item + ".html?lang=" + lang;
      if (item === docId) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
    const container = document.querySelector("#legalContent");
    if (container) {
      container.replaceChildren();
      for (const section of d.sections) {
        const block = document.createElement("section");
        block.className = "legal-section";
        const heading = document.createElement("h2");
        heading.textContent = section.heading;
        const paragraph = document.createElement("p");
        paragraph.textContent = section.body;
        block.append(heading, paragraph);
        container.appendChild(block);
      }
    }
    document.querySelectorAll("[data-legal-lang]").forEach(button => {
      const active = button.dataset.legalLang === lang;
      button.setAttribute("aria-pressed", String(active));
      button.classList.toggle("active", active);
    });
    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", lang);
      history.replaceState(null, "", url);
    }
  }
  document.querySelectorAll("[data-legal-lang]").forEach(button => {
    button.addEventListener("click", () => updateLanguage(button.dataset.legalLang, true));
  });
  updateLanguage(lang);
})();
