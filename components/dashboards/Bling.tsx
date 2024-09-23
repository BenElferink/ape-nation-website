import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { keepRelevant, Transaction } from '@meshsdk/core'
import useWallet from '@/contexts/WalletContext'
import txConfirmation from '@/functions/txConfirmation'
import WalletHero from '../Wallet/WalletHero'
import { BLING_APP_WALLET_ADDRESS, DEV_WALLET_ADDRESS, ONE_MILLION, TEAM_TREASURY_WALLET_ADDRESS } from '@/constants'

const EVENT_OPEN = true

const Bling = () => {
  const { connectedManually, wallet, disconnectWallet } = useWallet()

  const [loadingTx, setLoadingTx] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>(
    !EVENT_OPEN ? 'The portal is closed at the moment, please check in with our community for further announcements.' : ''
  )

  const buildTx = useCallback(
    async (count: 1 | 5) => {
      if (!wallet) return
      setLoadingTx(true)

      const fullPrice = 49
      const appFee = 2

      const inputLovelaces = String(count * fullPrice * ONE_MILLION)
      const appLovelaces = String(count * appFee * ONE_MILLION)
      const devLovelaces = String(count * ((fullPrice - appFee) / 2) * ONE_MILLION)

      try {
        const tx = new Transaction({ initiator: wallet })
          .setTxInputs(keepRelevant(new Map([['lovelace', inputLovelaces]]), await wallet.getUtxos()))
          .sendLovelace({ address: BLING_APP_WALLET_ADDRESS }, appLovelaces)
          .sendLovelace({ address: TEAM_TREASURY_WALLET_ADDRESS }, devLovelaces)
          .sendLovelace({ address: DEV_WALLET_ADDRESS }, devLovelaces)

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
        await axios.post('/api/bling', { txHash })
        toast.dismiss()
        toast.success('NFT minted!')
      } catch (error: any) {
        console.error(error)
        console.error(error?.message)

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
    [loadingTx, wallet]
  )

  const [remainingCount, setRemainingCount] = useState({ single: 0, sets: 0 })

  const getAndSetCounts = async () => {
    try {
      const { data } = await axios.get('/api/bling')

      setRemainingCount({
        single: data['NationNote']?.length,
        sets: Math.min(
          data['RubyChain']?.length || 0,
          data['TopazChain']?.length || 0,
          data['EmeraldChain']?.length || 0,
          data['SapphireChain']?.length || 0,
          data['AmethystChain']?.length || 0
        ),
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

      <div className='w-full my-4 text-center flex flex-col items-center'>
        <h2 className='text-7xl font-montserrat font-bold'>
          UNLEASH THE
          <br />
          POWER OF BLING
        </h2>

        <div className='w-full max-w-[555px] mt-4 flex items-center justify-evenly'>
          <button
            type='button'
            onClick={() => buildTx(1)}
            disabled={!EVENT_OPEN || !remainingCount.single || loadingTx}
            className='w-full m-1 p-4 rounded-xl disabled:bg-gray-900/50 bg-blue-900/50 hover:bg-blue-700/50 disabled:text-gray-400 hover:text-gray-200 disabled:border border hover:border disabled:border-gray-800 border-blue-700 hover:border-blue-700 disabled:cursor-not-allowed hover:cursor-pointer'
          >
            Mint 1 (random)
            <br />
            {remainingCount.single} remain
          </button>
          <button
            type='button'
            onClick={() => buildTx(5)}
            disabled={!EVENT_OPEN || remainingCount.single < 5 || loadingTx}
            className='w-full m-1 p-4 rounded-xl disabled:bg-gray-900/50 bg-blue-900/50 hover:bg-blue-700/50 disabled:text-gray-400 hover:text-gray-200 disabled:border border hover:border disabled:border-gray-800 border-blue-700 hover:border-blue-700 disabled:cursor-not-allowed hover:cursor-pointer'
          >
            Mint 5 {remainingCount.sets ? '(set)' : '(random)'}
            <br />
            {remainingCount.sets || Math.floor(remainingCount.single / 5)} remain
          </button>
        </div>

        {errorMessage ? <p className='text-red-200'>{errorMessage}</p> : null}

        <div className='w-[764px] h-[490px] mt-4 p-4 rounded-xl border border-zinc-600 bg-zinc-950/50 backdrop-blur'>
          <Image src='/media/bling.png' alt='' fill className='object-cover' />
        </div>
      </div>
    </div>
  )
}

export default Bling
