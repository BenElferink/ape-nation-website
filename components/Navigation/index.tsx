import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Bars3Icon } from '@heroicons/react/24/solid'
import MultipleLinks from './MultipleLinks'
import SingleLink from './SingleLink'
import {
  APE_NATION_POLICY_ID,
  MUTATION_NATION_POLICY_ID,
  MUTATION_NATION_MEGA_MUTANTS_POLICY_ID,
  ORDINAL_TOKENS_POLICY_ID,
  OG_CLUB_CARD_POLICY_ID,
  BLING_POLICY_ID,
  IHOLD_MUSIC_POLICY_ID,
  JUNGLE_JUICE_POLICY_ID,
} from '@/constants'

export const navCollections = [
  { label: 'Ape Nation', path: `/collections/${APE_NATION_POLICY_ID}` },
  { label: 'Jungle Juice', path: `/collections/${JUNGLE_JUICE_POLICY_ID}` },
  { label: 'Mutation Nation', path: `/collections/${MUTATION_NATION_POLICY_ID}` },
  { label: 'Mutation Nation - Mega Mutants', path: `/collections/${MUTATION_NATION_MEGA_MUTANTS_POLICY_ID}` },
  {
    label: '$NATION Coin',
    url: 'https://www.taptools.io/charts/token?pairID=0be55d262b29f564998ff81efe21bdc0022621c12f15af08d0f2ddb1.a7ecc694852dba715767f6be7e30c6ac1aab68baa9794815532e0da28b2fd80d',
  },
  { label: 'OG Club Card', path: `/collections/${OG_CLUB_CARD_POLICY_ID}` },
  { label: 'Ordinal Tokens', path: `/collections/${ORDINAL_TOKENS_POLICY_ID}` },
  { label: 'BLING', path: `/collections/${BLING_POLICY_ID}` },
  { label: 'iHold Music', path: `/collections/${IHOLD_MUSIC_POLICY_ID}` },
]

export const navTokens = [
  { label: 'AWOO', path: '/tokens/awoo' },
  { label: 'C4', path: '/tokens/c4' },
  { label: 'CSWAP', path: '/tokens/cswap' },
  { label: 'HEXO', path: '/tokens/hexo' },
  { label: 'IDP', path: '/tokens/idp' },
  { label: 'MD', path: '/tokens/md' },
  { label: 'NATION', path: '/tokens/nation' },
  { label: 'RON', path: '/tokens/ron' },
  { label: 'SOC', path: '/tokens/soc' },
]

export const limitedEvents = [{ label: 'Bloodline', path: '' }]

const Navigation = () => {
  const router = useRouter()
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [openDropdownName, setOpenDropdownName] = useState('')

  useEffect(() => {
    if (!openDropdownName) {
      setIsNavOpen(false)
    }
  }, [openDropdownName])

  return (
    <nav className='flex items-center'>
      <button
        type='button'
        onClick={() => setIsNavOpen((prev) => !prev)}
        className='xl:hidden flex items-center p-1 mx-1 rounded-lg text-sm hover:bg-gray-700 focus:outline-none focus:ring-gray-600 focus:ring-2'
      >
        <Bars3Icon className='w-7 h-7' />
      </button>

      <div className={(isNavOpen ? 'block' : 'hidden') + ' xl:block'}>
        <ul className='flex flex-col xl:flex-row absolute right-0 xl:static overflow-auto xl:overflow-visible max-h-[80vh] xl:max-h-auto w-80 xl:w-auto mt-8 xl:mt-0 p-4 bg-gray-900 border xl:border-0 rounded-lg border-gray-700 xl:space-x-8'>
          <li
            onClick={() => {
              if (router.pathname === '/') window.scrollTo({ top: 0, left: 0 })
              setIsNavOpen(false)
            }}
          >
            <SingleLink label='Home' path='/' />
          </li>
          <li onClick={() => setIsNavOpen(false)}>
            <SingleLink label='Merch' url='https://nftouchable.com/collections/ape-nation' />
          </li>
          <li>
            <MultipleLinks title='Collections' links={navCollections} dropdownState={{ value: openDropdownName, setValue: setOpenDropdownName }} />
          </li>
          <li>
            <MultipleLinks title='Staking' links={navTokens} dropdownState={{ value: openDropdownName, setValue: setOpenDropdownName }} />
          </li>
          <li onClick={() => setIsNavOpen(false)}>
            <SingleLink label='Raffles' url='https://labs.mutant-nft.com/projects/apenation?tab=staking' />
          </li>
          <li onClick={() => setIsNavOpen(false)}>
            <SingleLink label='Mutation Checker' url='https://mutationchecker.yepple.io/apenation' />
          </li>
          <li>
            <MultipleLinks title='Events' links={limitedEvents} dropdownState={{ value: openDropdownName, setValue: setOpenDropdownName }} />
          </li>
          <li
            onClick={() => {
              window.scroll({ top: 0, left: 0 })
              setIsNavOpen(false)
            }}
          >
            <SingleLink label='Wallet' />
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navigation
