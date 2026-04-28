# Bitfocus Companion Renewed Vision PVP Variables

This module adds live variables, timers, and feedbacks for Renewed Vision ProVideoPlayer (PVP). It is named **PVP Variables** to distinguish it from the main Renewed Vision PVP 3 control module.

## Configuration

- **Host**: PVP host/IP or full URL
- **Port**: PVP API port, default `49343`
- **Use HTTPS**: match PVP's Network Preferences
- **Auth Token**: optional token from PVP Network Preferences
- **Poll Interval (ms)**: default `750`

## Variables

Examples:

```txt
$(renewedvision-pvp-variables:playlist_0_cue_1_name)
$(renewedvision-pvp-variables:transport_0_time_remaining_clock)
$(renewedvision-pvp-variables:transport_0_playing_media_name)
$(renewedvision-pvp-variables:layer_0_opacity)
```

Variables are generated for discovered playlists, cues, layers, effects, and transport states.

## Feedbacks

Use feedbacks to automatically style Companion buttons based on PVP state.

Available feedbacks include active cue, active playlist, active layer, layer muted/hidden, opacity compare, target set match, effect preset match, active effect, transition match, transition duration compare, playing item/media match, time remaining compare, playing state, scrubbing state, and playback rate compare.

## Notes

- This module reads PVP's JSON API. It does not replace the official PVP control/action module.
- Most indexes are zero-based.
- Reordering playlists, cues, or layers in PVP can change index-based variable meanings.
- Polling endpoints include:
  - `/api/0/data/playlists`
  - `/api/0/data/layers`
  - `/api/0/transportState/workspace`
