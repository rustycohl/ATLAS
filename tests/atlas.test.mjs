import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("the Page boots entirely from repository-local assets", async () => {
  const html = await read("site/index.html");
  const localAssets = [
    "site/atlas.generated.css",
    "site/galaxy-io.js",
    "site/manifest.webmanifest",
    "site/vendor/three.r128.min.js",
    "site/vendor/OrbitControls.r128.js",
    "site/vendor/fonts/material-icons.css",
    "site/vendor/fonts/material-icons-outlined.otf",
    "site/vendor/textures/earth-blue-marble.jpg",
    "site/vendor/textures/earth-night.jpg",
    "site/vendor/textures/earth-topology.png",
    "site/vendor/textures/earth-water.png",
  ];

  for (const path of localAssets) {
    assert.equal((await stat(new URL(path, root))).isFile(), true, path);
  }

  const bootReferences = [
    ...html.matchAll(/<(?:script|link)\b[^>]+(?:src|href)="([^"]+)"/g),
  ].map((match) => match[1]);
  assert.equal(bootReferences.some((value) => /^https?:/i.test(value)), false);
  assert.match(html, /atlas\.generated\.css/);
  assert.doesNotMatch(html, /tailwindcss\.js/);
});

test("the standalone surface exposes the complete layer and state boundary", async () => {
  const html = await read("site/index.html");
  const layerIds = [...html.matchAll(/id="layer-([^"]+)" class="saas-checkbox layer-toggle"/g)]
    .map((match) => match[1]);

  assert.equal(new Set(layerIds).size, 18);
  assert.match(html, /\['layer-dc', 'layer-ixp', 'layer-crisis'\]/);
  assert.match(html, /LOCAL GALAXY: ONLINE/);
  assert.match(html, /STANDALONE STRATEGIC GALAXY/);
  assert.doesNotMatch(html, /Â/);
});

test("the Page manifest declares an independent browser-local galaxy", async () => {
  const manifest = JSON.parse(await read("site/galaxy.json"));
  assert.equal(manifest.flag, "DEDICATED_REPO_PAGE");
  assert.equal(manifest.galaxy.id, "ATLAS");
  assert.equal(manifest.galaxy.standalone, true);
  assert.equal(manifest.repository.full_name, "rustycohl/ATLAS");
  assert.equal(manifest.runtime.server_required, false);
  assert.deepEqual(manifest.runtime.external_boot_dependencies, []);
  assert.ok(manifest.io.emits.includes("gzg.atlas.selection/1.0"));
  assert.ok(manifest.io.accepts.includes("gzg.atlas.feed/1.0"));
});

test("contracts and canonical examples carry compatible schemas", async () => {
  const shared = JSON.parse(await read("contracts/galaxy-message.schema.json"));
  const selection = JSON.parse(await read("contracts/atlas-selection.schema.json"));
  const feed = JSON.parse(await read("contracts/atlas-feed.schema.json"));
  const selectionExample = JSON.parse(await read("contracts/examples/atlas-selection.json"));
  const feedExample = JSON.parse(await read("contracts/examples/atlas-feed.json"));

  assert.equal(shared.properties.gzg.const, "galaxy-message");
  assert.equal(selection.properties.schema.const, "gzg.atlas.selection/1.0");
  assert.equal(feed.properties.schema.const, "gzg.atlas.feed/1.0");
  assert.equal(feed.properties.entities.maxItems, 2000);
  assert.equal(selectionExample.type, "atlas.selection");
  assert.equal(selectionExample.payload.schema, selection.properties.schema.const);
  assert.equal(feedExample.type, "atlas.feed");
  assert.equal(feedExample.payload.schema, feed.properties.schema.const);
});

test("the browser adapter emits the standard envelope and legacy compatibility second", async () => {
  const source = await read("site/galaxy-io.js");
  const posted = [];
  const buttonClasses = new Set();
  const button = {
    disabled: true,
    title: "",
    classList: {
      add: (...names) => names.forEach((name) => buttonClasses.add(name)),
      remove: (...names) => names.forEach((name) => buttonClasses.delete(name)),
    },
  };
  const parent = {
    postMessage: (message, origin) => posted.push({ message, origin }),
  };
  const browserWindow = {
    addEventListener: () => {},
    dispatchEvent: () => true,
    parent,
  };
  const context = {
    Blob,
    CustomEvent: class CustomEvent {
      constructor(type, options) {
        this.type = type;
        this.detail = options?.detail;
      }
    },
    URL,
    crypto: {
      randomUUID: () => "atlas-test-instance",
    },
    document: {
      createElement: () => ({ click: () => {} }),
      getElementById: (id) => id === "btn-export-selection" ? button : null,
    },
    location: {
      href: "https://rustycohl.github.io/ATLAS/",
      origin: "https://rustycohl.github.io",
      protocol: "https:",
    },
    sessionStorage: {
      getItem: () => null,
      setItem: () => {},
    },
    structuredClone,
    window: browserWindow,
  };
  context.globalThis = context;
  vm.runInNewContext(source, context, { filename: "galaxy-io.js" });

  const report = browserWindow.ATLAS_IO.selfTest();
  assert.equal(report.ok, true);
  assert.equal(report.protocol, "gzg.galaxy-message/1.0");

  const emitted = browserWindow.ATLAS_IO.publishSelection({
    deployable: true,
    type: "coordinate",
    name: "Test point",
    lat: 12.25,
    lng: -44.5,
  }, {
    id: "atlas-test-selection",
    created_at: "2026-07-28T12:00:00.000Z",
  });

  assert.equal(emitted.type, "atlas.selection");
  assert.equal(emitted.payload.schema, "gzg.atlas.selection/1.0");
  assert.equal(emitted.payload.selection.latitude, 12.25);
  assert.equal(emitted.target.capability, "tactical.deploy");
  assert.equal(posted.length, 2);
  assert.equal(posted[0].message.gzg, "galaxy-message");
  assert.equal(posted[1].message.channel, "atlas");
  assert.deepEqual(posted[1].message.galaxy_message, emitted);
  assert.equal(button.disabled, false);

  const unsupported = structuredClone(emitted);
  unsupported.version = "2.0";
  assert.throws(() => browserWindow.ATLAS_IO.validate(unsupported), /Unsupported/);
});

test("untrusted feed text is bounded and telemetry never interpolates HTML", async () => {
  const html = await read("site/index.html");
  assert.match(html, /feedData\.entities\.length > 2000/);
  assert.match(html, /sensor_units\.length > 100/);
  assert.match(html, /document\.createTextNode/);
  assert.doesNotMatch(html, /el\.innerHTML = `<span[^`]*\$\{msg\}/);
  assert.doesNotMatch(html, /div\.innerHTML = `<span[^`]*\$\{m\.name\}/);
  assert.match(html, /name\.textContent = m\.name/);
  assert.match(html, /message\.type !== 'atlas\.feed'/);
});
