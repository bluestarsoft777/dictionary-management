import React from 'react'
import { NavLink } from 'react-router-dom'

class Header extends React.Component {
  render () {
    return (
      <div className='header'>
        <div className='header__title'>
          <NavLink className='header__navigation-link' to='/'>
            Dictionary Management
          </NavLink>
        </div>
      </div>
    )
  }
}

export default Header
