import React, { useState } from 'react';
import DepartmentStats from './DepartmentStats';
import StudentStatusViewer from './StudentStatusViewer';
import ResendEmails from './ResendEmails';
import './StudentDashboard.css';


const EmailDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');

  return (
    <div className="dashboard-container">
      <h1>📚 Student Email Dashboard</h1>

      <div className="tab-buttons">
        <button
          className={activeTab === 'stats' ? 'active' : ''}
          onClick={() => setActiveTab('stats')}
        >
          📊 Department Stats
        </button>
        <button
          className={activeTab === 'viewer' ? 'active' : ''}
          onClick={() => setActiveTab('viewer')}
        >
          🔍 View by Status
        </button>
        <button
          className={activeTab === 'resend' ? 'active' : ''}
          onClick={() => setActiveTab('resend')}
        >
          📨 Resend Emails
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'stats' && <DepartmentStats />}
        {activeTab === 'viewer' && <StudentStatusViewer />}
        {activeTab === 'resend' && <ResendEmails />}
      </div>
    </div>
  );
};

export default EmailDashboard;
