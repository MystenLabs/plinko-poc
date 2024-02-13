import React from "react";

// Mock data for demonstration
const mockData = [
  { bet: "1 SUI", multiplier: "1.0x", earnings: "-20 SUI" },
  { bet: "2 SUI", multiplier: "-", earnings: "-" },
  { bet: "3 SUI", multiplier: "-", earnings: "-" },
  { bet: "4 SUI", multiplier: "-", earnings: "-" },
  { bet: "5 SUI", multiplier: "-", earnings: "0 SUI" },
  { bet: "6 SUI", multiplier: "1.5x", earnings: "-" },
  { bet: "7 SUI", multiplier: "-", earnings: "-" },
  { bet: "8 SUI", multiplier: "-", earnings: "-" },
  { bet: "9 SUI", multiplier: "-", earnings: "20 SUI" },
  { bet: "10 SUI", multiplier: "-", earnings: "-" },
  { bet: "11 SUI", multiplier: "2.0x", earnings: "-" },
  { bet: "12 SUI", multiplier: "-", earnings: "-" },
  { bet: "13 SUI", multiplier: "-", earnings: "40 SUI" },
  { bet: "14 SUI", multiplier: "-", earnings: "-" },
  { bet: "15 SUI", multiplier: "-", earnings: "-" },
];

const ScoreTable = () => {
  const isScrollNeeded = true;

  return (
    <div
      className={`w-[280px] ${
        isScrollNeeded ? "h-[394px]" : "h-[229px]"
      } p-[15px] bg-emerald-600 bg-opacity-20 rounded-[10px] shadow border border-teal-400 flex flex-col justify-start items-start gap-[15px] overflow-hidden`}
    >
      <div className="flex justify-start items-start gap-5">
        <div className="text-white text-opacity-60 text-base font-medium leading-[18.40px]">
          Bet
        </div>
        <div className="flex-grow text-white text-opacity-60 text-base font-medium leading-[18.40px]">
          Multiplier
        </div>
        <div className="text-white text-opacity-60 text-base font-medium leading-[18.40px]">
          Earnings
        </div>
      </div>
      <div className="self-stretch h-px opacity-50 bg-white bg-opacity-20"></div>
      <div
        className={`flex ${
          isScrollNeeded ? "overflow-auto" : ""
        } flex-1 w-full`}
      >
        <div className="flex flex-col gap-5 mr-5">
          {mockData.map((data, index) => (
            <div
              key={index}
              className="text-white text-base font-normal leading-[18.40px]"
            >
              {data.bet}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-5 mr-10">
          {" "}
          {/* Adjust the right margin here */}
          {mockData.map((data, index) => (
            <div
              key={index}
              className={`text-white ${
                data.multiplier === "-"
                  ? "text-opacity-40"
                  : "text-base font-semibold"
              } leading-[18.40px]`}
            >
              {data.multiplier}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-5">
          {mockData.map((data, index) => (
            <div
              key={index}
              className={`text-white ${
                data.earnings.startsWith("-")
                  ? "text-orange-600"
                  : data.earnings === "-"
                  ? "text-opacity-40"
                  : "text-emerald-400"
              } text-base font-semibold leading-[18.40px]`}
            >
              {data.earnings}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreTable;
