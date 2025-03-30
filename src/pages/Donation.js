import React, { useState } from 'react';
import styles from './Donation.module.css';

const Donation = () => {
  const [expandedDisasterId, setExpandedDisasterId] = useState(null);
  
  const disasters = [
    {
      id: 1,
      title: "Wildfire Relief",
      image: "https://example.com/wildfire.jpg",
      link: "https://donate.example.com/wildfire",
      description: "Support communities affected by devastating wildfires...",
      location: "California, USA",
      donationsNeeded: "Shelter, Food, Medical Supplies"
    },
    // Add more disaster objects here
  ];

  return (
    <div className={styles.container}>
      <div className={styles.headerBox}>
        <h1 className={styles.heading}>Disaster Donation Portal</h1>
        <p className={styles.subHeading}>Click on a disaster to view details and contribute</p>
      </div>

      <div className={styles.gridContainer}>
        {disasters.map((disaster) => (
          <div 
            key={disaster.id}
            className={`${styles.card} ${expandedDisasterId === disaster.id ? styles.expanded : ''}`}
            onClick={() => setExpandedDisasterId(expandedDisasterId === disaster.id ? null : disaster.id)}
          >
            <div className={styles.imageContainer} 
                 style={{ backgroundImage: `url(${disaster.image})` }} />
            
            {expandedDisasterId === disaster.id && (
              <div className={styles.details}>
                <h3>{disaster.title}</h3>
                <p>{disaster.description}</p>
                <div className={styles.meta}>
                  <span>Location: {disaster.location}</span>
                  <span>Needs: {disaster.donationsNeeded}</span>
                </div>
                <a 
                  href={disaster.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.donateButton}
                >
                  Donate Now
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Donation;
