import Link from 'next/link'
import ImageLoader from '../../components/Loader/ImageLoader'
import { navTokens } from '../../components/Navigation'

const Page = () => {
  return (
    <div>
      <div className='max-w-[690px] mx-auto flex flex-wrap items-center justify-center'>
        {navTokens.map(({ label, path }) =>
          path ? (
            <Link key={`token_${label}`} scroll={false} href={path}>
              <div className='w-44 h-44 m-2 py-6 flex flex-col justify-between rounded-xl border border-zinc-950 bg-zinc-950/70 hover:bg-zinc-700/70'>
                <div className='flex items-center justify-center'>
                  <ImageLoader
                    src={`/media/${path.charAt(0) === '/' ? path.slice(1) : path}/token.png`}
                    alt='token'
                    width={label === 'CSWAP' ? 80 : 100}
                    height={label === 'CSWAP' ? 80 : 100}
                  />
                </div>
                <h3 className='text-center text-sm'>${label}</h3>
              </div>
            </Link>
          ) : null
        )}
      </div>
    </div>
  )
}

export default Page
