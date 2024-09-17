import { Fragment } from 'react'
import useWallet from '../contexts/WalletContext'
import WalletConnect from '../components/Wallet/WalletConnect'
import Bling from '@/components/dashboards/Bling'

const Page = () => {
  const { connected } = useWallet()

  return (
    <div className='flex flex-col items-center'>
      {!connected ? (
        <Fragment>
          <WalletConnect introText='Connect to mint your NFTs.' />
          <p className='pt-[15vh] text-center text-xl text-[var(--pink)]'>Not connected.</p>
        </Fragment>
      ) : (
        <Bling />
      )}
    </div>
  )
}

export default Page
