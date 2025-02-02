import { createFileRoute } from '@tanstack/react-router'

const VicePresident = () => {
  return <div className=''>Hello from Vice President!</div>
}

export const Route = createFileRoute('/executive/VicePresident')({
  component: VicePresident,
})
