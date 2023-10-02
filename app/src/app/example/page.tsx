"use client";
import React from 'react'; // Import useClient
import MatterSim from '../components/MatterSim'; // Update the path
import '../globals.css';

const HomePage: React.FC = () => {

  return (
    <div id="matter-canvas-container" style={{
      position: 'absolute',
      top: '100px', // Adjust as needed
      left: '50%',
      transform: 'translateX(-50%)'
    }}
    >
      <MatterSim />
    </div>
  );
};

export default HomePage;

