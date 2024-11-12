import { Macbook } from 'src/components/Macbook';
import { MenuItem } from 'src/components/MenuItem';
import { menuItems } from 'src/utils/menuItems';

export const Home = () => (
  <>
    <Macbook />

    <section className='ml-[20px] flex w-full max-w-5xl flex-col gap-10 md:ml-[300px] md:mt-[80px] md:gap-14'>
      {menuItems.map(({ heading, href, imgSrc, subheading }, key) => (
        <MenuItem
          heading={heading}
          href={href}
          imgSrc={imgSrc}
          index={key}
          key={key}
          subheading={subheading}
        />
      ))}
    </section>
  </>
);
