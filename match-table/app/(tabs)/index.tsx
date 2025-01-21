import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define the Fight interface to type the incoming fight data
interface Fight {
  name1: string;
  name2: string;
  weightClass: string;
}

interface FightEvent {
  date: string;
  eventName: string;
  location: string;
  card: Fight[];
}

const MatchTable: React.FC = () => {
  const [highlighted, setHighlighted] = useState<{ [index: number]: { X: string | null, Y: string | null } }>({});
  const [event, setEvent] = useState<FightEvent | null>(null);
  const [isButtonPressed, setIsButtonPressed] = useState(false); // Track button press state

  // Fetch fight data on component mount
  useEffect(() => {
    const fetchFightData = async () => {
      try {
        console.log("Fetching fight data...");
        axios.defaults.baseURL = 'http://localhost:4000'; // Set base URL for all axios requests

        const response = await axios.get('/api/fights'); // API endpoint
        console.log('Fetched fight data:', response.data);  // Log the fetched data
        setEvent(response.data); // Set the event data from the response
      } catch (error) {
        console.error('Error fetching fight data:', error);
      }
    };

    fetchFightData(); // Fetch fight data
  }, []); // Empty array means this runs once when the component mounts

  const handleHighlight = (side: 'X' | 'Y', index: number, fighterName: string) => {
    setHighlighted(prevState => ({
      ...prevState,
      [index]: {
        ...prevState[index],
        [side]: prevState[index]?.[side] === fighterName ? null : fighterName, // Toggle between the fighter name and null
      }
    }));
  };

  const handleLockItIn = async () => {
    console.log('Selected Fighters:', highlighted); // Log the selected fighters' state
  
    try {
      await axios.post('/button-pressed', {
        highlighted, // Send the highlighted state to the backend
      });
      console.log('State sent to backend successfully');
    } catch (error) {
      console.error('Error sending state to backend:', error);
    }
  };
  

  return (
    <div style={{ margin: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif', backgroundColor: 'white', color: 'black' }}>
      {/* Display the event details if available */}
      {event && (
        <>
          <h1>{event.eventName}</h1>
          <p>{event.date}</p>
          <p>{event.location}</p>
        </>
      )}

      <h2 style={{ marginBottom: '10px' }}>Fight Card</h2>
      <table
        style={{
          width: '60%',
          margin: '0 auto',
          borderCollapse: 'separate',
          borderSpacing: '0',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: 'white', // Ensures table is not affected by dark mode
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '12px', fontWeight: 'bold' }}>Fighter X</th>
            <th style={{ padding: '12px', fontWeight: 'bold' }}>vs</th>
            <th style={{ padding: '12px', fontWeight: 'bold' }}>Fighter Y</th>
            <th style={{ padding: '12px', fontWeight: 'bold' }}>Weight Class</th>
          </tr>
        </thead>
        <tbody>
          {event?.card.length > 0 ? (
            event.card.map((fight, index) => {
              const rowHighlight = highlighted[index] || { name1: false, name2: false };

              return (
                <tr key={index}>
                  <td
  style={{
    padding: '15px',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: highlighted[index]?.X === fight.name1 ? '#ff4d4f' : 'white',
    color: highlighted[index]?.X === fight.name1 ? 'white' : '#333',
    transition: 'background-color 0.3s, color 0.3s',
    borderBottom: '1px solid #ddd',
  }}
  onClick={() => handleHighlight('X', index, fight.name1)} // Pass name of fighter 1
>
  {fight.name1}
</td>

                  <td
                    style={{
                      padding: '15px',
                      textAlign: 'center',
                      color: '#666',
                      borderBottom: '1px solid #ddd',
                    }}
                  >
                    vs
                  </td>
                  <td
  style={{
    padding: '15px',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: highlighted[index]?.Y === fight.name2 ? '#1890ff' : 'white',
    color: highlighted[index]?.Y === fight.name2 ? 'white' : '#333',
    transition: 'background-color 0.3s, color 0.3s',
    borderBottom: '1px solid #ddd',
  }}
  onClick={() => handleHighlight('Y', index, fight.name2)} // Pass name of fighter 2
>
  {fight.name2}
</td>
                  <td style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                    {fight.weightClass}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4} style={{ padding: '15px', textAlign: 'center' }}>
                No fight data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Lock it in Button */}
      <button
  onClick={handleLockItIn}
  style={{
    width: '100%',
    padding: '15px',
    backgroundColor: '#f1c40f', // Yellow color
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  }}
>
  Lock it In
</button>
    </div>
  );
};

export default MatchTable;
