// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "./component/Login";
import Signup from "./component/Signup";
import UserAvailability from "./component/UserAvailability";
import AdminDashboard from "./component/AdminDashboard";

const App = () => {
  return (
    <Router>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <Link to="/" className="text-lg font-semibold text-indigo-600">
              Scheduler App
            </Link>
            <div className="space-x-8">
              <Link
                to="/availability"
                className="text-gray-900 hover:border-gray-300"
              >
                Availability
              </Link>
              <Link to="/admin" className="text-gray-900 hover:border-gray-300">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/availability" element={<UserAvailability />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
