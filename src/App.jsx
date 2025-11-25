import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CryptoAnalysis from './pages/CryptoAnalysis';
import Calculators from './pages/Calculators';

function App() {
  return (
    <Router basename="/blockchain">
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analysis" element={<CryptoAnalysis />} />
          <Route path="/calculators" element={<Calculators />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
