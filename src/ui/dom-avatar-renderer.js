const STATE_LABELS = Object.freeze({
  idle: "Disponible",
  listening: "Escuchando",
  thinking: "Pensando",
  speaking: "Hablando",
});

export class DomAvatarRenderer {
  constructor({ root, imageUrl = "", initials = "XH" } = {}) {
    this.root = root ?? null;
    this.imageUrl = String(imageUrl ?? "").trim();
    this.initials = String(initials ?? "XH").trim() || "XH";
  }

  ensureMarkup() {
    if (!this.root || this.root.dataset.avatarReady === "true") return;

    const visual = this.imageUrl
      ? `<img class="avatar-media" src="${this.imageUrl}" alt="Avatar de Xerach Hernández">`
      : `<span class="avatar-initials" aria-hidden="true">${this.initials}</span>`;

    this.root.innerHTML = `
      <div class="avatar-frame">
        <div class="avatar-visual">${visual}</div>
        <div class="avatar-presence">
          <span class="avatar-presence-dot" aria-hidden="true"></span>
          <span data-avatar-status>Disponible</span>
        </div>
      </div>`;
    this.root.dataset.avatarReady = "true";
  }

  render({ state }) {
    if (!this.root) return;
    this.ensureMarkup();

    this.root.dataset.avatarState = state;
    this.root.setAttribute("aria-label", `Avatar: ${STATE_LABELS[state] ?? state}`);

    const status = this.root.querySelector("[data-avatar-status]");
    if (status) status.textContent = STATE_LABELS[state] ?? state;
  }
}
