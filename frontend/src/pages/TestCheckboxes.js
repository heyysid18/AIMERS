import React, { useState } from 'react';

export default function TestCheckboxes() {
  const [completionStatus, setCompletionStatus] = useState({
    'test1': true,
    'test2': false,
    'test3': true
  });

  const handleToggle = (id, isCompleted) => {
    console.log('Toggling:', id, 'to:', isCompleted);
    setCompletionStatus(prev => ({
      ...prev,
      [id]: isCompleted
    }));
  };

  const getCompletionPercentage = () => {
    const total = Object.keys(completionStatus).length;
    const completed = Object.values(completionStatus).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Checkbox Test Page</h1>
      
      <div className="progress-overview">
        <div className="progress-stats">
          <span className="progress-text">Overall Progress: {getCompletionPercentage()}%</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${getCompletionPercentage()}%` }}
            ></div>
          </div>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>✅ Completed</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>📄 Topic</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(completionStatus).map(([id, isCompleted]) => (
            <tr key={id} className={isCompleted ? 'completed-row' : ''}>
              <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={(e) => handleToggle(id, e.target.checked)}
                    className="completion-checkbox"
                  />
                  <span className="checkmark"></span>
                </label>
              </td>
              <td className={isCompleted ? 'completed-topic' : ''} style={{ padding: '10px', border: '1px solid #ddd' }}>
                Test Topic {id}
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                {isCompleted ? '✅ Completed' : '⏳ Pending'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h3>Debug Info:</h3>
        <pre>{JSON.stringify(completionStatus, null, 2)}</pre>
      </div>
    </div>
  );
} 