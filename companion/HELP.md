# Bitfocus Companion Renewed Vision PVP Variables

This module adds live variables, timers, and feedbacks for Renewed Vision ProVideoPlayer (PVP). It is named **PVP Variables** to distinguish it from the main **Renewed Vision: PVP 3** control module.

Use the official PVP module for actions and control. Use this module for live button text, countdowns, labels, status displays, and automatic feedback styling.

## Configuration

- **Host**: PVP host/IP or full URL
- **Port**: PVP API port, default `49343`
- **Use HTTPS**: match PVP's Network Preferences
- **Auth Token**: optional token from PVP Network Preferences
- **Poll Interval (ms)**: default `750`

## Variables

Variables use the shortname namespace `pvp-vars`.

Examples:

```txt
$(pvp-vars:playlist_0_cue_1_name)
$(pvp-vars:transport_0_time_remaining_clock)
$(pvp-vars:transport_0_playing_media_name)
$(pvp-vars:layer_0_opacity)
$(pvp-vars:workspace_current_media_names)
```

Variables are generated for discovered playlists, cues, layers, transport states, effects, transitions, target sets, blend modes, presets, and workspace status.

## Feedbacks

Use feedbacks to automatically style Companion buttons based on PVP state.

Available grouped feedbacks:

- **Playlist condition**
- **Cue condition**
- **Layer condition**
- **Transport condition**
- **Workspace condition**
- **Effect condition**
- **Catalog condition**

Each feedback has dropdown fields for choosing what to compare, plus a comparison and expected value where needed.

Example countdown warning:

- Feedback: **Transport condition**
- Layer Index: `0`
- Field: `Time Remaining`
- Comparison: `<=`
- Expected Value: `10`

## Notes

- This module reads PVP's JSON API. It does not replace the official PVP control/action module.
- Most indexes are zero-based.
- Reordering playlists, cues, layers, effects, or presets in PVP can change index-based variable meanings.
- Use the repository `INSTRUCTION_MANUAL.md` for more button examples.
