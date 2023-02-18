import '@/styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import ResizeObserver from 'resize-observer-polyfill';

export default function App({ Component, pageProps }) {
  return <ChakraProvider>
    <Component {...pageProps} />
  </ChakraProvider>
}
