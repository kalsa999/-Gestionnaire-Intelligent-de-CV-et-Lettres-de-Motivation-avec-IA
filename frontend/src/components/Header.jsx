import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header-brand">
        <strong>Lettre Motivation AI</strong>
      </div>
      <nav className="header-nav">
        {isAuthenticated ? (
          <>
            <NavLink to="/">Accueil</NavLink>
            <NavLink to="/profils">Profils</NavLink>
            <NavLink to="/lettres">Lettres</NavLink>
            <span className="header-user">👤 {user?.firstName}</span>
            <button className="btn-logout" onClick={handleLogout}>Déconnexion</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Connexion</NavLink>
            <NavLink to="/register">Inscription</NavLink>
          </>
        )}
      </nav>
    </header>
  )
}
