function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export class AppView {
  constructor({ root }) {
    if (!root) throw new TypeError("App root element is required");
    this.root = root;
    this.handlers = {};
  }

  bind(handlers) {
    this.handlers = handlers;
  }

  renderHome() {
    this.root.innerHTML = `
      <main class="shell">
        <section class="hero panel">
          <p class="eyebrow">YO · DIGITAL</p>
          <h1>Consultoría tecnológica, sin humo.</h1>
          <p class="lead">Cuéntame el problema. Te haré unas preguntas y te devolveré una primera recomendación técnica.</p>
          <div class="mode-grid">
            <button class="mode-card" data-mode="app">
              <strong>Aplicación a medida</strong>
              <span>Definir necesidad, alcance y arquitectura inicial.</span>
            </button>
            <button class="mode-card" data-mode="arch">
              <strong>Arquitectura / consultoría</strong>
              <span>Analizar un sistema existente y proponer evolución.</span>
            </button>
          </div>
          <p class="privacy-note">Sin backend de la aplicación. Las respuestas de la consulta no se guardan. Las muestras de voz, si decides grabarlas, se almacenan solo en este dispositivo.</p>
        </section>
      </main>`;

    this.root.querySelectorAll("[data-mode]").forEach((button) => {
      button.addEventListener("click", () => this.handlers.onStart?.(button.dataset.mode));
    });
  }

  renderQuestion(question, { interim = "", speechSupported = false } = {}) {
    this.root.innerHTML = `
      <main class="shell">
        <section class="panel consultation-panel">
          <div class="progress-row">
            <span>Pregunta ${question.index + 1} de ${question.total}</span>
            <button class="ghost" data-action="home">Salir</button>
          </div>
          <div class="progress"><span style="width:${((question.index + 1) / question.total) * 100}%"></span></div>
          <h2>${escapeHtml(question.text)}</h2>
          <form data-form="answer">
            <textarea name="answer" rows="5" placeholder="${escapeHtml(question.placeholder)}">${escapeHtml(interim)}</textarea>
            <div class="actions">
              <button class="primary" type="submit">Continuar</button>
              ${speechSupported ? '<button class="secondary" type="button" data-action="listen">🎙 Hablar</button>' : ""}
            </div>
          </form>
        </section>
      </main>`;

    this.root.querySelector('[data-action="home"]').addEventListener("click", () => this.handlers.onHome?.());
    this.root.querySelector('[data-form="answer"]').addEventListener("submit", (event) => {
      event.preventDefault();
      const value = new FormData(event.currentTarget).get("answer");
      this.handlers.onAnswer?.(value);
    });
    this.root.querySelector('[data-action="listen"]')?.addEventListener("click", () => this.handlers.onListen?.());
  }

  setInterimTranscript(text) {
    const textarea = this.root.querySelector('textarea[name="answer"]');
    if (textarea) textarea.value = text;
  }

  renderResult(result) {
    const architecture = Object.entries(result.arquitectura)
      .map(([key, value]) => `<article><h3>${escapeHtml(key)}</h3><p>${escapeHtml(value)}</p></article>`)
      .join("");
    const roadmap = Object.entries(result.roadmap)
      .map(([key, value]) => `<li><strong>${escapeHtml(key)}</strong><span>${escapeHtml(value)}</span></li>`)
      .join("");
    const next = result.proximos.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

    this.root.innerHTML = `
      <main class="shell result-shell">
        <section class="panel">
          <p class="eyebrow">PRIMER DIAGNÓSTICO</p>
          <h2>${escapeHtml(result.diagnostico)}</h2>
          <div class="architecture-grid">${architecture}</div>
          <h3>Roadmap</h3>
          <ol class="roadmap">${roadmap}</ol>
          <h3>Próximos pasos</h3>
          <ul class="next-steps">${next}</ul>
          <div class="actions">
            <button class="primary" data-action="restart">Nueva consulta</button>
            <button class="secondary" data-action="speak">Escuchar resumen</button>
          </div>
        </section>
      </main>`;

    this.root.querySelector('[data-action="restart"]').addEventListener("click", () => this.handlers.onHome?.());
    this.root.querySelector('[data-action="speak"]').addEventListener("click", () => this.handlers.onSpeakResult?.(result));
  }

  renderError(message) {
    const error = document.createElement("div");
    error.className = "toast error";
    error.textContent = message;
    this.root.append(error);
    setTimeout(() => error.remove(), 4500);
  }
}
