import { Route, Routes, useLocation } from 'react-router-dom';
import { Home } from './components/Home';
import { About } from './pages/About';
import { Me } from './pages/Me';
import { AnimatePresence } from 'framer-motion';

export const Router = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      <Routes
        location={location}
        key={location.pathname}
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
          element={<Me />}
          path='/me'
        />

        <Route
          element={<Home />}
          path='*'
        />
      </Routes>
    </AnimatePresence>
  );
};
