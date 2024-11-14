import { FC, useEffect } from 'react';

import { useThemeStore } from '../../store/themeStore';
import { Gradient, GradientType } from '../../utils/gradient';
import { Space } from '../Space';

export const Backgrounds: FC = () => {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    if (theme === 'dark') return;
    const gradient = new Gradient() as unknown as GradientType;
    gradient.initGradient('#gradient-canvas');
  }, [theme]);

  return (
    <>
      {theme === 'dark' && <Space />}

      {theme === 'light' && (
        <canvas
          data-transition-in
          id='gradient-canvas'
        />
      )}

      <label className='fixed right-4 top-4 z-10 inline-flex items-center'>
        <input
          checked={theme === 'dark'}
          className='peer hidden'
          id='toggle'
          type='checkbox'
          onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        />
        <div className="relative h-[30px] w-[60px] rounded-full bg-white from-orange-500 to-yellow-400 opacity-30 shadow-sm duration-300 after:absolute after:left-[5px] after:top-[5px] after:h-[20px] after:w-[20px] after:rounded-full after:bg-gradient-to-r after:shadow-md after:duration-300 after:content-[''] active:after:w-[50px] peer-checked:bg-zinc-500 peer-checked:after:left-[55px] peer-checked:after:translate-x-[-100%] peer-checked:after:from-zinc-900 peer-checked:after:to-zinc-900" />
      </label>
    </>
  );
};
