import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import UserSelector from "./UserSelector";
import AvailabilityList from "./AvailabilityList";
import SessionForm from "./SessionForm";
import SessionList from "./SessionList";

const AdminDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newSession, setNewSession] = useState({
    start: "",
    end: "",
    duration: "",
    attendees: [],
  });
  const [editSession, setEditSession] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get("/api/auth/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  const fetchUserAvailability = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const response = await axios.get(`/api/availability/user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAvailability(response.data);
    } catch (error) {
      console.error("Error fetching user availability:", error);
    }
  }, []);

  const fetchSessions = useCallback(async () => {
    if (!selectedUser) return;
    try {
      const response = await axios.get(`/api/sessions/${selectedUser._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  }, [selectedUser]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchUserAvailability(selectedUser?._id);
    fetchSessions();
  }, [selectedUser, fetchUserAvailability, fetchSessions]);

  const handleAttendeesChange = (selectedOptions) => {
    setNewSession((prevSession) => ({
      ...prevSession,
      attendees: selectedOptions.map((option) => ({
        name: option.label,
        email: option.value,
      })),
    }));
  };

  const handleAddSession = async (e) => {
    e.preventDefault();
    try {
      // Format the attendees
      const formattedAttendees = newSession.attendees.map((attendee) => ({
        name: attendee.name,
        email: attendee.email,
      }));

      // Create the new session object with scheduledSlots
      const sessionData = {
        user: selectedUser._id,
        start: new Date(newSession.start).toISOString(),
        end: new Date(newSession.end).toISOString(),
        duration: newSession.duration,
        scheduledSlots: [
          {
            start: new Date(newSession.start).toISOString(),
            end: new Date(newSession.end).toISOString(),
            attendees: formattedAttendees,
          },
        ],
      };

      const response = await axios.post("/api/sessions", sessionData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setSessions((prevSessions) => [...prevSessions, response.data]);

      // Remove overlapping availability
      setAvailability((prevAvailability) =>
        prevAvailability.filter((slot) => {
          const slotStart = new Date(slot.start);
          const slotEnd = new Date(slot.end);
          const sessionStart = new Date(newSession.start);
          const sessionEnd = new Date(newSession.end);

          return !(sessionStart < slotEnd && sessionEnd > slotStart);
        })
      );

      setNewSession({
        start: "",
        end: "",
        duration: "",
        attendees: [],
      });
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error adding session:", error);
    }
  };

  const handleEdit = (session) => {
    setNewSession({
      start: session.start,
      end: session.end,
      duration: session.duration,
      attendees: session.attendees,
    });
    setEditSession(session);
    setIsFormVisible(true);
  };

  const handleDelete = async (sessionId) => {
    try {
      await axios.delete(`/api/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSessions((prevSessions) =>
        prevSessions.filter((session) => session._id !== sessionId)
      );
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  return (
    <div className="p-8">
      <UserSelector
        users={users}
        selectedUser={selectedUser}
        onUserChange={setSelectedUser}
      />
      {selectedUser && (
        <>
          <AvailabilityList availability={availability} />
          <SessionForm
            newSession={newSession}
            users={users}
            handleAttendeesChange={handleAttendeesChange}
            handleAddSession={handleAddSession}
            editSession={editSession}
            isFormVisible={isFormVisible}
            setNewSession={setNewSession}
            setIsFormVisible={setIsFormVisible}
          />
          <SessionList
            sessions={sessions}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
