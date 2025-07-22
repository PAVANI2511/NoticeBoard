
import React, { useEffect, useState } from 'react';
import './DepartmentStats.css';

const DepartmentStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch('http://127.0.0.1:8000/api/students/statistics/', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch statistics');

        const data = await response.json();
        console.log("📊 Department Statistics API Response:", data);

        const uploadStatsRaw = localStorage.getItem('latest_upload_stats');
        if (uploadStatsRaw) {
          const uploadStats = JSON.parse(uploadStatsRaw);
          const uploadedTime = new Date(uploadStats.timestamp);
          const now = new Date();
          const diffInSeconds = (now - uploadedTime) / 1000;

          if (diffInSeconds < 60 && uploadStats.emails_sent != null) {
            data.emails_sent = uploadStats.emails_sent;
          }
        }

        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    if (stats) {
      localStorage.removeItem('latest_upload_stats');
    }
  }, [stats]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="department-stats">
      <h2>📌 Department Statistics Overview</h2>

      <div className="overall">
        <p><strong>Total Students:</strong> {stats.total_students}</p>
        <p><strong>Gmail:</strong> ✅ {stats.students_with_gmail} | ❌ {stats.students_missing_gmail}</p>
        <p><strong>Room:</strong> ✅ {stats.students_with_room} | ❌ {stats.students_missing_room}</p>
        <p><strong>Ready for Email:</strong> {stats.students_ready_for_email}</p>
        <p><strong>Emails:</strong> ✉️ {stats.emails_sent} sent | ⏳ {stats.emails_pending} pending</p>
      </div>

      <hr />

      {Object.entries(stats.branches_statistics || {}).map(([branchCode, branchData]) => (
        <div key={branchCode} className="branch-block">
          <h3>🏛️ {branchData.name}</h3>
          <p>
            Total: {branchData.count}, Sent: {branchData.emails_sent}, Ready: {branchData.ready_for_email}
          </p>
          <p>
            Missing Gmail: {branchData.missing_gmail}, Missing Room: {branchData.missing_room}
          </p>

          {Object.entries(branchData.years || {}).map(([yearCode, yearData]) => (
            <div key={yearCode} className="year-block">
              <h4>🎓 {yearData.name}</h4>
              <p>
                Total: {yearData.count}, Sent: {yearData.emails_sent}, Pending: {yearData.emails_pending}
              </p>
              <p>
                Gmail: ✅ {yearData.with_gmail} | ❌ {yearData.missing_gmail}
              </p>
              <p>
                Room: ✅ {yearData.with_room} | ❌ {yearData.missing_room}
              </p>
              <p>
                Ready for Email: {yearData.ready_for_email}
              </p>

              {yearData.pending_email_students?.length > 0 && (
                <div className="student-list">
                  <strong>Pending Email Students:</strong>
                  <ul>
                    {yearData.pending_email_students.map((student) => (
                      <li key={student.id}>
                        {student.roll_number} - {student.name} ({student.gmail_address || 'No Gmail'}, Hall: {student.exam_hall_number || 'N/A'})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {yearData.missing_gmail_students?.length > 0 && (
                <div className="student-list">
                  <strong>Missing Gmail Students:</strong>
                  <ul>
                    {yearData.missing_gmail_students.map((student) => (
                      <li key={student.id}>
                        {student.roll_number} - {student.name}, Hall: {student.exam_hall_number || 'N/A'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {yearData.missing_room_students?.length > 0 && (
                <div className="student-list">
                  <strong>Missing Room Students:</strong>
                  <ul>
                    {yearData.missing_room_students.map((student) => (
                      <li key={student.id}>
                        {student.roll_number} - {student.name}, Gmail: {student.gmail_address || 'N/A'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
          <hr />
        </div>
      ))}

      {stats.global_pending_email_students?.length > 0 && (
        <div className="global-pending">
          <h3>🌐 Global Pending Email Students</h3>
          <ul>
            {stats.global_pending_email_students.map((student) => (
              <li key={student.id}>
                {student.roll_number} - {student.name} ({student.branch}, Year {student.year}) - {student.gmail_address || 'No Gmail'}, Hall: {student.exam_hall_number || 'N/A'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DepartmentStats;
