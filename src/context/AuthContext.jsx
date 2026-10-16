import React, { createContext, useContext, useState, useEffect } from 'react';
import { DB_CONFIG, ANIME_AVATARS } from '../config/db';

const USERS_STORAGE_KEY = `${DB_CONFIG.dbName}_users_table`;
const SESSION_STORAGE_KEY = `${DB_CONFIG.dbName}_auth_session`;

// Contas padrão de demonstração pré-carregadas com avatares anime
const INITIAL_USERS = [
  {
    id: 'user_1',
    email: 'otaku@animepowers.com',
    password: 'password123',
    name: 'Guerreiro Supremo',
    avatar: ANIME_AVATARS[0].url,
    role: 'Guerreiro Rank SSS',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'user_2',
    email: 'exemplo@gmail.com',
    password: '123',
    name: 'Caçador de Poderes',
    avatar: ANIME_AVATARS[1].url,
    role: 'Shinobi Especial',
    createdAt: '2026-02-15T00:00:00.000Z'
  }
];

const AuthContext = createContext(null);

// Carregar Google Identity Services (GIS) script dinamicamente
function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve(window.google);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error('Falha ao carregar Google Identity Services'));
    document.head.appendChild(script);
  });
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const session = localStorage.getItem(SESSION_STORAGE_KEY);
      if (session) {
        const parsed = JSON.parse(session);
        if (!parsed.avatar) parsed.avatar = ANIME_AVATARS[0].url;
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [googleReady, setGoogleReady] = useState(false);

  // Inicializa o banco de dados de usuários no localStorage se não existir
  useEffect(() => {
    try {
      const existing = localStorage.getItem(USERS_STORAGE_KEY);
      if (!existing) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      }
    } catch (e) {
      console.error('Erro ao acessar banco local:', e);
    }
  }, []);

  // Carrega Google GIS e inicializa o botão
  useEffect(() => {
    let mounted = true;
    loadGoogleScript()
      .then((google) => {
        if (!mounted) return;
        google.accounts.id.initialize({
          client_id: DB_CONFIG.googleClientId,
          callback: handleGoogleCredential,
          auto_select: false,
          cancel_on_tap_outside: true
        });
        setGoogleReady(true);
      })
      .catch((err) => console.error('Google GIS error:', err));
    return () => { mounted = false; };
  }, []);

  const getUsers = () => {
    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      if (!raw) return INITIAL_USERS;
      const parsed = JSON.parse(raw);
      return parsed.map((u, i) => ({
        ...u,
        avatar: u.avatar || ANIME_AVATARS[i % ANIME_AVATARS.length].url
      }));
    } catch {
      return INITIAL_USERS;
    }
  };

  const register = (email, password, avatarUrl = null) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      return { success: false, message: 'Por favor, preencha todos os campos.' };
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, message: 'Digite um e-mail válido.' };
    }

    if (cleanPassword.length < 4) {
      return { success: false, message: 'A senha deve ter pelo menos 4 caracteres.' };
    }

    const users = getUsers();
    const exists = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (exists) {
      return { success: false, message: 'Este e-mail já está cadastrado! Faça login.' };
    }

    const chosenAvatar =
      avatarUrl ||
      ANIME_AVATARS[Math.floor(Math.random() * ANIME_AVATARS.length)].url;

    const newUser = {
      id: 'user_' + Date.now(),
      email: cleanEmail,
      password: cleanPassword,
      name: cleanEmail.split('@')[0],
      avatar: chosenAvatar,
      role: 'Iniciante do Grimório',
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      const sessionData = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        avatar: newUser.avatar,
        role: newUser.role
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
      setCurrentUser(sessionData);
      return { success: true, message: 'Conta criada com sucesso!' };
    } catch {
      return { success: false, message: 'Erro ao salvar no banco local do navegador.' };
    }
  };

  const login = (email, password, remember = true) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      return { success: false, message: 'Por favor, informe seu e-mail e senha.' };
    }

    const users = getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword
    );

    if (!user) {
      return { success: false, message: 'E-mail ou senha incorretos.' };
    }

    const sessionData = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar || ANIME_AVATARS[0].url,
      role: user.role || 'Guerreiro das Sombras'
    };

    if (remember) {
      try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
      } catch (e) {
        console.error(e);
      }
    }
    setCurrentUser(sessionData);
    return { success: true, message: 'Login realizado com sucesso!' };
  };

  const handleGoogleCredential = (response) => {
    try {
      // Decodifica o JWT token do Google
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      const users = getUsers();
      let user = users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());
      
      if (!user) {
        // Cria novo usuário se não existir
        user = {
          id: 'google_' + payload.sub,
          email: payload.email,
          name: payload.name,
          avatar: payload.picture,
          role: 'Guerreiro Google',
          createdAt: new Date().toISOString(),
          provider: 'google'
        };
        const updatedUsers = [...users, user];
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      } else if (!user.avatar && payload.picture) {
        // Atualiza avatar se não tiver
        user.avatar = payload.picture;
        const updatedUsers = users.map((u) => u.id === user.id ? user : u);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      }

      const sessionData = {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar || ANIME_AVATARS[0].url,
        role: user.role || 'Guerreiro das Sombras',
        provider: 'google'
      };
      
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
      setCurrentUser(sessionData);
    } catch (err) {
      console.error('Erro ao processar credencial Google:', err);
    }
  };

  const loginWithGoogle = () => {
    if (!window.google?.accounts?.id) {
      return { success: false, message: 'Google Sign-In não carregado. Tente novamente.' };
    }
    return new Promise((resolve) => {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback: renderiza o botão se o One Tap não aparecer
          resolve({ success: false, message: 'Use o botão "Entrar com Google" abaixo.' });
        }
      });
    });
  };

  const renderGoogleButton = (elementId) => {
    if (!window.google?.accounts?.id || !document.getElementById(elementId)) return;
    window.google.accounts.id.renderButton(
      document.getElementById(elementId),
      { theme: 'outline', size: 'large', width: '100%', text: 'continue_with', logo_alignment: 'left' }
    );
  };

  const logout = () => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      // Revoga o token do Google se logado via Google
      if (currentUser?.provider === 'google' && window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
      }
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
  };

  const updateUserAvatar = (newAvatarUrl) => {
    if (!currentUser) return;
    const updated = { ...currentUser, avatar: newAvatarUrl };
    setCurrentUser(updated);
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
      const users = getUsers();
      const nextUsers = users.map((u) =>
        u.id === currentUser.id ? { ...u, avatar: newAvatarUrl } : u
      );
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(nextUsers));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        register,
        login,
        loginWithGoogle,
        renderGoogleButton,
        googleReady,
        logout,
        updateUserAvatar,
        dbConfig: DB_CONFIG,
        animeAvatars: ANIME_AVATARS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
