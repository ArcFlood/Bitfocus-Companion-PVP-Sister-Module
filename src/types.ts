export interface ModuleConfig {
  host: string
  port: number
  useHttps: boolean
  pollIntervalMs: number
}

export interface ModuleSecrets {
  token?: string
}

export interface PvpCue {
  uuid: string
  name: string
}

export interface PvpPlaylist {
  uuid: string
  name: string
  path: string
  items: PvpCue[]
  childCount: number
  isVideoInput: boolean
}

export interface PvpEffectVariable {
  name?: string
  type?: string
  value?: string | number | boolean
  min?: number
  max?: number
  color?: string
  default?: string | number | boolean
}

export interface PvpEffect {
  uuid?: string
  name?: string
  enabled?: boolean
  variables: PvpEffectVariable[]
}

export interface PvpTransition {
  uuid?: string
  name?: string
  enabled?: boolean
  variables: PvpEffectVariable[]
}

export interface PvpNamedUuid {
  uuid?: string
  name?: string
}

export interface PvpNamedId {
  id?: string | number
  name?: string
}

export interface PvpBlendMode {
  id?: number
  name?: string
}

export interface PvpLayerBlend {
  type?: string
  modeIndex?: number
  modeName?: string
  opacity?: number
  isInverted?: boolean
}

export interface PvpEffectPreset extends PvpNamedUuid {
  effects: PvpEffect[]
}

export interface PvpLayer {
  uuid?: string
  name?: string
  isHidden?: boolean
  isMuted?: boolean
  opacity?: number
  targetSetUUID?: string
  targetSetName?: string
  effectPresetUUID?: string
  effectPresetName?: string
  layerPresetName?: string
  layerPresetId?: string | number
  blendMode?: PvpBlendMode
  blend?: PvpLayerBlend
  transitionDuration?: number
  transition?: PvpTransition
  effects: PvpEffect[]
}

export interface TransportState {
  timeElapsed?: number
  timeRemaining?: number
  playbackRate?: number
  isScrubbing?: boolean
  isPlaying?: boolean
  playingItem?: {
    uuid?: string
    name?: string
  }
  playingMedia?: {
    uuid?: string
    name?: string
  }
  layer?: {
    uuid?: string
    name?: string
    isHidden?: boolean
    isMuted?: boolean
    opacity?: number
    targetSetUUID?: string
    targetSetName?: string
    effectPresetUUID?: string
    effectPresetName?: string
    layerPresetName?: string
    layerPresetId?: string | number
    blendMode?: PvpBlendMode
    blend?: PvpLayerBlend
    transitionDuration?: number
    transition?: PvpTransition
    effects: PvpEffect[]
  }
}

export interface PvpState {
  playlists: PvpPlaylist[]
  layers: PvpLayer[]
  workspaceTransport: TransportState[]
  workspaceEffects: PvpEffect[]
  workspaceEffectPreset?: PvpEffectPreset
  workspaceTransition?: PvpTransition
  workspaceTransitionDuration?: number
  targetSets: PvpNamedUuid[]
  blendModes: PvpBlendMode[]
  layerPresets: PvpNamedId[]
  effectPresets: PvpEffectPreset[]
  transitions: PvpTransition[]
  availableEffects: PvpEffect[]
  lastPollTime?: string
  lastPollError?: string
}
