"use client";

import notificationToast from "@/components/notificationToast";
import { useGetLateNotification } from "@/services/mutations";
import React, { useEffect, useRef, useState } from "react";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TelegramNotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { mutate } = useGetLateNotification()
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen) return null;
  const handleLunchNotification = () => {
    mutate(
      1,
      {
        onSuccess: () => {
          notificationToast(
            "Late lunch notification sent!",
            "success"
          );
        },
        onError: (error) => {
          console.error("Error Sending Notification", error);
          notificationToast("Failed to send notification!", "error");
        },
      }
    );
  };
  const handleSnacksNotification = () => {
    console.log("Snacks noti sent")
    mutate(
      2,
      {
        onSuccess: () => {
          notificationToast(
            "Late snacks notification sent!",
            "success"
          );
        },
        onError: (error) => {
          console.error("Error Sending Notification", error);
          notificationToast("Failed to send notification!", "error");
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div ref={modalRef} className="bg-white p-6 rounded-md w-96 shadow-md">
        <h2 className="text-lg font-bold mb-6 text-center">
          Send Late Meal Notification
        </h2>

        <div className="flex flex-col gap-4">
          <button
            className="bg-blue-400 text-black p-4 rounded hover:bg-blue-500 transition duration-300 ease-in-out"
            onClick={handleLunchNotification}
          >
            Send Late Lunch Notification
          </button>
          <button
            className="bg-green-500 text-black p-4 rounded hover:bg-green-600 transition duration-300 ease-in-out"
            onClick={handleSnacksNotification}
          >
            Send Late Snacks Notification
          </button>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded transition duration-300 ease-in-out"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TelegramNotificationModal;
