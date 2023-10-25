import { createContext, useState, useContext, useMemo, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { BrowserWallet, Wallet } from '@meshsdk/core'
import badLabsApi, { BadLabsApiBaseToken } from '@/utils/badLabsApi'
import getFileForPolicyId from '@/functions/getFileForPolicyId'
import populateAsset from '@/functions/populateAsset'
import type { PolicyId, PopulatedWallet } from '@/@types'
import {
  APE_NATION_POLICY_ID,
  BLING_POLICY_ID,
  IHOLD_MUSIC_POLICY_ID,
  JUNGLE_JUICE_POLICY_ID,
  MUTATION_NATION_MEGA_MUTANTS_POLICY_ID,
  MUTATION_NATION_POLICY_ID,
  NATION_COIN_POLICY_ID,
  OG_CLUB_CARD_POLICY_ID,
  ORDINAL_TOKENS_POLICY_ID,
} from '@/constants'
import formatTokenAmount from '@/functions/formatters/formatTokenAmount'

interface LocalStorageConnectedWallet {
  walletProvider: string
  stakeKey: string
}

interface ContextValue {
  availableWallets: Wallet[]
  connectWallet: (_walletName: string) => Promise<void>
  connectWalletManually: (_walletIdentifier: string) => Promise<void>
  disconnectWallet: () => void
  connecting: boolean
  connected: boolean
  connectedName: string
  connectedManually: boolean
  wallet: BrowserWallet | null
  populatedWallet: PopulatedWallet | null
  removeAssetsFromWallet: (
    _assetIds: string[],
    _controlledAmounts?: {
      policyId: PolicyId
      tokenId: string
      amount: number
    }[]
  ) => Promise<void>
}

const WalletContext = createContext<ContextValue>({
  availableWallets: [],
  connectWallet: async (_walletName: string) => {},
  connectWalletManually: async (_walletIdentifier: string) => {},
  disconnectWallet: () => {},
  connecting: false,
  connected: false,
  connectedManually: false,
  connectedName: '',
  wallet: null,
  populatedWallet: null,
  removeAssetsFromWallet: async (_assetIds: string[]) => {},
})

export default function useWallet() {
  return useContext(WalletContext)
}

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [availableWallets, setAvailableWallets] = useState<Wallet[]>([])
  const [wallet, setWallet] = useState<BrowserWallet | null>(null)
  const [populatedWallet, setPopulatedWallet] = useState<PopulatedWallet | null>(null)

  useEffect(() => {
    setAvailableWallets(BrowserWallet.getInstalledWallets())
  }, [])

  const [connecting, setConnecting] = useState<boolean>(false)
  const [connected, setConnected] = useState<boolean>(false)
  const [connectedName, setConnectedName] = useState<string>('')
  const [connectedManually, setConnectedManually] = useState<boolean>(false)

  const connectWallet = async (_walletName: string) => {
    if (connecting) return
    setConnecting(true)

    try {
      const _wallet = await BrowserWallet.enable(_walletName)

      if (_wallet) {
        const stakeKeys = await _wallet.getRewardAddresses()
        const stakeKey = stakeKeys[0]

        const walletAddress = await _wallet.getChangeAddress()
        const walletResponse = await badLabsApi.wallet.getData(stakeKey, { withTokens: true })
        const walletTokens = walletResponse.tokens as BadLabsApiBaseToken[]

        const getTokens = async (tokens: BadLabsApiBaseToken[], policyId: PolicyId) =>
          (await Promise.all(
            (tokens?.filter(({ tokenId }) => tokenId.indexOf(policyId) == 0) || []).map(async ({ tokenId }) => {
              const foundAsset = getFileForPolicyId(policyId).assets.find((x) => x.tokenId === tokenId)

              if (!foundAsset) {
                return await populateAsset({
                  assetId: tokenId,
                  policyId: policyId,
                  withRanks: false,
                })
              }

              return foundAsset
            })
          )) || []

        setPopulatedWallet({
          stakeKey,
          walletAddress,
          assets: {
            [APE_NATION_POLICY_ID]: await getTokens(walletTokens, APE_NATION_POLICY_ID),
            [JUNGLE_JUICE_POLICY_ID]: await getTokens(walletTokens, JUNGLE_JUICE_POLICY_ID),
            [MUTATION_NATION_POLICY_ID]: await getTokens(walletTokens, MUTATION_NATION_POLICY_ID),
            [MUTATION_NATION_MEGA_MUTANTS_POLICY_ID]: await getTokens(walletTokens, MUTATION_NATION_MEGA_MUTANTS_POLICY_ID),
            [ORDINAL_TOKENS_POLICY_ID]: await getTokens(walletTokens, ORDINAL_TOKENS_POLICY_ID),
            [OG_CLUB_CARD_POLICY_ID]: await getTokens(walletTokens, OG_CLUB_CARD_POLICY_ID),
            [BLING_POLICY_ID]: await getTokens(walletTokens, BLING_POLICY_ID),
            [IHOLD_MUSIC_POLICY_ID]: await getTokens(walletTokens, IHOLD_MUSIC_POLICY_ID),
            [NATION_COIN_POLICY_ID]: await getTokens(walletTokens, NATION_COIN_POLICY_ID),
          },
        })

        setWallet(_wallet)
        setConnectedName(_walletName)
        setConnected(true)
        setConnectedManually(false)
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.message)
    }

    setConnecting(false)
  }

  const connectWalletManually = async (_walletIdentifier: string) => {
    if (connecting) return
    setConnecting(true)

    try {
      if (_walletIdentifier) {
        const data = await badLabsApi.wallet.getData(_walletIdentifier, { withTokens: true })

        const getTokens = async (tokens: BadLabsApiBaseToken[], policyId: PolicyId) =>
          (await Promise.all(
            (tokens?.filter(({ tokenId }) => tokenId.indexOf(policyId) == 0) || []).map(async ({ tokenId }) => {
              const foundAsset = getFileForPolicyId(policyId).assets.find((x) => x.tokenId === tokenId)

              if (!foundAsset) {
                return await populateAsset({
                  assetId: tokenId,
                  policyId: policyId,
                  withRanks: true,
                })
              }

              return foundAsset
            })
          )) || []

        setPopulatedWallet({
          stakeKey: data.stakeKey,
          walletAddress: data.addresses[0].address,
          assets: {
            [APE_NATION_POLICY_ID]: await getTokens(data.tokens as BadLabsApiBaseToken[], APE_NATION_POLICY_ID),
            [JUNGLE_JUICE_POLICY_ID]: await getTokens(data.tokens as BadLabsApiBaseToken[], JUNGLE_JUICE_POLICY_ID),
            [MUTATION_NATION_POLICY_ID]: await getTokens(data.tokens as BadLabsApiBaseToken[], MUTATION_NATION_POLICY_ID),
            [MUTATION_NATION_MEGA_MUTANTS_POLICY_ID]: await getTokens(data.tokens as BadLabsApiBaseToken[], MUTATION_NATION_MEGA_MUTANTS_POLICY_ID),
            [ORDINAL_TOKENS_POLICY_ID]: await getTokens(data.tokens as BadLabsApiBaseToken[], ORDINAL_TOKENS_POLICY_ID),
            [OG_CLUB_CARD_POLICY_ID]: await getTokens(data.tokens as BadLabsApiBaseToken[], OG_CLUB_CARD_POLICY_ID),
            [BLING_POLICY_ID]: await getTokens(data.tokens as BadLabsApiBaseToken[], BLING_POLICY_ID),
            [IHOLD_MUSIC_POLICY_ID]: await getTokens(data.tokens as BadLabsApiBaseToken[], IHOLD_MUSIC_POLICY_ID),
            [NATION_COIN_POLICY_ID]: await getTokens(data.tokens as BadLabsApiBaseToken[], NATION_COIN_POLICY_ID),
          },
        })

        setConnectedName('Blockfrost')
        setConnected(true)
        setConnectedManually(true)
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.message)
    }

    setConnecting(false)
  }

  const disconnectWallet = () => {
    setWallet(null)
    setPopulatedWallet(null)
    setConnecting(false)
    setConnected(false)
    setConnectedName('')
    setConnectedManually(false)
    window.localStorage.removeItem('connected-wallet')
  }

  useEffect(() => {
    if (connected && populatedWallet) {
      const payload: LocalStorageConnectedWallet = {
        walletProvider: connectedName,
        stakeKey: populatedWallet.stakeKey,
      }

      window.localStorage.setItem('connected-wallet', JSON.stringify(payload))
    }
  }, [connected])

  useEffect(() => {
    if (!connected) {
      const connectPaths = ['/wallet', '/bloodline']

      if (connectPaths.includes(window.location.pathname)) {
        const storageItem = window.localStorage.getItem('connected-wallet')

        if (storageItem) {
          const connectedWallet: LocalStorageConnectedWallet = JSON.parse(storageItem)

          if (connectedWallet.walletProvider === 'Blockfrost') {
            connectWalletManually(connectedWallet.stakeKey)
          } else {
            connectWallet(connectedWallet.walletProvider)
          }
        }
      }
    }
  }, [])

  const removeAssetsFromWallet = async (_assetIds: string[], _controlledAmounts?: { policyId: PolicyId; tokenId: string; amount: number }[]) => {
    if (connecting) return
    setConnecting(true)

    try {
      if (wallet) {
        setPopulatedWallet((prev) => {
          if (!prev) return prev

          const payload = { ...prev.assets }

          Object.entries(payload).forEach(([policyId, assets]) => {
            payload[policyId as PolicyId] = assets.filter((asset) => !_assetIds.includes(asset.tokenId))
          })

          _controlledAmounts?.forEach(({ policyId, tokenId, amount }) => {
            const idx = payload[policyId as PolicyId].findIndex((x) => x.tokenId === tokenId)
            const { decimals, onChain, display } = payload[policyId as PolicyId][idx].tokenAmount

            payload[policyId as PolicyId][idx].tokenAmount.onChain = onChain - amount
            payload[policyId as PolicyId][idx].tokenAmount.display = display - formatTokenAmount.fromChain(amount, decimals)
          })

          return {
            ...prev,
            assets: payload,
          }
        })
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.message)
    }

    setConnecting(false)
  }

  const payload = useMemo(
    () => ({
      availableWallets,
      connectWallet,
      connectWalletManually,
      disconnectWallet,
      connecting,
      connected,
      connectedName,
      connectedManually,
      populatedWallet,
      wallet,
      removeAssetsFromWallet,
    }),
    [availableWallets, connecting, connected, populatedWallet, wallet, removeAssetsFromWallet]
  )

  return <WalletContext.Provider value={payload}>{children}</WalletContext.Provider>
}
