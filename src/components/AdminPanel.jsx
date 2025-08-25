import React, { useState } from 'react';
import FamillesManager from './FamillesManager';
import ClassesManager from './ClassesManager';
import SemainesManager from './SemainesManager';
import LoginModal from './LoginModal';
import { PlanningManager } from './PlanningManager';
import { WeekCreator } from './WeekCreator';
import ExclusionsOverview from './ExclusionsOverview';
import SMSManager from './SMSManager';
import ScheduledSMSManager from './ScheduledSMSManager';

function AdminPanel({ token, isAdmin, canEdit, loginAdmin, logoutAdmin, refreshData, toggleSemainePublication, planningData, sessionToken }) {
  const [activeTab, setActiveTab] = useState('planning');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSMSManager, setShowSMSManager] = useState(false);

  const handleLogin = async (password) => {
    const result = await loginAdmin(password);
    if (result.success) {
      setShowLoginModal(false);
    }
    return result;
  };

  const tabs = [
    { id: 'planning', label: '📋 Plannings', component: 'PlanningTab' },
    { id: 'familles', label: '👥 Familles', component: FamillesManager },
    { id: 'classes', label: '🏠 Classes', component: ClassesManager },
    { id: 'semaines', label: '📅 Semaines', component: SemainesManager },
    { id: 'exclusions', label: '🚫 Exclusions', component: ExclusionsOverview },
    { id: 'sms', label: '📱 SMS', component: 'SMSTab' },
    { id: 'scheduled-sms', label: '⏰ SMS Planifiés', component: ScheduledSMSManager }
  ];

  if (!isAdmin) {
    return (
      <div className="admin-panel">
        <div className="admin-header">
          <h2>Administration</h2>
          <button 
            onClick={() => setShowLoginModal(true)}
            className="btn btn-primary"
          >
            🔑 Connexion Admin
          </button>
        </div>
        
        {showLoginModal && (
          <LoginModal
            onLogin={handleLogin}
            onClose={() => setShowLoginModal(false)}
          />
        )}
      </div>
    );
  }

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>🔧 Administration</h2>
        <div className="admin-controls">
          <span className="admin-status">✅ Connecté en tant qu'admin</span>
          <button 
            onClick={logoutAdmin}
            className="btn btn-secondary"
          >
            🚪 Déconnexion
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {activeTab === 'planning' && (
          <>
            <PlanningManager 
              currentPlanning={planningData?.planning}
              isAdmin={isAdmin}
            />
            <WeekCreator
              token={token}
              isAdmin={isAdmin}
              sessionToken={sessionToken}
              onWeekCreated={refreshData}
            />
          </>
        )}
        {activeTab === 'familles' && (
          <FamillesManager 
            token={token}
            canEdit={canEdit}
            refreshData={refreshData}
            sessionToken={sessionToken}
          />
        )}
        {activeTab === 'classes' && (
          <ClassesManager 
            token={token}
            canEdit={canEdit}
            refreshData={refreshData}
          />
        )}
        {activeTab === 'semaines' && (
          <SemainesManager 
            token={token}
            canEdit={canEdit}
            refreshData={refreshData}
            toggleSemainePublication={toggleSemainePublication}
          />
        )}
        {activeTab === 'exclusions' && (
          <ExclusionsOverview 
            token={token}
          />
        )}
        {activeTab === 'sms' && (
          <div className="sms-tab">
            <div className="tab-header">
              <h3>📱 Communication SMS</h3>
              <p>Envoyez des SMS aux familles pour les informer des affectations et rappels.</p>
            </div>
            <button 
              onClick={() => setShowSMSManager(true)}
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
            >
              📱 Ouvrir le gestionnaire SMS
            </button>
            
            {showSMSManager && (
              <SMSManager
                currentPlanning={planningData?.planning}
                adminSession={sessionToken}
                semaines={planningData?.semaines || []}
                familles={planningData?.familles || []}
                onClose={() => setShowSMSManager(false)}
              />
            )}
          </div>
        )}
        {activeTab === 'scheduled-sms' && (
          <ScheduledSMSManager 
            token={token}
            sessionToken={sessionToken}
            canEdit={canEdit}
          />
        )}
      </div>

      <style jsx>{`
        .admin-panel {
          margin: 20px 0;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          background: #f9f9f9;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #f0f0f0;
          border-bottom: 1px solid #ddd;
          border-radius: 8px 8px 0 0;
        }

        .admin-header h2 {
          margin: 0;
          color: #333;
        }

        .admin-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin-status {
          color: #28a745;
          font-weight: 500;
        }

        .admin-tabs {
          display: flex;
          background: #fff;
          border-bottom: 1px solid #ddd;
        }

        .tab {
          padding: 12px 20px;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          border-bottom: 3px solid transparent;
          transition: all 0.2s;
        }

        .tab:hover {
          background: #f8f9fa;
        }

        .tab.active {
          background: #fff;
          border-bottom-color: #007bff;
          color: #007bff;
        }

        .admin-content {
          padding: 20px;
          background: #fff;
          border-radius: 0 0 8px 8px;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover {
          background: #0056b3;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background: #545b62;
        }
      `}</style>
    </div>
  );
}

export default AdminPanel; 