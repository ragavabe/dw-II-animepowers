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

    // Seleciona um avatar anime default se não fornecido
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

  const loginWithSocial = (provider) => {
    const socialEmail = `${provider.toLowerCase()}user@animepowers.com`;
    const avatar = provider === 'Google' ? ANIME_AVATARS[2].url : ANIME_AVATARS[3].url;
    const sessionData = {
      id: `social_${Date.now()}`,
      email: socialEmail,
      name: `${provider} Guerreiro`,
      avatar,
      role: 'Aliado Dimensional',
      provider
    };
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(sessionData);
    return { success: true, message: `Conectado via ${provider}!` };
  };

  const logout = () => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
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
        loginWithSocial,
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
