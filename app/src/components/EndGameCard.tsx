"use client";

import React, { useState } from "react";

const PopupComponent = () => {
  // Internal state to control the visibility of the popup
  const [isVisible, setIsVisible] = useState(true);

  // Function to toggle the popup visibility
  const togglePopup = () => setIsVisible(!isVisible);

  return (
    <>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        onClick={togglePopup}
      >
        {isVisible ? "Hide Popup" : "Show Popup"}
      </button>

      {isVisible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div
            className="relative top-20 mx-auto p-5 border w-[600px] bg-white rounded-3xl shadow backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          ></div>
          <div className="w-[600px] h-[459px] p-[60px] bg-white rounded-3xl shadow backdrop-blur-2xl flex flex-col justify-center items-center gap-10 inline-flex">
            <div className="origin-top-left rotate-90 opacity-40 w-[481.41px] h-[377.65px] relative">
              {/* Repeated structure omitted for brevity, follow the pattern to include all */}
            </div>
            <div className="self-stretch h-[339px] flex flex-col justify-center items-center gap-8">
              <div className="flex flex-col justify-center items-center gap-1.5">
                <div className="w-[380px] opacity-90 text-center text-black text-2xl font-semibold">
                  Congratulations, You Won!
                </div>
                <div className="text-center text-emerald-600 text-[56px] font-bold">
                  690 SUI
                </div>
                <div className="opacity-70 text-right text-neutral-900 text-base font-medium">
                  You Bid: 50 SUI
                </div>
              </div>
              <div className="self-stretch bg-white border-t-2 justify-start items-center gap-2 inline-flex">
                <div className="grow shrink basis-0 self-stretch px-5 py-4 bg-black rounded-[38px] justify-center items-center gap-2 flex">
                  <div className="text-white text-base font-bold">
                    Play again
                  </div>
                </div>
              </div>
              <div className="justify-center items-center gap-2 inline-flex">
                <div className="text-neutral-900 text-base font-semibold">
                  Verify on Sui Explorer
                </div>
                <div className="w-4 h-4 relative">
                  {/* Assuming you'll replace this with an actual image */}
                  <img
                    className="w-[8.17px] h-[8.17px] left-[3.92px] top-[3.92px] absolute"
                    src="https://via.placeholder.com/8x8"
                    alt="Icon"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PopupComponent;

// import React from "react";

// const YourComponent = ({
//   show,
//   onClose,
// }: {
//   show: boolean;
//   onClose: () => void;
// }) => {
//   if (!show) return null;
//   return (
//     <div
//       className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
//       onClick={onClose}
//     >
//       <div
//         className="relative top-20 mx-auto p-5 border w-[600px] bg-white rounded-3xl shadow backdrop-blur-2xl"
//         onClick={(e) => e.stopPropagation()}
//       ></div>
//       <div className="w-[600px] h-[459px] p-[60px] bg-white rounded-3xl shadow backdrop-blur-2xl flex flex-col justify-center items-center gap-10 inline-flex">
//         <div className="origin-top-left rotate-90 opacity-40 w-[481.41px] h-[377.65px] relative">
//           {/* Repeated structure omitted for brevity, follow the pattern to include all */}
//         </div>
//         <div className="self-stretch h-[339px] flex flex-col justify-center items-center gap-8">
//           <div className="flex flex-col justify-center items-center gap-1.5">
//             <div className="w-[380px] opacity-90 text-center text-black text-2xl font-semibold">
//               Congratulations, You Won!
//             </div>
//             <div className="text-center text-emerald-600 text-[56px] font-bold">
//               690 SUI
//             </div>
//             <div className="opacity-70 text-right text-neutral-900 text-base font-medium">
//               You Bid: 50 SUI
//             </div>
//           </div>
//           <div className="self-stretch bg-white border-t-2 justify-start items-center gap-2 inline-flex">
//             <div className="grow shrink basis-0 self-stretch px-5 py-4 bg-black rounded-[38px] justify-center items-center gap-2 flex">
//               <div className="text-white text-base font-bold">Play again</div>
//             </div>
//           </div>
//           <div className="justify-center items-center gap-2 inline-flex">
//             <div className="text-neutral-900 text-base font-semibold">
//               Verify on Sui Explorer
//             </div>
//             <div className="w-4 h-4 relative">
//               {/* Assuming you'll replace this with an actual image */}
//               <img
//                 className="w-[8.17px] h-[8.17px] left-[3.92px] top-[3.92px] absolute"
//                 src="https://via.placeholder.com/8x8"
//                 alt="Icon"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default YourComponent;
