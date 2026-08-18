import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Divider,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Snackbar,
  Alert,
  alpha,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as PendingIcon,
  Send as SendIcon,
  GridView as GridViewIcon,
  ViewList as ListViewIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  HowToReg as ApplyIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface Company {
  id: number;
  name: string;
  initials: string;
  color: string;
  industry: string;
  hq: string;
  state: string;
  vendorCount: number;
  openCategories: string[];
  turnover: string;
  description: string;
  connectionStatus: 'connected' | 'pending' | 'none';
}

const ALL_COMPANIES: Company[] = [
  {
    id: 1, name: 'Acme Corporation', initials: 'AC', color: '#1A4B8C',
    industry: 'IT Services', hq: 'Mumbai', state: 'Maharashtra', vendorCount: 142,
    openCategories: ['Software', 'Hardware', 'Consulting'],
    turnover: '₹5,000 Cr+', description: 'Leading enterprise IT solutions provider with operations across 12 states.',
    connectionStatus: 'connected',
  },
  {
    id: 2, name: 'TechGiant Industries', initials: 'TG', color: '#00897B',
    industry: 'Software', hq: 'Bengaluru', state: 'Karnataka', vendorCount: 89,
    openCategories: ['SaaS', 'Cloud Services', 'AI/ML'],
    turnover: '₹2,200 Cr+', description: 'Top-tier software product company focused on enterprise digital transformation.',
    connectionStatus: 'connected',
  },
  {
    id: 3, name: 'GlobalMart Ltd', initials: 'GM', color: '#F57C00',
    industry: 'Retail', hq: 'New Delhi', state: 'Delhi', vendorCount: 310,
    openCategories: ['Logistics', 'Packaging', 'IT Support'],
    turnover: '₹8,000 Cr+', description: 'India\'s fastest growing omni-channel retail brand with 400+ outlets.',
    connectionStatus: 'pending',
  },
  {
    id: 4, name: 'Reliance Infra Systems', initials: 'RI', color: '#6A1B9A',
    industry: 'Infrastructure', hq: 'Mumbai', state: 'Maharashtra', vendorCount: 520,
    openCategories: ['Civil Works', 'Electrical', 'Facilities'],
    turnover: '₹12,000 Cr+', description: 'Major infrastructure conglomerate managing national highways, ports, and utilities.',
    connectionStatus: 'none',
  },
  {
    id: 5, name: 'Tata Digital Solutions', initials: 'TD', color: '#0277BD',
    industry: 'Technology', hq: 'Mumbai', state: 'Maharashtra', vendorCount: 230,
    openCategories: ['Digital', 'Cybersecurity', 'ERP'],
    turnover: '₹4,500 Cr+', description: 'Digital-first technology arm of a diversified industrial group.',
    connectionStatus: 'none',
  },
  {
    id: 6, name: 'HCL Manufacturing', initials: 'HM', color: '#2E7D32',
    industry: 'Manufacturing', hq: 'Noida', state: 'Uttar Pradesh', vendorCount: 185,
    openCategories: ['Raw Materials', 'Machinery', 'Maintenance'],
    turnover: '₹3,100 Cr+', description: 'Precision manufacturing company producing electronics and industrial components.',
    connectionStatus: 'none',
  },
  {
    id: 7, name: 'Mahindra Logistics', initials: 'ML', color: '#C62828',
    industry: 'Logistics', hq: 'Pune', state: 'Maharashtra', vendorCount: 275,
    openCategories: ['Transport', 'Warehousing', 'Last-Mile'],
    turnover: '₹1,900 Cr+', description: 'Integrated supply chain solutions with a pan-India fleet of 4,000+ vehicles.',
    connectionStatus: 'none',
  },
  {
    id: 8, name: 'HDFC Fintech Ltd', initials: 'HF', color: '#004D40',
    industry: 'Finance', hq: 'Mumbai', state: 'Maharashtra', vendorCount: 96,
    openCategories: ['IT', 'Compliance', 'Marketing'],
    turnover: '₹9,800 Cr+', description: 'Fintech subsidiary of a leading banking group, offering lending and payments.',
    connectionStatus: 'none',
  },
  {
    id: 9, name: 'Bajaj Healthcare', initials: 'BH', color: '#0288D1',
    industry: 'Healthcare', hq: 'Pune', state: 'Maharashtra', vendorCount: 148,
    openCategories: ['Medical Supplies', 'Pharma', 'Equipment'],
    turnover: '₹2,700 Cr+', description: 'Diversified healthcare group operating hospitals, diagnostics, and retail pharmacy.',
    connectionStatus: 'none',
  },
  {
    id: 10, name: 'L&T Construction', initials: 'LT', color: '#558B2F',
    industry: 'Construction', hq: 'Chennai', state: 'Tamil Nadu', vendorCount: 630,
    openCategories: ['Civil', 'Steel', 'Cement', 'Safety'],
    turnover: '₹18,000 Cr+', description: 'Engineering, procurement, and construction giant behind India\'s landmark projects.',
    connectionStatus: 'none',
  },
  {
    id: 11, name: 'Infosys BPO', initials: 'IB', color: '#37474F',
    industry: 'Business Services', hq: 'Bengaluru', state: 'Karnataka', vendorCount: 112,
    openCategories: ['BPO', 'Analytics', 'Process Automation'],
    turnover: '₹6,200 Cr+', description: 'Business process outsourcing arm providing services to Fortune 500 clients.',
    connectionStatus: 'none',
  },
  {
    id: 12, name: 'Sun Pharma Ltd', initials: 'SP', color: '#E65100',
    industry: 'Pharmaceuticals', hq: 'Mumbai', state: 'Maharashtra', vendorCount: 198,
    openCategories: ['API', 'Packaging', 'Lab Supplies'],
    turnover: '₹7,500 Cr+', description: 'India\'s top pharmaceutical company manufacturing generics for 100+ countries.',
    connectionStatus: 'none',
  },
  {
    id: 13, name: 'ONGC Enterprises', initials: 'OE', color: '#4527A0',
    industry: 'Energy', hq: 'New Delhi', state: 'Delhi', vendorCount: 440,
    openCategories: ['Drilling', 'Equipment', 'Safety', 'Engineering'],
    turnover: '₹25,000 Cr+', description: 'State-owned oil and natural gas corporation with upstream and downstream operations.',
    connectionStatus: 'none',
  },
  {
    id: 14, name: 'Adani Ports Ltd', initials: 'AP', color: '#1565C0',
    industry: 'Logistics', hq: 'Ahmedabad', state: 'Gujarat', vendorCount: 360,
    openCategories: ['Port Services', 'Logistics', 'IT'],
    turnover: '₹14,000 Cr+', description: 'India\'s largest private multi-port operator managing 13 ports across the coastline.',
    connectionStatus: 'none',
  },
  {
    id: 15, name: 'Zomato Hyperpure', initials: 'ZH', color: '#D50000',
    industry: 'Food Tech', hq: 'Gurugram', state: 'Haryana', vendorCount: 74,
    openCategories: ['Food Supply', 'Cold Chain', 'Packaging'],
    turnover: '₹800 Cr+', description: 'B2B ingredient and food supply arm of India\'s leading food delivery platform.',
    connectionStatus: 'none',
  },
];

