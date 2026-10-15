import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const CAROUSEL_SLIDES = [
  {
    title: 'Apresentando mais de 50 Poderes',
    desc: 'Catálogo ampliado com Naruto, One Piece, Dragon Ball, Jujutsu Kaisen, Bleach, Demon Slayer, Solo Leveling e muito mais!'
  },
  {
    title: 'Grimório Pessoal e Banco de Dados',
    desc: 'Armazene e gerencie seu arsenal no banco anime_powers_db configurado via .env e sincronizado no seu navegador.'
  },
  {
    title: 'Simulador de Afinidade e Duelo',
    desc: 'Teste combinações elementais épicas, veja os confrontos com artes oficiais e domine qualquer duelo.'
  }
];

export default function Auth({ initialMode = 'login' }) {
  const location = useLocation();
  const isCadastroRoute = location.pathname.includes('cadastro');
  const [isLogin, setIsLogin] = useState(initialMode === 'login' && !isCadastroRoute);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'success' | 'error', text: '' }
  const [currentSlide, setCurrentSlide] = useState(0);

  const { login, register, loginWithSocial, dbConfig, animeAvatars } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState(animeAvatars[0]?.url || '');
  const navigate = useNavigate();

  // Sincroniza modo se rota mudar
  React.useEffect(() => {
    if (location.pathname.includes('cadastro')) {
      setIsLogin(false);
    } else if (location.pathname.includes('login')) {
      setIsLogin(true);
    }
  }, [location.pathname]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlert(null);

    if (!isLogin) {
      if (password !== confirmPassword) {
        setAlert({ type: 'error', text: 'As senhas não coincidem.' });
        return;
      }
      const res = register(email, password, selectedAvatar);
      if (res.success) {
        setAlert({ type: 'success', text: `${res.message} Entrando...` });
        setTimeout(() => navigate('/catalogo'), 900);
      } else {
        setAlert({ type: 'error', text: res.message });
      }
    } else {
      const res = login(email, password, rememberMe);
      if (res.success) {
        setAlert({ type: 'success', text: `${res.message} Bem-vindo de volta!` });
        setTimeout(() => navigate('/catalogo'), 900);
      } else {
        setAlert({ type: 'error', text: res.message });
      }
    }
  };

  const handleSocialLogin = (provider) => {
    const res = loginWithSocial(provider);
    setAlert({ type: 'success', text: res.message });
    setTimeout(() => navigate('/catalogo'), 800);
  };

  const handleForgotPassword = () => {
    if (!email) {
      setAlert({
        type: 'error',
        text: 'Digite seu e-mail acima para redefinir ou recuperar sua senha.'
      });
      return;
    }
    setAlert({
      type: 'success',
      text: `Instruções de recuperação simuladas para "${email}". No banco local, você também pode recadastrar seu e-mail.`
    });
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card-container">
        {/* PAINEL ESQUERDO: FORMULÁRIO DE LOGIN / CADASTRO */}
        <div className="auth-left-panel">
          <div>
            {/* Logo da Marca */}
            <Link to="/" className="auth-brand" title="Voltar ao início">
              <div className="auth-brand-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <span>anime powers</span>
            </Link>

            {/* Cabeçalho do formulário */}
            <div className="auth-header">
              <h1>{isLogin ? 'Sign in' : 'Cadastre-se'}</h1>
              <p className="auth-subheading">
                {isLogin ? (
                  <>
                    Não tem uma conta?
                    <button
                      type="button"
                      className="auth-toggle-link"
                      onClick={() => {
                        setIsLogin(false);
                        setAlert(null);
                        navigate('/cadastro');
                      }}
                    >
                      Criar agora
                    </button>
                  </>
                ) : (
                  <>
                    Já tem uma conta?
                    <button
                      type="button"
                      className="auth-toggle-link"
                      onClick={() => {
                        setIsLogin(true);
                        setAlert(null);
                        navigate('/login');
                      }}
                    >
                      Fazer login
                    </button>
                  </>
                )}
              </p>
            </div>

            {/* Alertas de Erro ou Sucesso */}
            {alert && (
              <div className={`auth-toast-alert ${alert.type}`} role="alert">
                <span>{alert.type === 'error' ? '⚠️' : '✅'}</span>
                <span>{alert.text}</span>
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="auth-input-group">
                <label htmlFor="auth-email">E-mail</label>
                <div className="auth-input-wrapper">
                  <input
                    id="auth-email"
                    type="email"
                    className="auth-input"
                    placeholder="exemplo@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label htmlFor="auth-password">Senha</label>
                <div className="auth-input-wrapper">
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    className="auth-input"
                    placeholder="@#*%"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                    aria-label="Alternar visibilidade da senha"
                  >
                    {showPassword ? (
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 backward" />
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <>
                  <div className="auth-input-group">
                    <label htmlFor="auth-confirm-password">Confirmar Senha</label>
                    <div className="auth-input-wrapper">
                      <input
                        id="auth-confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        className="auth-input"
                        placeholder="Repita sua senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  {/* Seletor de Avatar do Usuário */}
                  <div className="auth-avatar-selector-group">
                    <label className="auth-avatar-label">
                      <span>Escolha seu Avatar de Guerreiro</span>
                    </label>
                    <div className="auth-avatar-grid">
                      {animeAvatars.map((av) => (
                        <button
                          key={av.id}
                          type="button"
                          className={`auth-avatar-item ${selectedAvatar === av.url ? 'selected' : ''}`}
                          onClick={() => setSelectedAvatar(av.url)}
                          title={`${av.name} (${av.anime})`}
                        >
                          <img src={av.url} alt={av.name} />
                          <span className="auth-avatar-name">{av.name.split(' ')[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Linha de Lembrar de mim e Esqueci a senha */}
              <div className="auth-meta-row">
                <label className="auth-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Lembrar de mim</span>
                </label>
                {isLogin && (
                  <button
                    type="button"
                    className="auth-forgot-btn"
                    onClick={handleForgotPassword}
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>

              {/* Botão de Envio Principal */}
              <button type="submit" className="auth-submit-btn">
                {isLogin ? 'Sign in' : 'Cadastrar com Avatar'}
              </button>
            </form>

            {/* Divisor "OU" */}
            <div className="auth-divider">
              <span>OU</span>
            </div>

            {/* Botões de Login Social */}
            <div className="auth-social-buttons">
              <button
                type="button"
                className="auth-social-btn"
                onClick={() => handleSocialLogin('Google')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continuar com Google</span>
              </button>

              <button
                type="button"
                className="auth-social-btn"
                onClick={() => handleSocialLogin('Facebook')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Continuar com Facebook</span>
              </button>
            </div>
          </div>

          {/* Dica de Banco de Dados com Dados do .env */}
          <div className="auth-db-badge" title={`Conectado: ${dbConfig.apiUrl}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
            </svg>
            <span>DB Ativo: <strong>{dbConfig.dbName}</strong> (.env carregado)</span>
          </div>
        </div>

        {/* PAINEL DIREITO: SHOWCASE DE PODERES E ARTE */}
        <div className="auth-right-panel">
          <div className="auth-right-top">
            <Link to="/catalogo" className="auth-support-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
              </svg>
              <span>Suporte & Dúvidas</span>
            </Link>
          </div>

          {/* Card Flutuante com Poderes e Imagens */}
          <div className="auth-showcase-card">
            <div className="auth-showcase-inner">
              <div className="auth-showcase-text">
                <h3>Desperte 50+ poderes lendários</h3>
                <p>
                  Imagens em alta definição, cálculo de afinidades, duelos cósmicos e grimório sincronizado.
                </p>
                <Link to="/catalogo" className="auth-learn-btn">
                  Explorar Catálogo
                </Link>
              </div>

              {/* Cartão de Poder Estilizado */}
              <div className="auth-mini-card">
                <div className="auth-mini-brand">⚡ ANIME POWERS</div>
                <div className="auth-mini-number">54 HABILIDADES CADASTRADAS</div>
                <div className="auth-mini-footer">
                  <span>DB: {dbConfig.dbName}</span>
                  <span className="auth-mini-tag">RANK SSS</span>
                </div>
              </div>
            </div>

            {/* Badge Flutuante "Poder de Luta" */}
            <div className="auth-stat-float">
              <div className="auth-stat-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
              </div>
              <div className="auth-stat-info">
                <span className="auth-stat-label">Poder Acumulado</span>
                <span className="auth-stat-val">1.250.000 PDL</span>
              </div>
            </div>
          </div>

          {/* Rodapé com Carrossel */}
          <div className="auth-right-footer">
            <h2>{CAROUSEL_SLIDES[currentSlide].title}</h2>
            <p>{CAROUSEL_SLIDES[currentSlide].desc}</p>

            {/* Controles de Slides do Carrossel */}
            <div className="auth-slider-nav">
              <button
                type="button"
                className="auth-slider-btn"
                onClick={prevSlide}
                aria-label="Slide anterior"
              >
                &lt;
              </button>
              {CAROUSEL_SLIDES.map((_, idx) => (
                <span
                  key={idx}
                  className={`auth-slider-dot ${idx === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(idx)}
                />
              ))}
              <button
                type="button"
                className="auth-slider-btn"
                onClick={nextSlide}
                aria-label="Próximo slide"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
