import {
  InstanceBase,
  InstanceStatus,
  runEntrypoint,
  type CompanionVariableValues,
} from '@companion-module/base'
import { getPvpLiveState, getPvpState } from './api'
import { getConfigFields, normalizeConfig } from './config'
import { getFeedbackDefinitions } from './feedbacks'
import { getPresetDefinitions } from './presets'
import type { ModuleConfig, ModuleSecrets, PvpState } from './types'
import { UpgradeScripts } from './upgrades'
import { buildVariableDefinitions, buildVariableValues, structureSignature } from './variables'

class PvpDevInstance extends InstanceBase<ModuleConfig, ModuleSecrets> {
  private config: ModuleConfig = normalizeConfig(undefined)
  private secrets: ModuleSecrets = {}
  private state: PvpState = {
    playlists: [],
    layers: [],
    workspaceTransport: [],
    workspaceEffects: [],
    targetSets: [],
    blendModes: [],
    layerPresets: [],
    effectPresets: [],
    transitions: [],
    availableEffects: [],
  }
  private pollTimer: NodeJS.Timeout | undefined
  private pollInFlight = false
  private lastFullPollAt = 0
  private lastStructureSig = ''
  private readonly fullPollIntervalMs = 15000

  getConfigFields() {
    return getConfigFields()
  }

  async init(config: ModuleConfig, _isFirstInit: boolean, secrets: ModuleSecrets): Promise<void> {
    this.config = normalizeConfig(config)
    this.secrets = secrets ?? {}

    this.setActionDefinitions({})
    this.setFeedbackDefinitions(getFeedbackDefinitions(() => this.state))
    this.setVariableDefinitions([])
    this.setPresetDefinitions(getPresetDefinitions())

    this.startPolling()
  }

  async configUpdated(config: ModuleConfig, secrets: ModuleSecrets): Promise<void> {
    this.config = normalizeConfig(config)
    this.secrets = secrets ?? {}
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
      const shouldFullPoll =
        this.lastFullPollAt === 0 || Date.now() - this.lastFullPollAt >= this.fullPollIntervalMs

      this.state = shouldFullPoll
        ? await getPvpState(this.config, this.secrets)
        : await getPvpLiveState(this.config, this.secrets, this.state)
      if (shouldFullPoll) this.lastFullPollAt = Date.now()

      const nextSig = structureSignature(this.state)
      if (nextSig !== this.lastStructureSig) {
        this.setVariableDefinitions(buildVariableDefinitions(this.state))
        this.lastStructureSig = nextSig
      }

      this.setVariableValues(buildVariableValues(this.state) as CompanionVariableValues)
      this.checkFeedbacks()
      this.updateStatus(InstanceStatus.Ok)
    } catch (error: unknown) {
      this.state = {
        ...this.state,
        lastPollError: error instanceof Error ? error.message : String(error),
      }
      this.setVariableValues(buildVariableValues(this.state) as CompanionVariableValues)
      this.updateStatus(InstanceStatus.ConnectionFailure)
      throw error
    } finally {
      this.pollInFlight = false
    }
  }
}

runEntrypoint(PvpDevInstance, UpgradeScripts)
