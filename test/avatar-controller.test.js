import test from "node:test";
import assert from "node:assert/strict";

import { AvatarController, AVATAR_STATES } from "../src/application/avatar-controller.js";

test("avatar starts idle and notifies its renderer", () => {
  const renders = [];
  const avatar = new AvatarController({
    renderer: { render: (event) => renders.push(event) },
  });

  assert.equal(avatar.state, AVATAR_STATES.IDLE);
  assert.equal(renders.length, 1);
  assert.deepEqual(renders[0], {
    state: AVATAR_STATES.IDLE,
    previousState: null,
    context: {},
  });
});

test("avatar exposes provider-independent interaction states", () => {
  const renders = [];
  const avatar = new AvatarController({
    renderer: { render: (event) => renders.push(event) },
  });

  avatar.listening({ source: "microphone" });
  avatar.thinking();
  avatar.speaking({ source: "tts" });
  avatar.idle();

  assert.deepEqual(
    renders.map(({ state }) => state),
    ["idle", "listening", "thinking", "speaking", "idle"],
  );
  assert.equal(renders[1].context.source, "microphone");
  assert.equal(renders[3].context.source, "tts");
});

test("avatar rejects unknown states", () => {
  const avatar = new AvatarController();
  assert.throws(() => avatar.setState("dancing"), /Unsupported avatar state/);
});

test("avatar requires a renderer contract when one is supplied", () => {
  assert.throws(() => new AvatarController({ renderer: {} }), /must implement render/);
});
