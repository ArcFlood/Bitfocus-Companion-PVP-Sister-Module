import type { ModuleConfig, ModuleSecrets, PvpPlaylist, TransportState } from './types'

function buildBaseUrl(config: ModuleConfig): string {
  const scheme = config.useHttps ? 'https' : 'http'
  return `${scheme}://${config.host}:${config.port}/api/0`
}

async function fetchJson<T>(config: ModuleConfig, secrets: ModuleSecrets, path: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  if (secrets.token) {
    headers.Authorization = `Bearer ${secrets.token}`
  }

  const response = await fetch(`${buildBaseUrl(config)}${path}`, {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    throw new Error(`PVP API request failed ${response.status} ${response.statusText}: ${path}`)
  }

  return (await response.json()) as T
}

export async function getPlaylists(config: ModuleConfig, secrets: ModuleSecrets): Promise<PvpPlaylist[]> {
  const payload = await fetchJson<{ playlists?: unknown[] }>(config, secrets, '/data/playlists')

  const playlists = Array.isArray(payload.playlists) ? payload.playlists : []

  return playlists.map((playlist: any) => ({
    name: typeof playlist?.name === 'string' ? playlist.name : 'Playlist',
    items: Array.isArray(playlist?.items)
      ? playlist.items.map((cue: any) => ({
          uuid: typeof cue?.uuid === 'string' ? cue.uuid : '',
          name: typeof cue?.name === 'string' ? cue.name : '',
        }))
      : [],
  }))
}

export async function getTransportState(
  config: ModuleConfig,
  secrets: ModuleSecrets,
): Promise<TransportState> {
  const payload = await fetchJson<TransportState>(config, secrets, '/transportState/workspace')

  return {
    playingItem: {
      uuid: payload?.playingItem?.uuid,
      name: payload?.playingItem?.name,
    },
  }
}
