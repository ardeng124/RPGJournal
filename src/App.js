import './App.css';
import {
  BrowserRouter as Router,
  Routes, Route, Link, useNavigate
} from "react-router-dom"


import HomePage from "./screens/HomePage"
import Dashboard from "./screens/Dashboard"


function App() {
  return (
  <Router>
    <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/dashboard" element={<Dashboard />} />

    </Routes>
    
  </Router>
);
}

export default App;
