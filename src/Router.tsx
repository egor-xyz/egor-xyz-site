import { AnimatePresence } from 'motion/react';
import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { Home } from './pages/Home';

// Home carries the 3D hero and is the landing route — it stays in the main
// bundle. Everything else is split out so the first load only pays for Home.
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })));
const Devkitty = lazy(() => import('./pages/Devkitty').then((m) => ({ default: m.Devkitty })));
const Digest = lazy(() => import('./pages/Digest').then((m) => ({ default: m.Digest })));
const Extensions = lazy(() => import('./pages/Extensions').then((m) => ({ default: m.Extensions })));

export const Router = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      <Suspense fallback={null}>
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
            element={<Devkitty />}
            path='/devkitty'
          />

          <Route
            element={<Home />}
            path='*'
          />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};
