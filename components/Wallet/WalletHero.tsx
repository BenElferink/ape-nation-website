import useWallet from '@/contexts/WalletContext'
import { NATION_COIN_POLICY_ID } from '@/constants'

const WalletHero = () => {
  const { populatedWallet, connectedName, disconnectWallet } = useWallet()
  const nationToken = populatedWallet?.assets[NATION_COIN_POLICY_ID][0]

  return (
    <section className='w-full p-2 text-center rounded-xl border border-zinc-700 bg-zinc-900/50 backdrop-blur'>
      <h3 className='text-xl'>My Wallet ({connectedName})</h3>
      <p className='text-xs my-1 truncate text-zinc-200'>{populatedWallet?.stakeKey}</p>
      {nationToken ? (
        <p className='text-yellow-200'>
          {nationToken.tokenAmount.display.toLocaleString()} ${nationToken.tokenName?.ticker}
        </p>
      ) : null}

      <button
        type='button'
        onClick={disconnectWallet}
        className='p-1 px-2 mt-2 bg-red-900 hover:bg-red-700 bg-opacity-50 hover:bg-opacity-50 rounded-xl border border-red-900 hover:border-red-700 text-xs hover:text-zinc-200'
      >
        Disconnect
      </button>
    </section>
  )
}

export default WalletHero
