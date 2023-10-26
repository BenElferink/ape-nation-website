import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
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
  LINKS,
  BLOODLINE_POLICY_ID,
} from '@/constants'
import Script from 'next/script'

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
      <Script
        src='https://labs.badfoxmc.com/sdk.min.js'
        onReady={() => {
          // @ts-ignore
          const pollsSdk = new BadLabsSDK({ product: 'polls', creatorStakeKey: 'stake1u9z9h0sy9s5mddue9634vkgmnnnpdrruwmppwnx7ups29uqv68tvp' })
          pollsSdkRef.current = pollsSdk
        }}
      />

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
            <MultipleLinks
              title='Collections'
              links={[
                { label: '$NATION', iconSrc: '/media/logo/other/taptools.webp', url: LINKS['NATION_TAPTOOLS'] },
                { label: 'Ape Nation', path: `/collections/${APE_NATION_POLICY_ID}` },
                { label: 'Mutation Nation', path: `/collections/${MUTATION_NATION_POLICY_ID}` },
                { label: 'Mutation Nation - Mega Mutants', path: `/collections/${MUTATION_NATION_MEGA_MUTANTS_POLICY_ID}` },
                { label: 'Bloodline', path: `/collections/${BLOODLINE_POLICY_ID}` },
                { label: 'OG Club Card', path: `/collections/${OG_CLUB_CARD_POLICY_ID}` },
                { label: 'Ordinal Tokens', path: `/collections/${ORDINAL_TOKENS_POLICY_ID}` },
                { label: 'Ordinals', iconSrc: '/media/tokens/bitcoin.svg', path: LINKS['MAGIC_EDEN_ORDINALS'] },
                { label: 'BLING', path: `/collections/${BLING_POLICY_ID}` },
                { label: 'iHold Music', path: `/collections/${IHOLD_MUSIC_POLICY_ID}` },
                { label: 'Jungle Juice', path: `/collections/${JUNGLE_JUICE_POLICY_ID}` },
              ]}
              dropdownState={{ value: openDropdownName, setValue: setOpenDropdownName }}
            />
          </li>
          <li>
            <MultipleLinks title='Staking' links={navTokens} dropdownState={{ value: openDropdownName, setValue: setOpenDropdownName }} />
          </li>
          <li>
            <MultipleLinks
              title='Events'
              links={[
                { label: 'BLING', url: 'https://mint.yepple.io/apenationchains' },
                { label: 'Bloodline', path: '/bloodline' },
                { label: 'Bank of Nation' },
              ]}
              dropdownState={{ value: openDropdownName, setValue: setOpenDropdownName }}
            />
          </li>
          <li className='relative'>
            <SingleLink
              label='Governance'
              onClick={() => {
                const injectEl = document.getElementById('polls-inject-wallets')

                if (injectEl?.children.length) {
                  injectEl.innerText = ''
                } else if (pollsSdkRef.current) {
                  // @ts-ignore
                  pollsSdkRef.current.loadWallets({
                    injectId: 'polls-inject-wallets',
                    buttonBackgroundColor: 'rgb(63,63,70)',
                    buttonTextColor: 'rgb(228,228,231)',
                  })
                }
              }}
            />

            <div id='polls-inject-wallets' className='sm:absolute sm:top-12 sm:-right-1/2 flex flex-col'>
              {/* Wallets will be injected here */}
            </div>
          </li>
          <li>
            <MultipleLinks
              title='Other'
              links={[
                { label: 'Merch', url: LINKS['MERCH'] },
                { label: 'Raffles', url: LINKS['MUTANTS_RAFFLES'] },
                { label: 'Tokenomics', url: LINKS['NATION_TOKENOMICS'] },
                { label: 'Mutation Checker', url: LINKS['MUTATION_CHECKER'] },
              ]}
              dropdownState={{ value: openDropdownName, setValue: setOpenDropdownName }}
            />
          </li>
          <li
            onClick={() => {
              window.scroll({ top: 0, left: 0 })
              setIsNavOpen(false)
            }}
          >
            <SingleLink iconSrc='/media/wallet.png' path='/wallet' />
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navigation
