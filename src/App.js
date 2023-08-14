import './App.css';
import './css/normalize.css'
import './css/skeleton.css'

import {
  BrowserRouter as Router,
  Routes, Route, Link, useNavigate
} from "react-router-dom"


import HomePage from "./screens/HomePage"
import Dashboard from "./screens/Dashboard"
import LoginPage from "./screens/LoginPage"

import SignupPage from "./screens/SignupPage"
import EntryPage from "./screens/EntryPage"


function App() {
  return (
  <Router>
    <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/journal/:id" element={<EntryPage/>} />

    </Routes>
    
  </Router>
);
}

export default App;
