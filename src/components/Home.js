import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';
import { LocationOn, Event, People } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <Container
            maxWidth={false}
            disableGutters
            sx={{
                backgroundColor: 'black',
                color: 'white',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            <Button
                component={Link}
                to="/reservations"
                variant="contained"
                sx={{
                    backgroundColor: 'red',
                    color: 'white',
                    fontWeight: 'bold',
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    textTransform: 'uppercase',
                }}
            >
                My Reservations
            </Button>

            <Typography
                variant="h2"
                component={motion.div}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                sx={{ mb: 5 }}
            >
                F1 Grand Prix de Monaco 2024
            </Typography>

            <motion.img
                src="https://media.formula1.com/image/upload/f_auto,c_limit,w_1440,q_auto/f_auto/q_auto/content/dam/fom-website/sutton/2022/Italy/Sunday/1422823415"
                alt="F1 Race"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                    width: '80%',
                    height: 'auto',
                    maxWidth: '1200px',
                    marginBottom: '30px',
                }}
            />

            <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <LocationOn sx={{ color: 'red', mr: 1 }} />
                    Monaco, Monte Carlo
                </Typography>

                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <Event sx={{ color: 'red', mr: 1 }} />
                    May 25-27, 2024
                </Typography>

                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 5 }}>
                    <People sx={{ color: 'red', mr: 1 }} />
                    Featuring: Lewis Hamilton, Max Verstappen, Charles Leclerc
                </Typography>

                <Button
                    component={motion.button}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    variant="contained"
                    sx={{
                        backgroundColor: 'red',
                        color: 'white',
                        fontWeight: 'bold',
                        padding: '10px 20px',
                        textTransform: 'uppercase',
                    }}
                    to="/booking"
                    component={Link}
                >
                    Make Reservation
                </Button>
            </Box>
        </Container>
    );
};

export default Home;
