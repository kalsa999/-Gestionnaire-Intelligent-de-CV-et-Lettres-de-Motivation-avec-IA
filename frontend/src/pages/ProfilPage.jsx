import { useState, useEffect } from 'react'
import { getProfilsApi, createProfilApi, deleteProfilApi } from '../api/profilApi'

export default function ProfilPage() {
  const [profils, setProfils] = useState([])
  const [form, setForm] = useState({ titre: '', competences: '', experience: '', formation: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchProfils()
  }, [])

  async function fetchProfils() {
    try {
      const resp = await getProfilsApi()
      setProfils(resp.data.data || [])
    } catch {
      setError('Impossible de charger les profils')
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const competencesArray = form.competences
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean)
      await createProfilApi({ ...form, competences: competencesArray })
      setForm({ titre: '', competences: '', experience: '', formation: '' })
      setShowForm(false)
      fetchProfils()
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer ce profil ?')) return
    try {
      await deleteProfilApi(id)
      fetchProfils()
    } catch {
      setError('Erreur lors de la suppression')
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2>Mes Profils</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Annuler' : '+ Nouveau profil'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {showForm && (
        <div className="card">
          <h3>Créer un profil</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Titre du profil *</label>
              <input name="titre" value={form.titre} onChange={handleChange} placeholder="Ex: Développeur Full Stack" required />
            </div>
            <div className="form-group">
              <label>Compétences (séparées par des virgules)</label>
              <input name="competences" value={form.competences} onChange={handleChange} placeholder="JavaScript, React, Node.js" />
            </div>
            <div className="form-group">
              <label>Expérience</label>
              <textarea name="experience" value={form.experience} onChange={handleChange} rows={3} placeholder="Décrivez vos expériences professionnelles..." />
            </div>
            <div className="form-group">
              <label>Formation</label>
              <textarea name="formation" value={form.formation} onChange={handleChange} rows={2} placeholder="Votre parcours de formation..." />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </form>
        </div>
      )}

      {profils.length === 0 ? (
        <p className="empty-msg">Aucun profil créé. Commencez par en créer un !</p>
      ) : (
        <div className="list">
          {profils.map((p) => (
            <div key={p.id} className="card">
              <h3>{p.titre}</h3>
              {p.competences?.length > 0 && (
                <div className="tags">
                  {p.competences.map((c, i) => <span key={i} className="tag">{c}</span>)}
                </div>
              )}
              {p.experience && <p><strong>Expérience :</strong> {p.experience}</p>}
              {p.formation && <p><strong>Formation :</strong> {p.formation}</p>}
              <button className="btn-danger" onClick={() => handleDelete(p.id)}>Supprimer</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
