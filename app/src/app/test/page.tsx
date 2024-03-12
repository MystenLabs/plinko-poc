"use client";
import Popup from "@/components/PopUpPicker";
import React, { useState } from "react";

const App: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(true);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSubmitPopup = (betSize: string, numberOfBalls: string) => {
    console.log(`Bet Size: ${betSize}, Number of Balls: ${numberOfBalls}`);
    // Here you can handle the submission logic
  };

  return (
    <div className="App">
      <button
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        onClick={handleOpenPopup}
      >
        Open Popup
      </button>

      <Popup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onSubmit={handleSubmitPopup}
      />
    </div>
  );
};

export default App;
