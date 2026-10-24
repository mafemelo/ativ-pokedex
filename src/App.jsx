import { useState, useEffect, useMemo } from 'react'
import dados from './data/pokedex-data.json'
import useLocalStorage from './hooks/useLocalStorage'

import Header from './components/Header'
import SearchBar from './components/SearchBar'
import TypeSelect from './components/TypeSelect'
import PokemonList from './components/PokemonList'
import PokemonCarousel from './components/PokemonCarousel'
import PokemonDetails from './components/PokemonDetails'
import CompareModal from './components/CompareModal'
import TrainerList from './components/TrainerList'
import EmptyState from './components/EmptyState'

const opcoesOrdem = [
  { valor: 'id', texto: 'Número' },
  { valor: 'name', texto: 'Nome (A–Z)' },
  { valor: 'hp', texto: 'HP (maior)' },
  { valor: 'attack', texto: 'Ataque (maior)' },
  { valor: 'defense', texto: 'Defesa (maior)' },
  { valor: 'specialAttack', texto: 'Ataque Esp. (maior)' },
  { valor: 'specialDefense', texto: 'Defesa Esp. (maior)' },
  { valor: 'speed', texto: 'Velocidade (maior)' },
]

const pokemons = dados.pokemon.map((p) =>
  p.types.length > 0 ? p : { ...p, types: [{ id: 0, name: 'Typeless' }] },
)

