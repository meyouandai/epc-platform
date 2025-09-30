import React, { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';

const SimpleTest: React.FC = () => {
  const [name, setName] = useState('');
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchCount = async () => {
    try {
      const response = await apiCall('/api/simple/count');
      const data = await response.json();
      if (data.success) {
        setCount(data.count);
      }
    } catch (error) {
      console.error('Error fetching count:', error);
    }
  };

  const addName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await apiCall('/api/simple/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`Added "${name}" successfully!`);
        setName('');
        fetchCount(); // Refresh count
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Simple Database Test</h1>

      <div style={{ marginBottom: '30px', padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
        <h2>Total Names: {count}</h2>
      </div>

      <form onSubmit={addName}>
        <div style={{ marginBottom: '20px' }}>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                marginLeft: '10px',
                padding: '8px',
                fontSize: '16px',
                width: '200px'
              }}
              disabled={loading}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !name.trim()}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Adding...' : 'Add Name'}
        </button>
      </form>

      {message && (
        <div style={{
          marginTop: '20px',
          padding: '10px',
          background: message.includes('Error') ? '#ffebee' : '#e8f5e8',
          color: message.includes('Error') ? '#c62828' : '#2e7d32',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}

      <div style={{ marginTop: '40px', fontSize: '14px', color: '#666' }}>
        <p>This tests the basic connection:</p>
        <ul>
          <li>Frontend (Vercel) → Backend (Railway)</li>
          <li>Add name to database</li>
          <li>Count updates in real-time</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleTest;