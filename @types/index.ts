import type { BadLabsApiPopulatedToken } from '../utils/badLabsApi'

export type PolicyId = string

export interface PopulatedTrait {
  label: string
  count: number
  percent: string
}

export interface PopulatedAsset extends BadLabsApiPopulatedToken {
  isBurned: boolean
  price?: number
}

export interface PopulatedWallet {
  stakeKey: string
  walletAddress: string
  assets: Record<PolicyId, PopulatedAsset[]>
}

export interface FloorPrices {
  [category: string]: {
    [trait: string]: number
  }
}

export interface FloorSnapshot {
  policyId: PolicyId
  timestamp: number
  floor: number
  attributes: FloorPrices
}
