import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Grid,
  Card,
  useTheme,
  useMediaQuery,
  alpha,
  TextField
} from '@mui/material';
import {
  Create as DrawIcon,
  Gavel as GavelIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const MOCK_CONTRACTS = [
  { id: 'CNT-2026-001', title: 'Annual IT Support Services', type: 'Master Services Agreement', start: 'Jan 1, 2026', end: 'Dec 31, 2026', value: '₹18,00,000', status: 'Active' },
  { id: 'CNT-2026-002', title: 'Cloud Infrastructure Management', type: 'SLA', start: 'Apr 1, 2026', end: 'Mar 31, 2027', value: '₹24,00,000', status: 'Active' },
  { id: 'CNT-2026-003', title: 'Software Development Services', type: 'Statement of Work', start: 'Jun 1, 2026', end: 'May 31, 2027', value: '₹36,00,000', status: 'Pending Signature' },
  { id: 'CNT-2025-008', title: 'Legacy System Maintenance', type: 'Maintenance Contract', start: 'Jan 1, 2025', end: 'Jun 30, 2026', value: '₹12,00,000', status: 'Expiring Soon' },
];

export default function Contracts() {
  const [viewOpen, setViewOpen] = useState(false);
  const [signOpen, setSignOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Pending Signature': return 'warning';
      case 'Expiring Soon': return 'error';
      case 'Under Review': return 'info';
      default: return 'default';
    }
  };

  const handleView = (contract: any) => {
    setSelectedContract(contract);
    setViewOpen(true);
  };

  const handleSignClick = (contract: any) => {
    setSelectedContract(contract);
    setSignOpen(true);
  };

  const handleConfirmSign = () => {
    setSignOpen(false);
    setViewOpen(false);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header Banner */}
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
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 3, position: 'relative', zIndex: 1 }}>
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: 'white', mb: 0.5 }}>
              Contracts & Agreements
            </Typography>
            <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
              Manage master service agreements, statements of work, and SLAs
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ bgcolor: alpha(theme.palette.success.main, 0.4), p: 1.5, borderRadius: 2, minWidth: 100 }}>
              <Typography variant="h4" fontWeight={800}>2</Typography>
              <Typography variant="caption" sx={{ color: alpha('#fff', 0.8), textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Active</Typography>
            </Box>
            <Box sx={{ bgcolor: alpha('#fff', 0.1), p: 1.5, borderRadius: 2, minWidth: 100 }}>
              <Typography variant="h4" fontWeight={800}>₹90L</Typography>
              <Typography variant="caption" sx={{ color: alpha('#fff', 0.8), textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Total Value</Typography>
            </Box>
            <Box sx={{ bgcolor: alpha(theme.palette.error.main, 0.4), p: 1.5, borderRadius: 2, minWidth: 100 }}>
              <Typography variant="h6" fontWeight={800} sx={{ pt: 0.5 }}>Jun 30</Typography>
              <Typography variant="caption" sx={{ color: alpha('#fff', 0.8), textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Next Renewal</Typography>
            </Box>
          </Box>
        </Box>
      </Card>

      {/* Summary Chips */}
      <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1 }}>
        {[
          { label: 'Active', count: 2, color: 'success', icon: <CheckCircleIcon fontSize="small" /> },
          { label: 'Pending Signature', count: 1, color: 'warning', icon: <DrawIcon fontSize="small" /> },
          { label: 'Expiring Soon', count: 1, color: 'error', icon: <WarningIcon fontSize="small" /> },
          { label: 'Under Review', count: 0, color: 'info', icon: <ScheduleIcon fontSize="small" /> }
        ].map((chip) => (
          <Chip
            key={chip.label}
            icon={chip.icon}
            label={`${chip.label} (${chip.count})`}
            color={chip.color as any}
            variant="outlined"
            sx={{ 
              fontWeight: 600, 
              bgcolor: alpha(theme.palette[chip.color as 'success'|'warning'|'error'|'info'].main, 0.1),
              borderColor: alpha(theme.palette[chip.color as 'success'|'warning'|'error'|'info'].main, 0.3),
            }}
          />
        ))}
      </Box>

      {/* Table */}
      <Box sx={{ overflowX: 'auto', width: '100%' }}>
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>Contract #</TableCell>
                <TableCell>Title & Type</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Period</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {MOCK_CONTRACTS.map((row) => (
                <TableRow key={row.id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                  <TableCell sx={{ fontWeight: 600, color: 'primary.main', whiteSpace: 'nowrap' }}>{row.id}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={700}>{row.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{row.type}</Typography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{row.value}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.start}</Typography>
                    <Typography variant="caption" color="text.secondary">to {row.end}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={row.status} 
                      size="small" 
                      color={getStatusColor(row.status) as any} 
                      sx={{ fontWeight: 600 }} 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Button size="small" variant="outlined" onClick={() => handleView(row)} sx={{ fontWeight: 600 }}>
                        View
                      </Button>
                      {row.status === 'Pending Signature' && (
                        <Button size="small" variant="contained" color="primary" onClick={() => handleSignClick(row)}>
                          Sign
                        </Button>
                      )}
                      {row.status === 'Expiring Soon' && (
                        <Button size="small" variant="contained" color="error">
                          Renew
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Detail Dialog */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="md" fullWidth fullScreen={isMobile}>
        {selectedContract && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight={800}>Contract Details</Typography>
                <Chip label={selectedContract.status} color={getStatusColor(selectedContract.status) as any} sx={{ fontWeight: 600 }} />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="h5" color="primary.main" fontWeight={800} mb={0.5}>{selectedContract.title}</Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>{selectedContract.id} • {selectedContract.type}</Typography>
                </Box>
                
                <Grid container spacing={2}>
                  {[
                    { label: 'Total Value', value: selectedContract.value },
                    { label: 'Start Date', value: selectedContract.start },
                    { label: 'End Date', value: selectedContract.end },
                    { label: 'Payment Terms', value: 'Net 30 Days' },
                    { label: 'Notice Period', value: '60 Days' },
                    { label: 'Renewal Clause', value: 'Auto-renewal for 1 year' },
                  ].map((item, idx) => (
                    <Grid item xs={6} sm={4} key={idx}>
                      <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.03), borderRadius: 2, border: `1px solid ${alpha(theme.palette.primary.main, 0.05)}`, height: '100%' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                          {item.label}
                        </Typography>
                        <Typography variant="body2" fontWeight={700}>{item.value}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ display: 'flex', gap: 3, p: 3, bgcolor: alpha(theme.palette.secondary.main, 0.05), borderRadius: 3, borderLeft: `4px solid ${theme.palette.secondary.main}` }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase' }}>Buyer</Typography>
                    <Typography variant="subtitle1" fontWeight={700}>Acme Corporation</Typography>
                    <Typography variant="body2" color="text.secondary">Signed by: Pending</Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase' }}>Vendor</Typography>
                    <Typography variant="subtitle1" fontWeight={700}>Nexus Solutions Pvt Ltd</Typography>
                    <Typography variant="body2" color="text.secondary">Signed by: Pending</Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>Scope Description</Typography>
                  <Paper variant="outlined" sx={{ p: 2.5, bgcolor: '#fafafa', borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                      This agreement covers the comprehensive provision of services as outlined in Annexure A. 
                      Vendor agrees to deliver milestones according to schedule, adhering to SLAs and compliance requirements of Acme Corporation.
                      Confidentiality clauses apply to all intellectual property shared during the engagement period.
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2.5 }}>
              <Button variant="outlined" onClick={() => setViewOpen(false)} sx={{ fontWeight: 600 }}>Download PDF</Button>
              <Box sx={{ flexGrow: 1 }} />
              <Button onClick={() => setViewOpen(false)} sx={{ fontWeight: 600 }}>Close</Button>
              {selectedContract.status === 'Pending Signature' && (
                <Button variant="contained" color="primary" onClick={() => handleSignClick(selectedContract)} size="large">
                  E-Sign Contract
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Sign Dialog */}
      <Dialog open={signOpen} onClose={() => setSignOpen(false)} maxWidth="sm" fullWidth fullScreen={isMobile}>
        <DialogTitle sx={{ fontWeight: 800 }}>Digital Signature</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <Alert severity="info" sx={{ fontWeight: 500, borderRadius: 2 }}>
              You are electronically signing <strong>{selectedContract?.title}</strong> ({selectedContract?.id}). This action is legally binding.
            </Alert>
            
            <Box>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>Signatory Name</Typography>
              <TextField fullWidth size="small" defaultValue="Arjun Mehta (Chief Financial Officer)" disabled />
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>Draw Signature</Typography>
              <Box 
                sx={{ 
                  height: 200, 
                  border: '2px dashed', 
                  borderColor: theme.palette.primary.main, 
                  borderRadius: 3, 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha(theme.palette.primary.main, 0.03),
                  cursor: 'crosshair'
                }}
              >
                <DrawIcon color="primary" sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Click and drag to apply digital signature
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setSignOpen(false)} sx={{ fontWeight: 600 }}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleConfirmSign} size="large">
            Confirm & Sign
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
          Contract successfully signed and legally bound.
        </Alert>
      </Snackbar>
    </Box>
  );
}
