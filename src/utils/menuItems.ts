import avatar from 'src/assets/egor.jpg';
import digest from 'src/assets/digest-cover-small.jpg';
import extensions from 'src/assets/extensions-cover-small.jpg';
import devkitty from 'src/assets/devkitty-cover-small.jpg';

export const menuItems = [
  {
    heading: 'About',
    href: '/about',
    imgSrc: avatar,
    subheading: 'Links and contacts'
  },
  {
    heading: 'Digest',
    href: '/digest',
    imgSrc: digest,
    subheading: 'Your weekly dose of front-end news'
  },
  {
    heading: 'Extensions',
    href: '/extensions',
    imgSrc: extensions,
    subheading: 'My extension packs'
  },
  {
    heading: 'Devkitty',
    href: '/devkitty',
    imgSrc: devkitty,
    subheading: 'Swiss army knife for developers'
  }
];
