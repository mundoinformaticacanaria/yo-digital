import { extensionForMimeType, summarizeVoiceDataset } from "../domain/voice-dataset.js";

function downloadBlob(blob, filename, { documentRef = document, urlRef = URL } = {}) {
  const url = urlRef.createObjectURL(blob);
  const anchor = documentRef.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => urlRef.revokeObjectURL(url), 1000);
}

export class VoiceDatasetExporter {
  constructor({ windowRef = globalThis.window, documentRef = globalThis.document, urlRef = globalThis.URL } = {}) {
    this.windowRef = windowRef;
    this.documentRef = documentRef;
    this.urlRef = urlRef;
  }

  downloadSample(sample) {
    const extension = extensionForMimeType(sample.mimeType);
    const date = new Date(sample.timestamp).toISOString().slice(0, 19).replaceAll(":", "-");
    downloadBlob(sample.blob, `${sample.id}-${date}.${extension}`, this);
  }

  downloadAllIndividually(samples) {
    samples.forEach((sample, index) => {
      setTimeout(() => this.downloadSample(sample), index * 400);
    });
  }

  async loadZipLibrary() {
    if (this.windowRef.JSZip) return this.windowRef.JSZip;

    return new Promise((resolve, reject) => {
      const script = this.documentRef.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
      script.onload = () => resolve(this.windowRef.JSZip);
      script.onerror = () => reject(new Error("Unable to load JSZip"));
      this.documentRef.head.appendChild(script);
    });
  }

  async downloadZip(samples) {
    if (!samples.length) return { fallback: false };

    try {
      const JSZip = await this.loadZipLibrary();
      const zip = new JSZip();
      const folder = zip.folder("yo-digital-voice-dataset");
      const summary = summarizeVoiceDataset(samples);

      samples.forEach((sample, index) => {
        const extension = extensionForMimeType(sample.mimeType);
        folder.file(`${String(index + 1).padStart(3, "0")}_${sample.id}.${extension}`, sample.blob);
      });

      const transcriptRows = samples.map((sample, index) => {
        const duration = Number(sample.durationMs ?? 0) / 1000;
        return `${index + 1}. [${duration.toFixed(1)}s] ${sample.prompt || sample.transcript || "(sin transcripción)"}`;
      });

      folder.file(
        "README.txt",
        `Yo-digital voice dataset\nTotal: ${samples.length} muestras, ${summary.totalMinutes.toFixed(2)} min\nGenerado: ${new Date().toISOString()}\n\nTranscripciones:\n${transcriptRows.join("\n")}`,
      );
      folder.file(
        "transcripts.json",
        JSON.stringify(
          samples.map((sample) => ({
            id: sample.id,
            transcript: sample.prompt || sample.transcript || "",
            durationMs: sample.durationMs ?? 0,
            timestamp: sample.timestamp,
          })),
          null,
          2,
        ),
      );

      const blob = await zip.generateAsync({ type: "blob" });
      downloadBlob(blob, `yo-digital-voz-${new Date().toISOString().slice(0, 10)}.zip`, this);
      return { fallback: false };
    } catch {
      this.downloadAllIndividually(samples);
      return { fallback: true };
    }
  }
}
