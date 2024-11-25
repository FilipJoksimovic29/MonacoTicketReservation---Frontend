import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, TextField, Button, CssBaseline } from '@mui/material';
import BookingService from '../services/BookingService';

const Reservations = () => {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    const handleAccessReservation = async () => {
        console.log('Accessing reservation with:', email, token);
        try {
            const bookingData = await BookingService.getBookingByToken(token, email);
            console.log('Booking data:', bookingData);
            navigate('/booking-details', { state: { bookingData, email, token } });

        } catch (error) {
            console.error('Error fetching booking:', error);
        }
    };

    return (
        <Container
            maxWidth="100%"
            sx={{
                bgcolor: 'black',
                color: 'white',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                p: 0,
            }}
        >
            <CssBaseline />
            <Typography variant="h4" gutterBottom sx={{ color: 'white', mb: 4 }}>
                My Reservations
            </Typography>
            <Box sx={{
                width: '100%',
                maxWidth: 360,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
            }}>
                <TextField
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ width: '100%', '& .MuiInputLabel-root': { color: 'gray' }, '& .MuiInputBase-input': { color: 'white' } }}
                />
                <TextField
                    label="Reservation Token"
                    variant="outlined"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    sx={{ width: '100%', '& .MuiInputLabel-root': { color: 'gray' }, '& .MuiInputBase-input': { color: 'white' } }}
                />
                <Button
                    onClick={handleAccessReservation}
                    variant="contained"
                    sx={{ mt: 2, bgcolor: 'red', color: 'white', '&:hover': { bgcolor: 'darkred' } }}
                >
                    Access Reservation
                </Button>
            </Box>
        </Container>
    );
};

export default Reservations;
