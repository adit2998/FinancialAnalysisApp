import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from './components/LandingPage';
import CompaniesList from './components/CompaniesList';
import AppNavbar from './components/Navbar';
import CompanyTrends from "./components/CompanyTrends";
import CompanyReports from "./components/CompanyReports";

function App() {
  return (
    <Router>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />        
        <Route path="/companies" element={<CompaniesList />} />
        <Route path="/company/:ticker/trends" element={<CompanyTrends />} />
        <Route path="/company/:ticker/reports" element={<CompanyReports />} />
      </Routes>
    </Router>
  );
}

export default App;