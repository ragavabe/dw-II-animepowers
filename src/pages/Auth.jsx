import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import powersData from '../data/powers.json';
import { elementClass } from '../data/elementMeta';
import { ArrowRight, ArrowUpRight, Spark, Check, AlertTriangle, Info } from '../components/Icons';
import '../styles/auth.css';

const DESTAQUES = [
  { titulo: 'Catálogo completo', texto: 'Busque por técnica, personagem ou obra e filtre por elemento, dano e custo.' },
  { titulo: 'Arena de duelo', texto: 'A fórmula aplica dano, custo, afinidade elemental e o seu elemento pessoal.' },
  { titulo: 'Grimório pessoal', texto: 'Guarde até seis técnicas no navegador e exporte a coleção em JSON.' }
];

const ALERT_ICON = { error: AlertTriangle, success: Check, info: Info };

export default function Auth({ initialMode = 'login' }) {
  const location = useLocation();
  const ehCadastro = location.pathname.includes('cadastro');
  const ehLogin = location.pathname.includes('login') ? true : !ehCadastro && initialMode === 'login';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'success' | 'error' | 'info', text: '' }
  const [isLoading, setIsLoading] = useState(false);

  const {
    login,
    register,
    loginWithGoogle,
    loginWithGoogleSimulated,
    renderGoogleButton,
    currentUser
  } = useAuth();

  const navigate = useNavigate();
  const googleBtnContainerRef = useRef(null);

  // Se o usuário já estiver logado, redireciona para o catálogo
  useEffect(() => {
    if (currentUser) {
      const timer = setTimeout(() => navigate('/catalogo'), 600);
      return () => clearTimeout(timer);
    }
  }, [currentUser, navigate]);

  // Botão oficial do Google Identity Services, quando disponível
  useEffect(() => {
    const timer = setTimeout(() => {
      if (googleBtnContainerRef.current) {
        renderGoogleButton(googleBtnContainerRef.current, {
          width: 320
        });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [renderGoogleButton, ehLogin]);

  function trocarModo(paraCadastro) {
    setAlert(null);
    navigate(paraCadastro ? '/cadastro' : '/login');
  }

  function handleSubmit(e) {
    e.preventDefault();
    setAlert(null);

    if (!email.trim() || !password.trim()) {
      setAlert({
        type: 'error',
        text: ehLogin
          ? 'Informe e-mail e senha para continuar.'
          : 'Preencha e-mail e senha para criar a conta.'
      });
      return;
    }

    if (!ehLogin && password !== confirmPassword) {
      setAlert({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }

    setIsLoading(true);
    const res = ehLogin ? login(email, password, rememberMe) : register(email, password, null);
    setIsLoading(false);

    if (res.success) {
      setAlert({ type: 'success', text: `${res.message} Levando você ao catálogo...` });
      setTimeout(() => navigate('/catalogo'), 700);
    } else {
      setAlert({ type: 'error', text: res.message });
    }
  }

  function handleGoogleAuth() {
    setAlert({ type: 'info', text: 'Conectando com o Google Identity...' });
    const res = loginWithGoogle();
    if (!res || !res.success) {
      // Sem One Tap disponível, o botão nativo do Google assume o comando.
      if (googleBtnContainerRef.current?.childElementCount === 0) {
        const fallback = loginWithGoogleSimulated(email || 'visitante@exemplo.com');
        if (fallback.success) {
          setAlert({ type: 'success', text: fallback.message });
          setTimeout(() => navigate('/catalogo'), 700);
          return;
        }
      }
      setAlert({
        type: 'info',
        text: 'Use o botão oficial do Google abaixo para concluir o acesso.'
      });
    }
  }

  function handleForgotPassword() {
    setAlert({
      type: 'info',
      text: email
        ? `A recuperação de senha depende de um backend e ainda não está disponível. Você pode criar uma nova conta com ${email}.`
        : 'A recuperação de senha depende de um backend e ainda não está disponível.'
    });
  }

  const AlertIcon = alert ? ALERT_ICON[alert.type] || Info : Info;

  return (
    <div className="auth">
      {/* ---------------------------------------------------- formulário */}
      <section className="auth__panel">
        <Link to="/" className="brand auth__brand">
          Anime<span className="brand__dot" aria-hidden="true" />
          Powers
        </Link>

        <header className="auth__head">
          <p className="index-mark">/ acesso</p>
          <h1 className="display d-lg">{ehLogin ? 'Entrar' : 'Criar conta'}</h1>
          <p className="auth__sub">
            {ehLogin ? 'Ainda não tem conta? ' : 'Já tem conta? '}
            <button type="button" className="auth__switch" onClick={() => trocarModo(!ehLogin)}>
              {ehLogin ? 'Criar agora' : 'Entrar'}
            </button>
          </p>
        </header>

        {alert && (
          <p className={`notice notice--${alert.type === 'error' ? 'neg' : alert.type === 'success' ? 'pos' : 'signal'}`} role="alert">
            <AlertIcon size={15} />
            {alert.text}
          </p>
        )}

        <div className="auth__google">
          <button type="button" className="btn btn--block" onClick={handleGoogleAuth}>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Continuar com Google
          </button>
          <div ref={googleBtnContainerRef} className="auth__google-native" />
        </div>

        <div className="auth__divider">
          <span>ou use e-mail</span>
        </div>

        <form className="auth__form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label className="field__label" htmlFor="auth-email">
              E-mail
            </label>
            <input
              id="auth-email"
              className="input"
              type="email"
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="field">
            <div className="auth__label-row">
              <label className="field__label" htmlFor="auth-password">
                Senha
              </label>
              {ehLogin && (
                <button type="button" className="auth__link" onClick={handleForgotPassword}>
                  Esqueci a senha
                </button>
              )}
            </div>
            <div className="auth__password">
              <input
                id="auth-password"
                className="input"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={ehLogin ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                className="auth__reveal"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                aria-pressed={showPassword}
              >
                {showPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>

          {!ehLogin && (
            <div className="field">
              <label className="field__label" htmlFor="auth-confirm">
                Confirmar senha
              </label>
              <input
                id="auth-confirm"
                className="input"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
          )}

          <label className="switch">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Permanecer conectado
          </label>

          <button type="submit" className="btn btn--lg btn--block" disabled={isLoading}>
            {isLoading ? 'Conectando...' : ehLogin ? 'Entrar' : 'Criar conta'}
            {!isLoading && <ArrowRight className="btn__arrow" />}
          </button>

          <p className="auth__note">
            A conta e a sessão ficam apenas neste navegador. Nenhum dado é enviado para um
            servidor.
          </p>
        </form>
      </section>

      {/* ------------------------------------------------------ showcase */}
      <aside className="auth__aside" aria-label="Sobre o catálogo">
        <div className="auth__aside-top">
          <Link to="/catalogo" className="auth__link">
            Explorar sem entrar <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="auth__facts">
          {[
            { v: powersData.length, l: 'técnicas' },
            { v: new Set(powersData.map((p) => p.elemento)).size, l: 'elementos' },
            { v: new Set(powersData.map((p) => p.anime)).size, l: 'obras' }
          ].map((f) => (
            <div key={f.l}>
              <p className="display d-md">{f.v}</p>
              <p className="label">{f.l}</p>
            </div>
          ))}
        </div>

        <ul className="auth__showcase">
          {[...powersData]
            .sort((a, b) => b.dano - a.dano)
            .slice(0, 4)
            .map((p) => (
              <li key={p.id} className={elementClass(p.elemento)}>
                <Link to={`/poder/${p.id}`}>
                  <img src={p.imagem} alt="" loading="lazy" />
                  <span className="auth__showcase-copy">
                    <span className="tag">{p.elemento}</span>
                    <span className="auth__showcase-name">{p.nome}</span>
                    <span className="caption">{p.personagem}</span>
                  </span>
                </Link>
              </li>
            ))}
        </ul>

        <div className="auth__list">
          <p className="label">O que dá para fazer</p>
          {DESTAQUES.map((d) => (
            <div className="auth__list-item" key={d.titulo}>
              <Spark size={14} />
              <div>
                <p className="auth__list-title">{d.titulo}</p>
                <p className="caption">{d.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
