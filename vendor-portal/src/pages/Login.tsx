import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Checkbox, 
  FormControlLabel, 
  Grid, 
  Link, 
  Paper, 
  TextField, 
  Typography,
  IconButton,
  InputAdornment,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Login as LoginIcon, 
  CheckCircle as CheckCircleIcon 
} from '@mui/icons-material';
import { useLocation } from 'wouter';

export default function Login() {
  const theme = useTheme();
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation('/dashboard');
  };

  return (
    <Grid container component="main" sx={{ height: '100vh', overflow: 'hidden' }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          background: `linear-gradient(160deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
          display: { xs: 'none', sm: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          color: 'white',
          px: { sm: 4, md: 8, lg: 12 },
          py: 4,
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            bgcolor: alpha('#fff', 0.05),
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -50,
            right: -50,
            width: 300,
            height: 300,
            borderRadius: '50%',
            bgcolor: alpha('#fff', 0.04),
          }}
        />
        <Box sx={{ maxWidth: 600, zIndex: 1 }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight={800} sx={{ fontSize: { sm: '2.5rem', md: '3.5rem' }, mb: 4 }}>
            Supplier Success.
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 8 }}>
            {[
              'Manage POs & Invoices',
              'Track Payments in Real-time',
              'E-sign Contracts Digitally'
            ].map((feature, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CheckCircleIcon sx={{ color: 'white', opacity: 0.9 }} />
                <Typography variant="h6" fontWeight={500} sx={{ opacity: 0.9 }}>
                  {feature}
                </Typography>
              </Box>
            ))}
          </Box>
          
          <Box sx={{ mt: 'auto', pt: 8 }}>
            <Typography variant="body2" sx={{ opacity: 0.7, fontWeight: 500 }}>
              Secure enterprise environment. ISO 27001 Certified.
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <Box sx={{ display: { xs: 'flex', sm: 'none' }, bgcolor: 'primary.main', color: 'white', p: 2, alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={700}>VMS Portal</Typography>
          <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 500 }}>Acme Corporation</Typography>
        </Box>
        <Box
          sx={{
            my: 'auto',
            mx: { xs: 3, sm: 4, md: 8, lg: 10 },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h5" fontWeight={800} color="primary.main" sx={{ mb: 6, display: { xs: 'none', sm: 'block' } }}>
            VMS Portal
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <Typography component="h1" variant="h4" fontWeight={700} gutterBottom>
              Vendor Login
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome to Acme Corporation Vendor Portal
            </Typography>
          </Box>
          <Box component="form" noValidate onSubmit={handleSignIn} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              size="medium"
              inputProps={{ "data-testid": "input-email" }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              size="medium"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              inputProps={{ "data-testid": "input-password" }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 4 }}>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label={<Typography variant="body2" fontWeight={500}>Remember me</Typography>}
              />
              <Link href="#" variant="body2" sx={{ fontWeight: 600, color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Forgot password?
              </Link>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              startIcon={<LoginIcon />}
              sx={{ py: 1.5, fontSize: '1.05rem' }}
              data-testid="button-signin"
            >
              Sign In
            </Button>
            
            <Box sx={{ mt: { xs: 6, md: 8 }, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Powered by VMS Platform v3.0
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
