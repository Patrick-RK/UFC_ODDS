import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Event {
  id: number;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  placeholder1: string;
  placeholder2: string;
  createdAt: string;
  updatedAt: string;
}

const EventTable: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div style={{ margin: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1>Saved Events</h1>
      <table
        style={{
          width: '90%',
          margin: '0 auto',
          borderCollapse: 'collapse',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '12px', fontWeight: 'bold', border: '1px solid #ddd' }}>ID</th>
            <th style={{ padding: '12px', fontWeight: 'bold', border: '1px solid #ddd' }}>Event Name</th>
            <th style={{ padding: '12px', fontWeight: 'bold', border: '1px solid #ddd' }}>Event Date</th>
            <th style={{ padding: '12px', fontWeight: 'bold', border: '1px solid #ddd' }}>Event Location</th>
            <th style={{ padding: '12px', fontWeight: 'bold', border: '1px solid #ddd' }}>Placeholder 1</th>
            <th style={{ padding: '12px', fontWeight: 'bold', border: '1px solid #ddd' }}>Placeholder 2</th>
            <th style={{ padding: '12px', fontWeight: 'bold', border: '1px solid #ddd' }}>Created At</th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map((event) => (
              <tr key={event.id}>
                <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>{event.id}</td>
                <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>{event.eventName}</td>
                <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>
                  {new Date(event.eventDate).toLocaleDateString()}
                </td>
                <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>{event.eventLocation}</td>
                <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>{event.placeholder1}</td>
                <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>{event.placeholder2}</td>
                <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>
                  {new Date(event.createdAt).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} style={{ padding: '15px', textAlign: 'center', border: '1px solid #ddd' }}>
                No events available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;
