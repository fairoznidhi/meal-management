"use client"

{/*import React, { useState, useEffect } from "react";
import HttpClient, { baseRequest } from "@/services/HttpClientAPI";


const request = baseRequest(`${process.env.NEXT_PUBLIC_PROXY_URL}`);

const TodayLunchPrint = () => {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchHtml = async () => {
      try {
        const response = await request({
          url: "/meal_activity/today-lunch",
          method: "GET",
          useAuth: true,
        })as any;

        const text = typeof response === "string" ? response : await response.text();
        setHtmlContent(text);
      } catch (error) {
        console.error("Error fetching HTML:", error);
      }
    };

    fetchHtml();
  }, []);

  const handlePrint = () => {
    const printArea = document.getElementById("print-area");
    if (printArea) {
      const printWindow = window.open("", "_self"); // Opens in same window
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Today's Lunch</title>
            </head>
            <body>
              ${printArea.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div>
      {/* Button to Open Modal 
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        Print Today's Lunch
      </button>

      {/* Modal 
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-2/3 max-h-[120vh] overflow-auto"
          style={{ transform: "scale(0.8)", transformOrigin: "center" }}>
            <h2 className="text-xl font-bold mb-4">Today's Lunch</h2>
            
            {/* Print Content Area 
            <div id="print-area" dangerouslySetInnerHTML={{ __html: htmlContent }} />

            {/* Action Buttons 
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-black p-2 rounded-md mr-2"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="bg-green-500 text-white p-2 rounded-md"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayLunchPrint;
*/}


import React, { useState, useEffect } from "react";
import { baseRequest } from "@/services/HttpClientAPI";

interface PrintModalProps {
  isOpen: boolean; // Boolean to control modal visibility
  onClose: () => void; // Function to close modal
}
const request = baseRequest(`${process.env.NEXT_PUBLIC_PROXY_URL}`);
const PrintModal: React.FC<PrintModalProps> = ({ isOpen, onClose }) => {
  const [htmlContent1, setHtmlContent1] = useState<string>("");
  const [htmlContent2, setHtmlContent2] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>(""); // Default to Option 1

  useEffect(() => {
    if (isOpen) {
      fetchHtml("lunch");
      fetchHtml("snacks");
    }
  }, [isOpen]);

  const fetchHtml = async (option: string) => {
    try {
      const response = await request({
        url: option === "lunch" ? "/meal_activity/today-lunch" : "/meal_activity/today-snack",
        method: "GET",
        useAuth: true, // Add this if authentication is needed
      })as any;
  
      const text = typeof response === "string" ? response : await response.text();
  
      // Set the HTML content based on the selected option
      option === "lunch" ? setHtmlContent1(text) : setHtmlContent2(text);
    } catch (error) {
      console.error(`Error fetching HTML (Option ${option}):`, error);
    }
  };
  
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write("<html><head><title>Print</title></head><body>");
      printWindow.document.write(selectedOption === "lunch" ? htmlContent1 : htmlContent2);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white px-3 rounded-md w-3/4 h-[100vh] overflow-auto mt-20 absolute"
      style={{ transform: "scale(0.8)", transformOrigin: "center" }} >
       

        {/* Toggle Button */}
        

        
        <div className="flex gap-4 mb-4 mt-2">
          <button
            className={`p-2 rounded-md ${
              selectedOption === "lunch" ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
            onClick={() => setSelectedOption("lunch")}
          >
            Lunch
          </button>
          <button
            className={`p-2 rounded-md ${
              selectedOption === "snacks"? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
            onClick={() => setSelectedOption("snacks")}
          >
            Snacks
          </button>
        </div>
        
        <div className="flex justify-end mb-2">
          
          <button onClick={handlePrint} className="bg-green-500 text-white px-4 py-2 rounded-md">
            Print
          </button>
        </div>
        

        {/* Render HTML */}
        <div className="border p-4 bg-gray-100">
          <div dangerouslySetInnerHTML={{ __html: selectedOption === "lunch" ? htmlContent1 : htmlContent2 }} />
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="bg-gray-300 text-black p-2 rounded-md mr-2">
            Close
          </button>
         
        </div>
      </div>
    </div>
  );
};

export default PrintModal;
