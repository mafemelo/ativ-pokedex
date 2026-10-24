import '../css/Header.css'

function Header({ aba, onChangeAba, tema, onToggleTema, onAleatorio, totalFavoritos }) {
  return (
    <header className="header">
      <h1 className="brand">Pokédex</h1>

      <nav className="tabs" aria-label="Seções">
        <button className={aba === 'pokedex' ? 'tab active' : 'tab'} onClick={() => onChangeAba('pokedex')}>
          Pokémon
        </button>
        <button className={aba === 'treinadores' ? 'tab active' : 'tab'} onClick={() => onChangeAba('treinadores')}>
          Treinadores
        </button>
      </nav>

      <div className="header-actions">
        <span className="fav-count">★ {totalFavoritos}</span>
        <button className="btn btn-ghost" onClick={onAleatorio}>
          Aleatório
        </button>
        <button
          className="theme-btn"
          onClick={onToggleTema}
          aria-label={tema === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
          title="Alternar tema"
        >
          {tema === 'dark' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  )
}

export default Header
