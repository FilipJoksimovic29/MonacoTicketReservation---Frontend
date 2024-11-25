// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Booking from './components/Booking';
import CustomerForm from './components/CustomerForm';
import Reservations from './components/Reservations';
import BookingDetails  from './components/BookingDetails';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/customer" element={<CustomerForm />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/booking-details" element={<BookingDetails />} /> 

            </Routes>
        </Router>
    );
};

export default App;
