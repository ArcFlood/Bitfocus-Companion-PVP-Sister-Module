import type {
  ModuleConfig,
  ModuleSecrets,
  PvpEffect,
  PvpEffectVariable,
  PvpLayer,
  PvpPlaylist,
  PvpTransition,
  TransportState,
} from './types'

function buildBaseUrl(config: ModuleConfig): string {
  const parsedHost = parseHost(config.host)
  const scheme = parsedHost.scheme ?? (config.useHttps ? 'https' : 'http')
  const port = parsedHost.port ?? config.port

  return `${scheme}://${parsedHost.host}:${port}/api/0`
}

async function fetchJson<T>(config: ModuleConfig, secrets: ModuleSecrets, path: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  if (secrets.token) {
    headers.Authorization = `Bearer ${secrets.token}`
  }

  const url = `${buildBaseUrl(config)}${path}`
  let response: Response

  try {
    response = await fetch(url, {
      method: 'GET',
      headers,
    })
  } catch (error: unknown) {
    throw new Error(`PVP API request failed before response: ${url} (${formatErrorWithCause(error)})`)
  }

  if (!response.ok) {
    throw new Error(`PVP API request failed ${response.status} ${response.statusText}: ${url}`)
  }

  return (await response.json()) as T
}

function parseHost(host: string): { host: string; port?: number; scheme?: 'http' | 'https' } {
  const trimmed = host.trim()
  const hostWithScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`

  try {
    const parsed = new URL(hostWithScheme)
    const scheme =
      parsed.protocol === 'http:' ? 'http' : parsed.protocol === 'https:' ? 'https' : undefined
    const port = parsed.port ? Number(parsed.port) : undefined

    return {
      host: parsed.hostname,
      port: Number.isFinite(port) ? port : undefined,
      scheme,
    }
  } catch (_error: unknown) {
    return { host: trimmed.replace(/^https?:\/\//i, '').replace(/\/.*$/, '') }
  }
}

function formatErrorWithCause(error: unknown): string {
  if (!(error instanceof Error)) return String(error)

  const cause = error.cause
  if (cause instanceof Error) return `${error.message}: ${cause.message}`
  if (cause) return `${error.message}: ${String(cause)}`

  return error.message
}

export async function getPlaylists(config: ModuleConfig, secrets: ModuleSecrets): Promise<PvpPlaylist[]> {
  const payload = await fetchJson<unknown>(config, secrets, '/data/playlists')
  const rootPlaylist = getRecordProperty(payload, 'playlist')

  return flattenPlaylists(rootPlaylist)
}

export async function getLayers(config: ModuleConfig, secrets: ModuleSecrets): Promise<PvpLayer[]> {
  const payload = await fetchJson<unknown>(config, secrets, '/data/layers')

  if (!isRecord(payload) || !Array.isArray(payload.data)) return []

  return payload.data
    .map((entry) => normalizeLayer(getRecordProperty(entry, 'layer')))
    .filter((layer): layer is PvpLayer => layer !== undefined)
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
  const playingMedia = getRecordProperty(state, 'playingMedia')
  const layer = getRecordProperty(state, 'layer')
  const normalizedLayer = normalizeLayer(layer)

  return {
    timeElapsed: getOptionalNumberProperty(state, 'timeElapsed'),
    timeRemaining: getOptionalNumberProperty(state, 'timeRemaining'),
    playbackRate: getOptionalNumberProperty(state, 'playbackRate'),
    isScrubbing: getOptionalBooleanProperty(state, 'isScrubbing'),
    isPlaying: getOptionalBooleanProperty(state, 'isPlaying'),
    playingItem: isRecord(playingItem)
      ? {
          uuid: getOptionalStringProperty(playingItem, 'uuid'),
          name: getOptionalStringProperty(playingItem, 'name'),
        }
      : undefined,
    playingMedia: isRecord(playingMedia)
      ? {
          uuid: getOptionalStringProperty(playingMedia, 'uuid'),
          name: getOptionalStringProperty(playingMedia, 'name'),
        }
      : undefined,
    layer: normalizedLayer,
  }
}

function normalizeLayer(layer: unknown): PvpLayer | undefined {
  if (!isRecord(layer)) return undefined

  const transition = normalizeTransition(getRecordProperty(layer, 'transition'))

  return {
    uuid: getOptionalStringProperty(layer, 'uuid'),
    name: getOptionalStringProperty(layer, 'name'),
    isHidden: getOptionalBooleanProperty(layer, 'isHidden'),
    isMuted: getOptionalBooleanProperty(layer, 'isMuted'),
    opacity: getOptionalNumberProperty(layer, 'opacity'),
    targetSetUUID: getOptionalStringProperty(layer, 'targetSetUUID'),
    effectPresetUUID: getOptionalStringProperty(layer, 'effectPresetUUID'),
    transitionDuration: getOptionalNumberProperty(layer, 'transitionDuration'),
    transition,
    effects: Array.isArray(layer.effects)
      ? layer.effects
          .map((effect) => normalizeEffect(effect))
          .filter((effect): effect is PvpEffect => effect !== undefined)
      : [],
  }
}

function normalizeTransition(transition: unknown): PvpTransition | undefined {
  if (!isRecord(transition)) return undefined

  return {
    uuid: getOptionalStringProperty(transition, 'uuid'),
    name: getOptionalStringProperty(transition, 'name'),
    enabled: getOptionalBooleanProperty(transition, 'enabled'),
  }
}

function normalizeEffect(effect: unknown): PvpEffect | undefined {
  if (!isRecord(effect)) return undefined

  return {
    uuid: getOptionalStringProperty(effect, 'uuid'),
    name: getOptionalStringProperty(effect, 'name'),
    enabled: getOptionalBooleanProperty(effect, 'enabled'),
    variables: Array.isArray(effect.variables)
      ? effect.variables
          .map((variable) => normalizeEffectVariable(variable))
          .filter((variable): variable is PvpEffectVariable => variable !== undefined)
      : [],
  }
}

function normalizeEffectVariable(variable: unknown): PvpEffectVariable | undefined {
  if (!isRecord(variable)) return undefined

  const base = getRecordProperty(variable, 'base')
  if (!isRecord(base)) return undefined

  return {
    name: getOptionalStringProperty(base, 'name'),
    type: getOptionalStringProperty(variable, 'type'),
    value: getOptionalScalarProperty(base, 'value') ?? getOptionalStringProperty(base, 'color'),
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

function getOptionalNumberProperty(value: Record<string, unknown>, key: string): number | undefined {
  return typeof value[key] === 'number' ? value[key] : undefined
}

function getOptionalBooleanProperty(value: Record<string, unknown>, key: string): boolean | undefined {
  return typeof value[key] === 'boolean' ? value[key] : undefined
}

function getOptionalScalarProperty(
  value: Record<string, unknown>,
  key: string,
): string | number | boolean | undefined {
  const property = value[key]
  return typeof property === 'string' || typeof property === 'number' || typeof property === 'boolean'
    ? property
    : undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
