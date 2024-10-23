import Link from 'next/link';
import Image from 'next/image';
import MusicPlayer from '../MusicPlayer';
import Navigation from '../Navigation';
import SocialIcon from '../SocialIcon';
import { LINKS } from '@/constants';

const Header = () => {
  return (
    <header className='sticky top-0 z-40'>
      <div className='w-screen h-28 lg:h-36 py-3 md:py-4 px-2 md:px-2 bg-black/30 flex items-center justify-end lg:justify-center relative'>
        <div className='absolute left-4 flex items-center'>
          <Link href='/' onClick={() => window.scroll({ top: 0, left: 0 })} className='h-20 w-20 relative'>
            <Image src='/media/logo/ape_nation.png' alt='logo' priority fill sizes='5rem' className='object-contain rounded-full' />
          </Link>
        </div>

        <Navigation />

        <div className='absolute right-16 lg:right-4 flex items-center'>
          <div className='mr-4'>
            <MusicPlayer />
          </div>

          <SocialIcon
            network='x'
            url={LINKS['X']}
            color='#ffffff'
            className='p-1 rounded-lg text-sm hover:bg-zinc-600 focus:outline-none focus:ring-zinc-500 focus:ring-2'
          />
          <SocialIcon
            network='discord'
            url={LINKS['DISCORD']}
            color='#ffffff'
            className='mx-0.5 p-1 rounded-lg text-sm hover:bg-zinc-600 focus:outline-none focus:ring-zinc-500 focus:ring-2'
          />
          <SocialIcon
            network='instagram'
            url={LINKS['INSTAGRAM']}
            color='#ffffff'
            className='p-1 rounded-lg text-sm hover:bg-zinc-600 focus:outline-none focus:ring-zinc-500 focus:ring-2'
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
