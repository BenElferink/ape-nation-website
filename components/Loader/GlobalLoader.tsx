import Loader from '.';
import Modal from '../layout/Modal';

const GlobalLoader = (props: { loading: boolean }) => {
  const { loading } = props;

  return (
    <Modal open={loading} scrollToTop noModal className='justify-center'>
      <Loader size={250} />
    </Modal>
  );
};

export default GlobalLoader;
