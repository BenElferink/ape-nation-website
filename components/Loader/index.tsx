import { LoaderIcon } from 'react-hot-toast';

const Loader = (props: { size?: string | number }) => {
  const { size = 150 } = props;

  return (
    <div className='flex flex-col items-center justify-center'>
      <LoaderIcon style={{ width: size, height: size }} />
    </div>
  );
};

export default Loader;
