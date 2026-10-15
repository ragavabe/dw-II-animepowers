/**
 * Configuração centralizada de Banco de Dados e Ambiente
 * Carrega variáveis do .env via import.meta.env (Vite)
 */

export const DB_CONFIG = {
  appName: import.meta.env.VITE_APP_NAME || 'Anime Powers',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.2.0',
  dbName: import.meta.env.VITE_DB_NAME || 'anime_powers_db',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  storageMode: import.meta.env.VITE_DB_STORAGE_MODE || 'local_and_cloud',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
};

// Avatares de Anime predefinidos para usuários
export const ANIME_AVATARS = [
  {
    id: 'avatar_goku',
    name: 'Guerreiro Saiyajin',
    anime: 'Dragon Ball',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&auto=format&fit=crop&q=80',
    fallbackEmoji: '⚡'
  },
  {
    id: 'avatar_naruto',
    name: 'Mestre Shinobi',
    anime: 'Naruto',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=200&auto=format&fit=crop&q=80',
    fallbackEmoji: '🍥'
  },
  {
    id: 'avatar_luffy',
    name: 'Rei dos Piratas',
    anime: 'One Piece',
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=200&auto=format&fit=crop&q=80',
    fallbackEmoji: '🏴‍☠️'
  },
  {
    id: 'avatar_gojo',
    name: 'Feiticeiro Especial',
    anime: 'Jujutsu Kaisen',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    fallbackEmoji: '👁️'
  },
  {
    id: 'avatar_tanjiro',
    name: 'Caçador de Demônios',
    anime: 'Demon Slayer',
    url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=200&auto=format&fit=crop&q=80',
    fallbackEmoji: '🗡️'
  },
  {
    id: 'avatar_ichigo',
    name: 'Shinigami Substituto',
    anime: 'Bleach',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&auto=format&fit=crop&q=80',
    fallbackEmoji: '⚔️'
  }
];
