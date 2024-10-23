import Image from 'next/image';
import Link from 'next/link';

const data = [
  {
    name: 'Bangr',
    url: 'https://bangr.io',
    logoUrl: '/media/logo/other/bangr.png',
  },
  {
    name: 'Mesh',
    url: 'https://meshjs.dev',
    logoUrl: '/media/logo/other/mesh.png',
  },
];

const Footer = () => {
  return (
    <footer className='py-8 bg-zinc-200/20 backdrop-blur flex flex-col items-center justify-center'>
      <h5 className='text-md'>powered by</h5>

      <div className='mt-4 flex items-center'>
        {data.map((obj) => (
          <Link
            key={`powered-by-${obj.name}`}
            href={obj.url}
            target='_blank'
            rel='noopener noreferrer'
            className='h-20 m-2 flex flex-col items-center justify-between'
          >
            {/* <h6 className='mb-1 text-sm'>{obj.name}</h6> */}
            <Image src={obj.logoUrl} alt={obj.name} width={128} height={64} className='w-[128px] h-[64px] object-contain' />
          </Link>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