function App() {
  const { trainers, types } = dados

  const [aba, setAba] = useState('pokedex')
  const [busca, setBusca] = useState('')
  const [tipo, setTipo] = useState('Todos')
  const [ordem, setOrdem] = useState('id')
  const [soFavoritos, setSoFavoritos] = useState(false)
  const [selecionado, setSelecionado] = useState(null)
  const [comparar, setComparar] = useState([])
  const [mostrarComparacao, setMostrarComparacao] = useState(false)
  const [favoritos, setFavoritos] = useLocalStorage('pokedex-favoritos', [])
  const [tema, setTema] = useLocalStorage('pokedex-tema', 'light')
  const [visao, setVisao] = useLocalStorage('pokedex-visao', 'carrossel')

  useEffect(() => {
    document.documentElement.dataset.theme = tema
  }, [tema])

  const tiposUsados = useMemo(() => {
    const nomes = new Set(pokemons.flatMap((p) => p.types.map((t) => t.name)))
    return types.filter((t) => nomes.has(t.name))
  }, [types])

  const pokemonsFiltrados = useMemo(() => {
    const texto = busca.trim().toLowerCase().replace('#', '')

    const lista = pokemons.filter((p) => {
      const bateBusca =
        texto === '' ||
        p.name.toLowerCase().includes(texto) ||
        String(p.id).includes(texto)
      const bateTipo = tipo === 'Todos' || p.types.some((t) => t.name === tipo)
      const bateFavorito = !soFavoritos || favoritos.includes(p.id)
      return bateBusca && bateTipo && bateFavorito
    })

    return [...lista].sort((a, b) => {
      if (ordem === 'id') return a.id - b.id
      if (ordem === 'name') return a.name.localeCompare(b.name)
      return b.stats[ordem] - a.stats[ordem]
    })
  }, [busca, tipo, ordem, soFavoritos, favoritos])

  const limparFiltros = () => {
    setBusca('')
    setTipo('Todos')
    setSoFavoritos(false)
  }

  const alternarFavorito = (id) => {
    setFavoritos((atual) => (atual.includes(id) ? atual.filter((f) => f !== id) : [...atual, id]))
  }

  const alternarComparar = (id) => {
    setComparar((atual) => {
      if (atual.includes(id)) return atual.filter((c) => c !== id)
      if (atual.length === 2) return [atual[1], id]
      return [...atual, id]
    })
  }

  const sortearPokemon = () => {
    const sorteado = pokemons[Math.floor(Math.random() * pokemons.length)]
    setSelecionado(sorteado)
  }

  const abrirPokemon = (pokemon) => setSelecionado(pokemon)
  const fecharDetalhes = () => setSelecionado(null)
  const fecharComparacao = () => setMostrarComparacao(false)

  const treinadoresDoSelecionado = selecionado
    ? trainers.filter((t) => t.pokemonIds.includes(selecionado.id)).map((t) => t.name)
    : []

  const pokemonA = pokemons.find((p) => p.id === comparar[0])
  const pokemonB = pokemons.find((p) => p.id === comparar[1])

  return (
    <div className="app">
      <Header
        aba={aba}
        onChangeAba={setAba}
        tema={tema}
        onToggleTema={() => setTema(tema === 'dark' ? 'light' : 'dark')}
        onAleatorio={sortearPokemon}
        totalFavoritos={favoritos.length}
      />

      <main className="main">
        {aba === 'pokedex' ? (
          <>
            <section className="controls" aria-label="Pesquisa e filtros">
              <div className="controls-top">
                <SearchBar value={busca} onChange={setBusca} />

                <TypeSelect types={tiposUsados} selected={tipo} onSelect={setTipo} />

                <label className="select-wrap">
                  <span>Ordenar</span>
                  <select value={ordem} onChange={(e) => setOrdem(e.target.value)}>
                    {opcoesOrdem.map((o) => (
                      <option key={o.valor} value={o.valor}>
                        {o.texto}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  className={`btn ${soFavoritos ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setSoFavoritos(!soFavoritos)}
                  aria-pressed={soFavoritos}
                >
                  Favoritos
                </button>

                <div className="view-toggle" role="group" aria-label="Forma de visualização">
                  <button
                    className={visao === 'carrossel' ? 'active' : ''}
                    onClick={() => setVisao('carrossel')}
                    aria-pressed={visao === 'carrossel'}
                  >
                    Carrossel
                  </button>
                  <button
                    className={visao === 'grade' ? 'active' : ''}
                    onClick={() => setVisao('grade')}
                    aria-pressed={visao === 'grade'}
                  >
                    Grade
                  </button>
                </div>
              </div>
            </section>

            <p className="result-count" aria-live="polite">
              Mostrando {pokemonsFiltrados.length} de {pokemons.length} Pokémon
            </p>

            {pokemonsFiltrados.length === 0 ? (
              <EmptyState
                onClear={limparFiltros}
                mensagem={
                  soFavoritos && favoritos.length === 0
                    ? 'Você ainda não favoritou nenhum Pokémon. Toque na estrela de um card para salvar.'
                    : 'Tente outro nome, número ou tipo.'
                }
              />
            ) : visao === 'carrossel' ? (
              <PokemonCarousel
                key={`${busca}|${tipo}|${ordem}|${soFavoritos}`}
                pokemons={pokemonsFiltrados}
                favoritos={favoritos}
                comparar={comparar}
                onSelect={abrirPokemon}
                onToggleFavorito={alternarFavorito}
                onToggleComparar={alternarComparar}
              />
            ) : (
              <PokemonList
                pokemons={pokemonsFiltrados}
                favoritos={favoritos}
                comparar={comparar}
                onSelect={abrirPokemon}
                onToggleFavorito={alternarFavorito}
                onToggleComparar={alternarComparar}
              />
            )}
          </>
        ) : (
          <>
            <h2 className="page-title">Treinadores de Kanto</h2>
            <p className="page-sub">Clique em um Pokémon da equipe para ver os detalhes.</p>
            <TrainerList treinadores={trainers} pokemons={pokemons} onSelectPokemon={abrirPokemon} />
          </>
        )}
      </main>

      {aba === 'pokedex' && comparar.length > 0 && (
        <div className="compare-bar" role="region" aria-label="Comparação">
          <span>
            {comparar.length === 1
              ? `${pokemonA.name} selecionado. Escolha mais um com ⇄`
              : `${pokemonA.name} × ${pokemonB.name}`}
          </span>
          <button
            className="btn btn-primary"
            disabled={comparar.length < 2}
            onClick={() => setMostrarComparacao(true)}
          >
            Comparar
          </button>
          <button className="btn btn-ghost" onClick={() => setComparar([])}>
            Limpar
          </button>
        </div>
      )}

      {selecionado && (
        <PokemonDetails
          pokemon={selecionado}
          favorito={favoritos.includes(selecionado.id)}
          onToggleFavorito={alternarFavorito}
          onClose={fecharDetalhes}
          treinadores={treinadoresDoSelecionado}
        />
      )}

      {mostrarComparacao && pokemonA && pokemonB && (
        <CompareModal a={pokemonA} b={pokemonB} onClose={fecharComparacao} />
      )}

      <footer className="footer">
        Dados: pokedex-data.json. Imagens: PokéAPI (github.com/PokeAPI/sprites).
      </footer>
    </div>
  )
}

export default App
