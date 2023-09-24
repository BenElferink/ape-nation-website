import { Fragment } from 'react'

type Method = 'Non Custodial' | 'Custodial' | 'Vaulted' | 'Drip / Claim'

const TokenStakeMethod = (props: { method: Method }) => {
  const { method } = props

  return (
    <div className='w-full my-2 p-4 px-6 flex flex-col bg-zinc-950/50 rounded-xl'>
      <h4 className='mb-2 text-lg text-center'>Staking Method</h4>

      <div className='flex items-center justify-center'>
        <p className='text-center'>
          {method}
          {method === 'Vaulted' ? (
            <Fragment>
              <br />
              <span className='text-xs'>Known as a &apos;script&apos; wallet, it may conflict with other earning methods.</span>
            </Fragment>
          ) : null}
        </p>
      </div>
    </div>
  )
}

export default TokenStakeMethod
