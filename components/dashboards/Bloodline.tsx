import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { Transaction } from '@meshsdk/core'
import useWallet from '@/contexts/WalletContext'
import badLabsApi, { BadLabsApiTransaction } from '@/utils/badLabsApi'
import sleep from '@/functions/sleep'
import WalletHero from '../Wallet/WalletHero'
import ImageLoader from '../Loader/ImageLoader'
import type { PopulatedAsset } from '@/@types'
import {
  APE_NATION_POLICY_ID,
  BLOODLINE_POLICY_ID,
  MUTATION_NATION_POLICY_ID,
  ONE_MILLION,
  BLOODLINE_VAULT_WALLET_ADDRESS,
  BLOODLINE_MINT_WALLET_ADDRESS,
  NATION_COIN_POLICY_ID,
  TEAM_TREASURY_WALLET_ADDRESS,
} from '@/constants'

const EVENT_OPEN = true

const Bloodline = () => {
  const { connectedManually, wallet, populatedWallet, disconnectWallet, removeAssetsFromWallet } = useWallet()

  const [sets, setSets] = useState<{ v0: PopulatedAsset; v1: PopulatedAsset; v2: PopulatedAsset }[]>([])
  const [loadingTx, setLoadingTx] = useState<boolean>(false)
  const [disable, setDisable] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>(
    !EVENT_OPEN ? 'The portal is closed at the moment, please check in with our community for further announcements.' : ''
  )

  useEffect(() => {
    if (EVENT_OPEN && populatedWallet?.stakeKey) {
      const payload: typeof sets = []

      populatedWallet.assets[APE_NATION_POLICY_ID].forEach((v0) => {
        const v1 = populatedWallet.assets[MUTATION_NATION_POLICY_ID].find((x) => x.serialNumber === Number(`${v0.serialNumber}1`))
        if (!!v1) {
          const v2 = populatedWallet.assets[MUTATION_NATION_POLICY_ID].find((x) => x.serialNumber === Number(`${v0.serialNumber}2`))
          if (!!v2) {
            payload.push({ v0, v1, v2 })
          }
        }
      })

      const nationCoin = populatedWallet.assets[NATION_COIN_POLICY_ID][0]

      if (!nationCoin || nationCoin.tokenAmount.display < 80) {
        setErrorMessage('Must have at least 80 $NATION')
        setDisable(true)
      }

      setSets(payload.sort((a, b) => (a.v0.serialNumber || 0) - (b.v0.serialNumber || 0)))
    }
  }, [populatedWallet])

  const txConfirmation = useCallback(async (_txHash: string): Promise<BadLabsApiTransaction> => {
    try {
      const data = await badLabsApi.transaction.getData(_txHash)

      if (data.block) {
        return data
      } else {
        await sleep(1000)
        return await txConfirmation(_txHash)
      }
    } catch (error: any) {
      const errMsg = error?.response?.data || error?.message || error?.toString() || 'UNKNOWN ERROR'

      if (errMsg === `The requested component has not been found. ${_txHash}`) {
        await sleep(1000)
        return await txConfirmation(_txHash)
      } else {
        throw new Error(errMsg)
      }
    }
  }, [])

  const buildTx = useCallback(
    async (v0: PopulatedAsset, v1: PopulatedAsset, v2: PopulatedAsset) => {
      if (!wallet) return
      setLoadingTx(true)

      try {
        const tx = new Transaction({ initiator: wallet })
          .sendAssets({ address: BLOODLINE_VAULT_WALLET_ADDRESS }, [
            {
              unit: v0.tokenId,
              quantity: '1',
            },
            {
              unit: v1.tokenId,
              quantity: '1',
            },
            {
              unit: v2.tokenId,
              quantity: '1',
            },
          ])
          .sendLovelace(
            { address: BLOODLINE_MINT_WALLET_ADDRESS }, // mint
            String(2 * ONE_MILLION)
          )
          .sendLovelace(
            { address: 'addr1q9knw3lmvlpsvemjpgmkqkwtkzv8wueggf9aavvzyt2akpw7nsavexls6g59x007aucn2etqp2q4rd0929z2ukcn78fslm56p9' }, // developer
            String(2 * ONE_MILLION)
          )
          .sendLovelace(
            { address: TEAM_TREASURY_WALLET_ADDRESS }, // team
            String(2 * ONE_MILLION)
          )
          .sendAssets(
            { address: TEAM_TREASURY_WALLET_ADDRESS }, // team
            [
              {
                unit: `${NATION_COIN_POLICY_ID}4e4154494f4e`, // $nation
                quantity: '80000000',
              },
            ]
          )

        toast.loading('Building transaction')
        const unsignedTx = await tx.build()

        toast.dismiss()
        toast.loading('Awaiting signature')
        const signedTx = await wallet?.signTx(unsignedTx)

        toast.dismiss()
        toast.loading('Submitting transaction')
        const txHash = await wallet?.submitTx(signedTx as string)

        toast.dismiss()
        toast.loading('Awaiting network confirmation')
        await txConfirmation(txHash as string)
        toast.dismiss()
        toast.success('Transaction submitted!')

        toast.loading('Minting NFT...')
        await axios.post('/api/mint/bloodline', { txHash })
        toast.dismiss()
        toast.success('NFT minted!')

        await removeAssetsFromWallet(
          [v0.tokenId, v1.tokenId, v2.tokenId],
          [{ policyId: NATION_COIN_POLICY_ID, tokenId: 'cf5d945ad03a11c46e70a85daa8598b2275f9442ceed1249754ad9a14e4154494f4e', amount: 80000000 }]
        )
      } catch (error: any) {
        console.error(error)
        toast.remove()
        toast.error('Woopsies!')

        if (error?.message?.indexOf('User declined to sign the transaction.') !== -1) {
          // [BrowserWallet] An error occurred during signTx: {"code":2,"info":"User declined to sign the transaction."}
          setErrorMessage('TX build failed: you declined the transaction.')
        } else if (error?.message?.indexOf('Not enough ADA leftover to include non-ADA assets') !== -1) {
          // [Transaction] An error occurred during build: Not enough ADA leftover to include non-ADA assets in a change address.
          setErrorMessage('TX build failed: your UTXOs are locked, please unlock them using https://unfrack.it')
        } else if (error?.message?.indexOf('UTxO Balance Insufficient') !== -1) {
          // [Transaction] An error occurred during build: UTxO Balance Insufficient.
          setErrorMessage('TX build failed: not enough ADA to process TX, please add ADA to your wallet, then try again.')
        } else {
          setErrorMessage(error?.message || error?.toString())
        }
      }

      setLoadingTx(false)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [txConfirmation, loadingTx, wallet]
  )

  const [mintCount, setMintCount] = useState({ supply: 0, minted: 0, percent: '0%' })

  const getAndSetCounts = async () => {
    try {
      const res = await badLabsApi.policy.getData(BLOODLINE_POLICY_ID, { allTokens: true })

      const supply = 2169
      const count = res.tokens.length

      setMintCount({
        supply,
        minted: count,
        percent: `${((100 / supply) * count).toFixed(2)}%`,
      })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getAndSetCounts()
  }, [])

  if (connectedManually) {
    return (
      <div className='flex flex-col items-center'>
        <p className='pt-[5vh] text-center text-lg text-[var(--pink)]'>
          Error! You connected manually.
          <br />
          Please re-connect in a non-manual way.
        </p>

        <button
          onClick={disconnectWallet}
          className='p-1 px-2 mt-2 bg-red-900 hover:bg-red-700 bg-opacity-50 hover:bg-opacity-50 rounded-xl border border-red-900 hover:border-red-700 text-base hover:text-gray-200'
        >
          Disconnect Wallet
        </button>
      </div>
    )
  }

  return (
    <div>
      <WalletHero />

      <div className='w-full my-4 text-center'>
        <p className='text-lg text-green-200'>
          {mintCount.percent} combined ({mintCount.minted} / {mintCount.supply})
        </p>
        {errorMessage ? <p className='text-red-200'>{errorMessage}</p> : null}
      </div>

      <div>
        {sets.map(({ v0, v1, v2 }) => (
          <button
            key={v0.serialNumber}
            type='button'
            onClick={() => buildTx(v0, v1, v2)}
            disabled={!EVENT_OPEN || loadingTx || disable}
            className='group w-full my-4 p-2 flex items-center justify-evenly text-center rounded-xl border border-zinc-700 bg-zinc-900/50 transition-all backdrop-blur cursor-pointer disabled:cursor-not-allowed'
          >
            <div className='m-4 shadow-lg rounded-full opacity-50 group-hover:opacity-100 transition-all'>
              <ImageLoader
                src={v0.image.url}
                alt=''
                width={300}
                height={300}
                style={{ width: 300, height: 300, borderRadius: '100%', objectFit: 'contain' }}
              />
            </div>

            <div className='m-4 shadow-lg rounded-full opacity-50 group-hover:opacity-100 transition-all'>
              <ImageLoader
                src={v1.image.url}
                alt=''
                width={300}
                height={300}
                style={{ width: 300, height: 300, borderRadius: '100%', objectFit: 'contain' }}
              />
            </div>

            <div className='m-4 shadow-lg rounded-full opacity-50 group-hover:opacity-100 transition-all'>
              <ImageLoader
                src={v2.image.url}
                alt=''
                width={300}
                height={300}
                style={{ width: 300, height: 300, borderRadius: '100%', objectFit: 'contain' }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Bloodline
