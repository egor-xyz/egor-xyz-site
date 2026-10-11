import type { FC } from 'react';

type Props = {
  size?: number;
};

// The walking frame and colors come from ~/my/robot/site/index.html.
const frame = '.-----.\n[o   o]\n/|━━━|\\\n o   o ';

export const RobotIcon: FC<Props> = ({ size = 80 }) => (
  <span
    aria-hidden='true'
    className='flex shrink-0 items-center justify-center overflow-hidden text-[#ff8700]'
    style={{ height: size, width: size }}
  >
    <pre
      className='m-0 whitespace-pre font-semibold'
      style={{
        fontFamily: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
        fontSize: size * 0.2,
        lineHeight: 1.16,
        textShadow: '0 0 14px rgb(255 135 0 / 35%)'
      }}
    >
      {frame}
    </pre>
  </span>
);
