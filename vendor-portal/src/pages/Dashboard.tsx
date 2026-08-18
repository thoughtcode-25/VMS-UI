import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Description as DescriptionIcon,
  Receipt as ReceiptIcon,
  Assignment as AssignmentIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalanceWallet as WalletIcon,
  Gavel as GavelIcon,
  ShoppingCart as ShoppingCartIcon,
  ArrowUpward as ArrowUpIcon,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const revenueTrend = [
  { month: 'Jan', revenue: 0 },
  { month: 'Feb', revenue: 70000 },
  { month: 'Mar', revenue: 420000 },
  { month: 'Apr', revenue: 930000 },
  { month: 'May', revenue: 870000 },
  { month: 'Jun', revenue: 360000 },
];

const invoiceStatus = [
  { name: 'Paid', value: 3, color: '#2E7D32' },
  { name: 'Approved', value: 2, color: '#0288D1' },
  { name: 'Pending', value: 2, color: '#F57C00' },
  { name: 'Overdue', value: 0, color: '#C62828' },
];

const kpis = [
  {
    title: 'Registration Status',
    value: 'Approved',
    type: 'status',
    icon: <CheckCircleIcon sx={{ fontSize: 28 }} />,
    color: '#2E7D32',
    bg: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
  },
  {
    title: 'Active Contracts',
    value: '3',
    subtitle: '+1 this quarter',
    icon: <GavelIcon sx={{ fontSize: 28 }} />,
    color: '#1A4B8C',
    bg: 'linear-gradient(135deg, #E3EBF8 0%, #C5D7F1 100%)',
    trend: '+1',
  },
  {
    title: 'Open Purchase Orders',
    value: '7',
    subtitle: '₹24.5L value',
    icon: <ShoppingCartIcon sx={{ fontSize: 28 }} />,
    color: '#F57C00',
    bg: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
  },
  {
    title: 'Pending Invoices',
    value: '4',
    subtitle: '₹8.2L outstanding',
    icon: <ReceiptIcon sx={{ fontSize: 28 }} />,
    color: '#0288D1',
    bg: 'linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 100%)',
  },
  {
    title: 'Last Payment',
    value: '₹3.6L',
    subtitle: 'Jun 10, 2026',
    icon: <WalletIcon sx={{ fontSize: 28 }} />,
    color: '#00897B',
    bg: 'linear-gradient(135deg, #E0F2F1 0%, #B2DFDB 100%)',
  },
];

const pendingActions = [
  {
    id: 1,
    title: 'Acknowledge PO #PO-2026-0089',
    subtitle: 'Due Jun 28, 2026',
    action: 'View',
    icon: <AssignmentIcon />,
    color: '#1A4B8C',
    bg: '#E3EBF8',
    urgency: 'high',
  },
  {
    id: 2,
    title: 'Upload renewed GST Certificate',
    subtitle: 'Document expired Jun 20, 2026',
    action: 'Upload',
    icon: <WarningIcon />,
    color: '#C62828',
    bg: '#FFEBEE',
    urgency: 'critical',
  },
  {
    id: 3,
    title: 'Raise invoice for PO #PO-2026-0081',
    subtitle: 'PO completed Jun 15, 2026',
    action: 'Raise Invoice',
    icon: <ReceiptIcon />,
    color: '#0288D1',
    bg: '#E1F5FE',
    urgency: 'medium',
  },
  {
    id: 4,
    title: 'E-sign Contract #CNT-2026-003',
    subtitle: 'Pending since Jun 18, 2026',
    action: 'Sign',
    icon: <DescriptionIcon />,
    color: '#F57C00',
    bg: '#FFF3E0',
    urgency: 'medium',
  },
];

const purchaseOrders = [
  { id: 'PO-2026-0089', date: 'Jun 25', amount: '₹7,20,000', status: 'Sent' },
  { id: 'PO-2026-0088', date: 'Jun 20', amount: '₹4,80,000', status: 'Accepted' },
  { id: 'PO-2026-0085', date: 'Jun 12', amount: '₹5,10,000', status: 'Completed' },
  { id: 'PO-2026-0081', date: 'Jun 8', amount: '₹6,40,000', status: 'Completed' },
];

