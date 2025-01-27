import React from "react";

interface HeaderDates {
  fullDate: string;
  day: string;
}

const StaticTableHeader = ({ headerDates }: { headerDates: HeaderDates[] }) => {
  return (
    <thead>
      <tr>
        <th className="border border-gray-300 p-2">Employee Name</th>
        {headerDates.map((header, index) => (
          <th key={index} className="border border-gray-300 p-2">
            {header.fullDate}
            <br />
            {header.day}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default StaticTableHeader;
