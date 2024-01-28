import { createFileRoute } from '@tanstack/react-router';
import { Menu } from '../components/Menu';

export const Route = createFileRoute('/')({
  component: Menu
});
