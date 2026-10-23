# Fermentation Lab

An author-hosted Osmograph domain Vial for home fermentation.

**Status:** local project, not yet pushed or published. The web app does not host this
source. Install it from this project's manifest URL once it is published.

## What is here

| File | Purpose |
|---|---|
| `vial.json` | The `osmograph.domain-pack/1` manifest |
| `ui.html` | The sandboxed workspace body fragment |
| `home.html` | The compact sandboxed Home view |

The workspace is the authority for the batch log, recipe fields, stop rules, and
exports. The Home view is a status surface over the same host payload; it is not a
second protocol.

## Validate

From the Osmograph desktop repository:

```bash
cd /home/praisejamesx/Documents/Documents/Research/coglab/OpenSmell/osmograph-desktop
npm run validate:vial -- /home/praisejamesx/Documents/Documents/code/osmograph-vials/fermentation-lab
```

The validator checks the manifest and both companion UI fragments. It is a local
policy gate, not a security certification or a food-safety review.

Run the project's own contract test:

```bash
npm test
```

## Install locally

Serve this directory over HTTP, then paste its `/vial.json` URL into
**Vials → Aromatory → Install from URL**. Do not install from a local file: the
host cannot fetch `ui.html` or `home.html` from a file import.

## Scope

This Vial records pH, temperature, recipe, style, target, structured visible
faults, smell observations, and optional array readings. It refuses to turn a
pleasant smell into a safety verdict. It is not a pathogen test, a pH meter, or a
cross-rig classifier.

## License

CC BY 4.0, as declared in `vial.json`.
