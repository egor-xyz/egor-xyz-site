import { EnterAnimation } from '../../components/EnterAnimation/EnterAnimation';
import { Link } from 'react-router-dom';

export const Me = () => {
  return (
    <EnterAnimation>
      <Link
        to='/about'
        className='text-xl '
      >
        To about
      </Link>
    </EnterAnimation>
  );
};
