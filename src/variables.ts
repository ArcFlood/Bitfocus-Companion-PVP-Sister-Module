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

  return values
}

export function structureSignature(state: PvpState): string {
  return JSON.stringify(
    state.playlists.map((playlist) => ({
      uuid: playlist.uuid,
      name: playlist.name,
      path: playlist.path,
      itemCount: playlist.items.length,
    })),
  )
}
