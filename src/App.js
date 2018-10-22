import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { DictionaryListPage, DictionaryFormPage } from './Dictionary'
import NotFoundPage from './Pages/NotFound'
import Header from './Components/Header'
import './App.css'
import 'bulma/css/bulma.css'

class App extends Component {
  render () {
    return (
      <Router>
        <div className='App'>
          <Header />
          <Switch>
            <Route exact path='/' render={() => <DictionaryListPage />} />
            <Route exact path='/create-dictionary' render={() => <DictionaryFormPage isCreate />} />
            <Route exact path='/dictionary/:id' render={({ match }) => <DictionaryFormPage key={match.params.id} dictionaryId={match.params.id} />} />
            <Route component={NotFoundPage} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
