import { motion } from 'motion/react';
import { type FC, useEffect } from 'react';
import { FiUser } from 'react-icons/fi';
import devkittyIcon from 'src/assets/devkitty-icon.png';
import { RobotIcon } from 'src/components/RobotIcon';
import { useCommandStore } from 'src/store/commandStore';
import { menuItems } from 'src/utils/menuItems';

type Props = {
  /** Navigate handler — supplied by a component inside the Router context. */
  onNavigate: (href: string) => void;
  /** Becomes true once the lid is open — triggers the staggered reveal. */
  opened: boolean;
};

// The window opens like macOS: a quick scale-up from the centre with a soft
// spring, then the items settle in.
const panel = {
  hidden: { opacity: 0, scale: 0.86 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { damping: 20, stiffness: 280, type: 'spring' as const }
  }
};

const list = {
  hidden: {},
  show: { transition: { delayChildren: 0.16, staggerChildren: 0.06 } }
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
    y: 0
  }
};

const lights = ['#ff5f57', '#febc2e', '#28c840'];
const menuIcons: Record<string, string> = {
  '/devkitty': devkittyIcon
};

const isTyping = () => {
  const el = document.activeElement as HTMLElement | null;
  return el?.tagName === 'INPUT' || el?.tagName === 'TEXTAREA' || !!el?.isContentEditable;
};

const menuButtons = () => Array.from(document.querySelectorAll<HTMLButtonElement>('[data-menu-item]'));

// Move focus to the next/previous menu item, wrapping at the ends. Works even
// when nothing in the menu is focused yet (lands on the first/last item).
const moveFocus = (forward: boolean) => {
  const buttons = menuButtons();
  if (buttons.length === 0) return;
  const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
  const from = current === -1 ? (forward ? -1 : 0) : current;
  const next = (from + (forward ? 1 : -1) + buttons.length) % buttons.length;
  buttons[next]?.focus();
};

/**
 * The menu that lives on the Macbook screen. Rendered inside a drei <Html
 * transform> so it tilts & scales with the lid. Styled as a macOS window:
 * a traffic-light title bar above the navigation items.
 *
 * Keyboard (while the lid is open): ↑/↓ move between items and loop — globally,
 * so they work the moment you land on Home without having to focus the menu
 * first. Tab/Shift+Tab also cycle the items, and Enter activates the focused one.
 */
export const ScreenMenu: FC<Props> = ({ onNavigate, opened }) => {
  // ↑/↓ are handled on the window (not just the menu) so they select items even
  // when focus is still on <body> after navigating back to Home.
  useEffect(() => {
    if (!opened) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      if (useCommandStore.getState().open || isTyping()) return;
      event.preventDefault();
      moveFocus(event.key === 'ArrowDown');
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [opened]);

  // Tab/Shift+Tab loop within the menu once focus is inside it.
  const onMenuKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab') return;
    event.preventDefault();
    moveFocus(!event.shiftKey);
  };

  return (
    <motion.div
      animate={opened ? 'show' : 'hidden'}
      className={`w-[380px] origin-center select-none overflow-hidden rounded-xl bg-[#1c1c1e]/95 shadow-2xl ring-1 ring-white/10 backdrop-blur-md ${
        opened ? '' : 'pointer-events-none'
      }`}
      initial='hidden'
      variants={panel}
    >
      {/* Title bar with traffic-light buttons */}
      <div className='flex items-center gap-2 border-white/5 border-b bg-white/5 px-4 py-3'>
        {lights.map((c) => (
          <span
            className='h-3 w-3 rounded-full'
            key={c}
            style={{ backgroundColor: c }}
          />
        ))}
        <span className='ml-3 font-medium text-white/40 text-xs'>egor.xyz</span>
      </div>

      {/* Menu items */}
      <motion.nav
        aria-label='Main'
        className='glass-scroll flex max-h-[420px] flex-col gap-4 overflow-y-auto px-8 py-6'
        onKeyDown={onMenuKeyDown}
        variants={list}
      >
        {menuItems.map(({ heading, href, subheading }) => {
          const iconSrc = menuIcons[href];
          return (
            <motion.button
              className='group -mx-3 -my-1 flex cursor-pointer items-center gap-4 rounded-lg px-3 py-1 text-left outline-none ring-white/30 focus:bg-white/15 focus:ring-1'
              data-menu-item
              key={heading}
              onClick={() => onNavigate(href)}
              tabIndex={opened ? 0 : -1}
              type='button'
              variants={item}
            >
              <span className='menu-icon-tile flex h-13 w-13 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white/85 backdrop-blur-md'>
                {href === '/extensions' ? (
                  <span className='motion-safe:group-focus:animate-pulse motion-safe:group-hover:animate-pulse'>
                    <RobotIcon size={44} />
                  </span>
                ) : iconSrc ? (
                  <img
                    alt=''
                    className='h-10 w-10 object-contain'
                    src={iconSrc}
                  />
                ) : (
                  <FiUser
                    aria-hidden
                    className='h-7 w-7 motion-safe:group-focus:animate-pulse motion-safe:group-hover:animate-pulse'
                  />
                )}
              </span>
              <span className='flex flex-col gap-0.5'>
                <span className='font-bold text-3xl text-white tracking-tight'>{heading}</span>
                <span className='text-sm text-white/55 transition-colors group-hover:text-white/75 group-focus:text-white/75'>
                  {subheading}
                </span>
              </span>
            </motion.button>
          );
        })}
      </motion.nav>
    </motion.div>
  );
};
