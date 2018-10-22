import React from 'react'
import { Link } from 'react-router-dom'
import {getDictionaries, deleteDictionary} from '../api'
import LoadingPage from '../../Pages/LoadingPage'

class DictionaryListPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      dictionaries: [],
      error: null
    }
  }

  componentDidMount () {
    this.loadDictionaries()
  }

  loadDictionaries = async () => {
    try {
      const dictionaries = await getDictionaries()
      this.setState({
        dictionaries,
        loading: false,
        error: false
      })
    } catch (error) {
      this.setState({
        loading: false,
        error: error
      })
    }
  }

  deleteDictionary = async (dictionary) => {
    this.setState({
      loading: true,
      error: null
    })

    await deleteDictionary(dictionary.id)

    this.loadDictionaries()
  }

  renderDictionary = (dictionary) => {
    return (
      <tr key={dictionary.id}>
        <td>
          <Link className='is-text' to={`/dictionary/${dictionary.id}`}>
            {dictionary.name}
          </Link>
        </td>
        <td>{dictionary.entries.length}</td>
        <td>
          <div className='buttons'>
            <Link className='button is-success' to={`/dictionary/${dictionary.id}`}>Edit</Link>
            <button className='button is-danger' onClick={e => this.deleteDictionary(dictionary)}>Delete</button>
          </div>
        </td>
      </tr>
    )
  }

  render () {
    const {loading, dictionaries} = this.state

    if (loading) {
      return <LoadingPage />
    }

    return (
      <div className='dictionaries-page'>
        <div className='section'>
          <div className='container dictionaries-page__top'>
            <h1 className='title is-marginless'>Dictionaries</h1>

            <Link className='button is-small is-dark' to='/create-dictionary'>
              + Add dictionary
            </Link>
          </div>
        </div>

        <div className='section'>
          <div className='container'>
            <table className='table table is-fullwidth'>
              <thead>
                <tr>
                  <td>Dictionary</td>
                  <td># entries</td>
                  <td>Actions</td>
                </tr>
              </thead>
              <tbody>
                {dictionaries.map(this.renderDictionary)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

export default DictionaryListPage
