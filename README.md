# companion-module-renewedvision-pvp-dev

A Companion **sister module** for Renewed Vision ProVideoPlayer (PVP).

This module focuses on two capabilities missing from the standard workflow:

1. Dynamic cue-name variables
2. Active-cue feedback (for button highlighting)

It is intended to run alongside existing PVP action modules, not replace them.

---

## Features

- Polls PVP API endpoints:
  - `GET /api/0/data/playlists`
  - `GET /api/0/transportState/workspace`
- Exposes cue-name variables using this pattern:
  - `playlist_{playlistIndex}_cue_{cueIndex}_name`
- Adds boolean feedback:
  - `cue_is_active`
- Includes starter preset demonstrating variable label + active feedback styling.

---

## Configuration

From Companion connection settings:

- **Host**: PVP host or IP
- **Port**: default `49343`
- **Use HTTPS**: on/off
- **Poll Interval (ms)**: default `750`
- **Auth token**: optional bearer token (module secret)

---

## Variable usage example

Use on a button label:

```txt
$(renewedvision-pvp-dev:playlist_0_cue_1_name)
```

---

## Feedback usage

Feedback ID: `cue_is_active`

Options:

- `playlistIndex`
- `cueIndex`

The feedback returns true when the selected cue UUID matches the current `transportState.playingItem.uuid`.

---

## Development

```bash
npm install
npm run lint
npm run build
```

If your environment blocks package install from npm, lint/build will not run until dependencies are available.

---

## Repository structure

- `companion/manifest.json` - Companion module manifest
- `companion/HELP.md` - end-user setup/help
- `src/main.ts` - module entrypoint + lifecycle
- `src/api.ts` - PVP API client
- `src/config.ts` - config fields + normalization
- `src/variables.ts` - variable definitions/values
- `src/feedbacks.ts` - boolean feedback definitions
- `src/presets.ts` - starter presets
- `src/upgrades.ts` - upgrade script scaffold

---

## Status

Initial scaffold complete. Next steps are API-level validation against a real PVP instance and compatibility testing across Companion versions.
