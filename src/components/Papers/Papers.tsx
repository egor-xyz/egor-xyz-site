import { useCallback, useEffect, useState } from 'react';

type Paper = {
  animationDuration: string;
  id: number;
  left: string;
  rotation: number;
  scale: number;
};

export const Papers = () => {
  const [papers, setPapers] = useState<Paper[]>([]);

  const createPaper = useCallback(
    () =>
      ({
        animationDuration: `${Math.random() * 5 + 5}s`,
        id: Math.random(),
        left: `${Math.random() * 100}%`,
        rotation: Math.random() * 360,
        scale: Math.random() * 0.3 + 0.2
      }) as Paper,
    []
  );

  useEffect(() => {
    const initialPapers = Array.from({ length: 20 }, createPaper);
    setPapers(initialPapers);
  }, [createPaper]);

  const removePaper = (id: number) => {
    setPapers((prevPapers) => prevPapers.filter((paper) => paper.id !== id));
  };

  return (
    <div
      aria-hidden='true'
      className='pointer-events-none fixed top-0 right-0 bottom-0 left-0'
    >
      {papers.map((paper) => (
        <div
          className='animate-fall absolute top-0 h-40 w-32 rounded-sm bg-white shadow-md'
          key={paper.id}
          onAnimationEnd={() => removePaper(paper.id)}
          style={{
            animationDuration: paper.animationDuration,
            left: paper.left,
            transform: `rotate(${paper.rotation}deg) scale(${paper.scale})`
          }}
        >
          <div className='flex h-full w-full flex-col p-1'>
            <div className='mb-[2px] border-b border-gray-800 pb-[2px] text-[14px] font-bold text-gray-600'>
              {'<'}Frontend News{'>'}
            </div>

            <div className='mb-[2px] flex space-x-[2px]'>
              <div className='w-1/2 space-y-[2px]'>
                <div className='h-1 w-full rounded-xs bg-gray-300' />
                <div className='h-1 w-3/4 rounded-xs bg-gray-300' />
                <div className='h-1 w-full rounded-xs bg-gray-300' />
              </div>

              <div className='h-10 w-1/2 rounded-xs bg-gray-200' />
            </div>

            <div className='space-y-[2px]'>
              <div className='h-[2px] w-full rounded-xs bg-gray-300' />
              <div className='h-[2px] w-full rounded-xs bg-gray-300' />
              <div className='h-[2px] w-3/4 rounded-xs bg-gray-300' />
              <div className='h-[2px] w-full rounded-xs bg-gray-300' />
              <div className='h-[2px] w-5/6 rounded-xs bg-gray-300' />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
