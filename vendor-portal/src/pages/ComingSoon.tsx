import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useLocation } from 'wouter';

export default function ComingSoon() {
  const [, setLocation] = useLocation();

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '60vh',
        textAlign: 'center'
      }}
    >
      <Typography variant="h3" fontWeight={700} gutterBottom color="primary.main">
        Coming Soon
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
        This page is currently under development. The complete VMS Vendor Portal experience will be available shortly.
      </Typography>
      <Button variant="outlined" onClick={() => setLocation('/dashboard')}>
        Return to Dashboard
      </Button>
    </Box>
  );
}