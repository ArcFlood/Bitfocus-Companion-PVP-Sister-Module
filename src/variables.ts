import type { CompanionVariableDefinition } from '@companion-module/base'
import type { PvpState } from './types'

export function buildVariableDefinitions(state: PvpState): CompanionVariableDefinition[] {
  const defs: CompanionVariableDefinition[] = []

  state.playlists.forEach((playlist, playlistIndex) => {
    defs.push({
      variableId: `playlist_${playlistIndex}_name`,
      name: `Playlist ${playlistIndex} name`,
    })

    playlist.items.forEach((_cue, cueIndex) => {
      defs.push({
        variableId: `playlist_${playlistIndex}_cue_${cueIndex}_name`,
        name: `Playlist ${playlistIndex} cue ${cueIndex} name`,
      })
    })
  })

  state.layers.forEach((layer, layerIndex) => {
    addLayerVariableDefinitions(defs, layerIndex)

    layer.effects.forEach((_effect, effectIndex) => {
      defs.push(
        {
          variableId: `layer_${layerIndex}_effect_${effectIndex}_name`,
          name: `Layer ${layerIndex} effect ${effectIndex} name`,
        },
        {
          variableId: `layer_${layerIndex}_effect_${effectIndex}_uuid`,
          name: `Layer ${layerIndex} effect ${effectIndex} UUID`,
        },
        {
          variableId: `layer_${layerIndex}_effect_${effectIndex}_enabled`,
          name: `Layer ${layerIndex} effect ${effectIndex} enabled`,
        },
      )
    })
  })

  state.workspaceTransport.forEach((_transport, transportIndex) => {
    addTransportVariableDefinitions(defs, transportIndex)
  })

  return defs
}

