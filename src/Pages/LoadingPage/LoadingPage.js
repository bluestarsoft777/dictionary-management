import React from 'react'
import Loader from '../../Components/Loader'

const LoadingPage = () => {
  return (
    <div className='loading-page'>
      <div className='section'>
        <div className='container loading-page__loader-wrapper'>
          <Loader />
        </div>
      </div>
    </div>
  )
}

export default LoadingPage
