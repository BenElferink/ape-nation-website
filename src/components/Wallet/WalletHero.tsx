import { useEffect, useState } from 'react'
import useWallet from '@/src/contexts/WalletContext'
import { NATION_COIN_POLICY_ID } from '@/src/constants'
import WalletConnect from './WalletConnect'

const WalletHero = () => {
  const { connected, populatedWallet, disconnectWallet } = useWallet()
  const nationToken = populatedWallet?.assets[NATION_COIN_POLICY_ID][0]

  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    if (connected && openModal) setOpenModal(false)
  }, [connected, openModal])

  return (
    <section className='w-full text-center'>
      <p className='text-xs my-1 truncate text-zinc-200'>{connected ? populatedWallet?.stakeKey : 'Not Connected'}</p>
      {connected && nationToken ? (
        <p className='text-yellow-200'>
          {nationToken.tokenAmount.display.toLocaleString()} ${nationToken.tokenName?.ticker}
        </p>
      ) : null}

      {connected ? (
        <button
          type='button'
          onClick={disconnectWallet}
          className='p-1 px-2 mt-2 bg-red-900 hover:bg-red-700 bg-opacity-50 hover:bg-opacity-50 rounded-xl border border-red-900 hover:border-red-700 text-xs hover:text-zinc-200'
        >
          Disconnect
        </button>
      ) : (
        <button
          type='button'
          onClick={() => setOpenModal(true)}
          className='p-1 px-2 mt-2 bg-green-900 hover:bg-green-700 bg-opacity-50 hover:bg-opacity-50 rounded-xl border border-green-900 hover:border-green-700 text-xs hover:text-zinc-200'
        >
          Connect
        </button>
      )}

      {openModal ? <WalletConnect onClickClose={() => setOpenModal(false)} /> : null}
    </section>
  )
}

export default WalletHero
