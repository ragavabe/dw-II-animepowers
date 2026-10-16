import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export default function Header() {
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 480);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  const navLinks = [
    { to: '/', label: 'Início' },
    { to: '/catalogo', label: 'Catálogo' },
    { to: '/duelo', label: 'Duelo' },
    { to: '/grimorio', label: 'Grimório' },
    { to: '/afinidade', label: 'Afinidade' },
  ];

  return (
    <div className="topbar">
      <div className="topbar-inner">
        <Link to="/" className="brand" style={{ textDecoration: 'none', color: 'inherit' }}>
          ⚡ Anime <span>Powers</span>
        </Link>

        {!isMobile && (
          <nav aria-label="Navegação principal" style={{ alignItems: 'center' }}>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={closeMobileMenu}
              >
                {link.label}
              </NavLink>
            ))}
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
                <NavLink to="/login" className={({ isActive }) => (isActive ? 'active nav-auth' : 'nav-auth')} onClick={closeMobileMenu}>
                  Entrar
                </NavLink>
                <NavLink to="/cadastro" className={({ isActive }) => (isActive ? 'active nav-signup' : 'nav-signup')} onClick={closeMobileMenu}>
                  Cadastre-se
                </NavLink>
              </div>
            )}
          </nav>
        )}

        {isMobile && (
          <>
            <button
              className="hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
            {mobileMenuOpen && (
              <div className="mobile-menu-overlay" onClick={closeMobileMenu} />
            )}
            {mobileMenuOpen && (
              <nav className="mobile-menu" aria-label="Navegação mobile">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) => (isActive ? 'active' : '')}
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </NavLink>
                ))}
                {currentUser ? (
                  <div className="mobile-user-menu">
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
                    <button onClick={() => { logout(); closeMobileMenu(); }} className="header-logout-btn" title="Desconectar">
                      Sair
                    </button>
                  </div>
                ) : (
                  <div className="mobile-auth-links">
                    <NavLink to="/login" className={({ isActive }) => (isActive ? 'active nav-auth' : 'nav-auth')} onClick={closeMobileMenu}>
                      Entrar
                    </NavLink>
                    <NavLink to="/cadastro" className={({ isActive }) => (isActive ? 'active nav-signup' : 'nav-signup')} onClick={closeMobileMenu}>
                      Cadastre-se
                    </NavLink>
                  </div>
                )}
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}

