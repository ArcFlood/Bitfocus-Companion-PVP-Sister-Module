# Bitfocus Companion Renewed Vision PVP Variables

A Bitfocus Companion sister module for Renewed Vision ProVideoPlayer (PVP), named **PVP Variables** to distinguish it from the main Renewed Vision PVP 3 control module.

This module is meant to run alongside the official PVP control module. The official module is still the right place for firing cues and controlling PVP. This module focuses on live data: variables, timers, layer state, and feedbacks that can automatically change Companion button styles.

## Features

- Polls PVP's JSON API for playlists, layers, and workspace transport state.
- Creates dynamic variables for playlist names and cue names.
- Creates dynamic variables for layer state, live transport state, media names, active effects, transitions, opacity, mute/hidden state, and target/effect preset UUIDs.
- Provides live timer variables, including formatted time remaining.
- Provides boolean feedbacks for active cues, active playlists, active layers, muted/hidden layers, opacity ranges, active media/items, time remaining thresholds, effects, transitions, playback state, and playback rate.

## Configuration

From Companion connection settings:

- **Host**: PVP host or IP address. A bare IP/host or a full URL can be used.
- **Port**: PVP API port. The module defaults to `49343`, but PVP Network Preferences are the source of truth.
- **Use HTTPS**: Match PVP's `Use HTTPS Connection` setting.
- **Poll Interval (ms)**: Defaults to `750`.
- **Auth Token**: Optional bearer token. Use the token from PVP Network Preferences when PVP has `Require Authentication` enabled.

## Variables

Variables use the module namespace:

```txt
renewedvision-pvp-variables
```

Cue-name example:

```txt
$(renewedvision-pvp-variables:playlist_0_cue_1_name)
```

Time remaining example:

```txt
$(renewedvision-pvp-variables:transport_0_time_remaining_clock)
```

Common variable families:

- `playlist_{playlistIndex}_name`
- `playlist_{playlistIndex}_cue_{cueIndex}_name`
- `layer_{layerIndex}_name`
- `layer_{layerIndex}_is_hidden`
- `layer_{layerIndex}_is_muted`
- `layer_{layerIndex}_opacity`
- `layer_{layerIndex}_transition_name`
- `layer_{layerIndex}_transition_duration`
- `layer_{layerIndex}_effects`
- `transport_{transportIndex}_playing_item_name`
- `transport_{transportIndex}_playing_media_name`
- `transport_{transportIndex}_is_playing`
- `transport_{transportIndex}_time_elapsed_clock`
- `transport_{transportIndex}_time_remaining_clock`
- `transport_{transportIndex}_layer_effects`

Variable definitions are rebuilt automatically when PVP's playlist, cue, layer, effect, or transport structure changes.

## Feedbacks

Feedbacks can be added to Companion buttons to change style based on live PVP state.

Available feedbacks include:

- Cue is active
- Playlist is active
- Layer is active
- Layer is muted
- Layer is hidden
- Layer opacity compare
- Layer target set is
- Layer effect preset is
- Layer effect is active
- Layer transition is
- Layer transition duration compare
- Layer playing item is
- Layer playing media is
- Layer time remaining compare
- Layer is playing
- Layer is scrubbing
- Layer playback rate compare

## Indexing Notes

Most variables and feedback options use zero-based indexes. For example, `playlist_0_cue_1_name` means playlist index `0`, cue index `1`.

Because indexes come from PVP's current order, reordering playlists, cues, or layers in PVP can change what an index points to. UUID-based feedback options are available for several live-state checks when you need more stable matching.

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
- `src/feedbacks.ts` - boolean feedback definitions
- `src/presets.ts` - starter presets
- `src/upgrades.ts` - upgrade script scaffold
