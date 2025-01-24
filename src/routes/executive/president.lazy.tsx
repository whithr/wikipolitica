import { createLazyFileRoute } from '@tanstack/react-router';

const President = () => {
  return <div className='p-2'>Hello from President!</div>;
};

export const Route = createLazyFileRoute('/executive/president')({
  component: President,
});
