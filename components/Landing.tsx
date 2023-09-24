import Image from 'next/image'
import { Fragment, useEffect, useState } from 'react'
import useScreenSize from '@/hooks/useScreenSize'

const Landing = () => {
  const { screenWidth } = useScreenSize()
  const [logoSize, setLogoSize] = useState(1)

  useEffect(() => {
    setLogoSize((screenWidth / 100) * 30.5)
  }, [screenWidth])

  return (
    <Fragment>
      <div id='home' className='relative w-screen h-[75vh] md:h-[90vh]'>
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10'>
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
      </div>

      <div className='my-4 mx-auto max-w-2xl p-4 bg-zinc-950/70 rounded-xl border border-[var(--accent-2)] shadow-[0_0_3px_0_var(--accent-1)]'>
        <h1 className='text-xl mb-4'>About Us:</h1>
        <p className='text-xs'>
          Welcome to Ape Nation, a leading OG Project in the CNFT Space. We have built a solid foundation that enables us to maximize utility for our
          community. At our core, we are committed to continuously building our ecosystem, and aim to empower collectors in new and exciting ways.
          It&apos;s all about The Nation - community-focused project resulting in a vibrant and engaged community that drives our success. Our passion
          for the space has led to strategic partnerships we work alongside to innovate.
        </p>
      </div>
    </Fragment>
  )
}

export default Landing
