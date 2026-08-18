import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Grid,
  TextField,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Save as SaveIcon, 
  Visibility, 
  VisibilityOff,
  Business as BusinessIcon,
  People as PeopleIcon,
  VerifiedUser as VerifiedUserIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Profile() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [formData, setFormData] = useState({
    companyName: 'Nexus Solutions Pvt Ltd',
    vendorCode: 'VMS-2024-0042',
    category: 'IT Services & Consulting',
    legalAddress: '4th Floor, Tech Park, Whitefield, Bengaluru, Karnataka 560066',
    website: 'www.nexussolutions.in',
    yearFounded: '2018',
    employeeCount: '150-200',
    contactPerson: 'Arjun Mehta',
    designation: 'Chief Financial Officer',
    email: 'arjun.mehta@nexussolutions.in',
    phone: '+91 98765 43210',
    bankName: 'HDFC Bank',
    accountNumber: '4892345678904892',
    ifscCode: 'HDFC0001234',
    branch: 'Whitefield, Bengaluru',
    accountType: 'Current',
    gstNumber: '29AADCN9462M1Z4',
    panNumber: 'AADCN9462M',
    msmeRegistration: 'UDYAM-KA-06-0012345 (Registered)',
    tdsCategory: '194C — Contractor',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    setSnackbarOpen(true);
  };

  const renderField = (label: string, value: string, field: string, isMasked = false) => {
    if (isEditing) {
      return (
        <TextField
          fullWidth
          label={label}
          value={value}
          onChange={handleChange(field)}
          variant="outlined"
          size="small"
          type={isMasked && !showAccount ? 'password' : 'text'}
          InputProps={isMasked ? {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowAccount(!showAccount)} edge="end">
                  {showAccount ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          } : undefined}
        />
      );
    }

    let displayValue = value;
    if (isMasked && !showAccount) {
      displayValue = `••••••••${value.slice(-4)}`;
    }

    return (
      <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02), borderRadius: 2, border: `1px solid ${alpha(theme.palette.primary.main, 0.05)}`, height: '100%' }}>
        <Typography variant="caption" color="text.secondary" display="block" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5 }}>
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          {displayValue}
          {isMasked && (
            <IconButton size="small" onClick={() => setShowAccount(!showAccount)} sx={{ ml: 1, p: 0.5 }}>
              {showAccount ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </IconButton>
          )}
        </Typography>
      </Box>
    );
  };

  const renderContactCard = (title: string, name: string, email: string, phone: string, color: string) => (
    <Card sx={{ borderLeft: `4px solid ${color}`, height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Box sx={{ p: 1, bgcolor: alpha(color, 0.1), borderRadius: 2, color: color, display: 'flex' }}>
            <PersonIcon />
          </Box>
          <Typography variant="subtitle2" fontWeight={700}>{title}</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Name</Typography>
            <Typography variant="body2" fontWeight={600}>{name}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Email</Typography>
            <Typography variant="body2" fontWeight={600}>{email}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Phone</Typography>
            <Typography variant="body2" fontWeight={600}>{phone}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Banner */}
      <Card
        sx={{
          p: { xs: 2.5, md: 3.5 },
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 60%, ${theme.palette.primary.light} 100%)`,
          color: 'white',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          border: 'none',
        }}
      >
        <Box sx={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', bgcolor: alpha('#fff', 0.05) }} />
        <Box sx={{ position: 'absolute', bottom: -60, right: 80, width: 160, height: 160, borderRadius: '50%', bgcolor: alpha('#fff', 0.04) }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, position: 'relative', zIndex: 1 }}>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ color: 'white', mb: 1 }}>
              {formData.companyName}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" sx={{ color: alpha('#fff', 0.7), display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>GSTIN</Typography>
                <Typography variant="body2" fontWeight={600}>{formData.gstNumber}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: alpha('#fff', 0.7), display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>Vendor Code</Typography>
                <Typography variant="body2" fontWeight={600}>{formData.vendorCode}</Typography>
              </Box>
            </Box>
          </Box>
          <Chip
            icon={<CheckCircleIcon sx={{ color: '#fff !important', fontSize: 16 }} />}
            label="Approved"
            sx={{
              bgcolor: alpha('#fff', 0.15),
              color: 'white',
              fontWeight: 600,
              border: `1px solid ${alpha('#fff', 0.25)}`,
            }}
          />
        </Box>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ borderBottom: 1, borderColor: 'divider', flexGrow: 1 }}
        >
          <Tab icon={<BusinessIcon sx={{ mr: 1, fontSize: 20 }} />} iconPosition="start" label="Company Info" />
          <Tab icon={<PeopleIcon sx={{ mr: 1, fontSize: 20 }} />} iconPosition="start" label="Contacts" />
          <Tab icon={<VerifiedUserIcon sx={{ mr: 1, fontSize: 20 }} />} iconPosition="start" label="Compliance" />
        </Tabs>
        
        <Box sx={{ ml: 2, display: { xs: 'none', sm: 'block' } }}>
          {!isEditing ? (
            <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSave}>Save</Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Mobile edit toggle */}
      <Box sx={{ display: { xs: 'flex', sm: 'none' }, gap: 1 }}>
        {!isEditing ? (
          <Button fullWidth variant="outlined" startIcon={<EditIcon />} onClick={() => setIsEditing(true)}>Edit</Button>
        ) : (
          <>
            <Button fullWidth variant="outlined" color="error" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button fullWidth variant="contained" onClick={handleSave}>Save</Button>
          </>
        )}
      </Box>

      <Card sx={{ p: 3 }}>
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>{renderField('Legal Name', formData.companyName, 'companyName')}</Grid>
            <Grid item xs={12} sm={6} md={4}>{renderField('Trade Name', formData.companyName, 'companyName')}</Grid>
            <Grid item xs={12} sm={6} md={4}>{renderField('Business Type', formData.category, 'category')}</Grid>
            <Grid item xs={12} sm={6} md={4}>{renderField('GSTIN', formData.gstNumber, 'gstNumber')}</Grid>
            <Grid item xs={12} sm={6} md={4}>{renderField('PAN', formData.panNumber, 'panNumber')}</Grid>
            <Grid item xs={12} sm={6} md={4}>{renderField('Incorporation Date', formData.yearFounded, 'yearFounded')}</Grid>
            <Grid item xs={12} sm={6} md={4}>{renderField('Turnover Category', 'Mid-Market (₹50Cr - ₹250Cr)', 'turnover')}</Grid>
            <Grid item xs={12} md={8}>{renderField('Registered Address', formData.legalAddress, 'legalAddress')}</Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" fontWeight={700} mb={3}>Key Contacts</Typography>
          <Grid container spacing={3} mb={5}>
            <Grid item xs={12} md={4}>
              {renderContactCard('Primary Contact', formData.contactPerson, formData.email, formData.phone, theme.palette.primary.main)}
            </Grid>
            <Grid item xs={12} md={4}>
              {renderContactCard('Finance Contact', 'Meera Reddy', 'finance@nexussolutions.in', '+91 98765 11111', theme.palette.secondary.main)}
            </Grid>
            <Grid item xs={12} md={4}>
              {renderContactCard('Technical Contact', 'Vikram Singh', 'tech@nexussolutions.in', '+91 98765 22222', theme.palette.info.main)}
            </Grid>
          </Grid>
          
          <Typography variant="h6" fontWeight={700} mb={3}>Banking Details</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>{renderField('Bank Name', formData.bankName, 'bankName')}</Grid>
            <Grid item xs={12} sm={6} md={4}>{renderField('Account Number', formData.accountNumber, 'accountNumber', true)}</Grid>
            <Grid item xs={12} sm={6} md={4}>{renderField('IFSC Code', formData.ifscCode, 'ifscCode')}</Grid>
            <Grid item xs={12} sm={6} md={4}>{renderField('Branch', formData.branch, 'branch')}</Grid>
            <Grid item xs={12} sm={6} md={4}>{renderField('Account Type', formData.accountType, 'accountType')}</Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ minWidth: 600 }}>
              <Grid container spacing={2} sx={{ mb: 2, px: 2 }}>
                <Grid item xs={4}><Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Document</Typography></Grid>
                <Grid item xs={3}><Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Reference No.</Typography></Grid>
                <Grid item xs={3}><Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Status</Typography></Grid>
                <Grid item xs={2}><Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Valid Until</Typography></Grid>
              </Grid>
              
              {[
                { name: 'GST Certificate', ref: formData.gstNumber, status: 'Verified', color: 'success', valid: 'Permanent' },
                { name: 'PAN Card', ref: formData.panNumber, status: 'Verified', color: 'success', valid: 'Permanent' },
                { name: 'MSME Certificate', ref: 'UDYAM-KA-06', status: 'Verified', color: 'success', valid: 'Permanent' },
                { name: 'Insurance Policy', ref: 'POL-992384', status: 'Pending', color: 'warning', valid: '15 Jul 2026' },
                { name: 'Bank Account Proof', ref: 'Cancelled Cheque', status: 'Expired', color: 'error', valid: '20 Jun 2026' },
              ].map((item, idx) => (
                <Box key={idx} sx={{ p: 2, mb: 1, borderRadius: 2, bgcolor: alpha(theme.palette[item.color as 'success'|'warning'|'error'].main, 0.05), border: `1px solid ${alpha(theme.palette[item.color as 'success'|'warning'|'error'].main, 0.1)}` }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={4}><Typography variant="body2" fontWeight={600}>{item.name}</Typography></Grid>
                    <Grid item xs={3}><Typography variant="body2" fontFamily="monospace">{item.ref}</Typography></Grid>
                    <Grid item xs={3}><Chip label={item.status} color={item.color as any} size="small" /></Grid>
                    <Grid item xs={2}><Typography variant="body2">{item.valid}</Typography></Grid>
                  </Grid>
                </Box>
              ))}
            </Box>
          </Box>
        </TabPanel>
      </Card>

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={3000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          Profile updated successfully.
        </Alert>
      </Snackbar>
    </Box>
  );
}
