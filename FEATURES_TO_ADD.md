# Features To Add

This file lists variable families that can be tracked from the PVP JSON API. It includes variables already implemented and variables still worth adding, grouped by API/data type.

Status:

- `[x]` Implemented
- `[ ]` Not implemented yet

## Playlist Variables

Source endpoints:

- `GET /api/0/data/playlists`
- `GET /api/0/data/playlist/{id}`

Variables:

- [x] `playlist_{playlistIndex}_name`
- [x] `playlist_{playlistIndex}_uuid`
- [x] `playlist_{playlistIndex}_path`
- [x] `playlist_{playlistIndex}_cue_count`
- [x] `playlist_{playlistIndex}_child_count`
- [x] `playlist_{playlistIndex}_is_video_input`

## Cue Variables

Source endpoints:

- `GET /api/0/data/playlists`
- `GET /api/0/data/playlist/{playlistID}/cue/{cueID}`
- `GET /api/0/transportState/workspace`
- `GET /api/0/transportState/layer/{id}`

Variables:

- [x] `playlist_{playlistIndex}_cue_{cueIndex}_name`
- [x] `playlist_{playlistIndex}_cue_{cueIndex}_uuid`
- [x] `playlist_{playlistIndex}_cue_{cueIndex}_playlist_name`
- [x] `playlist_{playlistIndex}_cue_{cueIndex}_playlist_uuid`
- [x] `playlist_{playlistIndex}_cue_{cueIndex}_is_playing`
- [x] `playlist_{playlistIndex}_cue_{cueIndex}_active_layer_name`
- [x] `playlist_{playlistIndex}_cue_{cueIndex}_active_layer_uuid`

## Layer Variables

Source endpoints:

- `GET /api/0/data/layers`
- `GET /api/0/data/layer/{id}`
- `GET /api/0/transportState/workspace`
- `GET /api/0/transportState/layer/{id}`

Variables:

- [x] `layer_{layerIndex}_name`
- [x] `layer_{layerIndex}_uuid`
- [x] `layer_{layerIndex}_is_hidden`
- [x] `layer_{layerIndex}_is_muted`
- [x] `layer_{layerIndex}_opacity`
- [x] `layer_{layerIndex}_target_set_uuid`
- [x] `layer_{layerIndex}_effect_preset_uuid`
- [x] `layer_{layerIndex}_transition_name`
- [x] `layer_{layerIndex}_transition_uuid`
- [x] `layer_{layerIndex}_transition_enabled`
- [x] `layer_{layerIndex}_transition_duration`
- [x] `layer_{layerIndex}_effects`
- [x] `layer_{layerIndex}_target_set_name`
- [x] `layer_{layerIndex}_effect_preset_name`
- [x] `layer_{layerIndex}_layer_preset_name`
- [x] `layer_{layerIndex}_layer_preset_id`
- [x] `layer_{layerIndex}_blend_mode_name`
- [x] `layer_{layerIndex}_blend_mode_id`
- [x] `layer_{layerIndex}_blend_type`
- [x] `layer_{layerIndex}_blend_opacity`
- [x] `layer_{layerIndex}_blend_is_inverted`
- [x] `layer_{layerIndex}_transition_variable_count`
- [x] `layer_{layerIndex}_effect_count`

## Layer Effect Variables

Source endpoints:

- `GET /api/0/data/layers`
- `GET /api/0/effects/layer/{id}`
- `GET /api/0/transportState/workspace`
- `GET /api/0/transportState/layer/{id}`

Variables:

- [x] `layer_{layerIndex}_effect_{effectIndex}_name`
- [x] `layer_{layerIndex}_effect_{effectIndex}_uuid`
- [x] `layer_{layerIndex}_effect_{effectIndex}_enabled`
- [x] `layer_{layerIndex}_effect_{effectIndex}_variable_count`
- [x] `layer_{layerIndex}_effect_{effectIndex}_variable_{variableIndex}_name`
- [x] `layer_{layerIndex}_effect_{effectIndex}_variable_{variableIndex}_type`
- [x] `layer_{layerIndex}_effect_{effectIndex}_variable_{variableIndex}_value`
- [x] `layer_{layerIndex}_effect_{effectIndex}_variable_{variableIndex}_min`
- [x] `layer_{layerIndex}_effect_{effectIndex}_variable_{variableIndex}_max`
- [x] `layer_{layerIndex}_effect_{effectIndex}_variable_{variableIndex}_color`

## Transport Variables

Source endpoints:

- `GET /api/0/transportState/workspace`
- `GET /api/0/transportState/layer/{id}`

Variables:

