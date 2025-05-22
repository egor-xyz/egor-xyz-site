import { AnimatePresence } from 'motion/react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { About } from './pages/About';
import { Articles } from './pages/Articles';
import { Devkitty } from './pages/Devkitty';
import { Digest } from './pages/Digest';
import { Extensions } from './pages/Extensions';
import { Home } from './pages/Home';

export const Router = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      <Routes
        key={location.pathname}
        location={location}
      >
        <Route
          element={<Home />}
          path='/'
        />

        <Route
          element={<About />}
          path='/about'
        />

        <Route
          element={<Digest />}
          path='/digest'
        />

        <Route
          element={<Extensions />}
          path='/extensions'
        />

        <Route
          element={<Articles />}
          path='/articles'
        />

        <Route
          element={<Devkitty />}
          path='/devkitty'
        />

        <Route
          element={<Home />}
          path='*'
        />
      </Routes>
    </AnimatePresence>
  );
};
