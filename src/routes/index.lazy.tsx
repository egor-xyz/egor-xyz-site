import { createLazyFileRoute } from '@tanstack/react-router';
import { Menu } from '../components/Menu';

export const Route = createLazyFileRoute('/')({
  component: Menu
});
