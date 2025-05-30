import { type FC, useEffect } from 'react';
import { setThemeColor } from 'src/utils/setMetaThemeColor';

import { useThemeStore } from '../../store/themeStore';
import { Gradient, type GradientType } from '../../utils/gradient';
import { Space } from '../Space';

export const Backgrounds: FC = () => {
  const { setTheme, theme } = useThemeStore();

  const onClick = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    setThemeColor(theme === 'dark' ? '#000000' : '#ef4444');

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

      <label
        className='fixed top-4 right-4 z-10 inline-flex cursor-pointer items-center'
        style={{ touchAction: 'manipulation' }}
      >
        <input
          aria-label='Toggle theme'
          checked={theme === 'dark'}
          className='peer hidden'
          id='toggle'
          onChange={onClick}
          type='checkbox'
        />

        <div className="relative h-[30px] w-[60px] cursor-pointer rounded-full bg-white from-orange-500 to-yellow-400 opacity-30 shadow-xs duration-300 peer-checked:bg-zinc-500 after:absolute after:top-[5px] after:left-[5px] after:h-[20px] after:w-[20px] after:rounded-full after:bg-linear-to-r after:shadow-md after:duration-300 after:content-[''] peer-checked:after:left-[55px] peer-checked:after:translate-x-[-100%] peer-checked:after:from-zinc-900 peer-checked:after:to-zinc-900 active:after:w-[50px]" />
      </label>
    </>
  );
};
