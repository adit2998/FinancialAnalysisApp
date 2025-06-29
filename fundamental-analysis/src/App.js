import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from './components/LandingPage';
import CompaniesList from './components/CompaniesList';
import AppNavbar from './components/Navbar';
import CompanyTrends from "./components/CompanyTrends";
import CompanyReports from "./components/CompanyReports";
import ReportDetails from "./components/ReportDetails";

function App() {
  return (
    <Router>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />        
        <Route path="/companies" element={<CompaniesList />} />
        <Route path="/company/:ticker/trends" element={<CompanyTrends />} />
        <Route path="/company/:ticker/reports" element={<CompanyReports />} />
        <Route path="/company/:ticker/reports/:filename" element={<ReportDetails />} />
      </Routes>
    </Router>
  );
}

export default App;