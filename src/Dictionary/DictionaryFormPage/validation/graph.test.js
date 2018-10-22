import { buildDirectedGraph } from './graph'

test('graph builds correcty', () => {
  const entries = [{
    domain: 'a',
    range: 'b'
  }, {
    domain: 'b',
    range: 'c'
  }, {
    domain: 'a',
    range: 'c'
  }]

  const actualGraph = buildDirectedGraph(entries)
  const expectedGraph = {
    a: ['b', 'c'],
    b: ['c']
  }

  expect(actualGraph).toEqual(expectedGraph)
})
