# Fermentation Lab

An author-hosted Osmograph domain Vial for home fermentation.

**Status:** v0.6.0. Installs as **Ungated** because it has no held-out evidence
block. It is not a reviewed Aromatory listing and it makes no measured
false-alarm, latency, or minimum-detectable-effect claim. The host gate and the
project tests pass; real-rig validation is still outstanding.

## What is here

| File | Purpose |
|---|---|
| `vial.json` | The `osmograph.domain-pack/2` manifest and anomaly profile |
| `ui.html` | The sandboxed workspace body fragment |
| `home.html` | The compact sandboxed Home view |

The workspace is the authority for the batch log, recipe fields, stop rules, and
exports. The Home view is a status surface over the same host payload; it is not a
second protocol. The Vial profile is the change detector: the host requires at
least two corroborating channels and applies the profile's persistence,
hysteresis, confidence floor, and coverage gate. The array phase is a shape
estimate, not a safety verdict.

## Validate

From the Osmograph desktop repository:

```bash
cd /home/praisejamesx/Documents/Documents/Research/coglab/OpenSmell/osmograph-desktop
npm run validate:vial -- /home/praisejamesx/Documents/Documents/code/osmograph-vials/fermentation-lab
```

From the `opensmell-rs` repository:

```bash
noses lint /home/praisejamesx/Documents/Documents/code/osmograph-vials/fermentation-lab
noses test /home/praisejamesx/Documents/Documents/code/osmograph-vials/fermentation-lab
```

`noses lint` and `noses test` pass with warnings. `noses publish` refuses until
a real evidence block exists; that is deliberate.

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
cross-rig classifier. The primary measurement still decides safety.

## License

CC BY 4.0, as declared in `vial.json`.
