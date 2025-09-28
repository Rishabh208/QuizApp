import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './components/home';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" Component={Home} />
        </Routes>
      </Router>
    </>
  )
}

export default App
