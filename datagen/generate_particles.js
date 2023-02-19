import fs from 'fs'

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

const generatePointsAlongLineSegment = (long1, lat1, long2, lat2, range, n) => {
  // We have two x, y coordinates
  // We want to generate n points along the line segment
  const points = []
  for (let i = 0; i < n; i++) {
    const rand = Math.random()
    let x = rand * (long2 - long1) + long1
    let y = rand * (lat2 - lat1) + lat1
    // Use the range to displace the point
    x += Math.random() * range - range / 2
    y += Math.random() * range - range / 2
    points.push([x, y])
  }
  return points
}

const points = [
  generateRandomPoints(25, 1, 115.559972, 19.769252), // South China Sea
  generatePointsAlongLineSegment(133.468291, 31.588839, 138.196287, 33.395718, 2, 25), // Japan
  generatePointsAlongLineSegment(82.220281, 15.287175, 89.609016, 20.950289, 0.8, 50) // Bay of Bengal
].flat()

fs.writeFileSync('/Users/sohamgovande/Documents/code/treehacks-2023/site/assets/detections.json', JSON.stringify(points, null, 2))