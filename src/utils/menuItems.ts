import avatar from 'src/assets/egor.jpg';
import digest from 'src/assets/digest-cover-small.jpg';
import extensions from 'src/assets/extensions-cover-small.jpg';
import devkitty from 'src/assets/devkitty-cover-small.jpg';

export const menuItems = [
  {
    heading: 'About',
    subheading: 'Links and contacts',
    imgSrc: avatar,
    href: '/about'
  },
  {
    heading: 'Digest',
    subheading: 'Your weekly dose of front-end news',
    imgSrc: digest,
    href: '/digest'
  },
  {
    heading: 'Extensions',
    subheading: 'My extension packs',
    imgSrc: extensions,
    href: '/extensions'
  },
  {
    heading: 'Devkitty',
    subheading: 'Swiss army knife for developers',
    imgSrc: devkitty,
    href: '/devkitty'
  }
];
