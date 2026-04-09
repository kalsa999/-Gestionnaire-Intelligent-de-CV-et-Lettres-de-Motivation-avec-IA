import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="container">
      <div className="hero">
        <h1>Bonjour, {user?.firstName} 👋</h1>
        <p>Générez des lettres de motivation personnalisées grâce à l'intelligence artificielle.</p>
      </div>

      <div className="cards-grid">
        <div className="card">
          <h3>📋 Mes Profils</h3>
          <p>Créez et gérez vos profils professionnels (compétences, expériences, formation).</p>
          <Link to="/profils" className="btn-primary">Gérer mes profils</Link>
        </div>

        <div className="card">
          <h3>✉️ Mes Lettres</h3>
          <p>Générez des lettres de motivation adaptées à chaque candidature.</p>
          <Link to="/lettres" className="btn-primary">Voir mes lettres</Link>
        </div>
      </div>
    </div>
  )
}
