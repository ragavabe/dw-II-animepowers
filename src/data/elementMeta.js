// Metadados visuais por elemento — fonte única usada por cards,
// modal, duel e tiles da página inicial.

export const ELEMENT_COLORS = {
  Fogo: '#f4795f',
  Água: '#5bb8f5',
  Vento: '#4fc9a0',
  Trovão: '#e8b04b',
  Luz: '#e3c766',
  Sombra: '#b08ae8',
  Espaço: '#8b9bf0',
  Tempo: '#c08ce8',
  Físico: '#e8748f',
  Terra: '#b5824a',
  Energia: '#46c2c8'
};

export const DEFAULT_ELEMENT = 'Energia';

const ELEMENT_FALLBACKS = {
  Fogo: 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8',
  Água: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b',
  Vento: 'https://images.unsplash.com/photo-1522383225653-ed111181a951',
  Trovão: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5',
  Luz: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
  Sombra: 'https://images.unsplash.com/photo-1514539079130-25950c84af65',
  Espaço: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
  Tempo: 'https://images.unsplash.com/photo-1501139083538-0139583c060f',
  Físico: 'https://images.unsplash.com/photo-1563245372-f21724e3856d',
  Terra: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23',
  Energia: 'https://images.unsplash.com/photo-1534447677768-be436bb09401'
};

export function elementClass(elemento) {
  const key = elemento?.toLowerCase() || 'default';
  return `element-${key}`;
}

export function elementColor(elemento) {
  return ELEMENT_COLORS[elemento] || ELEMENT_COLORS[DEFAULT_ELEMENT];
}

export function elementImageFallback(elemento, width = 600) {
  const base = ELEMENT_FALLBACKS[elemento] || ELEMENT_FALLBACKS[DEFAULT_ELEMENT];
  return `${base}?w=${width}&auto=format&fit=crop&q=80`;
}
