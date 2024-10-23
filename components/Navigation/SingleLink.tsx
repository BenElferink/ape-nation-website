import Link from 'next/link';
import { useRouter } from 'next/router';

export interface SingleLinkProps {
  label?: string
  logoSrc?: string
  path?: string
  url?: string
  onClick?: () => void
}

const SingleLink = (props: SingleLinkProps) => {
  const { label, logoSrc, path, url, onClick } = props;
  const router = useRouter();
  const selected = router.asPath === path; // || router.pathname === path
  const isNothing = !url && !path && !onClick;

  return (
    <Link
      scroll={false}
      href={url || path || ''}
      target={!!url ? '_blank' : ''}
      rel={!!url ? 'noopener noreferrer' : ''}
      onClick={() => {
        if (!isNothing) window.scroll({ top: 0, left: 0 });
        if (onClick) onClick();
      }}
      className={
        (selected ? 'text-white' : 'lg:border-0') +
        ' block py-2 px-3 lg:p-0 w-full lg:w-auto text-start lg:text-center text-sm rounded truncate ' +
        (isNothing ? 'cursor-not-allowed line-through text-zinc-500' : 'hover:bg-zinc-500/70 lg:hover:bg-transparent lg:hover:underline')
      }
    >
      <span className='flex items-center'>
        {logoSrc ? (
          <div className='w-6 h-6 flex items-center'>
            <img src={logoSrc} alt='' className='w-4 object-cover rounded-full' />
          </div>
        ) : null}

        {label}
      </span>
    </Link>
  );
};

export default SingleLink;
