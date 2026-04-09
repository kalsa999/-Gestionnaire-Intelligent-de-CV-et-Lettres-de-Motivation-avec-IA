import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getLettresApi, createLettreApi, deleteLettreApi } from '../api/lettreApi'
import { getProfilsApi } from '../api/profilApi'

const TONS = ['PROFESSIONNEL', 'DYNAMIQUE', 'CREATIF', 'FORMEL']

export default function LettresPage() {
  const [lettres, setLettres] = useState([])
  const [profils, setProfils] = useState([])
  const [form, setForm] = useState({ titre: '', poste: '', entreprise: '', ton: 'PROFESSIONNEL', profilId: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchLettres()
    fetchProfils()
  }, [])

  async function fetchLettres() {
    try {
      const resp = await getLettresApi()
      setLettres(resp.data.data?.lettres || resp.data.data || [])
    } catch {
      setError('Impossible de charger les lettres')
    }
  }

  async function fetchProfils() {
    try {
      const resp = await getProfilsApi()
      setProfils(resp.data.data || [])
    } catch {}
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await createLettreApi(form)
      setForm({ titre: '', poste: '', entreprise: '', ton: 'PROFESSIONNEL', profilId: '' })
      setShowForm(false)
      fetchLettres()
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la génération')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer cette lettre ?')) return
    try {
      await deleteLettreApi(id)
      fetchLettres()
    } catch {
      setError('Erreur lors de la suppression')
    }
  }

  function statusLabel(status) {
    const map = { BROUILLON: '📝 Brouillon', FINALE: '✅ Finale', ENVOYEE: '📤 Envoyée', ARCHIVEE: '📦 Archivée' }
    return map[status] || status
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2>Mes Lettres de Motivation</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Annuler' : '+ Générer une lettre'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {showForm && (
        <div className="card">
          <h3>Générer une lettre avec l'IA</h3>
          {profils.length === 0 && (
            <p className="warning">⚠️ Vous devez d'abord créer un profil. <Link to="/profils">Créer un profil</Link></p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Titre *</label>
              <input name="titre" value={form.titre} onChange={handleChange} placeholder="Ex: Candidature Développeur" required />
            </div>
            <div className="form-group">
              <label>Poste visé *</label>
              <input name="poste" value={form.poste} onChange={handleChange} placeholder="Ex: Junior Backend Engineer" required />
            </div>
            <div className="form-group">
              <label>Entreprise *</label>
              <input name="entreprise" value={form.entreprise} onChange={handleChange} placeholder="Ex: TechCorp" required />
            </div>
            <div className="form-group">
              <label>Ton</label>
              <select name="ton" value={form.ton} onChange={handleChange}>
                {TONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Profil à utiliser *</label>
              <select name="profilId" value={form.profilId} onChange={handleChange} required>
                <option value="">-- Sélectionner un profil --</option>
                {profils.map((p) => <option key={p.id} value={p.id}>{p.titre}</option>)}
              </select>
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? '⏳ Génération en cours...' : '✨ Générer avec l\'IA'}
            </button>
          </form>
        </div>
      )}

      {lettres.length === 0 ? (
        <p className="empty-msg">Aucune lettre générée. Créez votre première lettre !</p>
      ) : (
        <div className="list">
          {lettres.map((l) => (
            <div key={l.id} className="card">
              <div className="card-header">
                <h3>{l.titre}</h3>
                <span className="badge">{statusLabel(l.status)}</span>
              </div>
              <p><strong>Poste :</strong> {l.poste} — <strong>Entreprise :</strong> {l.entreprise}</p>
              <p><strong>Ton :</strong> {l.ton}</p>
              <div className="card-actions">
                <Link to={`/lettres/${l.id}`} className="btn-secondary">Voir</Link>
                <button className="btn-danger" onClick={() => handleDelete(l.id)}>Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
