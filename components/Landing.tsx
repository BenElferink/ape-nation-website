import Image from 'next/image'

import useScreenSize from '@/hooks/useScreenSize'
import Loader from './Loader'

const Landing = () => {
  const { isMobile, screenWidth } = useScreenSize()
  const logoSize = 250

  if (!screenWidth) {
    return (
      <div id='home' className='w-screen h-[90vh] mt-60 lg:mt-20 flex flex-col items-center'>
        <Loader />
      </div>
    )
  }

  if (isMobile) {
    return (
      <div id='home' className='w-screen h-[90vh] px-6 flex flex-col items-center'>
        <div className='my-32 animate__animated animate__infinite animate__slower animate__pulse'>
          <Image
            src='/media/logo/ape_nation.png'
            alt='logo'
            priority
            width={logoSize}
            height={logoSize}
            className='drop-shadow-[0_0_0.5rem_rgb(255_255_255)]'
          />
        </div>

        <div className='max-w-xl p-4 bg-zinc-950/70 rounded-xl shadow-[-1px_-1px_0.3rem_0_rgba(255,255,255,0.5)]'>
          <h2 className='mb-4 text-xl text-center'>
            Welcome to&nbsp;<span>Ape Nation</span>
          </h2>
          <p className='text-xs text-justify'>
            We are a leading OG Project in the CNFT Space. We have built a solid foundation that enables us to maximize utility for our community. At
            our core, we are committed to continuously building our ecosystem, and aim to empower collectors in new and exciting ways. It&apos;s all
            about The Nation - community-focused project resulting in a vibrant and engaged community that drives our success. Our passion for the
            space has led to strategic partnerships we work alongside to innovate.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div id='home' className='w-screen h-[90vh] flex flex-col items-center'>
      <div className='relative max-w-xl mt-64 lg:mt-28 lg:ml-[125px] p-6 lg:pl-28 bg-zinc-950/70 rounded-xl shadow-[-1px_-1px_0.3rem_0_rgba(255,255,255,0.5)]'>
        <div className='absolute -top-[130%] lg:top-1/2 left-1/2 lg:-left-40 -translate-x-1/2 lg:-translate-x-0 lg:-translate-y-1/2'>
          <div className='animate__animated animate__infinite animate__slower animate__pulse'>
            <Image
              src='/media/logo/ape_nation.png'
              alt='logo'
              priority
              width={logoSize}
              height={logoSize}
              className='drop-shadow-[0_0_0.5rem_rgb(255_255_255)]'
            />
          </div>
        </div>

        <h2 className='mb-4 px-10 lg:px-0 text-2xl flex items-center justify-between lg:justify-start'>
          Welcome to&nbsp;<span>Ape Nation</span>
        </h2>
        <p className='text-xs text-justify'>
          We are a leading OG Project in the CNFT Space. We have built a solid foundation that enables us to maximize utility for our community. At
          our core, we are committed to continuously building our ecosystem, and aim to empower collectors in new and exciting ways. It&apos;s all
          about The Nation - community-focused project resulting in a vibrant and engaged community that drives our success. Our passion for the space
          has led to strategic partnerships we work alongside to innovate.
        </p>
      </div>
    </div>
  )
}

export default Landing
