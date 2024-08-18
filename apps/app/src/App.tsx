import 'src/components/css-imports';
import { Box, Container } from '@mui/material';
import Providers from 'src/components/providers';
import Visualizer from 'src/components/visualizer';
import ChatView from './components/chat';
import useUser from './hooks/user';
import LockedScreen from './components/locked-screen';

function App() {
  return <Providers>
    <RenderLayout />
  </Providers>
}

function MainLayout() {
  return <Box sx={{
    display: "flex",
    placeContent: "center",
  }}>
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        gap: 4,
        height: "100dvh",
        padding: 4
      }}
    >
      <Visualizer sx={{
        height: "100%",
        width: "50%"
      }} />
      <ChatView
        sx={{
          height: "100%",
          width: "50%"
        }}
      />
    </Container>
  </Box>
}

function LockedLayout() {
  return <LockedScreen />
}

function RenderLayout() {
  const { user } = useUser()
  console.log(user)
  return user.name && user.openAIKey ? <MainLayout /> : <LockedLayout />
}

export default App