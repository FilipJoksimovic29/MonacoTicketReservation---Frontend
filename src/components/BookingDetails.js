import React, { useState, useEffect } from 'react';
import { useLocation,useNavigate  } from 'react-router-dom';
import { CssBaseline, Container, Box, Typography, Button, Checkbox, FormControlLabel, MenuItem, Select,  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle  } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Alert from '@mui/material/Alert';

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
          '&:hover': {
            backgroundColor: '#ff0000',
            borderColor: '#ffffff'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label.Mui-focused': {
            color: '#ff0000',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#ffffff',
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
    fontSize: 12,
  }
});

const BookingDetails = () => {
  const { state } = useLocation();
  const { bookingData, email, token } = state; // Assuming this contains the necessary details

  const days = [
    { id: 1, date: 'May 25' },
    { id: 2, date: 'May 26' },
    { id: 3, date: 'May 27' }
  ];

  const zones = [
    { id: 1, name: 'VIP', price: 3000, isAccessible: true, hasLargeTV: true },
    { id: 2, name: 'Regular', price: 1500, isAccessible: false, hasLargeTV: false },
    { id: 3, name: 'Economy', price: 750, isAccessible: true, hasLargeTV: false },
    { id: 4, name: 'Balcony', price: 500, isAccessible: true, hasLargeTV: false }
  ];

  const [bookingDays, setBookingDays] = useState([]);
  const [originalPrice, setOriginalPrice] = useState(bookingData.originalPrice);
  const [discountedPrice, setDiscountedPrice] = useState(bookingData.finalPrice);
  const [alertInfo, setAlertInfo] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState('');
  const [actionType, setActionType] = useState(''); // 'update' or 'delete'
  useEffect(() => {
    const mappedDays = days.map(day => {
      const foundDay = bookingData.bookingDayZones.find(bd => bd.raceDayId === day.id);
      return {
        ...day,
        zoneId: foundDay ? foundDay.seatingZoneId.toString() : '',
        isChecked: !!foundDay
      };
    });
    setBookingDays(mappedDays);
  }, [bookingData]);

  useEffect(() => {
    // Update prices when selections change
    const selectedDays = bookingDays.filter(day => day.isChecked);
    if (selectedDays.length === 0) {
      setOriginalPrice(0);
      setDiscountedPrice(0);
    } 
  }, [bookingDays]);

  useEffect(() => {
    const selectedDays = bookingDays.filter(day => day.isChecked && day.zoneId);
    if (selectedDays.length > 0) {
      const data = {
        customerId: 0, // Default or specific customer ID
        bookingStatus: "pending", // Default booking status
        token: "example-token", // Default token, adjust as needed
        promoCodeUsed: false, // No promo code used
        originalPrice: 0, // Default original price
        finalPrice: 0, // Default final price
        isEarlyBird: true, // Assuming early bird pricing applies
        bookingDayZones: selectedDays.map(day => ({
          raceDayId: day.id,
          seatingZoneId: parseInt(day.zoneId)
        })),
        generatedPromoCode: "" // No promo code generated
      };
      BookingService.calculatePriceAndDiscount(data)
        .then(response => {
          setOriginalPrice(response.originalPrice || 0);
          setDiscountedPrice(response.finalPrice || 0);
        })
        .catch(error => console.error("Error calculating prices:", error));
    }
  }, [bookingDays]);
  

  const handleDayCheck = (id) => {
    const newBookingDays = bookingDays.map(day =>
      day.id === id ? { ...day, isChecked: !day.isChecked } : day
    );
    setBookingDays(newBookingDays);
  };

  const handleZoneChange = (id, zoneId) => {
    const newBookingDays = bookingDays.map(day =>
      day.id === id ? { ...day, zoneId: zoneId } : day
    );
    setBookingDays(newBookingDays);
  };

  const handleSubmit = async () => {
    const selectedDays = bookingDays.filter(day => day.isChecked && day.zoneId);
    if (selectedDays.length === 0) {
      setDialogContent('Please select at least one day and a seating zone!');
      setActionType('');
      setDialogOpen(true);
      return;
    }

    const updateData = {
      customerId: 0,
      bookingStatus: "pending",
      token: token,
      promoCodeUsed: false,
      originalPrice: originalPrice,
      finalPrice: discountedPrice,
      isEarlyBird: true,
      bookingDayZones: selectedDays.map(day => ({
        raceDayId: day.id,
        seatingZoneId: parseInt(day.zoneId)
      })),
      generatedPromoCode: ""
    };

    try {
      await BookingService.updateBooking(updateData, token, email);
      setDialogContent('Booking updated successfully!');
      setActionType('update');
      setDialogOpen(true);
    } catch (error) {
      console.error('Error updating booking:', error);
      setDialogContent('Failed to update booking!');
      setActionType('');
      setDialogOpen(true);
    }
  };
  
  const handleDelete = async () => {
    try {
      await BookingService.deleteBookingByToken(token, email);
     
      setDialogContent('Booking deleted successfully!');
      setActionType('delete');
      setDialogOpen(true);
    } catch (error) {
      console.error('Error deleting booking:', error);
      setDialogContent('Failed to delete booking!');
      setActionType('');
      setDialogOpen(true);
    }
  };


  const handleDialogClose = () => {
    setDialogOpen(false);
    if (actionType === 'delete') {
      navigate('/reservations');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ bgcolor: 'black', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', p: 0 }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'secondary.main', mb: 4 }}>
          Update Booking Details
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {bookingDays.map(day => (
            <Box key={day.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
              <FormControlLabel
                control={<Checkbox checked={day.isChecked} onChange={() => handleDayCheck(day.id)} color="primary" />}
                label={day.date}
              />
              {day.isChecked && (
                <Select
                  value={day.zoneId}
                  onChange={(e) => handleZoneChange(day.id, e.target.value)}
                  sx={{ width: '70%' }}
                  displayEmpty
                >
                  <MenuItem value=""><em>Select a zone</em></MenuItem>
                  {zones.map(zone => (
                    <MenuItem key={zone.id} value={zone.id.toString()}>{zone.name} - ${zone.price}</MenuItem>
                  ))}
                </Select>
              )}
            </Box>
          ))}
          <Typography sx={{ mt: 2 }}>
            Original Price: ${originalPrice}
          </Typography>
          <Typography>
            Discounted Price: ${discountedPrice}
          </Typography>
          <Button onClick={handleSubmit} variant="contained" sx={{ mt: 2, color: 'secondary.main' }}>
            Confirm Changes
          </Button>
          <Button onClick={handleDelete} variant="outlined" sx={{ mt: 2, color: 'secondary.main', borderColor: 'secondary.main' }}>
            Delete Booking
          </Button>
        </Box>
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Notification"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {dialogContent}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary" autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );


};



export default BookingDetails;
