import { CheckCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid'
import { MinusCircleIcon } from '@heroicons/react/24/outline'
import useScreenSize from '@/hooks/useScreenSize'
import MediaWrapper from './MediaWrapper'
import ImageLoader from '../Loader/ImageLoader'
import styles from './Utilities.module.css'
import collections from '@/data/collections.json'
import {
  APE_NATION_POLICY_ID,
  BLING_POLICY_ID,
  JUNGLE_JUICE_POLICY_ID,
  MUTATION_NATION_MEGA_MUTANTS_POLICY_ID,
  MUTATION_NATION_POLICY_ID,
  OG_CLUB_CARD_POLICY_ID,
  ORDINAL_TOKENS_POLICY_ID,
} from '@/constants'

const data: {
  checked: boolean
  chapter: string
  Icon?: () => JSX.Element
  events: {
    checked: boolean
    title: string
  }[]
  renderMedia?: (isLeft: any) => JSX.Element
}[] = [
  {
    checked: true,
    chapter: 'Ape Nation',
    events: [
      {
        checked: false,
        title: '9999 Supply',
      },
      {
        checked: false,
        title: 'Canopy Club Monthly Royalty Raffle',
      },
      {
        checked: false,
        title: '$NATION + 8 Partner Staking Rewards',
      },
    ],
    renderMedia: (isLeft) => (
      <MediaWrapper isLeft={isLeft} size={128} posTop='50px'>
        <ImageLoader
          src={collections.find(({ policyId }) => policyId === APE_NATION_POLICY_ID)?.image || ''}
          alt=''
          width={128}
          height={128}
          loaderSize={50}
          style={{ width: 128, height: 128, borderRadius: '100%', backgroundColor: 'black', boxShadow: '0 0 3px 0 black', objectFit: 'contain' }}
        />
      </MediaWrapper>
    ),
  },
  {
    checked: true,
    chapter: 'Jungle Juice',
    events: [
      {
        checked: false,
        title: '9999 Supply (Free Airdrop)',
      },
      {
        checked: false,
        title: '1 Partner Staking Reward',
      },
    ],
    renderMedia: (isLeft) => (
      <MediaWrapper isLeft={isLeft} size={128} posTop='20px'>
        <ImageLoader
          src={collections.find(({ policyId }) => policyId === JUNGLE_JUICE_POLICY_ID)?.image || ''}
          alt=''
          width={128}
          height={128}
          loaderSize={50}
          style={{ width: 128, height: 128, borderRadius: '100%', backgroundColor: 'black', boxShadow: '0 0 3px 0 black', objectFit: 'contain' }}
        />
      </MediaWrapper>
    ),
  },
  {
    checked: true,
    chapter: 'Mutation Nation',
    events: [
      {
        checked: false,
        title: '5500 Supply',
      },
      {
        checked: false,
        title: '$NATION + 3 Partner Staking Rewards',
      },
      {
        checked: false,
        title: '*Quarterly Royalty Raffle',
      },
    ],
    renderMedia: (isLeft) => (
      <MediaWrapper isLeft={isLeft} size={128} posTop='50px'>
        <ImageLoader
          src={collections.find(({ policyId }) => policyId === MUTATION_NATION_POLICY_ID)?.image || ''}
          alt=''
          width={128}
          height={128}
          loaderSize={50}
          style={{ width: 128, height: 128, borderRadius: '100%', backgroundColor: 'black', boxShadow: '0 0 3px 0 black', objectFit: 'contain' }}
        />
      </MediaWrapper>
    ),
  },
  {
    checked: true,
    chapter: 'Mutation Nation Mega Mutants',
    events: [
      {
        checked: false,
        title: '38 1:1 Supply (V3 Vials Free Airdrop)',
      },
      {
        checked: false,
        title: '$NATION Staking Rewards',
      },
      {
        checked: false,
        title: 'Airdrops / Claims',
      },
    ],
    renderMedia: (isLeft) => (
      <MediaWrapper isLeft={isLeft} size={128} posTop='50px'>
        <ImageLoader
          src={collections.find(({ policyId }) => policyId === MUTATION_NATION_MEGA_MUTANTS_POLICY_ID)?.image || ''}
          alt=''
          width={128}
          height={128}
          loaderSize={50}
          style={{ width: 128, height: 128, borderRadius: '100%', backgroundColor: 'black', boxShadow: '0 0 3px 0 black', objectFit: 'contain' }}
        />
      </MediaWrapper>
    ),
  },
  {
    checked: true,
    chapter: 'Ordinals',
    Icon: () => <img src='/media/tokens/bitcoin.svg' className='w-8 h-8 ml-2' />,
    events: [
      {
        checked: false,
        title: '100 Supply / Sub 1 Million Inscriptions',
      },
      {
        checked: false,
        title: '$NATION Staking Rewards',
      },
      {
        checked: false,
        title: '20 BTC Mint',
      },
    ],
    renderMedia: (isLeft) => (
      <MediaWrapper isLeft={isLeft} size={128} posTop='50px'>
        <ImageLoader
          src={collections.find(({ policyId }) => policyId === ORDINAL_TOKENS_POLICY_ID)?.image || ''}
          alt=''
          width={128}
          height={128}
          loaderSize={50}
          style={{ width: 128, height: 128, borderRadius: '100%', backgroundColor: 'black', boxShadow: '0 0 3px 0 black', objectFit: 'contain' }}
        />
      </MediaWrapper>
    ),
  },
  {
    checked: true,
    chapter: 'OG Club Cards',
    events: [
      {
        checked: false,
        title: '200 Supply (Free Airdrop)',
      },
      {
        checked: false,
        title: '$NATION Staking Rewards (Not Subject Halvings)',
      },
      {
        checked: false,
        title: 'Quarterly 100% Royalty Raffle',
      },
      {
        checked: false,
        title: 'Airdrops / Claims & WL',
      },
      {
        checked: false,
        title: 'Future Utility',
      },
    ],
    renderMedia: (isLeft) => (
      <MediaWrapper isLeft={isLeft} size={128} posTop='120px'>
        <ImageLoader
          src={collections.find(({ policyId }) => policyId === OG_CLUB_CARD_POLICY_ID)?.image || ''}
          alt=''
          width={128}
          height={128}
          loaderSize={50}
          style={{ width: 128, height: 128, borderRadius: '100%', backgroundColor: 'black', boxShadow: '0 0 3px 0 black', objectFit: 'contain' }}
        />
      </MediaWrapper>
    ),
  },
  {
    checked: true,
    chapter: 'BLING',
    events: [
      {
        checked: false,
        title: 'TBD Supply (Phase 1 Free Airdrop, Phase 4 Free Claim)',
      },
      {
        checked: false,
        title: '$NATION Staking Rewards',
      },
      {
        checked: false,
        title: 'Future Staking Reward Multipliers',
      },
      {
        checked: false,
        title: 'Future Utility with Ultimate OG 2024',
      },
    ],
    renderMedia: (isLeft) => (
      <MediaWrapper isLeft={isLeft} size={128} posTop='100px'>
        <ImageLoader
          src={collections.find(({ policyId }) => policyId === BLING_POLICY_ID)?.image || ''}
          alt=''
          width={128}
          height={128}
          loaderSize={50}
          style={{ width: 128, height: 128, borderRadius: '100%', backgroundColor: 'black', boxShadow: '0 0 3px 0 black', objectFit: 'contain' }}
        />
      </MediaWrapper>
    ),
  },
  {
    checked: false,
    chapter: 'Bloodline',
    events: [
      {
        checked: false,
        title: 'Phase 1 Coming Soon',
      },
      {
        checked: false,
        title: 'Portal & Policy to Trade Sets of 3',
      },
      {
        checked: false,
        title: '$NATION Staking Rewards',
      },
      {
        checked: false,
        title: '*Quarterly Royalty Raffle',
      },
    ],
    renderMedia: (isLeft) => (
      <MediaWrapper isLeft={isLeft} size={128} posTop='100px'>
        <QuestionMarkCircleIcon style={{ width: 128, height: 128, borderRadius: '100%', backgroundColor: 'black', boxShadow: '0 0 3px 0 black' }} />
      </MediaWrapper>
    ),
  },
  {
    checked: false,
    chapter: 'Bank of Nation',
    events: [
      {
        checked: false,
        title: 'Phase 1 Coming Soon',
      },
      {
        checked: false,
        title: 'Additional $NATION Liquidity',
      },
    ],
    renderMedia: (isLeft) => (
      <MediaWrapper isLeft={isLeft} size={128} posTop='20px'>
        <QuestionMarkCircleIcon style={{ width: 128, height: 128, borderRadius: '100%', backgroundColor: 'black', boxShadow: '0 0 3px 0 black' }} />
      </MediaWrapper>
    ),
  },
  {
    checked: false,
    chapter: 'Ultimate OG',
    events: [
      {
        checked: false,
        title: 'Phase 1 Coming 2024',
      },
      {
        checked: false,
        title: 'Unlock BLING Trait Packs',
      },
      {
        checked: false,
        title: 'Upgrade & Customize your Ape Nation',
      },
    ],
    renderMedia: (isLeft) => (
      <MediaWrapper isLeft={isLeft} size={128} posTop='50px'>
        <QuestionMarkCircleIcon style={{ width: 128, height: 128, borderRadius: '100%', backgroundColor: 'black', boxShadow: '0 0 3px 0 black' }} />
      </MediaWrapper>
    ),
  },
]

const Utilities = () => {
  const { isMobile } = useScreenSize()

  return (
    <div className='w-full my-12'>
      <h2 className='mb-8 text-3xl text-center'>Collections & Utilities</h2>

      {data.map((phase, idx) => {
        const isLeft = idx % 2 !== 0

        return (
          <div
            key={phase.chapter}
            className={`relative ${styles.chapter} ${!isMobile ? (isLeft ? styles.leftChapter : styles.rightChapter) : styles.mobileChapter}`}
          >
            <h2 className='text-xl flex items-center'>
              {phase.checked ? <CheckCircleIcon className='w-6 h-6' /> : <MinusCircleIcon className='w-6 h-6' />}
              {phase.chapter}
              {phase.Icon ? <phase.Icon /> : null}
            </h2>

            {phase.events.map((event) => (
              <div
                key={event.title}
                className={`rounded-xl bg-zinc-950/70 ${styles.event} ${
                  !isMobile ? (isLeft ? styles.leftEvent : styles.rightEvent) : styles.mobileEvent
                }`}
              >
                <h3 className='text-sm'>
                  {event.checked ? <CheckCircleIcon className='w-6 h-6' /> : <MinusCircleIcon className='w-6 h-6' />}
                  {event.title}
                </h3>
              </div>
            ))}

            {phase.renderMedia ? phase.renderMedia(isLeft) : null}
            {isMobile ? <br /> : null}
          </div>
        )
      })}
    </div>
  )
}

export default Utilities
