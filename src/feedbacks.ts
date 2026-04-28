import type { CompanionFeedbackDefinitions } from '@companion-module/base'
import type { PvpState } from './types'

export const FEEDBACK_ID_CUE_IS_ACTIVE = 'cue_is_active'
export const FEEDBACK_ID_PLAYLIST_IS_ACTIVE = 'playlist_is_active'
export const FEEDBACK_ID_LAYER_IS_ACTIVE = 'layer_is_active'
export const FEEDBACK_ID_LAYER_IS_MUTED = 'layer_is_muted'
export const FEEDBACK_ID_LAYER_IS_HIDDEN = 'layer_is_hidden'
export const FEEDBACK_ID_LAYER_OPACITY_COMPARE = 'layer_opacity_compare'
export const FEEDBACK_ID_LAYER_TARGET_SET_IS = 'layer_target_set_is'
export const FEEDBACK_ID_LAYER_EFFECT_PRESET_IS = 'layer_effect_preset_is'
export const FEEDBACK_ID_LAYER_EFFECT_IS_ACTIVE = 'layer_effect_is_active'
export const FEEDBACK_ID_LAYER_TRANSITION_IS = 'layer_transition_is'
export const FEEDBACK_ID_LAYER_TRANSITION_DURATION_COMPARE = 'layer_transition_duration_compare'
export const FEEDBACK_ID_LAYER_PLAYING_ITEM_IS = 'layer_playing_item_is'
export const FEEDBACK_ID_LAYER_PLAYING_MEDIA_IS = 'layer_playing_media_is'
export const FEEDBACK_ID_LAYER_TIME_REMAINING_COMPARE = 'layer_time_remaining_compare'
export const FEEDBACK_ID_LAYER_IS_PLAYING = 'layer_is_playing'
export const FEEDBACK_ID_LAYER_IS_SCRUBBING = 'layer_is_scrubbing'
export const FEEDBACK_ID_LAYER_PLAYBACK_RATE_COMPARE = 'layer_playback_rate_compare'

const COMPARE_CHOICES = [
  { id: 'eq', label: '=' },
  { id: 'ne', label: '!=' },
  { id: 'gt', label: '>' },
  { id: 'gte', label: '>=' },
  { id: 'lt', label: '<' },
  { id: 'lte', label: '<=' },
]

