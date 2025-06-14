import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './components/pages/LoginScreen';
import RegisterScreen from './components/pages/RegisterScreen';
import Dashboard from './components/pages/Dashboard'; 
import MyTrips from './components/pages/MyTrips';
import Profile from './components/pages/Profile'; 
import Membership from './components/pages/Membership';
import ViewTrip from './components/pages/ViewTrip';
import TripPassengers from './components/pages/TripPassengers';
import BookingRequest from './components/pages/BookingRequest';
import MyBookings from './components/pages/MyBookings';
import BookingHistory from './components/pages/BookingHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-ride" element={<MyTrips />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/view-trip" element={<ViewTrip />} />
        <Route path="/trip-passengers" element={<TripPassengers />} />
        <Route path="/booking-request" element={<BookingRequest />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/booking-history" element={<BookingHistory />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
