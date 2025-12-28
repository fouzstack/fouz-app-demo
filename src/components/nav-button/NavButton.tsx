import { Button } from '@heroui/button';
import { useNavigate } from 'react-router-dom';
import { HomeIcon } from '../icons/HomeIcon.tsx';

const NavButton = () => {
  const navigate = useNavigate();

  return (
    <div className='fixed bottom-2 right-2 not-printable  cursor-pointer'>
      <Button
        onPress={() => {
          navigate('/');
        }}
        size='sm'
        color='warning'
        variant='ghost'
        className='not-printable'
      >
        <HomeIcon size={20} color='#000000' />
      </Button>
    </div>
  );
};

export default NavButton;
