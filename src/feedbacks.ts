import type { CompanionFeedbackDefinitions } from '@companion-module/base'
import type { PvpState } from './types'

export const FEEDBACK_ID_CUE_IS_ACTIVE = 'cue_is_active'

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
          default: 0,
        },
        {
          type: 'number',
          id: 'cueIndex',
          label: 'Cue Index',
          min: 0,
          default: 0,
        },
      ],
      callback: (feedback) => {
        const state = getState()
        const playlist = state.playlists[Number(feedback.options.playlistIndex)]
        const cue = playlist?.items?.[Number(feedback.options.cueIndex)]
        const activeUuid = state.transportState.playingItem?.uuid

        return Boolean(cue?.uuid && activeUuid && cue.uuid === activeUuid)
      },
    },
  }
}
