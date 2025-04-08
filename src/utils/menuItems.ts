import devkitty from 'src/assets/devkitty-cover-small.jpg';
import digest from 'src/assets/digest-cover-small.jpg';
import avatar from 'src/assets/egor.jpg';
import extensions from 'src/assets/extensions-cover-small.jpg';

export const menuItems = [
  {
    heading: 'Digest',
    href: '/digest',
    imgSrc: digest,
    subheading: 'Your weekly dose of frontend news'
  },
  {
    heading: 'Devkitty',
    href: '/devkitty',
    imgSrc: devkitty,
    subheading: 'Swiss army knife for developers'
  },
  {
    heading: 'Extensions',
    href: '/extensions',
    imgSrc: extensions,
    subheading: 'My extension packs and npm packages'
  },
  {
    heading: 'About',
    href: '/about',
    imgSrc: avatar,
    subheading: 'Links and contacts'
  }
];
