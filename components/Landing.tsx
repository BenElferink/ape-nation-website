import Image from 'next/image'
import { Fragment, useEffect, useState } from 'react'
import useScreenSize from '@/hooks/useScreenSize'

const About = () => {
  return (
    <div className='my-4 mx-2 md:mx-10 max-w-2xl lg:max-w-lg'>
      <h1 className='text-xl mb-4'>About Us:</h1>
      <p className='text-xs'>
        Welcome to Ape Nation, a leading OG Project in the CNFT Space. We have built a solid foundation that enables us to maximize utility for our
        community. At our core, we are committed to continuously building our ecosystem, and aim to empower collectors in new and exciting ways.
        It&apos;s all about The Nation - community-focused project resulting in a vibrant and engaged community that drives our success. Our passion
        for the space has led to strategic partnerships we work alongside to innovate.
      </p>
    </div>
  )
}

const Landing = () => {
  const { screenWidth } = useScreenSize()
  const [logoSize, setLogoSize] = useState(1)

  useEffect(() => {
    setLogoSize((screenWidth / 100) * 30.5)
  }, [screenWidth])

  return (
    <Fragment>
      <div id='home' className='relative w-screen h-[75vh] md:h-[90vh]'>
        <div className='relative z-10'>
          <div className='hidden lg:block animate__animated animate__fadeInRight'>
            <About />
          </div>
        </div>

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

      <div className='lg:hidden animate__animated animate__fadeInRight'>
        <About />
      </div>
    </Fragment>
  )
}

export default Landing
