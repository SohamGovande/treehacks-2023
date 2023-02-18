import { loadModules } from "esri-loader"
import { Map, WebMap } from "@esri/react-arcgis"
import { useEffect, useMemo, useRef, useState } from "react"

const generateRings = (points) => {
  // Find the minimum x and y values, and the maximum x and y values
  const minX = Math.min(...points.map((p) => p[0]))
  const minY = Math.min(...points.map((p) => p[1]))
  const maxX = Math.max(...points.map((p) => p[0]))
  const maxY = Math.max(...points.map((p) => p[1]))
  console.log({
    minX,
    minY,
    maxX,
    maxY,
  })
  // Return a rectangle that is 10% larger than the minimum and maximum x and y values
  return [
    [minX, minY],
    [maxX, minY],
    [maxX, maxY],
    [minX, maxY],
    [minX, minY],
  ]
}

const genernatePointCluster = (n, radius, long, lat) => {
  const cluster = []
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * 2 * Math.PI
    const x = long + radius * Math.cos(angle)
    const y = lat + radius * Math.sin(angle)
    cluster.push([x, y])
  }
  return cluster
}

const HotspotPolygon = (props) => {
  const { points } = props
  const rings = useMemo(() => generateRings(points), [points])

  // console.log(rings)

  const [graphic, setGraphic] = useState(null)
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

        // Add the geometry and symbol to a new graphic
        const graphic = new Graphic({
          geometry: polygon,
          symbol: fillSymbol,
          popupTemplate: {
            title: "Bermuda Triangle",
            content: "This is the Bermuda Triangle",
          },
        })
        setGraphic(graphic)
        props.view.graphics.add(graphic)
      })
      .catch((err) => console.error(err))

    return function cleanup() {
      props.view.graphics.remove(graphic)
    }
  }, [graphic])

  return null
}

const cluster = genernatePointCluster(5, 2, -64.78, 32.3)

export default function ReactMap() {
  const onLoad = async () => {}

  return (
    <Map mapProperties={{ basemap: "satellite" }} onLoad={onLoad}>
      <HotspotPolygon points={cluster} />
    </Map>
  )
}
