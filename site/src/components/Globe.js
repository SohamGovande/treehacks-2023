import React, { useState, useEffect, useMemo } from 'react'
import ReactDOM from 'react-dom'
import Globe from 'react-globe.gl'
import countries from '../files/custom.geo.json'
import { useToken } from '@chakra-ui/react'

const color = 'purple'

const World = () => {
  const gradient = [...Array(10).keys()].map((i) => {
    if (i == 0) {
      return useToken('colors', color + '.50')
    }
    return useToken('colors', color + `.${i}00`)
  })

  const [cablePaths, setCablePaths] = useState([])

  const N = 300
  const gData = [...Array(N).keys()].map(() => ({
    lat: (Math.random() - 0.5) * 180,
    lng: (Math.random() - 0.5) * 360,
    size: Math.random() / 3,
    color: ['red'],
  }))

  useEffect(() => {
    // from https://www.submarinecablemap.com
    console.log('fetching cables...')
    fetch(
      '//api.allorigins.win/get?url=https://www.submarinecablemap.com/api/v3/cable/cable-geo.json',
    )
      .then((r) => r.json().then((d) => JSON.parse(d.contents)))
      .then((cablesGeo) => {
        let cablePaths = []
        cablesGeo.features.forEach(({ geometry, properties }) => {
          geometry.coordinates.forEach((coords) =>
            cablePaths.push({ coords, properties }),
          )
        })
        console.log('loaded cables')
        setCablePaths(cablePaths)
      })
  }, [])

  const [pathPointAlt, setPathPointAlt] = useState(0.01)

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
          pathColor={() => 'rgba(137, 196, 244, 1)'}
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
        document.getElementById('globeViz'),
      )
    }
    renderGlobe()
  }, [countries, cablePaths])

  return <div id="globeViz"></div>
}

export default World
