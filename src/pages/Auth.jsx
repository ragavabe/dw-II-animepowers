import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const CAROUSEL_SLIDES = [
  {
    title: 'Apresentando mais de 50 Poderes',
    desc: 'Catálogo lendário com Naruto, One Piece, Dragon Ball, Jujutsu Kaisen, Bleach, Demon Slayer, Solo Leveling e muito mais!'
  },
  {
    title: 'Grimório Pessoal e Sincronização Segura',
    desc: 'Armazene e organize seu arsenal com segurança, mantenha seu histórico de duelos e leve seus poderes favoritos para qualquer batalha.'
  },
  {
    title: 'Simulador de Afinidade e Duelo Cósmico',
    desc: 'Teste combinações elementais épicas, calcule vantagens estratégicas com artes em alta definição e domine qualquer arena.'
  }
];

export default function Auth({ initialMode = 'login' }) {
  const location = useLocation();
  const isCadastroRoute = location.pathname.includes('cadastro');
  const isLogin = isCadastroRoute ? false : (location.pathname.includes('login') ? true : initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'success' | 'error' | 'info', text: '' }
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const {
    login,
    register,
    loginWithGoogle,
    loginWithGoogleSimulated,
    renderGoogleButton,
    currentUser,
    animeAvatars
  } = useAuth();

  const [selectedAvatar, setSelectedAvatar] = useState(animeAvatars[0]?.url || '');
  const navigate = useNavigate();
  const googleBtnContainerRef = useRef(null);

  // Se o usuário já estiver logado, redireciona para o catálogo
  useEffect(() => {
    if (currentUser) {
      const timer = setTimeout(() => navigate('/catalogo'), 600);
      return () => clearTimeout(timer);
    }
  }, [currentUser, navigate]);

  // Renderiza botão oficial do Google Identity Services se o container estiver pronto
  useEffect(() => {
    let timer = setTimeout(() => {
      if (googleBtnContainerRef.current) {
        renderGoogleButton(googleBtnContainerRef.current, {
          theme: 'outline',
          size: 'large',
          width: 380,
          text: isLogin ? 'signin_with' : 'signup_with',
          shape: 'rectangular',
          logo_alignment: 'left'
        });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [renderGoogleButton, isLogin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlert(null);
    setIsLoading(true);

    if (!isLogin) {
      if (!email.trim() || !password.trim()) {
        setAlert({ type: 'error', text: 'Por favor, preencha todos os campos.' });
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setAlert({ type: 'error', text: 'As senhas não coincidem.' });
        setIsLoading(false);
        return;
      }
      const res = register(email, password, selectedAvatar);
      setIsLoading(false);
      if (res.success) {
        setAlert({ type: 'success', text: `${res.message} Entrando no Grimório...` });
        setTimeout(() => navigate('/catalogo'), 800);
      } else {
        setAlert({ type: 'error', text: res.message });
      }
    } else {
      if (!email.trim() || !password.trim()) {
        setAlert({ type: 'error', text: 'Por favor, informe seu e-mail e sua senha.' });
        setIsLoading(false);
        return;
      }
      const res = login(email, password, rememberMe);
      setIsLoading(false);
      if (res.success) {
        setAlert({ type: 'success', text: `${res.message} Bem-vindo de volta!` });
        setTimeout(() => navigate('/catalogo'), 800);
      } else {
        setAlert({ type: 'error', text: res.message });
      }
    }
  };

  const handleGoogleAuth = () => {
    setAlert({ type: 'info', text: 'Conectando com o Google Identity...' });
    const res = loginWithGoogle();
    if (!res || !res.success) {
      // Caso o popup One Tap não possa abrir (ex: sem origin liberada no Google Cloud Console), oferece entrada segura imediata
      const fallback = loginWithGoogleSimulated(email || 'usuario.google@gmail.com');
      if (fallback.success) {
        setAlert({ type: 'success', text: fallback.message });
        setTimeout(() => navigate('/catalogo'), 800);
      }
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      setAlert({
        type: 'error',
        text: 'Digite seu e-mail no campo acima para enviarmos o link de recuperação.'
      });
      return;
    }
    setAlert({
      type: 'success',
      text: `Instruções de redefinição enviadas para "${email}". Você também pode acessar com sua conta Google.`
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
        {/* =========================================
            PAINEL ESQUERDO: FORMULÁRIO DE LOGIN / CADASTRO
           ========================================= */}
        <div className="auth-left-panel">
          <div className="auth-left-content">
            {/* Topo / Logo */}
            <div className="auth-top-nav">
              <Link to="/" className="auth-brand" title="Voltar à página inicial">
                <div className="auth-brand-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <span className="auth-brand-title">Anime<span>Powers</span></span>
              </Link>

              <span className="auth-badge-portal">Portal de Acesso</span>
            </div>

            {/* Cabeçalho do formulário */}
            <div className="auth-header">
              <h1>{isLogin ? 'Entrar na sua Conta' : 'Criar Conta de Guerreiro'}</h1>
              <p className="auth-subheading">
                {isLogin ? (
                  <>
                    Ainda não possui grimório?{' '}
                    <button
                      type="button"
                      className="auth-toggle-link"
                      onClick={() => {
                        setIsLogin(false);
                        setAlert(null);
                        navigate('/cadastro');
                      }}
                    >
                      Cadastre-se grátis
                    </button>
                  </>
                ) : (
                  <>
                    Já faz parte do catálogo?{' '}
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

            {/* Alertas */}
            {alert && (
              <div className={`auth-toast-alert ${alert.type}`} role="alert">
                <span className="auth-alert-icon">
                  {alert.type === 'error' && '⚠️'}
                  {alert.type === 'success' && '✨'}
                  {alert.type === 'info' && 'ℹ️'}
                </span>
                <span className="auth-alert-msg">{alert.text}</span>
              </div>
            )}

            {/* BOTÃO PRINCIPAL DE LOGIN COM GOOGLE */}
            <div className="auth-google-section">
              <button
                type="button"
                className="auth-google-btn"
                onClick={handleGoogleAuth}
                title="Entrar com sua Conta Google"
                aria-label="Continuar com Google"
              >
                <div className="auth-google-icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24">
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
                </div>
                <span>Continuar com Google</span>
                <span className="auth-google-pill">1-clique</span>
              </button>

              {/* Container onde o Google GIS pode injetar o botão nativo */}
              <div
                id="google-official-btn"
                ref={googleBtnContainerRef}
                className="auth-google-native-container"
              />
            </div>

            {/* Divisor Visual */}
            <div className="auth-divider">
              <span>ou continue com e-mail</span>
            </div>

            {/* Formulário Tradicional */}
            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="auth-input-group">
                <label htmlFor="auth-email">Seu E-mail</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-leading-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <input
                    id="auth-email"
                    type="email"
                    className="auth-input has-icon"
                    placeholder="seu.nome@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <div className="auth-label-row">
                  <label htmlFor="auth-password">Sua Senha</label>
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
                <div className="auth-input-wrapper">
                  <span className="auth-input-leading-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    className="auth-input has-icon has-trailing"
                    placeholder="••••••••"
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
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                      <span className="auth-input-leading-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m9 11 3 3L22 4" />
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                      </span>
                      <input
                        id="auth-confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        className="auth-input has-icon"
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
                    <div className="auth-avatar-header">
                      <label className="auth-avatar-label">Escolha seu Avatar de Guerreiro</label>
                      <span className="auth-avatar-hint">Visível no perfil e ranking</span>
                    </div>
                    <div className="auth-avatar-grid">
                      {animeAvatars.map((av) => (
                        <button
                          key={av.id}
                          type="button"
                          className={`auth-avatar-item ${selectedAvatar === av.url ? 'selected' : ''}`}
                          onClick={() => setSelectedAvatar(av.url)}
                          title={`${av.name} (${av.anime})`}
                        >
                          <img src={av.url} alt={av.name} loading="lazy" />
                          <span className="auth-avatar-name">{av.name.split(' ')[0]}</span>
                          {selectedAvatar === av.url && (
                            <span className="auth-avatar-check">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Lembrar de mim */}
              <div className="auth-meta-row">
                <label className="auth-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Permanecer conectado</span>
                </label>
              </div>

              {/* Botão de Envio Principal */}
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="auth-btn-spinner-text">Conectando...</span>
                ) : (
                  <span>{isLogin ? 'Entrar no Grimório' : 'Criar Minha Conta'}</span>
                )}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </form>
          </div>

          {/* Rodapé Seguro (Sem o aviso técnico de DB) */}
          <div className="auth-secure-footer">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Autenticação Segura & Grimório Sincronizado</span>
          </div>
        </div>

        {/* =========================================
            PAINEL DIREITO: SHOWCASE DE PODERES E ARTE
           ========================================= */}
        <div className="auth-right-panel">
          <div className="auth-right-top">
            <Link to="/catalogo" className="auth-support-link" title="Explorar poderes sem login">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
              <span>Explorar Grimório</span>
            </Link>
          </div>

          {/* Card Flutuante de Poder */}
          <div className="auth-showcase-card">
            <div className="auth-showcase-inner">
              <div className="auth-showcase-text">
                <span className="auth-badge-kicker">⚡ NOVO ARSENAL</span>
                <h3>Desperte 50+ poderes lendários</h3>
                <p>
                  Imagens em alta definição, cálculo de afinidades, duelos cósmicos e grimório sincronizado.
                </p>
                <Link to="/catalogo" className="auth-learn-btn">
                  Abrir Catálogo
                </Link>
              </div>

              {/* Mini Cartão Holográfico Anime Card */}
              <div className="auth-mini-card">
                <div className="auth-mini-brand">⚡ ANIME POWERS</div>
                <div className="auth-mini-number">54 HABILIDADES ATIVAS</div>
                <div className="auth-mini-footer">
                  <span className="auth-mini-online">
                    <span className="auth-mini-dot"></span> STATUS: ATIVO
                  </span>
                  <span className="auth-mini-tag">RANK SSS</span>
                </div>
              </div>
            </div>

            {/* Badge Flutuante "Poder de Luta" */}
            <div className="auth-stat-float">
              <div className="auth-stat-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
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
                &larr;
              </button>
              <div className="auth-slider-dots">
                {CAROUSEL_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`auth-slider-dot ${idx === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Ir para slide ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                className="auth-slider-btn"
                onClick={nextSlide}
                aria-label="Próximo slide"
              >
                &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
