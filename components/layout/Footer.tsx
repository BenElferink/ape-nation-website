import Image from 'next/image'
import Link from 'next/link'

const data = [
  {
    name: 'Cardano',
    url: 'https://cardano.org',
    logoUrl: '/media/logo/other/cardano.png',
  },
  {
    name: 'Mesh',
    url: 'https://meshjs.dev',
    logoUrl: '/media/logo/other/mesh.png',
  },
]

const Footer = () => {
  return (
    <footer className='py-8 bg-black/70 flex flex-col items-center justify-center'>
      <h5 className='text-md'>powered by</h5>

      <div className='flex items-center'>
        {data.map((obj) => (
          <Link
            key={`powered-by-${obj.name}`}
            href={obj.url}
            target='_blank'
            rel='noopener noreferrer'
            className='w-16 h-20 m-2 flex flex-col items-center justify-between'
          >
            <h6 className='mb-1 text-sm'>{obj.name}</h6>
            <Image src={obj.logoUrl} alt={obj.name} width={64} height={64} className='drop-shadow-[0_-1px_1px_rgb(255_255_255)]' />
          </Link>
        ))}
      </div>
    </footer>
  )
}

export default Footer
