import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { currentUser, logout } = useAuth();

  return (
    <div className="topbar">
      <div className="topbar-inner">
        <Link to="/" className="brand" style={{ textDecoration: 'none', color: 'inherit' }}>
          ⚡ Anime <span>Powers</span>
        </Link>
        <nav aria-label="Navegação principal" style={{ alignItems: 'center' }}>
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>Início</NavLink>
          <NavLink to="/catalogo" className={({ isActive }) => (isActive ? 'active' : '')}>Catálogo</NavLink>
          <NavLink to="/duelo" className={({ isActive }) => (isActive ? 'active' : '')}>Duelo</NavLink>
          <NavLink to="/grimorio" className={({ isActive }) => (isActive ? 'active' : '')}>Grimório</NavLink>
          <NavLink to="/afinidade" className={({ isActive }) => (isActive ? 'active' : '')}>Afinidade</NavLink>

          {currentUser ? (
            <div className="header-user-menu">
              <div className="header-user-badge" title={`${currentUser.name} (${currentUser.email}) - ${currentUser.role || 'Usuário'}`}>
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="header-avatar-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="header-avatar-fallback">👤</span>
                )}
                <span className="header-user-name">{currentUser.name || currentUser.email.split('@')[0]}</span>
              </div>
              <button onClick={logout} className="header-logout-btn" title="Desconectar">
                Sair
              </button>
            </div>
          ) : (
            <div className="header-auth-links">
              <NavLink to="/login" className={({ isActive }) => (isActive ? 'active nav-auth' : 'nav-auth')}>
                Entrar
              </NavLink>
              <NavLink to="/cadastro" className={({ isActive }) => (isActive ? 'active nav-signup' : 'nav-signup')}>
                Cadastre-se
              </NavLink>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}

