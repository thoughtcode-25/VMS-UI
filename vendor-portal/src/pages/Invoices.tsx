import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Chip,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  IconButton,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const MOCK_INVOICES = [
  { id: 'INV-2026-0021', po: 'PO-2026-0081', date: 'Jun 5, 2026', due: 'Jun 20, 2026', amount: '₹6,40,000', status: 'Approved', match: 'Matched' },
  { id: 'INV-2026-0020', po: 'PO-2026-0082', date: 'Jun 8, 2026', due: 'Jun 23, 2026', amount: '₹1,80,000', status: 'Paid', match: 'Matched' },
  { id: 'INV-2026-0019', po: 'PO-2026-0083', date: 'Jun 12, 2026', due: 'Jun 27, 2026', amount: '₹6,90,000', status: 'Paid', match: 'Matched' },
  { id: 'INV-2026-0018', po: 'PO-2026-0084', date: 'Jun 15, 2026', due: 'Jun 30, 2026', amount: '₹3,60,000', status: 'Paid', match: 'Matched' },
  { id: 'INV-2026-0022', po: 'PO-2026-0087', date: 'Jun 20, 2026', due: 'Jul 5, 2026', amount: '₹2,30,000', status: 'Pending', match: 'Unmatched' },
  { id: 'INV-2026-0023', po: 'PO-2026-0088', date: 'Jun 22, 2026', due: 'Jul 7, 2026', amount: '₹1,80,000', status: 'Pending', match: 'Pending' },
];

