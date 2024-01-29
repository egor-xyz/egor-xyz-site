import { MenuItem } from 'src/components/MenuItem';
import { EnterAnimation } from 'src/components/EnterAnimation/EnterAnimation';
import { menuItems } from 'src/utils/menuItems';

export const Home = () => {
  return (
    <EnterAnimation>
      <section className='relative mx-auto  mt-[80px] w-[100%] max-w-5xl overflow-hidden p-14 pl-[240px] lg:pl-4'>
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
    </EnterAnimation>
  );
};
