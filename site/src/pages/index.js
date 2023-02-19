import Head from 'next/head'
import { Box, Flex, Heading, Text, Button } from '@chakra-ui/react'
import { useEffect, useState, useMemo, useRef } from 'react'
import { lazy } from 'react'
import { motion, useScroll } from 'framer-motion'
import Typewriter from 'typewriter-effect'
import { useRouter } from 'next/router'
import Link from 'next/link'
import MapPageContents from '@/components/MapPageContents'
import * as nookies from 'nookies'
import Lottie from 'lottie-react'
import animationData from '../files/animationData.json'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const World = lazy(() => import('../components/Globe'))

function exportToPdf() {
  const element = document.getElementById('pdf-container');

  html2canvas(element).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
    pdf.save('document.pdf');
  });
}

const CustomTypewriterEffect = ({
  strings,
  emojis,
  typeSpeed,
  pauseDelay,
  overallIterations,
}) => {
  return (
    <Typewriter
      onInit={(tw) => {
        tw.changeDelay(typeSpeed)
        tw.changeDeleteSpeed(typeSpeed * 2)
        // We want to revert to the first item after the last item, so we end with i=0
        for (let i = 0; i <= strings.length * 1; i++) {
          const index = i % strings.length

          // Restart
          tw.deleteAll()
          tw.typeString(strings[index])
          tw.typeString(' ')
          // We need to paste emojis instead of typing them out because they are not supported by the typewriter effect
          if (emojis[index]) {
            tw.pasteString(emojis[index])
          }
          tw.pauseFor(pauseDelay)
        }
        tw.start()
      }}
    />
  )
}

const END_THRESHOLD = -1000
const END_THRESHOLD_BUFFER = 500
const BEGIN_THRESHOLD = 0

const calculateTextOpacity = (scrollCounter) => {
  if (scrollCounter < BEGIN_THRESHOLD) {
    const returnValue =
      1 - (BEGIN_THRESHOLD - scrollCounter) / (BEGIN_THRESHOLD - END_THRESHOLD)
    return returnValue
  }
  return 1
}

export default function Home() {
  const [language, setLanguage] = useState('en')
  const handleLanguageChange = (newLanguage) => {
    nookies.setCookie(null, 'language', newLanguage)
    setLanguage(newLanguage)
  }

  useEffect(() => {
    const cookies = nookies.parseCookies()
    if (cookies.language) {
      setLanguage(cookies.language)
    }
  }, [])

  useEffect(() => {
    console.log('languagae canged to ', language)
  }, [language])

  const translations = {
    en: {
      language: 'English',
      ShipSense: 'ShipSense',
      "Let's get reel...": "Let's get reel...",
      '300 billion fish are caught illegally':
        '300 billion fish are caught illegally',
      "What we're shipping": "What we're shipping",
    },
    fr: {
      language: 'Français',
      ShipSense: 'AspectBateau',
      "Let's get reel...": 'Soyons sérieux...',
      '300 billion fish are caught illegally':
        '300 milliards de poissons sont pêchés illégalement',
      "What we're shipping": 'Ce que nous expédions',
    },
    es: {
      language: 'Español',
      ShipSense: 'Mirada de Barco',
      "Let's get reel...": 'Seamos sinceros...',
      '300 billion fish are caught illegally':
        '300 mil millones de peces son capturados ilegalmente',
      "What we're shipping": 'Lo que estamos enviando',
    },
    ch: {
      language: '中文',
      ShipSense: '船看',
      "Let's get reel...": '让我们真实一点...',
      '300 billion fish are caught illegally': '3000亿条鱼被非法捕获',
      "What we're shipping": '我们正在运输的东西',
    },
  }

  const [ssr, setSsr] = useState(true)
  const router = useRouter()
  const [scrollCounter, setScrollCounter] = useState(0)
  const [isRouting, setIsRouting] = useState(false)

  // Add a wheel event listener to the window
  const handleWheel = (e) => {
    if (e.deltaY === 0) {
      return
    }
    setScrollCounter((prev) => prev + (e.deltaY / Math.abs(e.deltaY)) * 25)
  }

  useEffect(() => {
    if (scrollCounter < END_THRESHOLD - END_THRESHOLD_BUFFER) {
      setIsRouting(true)
      setTimeout(() => {
        router.push('/map')
      }, 500)
    }
  }, [scrollCounter])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSsr(false)
    }

    window.addEventListener('wheel', handleWheel)

    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  return (
    <>
      <Head>
        <title>ShipSense.AI - Reduce overfishing</title>
      </Head>
      <Box w="100vw" h="100vh" bg="black" color="white">
        {!ssr && (
          <div style={{ justifyContent: 'center' }}>
            <World />
          </div>
        )}
      </Box>

      <Flex
        as={motion.div}
        animate={{ opacity: calculateTextOpacity(scrollCounter) }}
        align="center"
        justify="center"
        textAlign="center"
        direction="column"
        w="100vw"
        pointerEvents="none"
        h="100vh"
        pos="absolute"
        top={0}
        left={0}
      >
        <Flex direction="row" gap={10}>
          {Object.keys(translations).map((lang) => (
            <Button
              key={lang}
              size="lg"
              pointerEvents={'initial'}
              textShadow="0px 0px 10px rgba(0,0,0,1)"
              colorScheme="blackAlpha"
              color="white"
              fontSize="3xl"
              onClick={() => handleLanguageChange(lang)}
            >
              {translations[lang].language}
            </Button>
          ))}
        </Flex>
        <Heading as="h1" fontWeight="900" fontSize="10em" textAlign="center">
          {translations[language].ShipSense}
        </Heading>
        <Heading
          as="h2"
          fontWeight="400"
          fontFamily="body"
          justifyContent="center"
          textAlign="center"
          fontSize="5xl"
          textShadow="0px 0px 10px rgba(0,0,0,1)"
          minH="1.5em"
          display="block"
        >
          <CustomTypewriterEffect
            key={language}
            strings={[
              translations[language]["Let's get reel..."],
              translations[language]['300 billion fish are caught illegally'],
              translations[language]["What we're shipping"],
            ]}
            emojis={['🎣', '🐠', '🚢']}
            typeSpeed={40}
            pauseDelay={1250}
            overallIterations={10}
          />
        </Heading>
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 1,
            pointerEvents: 'none',
          }}
          animate={{ backgroundColor: isRouting ? '#000000FF' : '#00000000'}}
          transition={{ duration: 0.5 }}
        >
        </motion.div>
      </Flex>
    </>
  )
}
