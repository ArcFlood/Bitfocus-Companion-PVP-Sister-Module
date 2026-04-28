# PVP Variables Instruction Manual

This module is for displaying and reacting to live PVP state in Companion. Use the official **Renewed Vision: PVP 3** module for control actions like firing cues. Use this module when a button needs text, timers, labels, or automatic styling from PVP.

## Important Numbering Note

PVP data uses zero-based numbering in this module. That means the first item is `0`, not `1`.

For example, the top playlist is `playlist_0`, the first cue in that playlist is `cue_0`, and the first layer/transport is usually `layer_0` or `transport_0`. If you are thinking "Layer 1" in the PVP interface, the matching variable will usually use `_0`. If you are thinking "Layer 2", the variable will usually use `_1`.

All variable strings use the module shortname:

```txt
pvp-vars
```

Example format:

```txt
$(pvp-vars:variable_name_here)
```

## Playlist Variables

Use playlist variables when a button should show information about a PVP playlist.

Example button text:

```txt
Playlist: $(pvp-vars:playlist_0_name)
Cues: $(pvp-vars:playlist_0_cue_count)
```

Useful variables:

- `playlist_0_name`
- `playlist_0_uuid`
- `playlist_0_path`
- `playlist_0_cue_count`
- `playlist_0_child_count`
- `playlist_0_is_video_input`

Example feedback:

- Feedback: **Playlist condition**
- Playlist Index: `0`
- Field: `Is Active`
- Comparison: `is true/yes`
- Style: make the button blue when any cue in that playlist is active.

## Cue Variables

Use cue variables when a button should display a cue name or show whether a cue is currently live.

Example button text:

```txt
$(pvp-vars:playlist_0_cue_2_name)
Live: $(pvp-vars:playlist_0_cue_2_is_playing)
```

Useful variables:

- `playlist_0_cue_2_name`
- `playlist_0_cue_2_uuid`
- `playlist_0_cue_2_playlist_name`
- `playlist_0_cue_2_is_playing`
- `playlist_0_cue_2_active_layer_name`

Example feedback:

- Feedback: **Cue condition**
- Playlist Index: `0`
- Cue Index: `2`
- Field: `Is Playing`
- Comparison: `is true/yes`
- Style: make the button green when that cue is live.

## Layer Variables

Use layer variables when a button should show or react to the configured state of a PVP layer.

Example button text:

```txt
$(pvp-vars:layer_0_name)
Opacity: $(pvp-vars:layer_0_opacity)
Preset: $(pvp-vars:layer_0_effect_preset_name)
```

Useful variables:

- `layer_0_name`
- `layer_0_is_hidden`
- `layer_0_is_muted`
- `layer_0_opacity`
- `layer_0_target_set_name`
- `layer_0_blend_mode_name`
- `layer_0_effect_preset_name`
- `layer_0_effects`

Example feedback:

- Feedback: **Layer condition**
- Layer Index: `0`
- Field: `Is Muted`
- Comparison: `is true/yes`
- Style: dim the button when the layer is muted.

## Transport Variables

Use transport variables when a button should show what is currently playing on a layer, including countdowns.

Example countdown button text:

```txt
$(pvp-vars:transport_0_playing_media_name)
$(pvp-vars:transport_0_time_remaining_clock)
```

Useful variables:

- `transport_0_layer_name`
- `transport_0_playing_item_name`
- `transport_0_playing_media_name`
- `transport_0_is_playing`
- `transport_0_is_scrubbing`
- `transport_0_playback_rate`
- `transport_0_time_elapsed_clock`
- `transport_0_time_remaining_clock`

Example feedback:

- Feedback: **Transport condition**
- Layer Index: `0`
- Field: `Time Remaining`
- Comparison: `<=`
- Expected Value: `10`
- Style: turn the button red when the video has 10 seconds or less remaining.

## Transport Layer Variables

Transport layer variables mirror the layer object reported inside the live transport state. Use these when you want the layer data tied to the currently active transport entry.

Example button text:

```txt
Live Layer: $(pvp-vars:transport_0_layer_name)
Effects: $(pvp-vars:transport_0_layer_effects)
```

Useful variables:

