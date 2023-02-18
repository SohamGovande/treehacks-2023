import { Box, useToken, chakra, Flex } from "@chakra-ui/react"
import Head from "next/head"
import { useEffect } from "react"
import fs from "fs"
import data from "@/utils/data.json"

export default function MapPage({ html }) {
  const white = "white"
  const gray = useToken("colors", "gray.200")

  return (
    <>
      <Head>
        <title>ShipSight Realtime Map</title>
      </Head>
      <Box
        w="100vw"
        h="100vh"
        bg={`linear-gradient(to bottom right, ${white}, ${gray}, ${white}, ${gray}, ${white}, ${gray})`}>
        {/* Create an iframe with the html */}
        <Flex direction='row' align='stretch' h='100%' p={10}>
          <Box flex={1} transform='translateY(0px)'>
            <iframe src={html} width="100%" height="100%" frameBorder={0} style={{ borderRadius: '20px' }} />
          </Box>
          <Box flex={1}>

          </Box>
        </Flex>
      </Box>
    </>
  )
}

export const getStaticProps = async () => {
  // Read the file assets/map.html from the root
  const buffer = fs.readFileSync(`${process.cwd()}/assets/map.html`)
  // Convert buffer to string
  let modified = buffer.toString()
  for (const [key, value] of Object.entries(data.htmlVariables)) {
    modified = modified.replace(key, JSON.stringify(value))
  }
  // Convert string to base64
  const base64 = btoa(modified)
  const html = `data:text/html;base64,${base64}`
  return {
    props: {
      html,
    },
  }
}