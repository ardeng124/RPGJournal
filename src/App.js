import './App.css';
import {
  BrowserRouter as Router,
  Routes, Route, Link, useNavigate
} from "react-router-dom"


import HomePage from "./screens/HomePage"


function App() {
  return (
  <Router>
    <Routes>
    <Route path="/" element={<HomePage />} />
    </Routes>
    
  </Router>
);
}

export default App;
