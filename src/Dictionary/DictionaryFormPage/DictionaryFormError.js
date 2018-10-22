import React from 'react'

function DictionaryFormError ({ cycles, chains, forks, duplicates }) {
  const hasErrors = (cycles.length + chains.length + forks.length + duplicates.length) > 0

  if (!hasErrors) return null

  return (
    <div className='m-t-2'>
      <div className='notification is-danger'>
        The form can't be submitted for the following reasons:
        Cycles: {cycles.length}<br />
        Chains: {chains.length}<br />
        Forks: {forks.length}<br />
        Duplicates: {duplicates.length}
      </div>
    </div>
  )
}

export default DictionaryFormError
