# A.T.L.A.S. input and output

Envelope: `gzg.galaxy-message/1.0`

The copied shared schema is
[`contracts/galaxy-message.schema.json`](../contracts/galaxy-message.schema.json).
A.T.L.A.S. owns the inner schemas
[`atlas-feed.schema.json`](../contracts/atlas-feed.schema.json) and
[`atlas-selection.schema.json`](../contracts/atlas-selection.schema.json).

## Input: `atlas.feed`

Purpose: render a bounded set of strategic entities.

The preferred URL adapter is:

```text
#feed=<encodeURIComponent(JSON.stringify(galaxyMessage))>
```

The message payload uses `gzg.atlas.feed/1.0`. Limits enforced by the Page:

- at most 2,000 entities;
- latitude from -90 through 90;
- longitude from -180 through 180;
- altitude from 0 through 100,000 km;
- six-digit hexadecimal colors only;
- bounded plain text fields;
- at most 100 detection-radius sensors; and
- sensor radii from 0 through 20,050 km.

The earlier raw `#feed=<payload>` form remains accepted as a compatibility
adapter. New integrations should send the full galaxy envelope.

Input is untrusted. It controls markers and labels, not code or authority.
Telemetry text is written through text nodes rather than HTML.

## Output: `atlas.selection`

Purpose: describe a selected coordinate or deployable event to any tactical
galaxy implementing `tactical.deploy`.

The payload uses `gzg.atlas.selection/1.0`:

```json
{
  "schema": "gzg.atlas.selection/1.0",
  "deployable": true,
  "selection": {
    "type": "coordinate",
    "name": "34.05°N, 118.24°W",
    "latitude": 34.0522,
    "longitude": -118.2437
  }
}
```

Transports:

- **file** — “Export Selection” downloads the latest message;
- **CustomEvent** — `gzg:galaxy-message` on `window`;
- **postMessage** — the full message is sent to the parent when embedded; and
- **legacy postMessage** — `{channel:"atlas", kind:"selection"}` is emitted
  second for recovered launchers and includes the new message as
  `galaxy_message`.

For a same-origin parent, the target origin is the Page origin. A deliberate
cross-origin embed must provide a valid `?parentOrigin=https://example.test`
query value. Receivers still validate the message and expected sender origin.

## Browser API

`window.ATLAS_IO` exposes:

- `createSelection(input, options)`;
- `publishSelection(input, options)`;
- `validate(message)`;
- `getLatest()`;
- `exportLatest()`; and
- `selfTest()`.

Unknown top-level and endpoint fields survive shared-envelope forwarding.
Unknown major envelope versions are rejected.
