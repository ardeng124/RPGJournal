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
import CreateNotePage from './screens/CreateNotePage';

import AboutPage from './screens/AboutPage';
import FollowupPage from './screens/FollowupPage';
import TagPage from './screens/TagPage';
import TagIndividualPage from './screens/TagIndividualPage';
import SettingsPage from './screens/SettingsPage';



function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/journal/:id" element={<EntryPage />} />
              <Route path="/create" element={<CreateNotePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/followup" element={<FollowupPage />} />
              <Route path="/tags" element={<TagPage />} />
              <Route path="/tags/:id" element={<TagIndividualPage />} />
              <Route path="/settings" element={<SettingsPage />} />
          </Routes>
      </Router>
  )
}

export default App;
