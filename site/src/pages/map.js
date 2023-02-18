import { Box, useToken, chakra, Flex, Heading, UnorderedList, ListItem, Text, Button, ButtonGroup, IconButton } from "@chakra-ui/react"
import Head from "next/head"
import { lazy, useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CloseIcon, LinkIcon } from "@chakra-ui/icons"

const LazyMap = lazy(() => import("@/components/ReactMap"))

const white = "white"
const gray = "#f1f1f1"
const gradient = `linear-gradient(to bottom right, ${white}, ${gray}, ${white}, ${gray}, ${white}, ${gray})`

const Sidebar = ({ dashboardId, setDashboardId }) => {
  return (
    <AnimatePresence exitBeforeEnter>
      {dashboardId !== -1 && (
        <motion.div
          transition={{
            ease: 'easeInOut'
          }}
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "40%",
            background: gradient
          }}>
            <IconButton position="absolute" top={4} right={4} aria-label="Close" icon={<CloseIcon />} onClick={() => setDashboardId(-1)} />
          <Box p={10} fontSize="xl">
            <Heading as="h1">Hotspot #{dashboardId}</Heading>
            <Text mt={4}>
              Centered at <b>40.7128° N, 74.0060° W</b>
            </Text>
            <UnorderedList fontSize="xl" mt={4}>
              <ListItem>
                <b>Tracked data from dates:</b>&nbsp;2021-01-01 to 2021-01-31
              </ListItem>
              <ListItem>
                <b>Estimated amount of wildlife loss:</b>&nbsp;1,500 fish
              </ListItem>
              <ListItem>
                <b>Fish species threatened:</b>&nbsp;Salmon, Cod, Herring
              </ListItem>
            </UnorderedList>
            <Heading as='h2' mt={4}>
              Raw Data Points
            </Heading>
            [insert images here]
            <Flex gap={2}>
              <Button mt={4} colorScheme="blue" variant="solid" leftIcon={<LinkIcon />} onClick={() => onExport(id)}>
                Export Report to Law Enforcement
              </Button>
            </Flex>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const VignetteEffect = ({ to }) => {
  const white = useToken("colors", "blackAlpha.500")
  const size = 15
  return (
    <chakra.div
      pointerEvents='none'
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bgGradient={`linear(to ${to}, transparent ${100-size}%, ${white} 100%)`}
    />
  )
}

export default function MapPage() {
  const [dashboardId, setDashboardId] = useState(-1)
  const [ssr, setSsr] = useState(true)

  const onExport = (id) => {
    // TODO
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSsr(false)
    }
  }, [])

  return (
    <>
      <Head>
        <title>ShipSight Realtime Map</title>
      </Head>
      <Box w="100vw" h="100vh" bg={gradient}>
        {!ssr && <LazyMap onViewDashboard={setDashboardId} />}
      </Box>
      <VignetteEffect to='bottom' />
      <VignetteEffect to='top' />
      <VignetteEffect to='left' />
      <VignetteEffect to='right' />
      <Sidebar dashboardId={dashboardId} setDashboardId={setDashboardId} />
    </>
  )
}
