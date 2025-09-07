// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

"use client";
import React from "react";
import { usePlayContext } from "@/contexts/PlayContext";

const ErrorModal = () => {
  const { errorModal, setErrorModal } = usePlayContext();
  const visible = errorModal.visible;
  const { message, title } = (errorModal.error as any) || {};

  const headline =
    typeof title === "string" && title.trim()
      ? title
      : "We couldn’t complete your request";

  const body =
    typeof message === "string" && message.trim()
      ? message
      : "Something went wrong while processing your action. Please review your inputs and try again.";

  const onClose = () => setErrorModal({ visible: false, error: undefined });

  return (
    <>
      {visible && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-20"
          onClick={onClose}
        >
          <div
            className="p-5 border w-[600px] bg-white rounded-3xl shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col justify-center items-center gap-6">
              <div className="text-center text-black text-2xl font-semibold">
                {headline}
              </div>

              <div className="w-full text-center text-neutral-900 text-base">
                {body}
              </div>

              <div className="self-stretch flex justify-center">
                <button
                  onClick={onClose}
                  className="px-5 py-3 bg-black rounded-[38px] text-white font-bold hover:bg-neutral-900 transition-colors"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ErrorModal;
