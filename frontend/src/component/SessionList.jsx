import React from "react";

const SessionList = ({ sessions, handleEdit, handleDelete }) => (
  <>
    <h3 className="text-xl font-bold mb-4">Sessions</h3>
    <ul className="divide-y divide-gray-200">
      {sessions.length > 0 ? (
        sessions.map((session) => (
          <li key={session._id} className="py-4">
            <p>
              <strong>Start:</strong> {new Date(session.start).toLocaleString()}
            </p>
            <p>
              <strong>End:</strong> {new Date(session.end).toLocaleString()}
            </p>
            <div>
              {session.scheduledSlots.map((slot, index) => (
                <div key={index}>
                  <strong>Slot Attendees {index + 1}:</strong>
                  {slot.attendees.map((att) => `${att.name} `).join(", ")}
                </div>
              ))}
            </div>
            <button
              onClick={() => handleEdit(session)}
              className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(session._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </li>
        ))
      ) : (
        <p>No sessions found</p>
      )}
    </ul>
  </>
);

export default SessionList;
