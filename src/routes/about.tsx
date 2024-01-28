import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  component: Index
});

function Index() {
  return (
    <div className='p-2'>
      <Link to='/'>
        <img
          className='w-full'
          src='https://placedog.net/640/480?random&2'
        />
      </Link>
    </div>
  );
}
