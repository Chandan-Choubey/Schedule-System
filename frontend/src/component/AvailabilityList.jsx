import React from "react";

const AvailabilityList = ({ availability }) => (
  <div className="mb-6">
    <h3 className="text-xl font-bold mb-4">User Availability</h3>
    <ul className="divide-y divide-gray-200">
      {availability.length > 0 ? (
        Object.entries(
          availability.reduce((grouped, avail) => {
            const date = new Date(avail.start).toLocaleDateString();
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(avail);
            return grouped;
          }, {})
        ).map(([date, availabilities], index) => (
          <li key={index} className="py-4">
            <p className="font-bold">{date}</p>
            <ul>
              {availabilities.map((avail, idx) => (
                <li key={idx} className="pl-4">
                  <p>
                    {new Date(avail.start).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(avail.end).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    ({avail.duration} minutes)
                  </p>
                </li>
              ))}
            </ul>
          </li>
        ))
      ) : (
        <li className="py-4">No availability found for this user.</li>
      )}
    </ul>
  </div>
);

export default AvailabilityList;
