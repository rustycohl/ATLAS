# Validation

Date: 2026-07-28

## Automated gate

- Repository test suite: 6/6 pass.
- JavaScript syntax check: pass.
- Complete same-origin boot asset set: pass.
- No Tailwind browser compiler reference: pass.
- Page and independent galaxy manifest identity: pass.
- Exactly 18 layer controls and the useful standalone defaults: pass.
- Versioned feed and selection schemas and examples: pass.
- Galaxy-message creation, validation, and compatibility output: pass.
- Malformed/unknown-major rejection: pass.
- Bounded feed input and text-only telemetry/search rendering: pass.

## Browser gate

Surface: isolated in-app Chromium at `http://127.0.0.1:8780/`

1. Standalone Page loaded without another Ground Zero repository.
2. WebGL canvas rendered at 980 × 624 CSS pixels in the test viewport.
3. Default data-center, backbone, and crisis layers activated: 3/18.
4. Coordinate click selected `24.44°N, 90.00°E`.
5. Inspector opened and the system log recorded the selection.
6. “Export Selection” changed from disabled to enabled, proving the Page-level
   `atlas.selection` adapter executed.
7. Canonical versioned `atlas.feed` example loaded one external entity through
   the URL-hash adapter.
8. Console errors and warnings: none.

Public surface: <https://rustycohl.github.io/ATLAS/>

1. GitHub Actions deployment completed successfully.
2. Public Page exposed version `0.1.0-alpha.1` for the initial release.
3. The `0.1.0-alpha.2` JSON-boundary correction passed its six-test repository
   gate, local composed-browser smoke inside BattleStarSol, and GitHub Pages
   workflow.
4. Default layers activated: 3/18.
5. Public coordinate selection opened the inspector and logged the selection.
6. “Export Selection” enabled after selection.
7. Public `0.1.0-alpha.2` retained the 3/18 default layer set; a WebGL
   coordinate selection opened the inspector and enabled Export Selection.
6. Console errors and warnings: none.

## Remaining release checks

- Qualify and document a narrow/mobile viewport; the current dense operational
  layout is desktop-first.
- Repeat direct-file procedural fallback after packaging.
