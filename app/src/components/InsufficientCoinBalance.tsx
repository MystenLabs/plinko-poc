"use client";

import { useAuthentication } from "@/contexts/Authentication";
import { usePlayContext } from "@/contexts/PlayContext";
import React from "react";

const PopupComponent2 = () => {
  const {
    popupInsufficientCoinBalanceIsVisible,
    setPopupInsufficientCoinBalanceIsVisible,
  } = usePlayContext();
  const { user } = useAuthentication();

  const handleTryAgain = () => {
    setPopupInsufficientCoinBalanceIsVisible(false); // This will hide the popup
  };

  return (
    <>
      {popupInsufficientCoinBalanceIsVisible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-10 ">
          <div
            className="p-5 border w-[600px] bg-white rounded-3xl shadow-lg "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col justify-center items-center gap-10">
              <div className="flex flex-col justify-center items-center gap-1.5">
                <div className="w-[380px] opacity-90 text-center text-black text-2xl font-semibold">
                  <p>Not enough balance</p>
                </div>

                <p>Sent SUI to your address</p>
                <p>Or request SUI from the header</p>
              </div>
              <div className="self-stretch bg-white border-t-2 justify-start items-center gap-2 inline-flex">
                <button
                  onClick={handleTryAgain}
                  className="grow shrink basis-0 self-stretch px-5 py-4 bg-black rounded-[38px] justify-center items-center gap-2 flex"
                >
                  <div className="text-white text-base font-bold">
                    Try again
                  </div>
                </button>
              </div>
              <div className="justify-center items-center gap-2 inline-flex"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PopupComponent2;
