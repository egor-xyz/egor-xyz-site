import { Link } from 'react-router-dom';

import Logo from './assets/logo.svg?react';
import { Backgrounds } from './components/Backgrounds';
import { TopMenu } from './components/TopMenu';
import { Router } from './Router';

export const App = () => (
  <div className='flex h-[100svh] items-center justify-center overflow-hidden text-white'>
    <Backgrounds />
    <Router />
    <TopMenu />

    {/* Logo lives permanently in the top-left corner — no intro animation. */}
    <Link
      className='fixed top-4 left-4 z-10 cursor-pointer bg-transparent p-3 dark:rounded-3xl dark:bg-white/20'
      to='/'
    >
      <Logo className='h-auto w-[88px] md:w-[96px] dark:opacity-80' />
    </Link>
  </div>
);
