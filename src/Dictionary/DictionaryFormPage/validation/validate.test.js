import { findChains, findCycles, findDuplicates, findForks } from './validate'

test('findCycles works with empty input', () => {
  const cycles = findCycles([])
  expect(cycles).toEqual([])
})

test('findCycles works with single entry', () => {
  const cycles = findCycles([{
    _id: 'test1',
    domain: 'a',
    range: 'b'
  }])

  expect(cycles).toEqual([])
})

test('findCycles works with a pair', () => {
  const cycles = findCycles([{
    _id: 'test1',
    domain: 'a',
    range: 'b'
  }, {
    _id: 'test2',
    domain: 'b',
    range: 'a'
  }])

  expect(cycles).toEqual(['test1'])
})

test('findCycles works on complex input', () => {
  const cycles = findCycles([{
    _id: 'test1',
    domain: 'a',
    range: 'b'
  }, {
    _id: 'test2',
    domain: 'b',
    range: 'c'
  }, {
    _id: 'test3',
    domain: 'c',
    range: 'd'
  }, {
    _id: 'test4',
    domain: 'd',
    range: 'a'
  }])

  expect(cycles).toEqual(['test1'])
})

test('findChains works with empty input', () => {
  const chains = findChains([])
  expect(chains).toEqual([])
})

test('findChains works with single entry', () => {
  const chains = findChains([{
    _id: 'test1',
    domain: 'a',
    range: 'b'
  }])

  expect(chains).toEqual([])
})

test('findChains works with a pair', () => {
  const chains = findChains([{
    _id: 'test1',
    domain: 'a',
    range: 'b'
  }, {
    _id: 'test2',
    domain: 'b',
    range: 'c'
  }])

  expect(chains).toEqual(['test1'])
})

test('findDuplicates works with empty input', () => {
  const chains = findDuplicates([])
  expect(chains).toEqual([])
})

test('findDuplicates works with single entry', () => {
  const chains = findDuplicates([{
    _id: 'test1',
    domain: 'a',
    range: 'b'
  }])

  expect(chains).toEqual([])
})

test('findDuplicates works with a pair', () => {
  const chains = findDuplicates([{
    _id: 'test1',
    domain: 'a',
    range: 'b'
  }, {
    _id: 'test2',
    domain: 'a',
    range: 'b'
  }])

  expect(chains).toEqual(['test1', 'test2'])
})

test('findDuplicates works complex', () => {
  const chains = findDuplicates([{
    _id: 'test1',
    domain: 'a',
    range: 'b'
  }, {
    _id: 'test2',
    domain: 'a',
    range: 'b'
  }, {
    _id: 'test3',
    domain: 'b',
    range: 'a'
  }, {
    _id: 'test4',
    domain: 'a',
    range: 'c'
  }])

  expect(chains).toEqual(['test1', 'test2'])
})

test('findForks works with empty input', () => {
  const chains = findForks([])
  expect(chains).toEqual([])
})

test('findForks works with single entry', () => {
  const chains = findForks([{
    _id: 'test1',
    domain: 'a',
    range: 'b'
  }])

  expect(chains).toEqual([])
})

test('findForks works with a pair', () => {
  const chains = findForks([{
    _id: 'test1',
    domain: 'a',
    range: 'b'
  }, {
    _id: 'test2',
    domain: 'a',
    range: 'c'
  }])

  expect(chains).toEqual(['test1', 'test2'])
})

test('findForks - duplicates not treated as fork', () => {
  const chains = findForks([{
    _id: 'test1',
    domain: 'a',
    range: 'b'
  }, {
    _id: 'test2',
    domain: 'a',
    range: 'b'
  }])

  expect(chains).toEqual([])
})

test('findForks works with complex input', () => {
  const chains = findForks([{
    _id: 'test1',
    domain: 'a',
    range: 'b'
  }, {
    _id: 'test2',
    domain: 'a',
    range: 'e'
  }, {
    _id: 'test3',
    domain: 'g',
    range: 'a'
  }, {
    _id: 'test4',
    domain: 'a',
    range: 'c'
  }])

  expect(chains).toEqual(['test1', 'test2', 'test4'])
})
