import useWallet from '@/contexts/WalletContext'
import { NATION_COIN_POLICY_ID } from '@/constants'

const WalletHero = () => {
  const { populatedWallet, disconnectWallet } = useWallet()
  const nationToken = populatedWallet?.assets[NATION_COIN_POLICY_ID][0]

  return (
    <section className='w-full text-center'>
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
