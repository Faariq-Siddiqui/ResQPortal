import React, { useState, useEffect } from 'react';
import styles from './Donation.module.css';

const Donation = () => {
  const [expandedDisasterId, setExpandedDisasterId] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
  const disasters = [
    {
      id: 1,
      title: "Wildfire Relief",
      image: "/assets/wildfire.jpg",
      link: "https://donate.example.com/wildfire",
      description: "Support communities affected by devastating wildfires. Your donation provides emergency shelter, food, and resources to help rebuild homes and lives.",
      location: "California, USA",
      donationsNeeded: "Shelter, Food, Medical Supplies"
    },
    {
      id: 2,
      title: "Tsunami Response",
      image: "/assets/tsunami.jpg",
      link: "https://donate.example.com/tsunami",
      description: "Help survivors of coastal tsunamis access clean water, medical care, and emergency housing. Your support aids both immediate relief and long-term recovery.",
      location: "Southeast Asia",
      donationsNeeded: "Water, Hygiene Kits, Housing"
    },
    {
      id: 3,
      title: "Earthquake Recovery",
      image: "/assets/earthquake.jpg",
      link: "https://donate.example.com/earthquake",
      description: "Provide critical aid to regions devastated by earthquakes. Funds go toward search and rescue operations, emergency medical services, and rebuilding infrastructure.",
      location: "Nepal",
      donationsNeeded: "Medical Care, Construction, Food"
    },
    {
      id: 4,
      title: "Hurricane Relief",
      image: "/assets/hurricane.jpg",
      link: "https://donate.example.com/hurricane",
      description: "Support families affected by destructive hurricanes. Your donation helps provide shelter, food, clean water, and essential supplies to those who have lost their homes.",
      location: "Gulf Coast, USA",
      donationsNeeded: "Shelter, Food, Clothing"
    },
    {
      id: 5,
      title: "Flood Aid",
      image: "/assets/flood.jpg",
      link: "https://donate.example.com/flood",
      description: "Help communities recovering from severe flooding with emergency supplies, temporary housing, and resources to restore damaged homes and infrastructure.",
      location: "Bangladesh",
      donationsNeeded: "Clean Water, Sanitation, Shelter"
    },
    {
      id: 6,
      title: "Drought Response",
      image: "/assets/drought.jpg",
      link: "https://donate.example.com/drought",
      description: "Provide life-saving water, food, and agricultural support to regions experiencing severe drought conditions and food insecurity.",
      location: "Horn of Africa",
      donationsNeeded: "Water, Food, Agricultural Support"
    }
  ];

  // Theme toggle function
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    // Save preference to localStorage
    localStorage.setItem('donationTheme', !isDarkTheme ? 'dark' : 'light');
  };
  
  // Load theme preference from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('donationTheme');
    if (savedTheme) {
      setIsDarkTheme(savedTheme === 'dark');
    }
  }, []);

  // Close expanded card when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains(styles.expandedOverlay)) {
      setExpandedDisasterId(null);
    }
  };

  return (
    <div className={`${styles.container} ${isDarkTheme ? styles.darkTheme : styles.lightTheme}`}>
      {/* Theme Toggle Button */}
      <button 
        className={styles.themeToggle}
        onClick={toggleTheme}
        aria-label={isDarkTheme ? "Switch to light theme" : "Switch to dark theme"}
      >
        {isDarkTheme ? '☀️' : '🌙'}
      </button>
      
      <div className={styles.headerBox}>
        <h1 className={styles.heading}>Disaster Donation Portal</h1>
        <p className={styles.subHeading}>Click on a disaster to view details and contribute</p>
      </div>

      <div className={styles.gridContainer}>
        {disasters.map((disaster) => (
          <div 
            key={disaster.id}
            className={styles.card}
            onClick={() => setExpandedDisasterId(disaster.id)}
          >
            <div className={styles.imageContainer} 
                 style={{ backgroundImage: `url(${process.env.PUBLIC_URL}${disaster.image})` }} />
            
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>{disaster.title}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Expanded Card Modal */}
      {expandedDisasterId && (
        <div className={styles.expandedOverlay} onClick={handleBackdropClick}>
          <div className={styles.expandedCard} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.closeButton} 
              onClick={() => setExpandedDisasterId(null)}
            >
              ×
            </button>
            
            {disasters.filter(d => d.id === expandedDisasterId).map(disaster => (
              <div key={disaster.id} className={styles.expandedContent}>
                <div className={styles.expandedImageContainer}>
                  <img 
                    src={`${process.env.PUBLIC_URL}${disaster.image}`} 
                    alt={disaster.title} 
                    className={styles.expandedImage}
                  />
                </div>
                
                <div className={styles.expandedDetails}>
                  <h1 className={styles.expandedTitle}>{disaster.title}</h1>
                  
                  <div className={styles.expandedSection}>
                    <h3>Description</h3>
                    <p className={styles.expandedDescription}>{disaster.description}</p>
                  </div>
                  
                  <div className={styles.expandedInfoGrid}>
                    <div className={styles.infoBox}>
                      <h3>Location</h3>
                      <p>{disaster.location}</p>
                    </div>
                    <div className={styles.infoBox}>
                      <h3>Critical Needs</h3>
                      <p>{disaster.donationsNeeded}</p>
                    </div>
                  </div>
                  
                  <div className={styles.expandedSection}>
                    <h3>How Your Donation Helps</h3>
                    <ul className={styles.impactList}>
                      <li>Provides immediate relief to affected families</li>
                      <li>Supports disaster response teams on the ground</li>
                      <li>Helps rebuild essential infrastructure</li>
                      <li>Funds long-term recovery programs for communities</li>
                    </ul>
                  </div>
                  
                  <a 
                    href={disaster.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.expandedDonateButton}
                  >
                    Donate Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Donation;
