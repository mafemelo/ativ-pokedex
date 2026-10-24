import { typeColors } from '../data/typeColors'

function TypeBadge({ name }) {
  return (
    <span className="type-badge">
      <i className="type-dot" style={{ background: typeColors[name] }} />
      {name}
    </span>
  )
}

export default TypeBadge
