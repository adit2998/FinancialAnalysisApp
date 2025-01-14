import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from './components/LandingPage';
import CompaniesListPage from './components/CompaniesListPage';
import AppNavbar from './components/Navbar';

function App() {
  return (
    <Router>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />        
        <Route path="/companies" element={<CompaniesListPage />} />
      </Routes>
    </Router>
  );
}

export default App;