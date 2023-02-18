import { loadModules } from "esri-loader"
import { Map, WebMap } from "@esri/react-arcgis"
import { useEffect, useMemo, useRef, useState } from "react"
import convexhull from "@/utils/convexhull"
import kmeansAsync from "@/utils/kmeans"

const generateRandomPoints = (n, maxRadius, long, lat) => {
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

const generateConvexHillPolygonRings = (points) => {
  const pointsXY = points.map((p) => ({ x: p[0], y: p[1] }))
  const hull = convexhull.makeHull(pointsXY)
  const rings = []
  for (let i = 0; i < hull.length; i++) {
    rings.push([hull[i].x, hull[i].y])
  }
  rings.push([hull[0].x, hull[0].y])

  // "Scale up" the rings by finding their mean and then adding 10% of the distance from the mean to each point
  const meanX = rings.reduce((a, b) => a + b[0], 0) / rings.length
  const meanY = rings.reduce((a, b) => a + b[1], 0) / rings.length
  const paddingMultiplier = 0
  const scaledRings = rings.map((p) => [
    p[0] + (p[0] - meanX) * paddingMultiplier,
    p[1] + (p[1] - meanY) * paddingMultiplier,
  ])

  return scaledRings
}

const HotspotPolygon = ({ points, id, view, onViewDashboard }) => {
  const rings = useMemo(() => generateConvexHillPolygonRings(points), [points])
  const [gfx, setGfx] = useState([])
  // console.log(rings)

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

const cluster = generateRandomPoints(100, 10, -64.78, 32.3)

export default function ReactMap({ onViewDashboard }) {
  const [clusters, setClusters] = useState([])
  const onLoad = async () => {}

  const createClusters = async () => {
    const results = await kmeansAsync(cluster, {
      k: 3,
    })
    setClusters(results.map(result => result.cluster))
  }

  useEffect(() => {
    createClusters()
  }, [])

  return (
    <Map mapProperties={{ basemap: "satellite" }} onLoad={onLoad}>
      {clusters.map((cluster, i) => (
        <HotspotPolygon key={i} id={i + 1} points={cluster} onViewDashboard={onViewDashboard} />
      ))}
    </Map>

  )
}