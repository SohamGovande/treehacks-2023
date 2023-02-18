import { loadModules } from "esri-loader"
import { Map, WebMap } from "@esri/react-arcgis"
import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

function getStandardDeviation(array) {
  const n = array.length
  const mean = array.reduce((a, b) => a + b) / n
  return Math.sqrt(array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

const generateRings = (points) => {
  const paddingMultiplier = 1
  const paddingX = getStandardDeviation(points.map((p) => p[0])) * paddingMultiplier
  const paddingY = getStandardDeviation(points.map((p) => p[1])) * paddingMultiplier
  // Find the minimum x and y values, and the maximum x and y values
  const minX = Math.min(...points.map((p) => p[0])) - paddingX
  const minY = Math.min(...points.map((p) => p[1])) - paddingY
  const maxX = Math.max(...points.map((p) => p[0])) + paddingX
  const maxY = Math.max(...points.map((p) => p[1])) + paddingY
  // Return a rectangle that is 10% larger than the minimum and maximum x and y values
  return [
    [minX, minY],
    [maxX, minY],
    [maxX, maxY],
    [minX, maxY],
    [minX, minY],
  ]
}

const genernatePointCluster = (n, maxRadius, long, lat) => {
  const cluster = []
  for (let i = 0; i < n; i++) {
    // Generate a random angle between 0 and 2π
    const angle = Math.random() * 2 * Math.PI
    // Generate a random radius between 0 and the radius
    const radius = Math.random() * maxRadius
    const x = long + radius * Math.cos(angle)
    const y = lat + radius * Math.sin(angle)
    cluster.push([x, y])
  }
  return cluster
}

const HotspotPolygon = ({ points, id, view, onViewDashboard }) => {
  const rings = useMemo(() => generateRings(points), [points])

  // console.log(rings)

  const [gfx, setGfx] = useState([])
  useEffect(() => {
    loadModules(["esri/Graphic"])
      .then(([Graphic]) => {
        // Create a polygon geometry
        const polygon = {
          type: "polygon", // autocasts as new Polygon()
          rings: rings,
        }

        // Create a symbol for rendering the graphic
        const fillSymbol = {
          type: "simple-fill", // autocasts as new SimpleFillSymbol()
          color: [200, 0, 0, 0.2],
          outline: {
            // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: 1,
          },
        }

        // Add points for each of the locations
        for (const point of points) {
          const graphic = new Graphic({
            geometry: {
              type: "point", // autocasts as new Point()
              longitude: point[0],
              latitude: point[1],
            },
            symbol: {
              type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
              color: [255, 255, 255],
              outline: {
                // autocasts as new SimpleLineSymbol()
                color: [0, 0, 0],
                width: 1,
              },
            },
          })
          setGfx([...gfx, graphic])
          view.graphics.add(graphic)
        }

        // watch for changes to the selectedFeature
        view.popup.watch("selectedFeature", (graphic) => {
          if (graphic) {
            onViewDashboard(id)
          }
        })

        // Add the geometry and symbol to a new graphic
        const graphic = new Graphic({
          geometry: polygon,
          symbol: fillSymbol,
          popupTemplate: {
            id: id,
            title: `Hotspot #${id}`,
            content: "See the dashboard on the right for more information!",
          },
        })

        setGfx([...gfx, graphic])
        view.graphics.add(graphic)
      })
      .catch((err) => console.error(err))

    return function cleanup() {
      for (const graphic of gfx) {
        view.graphics.remove(graphic)
      }
    }
  }, [gfx])

  return null
}

const cluster = genernatePointCluster(5, 2, -64.78, 32.3)

export default function ReactMap({ onViewDashboard }) {
  const onLoad = async () => {}
  return (
    <Map mapProperties={{ basemap: "satellite" }} onLoad={onLoad}>
      <HotspotPolygon id={1} points={cluster} onViewDashboard={onViewDashboard} />
    </Map>
  )
}
