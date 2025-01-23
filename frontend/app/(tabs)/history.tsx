import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Event {
  [key: string]: any; // Dynamic keys based on the database schema
}

const MatchTable: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]); // Store events fetched from the database
  const [columns, setColumns] = useState<string[]>([]); // Store column names dynamically

  // Fetch event data and dynamically determine the columns
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        axios.defaults.baseURL = 'http://localhost:4000'; // Set base URL for all axios requests

        // Fetch events from the database
        const response = await axios.get('/api/events'); // Replace with your API endpoint
        const eventData = response.data;

        if (eventData.length > 0) {
          // Dynamically determine column names from the first event
          const columnNames = Object.keys(eventData[0]);
          setColumns(columnNames);
        }

        setEvents(eventData); // Store event data
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };

    fetchEventData(); // Call the function to fetch data
  }, []); // Run once when the component mounts

  return (
    <div style={{ margin: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif', backgroundColor: 'white', color: 'black' }}>
      <h1 style={{ marginBottom: '20px' }}>Event Table</h1>

      <table
        style={{
          width: '80%',
          margin: '0 auto',
          borderCollapse: 'collapse',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            {/* Dynamically generate table headers */}
            {columns.map((column, index) => (
              <th
                key={index}
                style={{
                  padding: '12px',
                  fontWeight: 'bold',
                  borderBottom: '2px solid #ddd',
                  textTransform: 'capitalize', // Make column names more readable
                }}
              >
                {column.replace(/([A-Z])/g, ' $1')} {/* Format camelCase to spaced */}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Render event data dynamically */}
          {events.length > 0 ? (
            events.map((event, rowIndex) => (
              <tr key={rowIndex} style={{ borderBottom: '1px solid #ddd' }}>
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    style={{
                      padding: '12px',
                      textAlign: 'center',
                    }}
                  >
                    {event[column]} {/* Render value for the column */}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ padding: '15px', textAlign: 'center' }}>
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MatchTable;