export function buildVariableValues(state: PvpState): Record<string, string> {
  const values: Record<string, string> = {}

  state.playlists.forEach((playlist, playlistIndex) => {
    values[`playlist_${playlistIndex}_name`] = playlist.name

    playlist.items.forEach((cue, cueIndex) => {
      values[`playlist_${playlistIndex}_cue_${cueIndex}_name`] = cue.name
    })
  })

  state.layers.forEach((layer, layerIndex) => {
    values[`layer_${layerIndex}_name`] = layer.name ?? ''
    values[`layer_${layerIndex}_uuid`] = layer.uuid ?? ''
    values[`layer_${layerIndex}_is_hidden`] = formatBoolean(layer.isHidden)
    values[`layer_${layerIndex}_is_muted`] = formatBoolean(layer.isMuted)
    values[`layer_${layerIndex}_opacity`] = formatNumber(layer.opacity)
    values[`layer_${layerIndex}_target_set_uuid`] = layer.targetSetUUID ?? ''
    values[`layer_${layerIndex}_effect_preset_uuid`] = layer.effectPresetUUID ?? ''
    values[`layer_${layerIndex}_transition_name`] = layer.transition?.name ?? ''
    values[`layer_${layerIndex}_transition_uuid`] = layer.transition?.uuid ?? ''
    values[`layer_${layerIndex}_transition_enabled`] = formatBoolean(layer.transition?.enabled)
    values[`layer_${layerIndex}_transition_duration`] = formatNumber(layer.transitionDuration)
    values[`layer_${layerIndex}_effects`] = layer.effects.map((effect) => effect.name).filter(Boolean).join(', ')

    layer.effects.forEach((effect, effectIndex) => {
      values[`layer_${layerIndex}_effect_${effectIndex}_name`] = effect.name ?? ''
      values[`layer_${layerIndex}_effect_${effectIndex}_uuid`] = effect.uuid ?? ''
      values[`layer_${layerIndex}_effect_${effectIndex}_enabled`] = formatBoolean(effect.enabled)
    })
  })

  state.workspaceTransport.forEach((transport, transportIndex) => {
    values[`transport_${transportIndex}_layer_name`] = transport.layer?.name ?? ''
    values[`transport_${transportIndex}_layer_uuid`] = transport.layer?.uuid ?? ''
    values[`transport_${transportIndex}_playing_item_name`] = transport.playingItem?.name ?? ''
    values[`transport_${transportIndex}_playing_item_uuid`] = transport.playingItem?.uuid ?? ''
    values[`transport_${transportIndex}_playing_media_name`] = transport.playingMedia?.name ?? ''
    values[`transport_${transportIndex}_playing_media_uuid`] = transport.playingMedia?.uuid ?? ''
    values[`transport_${transportIndex}_is_playing`] = formatBoolean(transport.isPlaying)
    values[`transport_${transportIndex}_is_scrubbing`] = formatBoolean(transport.isScrubbing)
    values[`transport_${transportIndex}_playback_rate`] = formatNumber(transport.playbackRate)
    values[`transport_${transportIndex}_time_elapsed`] = formatNumber(transport.timeElapsed)
    values[`transport_${transportIndex}_time_elapsed_clock`] = formatClock(transport.timeElapsed)
    values[`transport_${transportIndex}_time_remaining`] = formatNumber(transport.timeRemaining)
    values[`transport_${transportIndex}_time_remaining_clock`] = formatClock(transport.timeRemaining)
    values[`transport_${transportIndex}_layer_is_hidden`] = formatBoolean(transport.layer?.isHidden)
    values[`transport_${transportIndex}_layer_is_muted`] = formatBoolean(transport.layer?.isMuted)
    values[`transport_${transportIndex}_layer_opacity`] = formatNumber(transport.layer?.opacity)
    values[`transport_${transportIndex}_layer_target_set_uuid`] = transport.layer?.targetSetUUID ?? ''
    values[`transport_${transportIndex}_layer_effect_preset_uuid`] = transport.layer?.effectPresetUUID ?? ''
    values[`transport_${transportIndex}_layer_transition_name`] = transport.layer?.transition?.name ?? ''
    values[`transport_${transportIndex}_layer_transition_uuid`] = transport.layer?.transition?.uuid ?? ''
    values[`transport_${transportIndex}_layer_transition_duration`] = formatNumber(
      transport.layer?.transitionDuration,
    )
    values[`transport_${transportIndex}_layer_effects`] =
      transport.layer?.effects.map((effect) => effect.name).filter(Boolean).join(', ') ?? ''
  })

  return values
}

export function structureSignature(state: PvpState): string {
  return JSON.stringify(
    {
      playlists: state.playlists.map((playlist) => ({
        uuid: playlist.uuid,
        name: playlist.name,
        path: playlist.path,
        itemCount: playlist.items.length,
      })),
      layers: state.layers.map((layer) => ({
        uuid: layer.uuid,
        name: layer.name,
        effectCount: layer.effects.length,
      })),
      transportCount: state.workspaceTransport.length,
    },
  )
}

function addLayerVariableDefinitions(defs: CompanionVariableDefinition[], layerIndex: number): void {
  defs.push(
    { variableId: `layer_${layerIndex}_name`, name: `Layer ${layerIndex} name` },
    { variableId: `layer_${layerIndex}_uuid`, name: `Layer ${layerIndex} UUID` },
    { variableId: `layer_${layerIndex}_is_hidden`, name: `Layer ${layerIndex} is hidden` },
    { variableId: `layer_${layerIndex}_is_muted`, name: `Layer ${layerIndex} is muted` },
    { variableId: `layer_${layerIndex}_opacity`, name: `Layer ${layerIndex} opacity` },
    { variableId: `layer_${layerIndex}_target_set_uuid`, name: `Layer ${layerIndex} target set UUID` },
    {
      variableId: `layer_${layerIndex}_effect_preset_uuid`,
      name: `Layer ${layerIndex} effect preset UUID`,
    },
    { variableId: `layer_${layerIndex}_transition_name`, name: `Layer ${layerIndex} transition name` },
    { variableId: `layer_${layerIndex}_transition_uuid`, name: `Layer ${layerIndex} transition UUID` },
    {
      variableId: `layer_${layerIndex}_transition_enabled`,
      name: `Layer ${layerIndex} transition enabled`,
    },
    {
      variableId: `layer_${layerIndex}_transition_duration`,
      name: `Layer ${layerIndex} transition duration`,
    },
    { variableId: `layer_${layerIndex}_effects`, name: `Layer ${layerIndex} effects` },
  )
}

