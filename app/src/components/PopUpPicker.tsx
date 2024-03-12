import React, { useState, useEffect, useRef } from "react";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (betSize: string, numberOfBalls: string) => void;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, onSubmit }) => {
  const containerHeight = 200; // Height of the scrollable area in pixels
  const itemHeight = 40; // Height of an individual item in pixels
  const halfVisibleItems = Math.floor(containerHeight / itemHeight / 2);

  const [betSize, setBetSize] = useState("0.1");
  const [numberOfBalls, setNumberOfBalls] = useState("1");
  const betSizeRef = useRef<HTMLDivElement>(null);
  const numberOfBallsRef = useRef<HTMLDivElement>(null);

  // Utility function to generate options for bet size and number of balls
  const generateBetSizeOptions = (): string[] => {
    let array = [];
    array.push("");
    array.push("");
    for (let i = 1; i <= 100; i++) {
      array.push((i / 10).toFixed(1));
    }
    array.push("");
    array.push("");
    return array;
  };

  const generateNumberOfBallsOptions = (): string[] => {
    // return Array.from({ length: 100 }, (_, i) => (i + 1).toString());
    let array = [];
    array.push("");
    array.push("");
    for (let i = 1; i <= 100; i++) {
      array.push(i.toString());
    }
    array.push("");
    array.push("");
    return array;
  };

  const betSizeOptions = generateBetSizeOptions();
  const numberOfBallsOptions = generateNumberOfBallsOptions();

  // Function to handle the scroll event and set the middle item
  const handleScroll = (
    options: string[],
    setFunction: React.Dispatch<React.SetStateAction<string>>,
    ref: React.RefObject<HTMLDivElement>
  ) => {
    if (!ref.current) return;

    const scrollTop = ref.current.scrollTop + halfVisibleItems * itemHeight;
    const index = Math.round(scrollTop / itemHeight);
    setFunction(options[Math.min(Math.max(index, 0), options.length - 1)]);
  };

  useEffect(() => {
    if (isOpen) {
      // Scroll to the initial values when the popup opens
      const initialBetSizeIndex = betSizeOptions.indexOf(betSize);
      const initialNumberOfBallsIndex =
        numberOfBallsOptions.indexOf(numberOfBalls);
      const initialBetSizeScrollTop =
        (initialBetSizeIndex - halfVisibleItems) * itemHeight;
      const initialNumberOfBallsScrollTop =
        (initialNumberOfBallsIndex - halfVisibleItems) * itemHeight;
      betSizeRef.current?.scrollTo(0, initialBetSizeScrollTop);
      numberOfBallsRef.current?.scrollTo(0, initialNumberOfBallsScrollTop);
    }
  }, [isOpen, betSize, numberOfBalls]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg p-4 w-11/12 max-w-md shadow-lg">
        <div className="grid grid-cols-2 gap-4 text-white">
          <div>
            <h2 className="text-lg font-semibold text-center mb-2 border-b border-white pb-2">
              Bid
            </h2>
            <div
              className="overflow-auto"
              style={{ height: containerHeight }}
              ref={betSizeRef}
              onScroll={() =>
                handleScroll(betSizeOptions, setBetSize, betSizeRef)
              }
            >
              {betSizeOptions.map((option, index) => (
                <div
                  key={index}
                  className={`p-2 text-center ${
                    betSize === option ? "bg-black" : ""
                  }`}
                  style={{ height: itemHeight }}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-center mb-2 border-b border-white pb-2">
              Number of Balls
            </h2>
            <div
              className="overflow-auto"
              style={{ height: containerHeight }}
              ref={numberOfBallsRef}
              onScroll={() =>
                handleScroll(
                  numberOfBallsOptions,
                  setNumberOfBalls,
                  numberOfBallsRef
                )
              }
            >
              {numberOfBallsOptions.map((option, index) => (
                <div
                  key={index}
                  className={`p-2 text-center ${
                    numberOfBalls === option ? "bg-black" : ""
                  }`}
                  style={{ height: itemHeight }}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center space-x-2">
          <button
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded"
            onClick={() => onSubmit(betSize, numberOfBalls)}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
