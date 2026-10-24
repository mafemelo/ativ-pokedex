import { useState, useEffect, useRef } from 'react'
import PokemonCard from './PokemonCard'
import '../css/Carousel.css'

const PASSO_ARRASTE = 90
const PAUSA_RODA = 220

function PokemonCarousel({ pokemons, favoritos, comparar, onSelect, onToggleFavorito, onToggleComparar }) {
  const [indice, setIndice] = useState(0)
  const [arrastando, setArrastando] = useState(false)
  const palco = useRef(null)
  const moveu = useRef(false)
  const ultimaRoda = useRef(0)
  const total = pokemons.length

  const andar = (passos) => setIndice((i) => (((i + passos) % total) + total) % total)

  useEffect(() => {
    const aoApertar = (e) => {
      const digitando = ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)
      if (digitando || document.querySelector('.modal-overlay')) return
      if (e.key === 'ArrowRight') setIndice((i) => (i + 1) % total)
      if (e.key === 'ArrowLeft') setIndice((i) => (i - 1 + total) % total)
    }
    window.addEventListener('keydown', aoApertar)
    return () => window.removeEventListener('keydown', aoApertar)
  }, [total])

  useEffect(() => {
    const elemento = palco.current
    const aoRolar = (e) => {
      e.preventDefault()
      const agora = Date.now()
      if (agora - ultimaRoda.current < PAUSA_RODA) return
      const movimento = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (Math.abs(movimento) < 4) return
      ultimaRoda.current = agora
      setIndice((i) => (((i + (movimento > 0 ? 1 : -1)) % total) + total) % total)
    }
    elemento.addEventListener('wheel', aoRolar, { passive: false })
    return () => elemento.removeEventListener('wheel', aoRolar)
  }, [total])

  const aoComecarArraste = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const inicio = e.clientX
    let aplicados = 0
    moveu.current = false
    setArrastando(true)

    const aoMover = (ev) => {
      const diferenca = ev.clientX - inicio
      if (Math.abs(diferenca) > 6) moveu.current = true
      const passos = Math.trunc(diferenca / PASSO_ARRASTE)
      if (passos !== aplicados) {
        andar(aplicados - passos)
        aplicados = passos
      }
    }
    const aoSoltar = () => {
      setArrastando(false)
      window.removeEventListener('pointermove', aoMover)
      window.removeEventListener('pointerup', aoSoltar)
      window.removeEventListener('pointercancel', aoSoltar)
    }
    window.addEventListener('pointermove', aoMover)
    window.addEventListener('pointerup', aoSoltar)
    window.addEventListener('pointercancel', aoSoltar)
  }

  const bloquearCliqueAposArraste = (e) => {
    if (moveu.current) {
      e.preventDefault()
      e.stopPropagation()
      moveu.current = false
    }
  }

  const raio = Math.min(3, Math.floor(total / 2))
  const visiveis = []
  const jaUsados = new Set()
  for (let offset = -raio; offset <= raio; offset++) {
    const posicao = (indice + offset + total) % total
    if (jaUsados.has(posicao)) continue
    jaUsados.add(posicao)
    visiveis.push({ pokemon: pokemons[posicao], offset, posicao })
  }

  return (
    <section className="carousel" aria-label="Carrossel de Pokémon" aria-roledescription="carrossel">
      <div
        ref={palco}
        className={`stage ${arrastando ? 'dragging' : ''}`}
        onPointerDown={aoComecarArraste}
        onClickCapture={bloquearCliqueAposArraste}
        onDragStart={(e) => e.preventDefault()}
      >
        {visiveis.map(({ pokemon, offset, posicao }) => (
          <div
            key={pokemon.id}
            className={`slide ${offset === 0 ? 'center' : 'side'} dist-${Math.abs(offset)}`}
            style={{ '--o': offset, '--abs': Math.abs(offset) }}
            onClick={offset !== 0 ? () => setIndice(posicao) : undefined}
            inert={offset !== 0}
          >
            <PokemonCard
              pokemon={pokemon}
              favorito={favoritos.includes(pokemon.id)}
              comparando={comparar.includes(pokemon.id)}
              onSelect={onSelect}
              onToggleFavorito={onToggleFavorito}
              onToggleComparar={onToggleComparar}
            />
          </div>
        ))}
      </div>

      <p className="jump-text">
        {indice + 1} de {total}. Arraste para os lados para navegar.
      </p>
    </section>
  )
}

export default PokemonCarousel
