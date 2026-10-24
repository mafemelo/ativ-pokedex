import { typeColors } from '../data/typeColors'
import PokemonImage from './PokemonImage'
import '../css/Trainers.css'

function TrainerList({ treinadores, pokemons, onSelectPokemon }) {
  const buscarPokemon = (id) => pokemons.find((p) => p.id === id)

  return (
    <section className="trainer-list" aria-label="Treinadores">
      {treinadores.map((t) => (
        <article key={t.id} className="trainer-card">
          <header className="trainer-head">
            <div className="trainer-info">
              <h3>{t.name}</h3>
              <div className="badges" aria-label={`${t.badges} insígnias`}>

                {Array.from({ length: Math.max(8, t.badges) }, (_, i) => (
                  <span key={i} className={`badge-dot ${i < t.badges ? 'earned' : ''}`} />
                ))}
              </div>
              <p className="badge-count">
                {t.badges} {t.badges === 1 ? 'insígnia' : 'insígnias'}
              </p>
            </div>
          </header>

          <ul className="trainer-team">
            {t.pokemonIds.map((id, posicao) => {
              const p = buscarPokemon(id)
              if (!p) return null
              return (
                <li key={`${id}-${posicao}`}>
                  <button
                    className="team-member"
                    style={{ '--tc': typeColors[p.types[0].name] }}
                    onClick={() => onSelectPokemon(p)}
                    title={`Ver detalhes de ${p.name}`}
                  >
                    <PokemonImage id={p.id} name={p.name} className="team-img" />
                    <span>{p.name}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </article>
      ))}
    </section>
  )
}

export default TrainerList
