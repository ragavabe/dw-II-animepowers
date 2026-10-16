import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const PERGUNTAS = [
  { q: 'Em batalha, você prefere...', opts: [['Atacar de frente', 'Fogo'], ['Controlar o ritmo', 'Água'], ['Ser imprevisível', 'Vento'], ['Resistir e contra-atacar', 'Terra'], ['Manipular energia pura', 'Energia']] },
  { q: 'Seu ambiente ideal...', opts: [['Vulcão / deserto', 'Fogo'], ['Oceano / chuva', 'Água'], ['Montanhas / céu', 'Vento'], ['Caverna / floresta', 'Terra'], ['Templo / vazio', 'Energia']] },
  { q: 'Seu defeito em luta...', opts: [['Impulsividade', 'Fogo'], ['Hesitação', 'Água'], ['Dispersão', 'Vento'], ['Teimosia', 'Terra'], ['Excesso de cálculo', 'Energia']] },
  { q: 'Técnica dos sonhos...', opts: [['Explosão colossal', 'Fogo'], ['Dragão de água', 'Água'], ['Lâmina invisível de vento', 'Vento'], ['Muralha inquebrável', 'Terra'], ['Feixe de energia', 'Energia']] },
  { q: 'Seu mestre seria...', opts: [['Ace / Tanjiro', 'Fogo'], ['Giyu / Hisoka', 'Água'], ['Naruto / Byakuya', 'Vento'], ['Gon / Midoriya', 'Terra'], ['Goku / Gojo', 'Energia']] },
];

const DESCR = {
  Fogo: 'Ofensivo e intenso. Bônus: +5 dano em duelos (roleplay).',
  Água: 'Adaptável e fluído. Bônus: −5 custo em duelos (roleplay).',
  Vento: 'Veloz e preciso. Bônus: +3 aleatoriedade a favor (roleplay).',
  Terra: 'Resistente e estável. Bônus: empates vencem (roleplay).',
  Energia: 'Equilibrado e arcano. Bônus: versátil em qualquer deck.',
};

export default function AffinityTest() {
  const [respostas, setRespostas] = useState(Array(PERGUNTAS.length).fill(''));
  const [afinidade, setAfinidade] = useLocalStorage('pa:afinidade', null);
  const [erro, setErro] = useState('');

  function escolher(i, el) {
    setRespostas((r) => r.map((v, idx) => (idx === i ? el : v)));
    setErro('');
  }

  function calcular(e) {
    e.preventDefault();
    if (respostas.some((r) => !r)) {
      setErro('Responda todas as 5 perguntas.');
      return;
    }
    const count = {};
    respostas.forEach((r) => { count[r] = (count[r] || 0) + 1; });
    const top = Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
    setAfinidade({ elemento: top, data: new Date().toISOString(), respostas });
  }

  return (
    <div>
      {afinidade && (
        <div className="card" role="status">
          <strong>Sua afinidade: {afinidade.elemento} 🔮</strong>
          <p className="muted">{DESCR[afinidade.elemento]}</p>
          <button className="ghost" onClick={() => { setAfinidade(null); setRespostas(Array(5).fill('')); }}>Refazer teste</button>
        </div>
      )}

      <form className="quiz" onSubmit={calcular}>
        {PERGUNTAS.map((p, i) => (
          <fieldset key={i}>
            <legend>{i + 1}. {p.q}</legend>
            {p.opts.map(([label, el]) => (
              <label key={el}>
                <input
                  type="radio"
                  name={`q${i}`}
                  checked={respostas[i] === el}
                  onChange={() => escolher(i, el)}
                />{' '}
                {label} <span className="muted">({el})</span>
              </label>
            ))}
          </fieldset>
        ))}
        {erro && <p role="alert" className="alert-text">{erro}</p>}
        <button type="submit">Revelar afinidade</button>
      </form>
    </div>
  );
}
