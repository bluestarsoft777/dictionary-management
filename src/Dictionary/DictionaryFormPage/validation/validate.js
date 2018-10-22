import { buildDirectedGraph } from './graph'
import findDirectedCycle from 'find-cycle/directed'

export function checkConsistency (entries) {
  return {
    duplicates: findDuplicates(entries),
    forks: findForks(entries),
    chains: findChains(entries),
    cycles: findCycles(entries)
  }
}

export function findCycles (entries) {
  const graph = buildDirectedGraph(entries)
  const startNodes = Object.keys(graph)
  const getConnectedNodes = node => graph[node]
  const cycles = findDirectedCycle(startNodes, getConnectedNodes)

  if (!cycles || cycles.length === 0) return []

  const [domain, range] = cycles
  const cycleEntry = entries.filter(entry =>
    entry.domain === domain && entry.range === range
  )
    .map(entry => entry._id)

  return cycleEntry
}

export function findDuplicates (entries) {
  const potentialDuplicates = entries.reduce((duplicateMap, entry) => {
    const key = `${entry.domain}-${entry.range}`
    if (duplicateMap.has(key)) {
      const ids = duplicateMap.get(key)
      duplicateMap.set(key, [...ids, entry._id])
    } else {
      duplicateMap.set(key, [entry._id])
    }

    return duplicateMap
  }, new Map())

  const duplicateSet = Array.from(potentialDuplicates).reduce((duplicates, [key, ids]) => {
    if (ids.length > 1) {
      ids.forEach(id => duplicates.add(id))
    }
    return duplicates
  }, new Set())

  return Array.from(duplicateSet.values())
}

export function findForks (entries) {
  const potentialForks = entries.reduce((forkMap, entry) => {
    const { domain, range } = entry

    if (forkMap.has(domain)) {
      const { ids, ranges } = forkMap.get(domain)
      const isForkCandidate = ranges.length > 1 || !ranges.includes(range)
      if (isForkCandidate) {
        const newIds = [...ids, entry._id]
        const newRanges = [...ranges, range]
        forkMap.set(domain, { ids: newIds, ranges: newRanges })
      }
    } else {
      forkMap.set(domain, { ids: [entry._id], ranges: [range] })
    }

    return forkMap
  }, new Map())

  const forkSet = Array.from(potentialForks).reduce((forks, [key, data]) => {
    const { ids } = data
    if (ids.length > 1) {
      ids.forEach(id => forks.add(id))
    }
    return forks
  }, new Set())

  return Array.from(forkSet.values())
}

export function findChains (entries) {
  const domains = entries.map(entry => entry.domain)
  const entriesWithCycles = entries.filter((entry, index) => {
    const domainIndex = domains.indexOf(entry.range)
    return domainIndex !== -1 && domainIndex !== index
  })
  return entriesWithCycles.map(entry => entry._id)
}
