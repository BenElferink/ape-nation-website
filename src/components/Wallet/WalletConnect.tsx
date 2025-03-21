import Image from 'next/image'
// import { useRouter } from 'next/router'
import { FormEventHandler, Fragment, useState } from 'react'
import useWallet from '@/contexts/WalletContext'
import Modal from '../layout/Modal'
import GlobalLoader from '../Loader/GlobalLoader'

const WalletConnect = (props: { allowManual?: boolean; introText?: string; onClickClose?: () => void }) => {
  const { allowManual = false, introText = '', onClickClose } = props

  const { availableWallets, connectWallet, connectWalletManually, connecting, connected, connectedName, populatedWallet } = useWallet()
  // const router = useRouter()

  const [openModal, setOpenModal] = useState(true)
  const [input, setInput] = useState('')

  const onClose = () => {
    if (onClickClose) onClickClose()
    else setOpenModal(false)

    // if (!connected) router.push('/')
  }

  const submitManualWallet: FormEventHandler<HTMLFormElement> = async (e) => {
    e?.preventDefault()

    connectWalletManually(input)
    setInput('')
  }

  return (
    <Fragment>
      <GlobalLoader loading={connecting} />

      <Modal
        title={connected ? 'Wallet Connected' : 'Connect a Wallet'}
        open={!!openModal && !connecting}
        onClose={onClose}
        scrollToTop
        className='px-8 md:px-10 text-center'
      >
        {connected ? (
          <p>
            You&apos;ve succesfully connected with {connectedName}:<br />
            <span className='text-sm text-green-400'>{populatedWallet?.stakeKey}</span>
          </p>
        ) : (
          <Fragment>
            {introText ? <p>{introText}</p> : null}

            {availableWallets.length == 0 ? (
              <p className='my-2 text-red-400'>No wallets installed</p>
            ) : (
              <div className='flex flex-col min-w-[280px] w-[85%] md:w-[75%] '>
                {availableWallets.map((wallet, idx) => {
                  let trimmedName = wallet.name.toLowerCase().replace('wallet', '')
                  trimmedName = `${trimmedName.charAt(0).toUpperCase()}${trimmedName.slice(1)}`

                  return (
                    <button
                      key={`connect-wallet-${wallet.id}`}
                      onClick={() => connectWallet(wallet.id)}
                      disabled={connecting || connected}
                      className='w-full mt-1 mx-auto p-4 flex items-center justify-start bg-gray-700 border border-gray-600 hover:text-white hover:bg-gray-600 hover:border hover:border-gray-500'
                      style={{
                        borderRadius:
                          idx === 0 && idx === availableWallets.length - 1
                            ? '1rem'
                            : idx === 0
                            ? '1rem 1rem 0 0'
                            : idx === availableWallets.length - 1
                            ? '0 0 1rem 1rem'
                            : '0',
                      }}
                    >
                      <Image unoptimized src={wallet.icon} alt={wallet.name} width={35} height={35} className='mr-4' />
                      {trimmedName}&nbsp;<span className='text-xs'>({wallet.version})</span>
                    </button>
                  )
                })}

                <p className='w-full my-2 px-1 text-xs text-start'>
                  <u>Disclaimer</u>: Connecting your wallet does not require a password. It&apos;s a read-only process.
                </p>
              </div>
            )}

            {allowManual ? (
              <Fragment>
                <h4 className='mt-4'>- OR -</h4>
                <p className='text-sm'>Alternatively you can connect manually by pasting your ADA Handle / Wallet Address / Stake Key:</p>

                <form onSubmit={submitManualWallet} className='w-3/4 md:w-2/3 m-4 relative'>
                  <input
                    placeholder='$handle / addr1... / stake1...'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className='w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 outline-none'
                  />
                  <button
                    type='submit'
                    disabled={connecting}
                    className={
                      (input ? 'block' : 'hidden') + ' absolute top-1/2 right-1 -translate-y-1/2 p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-sm'
                    }
                  >
                    CONNECT
                  </button>
                </form>
              </Fragment>
            ) : null}
          </Fragment>
        )}
      </Modal>
    </Fragment>
  )
}

export default WalletConnect
