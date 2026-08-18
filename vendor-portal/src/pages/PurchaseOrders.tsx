import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
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
  Pagination,
  Chip,
  FormControl,
  InputLabel,
  InputAdornment,
  Grid,
  Card,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import { Search as SearchIcon, ShoppingCart as ShoppingCartIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';

const MOCK_POS = [
  { id: 'PO-2026-0089', date: 'Jun 25, 2026', delivery: 'Jul 10, 2026', dept: 'IT Operations', items: '3 items', amount: '₹7,20,000', status: 'Sent' },
  { id: 'PO-2026-0088', date: 'Jun 20, 2026', delivery: 'Jul 5, 2026', dept: 'Infrastructure', items: '2 items', amount: '₹4,80,000', status: 'Accepted' },
  { id: 'PO-2026-0087', date: 'Jun 18, 2026', delivery: 'Jun 30, 2026', dept: 'Marketing', items: '5 items', amount: '₹12,40,000', status: 'Accepted' },
  { id: 'PO-2026-0086', date: 'Jun 15, 2026', delivery: 'Jun 28, 2026', dept: 'IT Operations', items: '1 item', amount: '₹2,10,000', status: 'Sent' },
  { id: 'PO-2026-0085', date: 'Jun 12, 2026', delivery: 'Jun 25, 2026', dept: 'Infrastructure', items: '4 items', amount: '₹5,10,000', status: 'Completed' },
  { id: 'PO-2026-0084', date: 'Jun 8, 2026', delivery: 'Jun 20, 2026', dept: 'IT Operations', items: '2 items', amount: '₹3,60,000', status: 'Completed' },
  { id: 'PO-2026-0083', date: 'Jun 5, 2026', delivery: 'Jun 18, 2026', dept: 'Finance', items: '3 items', amount: '₹6,90,000', status: 'Completed' },
  { id: 'PO-2026-0082', date: 'Jun 1, 2026', delivery: 'Jun 14, 2026', dept: 'HR', items: '1 item', amount: '₹1,80,000', status: 'Completed' },
  { id: 'PO-2026-0081', date: 'May 28, 2026', delivery: 'Jun 10, 2026', dept: 'IT Operations', items: '2 items', amount: '₹6,40,000', status: 'Completed' },
  { id: 'PO-2026-0080', date: 'May 20, 2026', delivery: 'Jun 5, 2026', dept: 'Marketing', items: '3 items', amount: '₹4,20,000', status: 'Cancelled' },
];

export default function PurchaseOrders() {
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const [viewOpen, setViewOpen] = useState(false);
  const [ackOpen, setAckOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<any>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted': return 'success';
      case 'Completed': return 'info';
      case 'Sent': return 'warning';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const handleView = (po: any) => {
    setSelectedPO(po);
    setViewOpen(true);
  };

  const handleAckClick = (po: any) => {
    setSelectedPO(po);
    setAckOpen(true);
  };

  const handleConfirmAck = () => {
    setAckOpen(false);
    setViewOpen(false);
    setSnackbarOpen(true);
  };

  const rowsPerPage = 6;
  const paginatedData = MOCK_POS.slice((page - 1) * rowsPerPage, page * rowsPerPage);

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
              Purchase Orders
            </Typography>
            <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
              Track, acknowledge, and fulfill orders from buyers
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ bgcolor: alpha(theme.palette.warning.main, 0.4), p: 1.5, borderRadius: 2, minWidth: 100 }}>
              <Typography variant="h4" fontWeight={800}>2</Typography>
              <Typography variant="caption" sx={{ color: alpha('#fff', 0.8), textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Needs Action</Typography>
            </Box>
            <Box sx={{ bgcolor: alpha(theme.palette.success.main, 0.4), p: 1.5, borderRadius: 2, minWidth: 100 }}>
              <Typography variant="h4" fontWeight={800}>7</Typography>
              <Typography variant="caption" sx={{ color: alpha('#fff', 0.8), textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Open POs</Typography>
            </Box>
            <Box sx={{ bgcolor: alpha('#fff', 0.1), p: 1.5, borderRadius: 2, minWidth: 100 }}>
              <Typography variant="h4" fontWeight={800}>₹24.5L</Typography>
              <Typography variant="caption" sx={{ color: alpha('#fff', 0.8), textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Open Value</Typography>
            </Box>
          </Box>
        </Box>
      </Card>

      {/* Toolbar & Filters */}
      <Card sx={{ p: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, v) => setTabValue(v)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab label="All Orders" />
            <Tab label="Needs Acknowledgement (2)" />
            <Tab label="Accepted" />
            <Tab label="Completed" />
            <Tab label="Cancelled" />
          </Tabs>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField 
              fullWidth 
              placeholder="Search PO # or Dept..." 
              size="small" 
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
              }} 
            />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select label="Status" defaultValue="">
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="Sent">Sent</MenuItem>
                <MenuItem value="Accepted">Accepted</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3} md={3}>
            <TextField fullWidth size="small" type="date" label="From Date" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={6} sm={3} md={3}>
            <TextField fullWidth size="small" type="date" label="To Date" InputLabelProps={{ shrink: true }} />
          </Grid>
        </Grid>
      </Card>

      {/* Table */}
      <Box sx={{ overflowX: 'auto', width: '100%' }}>
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>PO Number</TableCell>
                <TableCell>Date & Dept</TableCell>
                <TableCell>Delivery Expected</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row) => {
                const statusColor = theme.palette[getStatusColor(row.status) as 'success'|'info'|'warning'|'error'].main;
                return (
                  <TableRow key={row.id} sx={{ 
                    '&:last-child td': { borderBottom: 0 },
                    ...(row.status === 'Sent' && {
                      borderLeft: `4px solid ${statusColor}`,
                      bgcolor: alpha(statusColor, 0.02)
                    })
                  }}>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main', whiteSpace: 'nowrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ShoppingCartIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                        {row.id}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{row.date}</Typography>
                      <Typography variant="caption" color="text.secondary">{row.dept}</Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{row.delivery}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>{row.items}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{row.amount}</TableCell>
                    <TableCell>
                      <Chip 
                        label={row.status === 'Sent' ? 'Needs Ack' : row.status} 
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
                        {row.status === 'Sent' && (
                          <Button size="small" variant="contained" color="warning" onClick={() => handleAckClick(row)}>
                            Acknowledge
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination count={Math.ceil(MOCK_POS.length / rowsPerPage)} page={page} onChange={(e, v) => setPage(v)} color="primary" />
      </Box>

      {/* Detail Dialog */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="md" fullWidth fullScreen={isMobile}>
        {selectedPO && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight={800}>Purchase Order Details</Typography>
                <Chip label={selectedPO.status} color={getStatusColor(selectedPO.status) as any} sx={{ fontWeight: 600 }} />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="h5" color="primary.main" fontWeight={800} mb={0.5}>{selectedPO.id}</Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>Acme Corporation • {selectedPO.dept}</Typography>
                </Box>
                
                <Grid container spacing={2}>
                  {[
                    { label: 'PO Date', value: selectedPO.date },
                    { label: 'Expected Delivery', value: selectedPO.delivery },
                    { label: 'Contract Reference', value: 'CNT-2026-001', isLink: true },
                    { label: 'Payment Terms', value: 'Net 30 Days' },
                  ].map((item, idx) => (
                    <Grid item xs={6} sm={3} key={idx}>
                      <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.03), borderRadius: 2, border: `1px solid ${alpha(theme.palette.primary.main, 0.05)}`, height: '100%' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                          {item.label}
                        </Typography>
                        <Typography variant="body2" fontWeight={700} color={item.isLink ? 'primary.main' : 'text.primary'} sx={{ cursor: item.isLink ? 'pointer' : 'default' }}>
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
                        <TableRow>
                          <TableCell>Description</TableCell>
                          <TableCell align="center">Qty</TableCell>
                          <TableCell align="right">Unit Price</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 500 }}>Software License (Annual)</TableCell>
                          <TableCell align="center">5</TableCell>
                          <TableCell align="right">₹48,000</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>₹2,40,000</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 500 }}>Implementation Services</TableCell>
                          <TableCell align="center">40 hrs</TableCell>
                          <TableCell align="right">₹8,000/hr</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>₹3,20,000</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 500 }}>Support & Maintenance (Q3)</TableCell>
                          <TableCell align="center">1</TableCell>
                          <TableCell align="right">₹1,60,000</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>₹1,60,000</TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                          <TableCell colSpan={3} align="right" sx={{ fontWeight: 800 }}>Grand Total</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 800, color: 'primary.main', fontSize: '1.1rem' }}>₹7,20,000</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2.5 }}>
              <Button onClick={() => setViewOpen(false)} sx={{ fontWeight: 600 }}>Close</Button>
              <Box sx={{ flexGrow: 1 }} />
              {selectedPO.status === 'Sent' && (
                <>
                  <Button variant="outlined" color="error" onClick={() => setViewOpen(false)} sx={{ fontWeight: 600 }}>Reject PO</Button>
                  <Button variant="contained" color="warning" onClick={() => handleAckClick(selectedPO)} size="large">
                    Acknowledge Order
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Ack Dialog */}
      <Dialog open={ackOpen} onClose={() => setAckOpen(false)} maxWidth="xs" fullWidth fullScreen={isMobile}>
        <DialogTitle sx={{ fontWeight: 800 }}>Acknowledge Order</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <CheckCircleIcon color="warning" sx={{ fontSize: 60, opacity: 0.8, mb: 1 }} />
              <Typography variant="h6" fontWeight={700}>Confirm {selectedPO?.id}</Typography>
            </Box>
            <Alert severity="warning" sx={{ borderRadius: 2, fontWeight: 500 }}>
              By acknowledging, you legally commit to fulfilling this order by <strong>{selectedPO?.delivery}</strong>.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setAckOpen(false)} sx={{ fontWeight: 600 }}>Cancel</Button>
          <Button variant="contained" color="warning" onClick={handleConfirmAck} size="large">
            Confirm & Accept
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
          Purchase Order successfully acknowledged.
        </Alert>
      </Snackbar>
    </Box>
  );
}
