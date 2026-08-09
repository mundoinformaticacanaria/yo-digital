function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDuration(ms = 0) {
  return `${(Number(ms) / 1000).toFixed(1)}s`;
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
            <button class="mode-card training-card" data-action="training">
              <strong>Entrenamiento de voz</strong>
              <span>Grabar localmente un dataset para un futuro clon de voz.</span>
            </button>
          </div>
          <p class="privacy-note">Sin backend de la aplicación. Las respuestas de la consulta no se guardan. Las muestras de voz, si decides grabarlas, se almacenan solo en este dispositivo.</p>
        </section>
      </main>`;

    this.root.querySelectorAll("[data-mode]").forEach((button) => {
      button.addEventListener("click", () => this.handlers.onStart?.(button.dataset.mode));
    });
    this.root.querySelector('[data-action="training"]').addEventListener("click", () => this.handlers.onTraining?.());
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

  renderTraining(state) {
    const samples = state.samples
      .map((sample) => `
        <article class="sample-row">
          <div>
            <strong>${formatDuration(sample.durationMs)}</strong>
            <span>${escapeHtml(sample.prompt || "(sin transcripción)")}</span>
          </div>
          <div class="sample-actions">
            <button class="ghost" data-download="${escapeHtml(sample.id)}">Descargar</button>
            <button class="ghost danger" data-remove="${escapeHtml(sample.id)}">Borrar</button>
          </div>
        </article>`)
      .join("");

    this.root.innerHTML = `
      <main class="shell">
        <section class="panel training-panel">
          <div class="progress-row">
            <div>
              <p class="eyebrow">ENTRENAMIENTO DE VOZ · 100% LOCAL</p>
              <h2>Construye tu dataset de voz.</h2>
            </div>
            <button class="ghost" data-action="home">Salir</button>
          </div>
          <p class="lead compact">Los audios se guardan en IndexedDB en este navegador. No se suben a ningún servidor de Yo-digital.</p>
          <div class="training-grid">
            <section class="training-main">
              <div class="phrase-box">
                <span>Frase ${state.phraseIndex + 1}/${state.phraseCount}</span>
                <blockquote>“${escapeHtml(state.phrase)}”</blockquote>
                <button class="secondary" data-action="next-phrase">Otra frase</button>
              </div>
              <canvas id="waveform" width="720" height="120" aria-label="Forma de onda del audio"></canvas>
              <div class="actions">
                <button class="primary" data-action="record">${state.recording ? "Detener y guardar" : "🎙 Grabar"}</button>
                ${state.recording ? '<button class="secondary" data-action="cancel-recording">Cancelar</button>' : ""}
              </div>
            </section>
            <aside class="dataset-panel">
              <div class="stats-grid">
                <div><strong>${state.summary.count}</strong><span>clips</span></div>
                <div><strong>${state.summary.totalMinutes.toFixed(2)}</strong><span>min</span></div>
                <div><strong>${state.summary.averageSeconds.toFixed(1)}s</strong><span>promedio</span></div>
              </div>
              <div class="quality"><span style="width:${state.summary.progressPercent}%"></span></div>
              <p class="privacy-note">${escapeHtml(state.summary.quality)}</p>
              <div class="actions dataset-actions">
                <button class="primary" data-action="export-zip" ${state.samples.length ? "" : "disabled"}>Descargar ZIP</button>
                <button class="secondary" data-action="export-files" ${state.samples.length ? "" : "disabled"}>Audios sueltos</button>
                <button class="secondary danger" data-action="clear" ${state.samples.length ? "" : "disabled"}>Borrar todo</button>
              </div>
            </aside>
          </div>
          <section class="sample-list">
            <h3>Grabaciones (${state.samples.length})</h3>
            ${samples || '<p class="privacy-note">Aún no hay audios. Graba la primera frase cuando quieras.</p>'}
          </section>
        </section>
      </main>`;

    this.root.querySelector('[data-action="home"]').addEventListener("click", () => this.handlers.onHome?.());
    this.root.querySelector('[data-action="next-phrase"]').addEventListener("click", () => this.handlers.onNextPhrase?.());
    this.root.querySelector('[data-action="record"]').addEventListener("click", () => this.handlers.onToggleRecording?.(this.root.querySelector("#waveform")));
    this.root.querySelector('[data-action="cancel-recording"]')?.addEventListener("click", () => this.handlers.onCancelRecording?.());
    this.root.querySelector('[data-action="export-zip"]').addEventListener("click", () => this.handlers.onExportZip?.());
    this.root.querySelector('[data-action="export-files"]').addEventListener("click", () => this.handlers.onExportFiles?.());
    this.root.querySelector('[data-action="clear"]').addEventListener("click", () => this.handlers.onClearSamples?.());
    this.root.querySelectorAll("[data-remove]").forEach((button) => button.addEventListener("click", () => this.handlers.onRemoveSample?.(button.dataset.remove)));
    this.root.querySelectorAll("[data-download]").forEach((button) => button.addEventListener("click", () => this.handlers.onDownloadSample?.(button.dataset.download)));
  }

  renderError(message) {
    const error = document.createElement("div");
    error.className = "toast error";
    error.textContent = message;
    this.root.append(error);
    setTimeout(() => error.remove(), 4500);
  }
}
