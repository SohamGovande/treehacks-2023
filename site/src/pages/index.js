import Head from "next/head"
import {
  Box,
  Flex,
  Text,
  Button,
  Modal,
  Heading,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Image,
} from "@chakra-ui/react"
import { useEffect, useState, useMemo, useRef } from "react"
import { lazy } from "react"
import { AnimatePresence, motion, useScroll } from "framer-motion"
import Typewriter from "typewriter-effect"
import { useRouter } from "next/router"
import Link from "next/link"
import MapPageContents from "@/components/MapPageContents"
import * as nookies from "nookies"
import Lottie from "lottie-react"
import animationData from "../files/animationData.json"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { DataProvider } from "@/contexts/DataContext"
import { ChevronDownIcon } from "@chakra-ui/icons"

const World = lazy(() => import("../components/Globe"))

function exportToPdf() {
  const element = document.getElementById("pdf-container")

  html2canvas(element).then((canvas) => {
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF()
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth() - 20
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
    pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight)
    pdf.save("document.pdf")
  })
}

const CustomTypewriterEffect = ({ strings, emojis, typeSpeed, pauseDelay, overallIterations }) => {
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
const END_THRESHOLD_BUFFER = 200
const BEGIN_THRESHOLD = 0

const calculateTextOpacity = (scrollCounter) => {
  if (scrollCounter < BEGIN_THRESHOLD) {
    const returnValue = 1 - (BEGIN_THRESHOLD - scrollCounter) / (BEGIN_THRESHOLD - END_THRESHOLD)
    return returnValue
  }
  return 1
}

function Home() {
  const [language, setLanguage] = useState("en")
  const handleLanguageChange = (newLanguage) => {
    nookies.setCookie(null, "language", newLanguage)
    setLanguage(newLanguage)
  }

  useEffect(() => {
    const cookies = nookies.parseCookies()
    if (cookies.language) {
      setLanguage(cookies.language)
    }
  }, [])

  const translations = {
    en: {
      language: "English",
      ShipSense: "Live Demo",
      "300 billion fish are caught illegally": "Mitigate overfishing with AI-augmented satellite imagery",
      "What we're shipping": "What we're shipping",
    },
    fr: {
      language: "Français",
      ShipSense: "AspectBateau",
      "300 billion fish are caught illegally": "200 milliards de poissons sont pêchés illégalement",
      "What we're shipping": "Ce que nous expédions",
    },
    es: {
      language: "Español",
      ShipSense: "Mirada de Barco",
      "300 billion fish are caught illegally": "200 mil millones de peces son capturados ilegalmente",
      "What we're shipping": "Lo que estamos enviando",
    },
    ch: {
      language: "中文",
      ShipSense: "船看",
      "Let's get reel...": "让我们真实一点...",
      "300 billion fish are caught illegally": "3000亿条鱼被非法捕获",
      "What we're shipping": "我们正在运输的东西",
    },
  }

  const [ssr, setSsr] = useState(true)
  const router = useRouter()
  const [scrollCounter, setScrollCounter] = useState(0)
  const [showMap, setShowMap] = useState(false)
  const [showAbout, setShowAbout] = useState(false)

  // Add a wheel event listener to the window
  const handleWheel = (e) => {
    if (e.deltaY === 0) {
      return
    }
    setScrollCounter((prev) => prev + (e.deltaY / Math.abs(e.deltaY)) * 25)
  }

  useEffect(() => {
    if (scrollCounter < END_THRESHOLD) {
      setShowMap(true)
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
        <title>ShipSense - Reduce global overfishing</title>
        {/* Add OG title and description */}
        <meta property="og:title" content="ShipSense.AI - Reduce overfishing with computer vision algorithms" />
        <meta
          property="og:description"
          content="Mitigating overfishing through AI-augmented satellite imagery and data viz platform. Novel few-shot synthetic image data augmentation method using fine-tuned Stable Diffusion for any object."
        />
      </Head>
      <Modal size="3xl" isOpen={showAbout} onClose={() => setShowAbout(false)}>
        <ModalOverlay />
        <ModalContent fontSize="sm">
          <ModalHeader>
            <Heading as="h1" fontSize="3xl" textAlign="center">
              Synthetic Data Augmentation with Stable Diffusion
            </Heading>
          </ModalHeader>
          <ModalBody>
            <Text>
              ShipSense is a data visualization platform that uses computer vision algorithms to detect illegal fishing
              activity. We use satellite imagery to detect illegal fishing activity and provide a data visualization platform
              to help governments and NGOs mitigate overfishing.
            </Text>
            <Text mt={4}>
              To train a synthetic image data augmentation method, we use a fine-tuned Stable Diffusion model to generate
              synthetic images of any object. We then use these synthetic images to train a classifier to detect the latitude
              and longitude of a ship, with 97% accuracy.
            </Text>
            <Text mt={4} textAlign="center" fontStyle="italic">
              <ChevronDownIcon />
              The boats below don&apos;t exist. They were generated by our finetuned Stable Diffusion model.
              <ChevronDownIcon />
            </Text>
            <Image mt={4} src="/synthetic.png" />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Box as={motion.div} pos="absolute" top={0} left={0} w="100vw" h="100vh">
        <MapPageContents />
      </Box>

      <AnimatePresence>
        {!showMap && (
          <motion.div
            key="landingPageWrapper"
            transition={{ duration: 1 }}
            initial={{ filter: "brightness(1)" }}
            animate={{ filter: "brightness(1)" }}
            exit={{ filter: "brightness(0)" }}>
            <Box w="100vw" h="100vh" bg="black" color="white">
              {!ssr && (
                <div style={{ justifyContent: "center" }}>
                  <World />
                </div>
              )}
            </Box>
            <Flex
              as={motion.div}
              transition={{ duration: 0 }}
              animate={{ opacity: calculateTextOpacity(scrollCounter) }}
              align="center"
              justify={{ base: "start", md: "center" }}
              textAlign="center"
              direction="column"
              w="100vw"
              pointerEvents="none"
              h="100vh"
              pos="absolute"
              top={0}
              color="white"
              left={0}>
              <Flex mt={10} direction={{ base: "column", md: "row" }} gap={{ base: 2, md: 6 }}>
                {Object.keys(translations).map((lang) => (
                  <Button
                    key={lang}
                    size="lg"
                    pointerEvents={"initial"}
                    textShadow="0px 0px 10px rgba(0,0,0,1)"
                    colorScheme="blackAlpha"
                    color="white"
                    fontSize="3xl"
                    onClick={() => handleLanguageChange(lang)}>
                    {translations[lang].language}
                  </Button>
                ))}
              </Flex>
              <Heading as="h1" fontWeight="900" fontSize={{ base: "4em", md: "10em" }} textAlign="center">
                {translations[language].ShipSense}
              </Heading>
              <Heading
                as="h2"
                fontWeight="400"
                fontFamily="body"
                justifyContent="center"
                textAlign="center"
                fontSize={{ base: "3xl", md: "5xl" }}
                textShadow="0px 0px 10px rgba(0,0,0,1)"
                minH={{ base: "3em", md: "2em" }}
                display="block">
                <CustomTypewriterEffect
                  key={language}
                  strings={[
                    translations[language]["300 billion fish are caught illegally"],
                    translations[language]["What we're shipping"],
                  ]}
                  emojis={["🎣", "🐠", "🚢"]}
                  typeSpeed={40}
                  pauseDelay={1250}
                  overallIterations={10}
                />
              </Heading>
              <Flex gap={2} direction={{ base: "column", md: "row" }} mt={10}>
                <Button size="lg" pointerEvents="initial" colorScheme="purple" onClick={() => setShowMap(true)}>
                  Get Started
                </Button>
                <Button
                  size="lg"
                  pointerEvents="initial"
                  colorScheme="gray"
                  color="black"
                  onClick={() => setShowAbout(true)}>
                  Synthetic Data Augmentation
                </Button>
              </Flex>

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
                animate={{ backgroundColor: showMap ? "#000000FF" : "#00000000" }}
                transition={{ duration: 0.5 }}></motion.div>
            </Flex>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default function DataWrapper(props) {
  return (
    <DataProvider {...props}>
      <Home />
    </DataProvider>
  )
}

export const getStaticProps = async () => {
  let hotspots = require("../../assets/hotspots.json")
  let images = require("fs").readdirSync("./public/images/")

  return {
    props: {
      hotspots,
      images,
    },
  }
}