const INDUSTRIES = ['All', 'IT Services', 'Software', 'Retail', 'Infrastructure', 'Technology', 'Manufacturing', 'Logistics', 'Finance', 'Healthcare', 'Construction', 'Business Services', 'Pharmaceuticals', 'Energy', 'Food Tech'];

const SORT_OPTIONS = [
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
  { value: 'vendors_desc', label: 'Most Vendors' },
  { value: 'vendors_asc', label: 'Fewest Vendors' },
  { value: 'industry', label: 'By Industry' },
  { value: 'state', label: 'By State' },
];

const statusConfig = {
  connected: { label: 'Connected', color: 'success' as const, icon: <CheckCircleIcon sx={{ fontSize: '13px !important' }} /> },
  pending: { label: 'Applied', color: 'warning' as const, icon: <PendingIcon sx={{ fontSize: '13px !important' }} /> },
  none: { label: 'Apply', color: 'primary' as const, icon: null },
};

export default function CompanyDirectory() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name_asc');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [companies, setCompanies] = useState<Company[]>(ALL_COMPANIES);
  const [applyTarget, setApplyTarget] = useState<Company | null>(null);
  const [applyMessage, setApplyMessage] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; name: string }>({ open: false, name: '' });

  const filtered = useMemo(() => {
    let list = [...companies];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q) ||
          c.hq.toLowerCase().includes(q) ||
          c.state.toLowerCase().includes(q) ||
          c.openCategories.some((cat) => cat.toLowerCase().includes(q)),
      );
    }
    if (selectedIndustry !== 'All') {
      list = list.filter((c) => c.industry === selectedIndustry);
    }
    list.sort((a, b) => {
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
      if (sortBy === 'vendors_desc') return b.vendorCount - a.vendorCount;
      if (sortBy === 'vendors_asc') return a.vendorCount - b.vendorCount;
      if (sortBy === 'industry') return a.industry.localeCompare(b.industry);
      if (sortBy === 'state') return a.state.localeCompare(b.state);
      return 0;
    });
    return list;
  }, [companies, search, sortBy, selectedIndustry]);

  const connectedCount = companies.filter((c) => c.connectionStatus === 'connected').length;
  const pendingCount = companies.filter((c) => c.connectionStatus === 'pending').length;

  const handleApply = () => {
    if (!applyTarget) return;
    setCompanies((prev) =>
      prev.map((c) => (c.id === applyTarget.id ? { ...c, connectionStatus: 'pending' } : c)),
    );
    const name = applyTarget.name;
    setApplyTarget(null);
    setApplyMessage('');
    setSnackbar({ open: true, name });
  };

  return (
    <Box>
      {/* Gradient Header */}
      <Paper
        sx={{
          p: { xs: 2.5, md: 3.5 },
          mb: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 60%, #00695C 100%)`,
          color: 'white',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: -40, right: -30, width: 180, height: 180, borderRadius: '50%', bgcolor: alpha('#fff', 0.05) }} />
        <Box sx={{ position: 'absolute', bottom: -50, right: 100, width: 140, height: 140, borderRadius: '50%', bgcolor: alpha('#fff', 0.04) }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <BusinessIcon sx={{ color: alpha('#fff', 0.8) }} />
              <Typography variant="h5" fontWeight={700} sx={{ color: 'white' }}>
                Company Directory
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: alpha('#fff', 0.8), maxWidth: 480 }}>
              Discover and apply to buyer companies registered on the VMS platform. Expand your vendor network.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {[
              { label: 'Total Companies', value: ALL_COMPANIES.length },
              { label: 'Connected', value: connectedCount },
              { label: 'Applications Sent', value: pendingCount },
            ].map((stat) => (
              <Box
                key={stat.label}
                sx={{ textAlign: 'center', bgcolor: alpha('#fff', 0.12), borderRadius: 2, px: 2, py: 1, border: `1px solid ${alpha('#fff', 0.2)}` }}
              >
                <Typography variant="h5" fontWeight={800} sx={{ color: 'white', lineHeight: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" sx={{ color: alpha('#fff', 0.75), fontWeight: 600 }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Search + Sort + View */}
      <Card sx={{ mb: 2.5 }}>
        <CardContent sx={{ p: { xs: 2, md: 2.5 }, '&:last-child': { pb: { xs: 2, md: 2.5 } } }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by company name, industry, city, or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-company-search"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: search ? (
                    <InputAdornment position="end">
                      <CloseIcon
                        sx={{ color: 'text.secondary', fontSize: 18, cursor: 'pointer' }}
                        onClick={() => setSearch('')}
                      />
                    </InputAdornment>
                  ) : null,
                }}
              />
            </Grid>
            <Grid item xs={8} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <SortIcon sx={{ fontSize: 16 }} /> Sort by
                  </Box>
                </InputLabel>
                <Select
                  value={sortBy}
                  label="Sort by"
                  onChange={(e) => setSortBy(e.target.value)}
                  data-testid="select-sort"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4} sm={3} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Industry</InputLabel>
                <Select
                  value={selectedIndustry}
                  label="Industry"
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  data-testid="select-industry"
                >
                  {INDUSTRIES.map((ind) => (
                    <MenuItem key={ind} value={ind}>{ind}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3} md={2} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, v) => v && setViewMode(v)}
                size="small"
                data-testid="toggle-view-mode"
              >
                <ToggleButton value="grid" data-testid="btn-view-grid">
                  <GridViewIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton value="list" data-testid="btn-view-list">
                  <ListViewIcon fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>

          {/* Industry filter chips */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 0.5 }}>
              <FilterIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Filter:</Typography>
            </Box>
            {['All', 'IT Services', 'Manufacturing', 'Logistics', 'Healthcare', 'Finance', 'Energy'].map((ind) => (
              <Chip
                key={ind}
                label={ind}
                size="small"
                onClick={() => setSelectedIndustry(ind)}
                color={selectedIndustry === ind ? 'primary' : 'default'}
                variant={selectedIndustry === ind ? 'filled' : 'outlined'}
                data-testid={`filter-${ind.toLowerCase().replace(/\s+/g, '-')}`}
                sx={{ cursor: 'pointer', fontWeight: selectedIndustry === ind ? 700 : 500 }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Results count */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Showing <strong>{filtered.length}</strong> of {ALL_COMPANIES.length} companies
        </Typography>
        {(search || selectedIndustry !== 'All') && (
          <Chip
            label="Clear filters"
            size="small"
            variant="outlined"
            onClick={() => { setSearch(''); setSelectedIndustry('All'); }}
            data-testid="btn-clear-filters"
            sx={{ fontSize: '0.7rem' }}
          />
        )}
      </Box>

      {/* Company Cards — Grid View */}
      {viewMode === 'grid' && (
        <Grid container spacing={2.5}>
          {filtered.map((company) => (
            <Grid item xs={12} sm={6} md={4} key={company.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderTop: `3px solid ${company.color}`,
                  position: 'relative',
                  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                  '&:hover': { transform: 'translateY(-2px)' },
                }}
              >
                {company.connectionStatus !== 'none' && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                    }}
                  >
                    <Chip
                      label={statusConfig[company.connectionStatus].label}
                      size="small"
                      color={statusConfig[company.connectionStatus].color}
                      icon={statusConfig[company.connectionStatus].icon ?? undefined}
                      sx={{ fontWeight: 700, fontSize: '0.65rem' }}
                    />
                  </Box>
                )}
                <CardContent sx={{ flex: 1, p: 2.5 }}>
                  {/* Company header */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5, pr: company.connectionStatus !== 'none' ? 8 : 0 }}>
                    <Avatar
                      sx={{ width: 44, height: 44, bgcolor: company.color, fontWeight: 700, fontSize: 14, flexShrink: 0 }}
                    >
                      {company.initials}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                        {company.name}
                      </Typography>
                      <Chip
                        label={company.industry}
                        size="small"
                        sx={{
                          mt: 0.5,
                          bgcolor: alpha(company.color, 0.1),
                          color: company.color,
                          fontWeight: 600,
                          fontSize: '0.65rem',
                          height: 20,
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Description */}
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, lineHeight: 1.5 }}>
                    {company.description}
                  </Typography>

                  {/* Meta info */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <LocationIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {company.hq}, {company.state}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <PeopleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {company.vendorCount} active vendors · Turnover {company.turnover}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Open categories */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mb: 0.5 }}>
                      Open for:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {company.openCategories.slice(0, 3).map((cat) => (
                        <Chip
                          key={cat}
                          label={cat}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.6rem', height: 18, borderColor: alpha(company.color, 0.3), color: company.color }}
                        />
                      ))}
                      {company.openCategories.length > 3 && (
                        <Chip
                          label={`+${company.openCategories.length - 3}`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.6rem', height: 18 }}
                        />
                      )}
                    </Box>
                  </Box>
                </CardContent>

                <Divider />
                <Box sx={{ px: 2, py: 1.5 }}>
                  {company.connectionStatus === 'connected' ? (
                    <Button fullWidth variant="outlined" color="success" size="small" startIcon={<CheckCircleIcon />} disabled>
                      Already Connected
                    </Button>
                  ) : company.connectionStatus === 'pending' ? (
                    <Button fullWidth variant="outlined" color="warning" size="small" startIcon={<PendingIcon />} disabled>
                      Application Sent
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      startIcon={<ApplyIcon />}
                      data-testid={`btn-apply-${company.id}`}
                      onClick={() => setApplyTarget(company)}
                      sx={{ bgcolor: company.color, '&:hover': { bgcolor: alpha(company.color, 0.85) } }}
                    >
                      Apply to Connect
                    </Button>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <Card>
          <Box>
            {filtered.map((company, idx) => (
              <React.Fragment key={company.id}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    px: 2.5,
                    py: 2,
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                    borderLeft: `4px solid ${company.color}`,
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.025) },
                  }}
                >
                  {/* Avatar */}
                  <Avatar sx={{ width: 40, height: 40, bgcolor: company.color, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                    {company.initials}
                  </Avatar>

                  {/* Name + meta */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="body2" fontWeight={700}>{company.name}</Typography>
                      <Chip
                        label={company.industry}
                        size="small"
                        sx={{ bgcolor: alpha(company.color, 0.1), color: company.color, fontWeight: 600, fontSize: '0.65rem', height: 18 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.25, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">{company.hq}, {company.state}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PeopleIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">{company.vendorCount} vendors</Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">{company.turnover}</Typography>
                    </Box>
                  </Box>

                  {/* Open categories */}
                  <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, flexWrap: 'wrap', maxWidth: 220 }}>
                    {company.openCategories.slice(0, 2).map((cat) => (
                      <Chip key={cat} label={cat} size="small" variant="outlined" sx={{ fontSize: '0.6rem', height: 20 }} />
                    ))}
                    {company.openCategories.length > 2 && (
                      <Chip label={`+${company.openCategories.length - 2}`} size="small" variant="outlined" sx={{ fontSize: '0.6rem', height: 20 }} />
                    )}
                  </Box>

                  {/* Action */}
                  <Box sx={{ flexShrink: 0, minWidth: 140 }}>
                    {company.connectionStatus === 'connected' ? (
                      <Button fullWidth variant="outlined" color="success" size="small" startIcon={<CheckCircleIcon />} disabled>
                        Connected
                      </Button>
                    ) : company.connectionStatus === 'pending' ? (
                      <Button fullWidth variant="outlined" color="warning" size="small" startIcon={<PendingIcon />} disabled>
                        Applied
                      </Button>
                    ) : (
                      <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        startIcon={<ApplyIcon />}
                        data-testid={`btn-apply-list-${company.id}`}
                        onClick={() => setApplyTarget(company)}
                        sx={{ bgcolor: company.color, '&:hover': { bgcolor: alpha(company.color, 0.85) } }}
                      >
                        Apply
                      </Button>
                    )}
                  </Box>
                </Box>
                {idx < filtered.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Box>
        </Card>
      )}

      {filtered.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <SearchIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>No companies found</Typography>
          <Typography variant="body2" color="text.disabled">Try adjusting your search or filters.</Typography>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={() => { setSearch(''); setSelectedIndustry('All'); }}>
            Clear Filters
          </Button>
        </Box>
      )}

      {/* Apply Dialog */}
      <Dialog
        open={Boolean(applyTarget)}
        onClose={() => { setApplyTarget(null); setApplyMessage(''); }}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        data-testid="dialog-apply"
        PaperProps={{ sx: { borderRadius: { xs: 0, sm: 3 } } }}
      >
        {applyTarget && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: applyTarget.color, width: 40, height: 40, fontWeight: 700 }}>
                  {applyTarget.initials}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>Apply to Connect</Typography>
                  <Typography variant="caption" color="text.secondary">{applyTarget.name}</Typography>
                </Box>
              </Box>
            </DialogTitle>
            <Divider />
            <DialogContent>
              {/* Company summary */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(applyTarget.color, 0.06),
                  border: `1px solid ${alpha(applyTarget.color, 0.15)}`,
                  mb: 2.5,
                }}
              >
                <Grid container spacing={1.5}>
                  {[
                    { label: 'Industry', value: applyTarget.industry },
                    { label: 'Headquarter', value: `${applyTarget.hq}, ${applyTarget.state}` },
                    { label: 'Active Vendors', value: applyTarget.vendorCount.toString() },
                    { label: 'Turnover', value: applyTarget.turnover },
                  ].map((item) => (
                    <Grid item xs={6} key={item.label}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>{item.label}</Typography>
                      <Typography variant="body2" fontWeight={600}>{item.value}</Typography>
                    </Grid>
                  ))}
                </Grid>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.75}>
                  Open vendor categories
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {applyTarget.openCategories.map((cat) => (
                    <Chip
                      key={cat}
                      label={cat}
                      size="small"
                      sx={{ bgcolor: alpha(applyTarget.color, 0.1), color: applyTarget.color, fontWeight: 600 }}
                    />
                  ))}
                </Box>
              </Box>

              <Typography variant="body2" fontWeight={600} gutterBottom>
                Introduction Message <Typography component="span" variant="caption" color="text.secondary">(optional)</Typography>
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder={`Tell ${applyTarget.name} why Nexus Solutions Pvt Ltd would be a great vendor partner...`}
                value={applyMessage}
                onChange={(e) => setApplyMessage(e.target.value)}
                data-testid="input-apply-message"
                inputProps={{ maxLength: 500 }}
                helperText={`${applyMessage.length}/500 characters`}
              />

              <Box
                sx={{
                  mt: 2,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.info.main, 0.07),
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                  display: 'flex',
                  gap: 1,
                }}
              >
                <SendIcon sx={{ fontSize: 16, color: 'info.main', mt: 0.2, flexShrink: 0 }} />
                <Typography variant="caption" color="info.main">
                  Your application along with your vendor profile (GST, PAN, category certifications) will be sent to {applyTarget.name} for review. You will be notified once they respond.
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
              <Button
                onClick={() => { setApplyTarget(null); setApplyMessage(''); }}
                variant="outlined"
                data-testid="btn-apply-cancel"
              >
                Cancel
              </Button>
              <Button
                onClick={handleApply}
                variant="contained"
                startIcon={<SendIcon />}
                data-testid="btn-apply-submit"
                sx={{ bgcolor: applyTarget.color, '&:hover': { bgcolor: alpha(applyTarget.color, 0.85) } }}
              >
                Send Application
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Success snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ open: false, name: '' })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ open: false, name: '' })}
          severity="success"
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          Application sent to <strong>{snackbar.name}</strong> successfully.
        </Alert>
      </Snackbar>
    </Box>
  );
}
