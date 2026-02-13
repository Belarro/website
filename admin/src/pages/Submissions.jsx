import { useState, useEffect } from 'react'
import { submissionsApi } from '../lib/supabase'

// Helper to manage viewed submissions in localStorage
const getViewedSubmissions = () => {
  try {
    return JSON.parse(localStorage.getItem('viewedSubmissions') || '[]')
  } catch {
    return []
  }
}

const markSubmissionViewed = (id) => {
  const viewed = getViewedSubmissions()
  if (!viewed.includes(id)) {
    viewed.push(id)
    localStorage.setItem('viewedSubmissions', JSON.stringify(viewed))
    // Dispatch event so Layout can update
    window.dispatchEvent(new CustomEvent('submissionsUpdated'))
  }
}

export default function Submissions() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [viewedIds, setViewedIds] = useState(getViewedSubmissions())

  useEffect(() => {
    loadSubmissions()
    // Dispatch event to sync sidebar count
    window.dispatchEvent(new CustomEvent('submissionsUpdated'))
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

  const formatRelativeDate = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return formatDate(dateStr)
  }

  const getIntentLabel = (intent) => {
    switch (intent) {
      case 'weekly': return 'Weekly Setup'
      case 'samples': return 'Sample Request'
      case 'visit': return 'Book a Visit'
      case 'inquiry': return 'General Inquiry'
      default: return intent
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'new':
        return { background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }
      case 'replied':
        return { background: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe' }
      case 'archived':
        return { background: '#f3f4f6', color: '#6b7280', border: '1px solid #e5e7eb' }
      default:
        return { background: '#f3f4f6', color: '#6b7280', border: '1px solid #e5e7eb' }
    }
  }

  const getTypeIcon = (formType, intent) => {
    if (formType === 'contact') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      )
    }
    if (intent === 'samples') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        </svg>
      )
    }
    if (intent === 'visit') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      )
    }
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    )
  }

  const newCount = submissions.filter(s => s.status === 'new').length
  const unreadCount = submissions.filter(s => s.status === 'new' && !viewedIds.includes(s.id)).length

  const handleSelectSubmission = (submission) => {
    setSelectedSubmission(submission)
    markSubmissionViewed(submission.id)
    setViewedIds(getViewedSubmissions())
  }

  if (loading) {
    return (
      <div className="page-loading">
        <div><div className="skeleton skeleton-title"></div><div className="skeleton skeleton-subtitle"></div></div>
        <div className="skeleton skeleton-card"></div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1400px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '32px'
      }}>
        <div>
          <h1 style={{
            margin: '0 0 8px 0',
            fontSize: '28px',
            fontWeight: 600,
            color: '#111827'
          }}>
            Submissions
          </h1>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#6b7280'
          }}>
            {submissions.length} total submissions
            {unreadCount > 0 && (
              <span style={{
                marginLeft: '8px',
                padding: '2px 8px',
                background: '#dbeafe',
                color: '#1e40af',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 500
              }}>
                {unreadCount} unread
              </span>
            )}
            {newCount > 0 && newCount !== unreadCount && (
              <span style={{
                marginLeft: '8px',
                padding: '2px 8px',
                background: '#dcfce7',
                color: '#166534',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 500
              }}>
                {newCount} new
              </span>
            )}
          </p>
        </div>
        <button
          onClick={loadSubmissions}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseOver={e => e.currentTarget.style.background = '#f9fafb'}
          onMouseOut={e => e.currentTarget.style.background = 'white'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '24px',
        padding: '4px',
        background: '#f3f4f6',
        borderRadius: '10px',
        width: 'fit-content'
      }}>
        {[
          { key: 'all', label: 'All' },
          { key: 'new', label: `New${newCount > 0 ? ` (${newCount})` : ''}` },
          { key: 'start', label: 'Start Forms' },
          { key: 'contact', label: 'Contact' }
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '8px 16px',
              border: 'none',
              background: filter === f.key ? 'white' : 'transparent',
              color: filter === f.key ? '#111827' : '#6b7280',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              boxShadow: filter === f.key ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: selectedSubmission ? '1fr 400px' : '1fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Submissions List */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          {filteredSubmissions.length === 0 ? (
            <div style={{
              padding: '64px 24px',
              textAlign: 'center',
              color: '#9ca3af'
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 16px', opacity: 0.5 }}>
                <path d="M20 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7"/>
                <line x1="16" y1="19" x2="22" y2="19"/>
              </svg>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: 500, color: '#6b7280' }}>No submissions found</p>
              <p style={{ margin: '8px 0 0', fontSize: '13px' }}>Submissions will appear here when forms are submitted</p>
            </div>
          ) : (
            <div>
              {filteredSubmissions.map((submission, index) => (
                <div
                  key={submission.id}
                  onClick={() => handleSelectSubmission(submission)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 20px',
                    cursor: 'pointer',
                    background: selectedSubmission?.id === submission.id ? '#f8fafc' : 'white',
                    borderBottom: index < filteredSubmissions.length - 1 ? '1px solid #f3f4f6' : 'none',
                    transition: 'background 0.1s ease'
                  }}
                  onMouseOver={e => {
                    if (selectedSubmission?.id !== submission.id) {
                      e.currentTarget.style.background = '#fafafa'
                    }
                  }}
                  onMouseOut={e => {
                    if (selectedSubmission?.id !== submission.id) {
                      e.currentTarget.style.background = 'white'
                    }
                  }}
                >
                  {/* Unread Dot */}
                  {submission.status === 'new' && !viewedIds.includes(submission.id) && (
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#2563eb',
                      flexShrink: 0
                    }} />
                  )}

                  {/* Type Icon */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: submission.status === 'new' && !viewedIds.includes(submission.id) ? '#dbeafe' : '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: submission.status === 'new' && !viewedIds.includes(submission.id) ? '#2563eb' : '#6b7280',
                    flexShrink: 0
                  }}>
                    {getTypeIcon(submission.form_type, submission.intent)}
                  </div>

                  {/* Main Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '4px'
                    }}>
                      <span style={{
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#111827',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {submission.contact_name || submission.email.split('@')[0]}
                      </span>
                      <span style={{
                        ...getStatusStyle(submission.status),
                        padding: '2px 8px',
                        borderRadius: '100px',
                        fontSize: '11px',
                        fontWeight: 500,
                        textTransform: 'capitalize',
                        flexShrink: 0
                      }}>
                        {submission.status}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {submission.form_type === 'contact' ? 'Contact' : getIntentLabel(submission.intent)}
                      {submission.restaurant_name && ` · ${submission.restaurant_name}`}
                    </div>
                  </div>

                  {/* Date */}
                  <div style={{
                    fontSize: '12px',
                    color: '#9ca3af',
                    flexShrink: 0
                  }}>
                    {formatRelativeDate(submission.created_at)}
                  </div>

                  {/* Arrow */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" style={{ flexShrink: 0 }}>
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedSubmission && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            position: 'sticky',
            top: '24px'
          }}>
            {/* Panel Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #f3f4f6',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <h2 style={{
                  margin: '0 0 4px 0',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#111827'
                }}>
                  {selectedSubmission.contact_name || 'No name'}
                </h2>
                <a
                  href={`mailto:${selectedSubmission.email}`}
                  style={{
                    color: '#2563eb',
                    textDecoration: 'none',
                    fontSize: '14px'
                  }}
                >
                  {selectedSubmission.email}
                </a>
                {selectedSubmission.phone && (
                  <div style={{ marginTop: '4px' }}>
                    <a
                      href={`tel:${selectedSubmission.phone}`}
                      style={{ color: '#6b7280', textDecoration: 'none', fontSize: '13px' }}
                    >
                      {selectedSubmission.phone}
                    </a>
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Panel Content */}
            <div style={{ padding: '20px 24px' }}>
              {/* Type Badge */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#475569'
                }}>
                  {getTypeIcon(selectedSubmission.form_type, selectedSubmission.intent)}
                  <span style={{ fontWeight: 500 }}>
                    {selectedSubmission.form_type === 'contact' ? 'Contact Form' : getIntentLabel(selectedSubmission.intent)}
                  </span>
                </div>
              </div>

              {/* Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {selectedSubmission.restaurant_name && (
                  <div>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#9ca3af',
                      marginBottom: '6px'
                    }}>
                      Restaurant
                    </div>
                    <div style={{ fontSize: '14px', color: '#374151' }}>
                      {selectedSubmission.restaurant_name}
                    </div>
                  </div>
                )}

                {selectedSubmission.interests && selectedSubmission.interests.length > 0 && (
                  <div>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#9ca3af',
                      marginBottom: '8px'
                    }}>
                      Interests
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {selectedSubmission.interests.map(interest => (
                        <span key={interest} style={{
                          background: '#f1f5f9',
                          padding: '4px 10px',
                          borderRadius: '100px',
                          fontSize: '12px',
                          color: '#475569',
                          fontWeight: 500
                        }}>
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSubmission.sample_varieties && (
                  <div>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#9ca3af',
                      marginBottom: '6px'
                    }}>
                      Requested Varieties
                    </div>
                    <div style={{ fontSize: '14px', color: '#374151' }}>
                      {selectedSubmission.sample_varieties}
                    </div>
                  </div>
                )}

                {selectedSubmission.delivery_address && (
                  <div>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#9ca3af',
                      marginBottom: '6px'
                    }}>
                      {selectedSubmission.intent === 'visit' ? 'Kitchen Address' : 'Delivery Address'}
                    </div>
                    <div style={{ fontSize: '14px', color: '#374151', whiteSpace: 'pre-line' }}>
                      {selectedSubmission.delivery_address}
                    </div>
                  </div>
                )}

                {selectedSubmission.preferred_days && selectedSubmission.preferred_days.length > 0 && (
                  <div>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#9ca3af',
                      marginBottom: '8px'
                    }}>
                      Preferred Days
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {selectedSubmission.preferred_days.map(day => (
                        <span key={day} style={{
                          background: '#f1f5f9',
                          padding: '4px 10px',
                          borderRadius: '100px',
                          fontSize: '12px',
                          color: '#475569',
                          fontWeight: 500
                        }}>
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSubmission.preferred_times && selectedSubmission.preferred_times.length > 0 && (
                  <div>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#9ca3af',
                      marginBottom: '8px'
                    }}>
                      Preferred Times
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {selectedSubmission.preferred_times.map(time => (
                        <span key={time} style={{
                          background: '#f1f5f9',
                          padding: '4px 10px',
                          borderRadius: '100px',
                          fontSize: '12px',
                          color: '#475569',
                          fontWeight: 500
                        }}>
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedSubmission.message || selectedSubmission.notes || selectedSubmission.subject) && (
                  <div>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#9ca3af',
                      marginBottom: '6px'
                    }}>
                      {selectedSubmission.subject ? `Subject: ${selectedSubmission.subject}` : 'Message'}
                    </div>
                    <div style={{
                      background: '#f8fafc',
                      padding: '14px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: '#374151',
                      whiteSpace: 'pre-line',
                      lineHeight: 1.5
                    }}>
                      {selectedSubmission.message || selectedSubmission.notes || '—'}
                    </div>
                  </div>
                )}

                {/* Timestamp */}
                <div style={{
                  fontSize: '12px',
                  color: '#9ca3af',
                  paddingTop: '8px',
                  borderTop: '1px solid #f3f4f6'
                }}>
                  Received {formatDate(selectedSubmission.created_at)}
                </div>
              </div>
            </div>

            {/* Panel Actions */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #f3f4f6',
              display: 'flex',
              gap: '10px'
            }}>
              <select
                value={selectedSubmission.status}
                onChange={(e) => handleStatusChange(selectedSubmission.id, e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#374151',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="new">New</option>
                <option value="replied">Replied</option>
                <option value="archived">Archived</option>
              </select>
              <a
                href={`mailto:${selectedSubmission.email}?subject=Re: Your Belarro inquiry`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  background: '#2563eb',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Reply
              </a>
              <button
                onClick={() => handleDelete(selectedSubmission.id)}
                style={{
                  padding: '10px 12px',
                  background: 'white',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  color: '#dc2626',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

