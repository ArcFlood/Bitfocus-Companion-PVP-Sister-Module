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

export interface TransportState {
  playingItem?: {
    uuid?: string
    name?: string
  }
  layer?: {
    uuid?: string
    name?: string
  }
}

export interface PvpState {
  playlists: PvpPlaylist[]
  workspaceTransport: TransportState[]
}
