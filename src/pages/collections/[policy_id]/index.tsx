import { useRouter } from 'next/router'
import { Fragment } from 'react'
import RecentMarketActivity from '@/src/components/RecentMarketActivity'
import CollectionAssets from '@/src/components/dashboards/CollectionAssets'
import isPolicyIdAllowed from '@/src/functions/isPolicyIdAllowed'
import type { PolicyId } from '@/src/@types'

const Page = () => {
  const router = useRouter()
  const policyId = router.query.policy_id as PolicyId
  const policyOk = isPolicyIdAllowed(policyId)

  return (
    <div className='flex flex-col items-center'>
      {!policyOk ? (
        <p className='pt-[15vh] text-center text-xl text-[var(--offline)]'>Policy ID is not permitted.</p>
      ) : (
        <Fragment>
          <RecentMarketActivity policyId={policyId} />
          <CollectionAssets policyId={policyId} withListed />
        </Fragment>
      )}
    </div>
  )
}

export default Page
