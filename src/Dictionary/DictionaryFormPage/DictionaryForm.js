import React from 'react'
import { Link } from 'react-router-dom'
import {Formik, Field, FieldArray, ErrorMessage} from 'formik'
import * as yup from 'yup'
import { checkConsistency } from './validation'
import DictionaryFormError from './DictionaryFormError'

// TODO: add a real unique generator
function createRandomKey () {
  return Date.now() + Math.ceil(Math.random()* 10000000) + 1
}

class DictionaryForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isValidating: false,
      isValid: false,
      loading: false,
      duplicates: [],
      forks: [],
      chains: [],
      cycles: []
    }
  }

  generateNewEntry = () => {
    const newEntry = {
      _id: createRandomKey(),
      domain: '',
      range: ''
    }

    return newEntry
  }

  renderField = (dictionaryEntry, fieldIndex, arrayHelpers) => {
    const domainName = `entries[${fieldIndex}].domain`
    const rangeName = `entries[${fieldIndex}].range`

    return (
      <div className='field dictionary-form__field'
        key={dictionaryEntry._id}
        >
        <div className='field-body'>
          <div className='field'>
            {fieldIndex === 0 && <label className='label'>Domain (From)</label>}
            <div className='control'>
              <Field
                name={domainName}
                className='input'
                type='text'
                placeholder='Domain'
              />
            </div>
            <ErrorMessage name={domainName} render={msg => <p className="help is-danger">{msg}</p>} />
          </div>
          <div className='field'>
            {fieldIndex === 0 && <label className='label'>Range (To)</label>}
            <div className='control dictionary-form__delete-icon-container'>
              <Field
                className='input'
                type='text'
                name={rangeName}
                placeholder='Range'
              />
              <div className='dictionary-form__delete-icon' onClick={() => arrayHelpers.remove(fieldIndex)}>
                Delete
              </div>
            </div>
            <ErrorMessage name={rangeName} render={msg => <p className="help is-danger">{msg}</p>} />
          </div>
        </div>
        <div className='tags m-t-1'>
          {this.state.duplicates.includes(dictionaryEntry._id) && <span class="tag is-warning">DUPLICATE</span>}
          {this.state.forks.includes(dictionaryEntry._id) && <span class="tag is-warning">FORK</span>}
          {this.state.chains.includes(dictionaryEntry._id) && <span class="tag is-warning">CHAIN</span>}
          {this.state.cycles.includes(dictionaryEntry._id) && <span class="tag is-danger">CYCLE</span>}
        </div>
      </div>
    )
  }

  getInitialValues = ({isCreate, dictionary}) => {
    if (isCreate) {
      return {
        name: '',
        entries: [{
          _id: createRandomKey(),
          domain: '',
          range: ''
        }]
      }
    }

    const entries = dictionary.entries.map(entry => {
      return {
        ...entry,
        _id: createRandomKey()
      }
    })

    return {
      name: dictionary.name,
      entries
    }
  }

  getValidationSchema = () => {
    const entrySchema = yup.object().shape({
      domain: yup
        .string('Domain has to be a string')
        .min(1)
        .required('Domain is required')
        .when('range', (range, schema) => {
          if (!range) return schema
          return schema.notOneOf([range], 'Domain and range cannot be identical')
        }),
      range: yup.string('Range has to be a string').min(1).required('Range is required')
    })

    return yup.object().shape({
      name: yup.string('Dictionary name has to be a string').ensure(),
      entries: yup.array().of(entrySchema).min(1, 'There has to be at least 1 entry in the dictionary')
    })
  }

  handleSubmit = async (values, {setSubmitting, validateForm}) => {
    const {onFormSubmit} = this.props

    const isDictionaryValid = await this.validateDictionaryConsistency(values, validateForm)

    if (!isDictionaryValid) {
      setSubmitting(false)
      return
    }

    onFormSubmit(values)
  }

  validateDictionaryConsistency = async ({entries}, validateForm) => {
    const formErrors = await validateForm()
    const isFormInvalid = Object.keys(formErrors).length
    if (isFormInvalid) return false

    const {
      duplicates = [],
      forks = [],
      cycles = [],
      chains = []
    } = checkConsistency(entries)

    const isValid = [...duplicates, ...forks, ...cycles, ...chains].length === 0

    this.setState({
      duplicates,
      forks,
      cycles,
      chains,
      isValidating: false,
      isValid
    })

    return isValid
  }

  render () {
    return (
        <Formik
          initialValues={this.getInitialValues(this.props)}
          validationSchema={this.getValidationSchema}
          onSubmit={this.handleSubmit}
          >
          {({values, handleSubmit, errors, isSubmitting, validateForm}) => {
            return (
              <form
                className='form dictionary-form'
                onSubmit={handleSubmit}>
                <div className='field m-b-1'>
                  <label className='label'>
                    Dictionary Name
                  </label>
                  <div className='control'>
                    <Field
                      name='name'
                      className='input'
                      type='text'
                      placeholder='Name for the new dictionary'
                    />
                  </div>
                </div>

                <FieldArray
                  name='entries'
                  render={arrayHelpers => (
                    <div>
                      {values.entries.map((entry, index) => this.renderField(
                        entry, index, arrayHelpers
                      ))}

                      <ErrorMessage name='entries' render={msg => {
                        if (typeof msg !== 'string') {
                          return null
                        }

                        return <p className="help is-danger">{msg}</p>
                      }} />

                      <div className='field m-t-1'>
                        <button
                          type='button'
                          className='button is-dark'
                          onClick={() => arrayHelpers.push(this.generateNewEntry())}>
                          + Add new entry
                        </button>
                      </div>
                    </div>
                  )}
                />

                <DictionaryFormError
                  duplicates={this.state.duplicates}
                  chains={this.state.chains}
                  forks={this.state.forks}
                  cycles={this.state.cycles}
                />

                {this.state.isValid && <div className='m-t-2'>
                  <div className='notification is-success'>
                    All entries are valid!
                  </div></div>
                }

                <div className='field is-grouped m-t-2'>
                  <div className='control'>
                    <button
                      className='button is-link'
                      type='submit'
                      disabled={isSubmitting}>
                      Submit
                    </button>
                  </div>
                  <div className='control'>
                    <button
                      className='button is-success'
                      type='button'
                      disabled={isSubmitting || this.state.isValidating || Object.keys(errors).length}
                      onClick={e => this.validateDictionaryConsistency(values, validateForm)}
                    >
                      Validate
                    </button>
                  </div>
                  <div className='control'>
                    <Link className='button is-text' to={'/'}>Cancel</Link>
                  </div>
                </div>
              </form>
            )
          }}
        </Formik>
    )
  }
}

export default DictionaryForm
