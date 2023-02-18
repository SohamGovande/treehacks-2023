import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { Box, Text } from '@chakra-ui/react'
import { useEffect, useState, useMemo, useRef } from 'react'
import { lazy } from 'react'
import { motion } from 'framer-motion'
import { Typewriter } from 'react-simple-typewriter'

const inter = Inter({ subsets: ['latin'] })

const World = lazy(() => import('../components/Globe'))

export default function Home() {
  const [ssr, setSsr] = useState(true)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSsr(false)
    }
  }, [])

  const fileRef = useRef(null)
  const search_terms = useMemo(
    () => [
      'Let`s get reel...',
      "300 billion fish are caught illegally every year",
      'What were shipping',
    ],
    [],
  )
  return (
    <>
      <Head>
        <title>Ship</title>
      </Head>
      <Box w="100vw" h="100vh" bg="black">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Text color={'white'} fontSize="8xl" textAlign="center">
            ShipSense
          </Text>
        </motion.div>
        <Text justifyContent={'center'} textAlign={'center'}>
        <i>
          <b>
            <span className="pink">
              {fileRef.current ? (
                searchTerm || 'search term'
              ) : (
                <Typewriter
                  typeSpeed={150}
                  deleteSpeed={50}
                  delaySpeed={4000}
                  words={search_terms}
                  loop={true}
                ></Typewriter>
              )}{' '}
            </span>
          </b>
        </i>
        </Text>
        {!ssr && (
          <div style={{ justifyContent: 'center' }}>
            <World />
          </div>
        )}
      </Box>
    </>
  )
}