export default function Invoices() {
  const [raiseOpen, setRaiseOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Approved': return 'info';
      case 'Pending': return 'warning';
      case 'Overdue': return 'error';
      default: return 'default';
    }
  };

  const getMatchColor = (match: string) => {
    switch (match) {
      case 'Matched': return 'success';
      case 'Unmatched': return 'error';
      case 'Pending': return 'warning';
      default: return 'default';
    }
  };

  const handleView = (invoice: any) => {
    setSelectedInvoice(invoice);
    setViewOpen(true);
  };

  const handleSubmitRaise = () => {
    setRaiseOpen(false);
    setActiveStep(0);
    setSnackbarOpen(true);
  };

  const renderSummaryCard = (title: string, count: string, amount: string, colorHex: string) => (
    <Card 
      sx={{ 
        p: 2.5, 
        elevation: 0, 
        border: 'none', 
        borderRadius: 3, 
        background: `linear-gradient(135deg, ${colorHex} 0%, ${alpha(colorHex, 0.8)} 100%)`, 
        color: 'white',
        boxShadow: `0 8px 16px ${alpha(colorHex, 0.2)}`
      }}
    >
      <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, mb: 1, display: 'block' }}>
        {title}
      </Typography>
      <Typography variant="h4" fontWeight={800} gutterBottom sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        {amount}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, bgcolor: alpha('#fff', 0.2), p: 0.75, borderRadius: 1.5, width: 'fit-content' }}>
        <ReceiptIcon sx={{ fontSize: 14 }} />
        <Typography variant="caption" fontWeight={600}>
          {count} invoices
        </Typography>
      </Box>
    </Card>
  );

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
              Invoices & Billing
            </Typography>
            <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
              Submit invoices, track approvals, and monitor payments
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ bgcolor: alpha(theme.palette.warning.main, 0.4), p: 1.5, borderRadius: 2, minWidth: 100 }}>
              <Typography variant="h6" fontWeight={800} sx={{ pt: 0.5 }}>₹4.1L</Typography>
              <Typography variant="caption" sx={{ color: alpha('#fff', 0.8), textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Pending</Typography>
            </Box>
            <Box sx={{ bgcolor: alpha(theme.palette.success.main, 0.4), p: 1.5, borderRadius: 2, minWidth: 100 }}>
              <Typography variant="h6" fontWeight={800} sx={{ pt: 0.5 }}>₹11.8L</Typography>
              <Typography variant="caption" sx={{ color: alpha('#fff', 0.8), textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Paid</Typography>
            </Box>
            <Button 
              variant="contained" 
              color="secondary"
              startIcon={<AddIcon />} 
              onClick={() => setRaiseOpen(true)}
              size="large"
              sx={{ alignSelf: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
            >
              Raise Invoice
            </Button>
          </Box>
        </Box>
      </Card>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>{renderSummaryCard('Pending Approval', '2', '₹4,10,000', theme.palette.warning.main)}</Grid>
        <Grid item xs={12} sm={6} md={3}>{renderSummaryCard('Approved (Unpaid)', '2', '₹4,10,000', theme.palette.info.main)}</Grid>
        <Grid item xs={12} sm={6} md={3}>{renderSummaryCard('Paid (30 Days)', '3', '₹11,80,000', theme.palette.success.main)}</Grid>
        <Grid item xs={12} sm={6} md={3}>{renderSummaryCard('Overdue', '0', '₹0', theme.palette.error.main)}</Grid>
      </Grid>

      <Box sx={{ overflowX: 'auto', width: '100%' }}>
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell>Invoice #</TableCell>
                <TableCell>PO Reference</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Dates</TableCell>
                <TableCell>Match Status</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {MOCK_INVOICES.map((row) => (
                <TableRow key={row.id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main', whiteSpace: 'nowrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ReceiptIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                      {row.id}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>{row.po}</Typography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{row.amount}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.date}</Typography>
                    <Typography variant="caption" color="text.secondary">Due: {row.due}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={row.match} 
                      size="small" 
                      color={getMatchColor(row.match) as any} 
                      variant="outlined"
                      sx={{ fontWeight: 600, bgcolor: alpha(theme.palette[getMatchColor(row.match) as 'success'|'warning'|'error'].main, 0.05), border: 'none' }} 
                    />
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
                    <Button size="small" variant="outlined" onClick={() => handleView(row)} sx={{ fontWeight: 600 }}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Raise Invoice Dialog */}
      <Dialog open={raiseOpen} onClose={() => setRaiseOpen(false)} maxWidth="md" fullWidth fullScreen={isMobile}>
        <DialogTitle sx={{ fontWeight: 800, pb: 2 }}>Raise New Invoice</DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <Box sx={{ px: { xs: 2, md: 4 }, py: 3, bgcolor: alpha(theme.palette.primary.main, 0.02), borderBottom: '1px solid', borderColor: 'divider' }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              <Step><StepLabel>Select PO</StepLabel></Step>
              <Step><StepLabel>Line Items</StepLabel></Step>
              <Step><StepLabel>Review & Submit</StepLabel></Step>
            </Stepper>
          </Box>
          
          <Box sx={{ p: { xs: 2, md: 4 } }}>
            {activeStep === 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="h6" fontWeight={700}>Select Purchase Order</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Purchase Order</InputLabel>
                      <Select label="Purchase Order" defaultValue="">
                        <MenuItem value="PO-2026-0089">PO-2026-0089 (₹7,20,000)</MenuItem>
                        <MenuItem value="PO-2026-0088">PO-2026-0088 (₹4,80,000)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Your Invoice Number" defaultValue="INV-2026-0024" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth type="date" label="Invoice Date" InputLabelProps={{ shrink: true }} defaultValue="2026-06-25" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth type="date" label="Due Date" InputLabelProps={{ shrink: true }} defaultValue="2026-07-10" />
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeStep === 1 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight={700}>Invoice Items</Typography>
                  <Button size="small" startIcon={<AddIcon />} variant="outlined">Add Item</Button>
                </Box>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
                        <TableCell>Description</TableCell>
                        <TableCell align="right" width={100}>Qty</TableCell>
                        <TableCell align="right" width={150}>Rate (₹)</TableCell>
                        <TableCell align="right" width={150}>Amount (₹)</TableCell>
                        <TableCell width={50}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell><TextField size="small" fullWidth defaultValue="Implementation Services" variant="outlined" /></TableCell>
                        <TableCell><TextField size="small" fullWidth defaultValue="40" type="number" variant="outlined" inputProps={{ style: { textAlign: 'right' } }} /></TableCell>
                        <TableCell><TextField size="small" fullWidth defaultValue="8000" type="number" variant="outlined" inputProps={{ style: { textAlign: 'right' } }} /></TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, verticalAlign: 'middle' }}>3,20,000</TableCell>
                        <TableCell><IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><TextField size="small" fullWidth defaultValue="Support & Maintenance (Q3)" variant="outlined" /></TableCell>
                        <TableCell><TextField size="small" fullWidth defaultValue="1" type="number" variant="outlined" inputProps={{ style: { textAlign: 'right' } }} /></TableCell>
                        <TableCell><TextField size="small" fullWidth defaultValue="160000" type="number" variant="outlined" inputProps={{ style: { textAlign: 'right' } }} /></TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, verticalAlign: 'middle' }}>1,60,000</TableCell>
                        <TableCell><IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {activeStep === 2 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="h6" fontWeight={700}>Review Summary</Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={7}>
                    <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.03), borderRadius: 2, border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`, height: '100%' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase' }}>Invoice To</Typography>
                          <Typography variant="body2" fontWeight={700} mt={0.5}>Acme Corporation</Typography>
                          <Typography variant="body2" color="text.secondary">PO Ref: PO-2026-0089</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase' }}>Invoice No.</Typography>
                          <Typography variant="body2" fontWeight={700} mt={0.5}>INV-2026-0024</Typography>
                          <Typography variant="body2" color="text.secondary">Date: 25 Jun 2026</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>Subtotal</Typography>
                        <Typography variant="body2" fontWeight={700}>₹4,80,000</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>Tax (18% GST)</Typography>
                        <Typography variant="body2" fontWeight={700}>₹86,400</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2, borderTop: '2px dashed', borderColor: 'divider' }}>
                        <Typography variant="h6" fontWeight={800}>Total</Typography>
                        <Typography variant="h6" fontWeight={800} color="primary.main">₹5,66,400</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, px: { xs: 2, md: 4 } }}>
          {activeStep === 0 ? (
            <Button onClick={() => setRaiseOpen(false)} sx={{ fontWeight: 600 }}>Cancel</Button>
          ) : (
            <Button onClick={() => setActiveStep(activeStep - 1)} sx={{ fontWeight: 600 }}>Back</Button>
          )}
          <Box sx={{ flexGrow: 1 }} />
          {activeStep < 2 ? (
            <Button variant="contained" onClick={() => setActiveStep(activeStep + 1)} size="large">Next Step</Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleSubmitRaise} size="large">Submit Invoice</Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="md" fullWidth fullScreen={isMobile}>
        {selectedInvoice && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight={800}>Invoice Details</Typography>
                <Chip label={selectedInvoice.status} color={getStatusColor(selectedInvoice.status) as any} sx={{ fontWeight: 600 }} />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Status Timeline */}
                <Box sx={{ py: 2, px: { xs: 1, md: 4 }, bgcolor: alpha(theme.palette.primary.main, 0.02), borderRadius: 3, border: `1px solid ${alpha(theme.palette.primary.main, 0.05)}` }}>
                  <Stepper activeStep={selectedInvoice.status === 'Paid' ? 3 : selectedInvoice.status === 'Approved' ? 2 : 1} alternativeLabel>
                    <Step><StepLabel sx={{ '& .MuiStepLabel-label': { fontWeight: 600 } }}>Submitted</StepLabel></Step>
                    <Step><StepLabel sx={{ '& .MuiStepLabel-label': { fontWeight: 600 } }}>Under Review</StepLabel></Step>
                    <Step><StepLabel sx={{ '& .MuiStepLabel-label': { fontWeight: 600 } }}>Approved</StepLabel></Step>
                    <Step><StepLabel sx={{ '& .MuiStepLabel-label': { fontWeight: 600 } }}>Paid</StepLabel></Step>
                  </Stepper>
                </Box>

                <Grid container spacing={2}>
                  {[
                    { label: 'Invoice No.', value: selectedInvoice.id, highlight: true },
                    { label: 'PO Reference', value: selectedInvoice.po, isLink: true },
                    { label: 'Invoice Date', value: selectedInvoice.date },
                    { label: 'Due Date', value: selectedInvoice.due },
                  ].map((item, idx) => (
                    <Grid item xs={6} sm={3} key={idx}>
                      <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                          {item.label}
                        </Typography>
                        <Typography variant="body2" fontWeight={800} color={item.isLink ? 'primary.main' : item.highlight ? 'text.primary' : 'text.primary'} sx={{ cursor: item.isLink ? 'pointer' : 'default', fontSize: item.highlight ? '1.1rem' : 'inherit' }}>
                          {item.value}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Box>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>Line Items</Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
                          <TableCell>Description</TableCell>
                          <TableCell align="center">Qty</TableCell>
                          <TableCell align="right">Unit Price</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 500 }}>Services Rendered (Milestone 1)</TableCell>
                          <TableCell align="center">1</TableCell>
                          <TableCell align="right">{selectedInvoice.amount}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>{selectedInvoice.amount}</TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                          <TableCell colSpan={3} align="right" sx={{ fontWeight: 800 }}>Total Amount</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 800, color: 'primary.main', fontSize: '1.1rem' }}>{selectedInvoice.amount}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2.5 }}>
              <Button variant="outlined" onClick={() => setViewOpen(false)} sx={{ fontWeight: 600 }}>Download PDF</Button>
              <Box sx={{ flexGrow: 1 }} />
              <Button onClick={() => setViewOpen(false)} sx={{ fontWeight: 600 }}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={3000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%', fontWeight: 600 }}>
          Invoice submitted successfully and sent for approval.
        </Alert>
      </Snackbar>
    </Box>
  );
}
