import { clusterize } from 'node-kmeans'
import { promisify } from 'util'

const kmeansAsync = promisify(clusterize)

export default kmeansAsync