import React from "react";

const Grid = () => {
  // Generate an array of 16 items
  const items = Array.from({ length: 8 });

  return (
    <div className="grid grid-cols-8 gap-2 ms-5">
      {items.map((_, index) => (
        <div
          key={index}
          className="p-2 border rounded-md text-center items-center text-base w-36 h-10 text-bold"
        >
          {index === 0 ? "Total" : ""}
          
        </div>
      ))}
    </div>
  );
};

export default Grid;
