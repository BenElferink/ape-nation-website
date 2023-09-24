import Image from 'next/image'
import SocialIcon from '../SocialIcon'

export interface TeamCardProps {
  profilePicture: string
  name: string
  title: string
  description: string
  socials: string[]
}

const TeamCard = (props: TeamCardProps) => {
  const { profilePicture, name, title, description, socials } = props

  return (
    <article className='flex flex-col items-center justify-center w-72 m-4 p-5 bg-zinc-950/70 rounded-xl shadow-[-1px_-1px_0.3rem_0_rgba(255,255,255,0.5)]'>
      <div className='h-32 w-32 mt-2 mb-5 relative'>
        <Image src={profilePicture} alt={name} fill sizes='10rem' className='object-cover rounded-full shadow-[0_0_3px_0_rgb(0,0,0)]' />
      </div>

      <div className='m-3 text-center'>
        <h3 className='text-lg text-white font-md'>{name}</h3>
        <h4 className='text-sm text-[var(--accent-2)] font-normal'>{title}</h4>
        <p className='mt-3 text-xs text-zinc-400 font-light'>{description}</p>
      </div>

      <div className='flex mt-auto'>
        {socials.map((url) => (
          <SocialIcon key={`social-${url}`} url={url} color='#fff' size='w-6 h-6' className='p-1 rounded-lg hover:bg-zinc-400/50' />
        ))}
      </div>
    </article>
  )
}

export default TeamCard
