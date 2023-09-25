import Link from 'next/link'
import { useRouter } from 'next/router'

export interface SingleLinkProps {
  iconSrc?: string
  label: string
  path?: string
  url?: string
  onClick?: () => void
}

const SingleLink = (props: SingleLinkProps) => {
  const { iconSrc, label, path, url, onClick } = props
  const router = useRouter()
  const selected = router.asPath === path // || router.pathname === path
  const isNothing = !url && !path && !onClick

  return (
    <Link
      scroll={false}
      href={url || path || ''}
      target={!!url ? '_blank' : ''}
      rel={!!url ? 'noopener noreferrer' : ''}
      onClick={() => {
        if (!isNothing) window.scroll({ top: 0, left: 0 })
        if (onClick) onClick()
      }}
      className={
        (selected ? 'text-white' : 'xl:border-0') +
        ' block py-2 px-3 xl:p-0 w-full xl:w-auto text-start xl:text-center text-sm rounded truncate ' +
        (isNothing ? 'cursor-not-allowed line-through text-zinc-500' : 'hover:bg-zinc-500/70 xl:hover:bg-transparent xl:hover:underline')
      }
    >
      <span className='flex items-center'>
        {label}
        {iconSrc ? <img src={iconSrc} alt='' className='w-4 h-4 ml-2' /> : null}
      </span>
    </Link>
  )
}

export default SingleLink
