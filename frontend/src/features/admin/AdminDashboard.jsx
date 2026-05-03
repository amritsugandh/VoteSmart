import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import logo from '@/assets/logo.png';
import './AdminDashboard.css';
import './AdminDashboardLogin.css';

export default function AdminDashboard() {
  const { t } = useTranslation();
  
  // Admin Authentication State
  const [isAdminAuth, setIsAdminAuth] = useState(() => {
    return sessionStorage.getItem('adminAuth') === 'true';
  });
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Navigation State
  const [activeTab, setActiveTab] = useState('registry');

  // Data State
  const [registrations, setRegistrations] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Action State
  const [selectedReg, setSelectedReg] = useState(null);
  const [editingStatusId, setEditingStatusId] = useState(null);
  
  // Calculate stats
  const totalRegistrations = registrations.length;
  const pendingRegistrations = registrations.filter(r => r.status === 'pending').length;
  const verifiedRegistrations = registrations.filter(r => r.status === 'verified').length;
  const rejectedRegistrations = registrations.filter(r => r.status === 'rejected').length;

  useEffect(() => {
    if (!isAdminAuth) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Registrations
        const regRes = await fetch('http://localhost:8000/api/registration/all');
        const regData = await regRes.json();
        setRegistrations(regData);

        // Fetch Feedback
        const fbRes = await fetch('http://localhost:8000/api/feedback/all');
        const fbData = await fbRes.json();
        setFeedback(fbData);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdminAuth]);

  const handleExportCSV = () => {
    if (registrations.length === 0) return;
    
    const headers = ['ID', 'Name', 'Father Name', 'DOB', 'Gender', 'Email', 'Phone', 'State', 'District', 'Pincode', 'ID Type', 'ID Number', 'Status'];
    const csvContent = [
      headers.join(','),
      ...registrations.map(r => [
        r.id, 
        `"${r.name || ''}"`, 
        `"${r.father_name || ''}"`, 
        r.dob || '', 
        r.gender || '', 
        `"${r.email || ''}"`, 
        `"${r.phone || ''}"`, 
        `"${r.state || ''}"`, 
        `"${r.district || ''}"`, 
        r.pincode || '', 
        `"${r.id_type || ''}"`, 
        `"${r.id_number || ''}"`, 
        r.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `votesmart_registrations_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/api/registration/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setRegistrations(prev => prev.map(reg => reg.id === id ? { ...reg, status: newStatus } : reg));
        setEditingStatusId(null);
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminEmail === 'admin@votesmart.in' && adminPassword === 'admin123') {
      setIsAdminAuth(true);
      sessionStorage.setItem('adminAuth', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid Admin Credentials');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuth(false);
    sessionStorage.removeItem('adminAuth');
    setAdminEmail('');
    setAdminPassword('');
  };

  if (!isAdminAuth) {
    return (
      <div className="admin-login-wrapper fade-in">
        <div className="admin-login-box">
          <div className="admin-login-header">
            <span className="admin-login-icon">🛡️</span>
            <h2>Admin Portal Access</h2>
            <p>Restricted to authorized personnel only.</p>
          </div>
          <form onSubmit={handleAdminLogin} className="admin-login-form">
            <div className="form-group">
              <label>Admin Email</label>
              <input 
                type="email" 
                className="form-input"
                placeholder="admin@votesmart.in"
                value={adminEmail} 
                onChange={e => setAdminEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Admin Password</label>
              <input 
                type="password" 
                className="form-input"
                placeholder="••••••••"
                value={adminPassword} 
                onChange={e => setAdminPassword(e.target.value)} 
                required 
              />
            </div>
            {authError && <div className="admin-auth-error">⚠️ {authError}</div>}
            <button type="submit" className="btn btn-primary w-100">Authenticate Access</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <img src={logo} alt="" className="brand-logo-img" />
          <div>
            <h2>VoteSmart</h2>
            <p>Admin Portal</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'registry' ? 'active' : ''}`}
            onClick={() => setActiveTab('registry')}
          >
            <span className="nav-icon">📊</span> Registry
          </button>
          <button 
            className={`nav-item ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
          >
            <span className="nav-icon">💬</span> User Feedback
          </button>
          <button 
            className={`nav-item ${activeTab === 'live' ? 'active' : ''}`}
            onClick={() => setActiveTab('live')}
          >
            <span className="nav-icon">🌐</span> Live Portal View
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-user">
            <div className="user-avatar">AD</div>
            <div className="user-info">
              <span>Admin User</span>
              <p>System Admin</p>
            </div>
          </div>
          <button onClick={handleAdminLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">


        <div className="tab-content">
          {activeTab === 'registry' && (
            <div className="registry-tab fade-in">
              <div className="tab-header">
                <h2>Voter Registry</h2>
                <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>Export CSV</button>
              </div>
              <div className="admin-stats-grid">
                <div className="stat-card">
                  <div className="stat-icon-wrapper">👥</div>
                  <div className="stat-content">
                    <p className="stat-value gradient-text">{loading ? '...' : totalRegistrations}</p>
                    <p className="stat-label">Total Applications</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon-wrapper">⏳</div>
                  <div className="stat-content">
                    <p className="stat-value gradient-text">{loading ? '...' : pendingRegistrations}</p>
                    <p className="stat-label">Pending Review</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon-wrapper">✅</div>
                  <div className="stat-content">
                    <p className="stat-value gradient-text">{loading ? '...' : verifiedRegistrations}</p>
                    <p className="stat-label">Verified Voters</p>
                  </div>
                </div>
              </div>

              <div className="admin-table-section">
                {loading ? (
                  <div className="admin-loading"><div className="spinner"></div><p>Loading registry...</p></div>
                ) : registrations.length === 0 ? (
                  <div className="admin-empty"><p>No registrations found.</p></div>
                ) : (
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Applicant Name</th>
                          <th>State</th>
                          <th>District</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registrations.map((reg) => (
                          <tr key={reg.id} className="table-row">
                            <td className="col-id">#{reg.id}</td>
                            <td className="col-name">{reg.name}</td>
                            <td>{reg.state}</td>
                            <td>{reg.district}</td>
                            <td className="col-status">
                              {editingStatusId === reg.id ? (
                                <select 
                                  className="status-select" 
                                  defaultValue={reg.status}
                                  onChange={(e) => updateStatus(reg.id, e.target.value)}
                                  onBlur={() => setEditingStatusId(null)}
                                  autoFocus
                                >
                                  <option value="pending">Pending</option>
                                  <option value="verified">Verified</option>
                                  <option value="rejected">Rejected</option>
                                </select>
                              ) : (
                                <span className={`status-badge status-${reg.status.toLowerCase()}`}>
                                  {reg.status}
                                </span>
                              )}
                            </td>
                            <td>
                              <button className="action-btn" onClick={() => setSelectedReg(reg)}>👁️</button>
                              <button className="action-btn" onClick={() => setEditingStatusId(reg.id)}>✏️</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="feedback-tab fade-in">
              <div className="tab-header">
                <h2>User Feedback</h2>
              </div>
              {loading ? (
                <div className="admin-loading"><div className="spinner"></div><p>Loading feedback...</p></div>
              ) : feedback.length === 0 ? (
                <div className="admin-empty"><p>No user feedback received yet.</p></div>
              ) : (
                <div className="feedback-list">
                  {feedback.map((item) => (
                    <div key={item.id} className="feedback-card">
                      <div className="feedback-header">
                        <span className={`type-tag tag-${item.type.toLowerCase().split(' ')[1]}`}>
                          {item.type}
                        </span>
                        <span className="feedback-date">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="feedback-message">"{item.message}"</p>
                      <div className="feedback-footer">
                        <div className="feedback-rating">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < item.rating ? 'star active' : 'star'}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'live' && (
            <div className="preview-tab fade-in">
              <div className="preview-container full-view">
                <div className="browser-header">
                  <div className="browser-dot dot-red"></div>
                  <div className="browser-dot dot-yellow"></div>
                  <div className="browser-dot dot-green"></div>
                  <div className="browser-address">localhost:3000</div>
                </div>
                <iframe 
                  src={window.location.origin} 
                  className="website-iframe"
                  title="Live Portal View"
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Details Modal */}
      {selectedReg && (
        <div className="admin-modal-overlay" onClick={() => setSelectedReg(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Applicant Detail: {selectedReg.name}</h2>
              <button className="close-btn" onClick={() => setSelectedReg(null)}>✕</button>
            </div>
            <div className="modal-content">
              <div className="detail-grid">
                <div className="detail-item"><label>Name:</label> <span>{selectedReg.name}</span></div>
                <div className="detail-item"><label>DOB:</label> <span>{selectedReg.dob}</span></div>
                <div className="detail-item"><label>State:</label> <span>{selectedReg.state}</span></div>
                <div className="detail-item"><label>District:</label> <span>{selectedReg.district}</span></div>
                <div className="detail-item"><label>Email:</label> <span>{selectedReg.email}</span></div>
                <div className="detail-item"><label>Phone:</label> <span>{selectedReg.phone}</span></div>
                <div className="detail-item full-width"><label>ID Detail:</label> <span>{selectedReg.id_type} - {selectedReg.id_number}</span></div>
                <div className="detail-item full-width"><label>Address:</label> <span>{selectedReg.address}</span></div>
              </div>
              <div className="modal-actions">
                <button className="btn btn-primary" onClick={() => setSelectedReg(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
