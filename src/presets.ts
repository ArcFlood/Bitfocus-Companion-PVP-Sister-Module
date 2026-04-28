import type { CompanionPresetDefinitions } from '@companion-module/base'
import { FEEDBACK_ID_CUE_IS_ACTIVE } from './feedbacks'

export function getPresetDefinitions(): CompanionPresetDefinitions {
  return {
    activeCue_0_0: {
      type: 'button',
      category: 'Cue Names',
      name: 'Cue 0.0 Active Highlight',
      style: {
        text: '$(renewedvision-pvp-variables:playlist_0_cue_0_name)',
        size: '14',
        color: 0xffffff,
        bgcolor: 0x000000,
      },
      steps: [],
      feedbacks: [
        {
          feedbackId: FEEDBACK_ID_CUE_IS_ACTIVE,
          options: {
            playlistIndex: 0,
            cueIndex: 0,
          },
        },
      ],
    },
  }
}
