export const AVATAR_STATES = Object.freeze({
  IDLE: "idle",
  LISTENING: "listening",
  THINKING: "thinking",
  SPEAKING: "speaking",
});

const VALID_STATES = new Set(Object.values(AVATAR_STATES));
const NOOP_RENDERER = Object.freeze({ render() {} });

/**
 * Provider-independent avatar state coordinator.
 *
 * Renderers implement a single method:
 *   render({ state, previousState, context })
 *
 * The renderer may be a simple DOM representation today or a realtime
 * avatar engine in the future. Application code only depends on this
 * controller and never on a concrete avatar provider.
 */
export class AvatarController {
  constructor({ renderer = NOOP_RENDERER, initialState = AVATAR_STATES.IDLE } = {}) {
    if (!renderer || typeof renderer.render !== "function") {
      throw new TypeError("Avatar renderer must implement render()");
    }
    if (!VALID_STATES.has(initialState)) {
      throw new RangeError(`Unsupported avatar state: ${initialState}`);
    }

    this.renderer = renderer;
    this.state = initialState;
    this.renderer.render({ state: this.state, previousState: null, context: {} });
  }

  setState(nextState, context = {}) {
    if (!VALID_STATES.has(nextState)) {
      throw new RangeError(`Unsupported avatar state: ${nextState}`);
    }

    const previousState = this.state;
    this.state = nextState;
    this.renderer.render({ state: nextState, previousState, context });
    return this.state;
  }

  idle(context) {
    return this.setState(AVATAR_STATES.IDLE, context);
  }

  listening(context) {
    return this.setState(AVATAR_STATES.LISTENING, context);
  }

  thinking(context) {
    return this.setState(AVATAR_STATES.THINKING, context);
  }

  speaking(context) {
    return this.setState(AVATAR_STATES.SPEAKING, context);
  }

  reset() {
    return this.idle({ reason: "reset" });
  }
}
