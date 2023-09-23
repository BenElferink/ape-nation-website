import Link from 'next/link'
import Image from 'next/image'
import MusicPlayer from '../MusicPlayer'
import Navigation from '../Navigation'
import SocialIcon from '../SocialIcon'

const Header = () => {
  return (
    <header className='w-screen py-3 md:py-4 px-2 md:px-2 bg-black bg-opacity-50 flex items-center justify-between sticky top-0 z-40'>
      <div className='flex items-center'>
        <Link href='/' onClick={() => window.scroll({ top: 0, left: 0 })} className='h-16 w-16 mx-2 relative'>
          <Image src='/media/logo/ape_nation.png' alt='logo' priority fill sizes='5rem' className='object-contain rounded-full' />
        </Link>
        <h1 className='hidden xl:inline text-gray-200 text-lg'>Ape Nation</h1>
      </div>

      <div className='flex items-center'>
        <MusicPlayer />

        <div className='mx-4 flex items-center'>
          <SocialIcon
            network='x'
            url='https://x.com/Ape_NationNFT'
            color='#ffffff'
            className='p-1 rounded-lg text-sm hover:bg-zinc-600 focus:outline-none focus:ring-zinc-500 focus:ring-2'
          />
          <SocialIcon
            network='discord'
            url='https://discord.gg/mUQKg2NQtP'
            color='#ffffff'
            className='mx-0.5 p-1 rounded-lg text-sm hover:bg-zinc-600 focus:outline-none focus:ring-zinc-500 focus:ring-2'
          />
          <SocialIcon
            network='instagram'
            url='https://www.instagram.com/apenationcnft'
            color='#ffffff'
            className='p-1 rounded-lg text-sm hover:bg-zinc-600 focus:outline-none focus:ring-zinc-500 focus:ring-2'
          />
        </div>

        <Navigation />
      </div>
    </header>
  )
}

export default Header
