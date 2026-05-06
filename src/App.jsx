import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles-modular.css';

// Importar componentes
import Header from './components/site/Header';
import Hero from './components/site/Hero';
import Gallery from './components/site/Gallery';
import VideoSection from './components/site/VideoSection';
import Pricing from './components/site/Pricing';
import Inscription from './components/site/Inscription';
import Contact from './components/site/Contact';
import About from './components/site/About';
import Schedule from './components/site/Schedule';
import Equipment from './components/site/Equipment';
import FAQ from './components/site/FAQ';
import Privacy from './components/site/Privacy';
import Footer from './components/site/Footer';
import AdminPage from './components/admin/AdminPage';

// Componente de la página principal
const HomePage = () => (
  <>
    <Header />
    <Hero />
    <Inscription />
    <Gallery />
    <About />
    <Privacy />
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <div className="App" style={{ width: '100%', overflowX: 'hidden' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
