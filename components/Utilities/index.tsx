import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { MinusCircleIcon } from '@heroicons/react/24/outline'
import useScreenSize from '@/hooks/useScreenSize'
import styles from './Utilities.module.css'

const data = [
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
  },
  {
    checked: true,
    chapter: 'Ordinals #BTC',
    events: [
      {
        checked: false,
        title: '100 Supply / Sub 1 Million Inscriptions',
      },
      {
        checked: false,
        title: '$NATION Staking Rewards',
      },
    ],
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
  },
]

const Utilities = () => {
  const { isMobile } = useScreenSize()

  return (
    <div className='w-full my-12'>
      <h1 className='mb-8 text-3xl text-center'>Collections & Utilities</h1>

      {data.map((phase, idx) => {
        const isLeft = idx % 2 !== 0

        return (
          <div
            key={phase.chapter}
            className={`relative ${styles.chapter} ${!isMobile ? (isLeft ? styles.leftChapter : styles.rightChapter) : styles.mobileChapter}`}
          >
            <h2 className='text-xl'>
              {phase.checked ? <CheckCircleIcon className='w-6 h-6' /> : <MinusCircleIcon className='w-6 h-6' />}
              {phase.chapter}
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

            {isMobile ? <br /> : null}
          </div>
        )
      })}
    </div>
  )
}

export default Utilities
