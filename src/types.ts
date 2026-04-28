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
}

export interface PvpEffectVariable {
  name?: string
  type?: string
  value?: string | number | boolean
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
}

export interface PvpLayer {
  uuid?: string
  name?: string
  isHidden?: boolean
  isMuted?: boolean
  opacity?: number
  targetSetUUID?: string
  effectPresetUUID?: string
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
    effectPresetUUID?: string
    transitionDuration?: number
    transition?: PvpTransition
    effects: PvpEffect[]
  }
}

export interface PvpState {
  playlists: PvpPlaylist[]
  layers: PvpLayer[]
  workspaceTransport: TransportState[]
}
