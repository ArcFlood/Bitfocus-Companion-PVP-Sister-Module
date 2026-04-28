# Bitfocus Companion Renewed Vision PVP Variables

A Bitfocus Companion sister module for Renewed Vision ProVideoPlayer (PVP), named **PVP Variables** to distinguish it from the main **Renewed Vision: PVP 3** control module.

This module is meant to run alongside the official PVP control module. The official module is still the right place for firing cues and controlling PVP. This module focuses on live data: variables, timers, layer state, catalogs, effects, transitions, and feedbacks that can automatically change Companion button styles.

## Features

- Polls PVP's JSON API for playlists, cues, layers, workspace transport state, effects, transitions, presets, target sets, blend modes, and derived workspace status.
- Creates dynamic variables for playlist and cue names, UUIDs, counts, and active cue/layer relationships.
- Creates dynamic variables for layer state, target sets, layer presets, blend modes, effect presets, active effects, transitions, opacity, mute/hidden state, and effect variable values.
- Creates live transport variables for playing cue, playing media, playback state, elapsed time, remaining time, and formatted countdowns.
- Creates workspace variables for current media names, current cue names, lowest remaining time, workspace effects, workspace transition, and connection/polling status.
- Provides grouped dropdown feedbacks for playlists, cues, layers, transport, workspace, effects, and catalog items.

## Configuration

From Companion connection settings:

- **Host**: PVP host or IP address. A bare IP/host or a full URL can be used.
- **Port**: PVP API port. The module defaults to `49343`, but PVP Network Preferences are the source of truth.
- **Use HTTPS**: Match PVP's `Use HTTPS Connection` setting.
- **Poll Interval (ms)**: Defaults to `750`.
- **Auth Token**: Optional bearer token. Use the token from PVP Network Preferences when PVP has `Require Authentication` enabled.

## Variables

Variables use the module shortname namespace:

```txt
pvp-vars
```

Cue-name example:

```txt
$(pvp-vars:playlist_0_cue_1_name)
```

Time remaining example:

```txt
$(pvp-vars:transport_0_time_remaining_clock)
```

Common variable families:

- `playlist_{playlistIndex}_name`
- `playlist_{playlistIndex}_cue_{cueIndex}_name`
- `layer_{layerIndex}_name`
- `layer_{layerIndex}_is_hidden`
- `layer_{layerIndex}_is_muted`
- `layer_{layerIndex}_opacity`
- `layer_{layerIndex}_target_set_name`
- `layer_{layerIndex}_blend_mode_name`
- `layer_{layerIndex}_transition_name`
- `layer_{layerIndex}_transition_duration`
- `layer_{layerIndex}_effects`
- `layer_{layerIndex}_effect_{effectIndex}_variable_{variableIndex}_value`
- `transport_{transportIndex}_playing_item_name`
- `transport_{transportIndex}_playing_media_name`
- `transport_{transportIndex}_is_playing`
- `transport_{transportIndex}_time_elapsed_clock`
- `transport_{transportIndex}_time_remaining_clock`
- `workspace_current_media_names`
- `workspace_time_remaining_lowest_clock`
- `workspace_transition_name`
- `target_set_{targetSetIndex}_name`
- `blend_mode_{blendModeIndex}_name`
- `layer_preset_{presetIndex}_name`
- `effect_preset_{presetIndex}_name`
- `transition_{transitionIndex}_name`
- `available_effect_{effectIndex}_name`

Variable definitions are rebuilt automatically when PVP's playlist, cue, layer, effect, transition, catalog, or transport structure changes.

For button examples, see [INSTRUCTION_MANUAL.md](./INSTRUCTION_MANUAL.md).

## Feedbacks

Feedbacks can be added to Companion buttons to change style based on live PVP state.

The module uses grouped dropdown feedbacks:

- **Playlist condition**: compare playlist name, UUID, path, cue count, child count, video-input status, or active status.
- **Cue condition**: compare cue name, UUID, playlist, playing status, or active layer.
- **Layer condition**: compare layer name, UUID, active state, hidden/muted state, opacity, target set, presets, blend mode, transition, and effect summary.
- **Transport condition**: compare current playing cue/media, playback state, scrubbing state, playback rate, elapsed time, or remaining time.
- **Workspace condition**: compare connection status, counts, current media/cue lists, lowest remaining time, workspace effect preset, and workspace transition.
- **Effect condition**: compare layer or workspace effect name, UUID, enabled state, variable count, or specific effect variable values.
- **Catalog condition**: compare target sets, blend modes, layer presets, effect presets, available transitions, and available effects.

Example countdown warning feedback:

1. Add a feedback to a button.
2. Select this module.
3. Choose **Transport condition**.
4. Set **Layer Index** to the transport/layer index you want.
5. Set **Field** to `Time Remaining`.
6. Set **Comparison** to `<=`.
7. Set **Expected Value** to `10`.
8. Set the style to red, yellow, blinking, or any warning style you prefer.

## Indexing Notes

Most variables and feedback options use zero-based indexes. For example, `playlist_0_cue_1_name` means playlist index `0`, cue index `1`.

Because indexes come from PVP's current order, reordering playlists, cues, layers, effects, or presets in PVP can change what an index points to. UUID and name fields are available in variables and feedbacks when you need to display or compare more stable identifiers.

## Development

```bash
npm install
npm run lint
npm run build
```

The build command generates the packaged Companion module output and a `.tgz` archive.

## Repository Structure

- `companion/manifest.json` - Companion module manifest
- `companion/HELP.md` - end-user setup/help
- `src/main.ts` - module entrypoint and polling lifecycle
- `src/api.ts` - PVP JSON API client and response normalization
- `src/config.ts` - Companion config fields
- `src/variables.ts` - variable definitions and values
- `src/feedbacks.ts` - grouped boolean feedback definitions
- `src/presets.ts` - starter presets
- `src/upgrades.ts` - upgrade script scaffold
- `INSTRUCTION_MANUAL.md` - practical examples for building Companion buttons
