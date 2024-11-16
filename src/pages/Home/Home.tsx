import { Macbook } from 'src/components/Macbook';
import { MenuItem } from 'src/components/MenuItem';
import { menuItems } from 'src/utils/menuItems';

export const Home = () => (
  <>
    <Macbook />

    <section className='ml-[20px] mt-20 flex min-w-full max-w-5xl flex-col gap-10 pl-2 sm:mt-0 md:mt-[80px] md:gap-14 md:pl-10'>
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