const statusConfig: Record<string, { color: 'primary' | 'success' | 'warning' | 'default'; label: string }> = {
  Accepted: { color: 'primary', label: 'Accepted' },
  Completed: { color: 'success', label: 'Completed' },
  Sent: { color: 'warning', label: 'Sent' },
};

const formatRevenue = (value: number) => {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value}`;
};

const CustomAreaTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ p: 1.5, border: '1px solid rgba(26,75,140,0.1)', minWidth: 120 }}>
        <Typography variant="caption" color="text.secondary" display="block">{label} 2026</Typography>
        <Typography variant="body2" fontWeight={700} color="primary.main">
          {formatRevenue(payload[0].value)}
        </Typography>
      </Paper>
    );
  }
  return null;
};

export default function Dashboard() {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

      {/* Welcome Banner */}
      <Paper
        sx={{
          p: { xs: 2.5, md: 3.5 },
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 60%, ${theme.palette.primary.light} 100%)`,
          color: 'white',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: '50%',
            bgcolor: alpha('#fff', 0.05),
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -60,
            right: 80,
            width: 160,
            height: 160,
            borderRadius: '50%',
            bgcolor: alpha('#fff', 0.04),
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ color: 'white', mb: 0.5 }}>
              Good morning, Nexus Solutions
            </Typography>
            <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
              Here is a summary of your vendor account with Acme Corporation · Jun 29, 2026
            </Typography>
          </Box>
          <Chip
            icon={<CheckCircleIcon sx={{ color: '#fff !important', fontSize: 16 }} />}
            label="Vendor Approved"
            sx={{
              bgcolor: alpha('#fff', 0.15),
              color: 'white',
              fontWeight: 600,
              border: `1px solid ${alpha('#fff', 0.25)}`,
            }}
          />
        </Box>
      </Paper>

      {/* KPI Cards */}
      <Grid container spacing={2.5}>
        {kpis.map((kpi, idx) => (
          <Grid item xs={6} md={2.4} key={idx}>
            <Card
              sx={{
                height: '100%',
                background: kpi.bg,
                border: 'none',
                cursor: 'default',
              }}
            >
              <CardContent sx={{ p: { xs: 1.5, md: 2 }, '&:last-child': { pb: { xs: 1.5, md: 2 } } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', color: kpi.color, lineHeight: 1.3 }}
                  >
                    {kpi.title}
                  </Typography>
                  <Box sx={{ color: kpi.color, opacity: 0.6 }}>{kpi.icon}</Box>
                </Box>
                {kpi.type === 'status' ? (
                  <Chip
                    label={kpi.value}
                    size="small"
                    icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
                    sx={{ bgcolor: kpi.color, color: 'white', fontWeight: 700, mt: 0.5 }}
                  />
                ) : (
                  <Box>
                    <Typography variant="h5" fontWeight={800} sx={{ color: kpi.color, lineHeight: 1.2 }}>
                      {kpi.value}
                    </Typography>
                    {kpi.subtitle && (
                      <Typography variant="caption" sx={{ color: kpi.color, opacity: 0.75, mt: 0.25, display: 'block' }}>
                        {kpi.subtitle}
                      </Typography>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3}>
        {/* Revenue Trend Area Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight={700}>Revenue Received</Typography>
                  <Typography variant="caption" color="text.secondary">Monthly payment inflows · Jan–Jun 2026</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'success.main' }}>
                  <ArrowUpIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2" fontWeight={700} color="success.main">+31% vs last quarter</Typography>
                </Box>
              </Box>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={revenueTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.18} />
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.primary.main, 0.07)} vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={formatRevenue}
                    tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                    axisLine={false}
                    tickLine={false}
                    width={55}
                  />
                  <Tooltip content={<CustomAreaTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={theme.palette.primary.main}
                    strokeWidth={2.5}
                    fill="url(#revenueGradient)"
                    dot={{ fill: theme.palette.primary.main, r: 4, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Invoice Status Donut */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ mb: 1 }}>
                <Typography variant="h6" fontWeight={700}>Invoice Status</Typography>
                <Typography variant="caption" color="text.secondary">Current billing breakdown</Typography>
              </Box>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={invoiceStatus.filter((d) => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {invoiceStatus.filter((d) => d.value > 0).map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [`${value} invoice${value > 1 ? 's' : ''}`, name]}
                    contentStyle={{ borderRadius: 10, border: '1px solid rgba(26,75,140,0.1)', fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mt: 1 }}>
                {invoiceStatus.map((item) => (
                  <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color, flexShrink: 0 }} />
                      <Typography variant="caption" color="text.secondary">{item.name}</Typography>
                    </Box>
                    <Typography variant="caption" fontWeight={700}>{item.value}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pending Actions + PO Table */}
      <Grid container spacing={3}>
        {/* Pending Actions */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>Pending Actions</Typography>
                <Chip label={`${pendingActions.length} items`} size="small" color="warning" />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {pendingActions.map((action) => (
                  <Box
                    key={action.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: action.bg,
                      border: `1px solid ${alpha(action.color, 0.15)}`,
                    }}
                  >
                    <Box sx={{ color: action.color, flexShrink: 0 }}>{action.icon}</Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} sx={{ color: action.color, lineHeight: 1.3 }} noWrap>
                        {action.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: alpha(action.color, 0.7) }}>
                        {action.subtitle}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      data-testid={`btn-action-${action.id}`}
                      sx={{
                        flexShrink: 0,
                        bgcolor: action.color,
                        '&:hover': { bgcolor: alpha(action.color, 0.85) },
                        fontSize: '0.7rem',
                        px: 1.5,
                        py: 0.5,
                      }}
                    >
                      {action.action}
                    </Button>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent POs */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>Recent Purchase Orders</Typography>
                <Button
                  variant="text"
                  size="small"
                  startIcon={<TrendingUpIcon />}
                  data-testid="btn-view-all-pos"
                  sx={{ fontWeight: 600 }}
                >
                  View All
                </Button>
              </Box>
              <Box sx={{ overflowX: 'auto' }}>
                <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}` }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>PO Number</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {purchaseOrders.map((row) => (
                        <TableRow key={row.id} hover>
                          <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>{row.id}</TableCell>
                          <TableCell sx={{ color: 'text.secondary' }}>{row.date}</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>{row.amount}</TableCell>
                          <TableCell>
                            <Chip
                              label={statusConfig[row.status]?.label ?? row.status}
                              size="small"
                              color={statusConfig[row.status]?.color ?? 'default'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Invoice Summary */}
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle2">Invoice Summary</Typography>
                  <Button variant="outlined" size="small" startIcon={<AddIcon />} data-testid="btn-new-invoice">
                    New Invoice
                  </Button>
                </Box>
                <Grid container spacing={1}>
                  {[
                    { label: 'Pending Approval', value: '₹4.1L', count: '2 invoices', color: theme.palette.warning.main },
                    { label: 'Approved (Unpaid)', value: '₹4.1L', count: '2 invoices', color: theme.palette.info.main },
                    { label: 'Paid This Month', value: '₹3.6L', count: '1 invoice', color: theme.palette.success.main },
                  ].map((item) => (
                    <Grid item xs={4} key={item.label}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: alpha(item.color, 0.07),
                          border: `1px solid ${alpha(item.color, 0.15)}`,
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="h6" fontWeight={800} sx={{ color: item.color, lineHeight: 1 }}>
                          {item.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.25 }}>
                          {item.count}
                        </Typography>
                        <Typography variant="caption" sx={{ color: item.color, fontWeight: 600, fontSize: '0.65rem', display: 'block' }}>
                          {item.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Document Alerts */}
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 2,
          bgcolor: alpha(theme.palette.error.main, 0.05),
          border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
          borderLeft: `4px solid ${theme.palette.error.main}`,
        }}
      >
        <WarningIcon color="error" sx={{ mt: 0.25, flexShrink: 0 }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" color="error.main" gutterBottom>
            Document Compliance Alerts
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            <Chip
              label="GST Certificate — Expired Jun 20, 2026"
              size="small"
              color="error"
              variant="outlined"
              icon={<WarningIcon />}
            />
            <Chip
              label="Insurance Policy — Expiring Jul 15, 2026"
              size="small"
              color="warning"
              variant="outlined"
              icon={<WarningIcon />}
            />
          </Box>
        </Box>
        <Button variant="contained" color="error" size="small" data-testid="btn-manage-docs">
          Manage Docs
        </Button>
      </Paper>
    </Box>
  );
}