export function getFeedbackDefinitions(getState: () => PvpState): CompanionFeedbackDefinitions {
  return {
    [FEEDBACK_ID_CUE_IS_ACTIVE]: {
      type: 'boolean',
      name: 'Cue is active',
      description: 'True when selected playlist/cue is currently active in PVP',
      defaultStyle: {
        bgcolor: 0x00aa00,
        color: 0xffffff,
      },
      options: [
        {
          type: 'number',
          id: 'playlistIndex',
          label: 'Playlist Index',
          min: 0,
          max: 999,
          default: 0,
        },
        {
          type: 'number',
          id: 'cueIndex',
          label: 'Cue Index',
          min: 0,
          max: 999,
          default: 0,
        },
      ],
      callback: (feedback) => {
        const state = getState()
        const playlist = state.playlists[Number(feedback.options.playlistIndex)]
        const cue = playlist?.items?.[Number(feedback.options.cueIndex)]

        return Boolean(
          cue?.uuid &&
            state.workspaceTransport.some((transport) => transport.playingItem?.uuid === cue.uuid),
        )
      },
    },
    [FEEDBACK_ID_PLAYLIST_IS_ACTIVE]: {
      type: 'boolean',
      name: 'Playlist is active',
      description: 'True when any cue in the selected playlist is currently active in PVP',
      defaultStyle: {
        bgcolor: 0x0044aa,
        color: 0xffffff,
      },
      options: [
        {
          type: 'number',
          id: 'playlistIndex',
          label: 'Playlist Index',
          min: 0,
          max: 999,
          default: 0,
        },
      ],
      callback: (feedback) => {
        const state = getState()
        const playlist = state.playlists[Number(feedback.options.playlistIndex)]
        if (!playlist) return false

        const cueUuids = new Set(playlist.items.map((cue) => cue.uuid).filter(Boolean))
        return state.workspaceTransport.some((transport) => {
          const activeCueUuid = transport.playingItem?.uuid
          return Boolean(activeCueUuid && cueUuids.has(activeCueUuid))
        })
      },
    },
    [FEEDBACK_ID_LAYER_IS_ACTIVE]: {
      type: 'boolean',
      name: 'Layer is active',
      description: 'True when the selected PVP layer has an active transport state',
      defaultStyle: {
        bgcolor: 0xaa5500,
        color: 0xffffff,
      },
      options: [
        {
          type: 'dropdown',
          id: 'matchMode',
          label: 'Match Layer By',
          default: 'index',
          choices: [
            { id: 'index', label: 'Layer Index' },
            { id: 'name', label: 'Layer Name' },
          ],
        },
        {
          type: 'number',
          id: 'layerIndex',
          label: 'Layer Index',
          min: 0,
          max: 999,
          default: 0,
        },
        {
          type: 'textinput',
          id: 'layerName',
          label: 'Layer Name',
          default: '',
        },
      ],
      callback: (feedback) => {
        const state = getState()
        const matchMode = String(feedback.options.matchMode ?? 'index')

        if (matchMode === 'name') {
          const layerName = String(feedback.options.layerName ?? '').trim()
          if (!layerName) return false

          return state.workspaceTransport.some(
            (transport) =>
              transport.layer?.name === layerName && Boolean(transport.playingItem?.uuid),
          )
        }

        const layerIndex = Number(feedback.options.layerIndex)
        const transport = state.workspaceTransport[layerIndex]
        return Boolean(transport?.layer && transport.playingItem?.uuid)
      },
    },
    [FEEDBACK_ID_LAYER_IS_MUTED]: {
      type: 'boolean',
      name: 'Layer is muted',
      description: 'True when the selected PVP layer is muted',
      defaultStyle: {
        bgcolor: 0x777777,
        color: 0xffffff,
      },
      options: [layerIndexOption()],
      callback: (feedback) => getLayer(getState(), Number(feedback.options.layerIndex))?.isMuted === true,
    },
    [FEEDBACK_ID_LAYER_IS_HIDDEN]: {
      type: 'boolean',
      name: 'Layer is hidden',
      description: 'True when the selected PVP layer is hidden',
      defaultStyle: {
        bgcolor: 0x222222,
        color: 0xffffff,
      },
      options: [layerIndexOption()],
      callback: (feedback) => getLayer(getState(), Number(feedback.options.layerIndex))?.isHidden === true,
    },
    [FEEDBACK_ID_LAYER_OPACITY_COMPARE]: {
      type: 'boolean',
      name: 'Layer opacity compare',
      description: 'True when the selected layer opacity matches the comparison',
      defaultStyle: {
        bgcolor: 0x336699,
        color: 0xffffff,
      },
      options: [layerIndexOption(), compareOption(), valueOption('Opacity Value', 0, 1, 0.5)],
      callback: (feedback) =>
        compareNumbers(
          getLayer(getState(), Number(feedback.options.layerIndex))?.opacity,
          String(feedback.options.comparison),
          Number(feedback.options.value),
        ),
    },
    [FEEDBACK_ID_LAYER_TARGET_SET_IS]: {
      type: 'boolean',
      name: 'Layer target set is',
      description: 'True when the selected layer target set UUID matches',
      defaultStyle: {
        bgcolor: 0x225522,
        color: 0xffffff,
      },
      options: [layerIndexOption(), textOption('targetSetUUID', 'Target Set UUID')],
      callback: (feedback) =>
        getLayer(getState(), Number(feedback.options.layerIndex))?.targetSetUUID ===
        String(feedback.options.targetSetUUID ?? '').trim(),
    },
    [FEEDBACK_ID_LAYER_EFFECT_PRESET_IS]: {
      type: 'boolean',
      name: 'Layer effect preset is',
      description: 'True when the selected layer effect preset UUID matches',
      defaultStyle: {
        bgcolor: 0x552266,
        color: 0xffffff,
      },
      options: [layerIndexOption(), textOption('effectPresetUUID', 'Effect Preset UUID')],
      callback: (feedback) =>
        getLayer(getState(), Number(feedback.options.layerIndex))?.effectPresetUUID ===
        String(feedback.options.effectPresetUUID ?? '').trim(),
    },
    [FEEDBACK_ID_LAYER_EFFECT_IS_ACTIVE]: {
      type: 'boolean',
      name: 'Layer effect is active',
      description: 'True when the selected layer has an enabled effect by name or UUID',
      defaultStyle: {
        bgcolor: 0x663399,
        color: 0xffffff,
      },
      options: [
        layerIndexOption(),
        {
          type: 'dropdown',
          id: 'matchMode',
          label: 'Match Effect By',
          default: 'name',
          choices: [
            { id: 'name', label: 'Effect Name' },
            { id: 'uuid', label: 'Effect UUID' },
          ],
        },
        textOption('effectValue', 'Effect Name/UUID'),
      ],
      callback: (feedback) => {
        const layer = getLayer(getState(), Number(feedback.options.layerIndex))
        const matchMode = String(feedback.options.matchMode ?? 'name')
        const value = String(feedback.options.effectValue ?? '').trim()
        if (!layer || !value) return false

        return layer.effects.some((effect) => {
          const candidate = matchMode === 'uuid' ? effect.uuid : effect.name
          return candidate === value && effect.enabled !== false
        })
      },
    },
    [FEEDBACK_ID_LAYER_TRANSITION_IS]: {
      type: 'boolean',
      name: 'Layer transition is',
      description: 'True when the selected layer transition matches by name or UUID',
      defaultStyle: {
        bgcolor: 0x8844aa,
        color: 0xffffff,
      },
      options: [
        layerIndexOption(),
        {
          type: 'dropdown',
          id: 'matchMode',
          label: 'Match Transition By',
          default: 'name',
          choices: [
            { id: 'name', label: 'Transition Name' },
            { id: 'uuid', label: 'Transition UUID' },
          ],
        },
        textOption('transitionValue', 'Transition Name/UUID'),
      ],
      callback: (feedback) => {
        const layer = getLayer(getState(), Number(feedback.options.layerIndex))
        const matchMode = String(feedback.options.matchMode ?? 'name')
        const value = String(feedback.options.transitionValue ?? '').trim()
        const candidate = matchMode === 'uuid' ? layer?.transition?.uuid : layer?.transition?.name

        return Boolean(value && candidate === value)
      },
    },
    [FEEDBACK_ID_LAYER_TRANSITION_DURATION_COMPARE]: {
      type: 'boolean',
      name: 'Layer transition duration compare',
      description: 'True when the selected layer transition duration matches the comparison',
      defaultStyle: {
        bgcolor: 0x5555aa,
        color: 0xffffff,
      },
      options: [layerIndexOption(), compareOption(), valueOption('Duration Seconds', 0, 5, 0.5)],
      callback: (feedback) =>
        compareNumbers(
          getLayer(getState(), Number(feedback.options.layerIndex))?.transitionDuration,
          String(feedback.options.comparison),
          Number(feedback.options.value),
        ),
    },
    [FEEDBACK_ID_LAYER_PLAYING_ITEM_IS]: {
      type: 'boolean',
      name: 'Layer playing item is',
      description: 'True when the selected layer is playing a cue by name or UUID',
      defaultStyle: {
        bgcolor: 0x008855,
        color: 0xffffff,
      },
      options: [layerIndexOption(), matchNameOrUuidOption('Item'), textOption('itemValue', 'Item Name/UUID')],
      callback: (feedback) => {
        const transport = getTransport(getState(), Number(feedback.options.layerIndex))
        const candidate =
          String(feedback.options.matchMode ?? 'name') === 'uuid'
            ? transport?.playingItem?.uuid
            : transport?.playingItem?.name

        return Boolean(candidate && candidate === String(feedback.options.itemValue ?? '').trim())
      },
    },
    [FEEDBACK_ID_LAYER_PLAYING_MEDIA_IS]: {
      type: 'boolean',
      name: 'Layer playing media is',
      description: 'True when the selected layer is playing media by name or UUID',
      defaultStyle: {
        bgcolor: 0x008888,
        color: 0xffffff,
      },
      options: [layerIndexOption(), matchNameOrUuidOption('Media'), textOption('mediaValue', 'Media Name/UUID')],
      callback: (feedback) => {
        const transport = getTransport(getState(), Number(feedback.options.layerIndex))
        const candidate =
          String(feedback.options.matchMode ?? 'name') === 'uuid'
            ? transport?.playingMedia?.uuid
            : transport?.playingMedia?.name

        return Boolean(candidate && candidate === String(feedback.options.mediaValue ?? '').trim())
      },
    },
    [FEEDBACK_ID_LAYER_TIME_REMAINING_COMPARE]: {
      type: 'boolean',
      name: 'Layer time remaining compare',
      description: 'True when the selected layer time remaining matches the comparison',
      defaultStyle: {
        bgcolor: 0xbb0000,
        color: 0xffffff,
      },
      options: [layerIndexOption(), compareOption('lte'), valueOption('Seconds Remaining', 0, 86400, 10)],
      callback: (feedback) =>
        compareNumbers(
          getTransport(getState(), Number(feedback.options.layerIndex))?.timeRemaining,
          String(feedback.options.comparison),
          Number(feedback.options.value),
        ),
    },
    [FEEDBACK_ID_LAYER_IS_PLAYING]: {
      type: 'boolean',
      name: 'Layer is playing',
      description: 'True when the selected layer transport reports playing',
      defaultStyle: {
        bgcolor: 0x00aa00,
        color: 0xffffff,
      },
      options: [layerIndexOption()],
      callback: (feedback) =>
        getTransport(getState(), Number(feedback.options.layerIndex))?.isPlaying === true,
    },
    [FEEDBACK_ID_LAYER_IS_SCRUBBING]: {
      type: 'boolean',
      name: 'Layer is scrubbing',
      description: 'True when the selected layer transport reports scrubbing',
      defaultStyle: {
        bgcolor: 0xaa00aa,
        color: 0xffffff,
      },
      options: [layerIndexOption()],
      callback: (feedback) =>
        getTransport(getState(), Number(feedback.options.layerIndex))?.isScrubbing === true,
    },
    [FEEDBACK_ID_LAYER_PLAYBACK_RATE_COMPARE]: {
      type: 'boolean',
      name: 'Layer playback rate compare',
      description: 'True when the selected layer playback rate matches the comparison',
      defaultStyle: {
        bgcolor: 0x999900,
        color: 0xffffff,
      },
      options: [layerIndexOption(), compareOption(), valueOption('Playback Rate', -10, 10, 1)],
      callback: (feedback) =>
        compareNumbers(
          getTransport(getState(), Number(feedback.options.layerIndex))?.playbackRate,
          String(feedback.options.comparison),
          Number(feedback.options.value),
        ),
    },
  }
}

