import fs from 'fs'

const boats = JSON.parse(
  fs.readFileSync(
    '/Users/sohamgovande/Documents/code/treehacks-2023/datagen/boatclustersdata.json',
    'utf8',
  ),
)
const geographies = JSON.parse(
  fs.readFileSync(
    '/Users/sohamgovande/Documents/code/treehacks-2023/site/assets/geographies.json',
    'utf8',
  ),
)

const nClusters = Math.max(...boats.map((c) => c.cluster)) + 1
const clusters = Array(nClusters)
  .fill(0)
  .map(() => ({
    boats: [],
  }))

for (const boat of boats) {
  const relevant = {
    long: boat.gap_start_lon,
    lat: boat.gap_start_lat,
    tons_fish: boat.vessel_tonnage_gt * 0.25,
    time: boat.gap_start_timestamp,
  }
  clusters[boat.cluster].boats.push(relevant)
}

for (let i = 0; i < clusters.length; i++) {
  const cluster = clusters[i]
  // Find the minimum time and maximum time in the cluster
  let minTime = Math.min(...cluster.boats.map((b) => b.time))
  let d = new Date(0) // The 0 there is the key, which sets the date to the epoch
  d.setUTCSeconds(minTime / 1000)
  minTime = d.toLocaleDateString()

  let maxTime = Math.max(...cluster.boats.map((b) => b.time))
  d = new Date(0) // The 0 there is the key, which sets the date to the epoch
  d.setUTCSeconds(maxTime / 1000)
  maxTime = d.toLocaleDateString()
  // Sum the tons_fish value
  const totalTonsLost = cluster.boats.reduce((a, b) => a + b.tons_fish, 0)
  // Find the geography object with the closest distance (latitude and longitude) using Euclidean distance
  const closest = geographies.reduce((a, b) => {
    const distA = Math.sqrt(
      (a.lat - cluster.boats[0].lat) ** 2 +
        (a.long - cluster.boats[0].long) ** 2,
    )
    const distB = Math.sqrt(
      (b.lat - cluster.boats[0].lat) ** 2 +
        (b.long - cluster.boats[0].long) ** 2,
    )
    return distA < distB ? a : b
  })
  const { fish, title } = closest

  clusters[i] = { ...cluster, minTime, maxTime, totalTonsLost, fish, title, long: closest.long, lat: closest.lat }
}

// Sort clusters by totalTonsLost
clusters.sort((a, b) => b.boats.length - a.boats.length)

// Sum of total boats in all clusters
const totalBoats = clusters.reduce((a, b) => a + b.boats.length, 0)
const nImages = 500

// Assign each cluster a number of images, proportional to the number of boats in the cluster
for (let i = 0; i < clusters.length; i++) {
  const cluster = clusters[i]
  const n = Math.round((cluster.boats.length / totalBoats) * nImages)
  const imagePaths = []
  for (let j = 0; j < n; j++) {
    imagePaths.push(`images/${n}.jpg`)
  }
  clusters[i] = { ...cluster, imagePaths }
}

// Create a gradient effect between any two colors and a given progress value
const g1 = (color1, color2, alpha, progress) => {
  const r = color1[0] + (color2[0] - color1[0]) * progress
  const g = color1[1] + (color2[1] - color1[1]) * progress
  const b = color1[2] + (color2[2] - color1[2]) * progress
  return [r, g, b]
}

const g2 = (color1, color2, alpha, n) => {
  const arr = []
  for (let i = 0; i < n; i++) {
    arr.push(g1(color1, color2, alpha, i / n))
  }
  return arr
}

const ytr = g2([255, 255, 0], [200, 0, 0], 1, clusters.length)
for (let i = 0; i < clusters.length; i++) {
  clusters[i].outlineColor = [...ytr[i], 1]
  clusters[i].transparentColor = [...ytr[i], 0.5]
}

fs.writeFileSync(
  '/Users/sohamgovande/Documents/code/treehacks-2023/site/assets/hotspots.json',
  JSON.stringify(clusters),
)

let ddd = false
