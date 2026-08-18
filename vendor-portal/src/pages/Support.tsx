import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemButton,
  Chip,
  Divider,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Avatar,
  FormControl,
  InputLabel,
  IconButton,
  InputAdornment,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import { 
  Send as SendIcon, 
  AttachFile as AttachFileIcon, 
  Add as AddIcon, 
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  SupportAgent as SupportIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

const MOCK_TICKETS = [
  { id: 1, subject: 'GST Certificate Verification Delay', excerpt: 'We submitted our GST...', date: 'Jun 20', status: 'Open', category: 'Document Verification' },
  { id: 2, subject: 'Invoice INV-2026-0022 Discrepancy', excerpt: 'The amount seems to be...', date: 'Jun 22', status: 'Awaiting Response', category: 'Invoice/Payment' },
  { id: 3, subject: 'PO-2026-0080 Cancellation Query', excerpt: 'Can you confirm why...', date: 'May 25', status: 'Closed', category: 'PO Query' },
  { id: 4, subject: 'Contract Renewal Process Query', excerpt: 'We want to know the...', date: 'Apr 10', status: 'Closed', category: 'Contract' },
];

export default function Support() {
  const [selectedId, setSelectedId] = useState(1);
  const [newOpen, setNewOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [mobileView, setMobileView] = useState<'list' | 'thread'>('list');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'success';
      case 'Awaiting Response': return 'warning';
      case 'Closed': return 'default';
      default: return 'default';
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;
    setMessage('');
    // Mock send behavior
  };

  const handleCreateSubmit = () => {
    setNewOpen(false);
    setSnackbarOpen(true);
  };

  const handleTicketSelect = (id: number) => {
    setSelectedId(id);
    if (isMobile) setMobileView('thread');
  };

  const selectedTicket = MOCK_TICKETS.find(t => t.id === selectedId);

  return (
    <Box sx={{ height: { xs: 'calc(100vh - 64px)', md: 'calc(100vh - 120px)' }, display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 1400, mx: 'auto', width: '100%' }}>
      
      {/* Mobile-only Header Banner */}
      <Box sx={{ display: { xs: mobileView === 'thread' ? 'none' : 'block', md: 'none' } }}>
        <Typography variant="h5" fontWeight={800} gutterBottom>Help & Support</Typography>
        <Typography variant="body2" color="text.secondary">Contact Acme Corporation vendor support</Typography>
      </Box>

      <Paper sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden', border: 'none', elevation: 2, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        
        {/* Left Panel - Ticket List */}
        <Box sx={{ 
          width: { xs: '100%', md: '35%' }, 
          borderRight: { md: `1px solid ${theme.palette.divider}` }, 
          bgcolor: 'background.paper',
          display: { 
            xs: isMobile && mobileView === 'thread' ? 'none' : 'flex', 
            md: 'flex' 
          },
          flexDirection: 'column'
        }}>
          <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Button 
              variant="contained" 
              fullWidth 
              startIcon={<AddIcon />} 
              onClick={() => setNewOpen(true)}
              size="large"
              sx={{ mb: 2, py: 1.5, boxShadow: '0 4px 12px rgba(26,75,140,0.2)' }}
            >
              Open New Ticket
            </Button>
            <TextField 
              fullWidth 
              placeholder="Search tickets..." 
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: alpha(theme.palette.primary.main, 0.03) } }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
              }}
            />
          </Box>
          
          <List sx={{ overflowY: 'auto', p: 0, flexGrow: 1 }}>
            {MOCK_TICKETS.map((ticket, index) => {
              const isSelected = selectedId === ticket.id && !isMobile;
              return (
                <React.Fragment key={ticket.id}>
                  <ListItem disablePadding>
                    <ListItemButton 
                      selected={isSelected} 
                      onClick={() => handleTicketSelect(ticket.id)}
                      sx={{ 
                        p: 2.5, 
                        flexDirection: 'column', 
                        alignItems: 'flex-start',
                        ...(isSelected && {
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          borderLeft: `4px solid ${theme.palette.primary.main}`,
                          pr: 'calc(20px - 4px)' // adjust padding for border
                        }),
                        ...(!isSelected && {
                          borderLeft: '4px solid transparent'
                        })
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1, alignItems: 'flex-start' }}>
                        <Typography variant="subtitle2" fontWeight={isSelected ? 800 : 600} noWrap sx={{ pr: 2, color: isSelected ? 'primary.main' : 'text.primary' }}>
                          {ticket.subject}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 45, textAlign: 'right', fontWeight: 600 }}>
                          {ticket.date}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ width: '100%', mb: 1.5 }}>
                        {ticket.excerpt}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <Chip label={ticket.category} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600, bgcolor: alpha(theme.palette.text.secondary, 0.1) }} />
                        <Chip 
                          label={ticket.status} 
                          size="small" 
                          color={getStatusColor(ticket.status) as any} 
                          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} 
                        />
                      </Box>
                    </ListItemButton>
                  </ListItem>
                  {index < MOCK_TICKETS.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        </Box>

        {/* Right Panel - Thread View */}
        <Box sx={{ 
          width: { xs: '100%', md: '65%' },
          display: { 
            xs: isMobile && mobileView === 'list' ? 'none' : 'flex',
            md: 'flex'
          },
          flexDirection: 'column',
          bgcolor: '#fafafa'
        }}>
          {selectedTicket ? (
            <>
              {/* Thread Header */}
              <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper', display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                {isMobile && (
                  <IconButton onClick={() => setMobileView('list')} sx={{ mt: -0.5, ml: -1 }}>
                    <ArrowBackIcon />
                  </IconButton>
                )}
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h5" fontWeight={800} sx={{ wordBreak: 'break-word', color: 'primary.main' }}>
                      {selectedTicket.subject}
                    </Typography>
                    <Chip 
                      label={selectedTicket.status} 
                      color={getStatusColor(selectedTicket.status) as any} 
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <SupportIcon fontSize="small" /> Ticket #{selectedTicket.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ScheduleIcon fontSize="small" /> Opened {selectedTicket.date}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Chat Thread */}
              <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
                
                {/* Vendor Message */}
                <Box sx={{ display: 'flex', gap: 2, alignSelf: 'flex-end', maxWidth: { xs: '90%', md: '80%' } }}>
                  <Box sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    p: 2.5, 
                    borderRadius: 3, 
                    borderTopRightRadius: 0,
                    boxShadow: '0 2px 10px rgba(26,75,140,0.2)'
                  }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      We submitted our GST certificate on Jun 15 but it still shows Pending status. We need this cleared to accept new POs.
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: 1.5, opacity: 0.8, textAlign: 'right', fontWeight: 500 }}>
                      Jun 20, 10:15 AM
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'primary.dark', width: 40, height: 40, fontWeight: 700, display: { xs: 'none', sm: 'flex' } }}>NS</Avatar>
                </Box>

                {/* Buyer Message */}
                <Box sx={{ display: 'flex', gap: 2, alignSelf: 'flex-start', maxWidth: { xs: '90%', md: '80%' } }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40, fontWeight: 700, display: { xs: 'none', sm: 'flex' } }}>AC</Avatar>
                  <Box sx={{ 
                    bgcolor: 'background.paper', 
                    p: 2.5, 
                    borderRadius: 3, 
                    borderTopLeftRadius: 0, 
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)' 
                  }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.6, color: 'text.primary' }}>
                      Thank you for reaching out. Our verification team is reviewing your document. Expected completion is 2-3 business days.
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: 'text.secondary', fontWeight: 600 }}>
                      Jun 20, 02:30 PM • Support Team
                    </Typography>
                  </Box>
                </Box>

                {/* Vendor Message */}
                <Box sx={{ display: 'flex', gap: 2, alignSelf: 'flex-end', maxWidth: { xs: '90%', md: '80%' } }}>
                  <Box sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    p: 2.5, 
                    borderRadius: 3, 
                    borderTopRightRadius: 0,
                    boxShadow: '0 2px 10px rgba(26,75,140,0.2)'
                  }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      It's been 7 days now. Can you expedite this? We have pending orders waiting.
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: 1.5, opacity: 0.8, textAlign: 'right', fontWeight: 500 }}>
                      Jun 22, 11:00 AM
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'primary.dark', width: 40, height: 40, fontWeight: 700, display: { xs: 'none', sm: 'flex' } }}>NS</Avatar>
                </Box>

                {/* Buyer Message */}
                <Box sx={{ display: 'flex', gap: 2, alignSelf: 'flex-start', maxWidth: { xs: '90%', md: '80%' } }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40, fontWeight: 700, display: { xs: 'none', sm: 'flex' } }}>AC</Avatar>
                  <Box sx={{ 
                    bgcolor: 'background.paper', 
                    p: 2.5, 
                    borderRadius: 3, 
                    borderTopLeftRadius: 0, 
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)' 
                  }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.6, color: 'text.primary' }}>
                      We apologize for the delay. I've escalated this to the senior compliance reviewer. We will have an update for you by Jun 24.
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: 'text.secondary', fontWeight: 600 }}>
                      Jun 22, 03:45 PM • Compliance Team
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Reply Box */}
              {selectedTicket.status !== 'Closed' && (
                <Box sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}>
                  <TextField 
                    fullWidth 
                    multiline 
                    maxRows={4} 
                    placeholder="Type your message here..." 
                    variant="outlined" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#fafafa' } }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" sx={{ alignSelf: 'flex-end', mb: 1, mr: -0.5 }}>
                          <IconButton color="secondary" sx={{ mr: 1, bgcolor: alpha(theme.palette.secondary.main, 0.1) }}>
                            <AttachFileIcon />
                          </IconButton>
                          <Button 
                            variant="contained" 
                            size="large" 
                            endIcon={<SendIcon />}
                            onClick={handleSend}
                            disabled={!message.trim()}
                            sx={{ borderRadius: 2, px: 3 }}
                          >
                            Send
                          </Button>
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary' }}>
              <SupportIcon sx={{ fontSize: 80, opacity: 0.2, mb: 2 }} />
              <Typography variant="h6" fontWeight={700}>Select a ticket to view</Typography>
              <Typography variant="body2">Or create a new one to get help</Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* New Ticket Dialog */}
      <Dialog open={newOpen} onClose={() => setNewOpen(false)} maxWidth="sm" fullWidth fullScreen={isMobile}>
        <DialogTitle sx={{ fontWeight: 800, pb: 2 }}>Create Support Ticket</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <Alert severity="info" sx={{ borderRadius: 2, fontWeight: 500 }}>
              Our support team typically responds within 24 hours. For critical PO issues, set priority to High.
            </Alert>
            <TextField fullWidth label="Subject" placeholder="Brief description of your issue" />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select label="Category" defaultValue="">
                    <MenuItem value="Document Verification">Document Verification</MenuItem>
                    <MenuItem value="PO Query">PO Query</MenuItem>
                    <MenuItem value="Invoice/Payment">Invoice/Payment</MenuItem>
                    <MenuItem value="Contract">Contract</MenuItem>
                    <MenuItem value="General">General</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select label="Priority" defaultValue="">
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <TextField 
              fullWidth 
              multiline 
              rows={5} 
              label="Detailed Description" 
              placeholder="Provide as much information as possible to help us resolve your issue quickly..." 
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, px: 3 }}>
          <Button onClick={() => setNewOpen(false)} sx={{ fontWeight: 600 }}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateSubmit} size="large">
            Submit Ticket
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
          Ticket created successfully. Our team will review it shortly.
        </Alert>
      </Snackbar>
    </Box>
  );
}
