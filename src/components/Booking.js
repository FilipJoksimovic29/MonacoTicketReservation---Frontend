import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CssBaseline, Container, Box, Typography, Button, Checkbox, FormControlLabel, MenuItem, Select, TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Alert from '@mui/material/Alert'; // Importing Alert for showing messages

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

const Booking = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [filterAccessible, setFilterAccessible] = useState(false);
  const [filterLargeTV, setFilterLargeTV] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // State to control alert visibility

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

  const [bookingDays, setBookingDays] = useState(days.map(day => ({
    ...day,
    zoneId: '',
    isChecked: false
  })));

  const filteredZones = zones.filter(zone => 
    (!filterAccessible || zone.isAccessible) && (!filterLargeTV || zone.hasLargeTV)
  );

  const handleDayCheck = id => {
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

  const handlePromoCodeChange = (e) => {
    setPromoCode(e.target.value);
  };

  useEffect(() => {
    const selectedDays = bookingDays.filter(day => day.isChecked && day.zoneId);
    if (selectedDays.length > 0 && (promoCode.length === 6 || promoCode.length === 0)) {
      const data = {
        customerId: 0,
        bookingStatus: "pending",
        token: "example-token",
        promoCodeUsed: promoCode.length === 6,
        isEarlyBird: true,
        bookingDayZones: selectedDays.map(day => ({
          raceDayId: day.id,
          seatingZoneId: parseInt(day.zoneId)
        })),
        generatedPromoCode: promoCode
      };
      BookingService.calculatePriceAndDiscount(data)
        .then(response => {
          setOriginalPrice(response.originalPrice || 0);
          setDiscountedPrice(response.finalPrice || 0);
        })
        .catch(error => console.error("Error calculating prices with promo code:", error));
    }
  }, [bookingDays, promoCode, filterAccessible, filterLargeTV]);

  const handleSubmit = () => {
    const selectedDays = bookingDays.filter(day => day.isChecked && day.zoneId);
    if (selectedDays.length > 0) {
      const preparedBookingData = {
        bookingStatus: "pending",
        bookingDayZones: selectedDays.map(day => ({
          raceDayId: day.id,
          seatingZoneId: parseInt(day.zoneId)
        })),
        promoCode
      };
      setBookingData(preparedBookingData);
      navigate('/customer', { state: { bookingData: preparedBookingData } });
    } else {
      setShowAlert(true); // Show alert if no day or zone is selected
    }
  };

  useEffect(() => {
    // Update prices when selections change
    const selectedDays = bookingDays.filter(day => day.isChecked);
    if (selectedDays.length === 0) {
      setOriginalPrice(0);
      setDiscountedPrice(0);
    } 
  }, [bookingDays]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Typography
          variant="h4"
          gutterBottom
          component="div"
          sx={{
            color: 'secondary.main',
            mb: 4,
            mt: 20,
            textAlign: 'center' // This will center the text
          }}
        >
          Book Your Tickets
        </Typography>
  
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {showAlert && (
            <Alert severity="error" onClose={() => setShowAlert(false)}>Please select at least one day and a seating zone!</Alert>
          )}
          <Box sx={{ display: 'flex' , ml:12}}>
            <Typography variant="h6" gutterBottom component="div" sx={{ color: 'secondary.main', mr:3,mt:1}}>
              Filter:
            </Typography>
            <FormControlLabel
              control={<Checkbox checked={filterAccessible} onChange={(e) => setFilterAccessible(e.target.checked)} />}
              label="Accessible Zones Only"
            />
            <FormControlLabel
              control={<Checkbox checked={filterLargeTV} onChange={(e) => setFilterLargeTV(e.target.checked)} />}
              label="Zones with Large TV Only"
            />
          </Box>
          {bookingDays.map(day => (
            <Box key={day.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
              <FormControlLabel
                control={<Checkbox checked={day.isChecked} onChange={() => handleDayCheck(day.id)} color="primary" />}
                label={day.date}
                sx={{ flexShrink: 0 }}
              />
              {day.isChecked && (
                <Select
                  value={day.zoneId}
                  onChange={(e) => handleZoneChange(day.id, e.target.value)}
                  sx={{ width: '70%', flexShrink: 1 }}
                  displayEmpty
                >
                  <MenuItem value=""><em>Select a zone</em></MenuItem>
                  {filteredZones.map(zone => (
                    <MenuItem key={zone.id} value={zone.id}>{zone.name} - ${zone.price}</MenuItem>
                  ))}
                </Select>
              )}
            </Box>
          ))}
          <TextField
            label="Enter Promo Code"
            variant="outlined"
            value={promoCode}
            onChange={handlePromoCodeChange}
            sx={{
              mt: 2,
              width: '50%', // Setting width to 50% of the parent container
           // Adding automatic margins on both sides to center the field
            }}
          />
          <Typography sx={{ mt: 2 }}>
            Original Price: ${originalPrice}
          </Typography>
          <Typography>
            Discounted Price: ${discountedPrice}
          </Typography>
          <Button onClick={handleSubmit} variant="contained" sx={{ mt: 2, color: 'secondary.main' }}>
            Next
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
  
};

export default Booking;
