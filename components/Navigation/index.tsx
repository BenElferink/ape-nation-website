import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { Bars3Icon } from '@heroicons/react/24/solid'
import MultipleLinks from './MultipleLinks'
import SingleLink from './SingleLink'
import { LINKS } from '@/constants'
import collectionsData from '@/data/collections.json'

const navCollections = [
  { label: '$NATION', url: LINKS['NATION_TAPTOOLS'], logoSrc: '/media/logo/other/taptools.webp' },
  { label: 'Ordinals', path: LINKS['MAGIC_EDEN_ORDINALS'], logoSrc: '/media/tokens/bitcoin.svg' },
].concat(
  collectionsData.map((x) => ({
    label: x.name,
    path: `/collections/${x.policyId}`,
    logoSrc: x.image,
  }))
)

export const navTokens = [
  { label: 'AWOO', path: '/tokens/awoo', logoSrc: '/media/tokens/awoo/token.png' },
  { label: 'C4', path: '/tokens/c4', logoSrc: '/media/tokens/c4/token.png' },
  { label: 'CHANGE', path: '/tokens/change', logoSrc: '/media/tokens/change/token.png' },
  { label: 'CSWAP', path: '/tokens/cswap', logoSrc: '/media/tokens/cswap/token.png' },
  { label: 'HEXO', path: '/tokens/hexo', logoSrc: '/media/tokens/hexo/token.png' },
  { label: 'IDP', path: '/tokens/idp', logoSrc: '/media/tokens/idp/token.png' },
  { label: 'MD', path: '/tokens/md', logoSrc: '/media/tokens/md/token.png' },
  { label: 'NATION', path: '/tokens/nation', logoSrc: '/media/tokens/nation/token.png' },
  { label: 'RON', path: '/tokens/ron', logoSrc: '/media/tokens/ron/token.png' },
  { label: 'SOC', path: '/tokens/soc', logoSrc: '/media/tokens/soc/token.png' },
]

const navEvents = [
  { label: 'BLING', url: 'https://mint.yepple.io/apenationchains' },
  { label: 'Bloodline', path: '/bloodline' },
  { label: 'Bank of Nation' },
]

const navOther = [
  { label: 'Merch', url: LINKS['MERCH'] },
  { label: 'Raffles', url: LINKS['MUTANTS_RAFFLES'] },
  { label: 'Tokenomics', url: LINKS['NATION_TOKENOMICS'] },
  { label: 'Mutation Checker', url: LINKS['MUTATION_CHECKER'] },
]

const Navigation = () => {
  const router = useRouter()
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [openDropdownName, setOpenDropdownName] = useState('')
  const pollsSdkRef = useRef(null)

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
        className='lg:hidden flex items-center p-1 mx-1 rounded-lg text-sm hover:bg-zinc-700/70 focus:outline-none focus:ring-zinc-600 focus:ring-2'
      >
        <Bars3Icon className='w-7 h-7' />
      </button>

      <div className={(isNavOpen ? 'block' : 'hidden') + ' lg:block'}>
        <ul className='lg:px-6 xl:px-12 flex flex-col lg:flex-row lg:items-center absolute right-0 lg:static overflow-auto lg:overflow-visible max-h-[80vh] lg:max-h-auto w-80 lg:w-auto mt-8 lg:mt-0 p-4 rounded-lg border lg:border-0 border-zinc-500 bg-gradient-to-r from-cyan-900/30 to-red-900/30 backdrop-blur lg:backdrop-blur-[unset] lg:space-x-8'>
          <li
            onClick={() => {
              if (router.pathname === '/') window.scrollTo({ top: 0, left: 0 })
              setIsNavOpen(false)
            }}
          >
            <SingleLink label='Home' path='/' />
          </li>
          <li>
            <MultipleLinks title='Collections' links={navCollections} dropdownState={{ value: openDropdownName, setValue: setOpenDropdownName }} />
          </li>
          <li>
            <MultipleLinks title='Staking' links={navTokens} dropdownState={{ value: openDropdownName, setValue: setOpenDropdownName }} />
          </li>
          <li>
            <MultipleLinks title='Events' links={navEvents} dropdownState={{ value: openDropdownName, setValue: setOpenDropdownName }} />
          </li>
          <li>
            <MultipleLinks title='Other' links={navOther} dropdownState={{ value: openDropdownName, setValue: setOpenDropdownName }} />
          </li>
          <li
            onClick={() => {
              window.scroll({ top: 0, left: 0 })
              setIsNavOpen(false)
            }}
          >
            <SingleLink logoSrc='/media/wallet.png' path='/wallet' />
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navigation
