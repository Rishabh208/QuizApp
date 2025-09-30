import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './components/home';
import { QuesForm } from './components/ques_form';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:title" element={<QuesForm />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
