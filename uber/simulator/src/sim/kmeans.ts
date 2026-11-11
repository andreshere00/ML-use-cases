// Algoritmo 2 · Clustering: k-means paso a paso (asignar al centro más cercano, mover centros).

export type Point = [number, number]

export interface KMeansResult {
  assignments: number[]
  centers: Point[]
  iterations: number
}

const dist2 = (a: Point, b: Point) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2

export function kmeans(points: Point[], initialCenters: Point[], maxIterations = 20): KMeansResult {
  let centers = initialCenters.map((c) => [...c] as Point)
  let previous: number[] | null = null
  for (let iteration = 1; iteration <= maxIterations; iteration++) {
    const assignments = points.map((p) => {
      let best = 0
      centers.forEach((c, k) => {
        if (dist2(p, c) < dist2(p, centers[best])) best = k
      })
      return best
    })
    if (previous && assignments.every((a, i) => a === previous![i])) {
      return { assignments, centers, iterations: iteration }
    }
    centers = centers.map((c, k) => {
      const members = points.filter((_, i) => assignments[i] === k)
      if (!members.length) return c
      return [
        members.reduce((s, p) => s + p[0], 0) / members.length,
        members.reduce((s, p) => s + p[1], 0) / members.length,
      ]
    })
    previous = assignments
  }
  return { assignments: previous ?? [], centers, iterations: maxIterations }
}
