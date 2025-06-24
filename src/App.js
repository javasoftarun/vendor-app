import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './components/pages/LoginScreen';
import RegisterScreen from './components/pages/RegisterScreen';
import Dashboard from './components/pages/Dashboard'; 
import Profile from './components/pages/Profile'; 
import Membership from './components/pages/Membership';
import ViewTrip from './components/pages/ViewTrip';
import TripPassengers from './components/pages/TripPassengers';
import BookingRequest from './components/pages/BookingRequest';
import MyBookings from './components/pages/MyBookings';
import BookingHistory from './components/pages/BookingHistory';
import AddVehicle from './components/pages/AddVehicle';
import Contact from './components/pages/Contact';
import PrivateRoute from './components/config/PrivateRoute';
import ManageVehicles from './components/pages/ManageVehicles';
import EditVehicle from './components/pages/EditVehicle';
import PaymentHistory from './components/pages/PaymentHistory';
import Settings from './components/pages/Settings';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/contact" element={<PrivateRoute><Contact /></PrivateRoute>} />
          <Route path="/membership" element={<PrivateRoute><Membership /></PrivateRoute>} />
          <Route path="/view-trip" element={<PrivateRoute><ViewTrip /></PrivateRoute>} />
          <Route path="/trip-passengers" element={<PrivateRoute><TripPassengers /></PrivateRoute>} />
          <Route path="/booking-request" element={<PrivateRoute><BookingRequest /></PrivateRoute>} />
          <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
          <Route path="/booking-history" element={<PrivateRoute><BookingHistory /></PrivateRoute>} />
          <Route path="/add-vehicle" element={<PrivateRoute><AddVehicle /></PrivateRoute>} />
          <Route path="/manage-vehicle" element={<PrivateRoute><ManageVehicles /></PrivateRoute>} />
          <Route path="/edit-vehicle/:registrationId" element={<PrivateRoute><EditVehicle /></PrivateRoute>} />
          <Route path="/payment-history" element={<PrivateRoute><PaymentHistory /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
  );
}

export default App;
