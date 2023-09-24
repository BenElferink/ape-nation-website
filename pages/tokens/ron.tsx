import Link from 'next/link'
import TokenHeader from '../../components/tokens/TokenHeader'
import TokenPrerequisites from '../../components/tokens/TokenPrerequisites'
import TokenWhoEarns, { WhoCanEarn } from '../../components/tokens/TokenWhoEarns'
import TokenStakeMethod from '../../components/tokens/TokenStakeMethod'
import PageContainer from '../../components/layout/PageContainer'

const TOKEN_IMAGE_SRC = '/media/tokens/ron/token.png'
const TOKEN_POLICY_ID = 'b201928d6bdb21c2e39205a92e226653d6002b949eaaacde3d986c2f'
const TOKEN_NAME = 'RON'
const PROJECT_NAME = 'Ron Coin'
const WHO_CAN_EARN: WhoCanEarn = ['Ape Nation']

const Page = () => {
  return (
    <PageContainer>
      <TokenHeader projectName={PROJECT_NAME} tokenName={TOKEN_NAME} tokenSrc={TOKEN_IMAGE_SRC} policyId={TOKEN_POLICY_ID} />
      <TokenWhoEarns whoCanEarn={WHO_CAN_EARN} />
      <TokenStakeMethod method='Non Custodial' />
      <TokenPrerequisites items={[]} />

      <div className='w-full my-2 p-4 px-6 flex flex-col bg-zinc-950/50 rounded-xl'>
        <h4 className='mb-2 text-lg text-center'>How to earn?</h4>

        <ol className='mx-auto list-decimal list-inside'>
          <li className='text-sm'>
            Connect your wallet to the{' '}
            <Link
              href='https://labs.mutant-nft.com/projects/apenation?tab=staking'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400'
            >
              ML Staking Dashboard
            </Link>
            .
          </li>
          <li className='text-sm'>Click &quot;activate&quot; and sign the TX.</li>
          <li className='text-sm'>That&apos;s it, you&apos;re accumulating.</li>
        </ol>
      </div>
    </PageContainer>
  )
}

export default Page
