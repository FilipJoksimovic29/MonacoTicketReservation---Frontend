import axios from 'axios';

const API_URL = 'https://localhost:7142/api/customers'; 

const createCustomer = async (customerData) => {
    try {
        const response = await axios.post(API_URL, customerData);
        return response.data;
    } catch (error) {
        throw error;
    }
};


const updateCustomer = async (id, customerData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, customerData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default {
    createCustomer,
    updateCustomer,
   
};
