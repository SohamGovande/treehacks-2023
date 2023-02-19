import { loadModules } from "esri-loader"
import { Map, WebMap } from "@esri/react-arcgis"
import { useEffect, useMemo, useRef, useState } from "react"
import convexhull from "@/utils/convexhull"
import kmeansAsync from "@/utils/kmeans"
import { useData } from "@/contexts/DataContext"

const INITIAL_WINDOW_LOCATION = [114.4048, 15.4881]

const generateConvexHillPolygonRings = (points) => {
  const pointsXY = points.map((p) => ({ x: p.long, y: p.lat }))
  const hull = convexhull.makeHull(pointsXY)
  const rings = []
  for (let i = 0; i < hull.length; i++) {
    rings.push([hull[i].x, hull[i].y])
  }
  rings.push([hull[0].x, hull[0].y])

  // "Scale up" the rings by finding their mean and then adding 10% of the distance from the mean to each point
  const meanX = rings.reduce((a, b) => a + b[0], 0) / rings.length
  const meanY = rings.reduce((a, b) => a + b[1], 0) / rings.length
  const paddingMultiplier = 0.2
  const scaledRings = rings.map((p) => [
    p[0] + (p[0] - meanX) * paddingMultiplier,
    p[1] + (p[1] - meanY) * paddingMultiplier,
  ])

  return scaledRings
}

const createCircle = (point, radius) => {
  const points = []
  // Go around the circle in 10 degree increments and add the points to the array
  const increment = 10
  for (let i = 0; i <= 360; i += increment) {
    const angle = (i * Math.PI) / 180
    points.push([point[0] + radius * Math.cos(angle), point[1] + radius * Math.sin(angle)])
  }
  return
}

const HotspotPolygon = ({ boats, id, view, outlineColor, transparentColor, onViewDashboard }) => {
  const rings = useMemo(() => generateConvexHillPolygonRings(boats), [boats])
  const [gfx, setGfx] = useState([])
  const [n, setN] = useState(0)

  const addGraphics = (Graphic, Circle) => {
    if (n > 20) {
      return
    }
    setN((i) => i + 1)
    for (const graphic of gfx) {
      view.graphics.remove(graphic)
      setGfx((gfx) => [])
    }

    // Create a polygon geometry
    const polygon = {
      type: "polygon", // autocasts as new Polygon()
      rings: rings,
    }

    // Create a symbol for rendering the graphic
    const fillSymbol = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: transparentColor,
      outline: {
        // autocasts as new SimpleLineSymbol()
        color: outlineColor,
        width: 1,
      },
    }
    const graphic = new Graphic({
      geometry: polygon,
      symbol: fillSymbol,
      popupTemplate: {
        id: id,
        title: `Hotspot #${id}`,
        content: "See the dashboard on the right for more information!",
      },
    })

    // watch for changes to the selectedFeature
    view.popup.watch("selectedFeature", (clickedGraphic) => {
      if (clickedGraphic == graphic) {
        onViewDashboard(id)
      }
    })

    setGfx((gfx) => [...gfx, graphic])
    view.graphics.add(graphic)

    // Add points for each of the locations
    for (const boat of boats) {
      const circleGeometry = new Circle({
        center: [boat.long, boat.lat],
        geodesic: true,
        numberOfPoints: 100,
        radius: 2,
        radiusUnit: "kilometers",
      })

      const graphic = new Graphic({
        geometry: circleGeometry,
        symbol: {
          type: "simple-fill",
          style: "none",
          outline: {
            width: 2,
            color: outlineColor,
          },
        },
      })

      setGfx((gfx) => [...gfx, graphic])
      view.graphics.add(graphic)
    }
  }

  useEffect(() => {
    loadModules(["esri/Graphic", "esri/geometry/Circle"])
      .then(([Graphic, Circle]) => {
        addGraphics(Graphic, Circle)
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

export default function ReactMap({ onViewDashboard }) {
  let { hotspots } = useData()
  const onLoad = async () => {}

  return (
    <Map
      mapProperties={{
        basemap: "satellite",
      }}
      viewProperties={{
        center: INITIAL_WINDOW_LOCATION,
        zoom: 5,
      }}
      onLoad={onLoad}>
      {hotspots.map((data, i) => (
        <HotspotPolygon key={i} id={i + 1} {...data} onViewDashboard={onViewDashboard} />
      ))}
    </Map>
  )
}
