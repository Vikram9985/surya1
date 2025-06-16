import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ListDatafile from './ListData/ListDatafile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListDatafile />} />
      </Routes>
    </Router>
  );
}

export default App;
