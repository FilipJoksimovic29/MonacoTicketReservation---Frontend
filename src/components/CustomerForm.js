import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TextField, Button, Container, Box, Typography, CssBaseline, Alert } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import CustomerService from '../services/CustomerService';
import BookingService from '../services/BookingService';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff0000',
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#000000',
      paper: '#000000',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          borderColor: '#ffffff',
          borderWidth: '2px',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: '#ff0000',
            borderColor: '#ffffff',
            borderWidth: '2px'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          margin: '4px',
          '& label.Mui-focused': {
            color: '#ff0000',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: '#ff0000',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#ffffff',
              borderRadius: '0',
            },
            '&:hover fieldset': {
              borderColor: '#ff0000',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ff0000',
            },
          }
        }
      }
    }
  },
  typography: {
    fontSize: 10,
  }
});

const CustomerForm = () => {
    const location = useLocation();
    const [customer, setCustomer] = useState({
        firstName: '',
        lastName: '',
        company: '',
        address1: '',
        address2: '',
        postalCode: '',
        city: '',
        country: '',
        email: ''
    });
    const [bookingResponse, setBookingResponse] = useState(null);
    const [error, setError] = useState('');
    const [alert, setAlert] = useState('');

    const bookingData = location.state.bookingData;

    const handleChange = event => {
        setCustomer({ ...customer, [event.target.name]: event.target.value });
    };

    const handleSubmit = async event => {
        event.preventDefault();
        if (
            !customer.firstName || !customer.lastName || !customer.address1 ||
            !customer.postalCode || !customer.city || !customer.country || !customer.email
        ) {
            setAlert('Please fill out all required fields.');
            return;
        }

        try {
            const response = await CustomerService.createCustomer(customer);
            const customerId = response.id;
            const completeBooking = {
                ...bookingData,
                customerId: customerId,
                generatedPromoCode: bookingData.promoCode
            };
    
            const bookingResponse = await BookingService.createBooking(completeBooking);
            setBookingResponse(bookingResponse);
        } catch (error) {
            console.error('Failed to complete the booking process:', error);
            setError('Failed to complete the booking process.');
        }
    };

    return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
            {!bookingResponse && (
              <Typography variant="h5" component="h1" gutterBottom sx={{ color: 'secondary.main', mb: 4 }}>
                Complete Your Registration
              </Typography>
            )}
            {bookingResponse ? (
              <Box sx={{ color: '#ffffff' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>Reservation Successfully Completed</Typography>
                <Typography variant="h6" sx={{ mb: 1 }}>Your access token for your reservation is: {bookingResponse.token}</Typography>
                <Typography variant="h6">This promo code can be shared with a friend for additional discounts: {bookingResponse.generatedPromoCode}</Typography>
              </Box>
            ) : (
              <form onSubmit={handleSubmit}>
                {alert && <Alert severity="error">{alert}</Alert>}
                <Box display="flex" flexDirection="column" gap={1}>
                  {['firstName', 'lastName', 'company', 'address1', 'address2', 'postalCode', 'city', 'country', 'email'].map((field) => (
                    <TextField
                      key={field}
                      variant="outlined"
                      name={field}
                      value={customer[field]}
                      onChange={handleChange}
                      label={`${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()} ${field === 'company' || field === 'address2' ? '(Optional)' : ''}`}
                      fullWidth
                    />
                  ))}
                  <Button type="submit" variant="contained" sx={{ mt: 2, color: 'secondary.main' }}>Submit</Button>
                 
                </Box>
              </form>
            )}
            {error && (
              <Typography sx={{ color: '#ff0000', fontSize: 16 }}>{error}</Typography>
            )}
          </Container>
        </ThemeProvider>
    );
};

export default CustomerForm;
