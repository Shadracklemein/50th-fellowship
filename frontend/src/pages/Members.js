import React, { useEffect, useState } from 'react';

function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/members`)
      .then(res => res.json())
      .then(data => {
        setMembers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching members:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading members...</div>;

  return (
    <div>
      <h1>Members Page</h1>
      <ul>
        {members.map(member => (
          <li key={member._id} style={{ marginBottom: '1rem' }}>
            <strong>{member.name}</strong> <br />
            Email: {member.email} <br />
            Phone: {member.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Members; 