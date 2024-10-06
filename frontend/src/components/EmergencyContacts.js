import React from 'react';
import './EmergencyContacts.css'; // Assuming you'll have some styles

function EmergencyContacts() {
  const contacts = [
    {
      campus: 'St. George Campus',
      securityNumber: '416-978-2222',
      emergencyNumber: '416-978-2222',
      description: 'Campus Safety Office'
    },
    {
      campus: 'UTM Campus',
      securityNumber: '905-569-4333',
      emergencyNumber: '905-569-4333',
      description: 'UTM Campus Police'
    },
    {
      campus: 'UTSC Campus',
      securityNumber: '416-287-7398',
      emergencyNumber: '416-287-7333',
      description: 'UTSC Campus Safety and Security'
    }
  ];

  return (
    <div className="emergency-contacts-container">
      <h1>Emergency Contacts</h1>
      <p>Click a number to initiate a call:</p>
      <div className="contacts-list">
        {contacts.map((contact, index) => (
          <div key={index} className="contact-card">
            <h2>{contact.campus}</h2>
            <p>
              <strong>Security Number:</strong>{' '}
              <a href={`tel:${contact.securityNumber}`}>{contact.securityNumber}</a>
            </p>
            <p>
              <strong>Emergency Number:</strong>{' '}
              <a href={`tel:${contact.emergencyNumber}`}>{contact.emergencyNumber}</a>
            </p>
            <p>{contact.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmergencyContacts;
