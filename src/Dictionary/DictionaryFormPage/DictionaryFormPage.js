import React from 'react'
import DictionaryForm from './DictionaryForm'
import {getDictionary, createDictionary, updateDictionary} from '../api'
import LoadingPage from '../../Pages/LoadingPage'
import {withRouter} from 'react-router-dom'

class DictionaryFormPage extends React.Component {
  constructor (props) {
    super(props)
    const isLoading = props.isCreate ? false : true
    this.state = {
      loading: isLoading,
      error: null,
      dictionary: null
    }
  }
  componentDidMount = async () => {
    const {isCreate, dictionaryId} = this.props
    if (isCreate) return

    try {
      const dictionary = await getDictionary(dictionaryId)
      this.setState({
        loading: false,
        dictionary,
        error: null
      })
    } catch (error) {
      this.setState({
        loading: false,
        error
      })
    }
  }

  onFormSubmit = async (formValues) => {
    const {dictionaryId, isCreate, history} = this.props
    this.setState({loading: true, error: null})

    try {
      if (isCreate) {
        await createDictionary(formValues)
      } else {
        await updateDictionary(dictionaryId, formValues)
      }

      history.replace('/')
    } catch (error) {
      this.setState({
        loading: false,
        error: true
      })
    }
  }

  renderTitle = (isCreate, dictionary) => {
    const title = isCreate
      ? `Create a new dictionary`
      : `Update dictionary "${dictionary.name}"`

    return (
      <div className='section has-text-centered'>
        <h1 className='title'>
          {title}
        </h1>
      </div>
    )
  }

  render () {
    const {dictionary, loading} = this.state
    const {isCreate} = this.props

    if (loading) {
      return <LoadingPage />
    }

    return (
      <div>
        {this.renderTitle(isCreate, dictionary)}

        <div className='section'>
          <DictionaryForm
            isCreate={isCreate}
            dictionary={dictionary}
            onFormSubmit={this.onFormSubmit} />
        </div>
      </div>
    )
  }
}

export default withRouter(DictionaryFormPage)
