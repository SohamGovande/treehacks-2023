const convexhull = {}

function makeHull(points) {
  let newPoints = points.slice()
  newPoints.sort(convexhull.POINT_COMPARATOR)
  return convexhull.makeHullPresorted(newPoints)
}

function makeHullPresorted(points) {
  if (points.length <= 1) return points.slice()
  let upperHull = []
  for (let i = 0; i < points.length; i++) {
    const p = points[i]
    while (upperHull.length >= 2) {
      const q = upperHull[upperHull.length - 1]
      const r = upperHull[upperHull.length - 2]
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) upperHull.pop()
      else break
    }
    upperHull.push(p)
  }
  upperHull.pop()
  let lowerHull = []
  for (let i = points.length - 1; i >= 0; i--) {
    const p = points[i]
    while (lowerHull.length >= 2) {
      const q = lowerHull[lowerHull.length - 1]
      const r = lowerHull[lowerHull.length - 2]
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) lowerHull.pop()
      else break
    }
    lowerHull.push(p)
  }
  lowerHull.pop()
  if (upperHull.length == 1 && lowerHull.length == 1 && upperHull[0].x == lowerHull[0].x && upperHull[0].y == lowerHull[0].y)
    return upperHull
  else return upperHull.concat(lowerHull)
}

function POINT_COMPARATOR(a, b) {
  if (a.x < b.x) return -1
  else if (a.x > b.x) return +1
  else if (a.y < b.y) return -1
  else if (a.y > b.y) return +1
  else return 0
}

convexhull.makeHull = makeHull
convexhull.makeHullPresorted = makeHullPresorted
convexhull.POINT_COMPARATOR = POINT_COMPARATOR

export default convexhull