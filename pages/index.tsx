import Link from 'next/link'
import Image from 'next/image'
import Landing from '@/components/Landing'
import Utilities from '@/components/Utilities'
import TeamCard from '@/components/cards/TeamCard'
import { LINKS } from '@/constants'

const partnerships = [
  {
    name: 'The Ape Society',
    url: 'https://theapesociety.io',
    logoUrl: '/media/logo/other/theapesociety.png',
  },
  {
    name: 'Cardano Crocs Club',
    url: 'https://cardanocrocsclub.com',
    logoUrl: '/media/logo/other/cardanocrocsclub.png',
  },
  {
    name: 'Yepple',
    url: 'https://yepple.io',
    logoUrl: '/media/logo/other/yepple.png',
  },
  {
    name: 'iHold',
    url: 'https://linktr.ee/ihold',
    logoUrl: '/media/logo/other/ihold.png',
  },
  {
    name: 'Mutant Labs',
    url: 'https://labs.mutant-nft.com',
    logoUrl: '/media/logo/other/mutantlabs.png',
  },
  {
    name: 'NFTouchable',
    url: LINKS['MERCH'],
    logoUrl: '/media/logo/other/nftouchable.png',
  },
  {
    name: 'CSWAP DEX',
    url: 'https://www.cswap.fi',
    logoUrl: '/media/tokens/cswap/token.png',
  },
  {
    name: 'Bad Fox MC',
    url: 'https://badfoxmc.com',
    logoUrl: '/media/logo/other/badfoxmc.png',
  },
  {
    name: 'Cardano Lands',
    url: 'https://cardanolands.com',
    logoUrl: '/media/logo/other/cardanolands.png',
  },
  {
    name: 'Ron Coin',
    url: 'https://www.roncoinada.com',
    logoUrl: '/media/tokens/ron/token.png',
  },
  {
    name: 'Unbothered Wolves',
    url: 'https://www.unbotheredwolves.com',
    logoUrl: '/media/logo/other/unbotheredwolves.png',
  },
  {
    name: 'Mad Dog Car Club',
    url: 'https://mdtoken.io',
    logoUrl: '/media/logo/other/maddogcarclub.png',
  },
  {
    name: 'IDO Pass DAO',
    url: 'https://idopass.finance',
    logoUrl: '/media/logo/other/idopassdao.png',
  },
]

const featuredBy = [
  {
    name: 'CNFT Tools',
    url: 'https://www.youtube.com/@cnfttools',
    logoUrl: '/media/logo/other/cnfttools.png',
  },
  {
    name: 'Block Is Hot',
    url: 'https://www.youtube.com/@blockishot971',
    logoUrl: '/media/logo/other/block.png',
  },
  {
    name: 'Atlanick',
    url: 'https://www.youtube.com/@Atlanick',
    logoUrl: '/media/logo/other/atlanick.png',
  },
  {
    name: 'Freedom 35ers',
    url: 'https://www.youtube.com/@Freedom35ers',
    logoUrl: '/media/logo/other/freedom35ers.png',
  },
  {
    name: 'Florida Man Investing',
    url: 'https://www.youtube.com/@floridamaninvesting',
    logoUrl: '/media/logo/other/floridamaninvesting.png',
  },
  {
    name: 'J Speak',
    url: 'https://www.youtube.com/@j_speak',
    logoUrl: '/media/logo/other/jspeak.png',
  },
  {
    name: 'CNFT DOODLES',
    url: 'https://www.youtube.com/@cnftdoodles4549',
    logoUrl: '/media/logo/other/cnftdoodles.png',
  },
  {
    name: 'Krypto Labs',
    url: 'https://www.youtube.com/@KryptoLabs',
    logoUrl: '/media/logo/other/kryptolabs.png',
  },
]

