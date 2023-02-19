import {
  Box,
  useToken,
  chakra,
  Flex,
  Heading,
  UnorderedList,
  ListItem,
  Text,
  Button,
  ButtonGroup,
  IconButton,
  OrderedList,
} from "@chakra-ui/react"
import Head from "next/head"
import { lazy, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CloseIcon, LinkIcon } from "@chakra-ui/icons"
import { Gradient } from "@/utils/gradient"
import { useData } from "@/contexts/DataContext"

const LazyMap = lazy(() => import('@/components/ReactMap'))

const white = 'white'
const gray = '#f1f1f1'
const gradient = `linear-gradient(to bottom right, ${white}, ${gray}, ${white}, ${gray}, ${white}, ${gray})`

// Recursively iterate through an element's children
const iterateChildren = (element, callback) => {
  callback(element)
  if (element.children) {
    for (let i = 0; i < element.children.length; i++) {
      iterateChildren(element.children[i], callback)
    }
  }
}

function exportToPdf() {
  const element = document.getElementById('pdf-container')
  iterateChildren(element, (child) => {
    child.style.color = 'black'
  })
  html2canvas(element).then((canvas) => {
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF()
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth() - 20
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
    pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight)
    pdf.save('document.pdf')
  })
  iterateChildren(element, (child) => {
    child.style.color = 'white'
  })
}

const formatCoordinate = (coord, pos, neg) => {
  const direction = coord > 0 ? pos : neg
  return `${Math.abs(coord).toFixed(3)}° ${direction}`
}

const Sidebar = ({ dashboardId, setDashboardId }) => {
  const canvasRef = useRef(null)

  const { hotspots } = useData()
  useEffect(() => {
    const gradient = new Gradient()
    gradient.initGradient("#gradient-canvas")
  }, [])

  const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-100%" },
  }

  const variant = dashboardId === -1 ? "closed" : "open"
  const curHotspot = hotspots[dashboardId - 1]

  console.log(dashboardId)

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        transition={{
          ease: "easeInOut",
        }}
        variants={variants}
        animate={variant}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: "40%",
          color: "white",
          boxShadow: "10px 0px 30px rgba(0,0,0,0.75)",
        }}>
        <Box pos="absolute" top={0} left={0} w="100%" h="100%" zIndex={-2}>
          <canvas ref={canvasRef} id="gradient-canvas" />
        </Box>

        <IconButton
          position="absolute"
          top={10}
          right={8}
          variant="unstyled"
          aria-label="Close"
          icon={<CloseIcon />}
          onClick={() => setDashboardId(-1)}
        />
        {!!curHotspot && (
          <Box
            p={10}
            fontSize="xl"
            textShadow='0px 0px 20px rgba(0,0,0,0.5)'
            sx={{
              "> p": { mt: 4 },
            }}>
            <Heading as="h1">{curHotspot.title}</Heading>
            <Text>📡 Data from {curHotspot.boats.length} satellite ship photographs</Text>
            <Text>
              📍 Centered at{" "}
              <b>
                {formatCoordinate(curHotspot.long, "N", "S")},&nbsp;{formatCoordinate(curHotspot.lat, "E", "W")}
              </b>
            </Text>
            <Text>
              📆 Data from <b>{curHotspot.minTime}</b> to <b>{curHotspot.maxTime}</b>
            </Text>
            <Text>
              🐟 Estimate <b>{curHotspot.totalTonsLost.toFixed(1)} tons</b> of fish lost in this area, including:
            </Text>
            <UnorderedList>
              {curHotspot.fish.map((fish, i) => {
                if (i > 2) return null
                else return <ListItem key={i}>{fish}</ListItem>
              })}
            </UnorderedList>
            <Heading as="h2" mt={4}>
              Raw Data Points
            </Heading>
            [insert images here]
            <Flex gap={2}>
              <Button
                mt={4}
                colorScheme="blue"
                variant="solid"
                leftIcon={<LinkIcon />}
                onClick={() => exportToPdf()}
              >
                Export Report to Coast Guard
              </Button>
            </Flex>
          </Box>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

const VignetteEffect = ({ to }) => {
  const white = useToken('colors', 'blackAlpha.600')
  const size = 15
  return (
    <chakra.div
      pointerEvents="none"
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bgGradient={`linear(to ${to}, transparent ${100 - size}%, ${white} 100%)`}
    />
  )
}

export default function MapPageContents() {
  const [dashboardId, setDashboardId] = useState(-1)
  const [ssr, setSsr] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSsr(false)
    }
  }, [])

  return (
    <>
      <Box w="100vw" h="100vh" bg={gradient}>
        {!ssr && <LazyMap onViewDashboard={setDashboardId} />}
      </Box>
      <VignetteEffect to="bottom" />
      <VignetteEffect to="top" />
      <VignetteEffect to="left" />
      <VignetteEffect to="right" />
      <Sidebar dashboardId={dashboardId} setDashboardId={setDashboardId} />
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
        initial={{ backgroundColor: '#000000ff' }}
        animate={{ backgroundColor: '#00000000' }}
        transition={{ delay: 1.5, duration: 1 }}
      />
    </>
  )
}
