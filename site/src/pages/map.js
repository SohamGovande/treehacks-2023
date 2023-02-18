import { Box, useToken, chakra, Flex, Heading, UnorderedList, ListItem, Text, Button, ButtonGroup } from "@chakra-ui/react"
import Head from "next/head"
import { lazy, useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CloseIcon, LinkIcon } from "@chakra-ui/icons"

const LazyMap = lazy(() => import("@/components/ReactMap"))

export default function MapPage({ html }) {
  const white = "white"
  const gray = useToken("colors", "gray.200")
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
      <Box
        w="100vw"
        h="100vh"
        bg={`linear-gradient(to bottom right, ${white}, ${gray}, ${white}, ${gray}, ${white}, ${gray})`}
      >
        <Flex direction="row" align="stretch" h="100%" p={10}>
          <Box flex={1} borderRadius="xl">
            {!ssr && <LazyMap onViewDashboard={setDashboardId} />}
          </Box>
          <AnimatePresence exitBeforeEnter>
            {dashboardId !== -1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1 }}>
                <Box px={10} fontSize='xl'>
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
                  <Flex gap={2}>
                  <Button mt={4} colorScheme="blue" variant='solid' leftIcon={<LinkIcon />} onClick={() => onExport(id)}>
                    Export Report to Law Enforcement
                  </Button>
                  <Button mt={4} variant='outline' leftIcon={<CloseIcon color='gray' />} onClick={() => setDashboardId(-1)}>
                    Close
                  </Button>
                  </Flex>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Flex>
      </Box>
    </>
  )
}
