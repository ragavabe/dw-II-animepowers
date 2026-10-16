import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Duelo from './pages/Duelo';
import Grimorio from './pages/Grimorio';
import Afinidade from './pages/Afinidade';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import { AuthProvider } from './context/AuthContext';
import './styles/globals.css';

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/duelo" element={<Duelo />} />
            <Route path="/grimorio" element={<Grimorio />} />
            <Route path="/afinidade" element={<Afinidade />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <footer>
          Anime Powers — catálogo de técnicas de anime com duel, grimório e teste de afinidade.
        </footer>
      </HashRouter>
    </AuthProvider>
  );
}