function addTransportVariableDefinitions(defs: CompanionVariableDefinition[], transportIndex: number): void {
  defs.push(
    { variableId: `transport_${transportIndex}_layer_name`, name: `Transport ${transportIndex} layer name` },
    { variableId: `transport_${transportIndex}_layer_uuid`, name: `Transport ${transportIndex} layer UUID` },
    {
      variableId: `transport_${transportIndex}_playing_item_name`,
      name: `Transport ${transportIndex} playing item name`,
    },
    {
      variableId: `transport_${transportIndex}_playing_item_uuid`,
      name: `Transport ${transportIndex} playing item UUID`,
    },
    {
      variableId: `transport_${transportIndex}_playing_media_name`,
      name: `Transport ${transportIndex} playing media name`,
    },
    {
      variableId: `transport_${transportIndex}_playing_media_uuid`,
      name: `Transport ${transportIndex} playing media UUID`,
    },
    { variableId: `transport_${transportIndex}_is_playing`, name: `Transport ${transportIndex} is playing` },
    {
      variableId: `transport_${transportIndex}_is_scrubbing`,
      name: `Transport ${transportIndex} is scrubbing`,
    },
    {
      variableId: `transport_${transportIndex}_playback_rate`,
      name: `Transport ${transportIndex} playback rate`,
    },
    {
      variableId: `transport_${transportIndex}_time_elapsed`,
      name: `Transport ${transportIndex} time elapsed seconds`,
    },
    {
      variableId: `transport_${transportIndex}_time_elapsed_clock`,
      name: `Transport ${transportIndex} time elapsed clock`,
    },
    {
      variableId: `transport_${transportIndex}_time_remaining`,
      name: `Transport ${transportIndex} time remaining seconds`,
    },
    {
      variableId: `transport_${transportIndex}_time_remaining_clock`,
      name: `Transport ${transportIndex} time remaining clock`,
    },
    {
      variableId: `transport_${transportIndex}_layer_is_hidden`,
      name: `Transport ${transportIndex} layer is hidden`,
    },
    {
      variableId: `transport_${transportIndex}_layer_is_muted`,
      name: `Transport ${transportIndex} layer is muted`,
    },
    {
      variableId: `transport_${transportIndex}_layer_opacity`,
      name: `Transport ${transportIndex} layer opacity`,
    },
    {
      variableId: `transport_${transportIndex}_layer_target_set_uuid`,
      name: `Transport ${transportIndex} layer target set UUID`,
    },
    {
      variableId: `transport_${transportIndex}_layer_effect_preset_uuid`,
      name: `Transport ${transportIndex} layer effect preset UUID`,
    },
    {
      variableId: `transport_${transportIndex}_layer_transition_name`,
      name: `Transport ${transportIndex} layer transition name`,
    },
    {
      variableId: `transport_${transportIndex}_layer_transition_uuid`,
      name: `Transport ${transportIndex} layer transition UUID`,
    },
    {
      variableId: `transport_${transportIndex}_layer_transition_duration`,
      name: `Transport ${transportIndex} layer transition duration`,
    },
    {
      variableId: `transport_${transportIndex}_layer_effects`,
      name: `Transport ${transportIndex} layer effects`,
    },
  )
}

function formatBoolean(value: boolean | undefined): string {
  return value === undefined ? '' : value ? 'true' : 'false'
}

function formatNumber(value: number | undefined): string {
  return value === undefined ? '' : Number.isInteger(value) ? String(value) : value.toFixed(3)
}

function formatClock(value: number | undefined): string {
  if (value === undefined || !Number.isFinite(value)) return ''

  const totalSeconds = Math.max(0, Math.ceil(value))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
