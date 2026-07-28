# A.T.L.A.S.

A.T.L.A.S. is the standalone strategic globe and deployment-selection galaxy
for Ground Zero Games. It runs entirely in the browser, renders a locally
bundled Earth, exposes 18 optional strategic layers, accepts bounded strategic
feed messages, and exports a selected coordinate or event through the shared
GZG galaxy-message contract.

This repository is the generic reference surface. Battle/Star.SOL may compose
and theme it, but does not own it.

## Run and verify

```text
npm test
npm start
```

Then open <http://127.0.0.1:8780/>.

The public Page is intended to live at
<https://rustycohl.github.io/ATLAS/>.

## Galaxy boundary

- `site/` is the complete Page runtime. Its boot path has no network
  dependency.
- `contracts/` contains the copied `gzg.galaxy-message/1.0` envelope and the
  A.T.L.A.S.-owned feed and selection payload schemas.
- `tests/` verifies the standalone asset set, Page contract, feed boundary,
  and browser I/O adapter.
- `docs/` records architecture, I/O, provenance, status, and validation.

A.T.L.A.S. remains useful with every other repository offline: the local globe,
profiles, built-in layers, coordinate inspection, snapshot URLs, and selection
export all work alone. Tactical launch is a consumer capability, not a hidden
dependency.

## Current truth

Version: `0.1.0-alpha.2`

Implemented:

- eight globe display profiles;
- 18 independently toggled layers;
- search, camera tracking, simulation controls, and snapshot URLs;
- direct coordinate selection and deployable-event selection;
- bounded URL-hash feed import, including optional detection-radius filtering;
- `gzg.galaxy-message/1.0` selection output through file download,
  `postMessage`, and `CustomEvent`; and
- procedural direct-file fallback.

Not implemented:

- authenticated public feeds;
- server authority, accounts, or custody;
- tactical resolution inside A.T.L.A.S.; or
- proof that optional real-world data is complete or current.

See [`docs/STATUS.md`](docs/STATUS.md) and [`docs/IO.md`](docs/IO.md) for the
precise boundary.

## License

Code is MIT licensed. Original documentation, design, and art assets are
available under CC BY 4.0 as described in `LICENSE`. Third-party attributions
are recorded in `NOTICE`.
