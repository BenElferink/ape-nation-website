import Head from 'next/head'
import { AppProps } from 'next/app'
import { Fragment } from 'react'
import { Toaster } from 'react-hot-toast'
import { WalletProvider } from '@/contexts/WalletContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import 'animate.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import '@/styles/swiper-overrides.css'
import '@/styles/globals.css'
import { RenderProvider } from '@/contexts/RenderContext'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Fragment>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta name='author' content='Ben Elferink' />

        <meta
          name='description'
          content="We have built a solid foundation that enables us to maximize utility for our community. At our core, we are committed to continuously building our ecosystem, and aim to empower collectors in new and exciting ways. It's all about The Nation - community-focused project resulting in a vibrant and engaged community that drives our success. Our passion for the space has led to strategic partnerships we work alongside to innovate."
        />

        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='manifest' href='/manifest.json' />

        <title>Ape Nation</title>
      </Head>

      <Toaster />
      <Header />
      <main className='w-screen min-h-screen bg-black/30'>
        <WalletProvider>
          <RenderProvider>
            <Component {...pageProps} />
          </RenderProvider>
        </WalletProvider>
      </main>
      <Footer />
    </Fragment>
  )
}

export default App
