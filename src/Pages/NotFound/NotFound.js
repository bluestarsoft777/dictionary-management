import React from 'react'
import { Link } from 'react-router-dom'

class NotFoundPage extends React.Component {
  render () {
    return (
      <div>

        <div className='section'>
          <div className='heading'>
            Page you were looking for couldn't be found...
          </div>

          <Link to='/'>
            Back to home
          </Link>
        </div>
      </div>
    )
  }
}

export default NotFoundPage
