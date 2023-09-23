import Banana from '@/icons/Banana'

const Loader = (props: { size?: string | number }) => {
  const { size = 150 } = props

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='animate-spin-slow motion-safe:animate-spin-slow drop-shadow-loader'>
        <Banana size={size} />
      </div>
    </div>
  )
}

export default Loader
