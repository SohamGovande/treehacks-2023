import Head from "next/head"
import { Box, Flex, Heading, Text } from "@chakra-ui/react"
import { useEffect, useState, useMemo, useRef } from "react"
import { lazy } from "react"
import { motion, useScroll } from "framer-motion"
import Typewriter from "typewriter-effect"
import { useRouter } from "next/router"
import Link from "next/link"
import MapPageContents from "@/components/MapPageContents"

const World = lazy(() => import("../components/Globe"))

const CustomTypewriterEffect = ({ strings, emojis, typeSpeed, pauseDelay, overallIterations }) => {
  return (
    <Typewriter
      onInit={(tw) => {
        tw.changeDelay(typeSpeed)
        tw.changeDeleteSpeed(typeSpeed * 2)
        // We want to revert to the first item after the last item, so we end with i=0
        for (let i = 0; i <= strings.length * overallIterations; i++) {
          const index = i % strings.length

          // Restart
          tw.deleteAll()
          tw.typeString(strings[index])
          tw.typeString(" ")
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
    const returnValue = 1 - (BEGIN_THRESHOLD - scrollCounter) / (BEGIN_THRESHOLD - END_THRESHOLD)
    return returnValue
  }
  return 1
}

export default function Home() {
  const [ssr, setSsr] = useState(true)
  const router = useRouter()
  const [scrollCounter, setScrollCounter] = useState(0)
  const [isRouting, setIsRouting] = useState(false)

  // Add a wheel event listener to the window
  const handleWheel = (e) => {
    if (e.deltaY === 0) {
      return
    }
    setScrollCounter((prev) => prev + e.deltaY)
  }

  useEffect(() => {
    if (scrollCounter < END_THRESHOLD - END_THRESHOLD_BUFFER) {
      setIsRouting(true)
      setTimeout(() => {
        router.push("/map")
      }, 500)
    }
  }, [scrollCounter])

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSsr(false)
    }

    window.addEventListener("wheel", handleWheel)

    return () => window.removeEventListener("wheel", handleWheel)
  }, [])

  return (
    <>
      <Head>
        <title>ShipSense.AI - Reduce overfishing</title>
      </Head>
      <Box w="100vw" h="100vh" bg="black" color="white">
        {!ssr && (
          <div style={{ justifyContent: "center" }}>
            <World />
          </div>
        )}
      </Box>
      <Flex
        as={motion.div}
        color={`rgba(255,255,255,${calculateTextOpacity(scrollCounter)})`}
        align="center"
        justify="center"
        direction="column"
        w="100vw"
        pointerEvents="none"
        h="100vh"
        pos="absolute"
        top={0}
        left={0}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Heading as="h1" fontWeight="900" fontSize="10em" textAlign="center">
            ShipSense
          </Heading>
        </motion.div>
        <Heading
          as="h2"
          fontWeight="400"
          fontFamily="body"
          justifyContent="center"
          textAlign="center"
          fontSize="5xl"
          textShadow="0px 0px 10px rgba(0,0,0,1)"
          minH="1.5em"
          display="block">
          <CustomTypewriterEffect
            strings={["Let's get reel...", "300 billion fish are caught illegally", "What we're shipping"]}
            emojis={["🎣", "🐠", "🚢"]}
            typeSpeed={40}
            pauseDelay={1250}
            overallIterations={10}
          />
        </Heading>
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 1,
            pointerEvents: "none",
          }}
          animate={{ backgroundColor: isRouting ? "#000000FF" : "#00000000" }}
          transition={{ duration: 0.5 }}
        />
      </Flex>
    </>
  )
}
