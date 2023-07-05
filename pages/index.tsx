import { Container, Box } from '@mui/material'
import GroceryList from '@/components/GroceryList'

const GroceryApp: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#121212',
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="sm">
        <GroceryList />
      </Container>
    </Box>
  )
}

export default GroceryApp
