import { createLazyFileRoute } from '@tanstack/react-router'

const VicePresident = () => {
  return <div className=''>Hello from Vice President!</div>
}

export const Route = createLazyFileRoute('/executive/vice-president')({
  component: VicePresident,
})
