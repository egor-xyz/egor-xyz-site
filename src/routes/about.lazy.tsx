import { Link, createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/about')({
  component: Index
});

function Index() {
  return (
    <div className='p-2'>
      <Link to='/'>
        <h3>Welcome Home!</h3>
      </Link>
    </div>
  );
}
