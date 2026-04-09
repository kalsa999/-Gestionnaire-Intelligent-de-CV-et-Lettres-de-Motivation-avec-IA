import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getLettreApi, regenerateLettreApi, updateLettreApi, deleteLettreApi } from '../api/lettreApi'

const STATUTS = ['BROUILLON', 'FINALE', 'ENVOYEE', 'ARCHIVEE']

export default function LettreDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lettre, setLettre] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchLettre()
  }, [id])

  async function fetchLettre() {
    try {
      const resp = await getLettreApi(id)
      setLettre(resp.data.data)
    } catch {
      setError('Impossible de charger la lettre')
    }
  }

  async function handleRegenerate() {
    if (!confirm('Régénérer cette lettre avec l\'IA ?')) return
    setLoading(true)
    try {
      await regenerateLettreApi(id)
      fetchLettre()
    } catch {
      setError('Erreur lors de la régénération')
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(e) {
    try {
      await updateLettreApi(id, { status: e.target.value })
      fetchLettre()
    } catch {
      setError('Erreur lors de la mise à jour du statut')
    }
  }

  async function handleDelete() {
    if (!confirm('Supprimer définitivement cette lettre ?')) return
    try {
      await deleteLettreApi(id)
      navigate('/lettres')
    } catch {
      setError('Erreur lors de la suppression')
    }
  }

  if (error) return <div className="container"><p className="error">{error}</p><Link to="/lettres">Retour</Link></div>
  if (!lettre) return <div className="container"><p>Chargement...</p></div>

  return (
    <div className="container">
      <div className="page-header">
        <h2>{lettre.titre}</h2>
        <Link to="/lettres" className="btn-secondary">← Retour</Link>
      </div>

      <div className="card">
        <div className="lettre-meta">
          <p><strong>Poste :</strong> {lettre.poste}</p>
          <p><strong>Entreprise :</strong> {lettre.entreprise}</p>
          <p><strong>Ton :</strong> {lettre.ton}</p>
          <div className="form-group">
            <label><strong>Statut :</strong></label>
            <select value={lettre.status} onChange={handleStatusChange}>
              {STATUTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <hr />

        <div className="lettre-contenu">
          <h3>Contenu de la lettre</h3>
          <div className="lettre-text">
            {lettre.contenu ? (
              lettre.contenu.split('\n').map((line, i) => <p key={i}>{line}</p>)
            ) : (
              <p className="empty-msg">Aucun contenu généré.</p>
            )}
          </div>
        </div>

        <div className="card-actions">
          <button className="btn-primary" onClick={handleRegenerate} disabled={loading}>
            {loading ? '⏳ Régénération...' : '🔄 Régénérer avec l\'IA'}
          </button>
          <button className="btn-danger" onClick={handleDelete}>Supprimer</button>
        </div>
      </div>
    </div>
  )
}
