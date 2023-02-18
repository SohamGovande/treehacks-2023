import Head from "next/head"
import { Box, Flex, Heading, Text } from "@chakra-ui/react"
import { useEffect, useState, useMemo, useRef } from "react"
import { lazy } from "react"
import { motion } from "framer-motion"
import Typewriter from "typewriter-effect"

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

export default function Home() {
  const [ssr, setSsr] = useState(true)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setSsr(false)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Ship</title>
      </Head>
      <Box w="100vw" h="100vh" bg="black" color="white">
        {!ssr && (
          <div style={{ justifyContent: "center" }}>
            <World />
          </div>
        )}
      </Box>
      <Flex
        color="white"
        align="center"
        justify="center"
        direction="column"
        w="100vw"
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
          justifyContent="center"
          textAlign="center"
          fontSize="7xl"
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
      </Flex>
    </>
  )
}