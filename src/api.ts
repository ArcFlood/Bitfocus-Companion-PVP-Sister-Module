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
  const payload = await fetchJson<unknown>(config, secrets, '/data/playlists')
  const rootPlaylist = getRecordProperty(payload, 'playlist')

  return flattenPlaylists(rootPlaylist)
}

export async function getTransportState(
  config: ModuleConfig,
  secrets: ModuleSecrets,
): Promise<TransportState[]> {
  const payload = await fetchJson<unknown>(config, secrets, '/transportState/workspace')

  if (isRecord(payload) && Array.isArray(payload.data)) {
    return payload.data
      .map((entry) => normalizeTransportState(getRecordProperty(entry, 'transportState')))
      .filter((state): state is TransportState => state !== undefined)
  }

  const wrappedState = normalizeTransportState(getRecordProperty(payload, 'transportState'))
  if (wrappedState) return [wrappedState]

  const directState = normalizeTransportState(payload)
  return directState ? [directState] : []
}

function flattenPlaylists(rootPlaylist: unknown): PvpPlaylist[] {
  const playlists: PvpPlaylist[] = []

  function walk(node: unknown, path: string[]): void {
    if (!isRecord(node)) return

    const name = getStringProperty(node, 'name', 'Playlist')
    const uuid = getStringProperty(node, 'uuid', '')
    const isRoot = name === 'Root' && path.length === 0
    const currentPath = isRoot ? path : [...path, name]
    const items = Array.isArray(node.items) ? node.items.map(normalizeCue) : []

    if (!isRoot) {
      playlists.push({
        uuid,
        name,
        path: currentPath.join(' / '),
        items,
      })
    }

    if (Array.isArray(node.children)) {
      node.children.forEach((child) => walk(child, currentPath))
    }
  }

  walk(rootPlaylist, [])
  return playlists
}

function normalizeCue(cue: unknown) {
  if (!isRecord(cue)) {
    return { uuid: '', name: '' }
  }

  return {
    uuid: getStringProperty(cue, 'uuid', ''),
    name: getStringProperty(cue, 'name', ''),
  }
}

function normalizeTransportState(state: unknown): TransportState | undefined {
  if (!isRecord(state)) return undefined

  const playingItem = getRecordProperty(state, 'playingItem')
  const layer = getRecordProperty(state, 'layer')

  return {
    playingItem: isRecord(playingItem)
      ? {
          uuid: getOptionalStringProperty(playingItem, 'uuid'),
          name: getOptionalStringProperty(playingItem, 'name'),
        }
      : undefined,
    layer: isRecord(layer)
      ? {
          uuid: getOptionalStringProperty(layer, 'uuid'),
          name: getOptionalStringProperty(layer, 'name'),
        }
      : undefined,
  }
}

function getRecordProperty(value: unknown, key: string): unknown {
  return isRecord(value) ? value[key] : undefined
}

function getStringProperty(value: Record<string, unknown>, key: string, fallback: string): string {
  return typeof value[key] === 'string' ? value[key] : fallback
}

function getOptionalStringProperty(value: Record<string, unknown>, key: string): string | undefined {
  return typeof value[key] === 'string' ? value[key] : undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