- [x] `transport_{transportIndex}_layer_name`
- [x] `transport_{transportIndex}_layer_uuid`
- [x] `transport_{transportIndex}_playing_item_name`
- [x] `transport_{transportIndex}_playing_item_uuid`
- [x] `transport_{transportIndex}_playing_media_name`
- [x] `transport_{transportIndex}_playing_media_uuid`
- [x] `transport_{transportIndex}_is_playing`
- [x] `transport_{transportIndex}_is_scrubbing`
- [x] `transport_{transportIndex}_playback_rate`
- [x] `transport_{transportIndex}_time_elapsed`
- [x] `transport_{transportIndex}_time_elapsed_clock`
- [x] `transport_{transportIndex}_time_remaining`
- [x] `transport_{transportIndex}_time_remaining_clock`
- [x] `transport_{transportIndex}_layer_is_hidden`
- [x] `transport_{transportIndex}_layer_is_muted`
- [x] `transport_{transportIndex}_layer_opacity`
- [x] `transport_{transportIndex}_layer_target_set_uuid`
- [x] `transport_{transportIndex}_layer_effect_preset_uuid`
- [x] `transport_{transportIndex}_layer_transition_name`
- [x] `transport_{transportIndex}_layer_transition_uuid`
- [x] `transport_{transportIndex}_layer_transition_duration`
- [x] `transport_{transportIndex}_layer_effects`
- [x] `transport_{transportIndex}_layer_target_set_name`
- [x] `transport_{transportIndex}_layer_effect_preset_name`
- [x] `transport_{transportIndex}_layer_transition_enabled`
- [x] `transport_{transportIndex}_layer_blend_mode_name`
- [x] `transport_{transportIndex}_layer_blend_mode_id`
- [x] `transport_{transportIndex}_layer_blend_type`
- [x] `transport_{transportIndex}_layer_blend_opacity`
- [x] `transport_{transportIndex}_layer_blend_is_inverted`
- [x] `transport_{transportIndex}_layer_effect_{effectIndex}_name`
- [x] `transport_{transportIndex}_layer_effect_{effectIndex}_uuid`
- [x] `transport_{transportIndex}_layer_effect_{effectIndex}_enabled`
- [x] `transport_{transportIndex}_layer_effect_{effectIndex}_variable_{variableIndex}_name`
- [x] `transport_{transportIndex}_layer_effect_{effectIndex}_variable_{variableIndex}_type`
- [x] `transport_{transportIndex}_layer_effect_{effectIndex}_variable_{variableIndex}_value`
- [x] `transport_{transportIndex}_layer_effect_{effectIndex}_variable_{variableIndex}_min`
- [x] `transport_{transportIndex}_layer_effect_{effectIndex}_variable_{variableIndex}_max`
- [x] `transport_{transportIndex}_layer_effect_{effectIndex}_variable_{variableIndex}_color`

## Workspace Effect Variables

Source endpoints:

- `GET /api/0/effects/workspace`
- `GET /api/0/effectsPreset/workspace`

Variables:

- [x] `workspace_effects`
- [x] `workspace_effect_count`
- [x] `workspace_effect_{effectIndex}_name`
- [x] `workspace_effect_{effectIndex}_uuid`
- [x] `workspace_effect_{effectIndex}_enabled`
- [x] `workspace_effect_{effectIndex}_variable_count`
- [x] `workspace_effect_{effectIndex}_variable_{variableIndex}_name`
- [x] `workspace_effect_{effectIndex}_variable_{variableIndex}_type`
- [x] `workspace_effect_{effectIndex}_variable_{variableIndex}_value`
- [x] `workspace_effect_{effectIndex}_variable_{variableIndex}_min`
- [x] `workspace_effect_{effectIndex}_variable_{variableIndex}_max`
- [x] `workspace_effect_{effectIndex}_variable_{variableIndex}_color`
- [x] `workspace_effect_preset_name`
- [x] `workspace_effect_preset_uuid`
- [x] `workspace_effect_preset_effect_count`

## Transition Variables

Source endpoints:

- `GET /api/0/transition/workspace`
- `GET /api/0/transition/layer/{id}`
- `GET /api/0/transitionDuration/workspace`
- `GET /api/0/transitionDuration/layer/{id}`

Variables:

