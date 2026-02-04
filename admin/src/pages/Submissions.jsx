import { useState, useEffect } from 'react'
import { submissionsApi } from '../lib/supabase'

export default function Submissions() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedSubmission, setSelectedSubmission] = useState(null)

  useEffect(() => {
    loadSubmissions()
  }, [])

  const loadSubmissions = async () => {
    try {
      setLoading(true)
      const data = await submissionsApi.getAll()
      setSubmissions(data || [])
    } catch (err) {
      console.error('Error loading submissions:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await submissionsApi.updateStatus(id, newStatus)
      setSubmissions(prev => prev.map(s =>
        s.id === id ? { ...s, status: newStatus } : s
      ))
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(prev => ({ ...prev, status: newStatus }))
      }
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this submission?')) return
    try {
      await submissionsApi.delete(id)
      setSubmissions(prev => prev.filter(s => s.id !== id))
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null)
      }
    } catch (err) {
      console.error('Error deleting submission:', err)
    }
  }

  const filteredSubmissions = submissions.filter(s => {
    if (filter === 'all') return true
    if (filter === 'new') return s.status === 'new'
    if (filter === 'contact') return s.form_type === 'contact'
    if (filter === 'start') return s.form_type === 'start'
    return true
  })

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getIntentLabel = (intent) => {
    switch (intent) {
      case 'weekly': return 'Weekly Setup'
      case 'samples': return 'Request Samples'
      case 'inquiry': return 'General Inquiry'
      default: return intent
    }
  }

  const newCount = submissions.filter(s => s.status === 'new').length

  if (loading) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
        <p>Loading submissions...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Submissions</h1>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-text)', marginTop: '4px' }}>
            {submissions.length} total, {newCount} new
          </p>
        </div>
        <button className="btn btn-secondary" onClick={loadSubmissions}>
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {['all', 'new', 'start', 'contact'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px',
              border: filter === f ? '2px solid var(--color-primary)' : '1px solid var(--color-gray-border)',
              background: filter === f ? 'var(--color-primary)' : 'white',
              color: filter === f ? 'white' : 'var(--color-dark)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500
            }}
          >
            {f === 'all' ? 'All' : f === 'new' ? `New (${newCount})` : f === 'start' ? 'Start Forms' : 'Contact'}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedSubmission ? '1fr 1fr' : '1fr', gap: '24px' }}>
        {/* Submissions List */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {filteredSubmissions.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--color-gray-text)' }}>
              No submissions found
            </div>
          ) : (
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Type</th>
                  <th>From</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map(submission => (
                  <tr
                    key={submission.id}
                    onClick={() => setSelectedSubmission(submission)}
                    style={{
                      cursor: 'pointer',
                      background: selectedSubmission?.id === submission.id ? 'var(--color-gray-light)' : 'transparent'
                    }}
                  >
                    <td>
                      <span className={`status status-${submission.status === 'new' ? 'available' : submission.status === 'replied' ? 'seasonal' : 'hidden'}`}>
                        {submission.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>
                        {submission.form_type === 'contact' ? 'Contact' : getIntentLabel(submission.intent)}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{submission.contact_name || '—'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-gray-text)' }}>{submission.email}</div>
                    </td>
                    <td style={{ fontSize: '13px', color: 'var(--color-gray-text)' }}>
                      {formatDate(submission.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail Panel */}
        {selectedSubmission && (
          <div className="card" style={{ position: 'sticky', top: '24px', alignSelf: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h2 style={{ margin: 0 }}>{selectedSubmission.contact_name || 'No name'}</h2>
                <a href={`mailto:${selectedSubmission.email}`} style={{ color: 'var(--color-primary)' }}>
                  {selectedSubmission.email}
                </a>
                {selectedSubmission.phone && (
                  <div style={{ fontSize: '14px', marginTop: '4px' }}>
                    <a href={`tel:${selectedSubmission.phone}`}>{selectedSubmission.phone}</a>
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-gray-text)' }}
              >
                &times;
              </button>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', color: 'var(--color-gray-text)', marginBottom: '4px' }}>Type</div>
              <div style={{ fontWeight: 500 }}>
                {selectedSubmission.form_type === 'contact' ? 'Contact Form' : `Start Form — ${getIntentLabel(selectedSubmission.intent)}`}
              </div>
            </div>

            {selectedSubmission.restaurant_name && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-gray-text)', marginBottom: '4px' }}>Restaurant</div>
                <div style={{ fontWeight: 500 }}>{selectedSubmission.restaurant_name}</div>
              </div>
            )}

            {selectedSubmission.interests && selectedSubmission.interests.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-gray-text)', marginBottom: '8px' }}>Interests</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {selectedSubmission.interests.map(interest => (
                    <span key={interest} style={{
                      background: 'var(--color-gray-light)',
                      padding: '4px 12px',
                      borderRadius: '100px',
                      fontSize: '13px'
                    }}>
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedSubmission.sample_varieties && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-gray-text)', marginBottom: '4px' }}>Requested Varieties</div>
                <div>{selectedSubmission.sample_varieties}</div>
              </div>
            )}

            {selectedSubmission.delivery_address && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-gray-text)', marginBottom: '4px' }}>Delivery Address</div>
                <div style={{ whiteSpace: 'pre-line' }}>{selectedSubmission.delivery_address}</div>
              </div>
            )}

            {(selectedSubmission.message || selectedSubmission.notes || selectedSubmission.subject) && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-gray-text)', marginBottom: '4px' }}>
                  {selectedSubmission.subject ? `Message: ${selectedSubmission.subject}` : 'Message / Notes'}
                </div>
                <div style={{
                  background: 'var(--color-gray-light)',
                  padding: '16px',
                  borderRadius: '8px',
                  whiteSpace: 'pre-line'
                }}>
                  {selectedSubmission.message || selectedSubmission.notes || '—'}
                </div>
              </div>
            )}

            <div style={{ fontSize: '12px', color: 'var(--color-gray-text)', marginBottom: '24px' }}>
              Received: {formatDate(selectedSubmission.created_at)}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <select
                value={selectedSubmission.status}
                onChange={(e) => handleStatusChange(selectedSubmission.id, e.target.value)}
                className="form-select"
                style={{ flex: 1 }}
              >
                <option value="new">New</option>
                <option value="replied">Replied</option>
                <option value="archived">Archived</option>
              </select>
              <a
                href={`mailto:${selectedSubmission.email}?subject=Re: Your Belarro inquiry`}
                className="btn btn-primary"
              >
                Reply
              </a>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(selectedSubmission.id)}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
