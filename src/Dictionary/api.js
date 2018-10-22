export function getDictionaries () {
  return fetch('/dictionaries')
    .then(res => res.json())
}

export function getDictionary (id) {
  return fetch(`/dictionaries/${id}`)
    .then(res => res.json())
}

export function createDictionary (data) {
  const url = `/dictionaries`
  const options = getFetchOptions('POST', data)

  return fetch(url, options)
    .then(response => response.json())
}

export function updateDictionary (id, data) {
  const url = `/dictionaries/${id}`
  const options = getFetchOptions('PUT', data)

  return fetch(url, options)
    .then(response => response.json())
}

export function deleteDictionary (id) {
  const url = `/dictionaries/${id}`
  const options = getFetchOptions('DELETE')

  return fetch(url, options)
    .then(response => response.json())
}

function getFetchOptions (method, data) {
  return {
    method: method,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: data && JSON.stringify(data)
  }
}
