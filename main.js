import React, { useState } from 'react';

const MatchTable: React.FC = () => {
  const [highlighted, setHighlighted] = useState<'X' | 'Y' | null>(null);

  const handleHighlight = (side: 'X' | 'Y') => {
    setHighlighted(side);
  };

  return (
    <div style={{ margin: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ marginBottom: '10px' }}>Title</h2>
      <table
        style={{
          width: '60%',
          margin: '0 auto',
          borderCollapse: 'separate',
          borderSpacing: '0',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '12px', fontWeight: 'bold' }}>X vs Y</th>
            <th style={{ padding: '12px', fontWeight: 'bold' }}>Weight Class</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              style={{
                padding: '15px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: highlighted === 'X' ? '#ff4d4f' : 'white',
                color: highlighted === 'X' ? 'white' : '#333',
                transition: 'background-color 0.3s, color 0.3s',
                borderBottom: '1px solid #ddd',
              }}
              onClick={() => handleHighlight(highlighted === 'X' ? null : 'X')}
            >
              X
            </td>
            <td
              style={{
                padding: '15px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: highlighted === 'Y' ? '#1890ff' : 'white',
                color: highlighted === 'Y' ? 'white' : '#333',
                transition: 'background-color 0.3s, color 0.3s',
                borderBottom: '1px solid #ddd',
              }}
              onClick={() => handleHighlight(highlighted === 'Y' ? null : 'Y')}
            >
              Y
            </td>
            <td style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
              Lightweight
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MatchTable;
