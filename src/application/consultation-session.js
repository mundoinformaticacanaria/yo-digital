import { QUESTION_BANK, pickQuestionVariant } from "../domain/questions.js";
import { buildRecommendation } from "../domain/recommendation-engine.js";

export class ConsultationSession {
  constructor({ mode = "app", random = Math.random } = {}) {
    if (!QUESTION_BANK[mode]) {
      throw new TypeError(`Unsupported consultation mode: ${mode}`);
    }

    this.mode = mode;
    this.random = random;
    this.answers = {};
    this.currentIndex = 0;
  }

  get questions() {
    return QUESTION_BANK[this.mode];
  }

  get isComplete() {
    return this.currentIndex >= this.questions.length;
  }

  currentQuestion() {
    if (this.isComplete) return null;

    const question = this.questions[this.currentIndex];
    return {
      ...question,
      text: pickQuestionVariant(question, this.random),
      index: this.currentIndex,
      total: this.questions.length,
    };
  }

  answer(value) {
    if (this.isComplete) {
      throw new Error("Consultation session is already complete");
    }

    const text = String(value ?? "").trim();
    if (!text) {
      throw new TypeError("Answer cannot be empty");
    }

    const question = this.questions[this.currentIndex];
    this.answers[question.key] = text;
    this.currentIndex += 1;

    return this.isComplete ? this.result() : this.currentQuestion();
  }

  result() {
    if (!this.isComplete) {
      throw new Error("Consultation session is not complete yet");
    }

    return buildRecommendation(this.answers, this.mode);
  }
}