- [x] `workspace_transition_name`
- [x] `workspace_transition_uuid`
- [x] `workspace_transition_enabled`
- [x] `workspace_transition_duration`
- [x] `workspace_transition_variable_count`
- [x] `workspace_transition_variable_{variableIndex}_name`
- [x] `workspace_transition_variable_{variableIndex}_type`
- [x] `workspace_transition_variable_{variableIndex}_value`
- [x] `workspace_transition_variable_{variableIndex}_color`
- [x] `layer_{layerIndex}_transition_name`
- [x] `layer_{layerIndex}_transition_uuid`
- [x] `layer_{layerIndex}_transition_enabled`
- [x] `layer_{layerIndex}_transition_duration`
- [x] `layer_{layerIndex}_transition_variable_{variableIndex}_name`
- [x] `layer_{layerIndex}_transition_variable_{variableIndex}_type`
- [x] `layer_{layerIndex}_transition_variable_{variableIndex}_value`
- [x] `layer_{layerIndex}_transition_variable_{variableIndex}_color`

## Target Set Variables

Source endpoints:

- `GET /api/0/targetSet`
- `GET /api/0/targetSet/layer/{id}`

Variables:

- [x] `target_set_{targetSetIndex}_name`
- [x] `target_set_{targetSetIndex}_uuid`
- [x] `layer_{layerIndex}_target_set_name`
- [x] `layer_{layerIndex}_target_set_uuid`
- [x] `transport_{transportIndex}_layer_target_set_name`
- [x] `transport_{transportIndex}_layer_target_set_uuid`

## Blend Mode And Layer Blending Variables

Source endpoints:

- `GET /api/0/blendMode`
- `GET /api/0/blendMode/layer/{id}`
- `GET /api/0/blend/layer/{id}`

Variables:

- [x] `blend_mode_{blendModeIndex}_name`
- [x] `blend_mode_{blendModeIndex}_id`
- [x] `layer_{layerIndex}_blend_mode_name`
- [x] `layer_{layerIndex}_blend_mode_id`
- [x] `layer_{layerIndex}_blend_type`
- [x] `layer_{layerIndex}_blend_opacity`
- [x] `layer_{layerIndex}_blend_is_inverted`
- [x] `transport_{transportIndex}_layer_blend_mode_name`
- [x] `transport_{transportIndex}_layer_blend_mode_id`
- [x] `transport_{transportIndex}_layer_blend_type`
- [x] `transport_{transportIndex}_layer_blend_opacity`
- [x] `transport_{transportIndex}_layer_blend_is_inverted`

## Layer Preset Variables

Source endpoints:

- `GET /api/0/layerPreset`
- `GET /api/0/layerPreset/layer/{id}`

Variables:

- [x] `layer_preset_{presetIndex}_name`
- [x] `layer_preset_{presetIndex}_id`
- [x] `layer_{layerIndex}_layer_preset_name`
- [x] `layer_{layerIndex}_layer_preset_id`

## Effect Preset Variables

Source endpoints:

- `GET /api/0/effectsPreset`
- `GET /api/0/effectsPreset/workspace`
- `GET /api/0/effectsPreset/layer/{id}`

Variables:

- [x] `effect_preset_{presetIndex}_name`
- [x] `effect_preset_{presetIndex}_uuid`
- [x] `effect_preset_{presetIndex}_effect_count`
- [x] `workspace_effect_preset_name`
- [x] `workspace_effect_preset_uuid`
- [x] `layer_{layerIndex}_effect_preset_name`
- [x] `layer_{layerIndex}_effect_preset_uuid`

## Available Transition Variables

Source endpoints:

- `GET /api/0/transition`

Variables:

- [x] `transition_{transitionIndex}_name`
- [x] `transition_{transitionIndex}_uuid`
- [x] `transition_{transitionIndex}_enabled`
- [x] `transition_{transitionIndex}_variable_count`

## Available Effect Variables

Source endpoints:

- `GET /api/0/effects`

Variables:

- [x] `available_effect_{effectIndex}_name`
- [x] `available_effect_{effectIndex}_uuid`
- [x] `available_effect_{effectIndex}_enabled`
- [x] `available_effect_{effectIndex}_variable_count`
- [x] `available_effect_{effectIndex}_variable_{variableIndex}_name`
- [x] `available_effect_{effectIndex}_variable_{variableIndex}_type`
- [x] `available_effect_{effectIndex}_variable_{variableIndex}_min`
- [x] `available_effect_{effectIndex}_variable_{variableIndex}_max`
- [x] `available_effect_{effectIndex}_variable_{variableIndex}_default`

## Utility / Derived Variables

These are not direct API fields, but are useful in Companion.

- [x] `connection_status`
- [x] `last_poll_time`
- [x] `last_poll_error`
- [x] `playlist_count`
- [x] `cue_count_total`
- [x] `layer_count`
- [x] `active_layer_count`
- [x] `active_cue_count`
- [x] `workspace_is_clear`
- [x] `workspace_has_active_media`
- [x] `workspace_time_remaining_lowest`
- [x] `workspace_time_remaining_lowest_clock`
- [x] `workspace_current_media_names`
- [x] `workspace_current_cue_names`
