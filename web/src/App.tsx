import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import BudgetPage from './pages/Budget';
import QuizPage from './pages/Quiz';
import MaterialsPage from './pages/Materials';
import GalleryPage from './pages/Gallery';
import DiagramsPage from './pages/Diagrams';
import StartProjectPage from './pages/StartProject';
import PrivacyPage from './pages/Privacy';
import LinksPage from './pages/Links';
import Header from './components/Header';
import Footer from './components/Footer';
import Toast from './components/Toast';

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/materials" element={<MaterialsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/diagrams" element={<DiagramsPage />} />
        <Route path="/start-project" element={<StartProjectPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/links" element={<LinksPage />} />
      </Routes>
      <Footer />
      <Toast />
    </Router>
  );
}