function getLayer(state: PvpState, layerIndex: number) {
  return state.layers[layerIndex] ?? state.workspaceTransport[layerIndex]?.layer
}

function getTransport(state: PvpState, layerIndex: number) {
  return state.workspaceTransport[layerIndex]
}

function compareNumbers(actual: number | undefined, comparison: string, expected: number): boolean {
  if (actual === undefined || !Number.isFinite(actual) || !Number.isFinite(expected)) return false

  switch (comparison) {
    case 'eq':
      return Math.abs(actual - expected) < 0.001
    case 'ne':
      return Math.abs(actual - expected) >= 0.001
    case 'gt':
      return actual > expected
    case 'gte':
      return actual >= expected
    case 'lt':
      return actual < expected
    case 'lte':
      return actual <= expected
    default:
      return false
  }
}

function layerIndexOption() {
  return {
    type: 'number' as const,
    id: 'layerIndex',
    label: 'Layer Index',
    min: 0,
    max: 999,
    default: 0,
  }
}

function compareOption(defaultValue = 'eq') {
  return {
    type: 'dropdown' as const,
    id: 'comparison',
    label: 'Comparison',
    default: defaultValue,
    choices: COMPARE_CHOICES,
  }
}

function valueOption(label: string, min: number, max: number, defaultValue: number) {
  return {
    type: 'number' as const,
    id: 'value',
    label,
    min,
    max,
    default: defaultValue,
  }
}

function textOption(id: string, label: string) {
  return {
    type: 'textinput' as const,
    id,
    label,
    default: '',
  }
}

function matchNameOrUuidOption(subject: string) {
  return {
    type: 'dropdown' as const,
    id: 'matchMode',
    label: `Match ${subject} By`,
    default: 'name',
    choices: [
      { id: 'name', label: `${subject} Name` },
      { id: 'uuid', label: `${subject} UUID` },
    ],
  }
}
