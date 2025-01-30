import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from './components/LandingPage';
import CompaniesListPage from './components/CompaniesListPage';
import AppNavbar from './components/Navbar';
import CompanyReportDetailPage from './components/CompanyReportDetailPage';

function App() {
  return (
    <Router>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />        
        <Route path="/companies" element={<CompaniesListPage />} />
        <Route path="/company-report-details" element={<CompanyReportDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;