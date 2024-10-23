import { Fragment } from 'react';
import useWallet from '@/contexts/WalletContext';
import WalletConnect from '@/components/Wallet/WalletConnect';
import Wallet from '@/components/Wallet';

const Page = () => {
  const { connected } = useWallet();

  return (
    <div className='flex flex-col items-center'>
      {!connected ? (
        <Fragment>
          <WalletConnect allowManual introText='Connect to view your personal portfolio.' />
          <p className='pt-[15vh] text-center text-xl text-[var(--offline)]'>Not connected.</p>
        </Fragment>
      ) : (
        <Wallet />
      )}
    </div>
  );
};

export default Page;
