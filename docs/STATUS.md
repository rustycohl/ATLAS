# Status

Version: `0.1.0-alpha.1`
Date: 2026-07-28
Release state: alpha generic strategic galaxy

## Working

- standalone local and GitHub Pages boot;
- locally bundled Three.js, controls, icon font, and Earth textures;
- static production CSS with no browser Tailwind compiler;
- direct-file procedural fallback;
- eight display profiles and 18 layers;
- default data-center, backbone, and crisis layer demonstration;
- search, fly-to, inspector, camera tracking, timeline, and simulation controls;
- bookmarkable snapshot state;
- bounded raw and versioned feed input;
- coordinate and event selection;
- versioned output through download and browser composition adapters; and
- repository-level automated tests and browser self-test.

## Known limitations

- Built-in infrastructure and crisis entities are illustrative local data, not
  a claim of current global truth.
- Optional live feeds are unauthenticated and disabled by default.
- Snapshot URLs can become long and remain subject to browser URL limits.
- Detection-radius filtering uses an approximate degree-distance calculation.
- Direct-file mode cannot reliably use local WebGL textures in Chrome and
  deliberately falls back to procedural rendering.
- Texture origin/licensing provenance is less specific than the code and font
  provenance and must be narrowed before stable status.
- Small-screen use is functional but the dense operational layout is designed
  first for a desktop viewport.

## Explicit non-features

- no accounts or identity custody;
- no game server or hidden shared state;
- no tactical engine;
- no settlement or economic authority; and
- no assertion that an attractive Page is a complete game.
