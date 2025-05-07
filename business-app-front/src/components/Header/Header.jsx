// components
import HeaderLeft from './HeaderLeft';
import HeaderRight from './HeaderRight';

const Header = ({ icon, title }) => (
  <header className='flex flex-center flex-space-between'>
    <HeaderLeft icon={icon} title={title} />
    <HeaderRight />
  </header>
);

export default Header;
