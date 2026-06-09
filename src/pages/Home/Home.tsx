import { Macbook } from 'src/components/Macbook';
import { MenuItem } from 'src/components/MenuItem';
import { menuItems } from 'src/utils/menuItems';

export const Home = () => (
  <>
    <Macbook />

    <section className='mt-20 ml-[20px] flex min-w-full max-w-5xl flex-col gap-10 pl-2 sm:mt-0 md:mt-[80px] md:gap-14 md:pl-10'>
      {menuItems.map(({ heading, href, subheading }, index) => (
        <MenuItem
          heading={heading}
          href={href}
          index={index}
          key={heading}
          subheading={subheading}
        />
      ))}
    </section>
  </>
);
