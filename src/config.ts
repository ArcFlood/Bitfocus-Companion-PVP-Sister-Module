import type { SomeCompanionConfigField } from '@companion-module/base'
import type { ModuleConfig } from './types'

export const DEFAULT_CONFIG: ModuleConfig = {
  host: '',
  port: 49343,
  useHttps: false,
  pollIntervalMs: 750,
}

export function normalizeConfig(config: Partial<ModuleConfig> | undefined): ModuleConfig {
  return {
    host: config?.host?.trim() ?? DEFAULT_CONFIG.host,
    port: Number.isFinite(config?.port) ? Number(config?.port) : DEFAULT_CONFIG.port,
    useHttps: Boolean(config?.useHttps),
    pollIntervalMs:
      Number.isFinite(config?.pollIntervalMs) && Number(config?.pollIntervalMs) >= 250
        ? Number(config?.pollIntervalMs)
        : DEFAULT_CONFIG.pollIntervalMs,
  }
}

export function getConfigFields(): SomeCompanionConfigField[] {
  return [
    {
      type: 'textinput',
      id: 'host',
      label: 'Host',
      width: 8,
      default: DEFAULT_CONFIG.host,
      regex: '/^.+$/',
    },
    {
      type: 'number',
      id: 'port',
      label: 'Port',
      width: 4,
      min: 1,
      max: 65535,
      default: DEFAULT_CONFIG.port,
    },
    {
      type: 'checkbox',
      id: 'useHttps',
      label: 'Use HTTPS',
      width: 4,
      default: DEFAULT_CONFIG.useHttps,
    },
    {
      type: 'number',
      id: 'pollIntervalMs',
      label: 'Poll Interval (ms)',
      width: 8,
      min: 250,
      max: 5000,
      default: DEFAULT_CONFIG.pollIntervalMs,
    },
    {
      type: 'static-text',
      id: 'tokenNote',
      width: 12,
      label: 'Auth',
      value: 'Use the module secret field for API token when required.',
    },
  ]
}
