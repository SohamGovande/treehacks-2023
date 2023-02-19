import React, { useState, useEffect, useMemo, useRef } from "react"
import ReactDOM from "react-dom"
import Globe from "react-globe.gl"
import countries from "../files/custom.geo.json"
import { useToken } from "@chakra-ui/react"
import cablesGeo from "@/utils/cablegeo.json"

const color = "purple"

const World = () => {
  const gradient = [...Array(10).keys()].map((i) => {
    if (i == 0) {
      return useToken("colors", color + ".50")
    }
    return useToken("colors", color + `.${i}00`)
  })

  const [cablePaths, setCablePaths] = useState([])

  const N = 300

  useEffect(() => {
    // from https://www.submarinecablemap.com
    let cablePaths = []
    cablesGeo.features.forEach(({ geometry, properties }) => {
      geometry.coordinates.forEach((coords) => cablePaths.push({ coords, properties }))
    })
    setCablePaths(cablePaths)
  }, [])

  const globeRef = useRef()
  const [counter, setCounter] = useState(0)
  const [key, setKey] = useState(0)

  useEffect(() => {
    // Check if the key R is pressed, if so, reset the globe
    const handleKeyDown = (e) => {
      if (e.key === "r") {
        setKey(i => i + 1)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    const renderGlobe = () => {
      ReactDOM.render(
        <Globe
          //   pointsData={gData}
          //   pointAltitude={0}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          pathsData={cablePaths}
          pathPoints="coords"
          pathPointLat={(p) => p[1]}
          pathPointLng={(p) => p[0]}
          pathColor={() => "rgba(137, 196, 244, 1)"}
          pathPointAlt={0.01}
          pathDashLength={0.1}
          pathDashGap={0.008}
          pathDashAnimateTime={12000}
          hexPolygonsData={countries.features}
          hexPolygonResolution={3}
          hexPolygonMargin={0.3}
          animateIn={true}
          hexPolygonColor={() => gradient[Math.floor(Math.random() * 10)]}
        />,
        document.getElementById("globeViz")
      )
    }
    renderGlobe()
  }, [countries, cablePaths, key])

  return <div key={key} id="globeViz" ref={globeRef}></div>
}

export default World