const teamMembers = [
  {
    name: 'TheWolf',
    title: 'Team Lead',
    description:
      'Professional with 25+ years of experience in Sales / Purchasing / Marketing, predominantly in the IT, Consumer Electronics, and Property Sectors. Team Player with unmatched work ethic.',
    profilePicture: '/media/team/wolf.jpg',
    socials: ['https://x.com/thewolfcnft', 'https://discord.com/users/1103362189928173598'],
  },
  {
    name: 'JRodsCrypto',
    title: 'Team Lead',
    description:
      'South Florida native dedicated to family & the pursuit of happiness. An Entrepreneur with 18+ years of experience covering a vast range. Living life by the Motto "Teamwork makes the dream work". Outside of the Box thinker with a cup half full Mentality.',
    profilePicture: '/media/team/jrod.jpg',
    socials: ['https://x.com/JRodsCrypto', 'https://discord.com/users/830118628993007666'],
  },
  {
    name: 'Zuma',
    title: 'Artist',
    description:
      "Designer with 20+ years of experience - Zuma's Attention to detail & dedication to deliver High Quality work is 2nd to none. He's always looking for New & Innovative ways to push the boundaries of what's possible in NFT Design.",
    profilePicture: '/media/team/zuma.jpg',
    socials: ['https://x.com/ZumaNFT', 'https://discord.com/users/137962807613325313'],
  },
  {
    name: 'KC8',
    title: 'Team',
    description:
      'Professional, father and husband. Working hard at his Fiat Job during the day to spend his evenings helping build the great Ape Nation.',
    profilePicture: '/media/team/kc8.jpg',
    socials: ['https://x.com/PointsMD', 'https://discord.com/users/1154207586300743760'],
  },
  {
    name: 'Scram',
    title: 'Team',
    description:
      'Tech Savvy Individual committed to the growth of Web3. Knowledgeable in Community Moderation, Discord Management & Community Growth.',
    profilePicture: '/media/team/scram.jpg',
    socials: ['https://x.com/ScramCNFT', 'https://discord.com/users/901866472408748133'],
  },
  {
    name: 'JimmyRubberBoots',
    title: 'Community Manager',
    description: 'Engineering Professional serving in the Fluid Power Industry for 23+ years. Husband / Father / CNFT Degen. Dedicated Team member committed to the growth and support of the Ape Nation Community.',
    profilePicture: '/media/team/jimmy.jpg',
    socials: ['https://x.com/Jimmy_Rbr_Boots', 'https://discord.com/users/934872168095965295'],
  },
  {
    name: 'DJ Lewis Da Hitmaker',
    title: 'X Space Host & Lead Mod',
    description:
      'New York City based Professional with 10+ years of experience in the Music Industry, Customer Service & Digital Marketing. Laser focussed on supporting the Community and dedicated to assisting others.',
    profilePicture: '/media/team/lewis.jpg',
    socials: ['https://x.com/djlewishitmaker', 'https://discord.com/users/578387244839075861'],
  },
  {
    name: 'Ben',
    title: 'Fullstack Developer',
    description: 'I started my career as Fullstack Developer in 2020 & have been involved in the crypto & NFT space since 2021.',
    profilePicture: '/media/team/ben.jpg',
    socials: ['https://x.com/BenElferink', 'https://discord.com/users/791763515554922507', 'https://github.com/BenElferink'],
  },
]

const Page = () => {
  return (
    <div className='px-4 flex flex-col items-center'>
      <Landing />
      <Utilities />

      <div className='my-20 flex flex-col items-center justify-center'>
        <h2 className='text-center text-3xl mb-4'>Partnerships</h2>
        <div className='flex flex-wrap items-center justify-center'>
          {partnerships.map(({ name, url, logoUrl }) => (
            <Link
              key={`PARTNER: ${name}`}
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className='group w-32 m-2 p-4 bg-zinc-200/20 hover:bg-zinc-200/30 rounded-xl shadow-[-1px_-1px_0.3rem_0_rgba(255,255,255,0.5)] flex flex-col items-center justify-center'
            >
              <div className='w-20 h-10 relative'>
                <Image src={logoUrl} alt='logo' fill sizes='5rem' className='object-contain' />
              </div>
              <span className='mt-2 group-hover:text-white text-xs whitespace-nowrap'>{name}</span>
            </Link>
          ))}
        </div>

        <div className='my-8' />

        <h2 className='text-center text-3xl mb-4'>Featured by Content Creators</h2>
        <div className='flex flex-wrap items-center justify-center'>
          {featuredBy.map(({ name, url, logoUrl }) => (
            <Link
              key={`FEATURED: ${name}`}
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className='group w-32 m-2 p-4 bg-zinc-200/20 hover:bg-zinc-200/30 rounded-xl shadow-[-1px_-1px_0.3rem_0_rgba(255,255,255,0.5)] flex flex-col items-center justify-center'
            >
              <div className='w-20 h-10 relative'>
                <Image src={logoUrl} alt='logo' fill sizes='5rem' className='object-contain' />
              </div>
              <span className='mt-2 group-hover:text-white text-xs whitespace-nowrap'>{name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className='flex flex-wrap justify-center max-w-7xl my-12'>
        {teamMembers.map(({ profilePicture, name, title, description, socials }) => (
          <TeamCard key={`TEAM: ${name}`} profilePicture={profilePicture} name={name} title={title} description={description} socials={socials} />
        ))}
      </div>
    </div>
  )
}

export default Page
