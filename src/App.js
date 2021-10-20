import React from 'react'
import { BrowserRouter as Router} from 'react-router-dom'
import Header from './components/Header'
import Container from './components/Container'

const App = () => {
  return (
    <Router>
    <Header></Header>
    <Container>
    </Container>
    </Router>
  )
}

export default App
