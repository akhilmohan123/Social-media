import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';

function GroupDetails({ group, onBack }) {
  const [joined, setJoined] = useState(false);
  const [requested, setRequested] = useState(false);

  const handleJoin = () => {
    // Simulate API call
    setJoined(true);
    console.log(`Joined ${group.groupname}`);
  };

  const handleRequest = () => {
    // Simulate API call
    setRequested(true);
    console.log(`Requested to join ${group.groupname}`);
  };

  return (
    <div
      className="p-4"
      style={{
        minHeight: '100vh',
        borderRadius: '30px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        backgroundColor: '#fff'
      }}
    >
      {/* Header */}
<div className="row align-items-center mb-4">
  <div className="col-auto">
    <Button variant="outline-danger" onClick={onBack} size="sm">
      ← Back
    </Button>
  </div>
  <div className="col text-center">
    <h4 className="text-secondary mb-0">
      <span className="text-dark">{group.groupname}</span>
    </h4>
  </div>
</div>


      {/* Description */}
      <p className="text-muted">{group.description || 'No description provided.'}</p>

      {/* Conditional Buttons */}
      {!joined && !requested && (
        group.type === 'public' ? (
          <Button variant="success" onClick={handleJoin}>
            ✅ Join Group
          </Button>
        ) : (
          <Button variant="primary" onClick={handleRequest}>
            📩 Request to Join
          </Button>
        )
      )}

      {/* Result Message */}
      {joined && <p className="text-success mt-3">You have joined this group.</p>}
      {requested && <p className="text-info mt-3">Join request sent successfully.</p>}
    </div>
  );
}

export default GroupDetails;
