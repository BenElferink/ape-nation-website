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
import { APE_NATION_POLICY_ID, BLOODLINE_POLICY_ID, MUTATION_NATION_POLICY_ID, ONE_MILLION, TEMP_WALLET } from '@/constants'

const BURN_OPEN = false

const Bloodline = () => {
  const { connectedManually, wallet, populatedWallet, disconnectWallet, removeAssetsFromWallet } = useWallet()

  const [sets, setSets] = useState<{ v0: PopulatedAsset; v1: PopulatedAsset; v2: PopulatedAsset }[]>([])
  const [loadingTx, setLoadingTx] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>(
    !BURN_OPEN ? 'The portal is closed at the moment, please check in with our community for further announcements.' : ''
  )

  useEffect(() => {
    if (populatedWallet?.stakeKey) {
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
        const tx = new Transaction({ initiator: wallet }).sendAssets({ address: TEMP_WALLET }, [
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
        // .sendLovelace(
        //   { address: '' },
        //   String(1 * ONE_MILLION)
        // )

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

        await removeAssetsFromWallet([v0.tokenId, v1.tokenId, v2.tokenId])
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

      const supply = 3000
      const count = res.tokens.length

      setMintCount({
        supply,
        minted: count,
        percent: `${((100 / supply) * count).toFixed(1)}%`,
      })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    // getAndSetCounts()
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
          {mintCount.percent} burned ({mintCount.minted}/{mintCount.supply})
        </p>
        {errorMessage ? <p className='text-red-200'>{errorMessage}</p> : null}
      </div>

      <div>
        {sets.map(({ v0, v1, v2 }) => (
          <button
            key={v0.serialNumber}
            type='button'
            onClick={() => buildTx(v0, v1, v2)}
            disabled={!BURN_OPEN || loadingTx}
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
