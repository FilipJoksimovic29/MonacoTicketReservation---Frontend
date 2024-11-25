import axios from 'axios';

const API_URL = 'https://localhost:7142/api/bookings'; // Adjust the base URL as necessary

const getAllBookings = async () => {
    try {
        const response = await axios.get(`${API_URL}/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getBookingById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createBooking = async (bookingData) => {
    try {
        const response = await axios.post(API_URL, bookingData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateBooking = async (bookingData, token, email) => {
    try {
        const response = await axios.put(`${API_URL}/update/${token}/${email}`, bookingData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteBooking = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteBookingByToken = async (token, email) => {
    try {
        const response = await axios.delete(`${API_URL}/delete/by-token/${token}/${email}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getBookingByToken = async (token, email) => {
    try {
        const response = await axios.get(`${API_URL}/get/${token}/${email}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const calculatePriceAndDiscount = async (bookingData) => {
    try {
        const response = await axios.post(`${API_URL}/CalculatePriceAndDiscount`, bookingData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default {
    getAllBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking,
    deleteBookingByToken,
    getBookingByToken,
    calculatePriceAndDiscount 
};
