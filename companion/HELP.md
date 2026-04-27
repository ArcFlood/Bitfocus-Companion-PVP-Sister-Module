# Companion Module: Renewed Vision PVP (Dev Sister Module)

This module adds:
- Dynamic cue-name variables from PVP playlists
- Active cue feedback for button highlighting

## Configuration

- **Host**: PVP host/IP
- **Port**: PVP API port (default: `49343`)
- **Use HTTPS**: enable if your endpoint is TLS-enabled
- **Auth Token**: optional bearer token
- **Poll Interval (ms)**: default `750`

## Variables

Variables are generated for each discovered cue:

- `playlist_{playlistIndex}_cue_{cueIndex}_name`

Example label usage:

`$(renewedvision-pvp-dev:playlist_0_cue_1_name)`

## Feedback

### Cue is active

Options:
- Playlist Index
- Cue Index

Returns true when the configured cue UUID matches PVP's currently playing item UUID.

## Notes

- This is designed as a sister module and does not replace the official PVP actions module.
- Polling endpoints used:
  - `/api/0/data/playlists`
  - `/api/0/transportState/workspace`
