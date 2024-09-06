import React, { useState, useEffect } from "react";
import axios from "axios";

const UserAvailability = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [newAvailability, setNewAvailability] = useState({
    start: "",
    end: "",
    duration: "",
  });
  const [editAvailability, setEditAvailability] = useState(null);

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  const fetchAvailabilities = async () => {
    try {
      const response = await axios.get("/api/availability");
      setAvailabilities(response.data);
    } catch (error) {
      console.error("Error fetching availabilities:", error);
    }
  };

  const calculateDuration = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffInMinutes = (endTime - startTime) / (1000 * 60);
    return diffInMinutes > 0 ? diffInMinutes : "";
  };

  const handleAddAvailability = async (e) => {
    e.preventDefault();
    try {
      if (editAvailability) {
        await axios.put(
          `/api/availability/${editAvailability._id}`,
          newAvailability
        );
        setEditAvailability(null);
      } else {
        await axios.post("/api/availability", newAvailability);
      }
      fetchAvailabilities();
      setNewAvailability({ start: "", end: "", duration: "" });
    } catch (error) {
      console.error("Error adding/updating availability:", error);
    }
  };

  const handleEdit = (availability) => {
    setEditAvailability(availability);
    setNewAvailability({
      start: new Date(availability.start).toISOString().slice(0, 16),
      end: new Date(availability.end).toISOString().slice(0, 16),
      duration: availability.duration,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/availability/${id}`);
      fetchAvailabilities();
    } catch (error) {
      console.error("Error deleting availability:", error);
    }
  };

  const handleStartChange = (e) => {
    const updatedStart = e.target.value;
    const updatedDuration = calculateDuration(
      updatedStart,
      newAvailability.end
    );
    setNewAvailability({
      ...newAvailability,
      start: updatedStart,
      duration: updatedDuration || newAvailability.duration,
    });
  };

  const handleEndChange = (e) => {
    const updatedEnd = e.target.value;
    const updatedDuration = calculateDuration(
      newAvailability.start,
      updatedEnd
    );
    setNewAvailability({
      ...newAvailability,
      end: updatedEnd,
      duration: updatedDuration || newAvailability.duration,
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-6">
      <h2 className="text-2xl font-bold mb-4">Manage Your Availability</h2>
      <form onSubmit={handleAddAvailability} className="mb-8">
        <input
          type="datetime-local"
          value={newAvailability.start}
          onChange={handleStartChange}
          className="border rounded px-2 py-1"
        />
        <input
          type="datetime-local"
          value={newAvailability.end}
          onChange={handleEndChange}
          className="border rounded px-2 py-1"
        />
        <input
          type="number"
          value={newAvailability.duration}
          disabled
          onChange={(e) =>
            setNewAvailability({
              ...newAvailability,
              duration: parseInt(e.target.value, 10),
            })
          }
          className="border rounded px-2 py-1 w-20"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editAvailability ? "Update Availability" : "Add Availability"}
        </button>
        {editAvailability && (
          <button
            type="button"
            onClick={() => {
              setEditAvailability(null);
              setNewAvailability({ start: "", end: "", duration: "" });
            }}
            className="ml-4 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>
      <ul className="divide-y divide-gray-200">
        {Array.isArray(availabilities) && availabilities.length > 0 ? (
          availabilities.map((availability) => (
            <li
              key={availability._id}
              className="py-4 flex items-center justify-between"
            >
              <p>
                {new Date(availability.start).toLocaleString()} -{" "}
                {new Date(availability.end).toLocaleString()} (
                {availability.duration} minutes)
              </p>
              <div>
                <button
                  onClick={() => handleEdit(availability)}
                  className="bg-yellow-500 text-white px-4 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(availability._id)}
                  className="bg-red-500 text-white px-4 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="py-4">No availabilities found.</li>
        )}
      </ul>
    </div>
  );
};

export default UserAvailability;
