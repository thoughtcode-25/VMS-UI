import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  TextField,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  InputAdornment,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Warning as WarningIcon,
  Visibility as ViewIcon,
  CloudUpload as UploadIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const MOCK_DOCUMENTS = [
  { id: 1, name: 'PAN Certificate', category: 'Tax', status: 'Verified', uploaded: 'Mar 10, 2024', expires: null },
  { id: 2, name: 'GST Certificate', category: 'Tax', status: 'Expired', uploaded: 'Jan 5, 2024', expires: 'Jun 20, 2026' },
  { id: 3, name: 'Company Registration', category: 'Legal', status: 'Verified', uploaded: 'Mar 10, 2024', expires: 'Dec 31, 2027' },
  { id: 4, name: 'MSME Certificate', category: 'Legal', status: 'Verified', uploaded: 'Apr 2, 2024', expires: null },
  { id: 5, name: 'Insurance Policy', category: 'Compliance', status: 'Pending', uploaded: 'Jun 15, 2026', expires: 'Jul 15, 2026' },
  { id: 6, name: 'Bank Proof', category: 'Financial', status: 'Pending', uploaded: 'Jun 20, 2026', expires: null },
];

export default function Documents() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified': return 'success';
      case 'Expired': return 'error';
      case 'Pending': return 'warning';
      default: return 'default';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Verified': return <CheckCircleIcon sx={{ fontSize: 16 }} />;
      case 'Expired': return <ErrorIcon sx={{ fontSize: 16 }} />;
      case 'Pending': return <WarningIcon sx={{ fontSize: 16 }} />;
      default: return undefined;
    }
  };

  const handleUploadSubmit = () => {
    setUploadOpen(false);
    setSnackbarOpen(true);
  };

  const filteredDocs = MOCK_DOCUMENTS.filter(doc => activeFilter === 'All' || doc.status === activeFilter);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header Banner */}
      <Card
        sx={{
          p: { xs: 2.5, md: 3 },
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 60%, ${theme.palette.primary.light} 100%)`,
          color: 'white',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          border: 'none',
        }}
      >
        <Box sx={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', bgcolor: alpha('#fff', 0.05) }} />
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 3, position: 'relative', zIndex: 1 }}>
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: 'white', mb: 0.5 }}>
              Compliance Documents
            </Typography>
            <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
              Manage your mandatory compliance and business verification records
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ bgcolor: alpha('#fff', 0.1), p: 1.5, borderRadius: 2, minWidth: 100 }}>
              <Typography variant="h4" fontWeight={800}>{MOCK_DOCUMENTS.length}</Typography>
              <Typography variant="caption" sx={{ color: alpha('#fff', 0.8), textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Total Docs</Typography>
            </Box>
            <Box sx={{ bgcolor: alpha(theme.palette.success.main, 0.4), p: 1.5, borderRadius: 2, minWidth: 100 }}>
              <Typography variant="h4" fontWeight={800}>{MOCK_DOCUMENTS.filter(d => d.status === 'Verified').length}</Typography>
              <Typography variant="caption" sx={{ color: alpha('#fff', 0.8), textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Verified</Typography>
            </Box>
            <Box sx={{ bgcolor: alpha(theme.palette.error.main, 0.4), p: 1.5, borderRadius: 2, minWidth: 100 }}>
              <Typography variant="h4" fontWeight={800}>{MOCK_DOCUMENTS.filter(d => d.status === 'Expired').length}</Typography>
              <Typography variant="caption" sx={{ color: alpha('#fff', 0.8), textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Expired</Typography>
            </Box>
          </Box>
        </Box>
      </Card>

      <Alert severity="warning" sx={{ borderRadius: 2, fontWeight: 500 }}>
        Action Required: GST Certificate has expired. Insurance Policy is expiring in 19 days.
      </Alert>

      {/* Toolbar */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: { xs: 1, sm: 0 } }}>
          {['All', 'Verified', 'Pending', 'Expired'].map(filter => (
            <Chip 
              key={filter} 
              label={filter} 
              onClick={() => setActiveFilter(filter)}
              color={activeFilter === filter ? 'primary' : 'default'}
              variant={activeFilter === filter ? 'filled' : 'outlined'}
              sx={{ fontWeight: 600 }}
            />
          ))}
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField 
            placeholder="Search documents..." 
            size="small" 
            sx={{ flexGrow: 1, minWidth: { sm: 250 }, bgcolor: 'background.paper', borderRadius: 1 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
            }}
          />
          <Button 
            variant="contained" 
            startIcon={<UploadIcon />} 
            onClick={() => setUploadOpen(true)}
            sx={{ flexShrink: 0 }}
          >
            Upload
          </Button>
        </Box>
      </Box>

      {/* Document Grid */}
      <Grid container spacing={3}>
        {filteredDocs.map((doc) => {
          const statusColor = theme.palette[getStatusColor(doc.status) as 'success'|'warning'|'error'].main;
          const isExpired = doc.status === 'Expired';
          
          return (
            <Grid item xs={12} sm={6} md={4} key={doc.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderTop: `4px solid ${statusColor}`,
                bgcolor: isExpired ? alpha(statusColor, 0.02) : 'background.paper',
                ...(isExpired && { borderColor: alpha(statusColor, 0.3) })
              }}>
                <Box sx={{ p: 2.5, flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ 
                      p: 1.5, 
                      bgcolor: alpha(statusColor, 0.1), 
                      color: statusColor, 
                      borderRadius: 2,
                      display: 'flex'
                    }}>
                      <DescriptionIcon fontSize="medium" />
                    </Box>
                    <Chip 
                      label={doc.status} 
                      size="small" 
                      color={getStatusColor(doc.status) as any} 
                      icon={getStatusIcon(doc.status)}
                      sx={{ fontWeight: 600, pl: 0.5 }}
                    />
                  </Box>
                  
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1, lineHeight: 1.2 }}>
                    {doc.name}
                  </Typography>
                  <Chip label={doc.category} size="small" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600, mb: 2, bgcolor: alpha(theme.palette.text.secondary, 0.1) }} />
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Uploaded</span> <span style={{ fontWeight: 600, color: theme.palette.text.primary }}>{doc.uploaded}</span>
                    </Typography>
                    {doc.expires && (
                      <Typography variant="caption" sx={{ display: 'flex', justifyContent: 'space-between', color: isExpired ? statusColor : 'text.secondary' }}>
                        <span>Valid Until</span> <span style={{ fontWeight: 600, color: isExpired ? statusColor : theme.palette.text.primary }}>{doc.expires}</span>
                      </Typography>
                    )}
                  </Box>
                </Box>
                
                <Box sx={{ p: 1.5, borderTop: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.primary.main, 0.02), display: 'flex', gap: 1 }}>
                  <Button size="small" variant="text" startIcon={<ViewIcon />} fullWidth sx={{ color: 'text.primary', fontWeight: 600 }}>
                    View
                  </Button>
                  {(doc.status === 'Expired' || doc.status === 'Pending') && (
                    <Button 
                      size="small" 
                      variant="contained" 
                      color={isExpired ? 'error' : 'primary'}
                      startIcon={<UploadIcon />}
                      onClick={() => setUploadOpen(true)}
                      fullWidth
                    >
                      Re-upload
                    </Button>
                  )}
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onClose={() => setUploadOpen(false)} maxWidth="sm" fullWidth fullScreen={isMobile}>
        <DialogTitle sx={{ fontWeight: 700 }}>Upload Document</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Document Type</InputLabel>
              <Select label="Document Type" defaultValue="">
                <MenuItem value="PAN">PAN Certificate</MenuItem>
                <MenuItem value="GST">GST Certificate</MenuItem>
                <MenuItem value="Registration">Company Registration</MenuItem>
                <MenuItem value="Insurance">Insurance Policy</MenuItem>
                <MenuItem value="Bank Proof">Bank Proof</MenuItem>
                <MenuItem value="MSME">MSME Certificate</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            
            <TextField 
              label="Expiry Date (if applicable)" 
              type="date" 
              fullWidth 
              size="small" 
              InputLabelProps={{ shrink: true }}
            />

            <Box 
              sx={{ 
                border: '2px dashed', 
                borderColor: theme.palette.primary.main, 
                borderRadius: 3, 
                p: 5, 
                textAlign: 'center',
                bgcolor: alpha(theme.palette.primary.main, 0.03),
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) }
              }}
            >
              <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: alpha(theme.palette.primary.main, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                <UploadIcon color="primary" sx={{ fontSize: 30 }} />
              </Box>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Click to upload or drag and drop
              </Typography>
              <Typography variant="body2" color="text.secondary">
                PDF, JPG, PNG or ZIP (Max 25MB)
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setUploadOpen(false)} sx={{ fontWeight: 600 }}>Cancel</Button>
          <Button variant="contained" onClick={handleUploadSubmit} size="large">
            Upload Document
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={3000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%', fontWeight: 600 }}>
          Document uploaded successfully. Verification in progress.
        </Alert>
      </Snackbar>
    </Box>
  );
}
