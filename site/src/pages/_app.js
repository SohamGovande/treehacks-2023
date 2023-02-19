import '@fontsource/raleway/400.css'
import '@fontsource/raleway/700.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/400.css'
import '@fontsource/nunito/400.css'
import {
  ChakraProvider,
  defineStyleConfig,
  extendTheme,
} from '@chakra-ui/react'
import '@/styles/globals.css'

const theme = extendTheme({
  fonts: {
    heading: "'Raleway', sans-serif",
    body: "'Nunito', sans-serif",
  },
  colors: {
    black: {
      500: '#000000',
    },
  },
})

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