- `transport_0_layer_name`
- `transport_0_layer_is_hidden`
- `transport_0_layer_is_muted`
- `transport_0_layer_opacity`
- `transport_0_layer_transition_name`
- `transport_0_layer_effects`

Example feedback:

- Feedback: **Transport condition**
- Layer Index: `0`
- Field: `Playing Media Name`
- Comparison: `contains`
- Expected Value: `Lower Third`
- Style: highlight the button when the playing media name contains `Lower Third`.

## Layer Effect Variables

Use layer effect variables when a button should show an effect name, enabled state, or effect variable value on a specific PVP layer.

Example button text:

```txt
Effect: $(pvp-vars:layer_0_effect_0_name)
Enabled: $(pvp-vars:layer_0_effect_0_enabled)
Value: $(pvp-vars:layer_0_effect_0_variable_0_value)
```

Useful variables:

- `layer_0_effect_0_name`
- `layer_0_effect_0_uuid`
- `layer_0_effect_0_enabled`
- `layer_0_effect_0_variable_count`
- `layer_0_effect_0_variable_0_name`
- `layer_0_effect_0_variable_0_value`

Example feedback:

- Feedback: **Effect condition**
- Scope: `Layer Effect`
- Layer Index: `0`
- Effect Index: `0`
- Field: `Enabled`
- Comparison: `is true/yes`
- Style: make the button purple when that layer effect is enabled.

## Workspace Effect Variables

Use workspace effect variables when a button should show effects applied at the workspace level.

Example button text:

```txt
Workspace FX: $(pvp-vars:workspace_effects)
Preset: $(pvp-vars:workspace_effect_preset_name)
```

Useful variables:

- `workspace_effects`
- `workspace_effect_count`
- `workspace_effect_0_name`
- `workspace_effect_0_enabled`
- `workspace_effect_0_variable_0_value`
- `workspace_effect_preset_name`
- `workspace_effect_preset_uuid`

Example feedback:

- Feedback: **Effect condition**
- Scope: `Workspace Effect`
- Effect Index: `0`
- Field: `Enabled`
- Comparison: `is true/yes`
- Style: mark the button when the first workspace effect is enabled.

## Transition Variables

Use transition variables when a button should show the active workspace or layer transition.

Example button text:

```txt
Transition: $(pvp-vars:workspace_transition_name)
Duration: $(pvp-vars:workspace_transition_duration)
```

Useful variables:

- `workspace_transition_name`
- `workspace_transition_uuid`
- `workspace_transition_enabled`
- `workspace_transition_duration`
- `workspace_transition_variable_count`
- `layer_0_transition_name`
- `layer_0_transition_duration`

Example feedback:

- Feedback: **Workspace condition**
- Field: `Workspace Transition Name`
- Comparison: `contains`
- Expected Value: `Fade`
- Style: change the button color when the workspace transition name includes `Fade`.

## Target Set Variables

Use target set variables when a button should show the target set catalog or the target set assigned to a layer.

Example button text:

```txt
Layer Target: $(pvp-vars:layer_0_target_set_name)
Catalog Target: $(pvp-vars:target_set_0_name)
```

Useful variables:

- `target_set_0_name`
- `target_set_0_uuid`
- `layer_0_target_set_name`
- `layer_0_target_set_uuid`
- `transport_0_layer_target_set_name`

Example feedback:

- Feedback: **Layer condition**
- Layer Index: `0`
- Field: `Target Set Name`
- Comparison: `=`
- Expected Value: `Main Output`
- Style: highlight the button when layer 0 is assigned to `Main Output`.

## Blend Mode Variables

Use blend mode variables when a button should show blending information for a layer.

Example button text:

```txt
Blend: $(pvp-vars:layer_0_blend_mode_name)
Opacity: $(pvp-vars:layer_0_blend_opacity)
```

Useful variables:

- `blend_mode_0_name`
- `blend_mode_0_id`
- `layer_0_blend_mode_name`
- `layer_0_blend_type`
- `layer_0_blend_opacity`
- `layer_0_blend_is_inverted`

Example feedback:

- Feedback: **Layer condition**
- Layer Index: `0`
- Field: `Blend Opacity`
- Comparison: `<`
- Expected Value: `1`
- Style: show a warning color when the layer blend opacity is below full.

## Layer Preset Variables

