import {
  InstanceBase,
  InstanceStatus,
  runEntrypoint,
  type CompanionOptionValues,
} from '@companion-module/base'
import { getPlaylists, getTransportState } from './api'
import { getConfigFields, normalizeConfig } from './config'
import { getFeedbackDefinitions } from './feedbacks'
import { getPresetDefinitions } from './presets'
import type { ModuleConfig, ModuleSecrets, PvpState } from './types'
import { UpgradeScripts } from './upgrades'
import { buildVariableDefinitions, buildVariableValues, structureSignature } from './variables'

class PvpDevInstance extends InstanceBase<ModuleConfig, ModuleSecrets> {
  private config: ModuleConfig = normalizeConfig(undefined)
  private state: PvpState = { playlists: [], transportState: {} }
  private pollTimer: NodeJS.Timeout | undefined
  private pollInFlight = false
  private lastStructureSig = ''

  getConfigFields() {
    return getConfigFields()
  }

  async init(config: ModuleConfig): Promise<void> {
    this.config = normalizeConfig(config)

    this.setActionDefinitions({})
    this.setFeedbackDefinitions(getFeedbackDefinitions(() => this.state))
    this.setVariableDefinitions([])
    this.setPresetDefinitions(getPresetDefinitions())

    this.startPolling()
  }

  async configUpdated(config: ModuleConfig): Promise<void> {
    this.config = normalizeConfig(config)
    this.stopPolling()
    this.startPolling()
  }

  async destroy(): Promise<void> {
    this.stopPolling()
  }

  private startPolling(): void {
    if (!this.config.host) {
      this.updateStatus(InstanceStatus.BadConfig, 'Host is required')
      return
    }

    this.updateStatus(InstanceStatus.Connecting)
    this.pollOnce().catch((error: unknown) => {
      this.log('error', `Initial poll failed: ${error instanceof Error ? error.message : String(error)}`)
    })

    this.pollTimer = setInterval(() => {
      this.pollOnce().catch((error: unknown) => {
        this.log('error', `Poll failed: ${error instanceof Error ? error.message : String(error)}`)
      })
    }, this.config.pollIntervalMs)
  }

  private stopPolling(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer)
      this.pollTimer = undefined
    }
  }

  private async pollOnce(): Promise<void> {
    if (this.pollInFlight) return
    this.pollInFlight = true

    try {
      const [playlists, transportState] = await Promise.all([
        getPlaylists(this.config, this.secrets),
        getTransportState(this.config, this.secrets),
      ])

      this.state = { playlists, transportState }

      const nextSig = structureSignature(this.state)
      if (nextSig !== this.lastStructureSig) {
        this.setVariableDefinitions(buildVariableDefinitions(this.state))
        this.lastStructureSig = nextSig
      }

      this.setVariableValues(buildVariableValues(this.state) as CompanionOptionValues)
      this.checkFeedbacks()
      this.updateStatus(InstanceStatus.Ok)
    } catch (error: unknown) {
      this.updateStatus(InstanceStatus.ConnectionFailure)
      throw error
    } finally {
      this.pollInFlight = false
    }
  }
}

runEntrypoint(PvpDevInstance, UpgradeScripts)
