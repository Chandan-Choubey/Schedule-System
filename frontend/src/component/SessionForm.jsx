import React from "react";
import Select from "react-select";

const SessionForm = ({
  newSession,
  users,
  handleAttendeesChange,
  handleAddSession,
  editSession,
  isFormVisible,
  setNewSession,
  setIsFormVisible,
}) => {
  const selectedAttendees = newSession.attendees.map((attendee) => ({
    label: attendee.name,
    value: attendee.email,
  }));

  const userOptions = users.map((user) => ({
    label: user.email,
    value: user.email,
  }));

  return (
    <>
      <button
        onClick={() => setIsFormVisible(!isFormVisible)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
      >
        {isFormVisible ? "Cancel" : "Add Session"}
      </button>

      {isFormVisible && (
        <form onSubmit={handleAddSession} className="mb-8">
          <div className="grid gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start
              </label>
              <input
                type="datetime-local"
                value={newSession.start}
                onChange={(e) =>
                  setNewSession({ ...newSession, start: e.target.value })
                }
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End
              </label>
              <input
                type="datetime-local"
                value={newSession.end}
                onChange={(e) =>
                  setNewSession({ ...newSession, end: e.target.value })
                }
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={newSession.duration}
                onChange={(e) =>
                  setNewSession({
                    ...newSession,
                    duration: parseInt(e.target.value, 10),
                  })
                }
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Attendees
              </label>
              <Select
                isMulti
                options={userOptions}
                value={selectedAttendees}
                onChange={handleAttendeesChange}
                className="border rounded w-full"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {editSession ? "Update Session" : "Add Session"}
          </button>
        </form>
      )}
    </>
  );
};

export default SessionForm;
