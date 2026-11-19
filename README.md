# Fermentation Lab

An author-hosted Osmograph domain Vial for home fermentation.

**Status:** v0.7.0. Installs as **Ungated** because it has no held-out evidence
block. It is not a reviewed Aromatory listing and it makes no measured
false-alarm, latency, or minimum-detectable-effect claim. The host gate and the
project tests pass; real-rig validation is still outstanding.

## What changed in 0.7.0

- The phase is trend-driven from logged pH and gravity, not elapsed days alone;
  the recipe end day is an input.
- An at-target call requires a recorded pH-meter calibration. An uncalibrated or
  stale reading withholds the call; a low-acid pH above 4.6 remains a stop.
- The host `snapshot.process.ph` path is consumed when present, with the manual
  log as fallback. The live probe driver is still outstanding.
- The Home quick log records pH-meter calibration and applies the same gate.

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

## Process sensors

pH is a primary process sensor, not a gas channel. The host contract exposes it
as `snapshot.process.ph`, separate from `snapshot.channels`; the gas anomaly
detector must not receive a pH coordinate. The mixed-rig ingest filter is not
implemented yet, so a process channel must not be placed in the OSM array. The Vial prefers a calibrated probe
reading when the host provides one and falls back to the manual log otherwise.
A stale or uncalibrated probe withholds the at-target call. The live probe driver
and a real calibration fixture are not implemented yet; see
`osmograph-desktop/docs/PROCESS_SENSORS.md`.

The batch phase is driven by the logged pH and gravity trends, not by elapsed
days alone. The recipe end day is an input, not a hard-coded day-10 rule. An
at-target call requires the latest pH reading to be recorded as calibrated; an
uncalibrated or unchecked meter withholds that call and points to a fresh
two-point calibration. A low-acid pH above 4.6 remains a stop even when the
meter is uncalibrated, but the verdict says the reading is unverified and asks
for a calibrated re-measure.

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

This Vial records pH, pH-meter calibration status, temperature, gravity, recipe,
style, target, recipe end day, structured visible faults, smell observations, and
optional array readings. It refuses to turn a pleasant smell into a safety
verdict. It is not a pathogen test, a pH meter, or a cross-rig classifier. The
primary measurement still decides safety.

## License

CC BY 4.0, as declared in `vial.json`.
