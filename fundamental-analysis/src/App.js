import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from './components/LandingPage';
import CompaniesList from './components/CompaniesList';
import AppNavbar from './components/Navbar';
import CompanyTrendsPage from "./components/CompanyTrendsPage";

function App() {
  return (
    <Router>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />        
        <Route path="/companies" element={<CompaniesList />} />
        <Route path="/company/:ticker/trends" element={<CompanyTrendsPage />} />
      </Routes>
    </Router>
  );
}

export default App;