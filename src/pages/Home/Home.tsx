import { Macbook } from 'src/components/Macbook';
import { MenuItem } from 'src/components/MenuItem';
import { menuItems } from 'src/utils/menuItems';

export const Home = () => (
  <section className='mx-auto mt-[60px] w-[100%] max-w-5xl overflow-hidden p-14 pl-[20px] md:ml-[300px] md:mt-[80px] md:pl-[4px]'>
    <Macbook />

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
);
