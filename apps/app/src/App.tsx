import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Box } from '@mui/material';
import ThemeToggle from 'src/components/theme-toggle';
import Providers from 'src/components/providers';

function App() {
  return <Providers>
    <Box>
      <ThemeToggle />
    </Box>
  </Providers>
}

export default App
