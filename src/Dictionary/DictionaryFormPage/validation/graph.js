// used to build a graph for findDirectedCycle method
export function buildDirectedGraph (entries) {
  const graph = entries.reduce((graph, entry) => {
    const { domain, range } = entry
    if (graph[domain]) {
      let ranges = graph[domain]
      graph[domain] = [...ranges, range]
    } else {
      graph[domain] = [range]
    }
    return graph
  }, {})

  return graph
}
