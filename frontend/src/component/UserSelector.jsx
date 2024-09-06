import React from "react";

const UserSelector = ({ users, selectedUser, onUserChange }) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700">
      Select User
    </label>
    <select
      value={selectedUser ? selectedUser._id : ""}
      onChange={(e) => {
        const userId = e.target.value;
        const user = users.find((user) => user._id === userId);
        onUserChange(user);
      }}
      className="border rounded px-2 py-1 w-full"
    >
      <option value="">Select a user</option>
      {users.map((user) => (
        <option key={user._id} value={user._id}>
          {user.email}
        </option>
      ))}
    </select>
  </div>
);

export default UserSelector;
