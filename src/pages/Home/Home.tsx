import { MenuItem } from 'src/components/MenuItem';
import { menuItems } from 'src/utils/menuItems';

export const Home = () => {
  return (
    <section className='relative mx-auto mt-[60px] w-[100%] max-w-5xl overflow-hidden p-14 pl-[20px] md:ml-[300px] md:mt-[80px] md:pl-[4px] '>
      {menuItems.map(({ heading, href, imgSrc, subheading }, key) => (
        <MenuItem
          index={key}
          key={key}
          heading={heading}
          subheading={subheading}
          imgSrc={imgSrc}
          href={href}
        />
      ))}
    </section>
  );
};
