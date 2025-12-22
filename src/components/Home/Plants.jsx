import Card from './Card'
import Container from '../Shared/Container'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import LoadingSpinner from '../Shared/LoadingSpinner'

const Plants = () => {
  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      const result = await axios(`${import.meta.env.VITE_API_URL}/clubs`)
      return result.data
    },
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <Container>
      {clubs && clubs.length > 0 ? (
        <div className='pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8'>
          {clubs.map(club => (
            <Card key={club._id} club={club} />
          ))}
        </div>
      ) : null}
    </Container>
  )
}

export default Plants