Use layer preset variables when a button should show a preset catalog entry or the preset assigned to a layer.

Example button text:

```txt
Layer Preset: $(pvp-vars:layer_0_layer_preset_name)
Preset 0: $(pvp-vars:layer_preset_0_name)
```

Useful variables:

- `layer_preset_0_name`
- `layer_preset_0_id`
- `layer_0_layer_preset_name`
- `layer_0_layer_preset_id`

Example feedback:

- Feedback: **Catalog condition**
- Catalog: `Layer Preset`
- Catalog Index: `0`
- Field: `Name`
- Comparison: `contains`
- Expected Value: `Wide`
- Style: mark catalog preset 0 when its name includes `Wide`.

## Effect Preset Variables

Use effect preset variables when a button should show effect preset names, UUIDs, or effect counts.

Example button text:

```txt
FX Preset: $(pvp-vars:layer_0_effect_preset_name)
Preset Effects: $(pvp-vars:effect_preset_0_effect_count)
```

Useful variables:

- `effect_preset_0_name`
- `effect_preset_0_uuid`
- `effect_preset_0_effect_count`
- `workspace_effect_preset_name`
- `layer_0_effect_preset_name`

Example feedback:

- Feedback: **Layer condition**
- Layer Index: `0`
- Field: `Effect Preset Name`
- Comparison: `contains`
- Expected Value: `Color`
- Style: color the button when layer 0 is using an effect preset with `Color` in the name.

## Available Transition Variables

Use available transition variables when a button should display a transition from PVP's transition catalog.

Example button text:

```txt
Transition 0: $(pvp-vars:transition_0_name)
Vars: $(pvp-vars:transition_0_variable_count)
```

Useful variables:

- `transition_0_name`
- `transition_0_uuid`
- `transition_0_enabled`
- `transition_0_variable_count`

Example feedback:

- Feedback: **Catalog condition**
- Catalog: `Transition`
- Catalog Index: `0`
- Field: `Enabled`
- Comparison: `is true/yes`
- Style: show that transition 0 is enabled.

## Available Effect Variables

Use available effect variables when a button should display an effect from PVP's effect catalog.

Example button text:

```txt
Effect 0: $(pvp-vars:available_effect_0_name)
Default: $(pvp-vars:available_effect_0_variable_0_default)
```

Useful variables:

- `available_effect_0_name`
- `available_effect_0_uuid`
- `available_effect_0_enabled`
- `available_effect_0_variable_count`
- `available_effect_0_variable_0_name`
- `available_effect_0_variable_0_default`

Example feedback:

- Feedback: **Catalog condition**
- Catalog: `Available Effect`
- Catalog Index: `0`
- Field: `Name`
- Comparison: `contains`
- Expected Value: `Blur`
- Style: highlight the button when available effect 0 has `Blur` in its name.

## Utility And Derived Variables

Use utility variables for module health, workspace summaries, and general dashboard buttons.

Example status button text:

```txt
PVP: $(pvp-vars:connection_status)
Active Layers: $(pvp-vars:active_layer_count)
Lowest: $(pvp-vars:workspace_time_remaining_lowest_clock)
```

Useful variables:

- `connection_status`
- `last_poll_time`
- `last_poll_error`
- `playlist_count`
- `cue_count_total`
- `layer_count`
- `active_layer_count`
- `active_cue_count`
- `workspace_is_clear`
- `workspace_has_active_media`
- `workspace_time_remaining_lowest_clock`
- `workspace_current_media_names`
- `workspace_current_cue_names`

Example feedback:

- Feedback: **Workspace condition**
- Field: `Connection Status`
- Comparison: `=`
- Expected Value: `error`
- Style: make the button red when the module cannot poll PVP.

## Building A Countdown Button

For a common live video countdown button:

Button text:

```txt
$(pvp-vars:transport_0_playing_media_name)
$(pvp-vars:transport_0_time_remaining_clock)
```

Feedback:

- Feedback: **Transport condition**
- Layer Index: `0`
- Field: `Time Remaining`
- Comparison: `<=`
- Expected Value: `10`
- Style: red background with white text.

If the wrong video countdown appears, change the transport number. For example, use `transport_1_time_remaining_clock` for the second transport/layer.
